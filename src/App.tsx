import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LineItem } from './types';
import { DEFAULT_ITEMS, CATEGORIES } from './data/pricelist';
import { exportToExcel, exportToPDF } from './utils/export';
import Header from './components/Header';
import TabBar from './components/TabBar';
import CategoryTable from './components/CategoryTable';
import Sidebar from './components/Sidebar';
import NeonBackground from './components/NeonBackground';
import SearchBar from './components/SearchBar';

const ALL_TAB = 'Все разделы';
const TABS = [ALL_TAB, ...CATEGORIES];

let newItemCounter = 10000;
function generateId() {
  return `new_${newItemCounter++}`;
}

function deepClone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v));
}

const AppInner: React.FC = () => {
  const { theme } = useTheme();

  // State
  const [items, setItems] = useState<LineItem[]>(() => {
    try {
      const saved = localStorage.getItem('expocalc_items_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return deepClone(DEFAULT_ITEMS);
  });

  const [projectName, setProjectName] = useState(() => localStorage.getItem('expocalc_project') || '');
  const [clientName, setClientName] = useState(() => localStorage.getItem('expocalc_client') || '');
  const [eventName, setEventName] = useState(() => localStorage.getItem('expocalc_event') || '');
  const [standArea, setStandArea] = useState(() => parseFloat(localStorage.getItem('expocalc_area') || '0'));
  const [wallHeight, setWallHeight] = useState(() => parseFloat(localStorage.getItem('expocalc_height') || '3'));
  const [vatRate, setVatRate] = useState(20);
  const [showVat, setShowVat] = useState(false);
  const [activeTab, setActiveTab] = useState(ALL_TAB);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<LineItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Persist
  useEffect(() => {
    try { localStorage.setItem('expocalc_items_v2', JSON.stringify(items)); } catch {}
  }, [items]);
  useEffect(() => { localStorage.setItem('expocalc_project', projectName); }, [projectName]);
  useEffect(() => { localStorage.setItem('expocalc_client', clientName); }, [clientName]);
  useEffect(() => { localStorage.setItem('expocalc_event', eventName); }, [eventName]);
  useEffect(() => { localStorage.setItem('expocalc_area', String(standArea)); }, [standArea]);
  useEffect(() => { localStorage.setItem('expocalc_height', String(wallHeight)); }, [wallHeight]);

  // Save snapshot to history before changes
  const saveToHistory = useCallback((currentItems: LineItem[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(deepClone(currentItems));
      return newHistory.slice(-50); // keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  const handleItemChange = useCallback((id: string, field: 'quantity' | 'price' | 'name', value: number | string) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, []);

  const handleItemDelete = useCallback((id: string) => {
    setItems(prev => {
      saveToHistory(prev);
      return prev.filter(item => item.id !== id);
    });
  }, [saveToHistory]);

  const handleItemAdd = useCallback((category: string) => {
    const newItem: LineItem = {
      id: generateId(),
      category,
      name: 'Новая позиция',
      unit: 'шт',
      price: 0,
      quantity: 0,
    };
    setItems(prev => {
      // Insert after last item in same category
      const lastIdx = prev.map((i, idx) => i.category === category ? idx : -1).filter(i => i >= 0).pop() ?? prev.length - 1;
      const next = [...prev];
      next.splice(lastIdx + 1, 0, newItem);
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Сбросить все количества к нулю?')) {
      setItems(prev => {
        saveToHistory(prev);
        return prev.map(i => ({ ...i, quantity: 0 }));
      });
    }
  }, [saveToHistory]);

  const handleFullReset = useCallback(() => {
    if (window.confirm('Полный сброс всех данных? Это удалит все изменения.')) {
      setItems(deepClone(DEFAULT_ITEMS));
      setProjectName('');
      setClientName('');
      setEventName('');
      setStandArea(0);
      setWallHeight(3);
      localStorage.clear();
    }
  }, []);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex >= 0) {
      setItems(deepClone(history[historyIndex]));
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleUndo]);

  // Totals
  const total = useMemo(() =>
    items.filter(i => i.quantity > 0 && i.price > 0)
      .reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
  const vatTotal = useMemo(() => Math.round(total * (1 + vatRate / 100)), [total, vatRate]);

  // Tab totals
  const tabTotals = useMemo(() => {
    const result: Record<string, number> = {};
    CATEGORIES.forEach(cat => {
      const catTotal = items
        .filter(i => i.category === cat && i.quantity > 0 && i.price > 0)
        .reduce((s, i) => s + i.price * i.quantity, 0);
      if (catTotal > 0) result[cat] = catTotal;
    });
    result[ALL_TAB] = total;
    return result;
  }, [items, total]);

  // Search
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q) ||
      i.unit.toLowerCase().includes(q)
    );
  }, [items, searchQuery]);

  // Categories to show
  const filteredCategories = useMemo(() => {
    const sourceItems = searchQuery ? searchedItems : items;
    if (activeTab === ALL_TAB) {
      return CATEGORIES.filter(cat => sourceItems.some(i => i.category === cat));
    }
    return [activeTab];
  }, [activeTab, items, searchedItems, searchQuery]);

  const getItemsForCategory = useCallback((cat: string) => {
    const source = searchQuery ? searchedItems : items;
    return source.filter(i => i.category === cat);
  }, [items, searchedItems, searchQuery]);

  const handleExportExcel = useCallback(() => {
    exportToExcel({ projectName, clientName, eventName, standArea, wallHeight, items, vatRate, showVat });
  }, [projectName, clientName, eventName, standArea, wallHeight, items, vatRate, showVat]);

  const handleExportPDF = useCallback(() => {
    exportToPDF({ projectName, clientName, eventName, standArea, wallHeight, items, vatRate, showVat });
  }, [projectName, clientName, eventName, standArea, wallHeight, items, vatRate, showVat]);

  const bgClass = theme === 'light'
    ? 'bg-gray-100'
    : theme === 'gray'
    ? 'bg-gray-800'
    : 'bg-[#07071a]';

  const textClass = theme === 'light' ? 'text-gray-700' : 'text-gray-300';

  return (
    <div className={`h-screen flex flex-col overflow-hidden relative ${bgClass}`}>
      {theme === 'dark' && <NeonBackground />}

      {/* Header */}
      <Header
        projectName={projectName}
        onProjectNameChange={setProjectName}
        total={total}
        vatTotal={showVat ? vatTotal : total}
        showVat={showVat}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
      />

      {/* Tab bar */}
      <TabBar
        tabs={TABS}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabTotals={tabTotals}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Main table area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {/* Search */}
              <div className="flex-1 min-w-48 max-w-md">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  resultCount={searchedItems.length}
                />
              </div>

              <div className="flex-1" />

              {/* Actions */}
              <div className="flex items-center gap-2">
                {historyIndex >= 0 && (
                  <button
                    onClick={handleUndo}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                      theme === 'light'
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-amber-900/20 hover:bg-amber-900/30 text-amber-400 border border-amber-800/30'
                    }`}
                    title="Отменить (Ctrl+Z)"
                  >
                    ↩ Отменить
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                    theme === 'light'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                  }`}
                  title="Сбросить количества"
                >
                  ↺ Сброс кол-ва
                </button>
                <button
                  onClick={handleFullReset}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-1 ${
                    theme === 'light'
                      ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                      : 'bg-red-900/20 hover:bg-red-900/30 text-red-400 border border-red-800/30'
                  }`}
                  title="Полный сброс"
                >
                  🗑 Полный сброс
                </button>
                <button
                  onClick={() => setSidebarOpen(o => !o)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    theme === 'light'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/10'
                  }`}
                >
                  {sidebarOpen ? '▶ Панель' : '◀ Панель'}
                </button>
              </div>
            </div>

            {/* Hotkey hint */}
            <div className={`mb-3 px-3 py-2 rounded-lg text-xs flex items-center gap-3 ${
              theme === 'light' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
              theme === 'gray' ? 'bg-blue-900/20 text-blue-300 border border-blue-800/30' :
              'bg-blue-900/15 text-blue-400 border border-blue-800/20'
            }`}>
              <span>⌨️ ← → навигация по вкладкам</span>
              <span className={theme === 'light' ? 'text-blue-300' : 'text-blue-700'}>|</span>
              <span>Ctrl+Z — отменить</span>
              <span className={theme === 'light' ? 'text-blue-300' : 'text-blue-700'}>|</span>
              <span>🔍 поиск по названию</span>
            </div>

            {/* Section heading */}
            <div className="flex items-center justify-between mb-3">
              <h2 className={`text-sm font-semibold ${textClass}`}>
                {searchQuery
                  ? `🔍 Результаты поиска: "${searchQuery}"`
                  : activeTab === ALL_TAB
                  ? `📂 Все разделы (${CATEGORIES.length})`
                  : `📁 ${activeTab}`}
              </h2>
              {activeTab !== ALL_TAB && (
                <button
                  onClick={() => handleItemAdd(activeTab)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-medium ${
                    theme === 'light'
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200'
                      : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  + Добавить позицию
                </button>
              )}
            </div>

            {/* No results */}
            {searchQuery && searchedItems.length === 0 && (
              <div className={`text-center py-16 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="text-4xl mb-3">🔍</div>
                <div className="text-sm">Ничего не найдено по запросу "{searchQuery}"</div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-3 text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Очистить поиск
                </button>
              </div>
            )}

            {/* Category tables */}
            {filteredCategories.map(cat => {
              const catItems = getItemsForCategory(cat);
              if (catItems.length === 0) return null;
              return (
                <CategoryTable
                  key={cat}
                  category={cat}
                  items={catItems}
                  onChange={handleItemChange}
                  onDelete={handleItemDelete}
                  onAdd={handleItemAdd}
                />
              );
            })}

            {/* Grand total footer */}
            {total > 0 && (
              <div className={`mt-6 p-5 rounded-2xl border ${
                theme === 'light' ? 'bg-white border-gray-200 shadow-sm' :
                theme === 'gray' ? 'bg-gray-700 border-gray-600' :
                'bg-gray-800/80 border-white/10'
              }`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className={`text-xs uppercase tracking-wide mb-1 ${theme === 'light' ? 'text-gray-400' : 'text-gray-500'}`}>
                      Итого по смете
                    </div>
                    <div className={`text-sm ${textClass}`}>
                      {items.filter(i => i.quantity > 0 && i.price > 0).length} активных позиций
                      {standArea > 0 && ` · ${Math.round(total / standArea).toLocaleString('ru-RU')} ₽/м²`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-3xl font-mono text-emerald-400">
                      {total.toLocaleString('ru-RU')} ₽
                    </div>
                    {showVat && (
                      <div className={`text-sm mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                        С НДС {vatRate}%: <span className="font-semibold text-emerald-300">{vatTotal.toLocaleString('ru-RU')} ₽</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {total === 0 && !searchQuery && (
              <div className={`text-center py-20 ${theme === 'light' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="text-5xl mb-4">📋</div>
                <div className="text-base font-medium mb-2">Введите количество позиций для расчёта</div>
                <div className="text-sm">Заполните поле "Кол-во" напротив нужных наименований</div>
              </div>
            )}

            <div className="h-10" />
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <Sidebar
            items={items}
            vatRate={vatRate}
            showVat={showVat}
            onVatRateChange={setVatRate}
            onShowVatChange={setShowVat}
            standArea={standArea}
            onStandAreaChange={setStandArea}
            wallHeight={wallHeight}
            onWallHeightChange={setWallHeight}
            clientName={clientName}
            onClientNameChange={setClientName}
            eventName={eventName}
            onEventNameChange={setEventName}
          />
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppInner />
  </ThemeProvider>
);

export default App;
