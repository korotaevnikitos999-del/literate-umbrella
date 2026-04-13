import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';

interface CalculatorProps {
  standArea: number;
  wallHeight: number;
}

const Calculator: React.FC<CalculatorProps> = ({ standArea, wallHeight }) => {
  const { theme, accentColor } = useTheme();
  const [length, setLength] = useState(standArea > 0 ? Math.sqrt(standArea) : 6);
  const [width, setWidth] = useState(standArea > 0 ? Math.sqrt(standArea) : 6);
  const [height, setHeight] = useState(wallHeight || 3);

  const area = useMemo(() => length * width, [length, width]);
  const perimeter = useMemo(() => 2 * (length + width), [length, width]);
  const wallArea = useMemo(() => perimeter * height, [perimeter, height]);
  const volume = useMemo(() => area * height, [area, height]);
  const linearMeters = useMemo(() => length + width, [length, width]);

  const inputClass = `
    w-full px-2 py-1.5 rounded-lg text-sm outline-none transition-all border text-center
    ${theme === 'light'
      ? 'bg-white border-gray-200 text-gray-900 focus:border-indigo-400'
      : theme === 'gray'
      ? 'bg-gray-600 border-gray-500 text-gray-100 focus:border-indigo-400'
      : 'bg-white/5 border-white/10 text-white focus:border-indigo-500'}
  `;

  const labelClass = `text-xs font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`;

  const resultClass = `
    flex justify-between items-center py-2 px-3 rounded-lg
    ${theme === 'light' ? 'bg-gray-50' : theme === 'gray' ? 'bg-gray-700' : 'bg-white/5'}
  `;

  return (
    <div className="space-y-4">
      <h3 className={`font-semibold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
        🧮 Калькулятор площадей
      </h3>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={labelClass}>Длина (м)</label>
          <input type="number" value={length} onChange={e => setLength(parseFloat(e.target.value) || 0)}
            className={inputClass} min={0} step={0.1} />
        </div>
        <div>
          <label className={labelClass}>Ширина (м)</label>
          <input type="number" value={width} onChange={e => setWidth(parseFloat(e.target.value) || 0)}
            className={inputClass} min={0} step={0.1} />
        </div>
        <div>
          <label className={labelClass}>Высота (м)</label>
          <input type="number" value={height} onChange={e => setHeight(parseFloat(e.target.value) || 0)}
            className={inputClass} min={0} step={0.1} />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className={resultClass}>
          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Площадь:</span>
          <span className="font-bold text-sm" style={{ color: accentColor }}>{area.toFixed(2)} м²</span>
        </div>
        <div className={resultClass}>
          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Периметр:</span>
          <span className={`font-bold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{perimeter.toFixed(2)} м</span>
        </div>
        <div className={resultClass}>
          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Площадь стен:</span>
          <span className={`font-bold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{wallArea.toFixed(2)} м²</span>
        </div>
        <div className={resultClass}>
          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Линейные метры:</span>
          <span className={`font-bold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{linearMeters.toFixed(2)} п.м</span>
        </div>
        <div className={resultClass}>
          <span className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Объём:</span>
          <span className={`font-bold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>{volume.toFixed(2)} м³</span>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
