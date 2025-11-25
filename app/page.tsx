'use client';

import { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Player } from '@/lib/types';
import { jerseyNumberOptions, normalizePlayerName } from '@/lib/jerseyNumbers';
import { initialPlayers } from '@/lib/initialPlayers';
import { getRequiredItemsForPlayer, shouldKeepPlayerEntriesSeparate } from '@/lib/equipmentRequirements';
import PlayerList from '@/components/PlayerList';
import EquipmentModal from '@/components/EquipmentModal';
import AddPlayerModal from '@/components/AddPlayerModal';
import MissingEquipmentReport from '@/components/MissingEquipmentReport';
import { Plus, Shield, ClipboardList, X, Download } from 'lucide-react';

const countTrue = (values: boolean[]) => values.filter(Boolean).length;

const getEquipmentScore = (player: Player) => {
  const equipment = player.equipment;
  if (!equipment) {
    return 0;
  }

  let score = 0;
  score += countTrue(Object.values(equipment.jersey));
  score += countTrue(Object.values(equipment.pants));
  score += countTrue([
    equipment.helmet,
    equipment.guardian,
    equipment.shoulder,
    equipment.girdle,
    equipment.knee,
    equipment.practicePants,
    equipment.belt,
    equipment.winInTheDark,
  ]);
  score += (equipment.customItems || []).length;
  return score;
};

const getPlayerQualityScore = (player: Player) => {
  let score = getEquipmentScore(player);
  if (player.number !== undefined && player.number !== null) score += 10;
  if (player.period) score += 2;
  if (player.grade && player.grade !== '-') score += 1;
  if (player.position) score += 1;
  return score;
};

const dedupePlayers = (playerList: Player[]) => {
  const uniquePlayers = new Map<string, Player>();

  playerList.forEach(player => {
    const normalizedName = normalizePlayerName(player.name);
    const studentKey = player.studentId?.trim();
    const allowSeparate = shouldKeepPlayerEntriesSeparate(player);
    let key = studentKey || normalizedName || player.id;
    if (allowSeparate) {
      const numberKey = player.number !== undefined && player.number !== null ? player.number : player.id;
      key = `${normalizedName || key}#${numberKey}`;
    }
    if (!key) {
      uniquePlayers.set(player.id, player);
      return;
    }
    const existing = uniquePlayers.get(key);
    if (!existing || getPlayerQualityScore(player) > getPlayerQualityScore(existing)) {
      uniquePlayers.set(key, player);
    }
  });

  return Array.from(uniquePlayers.values());
};

export default function Home() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMissingReport, setShowMissingReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string>('');
  const [positionFilter, setPositionFilter] = useState<string>('');
  const [periodFilter, setPeriodFilter] = useState<string>('');
  const [loadingProgress, setLoadingProgress] = useState({ current: 0, total: 0 });
  const initializationInProgress = useRef(false);
  const jerseyAssignmentInProgress = useRef(false);

  // Initialize players in Firestore if needed
  useEffect(() => {
    const playersRef = collection(db, 'players');
    let hasInitialized = false;
    
    // Subscribe to players collection - this is fast and non-blocking
    const unsubscribe = onSnapshot(playersRef, (snapshot) => {
      const existingPlayers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Player[];

      const dedupedPlayers = dedupePlayers(existingPlayers);
      setPlayers(dedupedPlayers);
      setFilteredPlayers(dedupedPlayers);
      
      // Only set loading to false once we have some players or confirmed we're done
      if (existingPlayers.length > 0 || !initializing) {
        setLoading(false);
      }

      // Always check and update players missing period field (runs once)
      if (!hasInitialized) {
        hasInitialized = true;
        initializationInProgress.current = true;
        setInitializing(true);
        
        // Run initialization asynchronously without blocking
        (async () => {
          try {
            // First, update existing players that are missing the period field
            const playersToUpdate: Array<{ docId: string; period: string }> = [];
            existingPlayers.forEach(existingPlayer => {
              if (!existingPlayer.period) {
                // Find matching player in initialPlayers by studentId or name
                const match = initialPlayers.find(p => 
                  p.studentId === existingPlayer.studentId || 
                  p.name.toLowerCase().trim() === existingPlayer.name.toLowerCase().trim()
                );
                if (match && match.period) {
                  const docId = existingPlayer.id;
                  playersToUpdate.push({ docId, period: match.period });
                }
              }
            });
            
            // Update existing players with period field
            if (playersToUpdate.length > 0) {
              console.log(`Updating ${playersToUpdate.length} players with period field...`);
              const updateBatch = writeBatch(db);
              playersToUpdate.forEach(({ docId, period }) => {
                const docRef = doc(playersRef, docId);
                updateBatch.update(docRef, { period });
              });
              await updateBatch.commit();
              console.log(`Successfully updated ${playersToUpdate.length} players with period`);
            }
            
            // Then, check for missing players to add
            const existingStudentIds = new Set(
              existingPlayers
                .map(p => p.studentId)
                .filter((id): id is string => !!id)
            );
            
            const existingNames = new Set(
              existingPlayers.map(p => p.name.toLowerCase().trim())
            );
            
            const playersToAdd = initialPlayers.filter(p => 
              !existingStudentIds.has(p.studentId) && 
              !existingNames.has(p.name.toLowerCase().trim())
            );
            
            if (playersToAdd.length > 0) {
              console.log(`Adding ${playersToAdd.length} missing players...`);
              setLoadingProgress({ current: existingPlayers.length, total: initialPlayers.length });
              
              // Use maximum batch size for fastest writes
              const batchSize = 500; // Firestore max per batch
              const totalBatches = Math.ceil(playersToAdd.length / batchSize);
              
              // Process all batches in parallel for maximum speed
              const batchPromises = [];
              for (let i = 0; i < playersToAdd.length; i += batchSize) {
                const batch = playersToAdd.slice(i, i + batchSize);
                const batchIndex = Math.floor(i / batchSize);
                
                const batchPromise = (async () => {
                  const batchRef = writeBatch(db);
                  batch.forEach(player => {
                    const docRef = doc(playersRef);
                    batchRef.set(docRef, player);
                  });
                  await batchRef.commit();
                  
                  // Update progress
                  const currentCount = existingPlayers.length + Math.min((batchIndex + 1) * batchSize, playersToAdd.length);
                  setLoadingProgress({ current: currentCount, total: initialPlayers.length });
                })();
                
                batchPromises.push(batchPromise);
              }
              
              // Wait for all batches to complete
              await Promise.all(batchPromises);
              
              console.log(`Successfully added ${playersToAdd.length} players`);
              setLoadingProgress({ current: initialPlayers.length, total: initialPlayers.length });
            }
            
            setInitializing(false);
            setLoading(false);
            initializationInProgress.current = false;
          } catch (error) {
            console.error('Error initializing players:', error);
            setInitializing(false);
            setLoading(false);
            initializationInProgress.current = false;
          }
        })();
      } else if (initializing) {
        setInitializing(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter players based on search query and filters
  useEffect(() => {
    let filtered = [...players];
    const hasGrade = (player: Player) => player.grade && player.grade !== '-' && player.grade.trim() !== '';
    const isUnknownGrade = (player: Player) => !hasGrade(player);

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(player => {
        const matchesName = player.name.toLowerCase().includes(query);
        const matchesNumber = player.number?.toString().includes(query) || false;
        const matchesStudentId = player.studentId.includes(query);
        return matchesName || matchesNumber || matchesStudentId;
      });
    }

    // Apply position filter
    if (positionFilter) {
      filtered = filtered.filter(player => 
        player.position.toLowerCase().includes(positionFilter.toLowerCase())
      );
    }

    // Apply period filter
    if (periodFilter) {
      filtered = filtered.filter(player => {
        const matches = player.period === periodFilter;
        if (!matches && player.period) {
          console.log(`Period mismatch: player "${player.name}" has period "${player.period}" but filter is "${periodFilter}"`);
        }
        return matches;
      });
      console.log(`Period filter "${periodFilter}": ${filtered.length} players found`);
    }

    // Apply grade filter
    if (gradeFilter) {
      // When a specific grade is selected, filter by that grade
      filtered = filtered.filter(player => player.grade === gradeFilter);
    } else {
      // When "All Grades" is selected, include everyone (graded and unknown) mixed together
      // No additional filtering needed - already have all players
    }

    // Sort: always by period first (if period filter is active or players have periods), then alphabetically by name
    filtered.sort((a, b) => {
      const periodA = a.period || '';
      const periodB = b.period || '';
      // If period filter is active or both players have periods, sort by period first
      if (periodFilter || (periodA && periodB)) {
        if (periodA !== periodB) {
          return periodA.localeCompare(periodB);
        }
      }
      return a.name.localeCompare(b.name);
    });

    setFilteredPlayers(filtered);
  }, [searchQuery, players, gradeFilter, positionFilter, periodFilter]);

  // Get players without grades - only show separately when a specific grade filter is active
  // Also apply search and position filters to unknown grade players
  const unknownGradePlayers = gradeFilter 
    ? (() => {
        let filtered = players.filter(player => {
          const hasGrade = player.grade && player.grade !== '-' && player.grade.trim() !== '';
          return !hasGrade;
        });

        // Apply search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          filtered = filtered.filter(player => {
            const matchesName = player.name.toLowerCase().includes(query);
            const matchesNumber = player.number?.toString().includes(query) || false;
            const matchesStudentId = player.studentId.includes(query);
            return matchesName || matchesNumber || matchesStudentId;
          });
        }

        // Apply position filter
        if (positionFilter) {
          filtered = filtered.filter(player => 
            player.position.toLowerCase().includes(positionFilter.toLowerCase())
          );
        }

        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      })()
    : [];

  useEffect(() => {
    if (players.length === 0 || jerseyAssignmentInProgress.current) {
      return;
    }

    const existingAssignments = new Map<string, Set<number>>();
    players.forEach(player => {
      const normalized = normalizePlayerName(player.name);
      if (!normalized) {
        return;
      }
      if (!existingAssignments.has(normalized)) {
        existingAssignments.set(normalized, new Set());
      }
      if (player.number !== undefined && player.number !== null) {
        existingAssignments.get(normalized)?.add(player.number);
      }
    });

    const playersNeedingNumbers = new Map<string, number>();

    players.forEach(player => {
      if (player.number === undefined || player.number === null) {
        const normalized = normalizePlayerName(player.name);
        if (!normalized) {
          return;
        }
        const options = jerseyNumberOptions[normalized];
        if (!options || options.length === 0) {
          return;
        }
        const taken = existingAssignments.get(normalized) ?? new Set<number>();
        const available = options.find(num => !taken.has(num));
        if (available === undefined) {
          return;
        }
        playersNeedingNumbers.set(player.id, available);
        taken.add(available);
        existingAssignments.set(normalized, taken);
      }
    });

    if (playersNeedingNumbers.size === 0) {
      return;
    }

    jerseyAssignmentInProgress.current = true;

    (async () => {
      try {
        const playersRef = collection(db, 'players');
        const batch = writeBatch(db);
        playersNeedingNumbers.forEach((number, docId) => {
          const docRef = doc(playersRef, docId);
          batch.update(docRef, { number });
        });
        await batch.commit();
      } catch (error) {
        console.error('Error assigning jersey numbers:', error);
      } finally {
        jerseyAssignmentInProgress.current = false;
      }
    })();
  }, [players]);

  const handleUpdateEquipment = async (playerId: string, equipment: any, jerseyNumber?: number) => {
    try {
      const playerRef = doc(db, 'players', playerId);
      const updateData: any = { equipment };
      if (jerseyNumber !== undefined) {
        updateData.number = jerseyNumber || null;
      }
      await updateDoc(playerRef, updateData);
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  const handleAddPlayer = async (player: Omit<Player, 'id'>) => {
    try {
      await addDoc(collection(db, 'players'), player);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding player:', error);
    }
  };

  const handleExport = () => {
    // Helper function to get missing equipment for a player
    const getMissingEquipment = (player: Player): string[] => {
      const missing: string[] = [];
      const equipment = player.equipment;
      const neverReceivedSet = new Set(equipment.neverReceived || []);
      const requiredItems = getRequiredItemsForPlayer(player);
      const requiredSet = new Set(requiredItems);
      
      const checkItem = (has: boolean, label: string) => {
        if (requiredSet.has(label) && !has && !neverReceivedSet.has(label)) {
          missing.push(label);
        }
      };
      
      checkItem(equipment.jersey.red, 'Jersey - Red');
      checkItem(equipment.jersey.sophomoreRed, 'Jersey - Sophomore Red');
      checkItem(equipment.jersey.black, 'Jersey - Black');
      checkItem(equipment.jersey.white, 'Jersey - White');
      checkItem(equipment.pants.red, 'Pants - Red');
      checkItem(equipment.pants.black, 'Pants - Black');
      checkItem(equipment.pants.white, 'Pants - White');
      checkItem(equipment.helmet, 'Helmet');
      checkItem(equipment.guardian, 'Guardian');
      checkItem(equipment.shoulder, 'Shoulder');
      checkItem(equipment.girdle, 'Girdle');
      checkItem(equipment.knee, 'Knee');
      checkItem(equipment.practicePants, 'Practice Pants');
      checkItem(equipment.belt, 'Belt');
      checkItem(equipment.winInTheDark, 'Win in the Dark (Book)');
      
      return missing;
    };

    // Calculate stats and categorize players
    const completePlayers = players.filter(p => getMissingEquipment(p).length === 0);
    const incompletePlayers = players.filter(p => getMissingEquipment(p).length > 0);
    
    // Sort incomplete by most missing items first
    incompletePlayers.sort((a, b) => 
      getMissingEquipment(b).length - getMissingEquipment(a).length
    );

    // Build CSV with sections
    const csvLines: string[] = [];
    
    // === SUMMARY SECTION ===
    csvLines.push('AFHS FOOTBALL EQUIPMENT INVENTORY REPORT');
    csvLines.push(`Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`);
    csvLines.push('');
    csvLines.push('=== SUMMARY ===');
    csvLines.push(`Total Players,${players.length}`);
    csvLines.push(`Complete (All Equipment Returned),${completePlayers.length}`);
    csvLines.push(`Incomplete (Missing Equipment),${incompletePlayers.length}`);
    csvLines.push(`Completion Rate,${Math.round((completePlayers.length / players.length) * 100)}%`);
    csvLines.push('');
    csvLines.push('');
    
    // === INCOMPLETE PLAYERS SECTION ===
    csvLines.push('=== PLAYERS WITH MISSING EQUIPMENT ===');
    csvLines.push('Name,Student ID,Jersey #,Grade,Position,Period,Missing Count,Missing Items');
    
    incompletePlayers.forEach(player => {
      const missing = getMissingEquipment(player);
      csvLines.push([
        `"${player.name}"`,
        player.studentId,
        player.number || '',
        player.grade,
        `"${player.position}"`,
        player.period || '',
        missing.length,
        `"${missing.join('; ')}"`
      ].join(','));
    });
    
    csvLines.push('');
    csvLines.push('');
    
    // === COMPLETE PLAYERS SECTION ===
    csvLines.push('=== PLAYERS WITH ALL EQUIPMENT RETURNED ===');
    csvLines.push('Name,Student ID,Jersey #,Grade,Position,Period');
    
    completePlayers.forEach(player => {
      csvLines.push([
        `"${player.name}"`,
        player.studentId,
        player.number || '',
        player.grade,
        `"${player.position}"`,
        player.period || ''
      ].join(','));
    });
    
    csvLines.push('');
    csvLines.push('');
    
    // === DETAILED EQUIPMENT MATRIX ===
    csvLines.push('=== DETAILED EQUIPMENT CHECKLIST ===');
    const headers = [
      'Name', 'Student ID', 'Jersey #', 'Grade', 'Position', 'Period', 'Status',
      'Red Jersey', 'Soph Red Jersey', 'Black Jersey', 'White Jersey',
      'Red Pants', 'Black Pants', 'White Pants',
      'Helmet', 'Guardian', 'Shoulder Pads', 'Girdle', 'Knee Pads',
      'Practice Pants', 'Belt', 'Win in the Dark',
      'Custom Items', 'Never Received'
    ];
    csvLines.push(headers.join(','));
    
    players.forEach(player => {
      const eq = player.equipment;
      const missing = getMissingEquipment(player);
      const status = missing.length === 0 ? 'COMPLETE' : `MISSING ${missing.length}`;
      
      csvLines.push([
        `"${player.name}"`,
        player.studentId,
        player.number || '',
        player.grade,
        `"${player.position}"`,
        player.period || '',
        status,
        eq.jersey.red ? 'YES' : 'NO',
        eq.jersey.sophomoreRed ? 'YES' : 'NO',
        eq.jersey.black ? 'YES' : 'NO',
        eq.jersey.white ? 'YES' : 'NO',
        eq.pants.red ? 'YES' : 'NO',
        eq.pants.black ? 'YES' : 'NO',
        eq.pants.white ? 'YES' : 'NO',
        eq.helmet ? 'YES' : 'NO',
        eq.guardian ? 'YES' : 'NO',
        eq.shoulder ? 'YES' : 'NO',
        eq.girdle ? 'YES' : 'NO',
        eq.knee ? 'YES' : 'NO',
        eq.practicePants ? 'YES' : 'NO',
        eq.belt ? 'YES' : 'NO',
        eq.winInTheDark ? 'YES' : 'NO',
        `"${(eq.customItems || []).join('; ')}"`,
        `"${(eq.neverReceived || []).join('; ')}"`,
      ].join(','));
    });

    // Generate and download CSV
    const csv = csvLines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AFHS-Equipment-Report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading || initializing) {
    const progressPercentage = loadingProgress.total > 0 
      ? Math.round((loadingProgress.current / loadingProgress.total) * 100)
      : 0;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-gray-100">
        <div className="text-center max-w-md w-full px-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-semibold mb-2">
            {initializing ? 'Initializing players...' : 'Loading players...'}
          </p>
          {loadingProgress.total > 0 && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <p className="text-gray-500 text-sm">
                {loadingProgress.current} / {loadingProgress.total} players
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-10 w-10" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">AFHS Football</h1>
                <p className="text-red-100 text-sm">Equipment Inventory Tracker</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-white text-primary px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-red-50 transition-colors shadow-md"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">Add Player</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        <input
          type="text"
          placeholder="Search by name, jersey number, or student ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-6 py-4 text-lg rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none shadow-sm"
        />
        
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm font-medium"
          >
            <option value="">All Grades</option>
            <option value="Fr.">Freshman</option>
            <option value="So.">Sophomore</option>
            <option value="Jr.">Junior</option>
            <option value="Sr.">Senior</option>
          </select>

          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm font-medium"
          >
            <option value="">All Periods</option>
            <option value="Period 1">Period 1</option>
            <option value="Period 2">Period 2</option>
            <option value="Period 5">Period 5</option>
          </select>

          <input
            type="text"
            placeholder="Filter by position..."
            value={positionFilter}
            onChange={(e) => setPositionFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none text-sm"
          />

          {(gradeFilter || positionFilter || periodFilter) && (
            <button
              onClick={() => {
                setGradeFilter('');
                setPositionFilter('');
                setPeriodFilter('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-300 transition-colors flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Player List */}
      <div className="max-w-7xl mx-auto px-4 pb-8 space-y-6">
        {/* Main Filtered Players */}
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="mb-4 flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              Players ({filteredPlayers.length})
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-green-700 transition-colors shadow-md"
              >
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </button>
              <button
                onClick={() => setShowMissingReport(true)}
                className="bg-primary text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-red-700 transition-colors shadow-md"
              >
                <ClipboardList className="h-5 w-5" />
                <span className="hidden sm:inline">Missing Equipment</span>
                <span className="sm:hidden">Missing</span>
              </button>
            </div>
          </div>
          <PlayerList
            players={filteredPlayers}
            onSelectPlayer={setSelectedPlayer}
          />
        </div>

        {/* Unknown Grade Players Section - Only shown when a specific grade filter is active */}
        {unknownGradePlayers.length > 0 && (
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl shadow-lg p-4">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <span>Unknown Grade ({unknownGradePlayers.length})</span>
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Players without a grade assigned.
              </p>
            </div>
            <PlayerList
              players={unknownGradePlayers}
              onSelectPlayer={setSelectedPlayer}
            />
          </div>
        )}
      </div>

      {/* Equipment Modal */}
      {selectedPlayer && (
        <EquipmentModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onUpdate={(playerId, equipment, jerseyNumber) => handleUpdateEquipment(playerId, equipment, jerseyNumber)}
        />
      )}

      {/* Add Player Modal */}
      {showAddModal && (
        <AddPlayerModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddPlayer}
        />
      )}

      {/* Missing Equipment Report */}
      {showMissingReport && (
        <MissingEquipmentReport
          players={players}
          onClose={() => setShowMissingReport(false)}
        />
      )}
    </div>
  );
}

