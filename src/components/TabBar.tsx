import React, { useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabTotals: Record<string, number>;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange, tabTotals }) => {
  const { theme, accentColor } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const idx = tabs.indexOf(activeTab);
      if (e.key === 'ArrowRight' && idx < tabs.length - 1) {
        onTabChange(tabs[idx + 1]);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        onTabChange(tabs[idx - 1]);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, tabs, onTabChange]);

  // Scroll active tab into view
  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector('[data-active="true"]') as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <div className={`
      flex-shrink-0 border-b overflow-x-auto scrollbar-hide
      ${theme === 'light' ? 'bg-gray-50 border-gray-200' :
        theme === 'gray' ? 'bg-gray-800 border-gray-600' :
        'bg-gray-900 border-white/10'}
    `}>
      <div ref={containerRef} className="flex min-w-max px-2 py-1 gap-1">
        {tabs.map(tab => {
          const isActive = tab === activeTab;
          const tabTotal = tabTotals[tab] || 0;
          const hasItems = tabTotal > 0;
          return (
            <button
              key={tab}
              data-active={isActive}
              onClick={() => onTabChange(tab)}
              className={`
                relative px-3 py-2 rounded-t-lg text-xs font-medium whitespace-nowrap transition-all
                flex items-center gap-1.5 border-b-2
                ${isActive
                  ? theme === 'light'
                    ? 'text-gray-900 bg-white border-b-2'
                    : theme === 'gray'
                    ? 'text-white bg-gray-700'
                    : 'text-white bg-gray-800'
                  : theme === 'light'
                  ? 'text-gray-500 hover:text-gray-700 hover:bg-white/70 border-transparent'
                  : theme === 'gray'
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50 border-transparent'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-transparent'}
              `}
              style={isActive ? { borderBottomColor: accentColor, color: accentColor } : {}}
            >
              {tab}
              {hasItems && (
                <span
                  className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] text-white font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  {tabTotal >= 1000000
                    ? (tabTotal / 1000000).toFixed(1) + 'М'
                    : tabTotal >= 1000
                    ? (tabTotal / 1000).toFixed(0) + 'К'
                    : tabTotal.toString()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabBar;
