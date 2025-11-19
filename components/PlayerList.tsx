import { Player } from '@/lib/types';
import { getRequiredItemsForPlayer, isJerseyOnlyPlayer } from '@/lib/equipmentRequirements';
import { Check, X } from 'lucide-react';

interface PlayerListProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
}

export default function PlayerList({ players, onSelectPlayer }: PlayerListProps) {
  const getEquipmentProgress = (player: Player) => {
    const equipment = player.equipment;
    const neverReceivedSet = new Set(equipment.neverReceived || []);
    const requiredItems = getRequiredItemsForPlayer(player);
    const requiredSet = new Set(requiredItems);
    const trackCustomItems = !isJerseyOnlyPlayer(player);
    let total = 0;
    let completed = 0;

    const countItem = (isCompleted: boolean, label: string) => {
      if (!requiredSet.has(label)) {
        return;
      }
      if (neverReceivedSet.has(label)) {
        return;
      }
      total++;
      if (isCompleted) {
        completed++;
      }
    };

    // Count jersey items
    countItem(equipment.jersey.red, 'Jersey - Red');
    countItem(equipment.jersey.sophomoreRed, 'Jersey - Sophomore Red');
    countItem(equipment.jersey.black, 'Jersey - Black');
    countItem(equipment.jersey.white, 'Jersey - White');

    // Count pants items
    countItem(equipment.pants.red, 'Pants - Red');
    countItem(equipment.pants.black, 'Pants - Black');
    countItem(equipment.pants.white, 'Pants - White');

    // Count single items
    countItem(equipment.helmet, 'Helmet');
    countItem(equipment.guardian, 'Guardian');
    countItem(equipment.shoulder, 'Shoulder');
    countItem(equipment.girdle, 'Girdle');
    countItem(equipment.knee, 'Knee');
    countItem(equipment.practicePants, 'Practice Pants');
    countItem(equipment.belt, 'Belt');

    // Count book
    countItem(equipment.winInTheDark, 'Win in the Dark (Book)');

    // Count custom items (they're always "completed" since they're only added when returned)
    if (trackCustomItems) {
      const customItemsCount = (equipment.customItems || []).length;
      completed += customItemsCount;
      total += customItemsCount;
    }

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden md:table-cell">Grade</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 hidden lg:table-cell">Position</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Progress</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {players.map((player, index) => {
            const progress = getEquipmentProgress(player);
            const isComplete = progress.completed === progress.total;

            return (
              <tr
                key={`${player.id}-${index}`}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 text-sm font-bold text-gray-900">
                  {player.number !== undefined ? `#${player.number}` : '-'}
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">
                  {player.name}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 hidden md:table-cell">
                  {player.grade}
                </td>
                <td className="px-4 py-4 text-sm text-gray-600 hidden lg:table-cell">
                  {player.position || '-'}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[100px]">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isComplete ? 'bg-green-500' : 'bg-primary'
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 min-w-[50px]">
                      {progress.completed}/{progress.total}
                    </span>
                    {isComplete ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onSelectPlayer(player)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {players.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No players found matching your search.
        </div>
      )}
    </div>
  );
}

