import React, { useState, useMemo } from 'react';
import { DailyAttendanceRecord, Student } from '../types/attendance';
import { StudentCard } from './StudentCard';
import { DailySummaryStats } from './DailySummaryStats';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Info,
  RotateCcw
} from 'lucide-react';
import { formatGujaratiDate, getTodayDateStr } from '../utils/storage';

interface PhotoAttendanceGridProps {
  students: Student[];
  currentDate: string;
  onDateChange: (newDate: string) => void;
  attendanceRecord: DailyAttendanceRecord;
  onStatusChange: (studentId: string, status: 'present' | 'absent' | 'leave') => void;
  onMarkAll: (status: 'present' | 'absent') => void;
  onEditStudent: (student: Student) => void;
  onOpenReport: () => void;
}

export const PhotoAttendanceGrid: React.FC<PhotoAttendanceGridProps> = ({
  students,
  currentDate,
  onDateChange,
  attendanceRecord,
  onStatusChange,
  onMarkAll,
  onEditStudent,
  onOpenReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'boys' | 'girls' | 'absent' | 'present'>('all');

  const handlePrevDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleNextDay = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    onDateChange(`${y}-${m}-${day}`);
  };

  const handleToday = () => {
    onDateChange(getTodayDateStr());
  };

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search matching
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        s.nameGu.toLowerCase().includes(query) ||
        s.nameEn.toLowerCase().includes(query) ||
        String(s.rollNo) === query ||
        s.grNo.includes(query);

      if (!matchesSearch) return false;

      // Status matching
      const status = attendanceRecord[s.id] || 'present';
      if (filterType === 'boys') return s.gender === 'boy';
      if (filterType === 'girls') return s.gender === 'girl';
      if (filterType === 'absent') return status === 'absent';
      if (filterType === 'present') return status === 'present';

      return true;
    });
  }, [students, searchQuery, filterType, attendanceRecord]);

  const isToday = currentDate === getTodayDateStr();

  return (
    <div className="space-y-4">
      {/* Date Navigation & Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Date Selector */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button
              type="button"
              onClick={handlePrevDay}
              title="અગાઉનો દિવસ"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="relative flex items-center px-2">
              <Calendar className="w-4 h-4 text-emerald-600 mr-2 shrink-0" />
              <input
                type="date"
                value={currentDate}
                onChange={(e) => e.target.value && onDateChange(e.target.value)}
                className="bg-transparent text-sm font-semibold text-slate-800 cursor-pointer focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={handleNextDay}
              title="પછીનો દિવસ"
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-md transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              type="button"
              onClick={handleToday}
              className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              આજની તારીખ પર જાઓ
            </button>
          )}

          <div className="text-xs sm:text-sm font-medium text-slate-600 ml-1">
            {formatGujaratiDate(currentDate)}
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50/80 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Info className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>કોઈપણ વિદ્યાર્થીના ફોટા પર ક્લિક કરીને સીધી હાજરી બદલી શકાય છે.</span>
        </div>
      </div>

      {/* Daily Summary Statistics */}
      <DailySummaryStats
        students={students}
        currentAttendance={attendanceRecord}
        onMarkAll={onMarkAll}
        onOpenReport={onOpenReport}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Segmented Filter Buttons */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            બધા ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('boys')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'boys'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            કુમાર ({students.filter((s) => s.gender === 'boy').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('girls')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'girls'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            કન્યા ({students.filter((s) => s.gender === 'girl').length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType('absent')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'absent'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'text-rose-600 hover:text-rose-800'
            }`}
          >
            ગેરહાજર (
            {students.filter((s) => (attendanceRecord[s.id] || 'present') === 'absent').length}
            )
          </button>
          <button
            type="button"
            onClick={() => setFilterType('present')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              filterType === 'present'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-emerald-700 hover:text-emerald-900'
            }`}
          >
            હાજર (
            {students.filter((s) => (attendanceRecord[s.id] || 'present') === 'present').length}
            )
          </button>
        </div>

        {/* Search Input */}
        <div className="relative sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="રોલ નં અથવા નામ શોધો..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Student Photo Cards Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredStudents.map((student) => {
            const status = attendanceRecord[student.id] || 'present';
            return (
              <StudentCard
                key={student.id}
                student={student}
                status={status}
                onStatusChange={onStatusChange}
                onEditStudent={onEditStudent}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-slate-700 font-semibold text-base">કોઈ વિદ્યાર્થી મળ્યા નથી</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            તમારા શોધ કે ફિલ્ટર મુજબ કોઈ પરિણામ નથી. કૃપા કરીને શોધ શબ્દ અથવા ફિલ્ટર બદલો.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200"
          >
            બધા વિદ્યાર્થીઓ બતાવો
          </button>
        </div>
      )}
    </div>
  );
};
