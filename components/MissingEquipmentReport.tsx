import { Player } from '@/lib/types';
import { X, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface MissingEquipmentReportProps {
  players: Player[];
  onClose: () => void;
}

export default function MissingEquipmentReport({ players, onClose }: MissingEquipmentReportProps) {
  const [copiedPlayerId, setCopiedPlayerId] = useState<string | null>(null);

  const getMissingEquipment = (player: Player) => {
    const missing: string[] = [];
    const equipment = player.equipment;

    // Check jerseys
    const neverReceivedSet = new Set(equipment.neverReceived || []);
    const isSophomore = player.grade?.toLowerCase().includes('so');
    const baseRequiredItems = [
      'Jersey - Red',
      'Jersey - Black',
      'Jersey - White',
      'Pants - Red',
      'Pants - Black',
      'Pants - White',
      'Helmet',
      'Guardian',
      'Shoulder',
      'Girdle',
      'Knee',
      'Practice Pants',
      'Belt',
      'Win in the Dark (Book)',
    ];
    const sophomoreRequiredItems = [
      'Jersey - Sophomore Red',
      'Jersey - White',
      'Pants - Red',
      'Helmet',
      'Guardian',
      'Shoulder',
      'Girdle',
      'Knee',
      'Practice Pants',
      'Belt',
      'Win in the Dark (Book)',
    ];
    const requiredSet = new Set(isSophomore ? sophomoreRequiredItems : baseRequiredItems);
    const considerItem = (condition: boolean, label: string) => {
      if (!requiredSet.has(label)) {
        return;
      }
      if (!condition && !neverReceivedSet.has(label)) {
        missing.push(label);
      }
    };

    considerItem(equipment.jersey.red, 'Jersey - Red');
    considerItem(equipment.jersey.black, 'Jersey - Black');
    considerItem(equipment.jersey.white, 'Jersey - White');
    considerItem(equipment.jersey.sophomoreRed, 'Jersey - Sophomore Red');

    // Check pants
    considerItem(equipment.pants.red, 'Pants - Red');
    considerItem(equipment.pants.black, 'Pants - Black');
    considerItem(equipment.pants.white, 'Pants - White');

    // Check belt
    considerItem(equipment.belt, 'Belt');

    // Check other equipment
    considerItem(equipment.helmet, 'Helmet');
    considerItem(equipment.guardian, 'Guardian');
    considerItem(equipment.shoulder, 'Shoulder');
    considerItem(equipment.girdle, 'Girdle');
    considerItem(equipment.knee, 'Knee');
    considerItem(equipment.practicePants, 'Practice Pants');

    // Check book
    considerItem(equipment.winInTheDark, 'Win in the Dark (Book)');

    return missing;
  };

  const playersWithMissingEquipment = players
    .map(player => ({
      player,
      missing: getMissingEquipment(player)
    }))
    .filter(item => item.missing.length > 0)
    .sort((a, b) => b.missing.length - a.missing.length);

  const formatMessageForPlayer = (player: Player, missing: string[]) => {
    return `Hi ${player.name},\n\nYou are missing the following equipment:\n\n${missing.map(item => `• ${item}`).join('\n')}\n\nPlease return these items as soon as possible.\n\nThank you!`;
  };

  const copyToClipboard = async (player: Player, missing: string[]) => {
    const message = formatMessageForPlayer(player, missing);
    try {
      await navigator.clipboard.writeText(message);
      setCopiedPlayerId(player.id);
      setTimeout(() => setCopiedPlayerId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTotalMissing = () => {
    return playersWithMissingEquipment.reduce((sum, item) => sum + item.missing.length, 0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Missing Equipment Report</h2>
            <p className="text-red-100 text-sm mt-1">
              {playersWithMissingEquipment.length} players with {getTotalMissing()} missing items
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {playersWithMissingEquipment.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">All Equipment Collected!</h3>
              <p className="text-gray-600">Every player has returned all their equipment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {playersWithMissingEquipment.map(({ player, missing }) => (
                <div
                  key={player.id}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-primary transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        #{player.number} {player.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {player.grade} • {player.position || 'No Position'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-red-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                        {missing.length} missing
                      </span>
                      <button
                        onClick={() => copyToClipboard(player, missing)}
                        className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        {copiedPlayerId === player.id ? (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copy Message</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Missing Items:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {missing.map((item, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start">
                          <span className="text-primary mr-2">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-1">Message Preview:</p>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">
                      {formatMessageForPlayer(player, missing)}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex items-center justify-end border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

