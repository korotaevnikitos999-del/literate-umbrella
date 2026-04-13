export type Theme = 'light' | 'dark' | 'gray';

export type UnitType = 'п.м' | 'лист' | 'м.кб' | 'шт' | 'м.п' | 'рулон' | 'литр' | 'ведро' | 'шт/день' | 'чел/день' | 'чел' | 'день' | 'букта' | 'п.м/день' | 'кв.м';

export interface LineItem {
  id: string;
  name: string;
  unit: UnitType;
  price: number;
  quantity: number;
  note?: string;
  category: string;
  subCategory?: string;
  clarify?: boolean; // "уточнять"
  link?: string;
}

export interface Category {
  id: string;
  name: string;
  items: LineItem[];
}

export interface ProjectData {
  projectName: string;
  clientName: string;
  eventName: string;
  standArea: number;
  wallHeight: number;
  date: string;
  categories: Category[];
}

export interface CalculatorState {
  theme: Theme;
  activeTab: string;
  items: LineItem[];
  projectName: string;
  clientName: string;
  eventName: string;
  standArea: number;
  wallHeight: number;
  vatRate: number;
  showVat: boolean;
  history: LineItem[][];
}
