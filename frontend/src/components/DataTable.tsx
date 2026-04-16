import "../styles/components/DataTable.css";

interface DataTableProps {
    columns: any, // TODO: Define a proper type for columns
    data: any, // TODO: Define a proper type for data
    isLoading: boolean,
    skeletonRows?: number
}

export default function DataTable({ columns, data, isLoading, skeletonRows = 5 }: DataTableProps) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width || "auto" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // Render Skeleton Loaders
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <tr key={`skeleton-${rowIndex}`} className="skeleton-row">
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="skeleton-cell"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            // Render Actual Data
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Empty State
            <tr>
              <td colSpan={columns.length} className="empty-state">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};