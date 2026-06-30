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

const pageButtonBaseClassName =
  "w-[38px] h-[38px] border border-[#ddd9ff] rounded-lg bg-white text-[#02024b] cursor-pointer text-xs font-extrabold disabled:cursor-not-allowed disabled:opacity-40 max-[550px]:w-[34px] max-[550px]:h-[34px]";

const Pagination = ({ page, size, total, pages, onPage, onSize }) => {
  const start = total === 0 ? 0 : (page - 1) * size + 1;
  const end = Math.min(page * size, total);

  return (
    <div className="flex w-full min-h-[60px] px-[18px] py-3 items-center justify-between gap-[15px] max-[1200px]:items-stretch max-[1200px]:flex-col max-[550px]:px-0 max-[550px]:py-2.5">
      <div className="flex items-center gap-3 max-[1200px]:self-center">
        <div className="flex w-[120px] h-[38px] px-3 py-0 border border-[#ddd9ff] rounded-lg bg-white items-center justify-between gap-2">
          <select
            className="w-full h-full border-0 outline-0 bg-transparent text-black cursor-pointer text-xs appearance-none"
            value={size}
            onChange={(event) => onSize(Number(event.target.value))}
            aria-label="Rows per page"
          >
            <option value={10}>10 Per Page</option>
            <option value={50}>50 Per Page</option>
            <option value={100}>100 Per Page</option>
          </select>
          <img
            className="w-2.5 h-2.5 pointer-events-none"
            src="/assets/down_arrow_blac.png"
            alt=""
          />
        </div>
        <span className="text-[#02024b] text-xs font-bold">entries</span>
      </div>

      <nav
        className="flex items-center gap-3 max-[1200px]:self-center max-[1200px]:flex-wrap max-[1200px]:justify-center"
        aria-label="Table pagination"
      >
        <button
          type="button"
          className={pageButtonBaseClassName}
          onClick={() => onPage(1)}
          disabled={page === 1}
          aria-label="First page"
        >
          &laquo;
        </button>
        <button
          type="button"
          className={pageButtonBaseClassName}
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
              className={`${pageButtonBaseClassName} ${item === page ? "!border-0 bg-[linear-gradient(90deg,#5b36ff,#7705c3)] text-white" : ""}`}
              key={item}
              onClick={() => onPage(item)}
              aria-current={item === page ? "page" : undefined}
            >
              {item}
            </button>
          ) : (
            <span
              className="grid w-5 h-[38px] text-[#02024b] text-xs font-extrabold place-items-center"
              key={item}
            >
              ...
            </span>
          ),
        )}

        <button
          type="button"
          className={pageButtonBaseClassName}
          onClick={() => onPage(page + 1)}
          disabled={page === pages}
          aria-label="Next page"
        >
          &rsaquo;
        </button>
        <button
          type="button"
          className={pageButtonBaseClassName}
          onClick={() => onPage(pages)}
          disabled={page === pages}
          aria-label="Last page"
        >
          &raquo;
        </button>
      </nav>

      <span className="text-[#02024b] text-xs font-bold max-[1200px]:self-center">
        Showing {start} to {end} of {total} entries
      </span>
    </div>
  );
};

export default Pagination;
