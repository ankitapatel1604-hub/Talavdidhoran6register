import React, { useState } from 'react';
import { SchoolInfo, Student } from '../types/attendance';
import { Search, UserPlus, Edit2, Phone, Calendar, Download } from 'lucide-react';

interface StudentListViewProps {
  students: Student[];
  schoolInfo: SchoolInfo;
  onEditStudent: (student: Student) => void;
  onAddNewStudent: () => void;
}

export const StudentListView: React.FC<StudentListViewProps> = ({
  students,
  schoolInfo,
  onEditStudent,
  onAddNewStudent,
}) => {
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'boy' | 'girl'>('all');

  const filtered = students.filter((s) => {
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      s.nameGu.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      String(s.rollNo) === q ||
      s.grNo.includes(q);

    if (!matchesSearch) return false;
    if (genderFilter !== 'all' && s.gender !== genderFilter) return false;
    return true;
  });

  const exportStudentsCSV = () => {
    const headers = ['રોલ નં', 'GR નં', 'વિદ્યાર્થીનું પૂરું નામ', 'અંગ્રેજી નામ', 'જાતિ', 'જન્મ તારીખ', 'વાલીનો મોબાઈલ'];
    const rows = students.map((s) => [
      s.rollNo,
      s.grNo,
      `"${s.nameGu}"`,
      `"${s.nameEn}"`,
      s.gender === 'boy' ? 'કુમાર' : 'કન્યા',
      s.birthDate || '',
      s.parentContact || '',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Talavadi_School_Std6_Students_List.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top search & toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="નામ, રોલ નં અથવા GR નં શોધો..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg text-xs">
            <button
              onClick={() => setGenderFilter('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                genderFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600'
              }`}
            >
              બધા ({students.length})
            </button>
            <button
              onClick={() => setGenderFilter('boy')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                genderFilter === 'boy' ? 'bg-slate-800 text-white' : 'text-slate-600'
              }`}
            >
              કુમાર ({students.filter((s) => s.gender === 'boy').length})
            </button>
            <button
              onClick={() => setGenderFilter('girl')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                genderFilter === 'girl' ? 'bg-slate-800 text-white' : 'text-slate-600'
              }`}
            >
              કન્યા ({students.filter((s) => s.gender === 'girl').length})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportStudentsCSV}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            CSV ડાઉનલોડ
          </button>
          <button
            type="button"
            onClick={onAddNewStudent}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + નવો વિદ્યાર્થી
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3 text-center w-14">રોલ નં</th>
              <th className="py-2.5 px-3 w-16">ફોટો</th>
              <th className="py-2.5 px-3 w-20">GR નં</th>
              <th className="py-2.5 px-4 min-w-[180px]">વિદ્યાર્થીનું નામ</th>
              <th className="py-2.5 px-3 w-16 text-center">જાતિ</th>
              <th className="py-2.5 px-3">જન્મ તારીખ</th>
              <th className="py-2.5 px-3">વાલીનો મોબાઈલ</th>
              <th className="py-2.5 px-3 text-center w-20">એક્શન</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 px-3 text-center font-mono font-bold text-slate-800 tabular-nums">
                  {student.rollNo}
                </td>
                <td className="py-2 px-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 shadow-2xs">
                    <img
                      src={student.photoUrl}
                      alt={student.nameGu}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
                <td className="py-2 px-3 font-mono text-slate-600 tabular-nums">
                  {student.grNo}
                </td>
                <td className="py-2 px-4">
                  <div className="font-semibold text-slate-900 text-sm">{student.nameGu}</div>
                  <div className="text-[11px] text-slate-400 font-normal">{student.nameEn}</div>
                </td>
                <td className="py-2 px-3 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                      student.gender === 'boy'
                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                        : 'bg-pink-50 text-pink-700 border border-pink-100'
                    }`}
                  >
                    {student.gender === 'boy' ? 'કુમાર' : 'કન્યા'}
                  </span>
                </td>
                <td className="py-2 px-3 text-slate-600 font-mono text-xs">
                  {student.birthDate ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {student.birthDate}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="py-2 px-3 text-slate-600 font-mono text-xs">
                  {student.parentContact ? (
                    <a
                      href={`tel:${student.parentContact}`}
                      className="flex items-center gap-1 hover:text-emerald-600 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {student.parentContact}
                    </a>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="py-2 px-3 text-center">
                  <button
                    type="button"
                    onClick={() => onEditStudent(student)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="વિગતો / ફોટો બદલો"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
        <span>કુલ વિદ્યાર્થીઓ: <strong className="font-mono text-slate-800">{students.length}</strong></span>
        <span>શાળા: {schoolInfo.schoolNameGu} ({schoolInfo.taluka})</span>
      </div>
    </div>
  );
};
