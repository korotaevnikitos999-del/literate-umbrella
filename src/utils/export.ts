import * as XLSX from 'xlsx';
import { LineItem } from '../types';

export interface ExportData {
  projectName: string;
  clientName: string;
  eventName: string;
  standArea: number;
  wallHeight: number;
  items: LineItem[];
  vatRate: number;
  showVat: boolean;
}

function getActiveItems(items: LineItem[]) {
  return items.filter(i => i.quantity > 0 && i.price > 0);
}

function calcTotal(items: LineItem[]) {
  return items.reduce((s, i) => s + i.price * i.quantity, 0);
}

export function exportToExcel(data: ExportData) {
  const wb = XLSX.utils.book_new();
  const active = getActiveItems(data.items);
  const total = calcTotal(active);
  const vat = data.showVat ? total * (data.vatRate / 100) : 0;

  // Group by category
  const groups: Record<string, LineItem[]> = {};
  active.forEach(item => {
    if (!groups[item.category]) groups[item.category] = [];
    groups[item.category].push(item);
  });

  const rows: (string | number)[][] = [];
  rows.push(['СМЕТА ЗАТРАТ — ВЫСТАВОЧНЫЙ СТЕНД']);
  rows.push([]);
  rows.push(['Проект:', data.projectName]);
  rows.push(['Клиент:', data.clientName]);
  rows.push(['Мероприятие:', data.eventName]);
  rows.push(['Площадь стенда:', data.standArea + ' кв.м']);
  rows.push(['Высота стен:', data.wallHeight + ' м']);
  rows.push([]);
  rows.push(['№', 'Наименование', 'Ед. изм', 'Кол-во', 'Цена', 'Стоимость']);

  let idx = 1;
  Object.entries(groups).forEach(([cat, items]) => {
    rows.push([cat, '', '', '', '', '']);
    items.forEach(item => {
      rows.push([
        idx++,
        item.name,
        item.unit,
        item.quantity,
        item.price,
        item.price * item.quantity,
      ]);
    });
  });

  rows.push([]);
  rows.push(['', '', '', '', 'ИТОГО:', total]);
  if (data.showVat) {
    rows.push(['', '', '', '', `НДС ${data.vatRate}%:`, vat]);
    rows.push(['', '', '', '', 'ИТОГО с НДС:', total + vat]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 4 },
    { wch: 50 },
    { wch: 10 },
    { wch: 8 },
    { wch: 14 },
    { wch: 14 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Смета');
  XLSX.writeFile(wb, `Смета_${data.projectName || 'стенд'}.xlsx`);
}

export function exportToPDF(data: ExportData) {
  // Dynamic import to avoid SSR issues
  import('jspdf').then(({ jsPDF }) => {
    import('jspdf-autotable').then(() => {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // Add Cyrillic font support via base64 - we'll use a workaround
      doc.setFont('helvetica');
      
      const active = getActiveItems(data.items);
      const total = calcTotal(active);
      const vat = data.showVat ? total * (data.vatRate / 100) : 0;

      // Header
      doc.setFontSize(16);
      doc.text('SMETA ZATRAT - VYSTAVOCHNY STEND', 105, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text(`Proekt: ${data.projectName}`, 14, 32);
      doc.text(`Klient: ${data.clientName}`, 14, 38);
      doc.text(`Meropriyatie: ${data.eventName}`, 14, 44);
      doc.text(`Ploshchad: ${data.standArea} kv.m | Vysota: ${data.wallHeight} m`, 14, 50);

      // Table
      const tableData = active.map((item, i) => [
        i + 1,
        item.name,
        item.unit,
        item.quantity,
        item.price.toLocaleString('ru-RU') + ' р',
        (item.price * item.quantity).toLocaleString('ru-RU') + ' р',
      ]);

      (doc as any).autoTable({
        head: [['#', 'Naimenovanie', 'Ed.izm', 'Kol-vo', 'Tsena', 'Stoimost']],
        body: tableData,
        startY: 56,
        styles: { fontSize: 8, cellPadding: 2 },
        headStyles: { fillColor: [30, 64, 175] },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: {
          0: { cellWidth: 8 },
          1: { cellWidth: 80 },
          2: { cellWidth: 18 },
          3: { cellWidth: 15 },
          4: { cellWidth: 25 },
          5: { cellWidth: 30 },
        },
      });

      const finalY = (doc as any).lastAutoTable.finalY + 6;
      doc.setFontSize(11);
      doc.text(`ITOGO: ${total.toLocaleString('ru-RU')} r.`, 14, finalY);
      if (data.showVat) {
        doc.text(`NDS ${data.vatRate}%: ${vat.toLocaleString('ru-RU')} r.`, 14, finalY + 6);
        doc.text(`ITOGO s NDS: ${(total + vat).toLocaleString('ru-RU')} r.`, 14, finalY + 12);
      }

      doc.save(`Smeta_${data.projectName || 'stend'}.pdf`);
    });
  });
}
