import React, { useCallback, useState } from 'react';
import { LineItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface LineItemRowProps {
  item: LineItem;
  index: number;
  onChange: (id: string, field: 'quantity' | 'price' | 'name', value: number | string) => void;
  onDelete?: (id: string) => void;
}

const LineItemRow: React.FC<LineItemRowProps> = ({ item, index, onChange, onDelete }) => {
  const { theme, accentColor } = useTheme();
  const total = item.price * item.quantity;
  const isActive = item.quantity > 0 && item.price > 0;
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState(item.name);

  const baseInput = `
    w-full px-2 py-1 rounded-lg text-xs outline-none transition-all border font-mono
    ${theme === 'light'
      ? 'bg-gray-50 border-gray-200 text-gray-900 hover:border-gray-300 focus:border-indigo-400 focus:bg-white'
      : theme === 'gray'
      ? 'bg-gray-600/50 border-gray-500 text-gray-100 focus:border-indigo-400 focus:bg-gray-600'
      : 'bg-white/3 border-white/8 text-gray-200 focus:border-indigo-500 focus:bg-white/6'}
  `;

  const handleQtyChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) || 0;
    onChange(item.id, 'quantity', v);
  }, [item.id, onChange]);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value) || 0;
    onChange(item.id, 'price', v);
  }, [item.id, onChange]);

  const handleNameBlur = useCallback(() => {
    setEditingName(false);
    onChange(item.id, 'name', nameVal);
  }, [item.id, nameVal, onChange]);

  const rowBg = isActive
    ? theme === 'light' ? 'bg-indigo-50/60' : 'bg-indigo-900/15'
    : '';

  const hoverBg = theme === 'light' ? 'hover:bg-gray-50/80' :
                  theme === 'gray' ? 'hover:bg-gray-700/30' :
                  'hover:bg-white/3';

  return (
    <tr className={`group transition-colors ${rowBg} ${!isActive ? hoverBg : ''}`}>
      {/* # */}
      <td className={`px-2 py-1.5 text-[11px] text-center w-8 font-mono tabular-nums
        ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}`}>
        {index + 1}
      </td>

      {/* Name */}
      <td className="px-3 py-1.5 min-w-48">
        {editingName ? (
          <input
            type="text"
            value={nameVal}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => e.key === 'Enter' && handleNameBlur()}
            autoFocus
            className={`${baseInput} w-full font-sans`}
          />
        ) : (
          <div
            className="flex items-center gap-2 cursor-text"
            onDoubleClick={() => { setEditingName(true); setNameVal(item.name); }}
            title="Двойной клик для редактирования"
          >
            {isActive && (
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: accentColor }} />
            )}
            <span className={`text-xs leading-snug ${
              theme === 'light' ? 'text-gray-800' : 'text-gray-200'
            }`}>
              {item.name}
            </span>
            {item.clarify && (
              <span className="text-amber-500 text-[9px] font-medium px-1 py-0.5 rounded bg-amber-500/10 flex-shrink-0">
                уточнять
              </span>
            )}
            {item.link && (
              <a href={item.link} target="_blank" rel="noopener noreferrer"
                className="text-indigo-400 text-[10px] hover:text-indigo-300 flex-shrink-0">↗</a>
            )}
          </div>
        )}
      </td>

      {/* Unit */}
      <td className={`px-2 py-1.5 text-[11px] text-center w-16 whitespace-nowrap
        ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
        {item.unit}
      </td>

      {/* Price */}
      <td className="px-1 py-1 w-28">
        <input
          type="number"
          value={item.price || ''}
          onChange={handlePriceChange}
          placeholder={item.clarify ? '—' : '0'}
          className={baseInput}
          min={0}
          step={1}
        />
      </td>

      {/* Quantity */}
      <td className="px-1 py-1 w-24">
        <input
          type="number"
          value={item.quantity || ''}
          onChange={handleQtyChange}
          placeholder="0"
          className={`${baseInput} ${isActive ? 'border-emerald-500/30 bg-emerald-900/10' : ''}`}
          min={0}
          step={0.1}
        />
      </td>

      {/* Total */}
      <td className={`px-3 py-1.5 text-xs text-right w-28 font-mono font-semibold tabular-nums ${
        isActive ? 'text-emerald-400' :
        theme === 'light' ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {isActive ? total.toLocaleString('ru-RU') : '—'}
      </td>

      {/* Actions */}
      <td className="px-1 py-1 w-8">
        {onDelete && (
          <button
            onClick={() => onDelete(item.id)}
            className={`
              w-6 h-6 rounded-md flex items-center justify-center text-xs
              opacity-0 group-hover:opacity-100 transition-all
              hover:bg-red-500/15 hover:text-red-400
              ${theme === 'light' ? 'text-gray-300' : 'text-gray-600'}
            `}
            title="Удалить строку"
          >
            ×
          </button>
        )}
      </td>
    </tr>
  );
};

export default React.memo(LineItemRow);
