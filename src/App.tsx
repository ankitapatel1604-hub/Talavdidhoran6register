/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AttendanceStatus, AttendanceStore, DailyAttendanceRecord, SchoolInfo, Student } from './types/attendance';
import {
  getTodayDateStr,
  loadAttendanceStore,
  loadSchoolInfo,
  loadStudents,
  resetAllDataToDefault,
  saveAttendanceStore,
  saveStudents,
} from './utils/storage';
import { soundManager } from './utils/sound';
import { Header } from './components/Header';
import { PhotoAttendanceGrid } from './components/PhotoAttendanceGrid';
import { MonthlyRegister } from './components/MonthlyRegister';
import { StudentListView } from './components/StudentListView';
import { StudentManagementModal } from './components/StudentManagementModal';
import { ReportModal } from './components/ReportModal';

export default function App() {
  const [students, setStudents] = useState<Student[]>(() => loadStudents());
  const [schoolInfo] = useState<SchoolInfo>(() => loadSchoolInfo());
  const [attendanceStore, setAttendanceStore] = useState<AttendanceStore>(() => loadAttendanceStore());
  const [currentDate, setCurrentDate] = useState<string>(() => getTodayDateStr());
  const [activeTab, setActiveTab] = useState<'photo' | 'monthly' | 'students'>('photo');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => soundManager.enabled);

  // Modals
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Save changes to students
  useEffect(() => {
    saveStudents(students);
  }, [students]);

  // Save changes to attendanceStore
  useEffect(() => {
    saveAttendanceStore(attendanceStore);
  }, [attendanceStore]);

  // Current day attendance record
  const currentDailyRecord: DailyAttendanceRecord = attendanceStore[currentDate] || {};

  // Toggle or set attendance for a student on current date
  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceStore((prev) => {
      const dayRecord = { ...(prev[currentDate] || {}) };
      dayRecord[studentId] = status;
      return {
        ...prev,
        [currentDate]: dayRecord,
      };
    });
  };

  // Mark all students present or absent for current date
  const handleMarkAll = (status: 'present' | 'absent') => {
    setAttendanceStore((prev) => {
      const updatedDay: DailyAttendanceRecord = {};
      students.forEach((s) => {
        updatedDay[s.id] = status;
      });
      return {
        ...prev,
        [currentDate]: updatedDay,
      };
    });
  };

  // Update a single cell in monthly register
  const handleUpdateDayStatus = (dateStr: string, studentId: string, status: AttendanceStatus) => {
    setAttendanceStore((prev) => {
      const dayRecord = { ...(prev[dateStr] || {}) };
      dayRecord[studentId] = status;
      return {
        ...prev,
        [dateStr]: dayRecord,
      };
    });
  };

  // Student management handlers
  const handleOpenAddStudent = () => {
    setSelectedStudentForEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditStudent = (student: Student) => {
    setSelectedStudentForEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleSaveStudent = (savedStudent: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === savedStudent.id);
      if (exists) {
        return prev.map((s) => (s.id === savedStudent.id ? savedStudent : s));
      } else {
        return [...prev, savedStudent].sort((a, b) => a.rollNo - b.rollNo);
      }
    });
  };

  const handleDeleteStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  const handleResetData = () => {
    if (
      confirm(
        'શું તમે વિદ્યાર્થીઓની યાદી અને હાજરીનો ડેમો ડેટા ફરીથી મૂળ સ્થિતિમાં લાવવા માંગો છો?'
      )
    ) {
      const { students: defStudents, attendance: defAttendance } = resetAllDataToDefault();
      setStudents(defStudents);
      setAttendanceStore(defAttendance);
      setCurrentDate(getTodayDateStr());
    }
  };

  const handleToggleSound = () => {
    const nextVal = soundManager.toggleSound();
    setSoundEnabled(nextVal);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* Top Header */}
      <Header
        schoolInfo={schoolInfo}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenAddStudent={handleOpenAddStudent}
        onOpenReport={() => setIsReportModalOpen(true)}
        onResetData={handleResetData}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'photo' && (
          <PhotoAttendanceGrid
            students={students}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            attendanceRecord={currentDailyRecord}
            onStatusChange={handleStatusChange}
            onMarkAll={handleMarkAll}
            onEditStudent={handleOpenEditStudent}
            onOpenReport={() => setIsReportModalOpen(true)}
          />
        )}

        {activeTab === 'monthly' && (
          <MonthlyRegister
            students={students}
            schoolInfo={schoolInfo}
            attendanceStore={attendanceStore}
            onUpdateDayStatus={handleUpdateDayStatus}
          />
        )}

        {activeTab === 'students' && (
          <StudentListView
            students={students}
            schoolInfo={schoolInfo}
            onEditStudent={handleOpenEditStudent}
            onAddNewStudent={handleOpenAddStudent}
          />
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-500 no-print">
        <p>
          {schoolInfo.schoolNameGu} · તાલુકો: {schoolInfo.taluka} · જિલ્લો: {schoolInfo.district} · {schoolInfo.standard} (શૈક્ષણિક વર્ષ: {schoolInfo.academicYear})
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          ડિજિટલ હાજરી રજીસ્ટર - ફોટો પર ક્લિક કરીને હાજરી પૂરવાની સુવિધા સાથે
        </p>
      </footer>

      {/* Add / Edit Student Modal */}
      <StudentManagementModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        student={selectedStudentForEdit}
        allStudents={students}
        onSaveStudent={handleSaveStudent}
        onDeleteStudent={handleDeleteStudent}
      />

      {/* Daily Report & WhatsApp Share Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        students={students}
        currentDate={currentDate}
        attendanceRecord={currentDailyRecord}
        schoolInfo={schoolInfo}
      />
    </div>
  );
}
