import React from 'react';
import { SchoolInfo } from '../types/attendance';
import { Volume2, VolumeX, UserPlus, Sparkles, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/sound';
import schoolEmblem from '../assets/images/talavadi_school_emblem_1790147188960.jpg';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  activeTab: 'photo' | 'monthly' | 'students';
  onTabChange: (tab: 'photo' | 'monthly' | 'students') => void;
  onOpenAddStudent: () => void;
  onOpenReport: () => void;
  onResetData: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  schoolInfo,
  activeTab,
  onTabChange,
  onOpenAddStudent,
  onOpenReport,
  onResetData,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top 3-Zone Contract Row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Zone 1: Brand Wordmark & Emblem */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-emerald-500/40 shadow-xs shrink-0 bg-emerald-50 flex items-center justify-center">
              <img
                src={schoolEmblem}
                alt="તલાવડી પ્રાથમિક શાળા લોગો"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to stylized SVG emblem
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Sparkles className="w-5 h-5 text-emerald-600 hidden group-has-[img[style*='display: none']]:block" />
            </div>

            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base sm:text-lg tracking-tight truncate">
                  {schoolInfo.schoolNameGu}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md shrink-0">
                  {schoolInfo.standard}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate hidden sm:block">
                તા. {schoolInfo.taluka}, જિ. {schoolInfo.district} · શૈક્ષણિક વર્ષ {schoolInfo.academicYear}
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onTabChange('photo')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'photo'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📷 ફોટો હાજરી (Daily)
            </button>
            <button
              type="button"
              onClick={() => onTabChange('monthly')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'monthly'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 માસિક રજીસ્ટર (Monthly)
            </button>
            <button
              type="button"
              onClick={() => onTabChange('students')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === 'students'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              👥 વિદ્યાર્થી યાદી ({schoolInfo.standard})
            </button>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'હાજરી ક્લિક અવાજ ચાલુ છે (બંધ કરવા ક્લિક કરો)' : 'હાજરી ક્લિક અવાજ બંધ છે (ચાલુ કરવા ક્લિક કરો)'}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Reset / Restore Demo */}
            <button
              type="button"
              onClick={onResetData}
              title="ડેમો ડેટા ફરીથી સેટ કરો"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Add Student CTA */}
            <button
              type="button"
              onClick={onOpenAddStudent}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">+ નવો વિદ્યાર્થી</span>
              <span className="sm:hidden">+ ઉમેરો</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 gap-1 overflow-x-auto">
          <button
            type="button"
            onClick={() => onTabChange('photo')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'photo'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📷 ફોટો હાજરી
          </button>
          <button
            type="button"
            onClick={() => onTabChange('monthly')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'monthly'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📅 માસિક રજીસ્ટર
          </button>
          <button
            type="button"
            onClick={() => onTabChange('students')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            👥 વિદ્યાર્થી યાદી
          </button>
        </div>
      </div>
    </header>
  );
};
