import React from 'react';
import { AttendanceStatus, Student } from '../types/attendance';
import { Check, X, Clock, Edit2 } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface StudentCardProps {
  student: Student;
  status: AttendanceStatus;
  onStatusChange: (studentId: string, status: AttendanceStatus) => void;
  onEditStudent: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  status,
  onStatusChange,
  onEditStudent,
}) => {
  // Cycle status when photo is clicked: present -> absent -> leave -> present
  const handlePhotoClick = () => {
    let nextStatus: AttendanceStatus;
    if (status === 'present') {
      nextStatus = 'absent';
      soundManager.playAbsent();
    } else if (status === 'absent') {
      nextStatus = 'leave';
      soundManager.playLeave();
    } else {
      nextStatus = 'present';
      soundManager.playPresent();
    }
    onStatusChange(student.id, nextStatus);
  };

  const setSpecificStatus = (newStatus: AttendanceStatus, e: React.MouseEvent) => {
    e.stopPropagation();
    if (newStatus === 'present') soundManager.playPresent();
    else if (newStatus === 'absent') soundManager.playAbsent();
    else soundManager.playLeave();
    onStatusChange(student.id, newStatus);
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'present':
        return {
          label: 'હાજર',
          code: 'P',
          badgeBg: 'bg-emerald-600 text-white',
          borderRing: 'ring-3 ring-emerald-500 ring-offset-2',
          cardBorder: 'border-emerald-300 bg-white',
          icon: <Check className="w-4 h-4 stroke-[3]" />,
          glow: 'shadow-emerald-100',
        };
      case 'absent':
        return {
          label: 'ગેરહાજર',
          code: 'A',
          badgeBg: 'bg-rose-600 text-white',
          borderRing: 'ring-3 ring-rose-500 ring-offset-2',
          cardBorder: 'border-rose-300 bg-rose-50/20',
          icon: <X className="w-4 h-4 stroke-[3]" />,
          glow: 'shadow-rose-100',
        };
      case 'leave':
        return {
          label: 'રજા',
          code: 'L',
          badgeBg: 'bg-amber-500 text-white',
          borderRing: 'ring-3 ring-amber-400 ring-offset-2',
          cardBorder: 'border-amber-300 bg-amber-50/20',
          icon: <Clock className="w-4 h-4 stroke-[2.5]" />,
          glow: 'shadow-amber-100',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`group relative flex flex-col items-center rounded-xl border p-4 transition-all duration-150 hover:shadow-md ${config.cardBorder} ${config.glow}`}
    >
      {/* Top micro header: Roll No & Edit affordance */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-slate-800 text-white font-mono text-xs font-bold tabular-nums">
            {student.rollNo}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
          </span>
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEditStudent(student);
          }}
          title="વિગતો / ફોટો બદલો"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Interactive Photo Area - Core Feature */}
      <div className="relative my-1">
        <button
          type="button"
          onClick={handlePhotoClick}
          title="હાજરી બદલવા ફોટો પર ક્લિક કરો"
          aria-label={`${student.nameGu} ની હાજરી બદલો, વર્તમાન: ${config.label}`}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden transition-all duration-200 transform active:scale-95 cursor-pointer focus:outline-none ${config.borderRing}`}
        >
          <img
            src={student.photoUrl}
            alt={student.nameGu}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none pointer-events-none"
          />

          {/* Quick status stamp over the photo */}
          <div
            className={`absolute bottom-0 right-0 m-1 w-7 h-7 rounded-full flex items-center justify-center shadow-md ${config.badgeBg}`}
          >
            {config.icon}
          </div>

          {/* Hover instruction overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-1 text-center">
            <span className="text-[11px] font-bold leading-tight drop-shadow-sm">
              ક્લિક કરો
            </span>
            <span className="text-[9px] opacity-90 drop-shadow-sm">
              હાજરી બદલો
            </span>
          </div>
        </button>
      </div>

      {/* Student Details */}
      <div className="text-center mt-2.5 w-full">
        <h4 className="font-semibold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1">
          {student.nameGu}
        </h4>
        <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">
          {student.nameEn}
        </p>
        <p className="text-[11px] text-slate-400 mt-1 font-mono tabular-nums">
          G.R. નં: {student.grNo}
        </p>
      </div>

      {/* Segmented direct control buttons */}
      <div className="mt-3.5 w-full grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
        <button
          type="button"
          onClick={(e) => setSpecificStatus('present', e)}
          className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
            status === 'present'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-emerald-700 hover:bg-white/60'
          }`}
        >
          હાજર
        </button>
        <button
          type="button"
          onClick={(e) => setSpecificStatus('absent', e)}
          className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
            status === 'absent'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-rose-700 hover:bg-white/60'
          }`}
        >
          ગેરહાજર
        </button>
        <button
          type="button"
          onClick={(e) => setSpecificStatus('leave', e)}
          className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
            status === 'leave'
              ? 'bg-amber-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-amber-700 hover:bg-white/60'
          }`}
        >
          રજા
        </button>
      </div>
    </div>
  );
};
