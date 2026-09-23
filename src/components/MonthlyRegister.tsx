import React, { useState, useMemo } from 'react';
import { AttendanceStore, AttendanceStatus, SchoolInfo, Student } from '../types/attendance';
import { Download, Printer, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface MonthlyRegisterProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  attendanceStore: AttendanceStore;
  onUpdateDayStatus: (dateStr: string, studentId: string, status: AttendanceStatus) => void;
}

export const MonthlyRegister: React.FC<MonthlyRegisterProps> = ({
  students,
  schoolInfo,
  attendanceStore,
  onUpdateDayStatus,
}) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth()); // 0-indexed

  const monthNamesGu = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];

  // Calculate days in the selected month
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  const daysArray = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNum = i + 1;
      const dateObj = new Date(selectedYear, selectedMonth, dayNum);
      const isSunday = dateObj.getDay() === 0;
      const monthStr = String(selectedMonth + 1).padStart(2, '0');
      const dayStr = String(dayNum).padStart(2, '0');
      const dateKey = `${selectedYear}-${monthStr}-${dayStr}`;
      return {
        dayNum,
        isSunday,
        dateKey,
        dayOfWeek: dateObj.getDay(),
      };
    });
  }, [selectedYear, selectedMonth, daysInMonth]);

  // Working days count (excluding Sundays)
  const totalWorkingDays = useMemo(() => {
    return daysArray.filter((d) => !d.isSunday).length;
  }, [daysArray]);

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Toggle cell on click: P -> A -> L -> P
  const handleCellClick = (dateKey: string, studentId: string, isSunday: boolean) => {
    if (isSunday) return;
    const current = attendanceStore[dateKey]?.[studentId] || 'present';
    let next: AttendanceStatus;
    if (current === 'present') {
      next = 'absent';
      soundManager.playAbsent();
    } else if (current === 'absent') {
      next = 'leave';
      soundManager.playLeave();
    } else {
      next = 'present';
      soundManager.playPresent();
    }
    onUpdateDayStatus(dateKey, studentId, next);
  };

  // Calculate summary per student
  const studentStats = useMemo(() => {
    const stats: Record<string, { presentDays: number; absentDays: number; leaveDays: number; percentage: number }> = {};

    students.forEach((student) => {
      let present = 0;
      let absent = 0;
      let leave = 0;

      daysArray.forEach((d) => {
        if (!d.isSunday) {
          const status = attendanceStore[d.dateKey]?.[student.id] || 'present';
          if (status === 'present') present++;
          else if (status === 'absent') absent++;
          else if (status === 'leave') leave++;
        }
      });

      const percentage = totalWorkingDays > 0 ? Math.round((present / totalWorkingDays) * 100) : 0;
      stats[student.id] = { presentDays: present, absentDays: absent, leaveDays: leave, percentage };
    });

    return stats;
  }, [students, daysArray, attendanceStore, totalWorkingDays]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['રોલ નં', 'GR નં', 'વિદ્યાર્થીનું નામ', 'જાતિ', ...daysArray.map((d) => `${d.dayNum}${d.isSunday ? '(રવિ)' : ''}`), 'કુલ કાર્યકારી દિવસો', 'હાજરી દિવસો', 'ટકાવારી (%)'];
    const rows = students.map((s) => {
      const stats = studentStats[s.id];
      const dayValues = daysArray.map((d) => {
        if (d.isSunday) return 'રવિવાર';
        const st = attendanceStore[d.dateKey]?.[s.id] || 'present';
        return st === 'present' ? 'P' : st === 'absent' ? 'A' : 'L';
      });
      return [
        s.rollNo,
        s.grNo,
        `"${s.nameGu}"`,
        s.gender === 'boy' ? 'કુમાર' : 'કન્યા',
        ...dayValues,
        totalWorkingDays,
        stats?.presentDays || 0,
        `${stats?.percentage || 0}%`,
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Talavadi_School_Std6_Attendance_${monthNamesGu[selectedMonth]}_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Toolbar (hidden in print) */}
      <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-slate-50/70 no-print">
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2 shadow-2xs">
            <span className="text-emerald-700">{monthNamesGu[selectedMonth]}</span>
            <span>{selectedYear}</span>
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg shadow-2xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-500 ml-2">
            કુલ કાર્યકારી દિવસો: <strong className="font-mono text-slate-800">{totalWorkingDays}</strong>
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportToCSV}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            Excel / CSV ડાઉનલોડ
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            પત્રક પ્રિન્ટ કરો
          </button>
        </div>
      </div>

      {/* Official School Header for Print View */}
      <div className="p-4 border-b border-slate-200 text-center bg-white print:p-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          {schoolInfo.schoolNameGu}, તા. {schoolInfo.taluka}, જિ. {schoolInfo.district}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
          {schoolInfo.standard} {schoolInfo.section} - માસિક વિદ્યાર્થી હાજરી પત્રક | માસ:{' '}
          <span className="font-semibold text-slate-800">
            {monthNamesGu[selectedMonth]} {selectedYear}
          </span>{' '}
          | શૈક્ષણિક વર્ષ: {schoolInfo.academicYear}
        </p>
        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-1">
          <span>U-DISE કોડ: <strong className="font-mono">{schoolInfo.udiseCode}</strong></span>
          <span>વર્ગ શિક્ષક: <strong>{schoolInfo.classTeacher}</strong></span>
        </div>
      </div>

      {/* Main Register Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
              <th className="py-2 px-2 text-center border-r border-slate-200 w-10">રોલ</th>
              <th className="py-2 px-2 border-r border-slate-200 w-16">GR નં</th>
              <th className="py-2 px-3 border-r border-slate-200 min-w-[160px]">વિદ્યાર્થીનું નામ</th>
              <th className="py-2 px-2 text-center border-r border-slate-200 w-12">જાતિ</th>
              {/* Day numbers */}
              {daysArray.map((d) => (
                <th
                  key={d.dateKey}
                  className={`py-1 px-1 text-center border-r border-slate-200 min-w-[24px] max-w-[28px] ${
                    d.isSunday ? 'bg-rose-50 text-rose-700 font-bold' : ''
                  }`}
                  title={`${d.dayNum} તારીખ ${d.isSunday ? '(રવિવાર)' : ''}`}
                >
                  <div className="text-[11px] font-mono leading-none">{d.dayNum}</div>
                  <div className="text-[9px] font-normal opacity-75">
                    {d.isSunday ? 'રવિ' : ''}
                  </div>
                </th>
              ))}
              <th className="py-2 px-2 text-center border-r border-slate-200 font-mono w-14">હાજર</th>
              <th className="py-2 px-2 text-center font-mono w-14">ટકા %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-normal">
            {students.map((student, idx) => {
              const stats = studentStats[student.id];
              return (
                <tr
                  key={student.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    idx % 2 === 1 ? 'bg-slate-50/30' : 'bg-white'
                  }`}
                >
                  <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800 border-r border-slate-200 tabular-nums">
                    {student.rollNo}
                  </td>
                  <td className="py-1.5 px-2 font-mono text-slate-500 border-r border-slate-200 tabular-nums">
                    {student.grNo}
                  </td>
                  <td className="py-1.5 px-3 font-medium text-slate-900 border-r border-slate-200 whitespace-nowrap">
                    {student.nameGu}
                  </td>
                  <td className="py-1.5 px-2 text-center text-slate-500 border-r border-slate-200">
                    {student.gender === 'boy' ? 'કુ' : 'ક'}
                  </td>

                  {/* Day Status Cells */}
                  {daysArray.map((d) => {
                    if (d.isSunday) {
                      return (
                        <td
                          key={d.dateKey}
                          className="py-1 px-1 text-center bg-rose-50/50 text-rose-500 font-medium text-[11px] border-r border-slate-200 select-none"
                        >
                          H
                        </td>
                      );
                    }

                    const status = attendanceStore[d.dateKey]?.[student.id] || 'present';
                    let cellBg = 'text-emerald-700 hover:bg-emerald-100/60 font-semibold';
                    let label = 'P';
                    if (status === 'absent') {
                      cellBg = 'bg-rose-100 text-rose-700 font-bold hover:bg-rose-200';
                      label = 'A';
                    } else if (status === 'leave') {
                      cellBg = 'bg-amber-100 text-amber-700 font-bold hover:bg-amber-200';
                      label = 'L';
                    }

                    return (
                      <td
                        key={d.dateKey}
                        onClick={() => handleCellClick(d.dateKey, student.id, d.isSunday)}
                        title={`ક્લિક કરીને બદલો: ${label === 'P' ? 'હાજર' : label === 'A' ? 'ગેરહાજર' : 'રજા'}`}
                        className={`py-1 px-1 text-center border-r border-slate-200 cursor-pointer select-none transition-colors ${cellBg}`}
                      >
                        {label}
                      </td>
                    );
                  })}

                  <td className="py-1.5 px-2 text-center font-mono font-bold text-slate-800 border-r border-slate-200 tabular-nums">
                    {stats?.presentDays || 0}
                  </td>
                  <td className="py-1.5 px-2 text-center font-mono font-bold text-emerald-700 tabular-nums">
                    {stats?.percentage || 0}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend & Instructions */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 no-print">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-700">સંકેતો:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded flex items-center justify-center bg-white border border-emerald-300 text-emerald-700 font-bold">
              P
            </span>{' '}
            હાજર (Present)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded flex items-center justify-center bg-rose-100 border border-rose-300 text-rose-700 font-bold">
              A
            </span>{' '}
            ગેરહાજર (Absent)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded flex items-center justify-center bg-amber-100 border border-amber-300 text-amber-700 font-bold">
              L
            </span>{' '}
            રજા (Leave)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded flex items-center justify-center bg-rose-50 border border-rose-200 text-rose-500 font-bold">
              H
            </span>{' '}
            રવિવાર (Sunday)
          </span>
        </div>
        <p className="text-[11px] text-slate-500">
          * કોઈપણ તારીખના ખાના પર ક્લિક કરીને હાજરી સીધી બદલી શકો છો.
        </p>
      </div>

      {/* Signature line for official print */}
      <div className="hidden print:flex justify-between items-end p-8 mt-12 text-xs">
        <div className="text-center">
          <div className="w-36 border-b border-black mb-1"></div>
          <span>વર્ગ શિક્ષકની સહી</span>
        </div>
        <div className="text-center">
          <div className="w-36 border-b border-black mb-1"></div>
          <span>આચાર્યશ્રીની સહી અને સિક્કો</span>
        </div>
      </div>
    </div>
  );
};
