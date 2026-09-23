import { SchoolInfo, Student } from '../types/attendance';
import { generateStudentAvatar } from '../utils/avatarGenerator';

export const DEFAULT_SCHOOL_INFO: SchoolInfo = {
  schoolNameGu: 'તલાવડી પ્રાથમિક શાળા',
  schoolNameEn: 'Talavadi Primary School',
  village: 'તલાવડી',
  taluka: 'હાલોલ',
  district: 'પંચમહાલ',
  standard: 'ધોરણ - ૬',
  section: 'વર્ગ - અ',
  udiseCode: '24190204101',
  academicYear: '2026-2027',
  classTeacher: 'શ્રીમતી અંકિતાબેન પટેલ',
};

const rawStudents: Omit<Student, 'photoUrl'>[] = [
  { id: 'std-601', rollNo: 1, grNo: '2451', nameGu: 'બારિયા અજયકુમાર કાંતિભાઈ', nameEn: 'Baria Ajaykumar K.', gender: 'boy', birthDate: '2014-04-12', parentContact: '9825412301', avatarSeed: 1 },
  { id: 'std-602', rollNo: 2, grNo: '2452', nameGu: 'પટેલ હર્ષિલ વિનોદભાઈ', nameEn: 'Patel Harshil V.', gender: 'boy', birthDate: '2014-06-18', parentContact: '9898124502', avatarSeed: 2 },
  { id: 'std-603', rollNo: 3, grNo: '2453', nameGu: 'રાઠવા દિવ્યાબેન રમેશભાઈ', nameEn: 'Rathwa Divyaben R.', gender: 'girl', birthDate: '2014-02-24', parentContact: '9427618903', avatarSeed: 3 },
  { id: 'std-604', rollNo: 4, grNo: '2454', nameGu: 'પરમાર કાર્તિક દિનેશભાઈ', nameEn: 'Parmar Kartik D.', gender: 'boy', birthDate: '2014-08-09', parentContact: '9712345604', avatarSeed: 4 },
  { id: 'std-605', rollNo: 5, grNo: '2455', nameGu: 'સોલંકી સ્નેહાબેન મહેશભાઈ', nameEn: 'Solanki Snehaben M.', gender: 'girl', birthDate: '2014-05-15', parentContact: '9909876505', avatarSeed: 5 },
  { id: 'std-606', rollNo: 6, grNo: '2456', nameGu: 'નાયક પ્રિયાંક હસમુખભાઈ', nameEn: 'Nayak Priyank H.', gender: 'boy', birthDate: '2014-09-30', parentContact: '9824012306', avatarSeed: 6 },
  { id: 'std-607', rollNo: 7, grNo: '2457', nameGu: 'ચૌહાણ ખુશીબેન રાજેન્દ્રભાઈ', nameEn: 'Chauhan Khushiben R.', gender: 'girl', birthDate: '2014-03-11', parentContact: '9638527407', avatarSeed: 7 },
  { id: 'std-608', rollNo: 8, grNo: '2458', nameGu: 'તડવી સાહિલ બાબુભાઈ', nameEn: 'Tadvi Sahil B.', gender: 'boy', birthDate: '2014-11-20', parentContact: '9979123408', avatarSeed: 8 },
  { id: 'std-609', rollNo: 9, grNo: '2459', nameGu: 'બારિયા પૂજાબેન નરેશભાઈ', nameEn: 'Baria Pujaben N.', gender: 'girl', birthDate: '2014-07-04', parentContact: '9723456709', avatarSeed: 9 },
  { id: 'std-610', rollNo: 10, grNo: '2460', nameGu: 'પટેલ માનવ શૈલેષભાઈ', nameEn: 'Patel Manav S.', gender: 'boy', birthDate: '2014-01-19', parentContact: '9825123410', avatarSeed: 10 },
  { id: 'std-611', rollNo: 11, grNo: '2461', nameGu: 'રાઠવા રુત્વિક કલ્પેશભાઈ', nameEn: 'Rathwa Rutvik K.', gender: 'boy', birthDate: '2014-10-08', parentContact: '9428987611', avatarSeed: 11 },
  { id: 'std-612', rollNo: 12, grNo: '2462', nameGu: 'મકવાણા દિયાબેન સુરેશભાઈ', nameEn: 'Makwana Diyaben S.', gender: 'girl', birthDate: '2014-12-14', parentContact: '9924567812', avatarSeed: 12 },
  { id: 'std-613', rollNo: 13, grNo: '2463', nameGu: 'પરમાર ભાવિન જયંતિભાઈ', nameEn: 'Parmar Bhavin J.', gender: 'boy', birthDate: '2014-04-29', parentContact: '9898765413', avatarSeed: 13 },
  { id: 'std-614', rollNo: 14, grNo: '2464', nameGu: 'બારિયા કિર્તીબેન શાંતિલાલ', nameEn: 'Baria Kirtiben S.', gender: 'girl', birthDate: '2014-08-22', parentContact: '9714567814', avatarSeed: 14 },
  { id: 'std-615', rollNo: 15, grNo: '2465', nameGu: 'ચૌહાણ મનન વિજયભાઈ', nameEn: 'Chauhan Manan V.', gender: 'boy', birthDate: '2014-02-05', parentContact: '9638123415', avatarSeed: 15 },
  { id: 'std-616', rollNo: 16, grNo: '2466', nameGu: 'પટેલ રિદ્ધિબેન પંકજભાઈ', nameEn: 'Patel Riddhi P.', gender: 'girl', birthDate: '2014-06-03', parentContact: '9825987616', avatarSeed: 16 },
  { id: 'std-617', rollNo: 17, grNo: '2467', nameGu: 'તડવી દર્શિલ કનુભાઈ', nameEn: 'Tadvi Darshil K.', gender: 'boy', birthDate: '2014-09-17', parentContact: '9978123417', avatarSeed: 17 },
  { id: 'std-618', rollNo: 18, grNo: '2468', nameGu: 'સોલંકી આર્યાબેન મુકેશભાઈ', nameEn: 'Solanki Aaryaben M.', gender: 'girl', birthDate: '2014-03-27', parentContact: '9426123418', avatarSeed: 18 },
  { id: 'std-619', rollNo: 19, grNo: '2469', nameGu: 'રાઠવા રોહન ઈશ્વરભાઈ', nameEn: 'Rathwa Rohan I.', gender: 'boy', birthDate: '2014-11-10', parentContact: '9725987619', avatarSeed: 19 },
  { id: 'std-620', rollNo: 20, grNo: '2470', nameGu: 'નાયક નેન્સીબેન અરવિંદભાઈ', nameEn: 'Nayak Nancy A.', gender: 'girl', birthDate: '2014-05-21', parentContact: '9898012320', avatarSeed: 20 },
  { id: 'std-621', rollNo: 21, grNo: '2471', nameGu: 'બારિયા વિશાલ પ્રવીણભાઈ', nameEn: 'Baria Vishal P.', gender: 'boy', birthDate: '2014-07-16', parentContact: '9824678921', avatarSeed: 21 },
  { id: 'std-622', rollNo: 22, grNo: '2472', nameGu: 'પરમાર સોનલબેન ભરતભાઈ', nameEn: 'Parmar Sonalben B.', gender: 'girl', birthDate: '2014-01-08', parentContact: '9904123422', avatarSeed: 22 },
  { id: 'std-623', rollNo: 23, grNo: '2473', nameGu: 'પટેલ દક્ષ મનોજભાઈ', nameEn: 'Patel Daksh M.', gender: 'boy', birthDate: '2014-10-25', parentContact: '9825456723', avatarSeed: 23 },
  { id: 'std-624', rollNo: 24, grNo: '2474', nameGu: 'રાઠવા વૈષ્ણવીબેન ઘનશ્યામભાઈ', nameEn: 'Rathwa Vaishnaviben G.', gender: 'girl', birthDate: '2014-04-02', parentContact: '9427123424', avatarSeed: 24 },
  { id: 'std-625', rollNo: 25, grNo: '2475', nameGu: 'ચૌહાણ ક્રિશ ગણપતભાઈ', nameEn: 'Chauhan Krish G.', gender: 'boy', birthDate: '2014-08-14', parentContact: '9638789025', avatarSeed: 25 },
  { id: 'std-626', rollNo: 26, grNo: '2476', nameGu: 'બારિયા જીનલબેન વિષ્ણુભાઈ', nameEn: 'Baria Jinalben V.', gender: 'girl', birthDate: '2014-12-01', parentContact: '9712012326', avatarSeed: 26 },
];

export const INITIAL_STUDENTS: Student[] = rawStudents.map((s) => ({
  ...s,
  photoUrl: generateStudentAvatar(s.avatarSeed, s.gender, s.nameGu),
}));
