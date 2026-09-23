import React from 'react';
import { DailyAttendanceRecord, Student } from '../types/attendance';
import { CheckCircle2, XCircle, Clock, Users, UserCheck } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface DailySummaryStatsProps {
  students: Student[];
  currentAttendance: DailyAttendanceRecord;
  onMarkAll: (status: 'present' | 'absent') => void;
  onOpenReport: () => void;
}

export const DailySummaryStats: React.FC<DailySummaryStatsProps> = ({
  students,
  currentAttendance,
  onMarkAll,
  onOpenReport,
}) => {
  const totalCount = students.length;
  const boysCount = students.filter((s) => s.gender === 'boy').length;
  const girlsCount = students.filter((s) => s.gender === 'girl').length;

  let presentCount = 0;
  let absentCount = 0;
  let leaveCount = 0;
  let presentBoys = 0;
  let presentGirls = 0;

  students.forEach((student) => {
    const status = currentAttendance[student.id] || 'present';
    if (status === 'present') {
      presentCount++;
      if (student.gender === 'boy') presentBoys++;
      else presentGirls++;
    } else if (status === 'absent') {
      absentCount++;
    } else if (status === 'leave') {
      leaveCount++;
    }
  });

  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleAllPresent = () => {
    soundManager.playPresent();
    onMarkAll('present');
  };

  const handleAllAbsent = () => {
    soundManager.playAbsent();
    onMarkAll('absent');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          {/* Total Students */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">કુલ વિદ્યાર્થી</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-slate-800 tabular-nums">
                  {totalCount}
                </span>
                <span className="text-[11px] text-slate-500">
                  (કુ: {boysCount}, ક: {girlsCount})
                </span>
              </div>
            </div>
          </div>

          {/* Present Count */}
          <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-800 font-medium">હાજર</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-emerald-700 tabular-nums">
                  {presentCount}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">
                  ({percentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Absent Count */}
          <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-rose-800 font-medium">ગેરહાજર</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-rose-700 tabular-nums">
                  {absentCount}
                </span>
                {absentCount > 0 && (
                  <span className="text-[11px] text-rose-600 font-medium">
                    (કુ: {students.filter(s => s.gender === 'boy' && currentAttendance[s.id] === 'absent').length}, ક: {students.filter(s => s.gender === 'girl' && currentAttendance[s.id] === 'absent').length})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Leave Count */}
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-800 font-medium">રજા પર</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold font-mono text-amber-700 tabular-nums">
                  {leaveCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 lg:border-l lg:border-slate-100 lg:pl-4">
          <button
            type="button"
            onClick={handleAllPresent}
            className="px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            બધા હાજર
          </button>

          <button
            type="button"
            onClick={handleAllAbsent}
            className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <XCircle className="w-4 h-4 text-rose-600" />
            બધા ગેરહાજર
          </button>

          <button
            type="button"
            onClick={onOpenReport}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            અહેવાલ & મેસેજ
          </button>
        </div>
      </div>
    </div>
  );
};
