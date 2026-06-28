import React from "react";

const getPages = (page, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  if (page <= 4) return [1, 2, 3, 4, 5, "end-gap", total];
  if (page >= total - 3) {
    return [1, "start-gap", total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, "start-gap", page - 1, page, page + 1, "end-gap", total];
};

const Pagination = ({ page, size, total, pages, onPage, onSize }) => {
  const start = total === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, total);

  return (
    <div className="lst-pager">
      <div className="lst-size">
        <div className="lst-size-box">
          <select
            value={size}
            onChange={(event) => onSize(Number(event.target.value))}
            aria-label="Rows per page"
          >
            <option value={10}>10 Per Page</option>
            <option value={50}>50 Per Page</option>
            <option value={100}>100 Per Page</option>
          </select>
          <img src="/assets/down_arrow_blac.png" alt="" />
        </div>
        <span>entries</span>
      </div>

      <nav className="lst-page-nav" aria-label="Table pagination">
        <button
          type="button"
          className="lst-page"
          onClick={() => onPage(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          &laquo;
        </button>
        <button
          type="button"
          className="lst-page"
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
        >
          &lsaquo;
        </button>

        {getPages(page, pages).map((item) =>
          typeof item === "number" ? (
            <button
              type="button"
              className={`lst-page ${item === page ? "lst-page-active" : ""}`}
              key={item}
              onClick={() => onPage(item)}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </button>
          ) : (
            <span className="lst-page-gap" key={item}>
              ...
            </span>
          ),
        )}

        <button
          type="button"
          className="lst-page"
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          aria-label="Next page"
        >
          &rsaquo;
        </button>
        <button
          type="button"
          className="lst-page"
          onClick={() => onPage(pages)}
          disabled={page === pages}
          aria-label="Last page"
        >
          &raquo;
        </button>
      </nav>

      <span className="lst-page-info">
        Showing {start} to {end} of {total} entries
      </span>
    </div>
  );
};

export default Pagination;
