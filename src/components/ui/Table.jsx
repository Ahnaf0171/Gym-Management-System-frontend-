export function Table({ columns, data, onRowClick, className = "" }) {
  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className={`w-full text-sm md:text-base ${className}`}>
        <thead className="bg-[var(--color-surface-2)]">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs md:text-sm font-semibold text-[var(--color-text-secondary)] whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-[var(--color-text-muted)]"
              >
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id ?? rowIndex}
                onClick={() => onRowClick?.(row)}
                className={`border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)] transition-colors duration-150 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className="px-4 py-3 text-[var(--color-text-primary)] whitespace-nowrap"
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
