import React, { useState } from 'react';
import { DailyAttendanceRecord, SchoolInfo, Student } from '../types/attendance';
import { formatGujaratiDate } from '../utils/storage';
import { Share2, Copy, Check, MessageSquare, Phone, X, FileText } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  currentDate: string;
  attendanceRecord: DailyAttendanceRecord;
  schoolInfo: SchoolInfo;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  students,
  currentDate,
  attendanceRecord,
  schoolInfo,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalCount = students.length;
  const boysCount = students.filter((s) => s.gender === 'boy').length;
  const girlsCount = students.filter((s) => s.gender === 'girl').length;

  const presentStudents = students.filter(
    (s) => (attendanceRecord[s.id] || 'present') === 'present'
  );
  const absentStudents = students.filter(
    (s) => (attendanceRecord[s.id] || 'present') === 'absent'
  );
  const leaveStudents = students.filter(
    (s) => (attendanceRecord[s.id] || 'present') === 'leave'
  );

  const presentBoys = presentStudents.filter((s) => s.gender === 'boy').length;
  const presentGirls = presentStudents.filter((s) => s.gender === 'girl').length;
  const percentage = totalCount > 0 ? Math.round((presentStudents.length / totalCount) * 100) : 0;

  // Generate WhatsApp formatted text
  const generateMessageText = () => {
    let msg = `*${schoolInfo.schoolNameGu}, તા. ${schoolInfo.taluka}*\n`;
    msg += `*${schoolInfo.standard} ${schoolInfo.section} - દૈનિક હાજરી અહેવાલ*\n`;
    msg += `તારીખ: ${formatGujaratiDate(currentDate)}\n`;
    msg += `---------------------------------\n`;
    msg += `કુલ સંખ્યા: ${totalCount} (કુમાર: ${boysCount}, કન્યા: ${girlsCount})\n`;
    msg += `આજે હાજર: ${presentStudents.length} (કુમાર: ${presentBoys}, કન્યા: ${presentGirls})\n`;
    msg += `આજે ગેરહાજર: ${absentStudents.length}\n`;
    if (leaveStudents.length > 0) {
      msg += `રજા પર: ${leaveStudents.length}\n`;
    }
    msg += `હાજરી ટકાવારી: ${percentage}%\n`;
    msg += `---------------------------------\n`;

    if (absentStudents.length > 0) {
      msg += `*ગેરહાજર વિદ્યાર્થીઓ:*\n`;
      absentStudents.forEach((s, idx) => {
        msg += `${idx + 1}. રોલ નં ${s.rollNo}: ${s.nameGu}${s.parentContact ? ` (મો. ${s.parentContact})` : ''}\n`;
      });
      msg += `---------------------------------\n`;
    } else {
      msg += `સંપૂર્ણ ૧૦૦% હાજરી! ખૂબ ખૂબ અભિનંદન!\n`;
      msg += `---------------------------------\n`;
    }

    msg += `વર્ગ શિક્ષક: ${schoolInfo.classTeacher}\n`;
    msg += `શાળા: ${schoolInfo.schoolNameGu} (જિ. ${schoolInfo.district})`;
    return msg;
  };

  const messageText = generateMessageText();

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl max-w-xl w-full overflow-hidden border border-slate-200 my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-800 text-base">
              દૈનિક હાજરી અહેવાલ & WhatsApp સંદેશ
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Summary Preview Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-center pb-3 border-b border-slate-200">
              <h4 className="font-bold text-slate-900 text-base">
                {schoolInfo.schoolNameGu} ({schoolInfo.taluka})
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                {schoolInfo.standard} | તારીખ: {formatGujaratiDate(currentDate)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 text-center border-b border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">કુલ વિદ્યાર્થી</span>
                <strong className="font-mono text-base text-slate-800">{totalCount}</strong>
              </div>
              <div>
                <span className="text-xs text-emerald-700 block font-medium">હાજર</span>
                <strong className="font-mono text-base text-emerald-700">{presentStudents.length} ({percentage}%)</strong>
              </div>
              <div>
                <span className="text-xs text-rose-700 block font-medium">ગેરહાજર</span>
                <strong className="font-mono text-base text-rose-700">{absentStudents.length}</strong>
              </div>
            </div>

            {/* Absent List with Call / Message Action */}
            <div className="mt-3">
              <h5 className="text-xs font-semibold text-slate-700 mb-2">
                ગેરહાજર વિદ્યાર્થીઓ ({absentStudents.length}):
              </h5>
              {absentStudents.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {absentStudents.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-white border border-rose-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-rose-100 text-rose-700 font-mono font-bold flex items-center justify-center text-[10px]">
                          {student.rollNo}
                        </span>
                        <span className="font-medium text-slate-800">{student.nameGu}</span>
                      </div>
                      {student.parentContact && (
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${student.parentContact}`}
                            title="ફોન કરો"
                            className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?phone=91${student.parentContact}&text=${encodeURIComponent(
                              `નમસ્તે, તલાવડી પ્રાથમિક શાળામાંથી વર્ગ શિક્ષક બોલું છું. આપનો પાલ્ય ${student.nameGu} (ધોરણ ૬) આજે શાળામાં ગેરહાજર છે. કૃપા કરીને કારણ જણાવશો.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            title="WhatsApp મેસેજ કરો"
                            className="p-1 rounded text-slate-500 hover:text-emerald-600 hover:bg-slate-100 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-medium">
                  આજે બધા વિદ્યાર્થીઓ હાજર છે! કોઈ ગેરહાજર નથી.
                </p>
              )}
            </div>
          </div>

          {/* WhatsApp formatted text box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                WhatsApp માટે તૈયાર મેસેજ:
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'કોપી થઈ ગયું!' : 'ટેક્સ્ટ કોપી કરો'}
              </button>
            </div>
            <textarea
              readOnly
              rows={6}
              value={messageText}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 focus:outline-none"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              બંધ કરો
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              WhatsApp પર મોકલો
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
