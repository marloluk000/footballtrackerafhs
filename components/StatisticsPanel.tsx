import { Player } from '@/lib/types';
import { BarChart3, Users, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { useState } from 'react';

interface StatisticsPanelProps {
  players: Player[];
  onClose: () => void;
  onExport: () => void;
}

export default function StatisticsPanel({ players, onClose, onExport }: StatisticsPanelProps) {
  const getEquipmentProgress = (player: Player) => {
    const equipment = player.equipment;
    let total = 0;
    let completed = 0;

    // Count jersey items
    if (equipment.jersey.red) completed++;
    if (equipment.jersey.black) completed++;
    if (equipment.jersey.white) completed++;
    total += 3;

    // Count pants items
    if (equipment.pants.red) completed++;
    if (equipment.pants.black) completed++;
    if (equipment.pants.white) completed++;
    total += 3;

    // Count single items
    if (equipment.helmet) completed++;
    if (equipment.guardian) completed++;
    if (equipment.shoulder) completed++;
    if (equipment.girdle) completed++;
    if (equipment.knee) completed++;
    if (equipment.practicePants) completed++;
    if (equipment.belt) completed++;
    total += 7;

    // Count book
    if (equipment.winInTheDark) completed++;
    total += 1;

    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const stats = {
    total: players.length,
    complete: players.filter(p => {
      const progress = getEquipmentProgress(p);
      return progress.completed === progress.total;
    }).length,
    incomplete: players.filter(p => {
      const progress = getEquipmentProgress(p);
      return progress.completed < progress.total;
    }).length,
    averageProgress: Math.round(
      players.reduce((sum, p) => sum + getEquipmentProgress(p).percentage, 0) / players.length || 0
    ),
    byGrade: {
      'Fr.': players.filter(p => p.grade === 'Fr.').length,
      'So.': players.filter(p => p.grade === 'So.').length,
      'Jr.': players.filter(p => p.grade === 'Jr.').length,
      'Sr.': players.filter(p => p.grade === 'Sr.').length,
    },
    withJerseyNumbers: players.filter(p => p.number !== undefined).length,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Statistics Dashboard</h2>
              <p className="text-red-100 text-sm mt-1">Equipment tracking overview</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-red-700 rounded-full p-2 transition-colors"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Stats */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border-2 border-red-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Overall</span>
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Players</span>
                  <span className="text-2xl font-bold text-primary">{stats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Complete</span>
                  <span className="text-2xl font-bold text-green-600">{stats.complete}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Incomplete</span>
                  <span className="text-2xl font-bold text-orange-600">{stats.incomplete}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Avg. Progress</span>
                  <span className="text-2xl font-bold text-primary">{stats.averageProgress}%</span>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">By Grade</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Freshmen</span>
                  <span className="text-xl font-bold text-blue-600">{stats.byGrade['Fr.']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sophomores</span>
                  <span className="text-xl font-bold text-blue-600">{stats.byGrade['So.']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Juniors</span>
                  <span className="text-xl font-bold text-blue-600">{stats.byGrade['Jr.']}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Seniors</span>
                  <span className="text-xl font-bold text-blue-600">{stats.byGrade['Sr.']}</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="md:col-span-2 bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Overall Completion</h3>
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-8">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-500"
                    style={{ width: `${stats.averageProgress}%` }}
                  >
                    {stats.averageProgress > 10 && `${stats.averageProgress}%`}
                  </div>
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>{stats.complete} players complete</span>
                  <span>{stats.incomplete} players incomplete</span>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="md:col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Additional Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700">Players with Jersey Numbers:</span>
                  <span className="font-bold text-purple-600">{stats.withJerseyNumbers}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                  <span className="text-gray-700">Players without Jersey Numbers:</span>
                  <span className="font-bold text-purple-600">{stats.total - stats.withJerseyNumbers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-6 flex items-center justify-between border-t-2 border-gray-200">
          <button
            onClick={onExport}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </button>
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

