import React from 'react';
import { LineItem } from '../types';
import { useTheme } from '../context/ThemeContext';

interface SummaryPanelProps {
  items: LineItem[];
  vatRate: number;
  showVat: boolean;
  onVatRateChange: (v: number) => void;
  onShowVatChange: (v: boolean) => void;
  standArea: number;
  onStandAreaChange: (v: number) => void;
  wallHeight: number;
  onWallHeightChange: (v: number) => void;
  clientName: string;
  onClientNameChange: (v: string) => void;
  eventName: string;
  onEventNameChange: (v: string) => void;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({
  items, vatRate, showVat, onVatRateChange, onShowVatChange,
  standArea, onStandAreaChange, wallHeight, onWallHeightChange,
  clientName, onClientNameChange, eventName, onEventNameChange,
}) => {
  const { theme, accentColor } = useTheme();

  const activeItems = items.filter(i => i.quantity > 0 && i.price > 0);
  const total = activeItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const vat = showVat ? total * (vatRate / 100) : 0;
  const grandTotal = total + vat;

  // Group by category
  const groups: Record<string, number> = {};
  activeItems.forEach(item => {
    groups[item.category] = (groups[item.category] || 0) + item.price * item.quantity;
  });

  const inputClass = `
    w-full px-2 py-1.5 rounded-lg text-sm outline-none transition-all border
    ${theme === 'light'
      ? 'bg-white border-gray-200 text-gray-900 focus:border-indigo-400'
      : theme === 'gray'
      ? 'bg-gray-600 border-gray-500 text-gray-100 focus:border-indigo-400'
      : 'bg-white/5 border-white/10 text-white focus:border-indigo-500'}
  `;

  const labelClass = `text-xs font-medium mb-1 block ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`;

  const cardClass = `
    rounded-xl border p-4 mb-4
    ${theme === 'light' ? 'bg-white border-gray-200' :
      theme === 'gray' ? 'bg-gray-700 border-gray-600' :
      'bg-gray-800/60 border-white/10'}
  `;

  return (
    <div className="space-y-4">
      {/* Project info */}
      <div className={cardClass}>
        <h3 className={`font-semibold text-sm mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          📋 Параметры проекта
        </h3>
        <div className="space-y-2">
          <div>
            <label className={labelClass}>Клиент</label>
            <input type="text" value={clientName} onChange={e => onClientNameChange(e.target.value)}
              placeholder="Название компании..." className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Мероприятие</label>
            <input type="text" value={eventName} onChange={e => onEventNameChange(e.target.value)}
              placeholder="Название выставки..." className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelClass}>Площадь (м²)</label>
              <input type="number" value={standArea || ''} onChange={e => onStandAreaChange(parseFloat(e.target.value) || 0)}
                placeholder="36" className={inputClass} min={0} />
            </div>
            <div>
              <label className={labelClass}>Высота стен (м)</label>
              <input type="number" value={wallHeight || ''} onChange={e => onWallHeightChange(parseFloat(e.target.value) || 0)}
                placeholder="3.0" className={inputClass} min={0} step={0.1} />
            </div>
          </div>
        </div>
      </div>

      {/* VAT */}
      <div className={cardClass}>
        <h3 className={`font-semibold text-sm mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          💰 НДС
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <input
            type="checkbox"
            id="showVat"
            checked={showVat}
            onChange={e => onShowVatChange(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showVat" className={`text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
            Включить НДС
          </label>
        </div>
        {showVat && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={vatRate}
              onChange={e => onVatRateChange(parseFloat(e.target.value) || 20)}
              className={inputClass + ' max-w-20'}
              min={0}
              max={100}
            />
            <span className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>%</span>
          </div>
        )}
      </div>

      {/* Summary breakdown */}
      {Object.keys(groups).length > 0 && (
        <div className={cardClass}>
          <h3 className={`font-semibold text-sm mb-3 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
            📊 По разделам
          </h3>
          <div className="space-y-1.5">
            {Object.entries(groups).sort((a, b) => b[1] - a[1]).map(([cat, amt]) => (
              <div key={cat} className="flex items-center justify-between gap-2">
                <span className={`text-xs truncate ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  {cat}
                </span>
                <span className={`text-xs font-mono font-medium whitespace-nowrap ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                  {amt.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grand total */}
      <div className={`rounded-xl border p-4 ${
        theme === 'light' ? 'bg-indigo-50 border-indigo-200' :
        theme === 'gray' ? 'bg-indigo-900/30 border-indigo-700' :
        'bg-indigo-900/20 border-indigo-700/50'
      }`}>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
              Позиций активно:
            </span>
            <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
              {activeItems.length}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>Итого:</span>
            <span className="font-bold text-lg" style={{ color: accentColor }}>
              {total.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          {showVat && (
            <>
              <div className="flex justify-between items-center">
                <span className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                  НДС {vatRate}%:
                </span>
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                  {vat.toLocaleString('ru-RU')} ₽
                </span>
              </div>
              <div className={`pt-2 border-t flex justify-between items-center ${
                theme === 'light' ? 'border-indigo-200' : 'border-indigo-700/50'
              }`}>
                <span className={`font-semibold text-sm ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}>
                  Итого с НДС:
                </span>
                <span className="font-bold text-xl text-emerald-400">
                  {grandTotal.toLocaleString('ru-RU')} ₽
                </span>
              </div>
            </>
          )}
          {standArea > 0 && total > 0 && (
            <div className="flex justify-between items-center pt-1">
              <span className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                Цена за м²:
              </span>
              <span className={`text-xs font-mono ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                {Math.round(total / standArea).toLocaleString('ru-RU')} ₽/м²
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Furniture links */}
      <div className={cardClass}>
        <h3 className={`font-semibold text-sm mb-2 ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>
          🔗 Аренда мебели
        </h3>
        <div className="space-y-1.5">
          <a
            href="https://expokomplekt.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            📦 Экспокомплект — Москва
          </a>
          <a
            href="https://besti.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            🪑 Бести — Санкт-Петербург
          </a>
          <a
            href="https://leroymerlin.ru"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            🌿 Леруа Мерлен — материалы
          </a>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
