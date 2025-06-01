import React, { ReactNode } from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
}

function Table<T>({
  data,
  columns,
  keyExtractor,
  className = '',
  striped = true,
  hoverable = true,
  compact = false,
  emptyMessage = 'No data available',
  onRowClick,
}: TableProps<T>) {
  const renderCell = (item: T, column: Column<T>) => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item);
    }
    
    return item[column.accessor] as ReactNode;
  };

  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-slate-700 ${className}`}>
        <thead className="bg-slate-800">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className={`
                  ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                  text-left text-xs font-medium text-stone-300 uppercase tracking-wider
                  ${column.className || ''}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700">
          {data.length > 0 ? (
            data.map((item, rowIndex) => (
              <tr
                key={keyExtractor(item)}
                className={`
                  ${striped && rowIndex % 2 === 1 ? 'bg-slate-750' : ''}
                  ${hoverable ? 'hover:bg-slate-700 transition-colors duration-150' : ''}
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    className={`
                      ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                      text-sm text-stone-200
                      ${column.className || ''}
                    `}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-sm text-stone-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;