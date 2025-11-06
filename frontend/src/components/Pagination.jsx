import React from "react";
import "../styles/components/Pagination.css";

const Pagination = ({
  currentPage,
  totalPages,
  itemsPerPage,
  onRowsPerPageChange,
  onPageChange,
}) => {
  if (totalPages === 0) return null;

  // Helper: generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 2; // number of pages to show around current page
    const range = [];

    // Main range near the current page
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add ellipses where needed
    if (currentPage - delta > 2) range.unshift("left-ellipsis");
    if (currentPage + delta < totalPages - 1) range.push("right-ellipsis");

    // Always include first and last pages
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    // Remove duplicates and maintain order
    return [...new Set(range)];
  };

  const pages = getPageNumbers();

  return (
    <div className="pagination">
      {/* Rows per page */}
      <div className="rows-per-page">
        <label htmlFor="rowsPerPage">Rows:</label>
        <select
          id="rowsPerPage"
          value={itemsPerPage}
          onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* Prev button */}
      <button
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {/* Page numbers with ellipsis */}
      {pages.map((page, index) => {
        if (page === "left-ellipsis" || page === "right-ellipsis") {
          return (
            <span key={page + "-" + index} className="ellipsis">
              ...
            </span>
          );
        }

        return (
          <button
            key={`page-${page}-${index}`}
            className={currentPage === page ? "active" : ""}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        );
      })}

      {/* Next button */}
      <button
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;