import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Theme } from '../types';
import NeonSettings from './NeonSettings';

interface HeaderProps {
  projectName: string;
  onProjectNameChange: (v: string) => void;
  total: number;
  vatTotal: number;
  showVat: boolean;
  onExportExcel: () => void;
  onExportPDF: () => void;
}

const ThemeButton: React.FC<{ label: string; value: Theme; current: Theme; onClick: () => void }> = ({
  label, value, current, onClick
}) => {
  const active = value === current;
  const styles: Record<Theme, string> = {
    light: active ? 'bg-white text-gray-900 shadow-lg' : 'bg-white/10 text-white/60 hover:bg-white/20',
    dark: active ? 'bg-gray-800 text-white shadow-lg border border-indigo-500' : 'bg-white/10 text-white/60 hover:bg-white/20',
    gray: active ? 'bg-gray-500 text-white shadow-lg' : 'bg-white/10 text-white/60 hover:bg-white/20',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${styles[value]}`}
    >
      {label}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({
  projectName, onProjectNameChange, total, vatTotal, showVat,
  onExportExcel, onExportPDF
}) => {
  const { theme, setTheme, accentColor } = useTheme();
  const [showSettings, setShowSettings] = useState(false);

  const headerBg = theme === 'light'
    ? 'bg-white/98 text-gray-900 border-b border-gray-200'
    : theme === 'gray'
    ? 'bg-gray-700/98 text-gray-100 border-b border-gray-600'
    : 'bg-gray-950/95 text-white border-b border-white/10';

  return (
    <>
      {showSettings && <NeonSettings onClose={() => setShowSettings(false)} />}

      {/* Neon accent bar */}
      <div className="h-1 w-full flex-shrink-0"
        style={{ background: `linear-gradient(to right, ${accentColor}, #ec4899, #06b6d4)` }} />

      <header className={`relative z-20 flex-shrink-0 ${headerBg} backdrop-blur-md`}>
        <div className="px-3 py-2 flex items-center gap-3 flex-wrap">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-fit">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg text-lg"
              style={{ background: `linear-gradient(135deg, ${accentColor}, #ec4899)`, boxShadow: `0 0 20px ${accentColor}40` }}>
              🏛️
            </div>
            <div>
              <div className="font-bold text-sm leading-tight" style={{ color: accentColor }}>ExpoCalc</div>
              <div className="text-[10px] opacity-50 leading-tight">Выставочный стенд</div>
            </div>
          </div>

          {/* Divider */}
          <div className={`w-px h-8 ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`} />

          {/* Project name */}
          <input
            type="text"
            value={projectName}
            onChange={e => onProjectNameChange(e.target.value)}
            placeholder="Название проекта / смета..."
            className={`
              flex-1 min-w-32 max-w-72 px-3 py-1.5 rounded-lg text-sm border outline-none transition-all font-medium
              ${theme === 'light'
                ? 'bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:bg-white'
                : theme === 'gray'
                ? 'bg-gray-600 border-gray-500 text-gray-100 placeholder-gray-400 focus:border-indigo-400'
                : 'bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-white/8'}
            `}
          />

          {/* Spacer */}
          <div className="flex-1" />

          {/* Total display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className={`text-[10px] uppercase tracking-wide ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                Итого
              </div>
              <div className="font-bold text-lg font-mono leading-tight" style={{ color: accentColor }}>
                {total.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            {showVat && (
              <div className="text-right">
                <div className={`text-[10px] uppercase tracking-wide ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                  С НДС
                </div>
                <div className="font-bold text-base font-mono text-emerald-400 leading-tight">
                  {vatTotal.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            )}
          </div>

          <div className={`w-px h-8 ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`} />

          {/* Theme switcher */}
          <div className="flex gap-1">
            <ThemeButton label="☀ Свет" value="light" current={theme} onClick={() => setTheme('light')} />
            <ThemeButton label="◑ Серая" value="gray" current={theme} onClick={() => setTheme('gray')} />
            <ThemeButton label="☾ Тёмная" value="dark" current={theme} onClick={() => setTheme('dark')} />
          </div>

          {/* Settings button */}
          <button
            onClick={() => setShowSettings(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
              theme === 'light'
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
            }`}
            title="Настройки оформления"
          >
            🎨 Стиль
          </button>

          <div className={`w-px h-8 ${theme === 'light' ? 'bg-gray-200' : 'bg-white/10'}`} />

          {/* Export buttons */}
          <button
            onClick={onExportExcel}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            📊 Excel
          </button>
          <button
            onClick={onExportPDF}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 shadow-sm"
          >
            📄 PDF
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
