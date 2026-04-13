import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface NeonSettingsProps {
  onClose: () => void;
}

const NEON_PRESETS = [
  { name: 'Индиго', color: '#6366f1' },
  { name: 'Розовый', color: '#ec4899' },
  { name: 'Циановый', color: '#06b6d4' },
  { name: 'Зелёный', color: '#10b981' },
  { name: 'Янтарный', color: '#f59e0b' },
  { name: 'Красный', color: '#ef4444' },
  { name: 'Фиолетовый', color: '#8b5cf6' },
  { name: 'Лайм', color: '#84cc16' },
];

const NeonSettings: React.FC<NeonSettingsProps> = ({ onClose }) => {
  const { theme, setTheme, accentColor, setAccentColor } = useTheme();
  const [gradient1, setGradient1] = useState('#6366f1');
  const [gradient2, setGradient2] = useState('#ec4899');

  const cardClass = `
    rounded-xl border p-4
    ${theme === 'light' ? 'bg-white border-gray-200' :
      theme === 'gray' ? 'bg-gray-700 border-gray-600' :
      'bg-gray-800/90 border-white/10'}
  `;

  const labelClass = `text-xs font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className={`${cardClass} w-96 max-h-[90vh] overflow-y-auto shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`font-bold text-lg ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
            🎨 Настройки оформления
          </h2>
          <button
            onClick={onClose}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
              theme === 'light' ? 'hover:bg-gray-100 text-gray-500' : 'hover:bg-white/10 text-gray-400'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Theme selection */}
        <div className="mb-4">
          <label className={labelClass}>Тема оформления</label>
          <div className="grid grid-cols-3 gap-2">
            {(['light', 'dark', 'gray'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`py-3 rounded-xl text-xs font-medium border-2 transition-all ${
                  theme === t ? 'border-indigo-500' : 'border-transparent'
                } ${
                  t === 'light' ? 'bg-white text-gray-800' :
                  t === 'gray' ? 'bg-gray-600 text-white' :
                  'bg-gray-900 text-white'
                }`}
              >
                {t === 'light' ? '☀️ Светлая' : t === 'gray' ? '◑ Серая' : '🌙 Тёмная'}
              </button>
            ))}
          </div>
        </div>

        {/* Accent color */}
        <div className="mb-4">
          <label className={labelClass}>Акцентный цвет</label>
          <div className="flex items-center gap-3 mb-2">
            <input
              type="color"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer"
            />
            <input
              type="text"
              value={accentColor}
              onChange={e => setAccentColor(e.target.value)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm border outline-none ${
                theme === 'light' ? 'bg-gray-100 border-gray-200 text-gray-900' :
                'bg-white/5 border-white/10 text-white'
              }`}
            />
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {NEON_PRESETS.map(p => (
              <button
                key={p.color}
                onClick={() => setAccentColor(p.color)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
                  accentColor === p.color ? 'border-white' : 'border-transparent hover:border-white/30'
                }`}
              >
                <div className="w-8 h-8 rounded-full shadow-lg" style={{
                  backgroundColor: p.color,
                  boxShadow: `0 0 12px ${p.color}80`
                }} />
                <span className={`text-[9px] ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Gradient preview */}
        <div className="mb-4">
          <label className={labelClass}>Градиент шапки</label>
          <div className="flex gap-3 mb-2">
            <div className="flex flex-col items-center gap-1">
              <input type="color" value={gradient1} onChange={e => setGradient1(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer" />
              <span className={`text-[10px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Цвет 1</span>
            </div>
            <div
              className="flex-1 h-8 rounded-lg"
              style={{ background: `linear-gradient(to right, ${gradient1}, ${gradient2})` }}
            />
            <div className="flex flex-col items-center gap-1">
              <input type="color" value={gradient2} onChange={e => setGradient2(e.target.value)}
                className="w-10 h-8 rounded cursor-pointer" />
              <span className={`text-[10px] ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>Цвет 2</span>
            </div>
          </div>
        </div>

        {/* Neon effects info */}
        {theme === 'dark' && (
          <div className={`rounded-lg p-3 mb-4 ${
            'bg-indigo-900/20 border border-indigo-700/30'
          }`}>
            <p className="text-xs text-indigo-300">
              ✨ Неоновые эффекты активны — доступны в тёмной теме. Полупрозрачные шары и светящиеся линии создают атмосферу стенда.
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: accentColor }}
        >
          Применить
        </button>
      </div>
    </div>
  );
};

export default NeonSettings;
