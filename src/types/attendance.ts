export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Student {
  id: string;
  rollNo: number;
  grNo: string;
  nameGu: string;
  nameEn: string;
  gender: 'boy' | 'girl'; // કુમાર | કન્યા
  birthDate?: string;
  parentContact?: string;
  photoUrl?: string; // base64 or generated SVG data uri
  avatarSeed: number; // for procedural realistic Gujarati student avatar if no custom photo
}

export interface DailyAttendanceRecord {
  [studentId: string]: AttendanceStatus;
}

// date string in YYYY-MM-DD format as key
export interface AttendanceStore {
  [dateKey: string]: DailyAttendanceRecord;
}

export interface SchoolInfo {
  schoolNameGu: string;
  schoolNameEn: string;
  village: string;
  taluka: string;
  district: string;
  standard: string;
  section: string;
  udiseCode: string;
  academicYear: string;
  classTeacher: string;
}
