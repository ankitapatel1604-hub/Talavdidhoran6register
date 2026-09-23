import React, { useState, useEffect } from 'react';
import { Student } from '../types/attendance';
import { Camera, Upload, Trash2, X, Check } from 'lucide-react';
import { generateStudentAvatar } from '../utils/avatarGenerator';
import { CameraCaptureModal } from './CameraCaptureModal';

interface StudentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null; // null if adding new student
  allStudents: Student[];
  onSaveStudent: (student: Student) => void;
  onDeleteStudent?: (studentId: string) => void;
}

export const StudentManagementModal: React.FC<StudentManagementModalProps> = ({
  isOpen,
  onClose,
  student,
  allStudents,
  onSaveStudent,
  onDeleteStudent,
}) => {
  const [nameGu, setNameGu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [rollNo, setRollNo] = useState<number>(1);
  const [grNo, setGrNo] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [birthDate, setBirthDate] = useState('2014-06-15');
  const [parentContact, setParentContact] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [avatarSeed, setAvatarSeed] = useState(1);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (student) {
      setNameGu(student.nameGu);
      setNameEn(student.nameEn);
      setRollNo(student.rollNo);
      setGrNo(student.grNo);
      setGender(student.gender);
      setBirthDate(student.birthDate || '2014-06-15');
      setParentContact(student.parentContact || '');
      setPhotoUrl(student.photoUrl || '');
      setAvatarSeed(student.avatarSeed);
    } else {
      // Find next roll no
      const maxRoll = allStudents.reduce((max, s) => Math.max(max, s.rollNo), 0);
      const nextRoll = maxRoll + 1;
      const nextSeed = Math.floor(Math.random() * 100) + 1;
      setRollNo(nextRoll);
      setGrNo(String(2450 + nextRoll));
      setNameGu('');
      setNameEn('');
      setGender('boy');
      setBirthDate('2014-06-15');
      setParentContact('');
      setAvatarSeed(nextSeed);
      setPhotoUrl(generateStudentAvatar(nextSeed, 'boy', 'વિદ્યાર્થી'));
    }
  }, [student, allStudents, isOpen]);

  // Handle local image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhotoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenderChange = (newGender: 'boy' | 'girl') => {
    setGender(newGender);
    // If using generated avatar, regenerate
    if (!photoUrl || photoUrl.startsWith('data:image/svg+xml')) {
      setPhotoUrl(generateStudentAvatar(avatarSeed, newGender, nameGu || 'વિદ્યાર્થી'));
    }
  };

  const handleGenerateNewAvatar = () => {
    const newSeed = avatarSeed + 1;
    setAvatarSeed(newSeed);
    setPhotoUrl(generateStudentAvatar(newSeed, gender, nameGu || 'વિદ્યાર્થી'));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameGu.trim()) {
      alert('કૃપા કરીને વિદ્યાર્થીનું નામ દાખલ કરો');
      return;
    }

    const finalPhoto = photoUrl || generateStudentAvatar(avatarSeed, gender, nameGu);

    const savedStudent: Student = {
      id: student ? student.id : `std-${Date.now()}`,
      rollNo: Number(rollNo),
      grNo: grNo.trim() || String(rollNo),
      nameGu: nameGu.trim(),
      nameEn: nameEn.trim() || nameGu.trim(),
      gender,
      birthDate,
      parentContact: parentContact.trim(),
      photoUrl: finalPhoto,
      avatarSeed,
    };

    onSaveStudent(savedStudent);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200 my-8">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <h3 className="font-bold text-slate-800 text-base">
              {student ? 'વિદ્યાર્થીની વિગતો / ફોટો બદલો' : 'નવા વિદ્યાર્થીની નોંધણી (ધોરણ ૬)'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Photo Section */}
            <div className="flex flex-col items-center justify-center pb-2 border-b border-slate-100">
              <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500 shadow-md mb-3 bg-slate-100">
                <img
                  src={photoUrl || generateStudentAvatar(avatarSeed, gender, nameGu)}
                  alt="Student preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                  કેમેરાથી ફોટો પાડો
                </button>

                <label className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-200">
                  <Upload className="w-3.5 h-3.5 text-slate-500" />
                  ફોટો અપલોડ કરો
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                <button
                  type="button"
                  onClick={handleGenerateNewAvatar}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors cursor-pointer"
                  title="નવો કાર્ટૂન અવતાર પસંદ કરો"
                >
                  બીજો અવતાર
                </button>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  રોલ નંબર *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={rollNo}
                  onChange={(e) => setRollNo(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  જનરલ રજીસ્ટર (GR) નં *
                </label>
                <input
                  type="text"
                  required
                  value={grNo}
                  onChange={(e) => setGrNo(e.target.value)}
                  placeholder="2451"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વિદ્યાર્થીનું પૂરું નામ (ગુજરાતી) *
              </label>
              <input
                type="text"
                required
                value={nameGu}
                onChange={(e) => setNameGu(e.target.value)}
                placeholder="દા.ત. પટેલ હર્ષિલ વિનોદભાઈ"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વિદ્યાર્થીનું નામ (અંગ્રેજી)
              </label>
              <input
                type="text"
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Patel Harshil V."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  જાતિ (કુમાર / કન્યા) *
                </label>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => handleGenderChange('boy')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      gender === 'boy' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    કુમાર (Boy)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleGenderChange('girl')}
                    className={`py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      gender === 'girl' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                  >
                    કન્યા (Girl)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  જન્મ તારીખ
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                વાલીનો મોબાઈલ નંબર (WhatsApp સૂચના માટે)
              </label>
              <input
                type="tel"
                value={parentContact}
                onChange={(e) => setParentContact(e.target.value)}
                placeholder="9825000000"
                maxLength={10}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {student && onDeleteStudent ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`શું તમે ${student.nameGu} ને રજીસ્ટરમાંથી કાઢી નાખવા માંગો છો?`)) {
                      onDeleteStudent(student.id);
                      onClose();
                    }
                  }}
                  className="px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  વિદ્યાર્થી કાઢી નાખો
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  રદ કરો
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  સેવ કરો
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Webcam modal */}
      <CameraCaptureModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => setPhotoUrl(dataUrl)}
        studentName={nameGu || 'ધોરણ ૬ વિદ્યાર્થી'}
      />
    </>
  );
};
