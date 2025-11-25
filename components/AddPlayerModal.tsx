import { useState } from 'react';
import { Player, defaultEquipment } from '@/lib/types';
import { X } from 'lucide-react';

interface AddPlayerModalProps {
  onClose: () => void;
  onAdd: (player: Omit<Player, 'id'>) => void;
}

export default function AddPlayerModal({ onClose, onAdd }: AddPlayerModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    name: '',
    studentId: '',
    grade: '',
    position: '',
    height: '',
    weight: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const player: Omit<Player, 'id'> = {
      number: formData.number ? parseInt(formData.number) : undefined,
      name: formData.name || 'Unnamed Player',
      studentId: formData.studentId || '',
      grade: formData.grade || '-',
      position: formData.position || '',
      height: formData.height || '-',
      weight: formData.weight || '-',
      equipment: { ...defaultEquipment },
    };

    onAdd(player);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="bg-primary text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-2xl font-bold">Add New Player</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Enter player name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              value={formData.studentId}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Enter student ID (optional)"
            />
            <p className="text-xs text-gray-500 mt-1">Optional but helpful for duplicate detection.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Jersey Number (Optional)
            </label>
            <input
              type="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              placeholder="Enter jersey number"
              min="0"
              max="99"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Grade
            </label>
            <select
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
            >
              <option value="">Select grade</option>
              <option value="Fr.">Freshman</option>
              <option value="So.">Sophomore</option>
              <option value="Jr.">Junior</option>
              <option value="Sr.">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Position
            </label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
              placeholder="e.g., QB, WR, RB"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Height
              </label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="e.g., 6'2\"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Weight
              </label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:outline-none"
                placeholder="e.g., 185 lbs"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              Add Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

