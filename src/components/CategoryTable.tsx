import React, { useState } from 'react';
import { LineItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import LineItemRow from './LineItemRow';

interface CategoryTableProps {
  category: string;
  items: LineItem[];
  onChange: (id: string, field: 'quantity' | 'price' | 'name', value: number | string) => void;
  onDelete: (id: string) => void;
  onAdd: (category: string) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Пол / Подиум': '🪵',
  'Стены ОСНОВА КОРОБ': '🧱',
  'Облицовка Фриза': '🎨',
  'Потолочные конструкции': '🏗️',
  'Фризовые элементы': '✨',
  'Мультимедиа': '📺',
  'Подвесные конструкции': '⛓️',
  'Флористика': '🌸',
  'Аренда мебели': '🪑',
  'Электрика': '💡',
  'Аккредитация': '📋',
  'Прочие работы и услуги': '🔧',
  'Накладные расходы': '📊',
  'Транспортные расходы': '🚛',
  'Командировочные расходы': '✈️',
  'Конструкторские чертежи': '📐',
  'ТИМИРЯЗЕВ ЦЕНТР': '🏛️',
  'Экспофорум': '🏢',
};

const CategoryTable: React.FC<CategoryTableProps> = ({
  category, items, onChange, onDelete, onAdd
}) => {
  const { theme, accentColor } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  const categoryTotal = items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const activeCount = items.filter(i => i.quantity > 0 && i.price > 0).length;
  const icon = CATEGORY_ICONS[category] || '📌';

  const borderClass = theme === 'light' ? 'border-gray-200' :
                      theme === 'gray' ? 'border-gray-600' :
                      'border-white/8';

  const headerBg = theme === 'light'
    ? 'bg-white hover:bg-gray-50'
    : theme === 'gray'
    ? 'bg-gray-700 hover:bg-gray-650'
    : 'bg-gray-800/50 hover:bg-gray-800/70';

  const thBg = theme === 'light' ? 'bg-gray-50 text-gray-500' :
               theme === 'gray' ? 'bg-gray-700/50 text-gray-400' :
               'bg-gray-800/60 text-gray-500';

  const tableBg = theme === 'light' ? 'bg-white' :
                  theme === 'gray' ? 'bg-gray-750' :
                  'bg-gray-900/40';

  return (
    <div className={`rounded-2xl border overflow-hidden mb-3 shadow-sm ${borderClass}`}
      style={activeCount > 0 ? { borderColor: `${accentColor}30` } : {}}>
      {/* Category header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-all ${headerBg}`}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg leading-none">{icon}</span>
          <span className={`font-semibold text-sm ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            {category}
          </span>
          {activeCount > 0 && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full text-white font-semibold"
              style={{ backgroundColor: accentColor }}
            >
              {activeCount} поз.
            </span>
          )}
          <span className={`text-xs ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`}>
            ({items.length} всего)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {categoryTotal > 0 && (
            <span className="text-emerald-400 font-mono font-bold text-sm">
              {categoryTotal.toLocaleString('ru-RU')} ₽
            </span>
          )}
          <span className={`text-xs transition-transform ${collapsed ? 'rotate-0' : 'rotate-180'} ${
            theme === 'light' ? 'text-gray-400' : 'text-gray-500'
          }`}>
            ▲
          </span>
        </div>
      </button>

      {!collapsed && (
        <>
          <div className={`overflow-x-auto ${tableBg}`}>
            <table className="w-full">
              <thead>
                <tr className={`${thBg} border-b ${borderClass}`}>
                  <th className="px-2 py-2 text-center w-8 font-medium text-xs">#</th>
                  <th className="px-3 py-2 text-left font-medium text-xs">Наименование</th>
                  <th className="px-2 py-2 text-center w-16 font-medium text-xs">Ед.изм</th>
                  <th className="px-2 py-2 text-center w-28 font-medium text-xs">Цена, ₽</th>
                  <th className="px-2 py-2 text-center w-24 font-medium text-xs">Кол-во</th>
                  <th className="px-2 py-2 text-right w-28 font-medium text-xs">Стоимость, ₽</th>
                  <th className="w-8" />
                </tr>
              </thead>
              <tbody className={`divide-y ${borderClass}`}>
                {items.map((item, idx) => (
                  <LineItemRow
                    key={item.id}
                    item={item}
                    index={idx}
                    onChange={onChange}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className={`
            px-4 py-2 border-t flex items-center justify-between
            ${borderClass}
            ${theme === 'light' ? 'bg-gray-50' : theme === 'gray' ? 'bg-gray-700/50' : 'bg-gray-800/30'}
          `}>
            <button
              onClick={() => onAdd(category)}
              className={`
                text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 font-medium
                ${theme === 'light'
                  ? 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700'
                  : 'text-indigo-400 hover:bg-indigo-500/10 hover:text-indigo-300'}
              `}
            >
              + Добавить строку
            </button>
            {categoryTotal > 0 && (
              <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                Итого раздел: <span className="text-emerald-400 font-mono font-semibold">
                  {categoryTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryTable;
