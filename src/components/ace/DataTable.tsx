'use client';

import { useState, useMemo, type ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ace/EmptyState';
import { cn } from '@/lib/utils';
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Inbox,
} from 'lucide-react';

export interface ColumnDef<T> {
  header: string;
  accessor: keyof T | string;
  render?: (value: unknown, row: T) => ReactNode;
  sortable?: boolean;
  className?: string;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  pageSize?: number;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

function getNestedValue<T>(obj: T, path: string): unknown {
  return path
    .split('.')
    .reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  searchable = true,
  searchPlaceholder = 'Search...',
  searchKeys,
  pageSize = 10,
  loading = false,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display yet.',
  emptyAction,
  className,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data by search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;

    const term = searchTerm.toLowerCase();
    const keys = searchKeys || columns.map((c) => c.accessor as keyof T);

    return data.filter((row) =>
      keys.some((key) => {
        const value = getNestedValue(row, key as string);
        return value != null && String(value).toLowerCase().includes(term);
      })
    );
  }, [data, searchTerm, searchKeys, columns]);

  // Sort filtered data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = getNestedValue(a, sortColumn);
      const bVal = getNestedValue(b, sortColumn);

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortDirection === 'asc' ? -1 : 1;
      if (bVal == null) return sortDirection === 'asc' ? 1 : -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();
      if (sortDirection === 'asc') return aStr.localeCompare(bStr);
      return bStr.localeCompare(aStr);
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Reset to page 1 when search changes
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleSort = (accessor: string) => {
    if (sortColumn === accessor) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(accessor);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (accessor: string) => {
    if (sortColumn !== accessor) {
      return <ChevronsUpDown className="h-4 w-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="h-4 w-4 text-gray-700" />;
    }
    return <ChevronDown className="h-4 w-4 text-gray-700" />;
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className={cn('space-y-4', className)}>
        {searchable && <Skeleton className="h-10 w-full max-w-sm" />}
        <div className="rounded-lg border">
          <div className="border-b bg-gray-50 px-4 py-3">
            <div className="flex gap-6">
              {columns.map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
          {Array.from({ length: 5 }).map((_, rowIdx) => (
            <div key={rowIdx} className="border-b last:border-b-0 px-4 py-3">
              <div className="flex gap-6">
                {columns.map((_, colIdx) => (
                  <Skeleton key={colIdx} className="h-4 w-24" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      {searchable && (
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                {columns.map((col) => {
                  const sortable = col.sortable !== false;
                  return (
                    <th
                      key={String(col.accessor)}
                      className={cn(
                        'px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500',
                        sortable && 'cursor-pointer select-none hover:text-gray-700',
                        col.className
                      )}
                      onClick={sortable ? () => handleSort(String(col.accessor)) : undefined}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {sortable && getSortIcon(String(col.accessor))}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <EmptyState
                      icon={Inbox}
                      title={emptyTitle}
                      description={
                        searchTerm
                          ? `No results found for "${searchTerm}". Try a different search term.`
                          : emptyDescription
                      }
                      action={!searchTerm ? emptyAction : undefined}
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => {
                      const value = getNestedValue(row, String(col.accessor));
                      return (
                        <td
                          key={String(col.accessor)}
                          className={cn('px-4 py-3 text-sm text-gray-700', col.className)}
                        >
                          {col.render ? col.render(value, row) : (value as ReactNode) ?? '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {sortedData.length > pageSize && (
        <div className="flex items-center justify-between px-1">
          <p className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and neighbors
                  if (page === 1 || page === totalPages) return true;
                  if (Math.abs(page - currentPage) <= 1) return true;
                  return false;
                })
                .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                  if (idx > 0) {
                    const prev = arr[idx - 1];
                    if (page - prev > 1) {
                      acc.push('ellipsis');
                    }
                  }
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={item}
                      variant={currentPage === item ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(item)}
                      className={cn(
                        'min-w-[36px]',
                        currentPage === item && 'text-white'
                      )}
                      style={
                        currentPage === item
                          ? { backgroundColor: '#1F4D3F' }
                          : undefined
                      }
                    >
                      {item}
                    </Button>
                  )
                )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
