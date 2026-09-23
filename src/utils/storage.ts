import { AttendanceStore, DailyAttendanceRecord, SchoolInfo, Student } from '../types/attendance';
import { DEFAULT_SCHOOL_INFO, INITIAL_STUDENTS } from '../data/defaultStudents';

const STUDENTS_STORAGE_KEY = 'talavadi_std6_students_v1';
const ATTENDANCE_STORAGE_KEY = 'talavadi_std6_attendance_v1';
const SCHOOL_INFO_STORAGE_KEY = 'talavadi_std6_school_v1';

export function getTodayDateStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatGujaratiDate(dateStr: string): string {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const gujaratiMonths = [
    'જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન',
    'જુલાઈ', 'ઓગસ્ટ', 'સપ્ટેમ્બર', 'ઓક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'
  ];
  const gujaratiDays = [
    'રવિવાર', 'સોમવાર', 'મંગળવાર', 'બુધવાર', 'ગુરુવાર', 'શુક્રવાર', 'શનિવાર'
  ];
  
  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
  const dayName = gujaratiDays[dateObj.getDay()];
  const monthName = gujaratiMonths[Number(month) - 1] || '';
  
  return `${Number(day)} ${monthName} ${year} (${dayName})`;
}

export function loadSchoolInfo(): SchoolInfo {
  try {
    const raw = localStorage.getItem(SCHOOL_INFO_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load school info:', e);
  }
  return DEFAULT_SCHOOL_INFO;
}

export function saveSchoolInfo(info: SchoolInfo): void {
  try {
    localStorage.setItem(SCHOOL_INFO_STORAGE_KEY, JSON.stringify(info));
  } catch (e) {
    console.error('Failed to save school info:', e);
  }
}

export function loadStudents(): Student[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load students:', e);
  }
  return INITIAL_STUDENTS;
}

export function saveStudents(students: Student[]): void {
  try {
    localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
  } catch (e) {
    console.error('Failed to save students:', e);
  }
}

export function loadAttendanceStore(): AttendanceStore {
  try {
    const raw = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load attendance store:', e);
  }

  // Pre-seed some realistic attendance for today so it's ready on first load
  const today = getTodayDateStr();
  const initialDaily: DailyAttendanceRecord = {};
  
  INITIAL_STUDENTS.forEach((s, idx) => {
    // 2-3 students absent for realism
    if (idx === 4 || idx === 11) {
      initialDaily[s.id] = 'absent';
    } else if (idx === 18) {
      initialDaily[s.id] = 'leave';
    } else {
      initialDaily[s.id] = 'present';
    }
  });

  const store: AttendanceStore = {
    [today]: initialDaily,
  };

  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // safe ignore
  }

  return store;
}

export function saveAttendanceStore(store: AttendanceStore): void {
  try {
    localStorage.setItem(ATTENDANCE_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('Failed to save attendance store:', e);
  }
}

export function resetAllDataToDefault(): { students: Student[]; school: SchoolInfo; attendance: AttendanceStore } {
  localStorage.removeItem(STUDENTS_STORAGE_KEY);
  localStorage.removeItem(ATTENDANCE_STORAGE_KEY);
  localStorage.removeItem(SCHOOL_INFO_STORAGE_KEY);
  
  const students = loadStudents();
  const school = loadSchoolInfo();
  const attendance = loadAttendanceStore();
  
  return { students, school, attendance };
}
