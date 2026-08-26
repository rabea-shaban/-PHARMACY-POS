import React from 'react';
import { Button } from '../../../components/ui/Button.js';
import { Printer, Download } from 'lucide-react';

export interface ReportExportActionsProps {
  onPrint?: () => void;
  onExportCsv?: () => void;
}

export const ReportExportActions: React.FC<ReportExportActionsProps> = ({
  onPrint,
  onExportCsv,
}) => {
  const handlePrint = () => {
    if (onPrint) onPrint();
    else window.print();
  };

  return (
    <div className="flex items-center gap-2 print:hidden">
      {onExportCsv && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExportCsv}
          leftIcon={<Download className="w-3.5 h-3.5" />}
        >
          تصدير CSV
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={handlePrint}
        leftIcon={<Printer className="w-3.5 h-3.5" />}
      >
        طباعة التقرير
      </Button>
    </div>
  );
};

export function exportToCsv(filename: string, rows: Record<string, any>[]) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map((row) =>
      headers
        .map((header) => {
          let val = row[header];
          if (val === null || val === undefined) val = '';
          if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
          return val;
        })
        .join(',')
    ),
  ].join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
