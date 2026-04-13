import React, { useState } from 'react';
import { LineItem } from '../types';
import { useTheme } from '../context/ThemeContext';
import SummaryPanel from './SummaryPanel';
import Calculator from './Calculator';

interface SidebarProps {
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

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { theme } = useTheme();
  const [activePanel, setActivePanel] = useState<'summary' | 'calculator'>('summary');

  const panelBtnClass = (panel: 'summary' | 'calculator') => `
    flex-1 py-2 text-xs font-medium rounded-lg transition-all
    ${activePanel === panel
      ? theme === 'light'
        ? 'bg-white text-gray-900 shadow'
        : 'bg-gray-700 text-white shadow'
      : theme === 'light'
      ? 'text-gray-500 hover:text-gray-700'
      : 'text-gray-400 hover:text-gray-200'}
  `;

  return (
    <div className={`
      w-72 flex-shrink-0 flex flex-col h-full border-l overflow-hidden
      ${theme === 'light' ? 'bg-gray-50 border-gray-200' :
        theme === 'gray' ? 'bg-gray-800 border-gray-600' :
        'bg-gray-900/80 border-white/10'}
    `}>
      {/* Panel switcher */}
      <div className={`p-2 border-b flex gap-1 ${
        theme === 'light' ? 'bg-gray-100 border-gray-200' :
        theme === 'gray' ? 'bg-gray-800 border-gray-600' :
        'bg-gray-900 border-white/10'
      }`}>
        <button className={panelBtnClass('summary')} onClick={() => setActivePanel('summary')}>
          📋 Смета
        </button>
        <button className={panelBtnClass('calculator')} onClick={() => setActivePanel('calculator')}>
          🧮 Расчёт
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0">
        {activePanel === 'summary' ? (
          <SummaryPanel {...props} />
        ) : (
          <div className={`rounded-xl border p-4 ${
            theme === 'light' ? 'bg-white border-gray-200' :
            theme === 'gray' ? 'bg-gray-700 border-gray-600' :
            'bg-gray-800/60 border-white/10'
          }`}>
            <Calculator
              standArea={props.standArea}
              wallHeight={props.wallHeight}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
