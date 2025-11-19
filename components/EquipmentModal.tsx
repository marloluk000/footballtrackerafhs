import { useState, useEffect } from 'react';
import { Player, Equipment } from '@/lib/types';
import { X, ChevronDown } from 'lucide-react';

interface EquipmentModalProps {
  player: Player;
  onClose: () => void;
  onUpdate: (playerId: string, equipment: Equipment, jerseyNumber?: number) => void;
}

const NEVER_RECEIVED_OPTIONS = [
  'Jersey - Red',
  'Jersey - Sophomore Red',
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

export default function EquipmentModal({ player, onClose, onUpdate }: EquipmentModalProps) {
  const isSophomore = player.grade?.toLowerCase().includes('so');
  const [equipment, setEquipment] = useState<Equipment>({
    ...player.equipment,
    customItems: player.equipment.customItems || [],
    neverReceived: player.equipment.neverReceived || []
  });
  const [jerseyNumber, setJerseyNumber] = useState<string>(player.number?.toString() || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [newCustomItem, setNewCustomItem] = useState<string>('');
  const [showNeverReceived, setShowNeverReceived] = useState(false);

  useEffect(() => {
    const equipmentChanged = JSON.stringify(equipment) !== JSON.stringify({
      ...player.equipment,
      customItems: player.equipment.customItems || [],
      neverReceived: player.equipment.neverReceived || []
    });
    const numberChanged = jerseyNumber !== (player.number?.toString() || '');
    setHasChanges(equipmentChanged || numberChanged);
  }, [equipment, player.equipment, jerseyNumber, player.number]);

  const addCustomItem = () => {
    if (newCustomItem.trim() && !equipment.customItems.includes(newCustomItem.trim())) {
      setEquipment(prev => ({
        ...prev,
        customItems: [...prev.customItems, newCustomItem.trim()]
      }));
      setNewCustomItem('');
    }
  };

  const removeCustomItem = (item: string) => {
    setEquipment(prev => ({
      ...prev,
      customItems: prev.customItems.filter(i => i !== item)
    }));
  };

  const toggleNeverReceivedItem = (label: string) => {
    setEquipment(prev => {
      const neverReceived = prev.neverReceived || [];
      const exists = neverReceived.includes(label);
      return {
        ...prev,
        neverReceived: exists
          ? neverReceived.filter(item => item !== label)
          : [...neverReceived, label]
      };
    });
  };

  const handleSave = () => {
    const num = jerseyNumber.trim() === '' ? undefined : parseInt(jerseyNumber);
    onUpdate(player.id, equipment, num);
    onClose();
  };

  const toggleEquipment = (category: string, item?: string) => {
    setEquipment(prev => {
      if (item) {
        // For nested objects (jersey, pants)
        if (category === 'jersey') {
          const itemKey = item as keyof Equipment['jersey'];
          return {
            ...prev,
            jersey: {
              ...prev.jersey,
              [itemKey]: !prev.jersey[itemKey]
            }
          };
        }
        if (category === 'pants') {
          const itemKey = item as keyof Equipment['pants'];
          return {
            ...prev,
            pants: {
              ...prev.pants,
              [itemKey]: !prev.pants[itemKey]
            }
          };
        }
        return prev;
      } else {
        // For single boolean values (helmet, guardian, etc.)
        const categoryKey = category as keyof Equipment;
        if (typeof prev[categoryKey] === 'boolean') {
          return {
            ...prev,
            [categoryKey]: !prev[categoryKey]
          };
        }
        return prev;
      }
    });
  };

  const CheckboxItem = ({ 
    label, 
    checked, 
    onChange,
    color 
  }: { 
    label: string; 
    checked: boolean; 
    onChange: () => void;
    color?: string;
  }) => {
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      onChange();
    };

    return (
      <div 
        onClick={handleClick}
        className="flex items-center space-x-3 cursor-pointer group"
      >
        <div className="relative">
          <input
            type="checkbox"
            checked={checked}
            onChange={() => {}}
            tabIndex={-1}
            className="sr-only"
          />
          <div className={`w-6 h-6 border-2 rounded-md transition-all ${
            checked 
              ? 'bg-green-500 border-green-500' 
              : 'border-gray-300 group-hover:border-gray-400'
          }`}>
            {checked && (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        <span className="text-gray-700 font-medium">{label}</span>
        {color && (
          <span 
            className="w-4 h-4 rounded-full border border-gray-300" 
            style={{ backgroundColor: color }}
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {player.number !== undefined ? `#${player.number} ` : ''}{player.name}
            </h2>
            <p className="text-red-100 text-sm mt-1">
              {player.grade} • {player.position || 'No Position'} • {player.height} • {player.weight}
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
          {/* Jersey Number Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jersey Number (Optional)
            </label>
            <input
              type="number"
              value={jerseyNumber}
              onChange={(e) => setJerseyNumber(e.target.value)}
              placeholder="Enter jersey number"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
              min="0"
              max="99"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if no jersey number assigned</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Jersey */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                Jersey
              </h3>
              <CheckboxItem
                label="Red"
                checked={equipment.jersey.red}
                onChange={() => toggleEquipment('jersey', 'red')}
                color="#DC2626"
              />
              {isSophomore && (
                <CheckboxItem
                  label="Sophomore Red"
                  checked={equipment.jersey.sophomoreRed}
                  onChange={() => toggleEquipment('jersey', 'sophomoreRed')}
                  color="#B91C1C"
                />
              )}
              <CheckboxItem
                label="Black"
                checked={equipment.jersey.black}
                onChange={() => toggleEquipment('jersey', 'black')}
                color="#000000"
              />
              <CheckboxItem
                label="White"
                checked={equipment.jersey.white}
                onChange={() => toggleEquipment('jersey', 'white')}
                color="#FFFFFF"
              />
            </div>

            {/* Pants */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                Pants
              </h3>
              <CheckboxItem
                label="Red"
                checked={equipment.pants.red}
                onChange={() => toggleEquipment('pants', 'red')}
                color="#DC2626"
              />
              <CheckboxItem
                label="Black"
                checked={equipment.pants.black}
                onChange={() => toggleEquipment('pants', 'black')}
                color="#000000"
              />
              <CheckboxItem
                label="White"
                checked={equipment.pants.white}
                onChange={() => toggleEquipment('pants', 'white')}
                color="#FFFFFF"
              />
            </div>

            {/* Belt */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                Belt
              </h3>
              <CheckboxItem
                label="Belt"
                checked={equipment.belt}
                onChange={() => toggleEquipment('belt')}
              />
            </div>

            {/* Other Equipment */}
            <div className="space-y-3 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                Other Equipment
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <CheckboxItem
                  label="Helmet"
                  checked={equipment.helmet}
                  onChange={() => toggleEquipment('helmet')}
                />
                <CheckboxItem
                  label="Guardian"
                  checked={equipment.guardian}
                  onChange={() => toggleEquipment('guardian')}
                />
                <CheckboxItem
                  label="Shoulder"
                  checked={equipment.shoulder}
                  onChange={() => toggleEquipment('shoulder')}
                />
                <CheckboxItem
                  label="Girdle"
                  checked={equipment.girdle}
                  onChange={() => toggleEquipment('girdle')}
                />
                <CheckboxItem
                  label="Knee"
                  checked={equipment.knee}
                  onChange={() => toggleEquipment('knee')}
                />
                <CheckboxItem
                  label="Practice Pants"
                  checked={equipment.practicePants}
                  onChange={() => toggleEquipment('practicePants')}
                />
              </div>
            </div>

            {/* Book */}
            <div className="space-y-3 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                Book
              </h3>
              <CheckboxItem
                label="Win in the Dark"
                checked={equipment.winInTheDark}
                onChange={() => toggleEquipment('winInTheDark')}
              />
            </div>

            {/* Custom Equipment Items */}
            <div className="space-y-3 md:col-span-2">
              <h3 className="text-lg font-bold text-gray-800 border-b-2 border-gray-200 pb-2">
                Custom Equipment Items
              </h3>
              <div className="space-y-3">
                {/* Add new custom item */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCustomItem}
                    onChange={(e) => setNewCustomItem(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCustomItem()}
                    placeholder="Enter custom equipment item..."
                    className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none"
                  />
                  <button
                    onClick={addCustomItem}
                    disabled={!newCustomItem.trim()}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
                {/* List of custom items */}
                {equipment.customItems.length > 0 && (
                  <div className="space-y-2">
                    {equipment.customItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-green-50 border-2 border-green-200 rounded-lg px-4 py-2"
                      >
                        <span className="text-gray-700 font-medium">{item}</span>
                        <button
                          onClick={() => removeCustomItem(item)}
                          className="text-red-600 hover:text-red-800 font-bold text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Never Received Dropdown */}
            <div className="md:col-span-2 border-2 border-gray-200 rounded-xl p-4 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowNeverReceived(prev => !prev)}
                className="w-full flex items-center justify-between text-left"
              >
                <div>
                  <p className="text-lg font-bold text-gray-800">Never Received Items</p>
                  <p className="text-sm text-gray-600">
                    {equipment.neverReceived?.length || 0} selected
                  </p>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-gray-600 transition-transform ${showNeverReceived ? 'rotate-180' : ''}`}
                />
              </button>
              {showNeverReceived && (
                <div className="mt-4 space-y-3">
                  {NEVER_RECEIVED_OPTIONS.map(option => {
                    const selected = equipment.neverReceived?.includes(option);
                    return (
                      <div
                        key={option}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleNeverReceivedItem(option);
                        }}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-sm font-medium text-gray-700">{option}</span>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => {}}
                          tabIndex={-1}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary pointer-events-none"
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex items-center justify-between border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              hasChanges
                ? 'bg-primary text-white hover:bg-red-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

