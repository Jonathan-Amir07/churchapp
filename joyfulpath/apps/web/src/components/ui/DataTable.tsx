'use client';

import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

interface Column<T> {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchPlaceholder?: string;
  onBulkAction?: (selectedIds: string[]) => void;
  bulkActionLabel?: string;
  onExportPdf?: () => void;
  onExportExcel?: () => void;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchPlaceholder = 'ابحث...',
  onBulkAction,
  bulkActionLabel = 'إجراء جماعي',
  onExportPdf,
  onExportExcel
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredData = data.filter((item) =>
    Object.values(item).some(
      (val) => typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map((item) => item.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-72">
          <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">
            search
          </span>
          <Input
            className="pl-3 pr-10 bg-surface-container-lowest"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {selectedIds.size > 0 && onBulkAction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onBulkAction(Array.from(selectedIds))}
              className="text-primary border-primary hover:bg-primary/10"
            >
              {bulkActionLabel} ({selectedIds.size})
            </Button>
          )}
          {onExportPdf && (
            <Button variant="outline" size="sm" onClick={onExportPdf} className="flex gap-1" title="تصدير PDF">
              <span className="material-symbols-outlined text-[18px] text-red-500">picture_as_pdf</span>
            </Button>
          )}
          {onExportExcel && (
            <Button variant="outline" size="sm" onClick={onExportExcel} className="flex gap-1" title="تصدير Excel">
              <span className="material-symbols-outlined text-[18px] text-green-600">table_view</span>
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-outline-variant/40 rounded-xl bg-surface-container-lowest shadow-sm">
        <table className="w-full text-sm text-right">
          <thead className="text-xs text-on-surface-variant bg-surface-container uppercase border-b border-outline-variant/40">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                  checked={selectedIds.size === filteredData.length && filteredData.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              {columns.map((col, i) => (
                <th key={i} className="p-4 font-bold whitespace-nowrap">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-on-surface-variant">
                  لا توجد بيانات مطابقة للبحث
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-outline-variant/20 hover:bg-surface-container-lowest/50 transition-colors">
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="rounded border-outline-variant text-primary focus:ring-primary cursor-pointer w-4 h-4"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  {columns.map((col, i) => (
                    <td key={i} className="p-4 text-on-surface font-medium whitespace-nowrap">
                      {col.cell ? col.cell(item) : String(item[col.key as keyof T])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
