import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  resultCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, resultCount }) => {
  const { theme, accentColor } = useTheme();

  return (
    <div className={`
      flex items-center gap-2 px-3 py-2 rounded-xl border
      ${theme === 'light'
        ? 'bg-white border-gray-200'
        : theme === 'gray'
        ? 'bg-gray-700 border-gray-600'
        : 'bg-gray-800/60 border-white/10'}
    `}>
      <span className="text-base opacity-50">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Поиск по наименованию..."
        className={`flex-1 bg-transparent outline-none text-sm ${
          theme === 'light' ? 'text-gray-900 placeholder-gray-400' :
          'text-gray-100 placeholder-gray-500'
        }`}
      />
      {value && (
        <>
          <span
            className="text-xs font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {resultCount} позиций
          </span>
          <button
            onClick={() => onChange('')}
            className={`text-xs px-1.5 py-0.5 rounded transition-colors ${
              theme === 'light' ? 'text-gray-400 hover:text-gray-600' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
};

export default SearchBar;
