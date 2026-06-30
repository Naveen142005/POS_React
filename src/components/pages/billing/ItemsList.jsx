import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const FALLBACK_CARD_WIDTH = 110;
const FALLBACK_CARD_HEIGHT = 100;
const FALLBACK_GRID_GAP = 14;
const PAGINATION_SPACE = 50;

const itemListClass =
  "bill-item-list flex min-h-0 min-w-0 flex-col overflow-hidden rounded-xl bg-white p-[14px] [grid-area:items-list-box] max-[1200px]:h-[420px] max-[768px]:h-[420px] max-[600px]:h-[360px]";

const ChevronIcon = ({ direction }) => (
  <svg className="h-[21px] w-[21px]" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 6l6 6-6 6"}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.4"
    />
  </svg>
);

const ItemsList = ({ items, onAdd }) => {
  const containerRef = useRef(null);
  const [copiedCode, setCopiedCode] = useState("");
  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  const calculateCapacity = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const styles = window.getComputedStyle(container);
    const grid = container.querySelector(".bill-item-grid");
    const card = container.querySelector(".bill-item-card");
    const gridStyles = grid ? window.getComputedStyle(grid) : null;
    const cardBounds = card?.getBoundingClientRect();
    const cardWidth = cardBounds?.width || FALLBACK_CARD_WIDTH;
    const cardHeight = cardBounds?.height || FALLBACK_CARD_HEIGHT;
    const columnGap = parseFloat(gridStyles?.columnGap) || FALLBACK_GRID_GAP;
    const rowGap = parseFloat(gridStyles?.rowGap) || FALLBACK_GRID_GAP;
    const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
    const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);
    const availableWidth = Math.max(0, container.clientWidth - horizontalPadding);
    const fullHeight = Math.max(0, container.clientHeight - verticalPadding);
    const columns = Math.max(1, Math.floor((availableWidth + columnGap) / (cardWidth + columnGap)));
    const rowsWithoutControls = Math.max(1, Math.floor((fullHeight + rowGap) / (cardHeight + rowGap)));
    const capacityWithoutControls = columns * rowsWithoutControls;

    const availableHeight = items.length > capacityWithoutControls
      ? Math.max(cardHeight, fullHeight - PAGINATION_SPACE)
      : fullHeight;
    const rows = Math.max(1, Math.floor((availableHeight + rowGap) / (cardHeight + rowGap)));

    setItemsPerPage(Math.max(1, columns * rows));
  }, [items.length]);

  useLayoutEffect(() => {
    calculateCapacity();
    const observer = new ResizeObserver(calculateCapacity);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [calculateCapacity]);

  useEffect(() => {
    setPage(0);
  }, [items]);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages - 1));
  }, [totalPages]);

  const visibleItems = useMemo(() => {
    const start = page * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [items, itemsPerPage, page]);

  const copyCode = async (event, code) => {
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(String(code));
      setCopiedCode(String(code));
      window.setTimeout(() => setCopiedCode(""), 1000);
    } catch {
      setCopiedCode("");
    }
  };

  return (
    <div className={itemListClass} ref={containerRef}>
      <div className="bill-item-grid grid min-h-0 min-w-0 flex-1 content-start place-items-center gap-[14px] [grid-template-columns:repeat(auto-fit,minmax(100px,1fr))]">
        {visibleItems.map((item) => {
          return (
            <div
              className="bill-item-card group relative flex h-[100px] w-[110px] cursor-pointer justify-center rounded-[10px] border border-[#ddd] p-[15px]"
              id={item.itemCode}
              key={item.itemCode}
              onClick={() => onAdd(item.itemCode, 1)}
            >
              <span
                className="bill-item-id absolute right-2 top-2 hidden cursor-pointer rounded-md bg-[#111827] px-2 py-1 text-xs text-white group-hover:block"
                onClick={(event) => copyCode(event, item.itemCode)}
              >
                {copiedCode === String(item.itemCode) ? "Copied!" : item.itemCode}
              </span>
              <img className="h-[70px] w-[70px] object-cover" src={item.itemImage} alt="" />
              <div className="bill-img-title absolute bottom-0 flex h-10 w-[99.9%] flex-col items-center justify-center rounded-b-lg bg-[#f8f5f5c4] text-center text-[10px] font-medium">
                {item.itemName}
                <div className="text-xs font-extrabold text-[#830ad3]">₹ {item.sellingPrice}</div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="bill-pagination mt-2 flex h-10 shrink-0 items-center justify-center gap-3">
          <button
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-[1.5px] border-[#7654e8] bg-white text-[#6338f6] shadow-[0_3px_9px_rgba(99,56,246,0.12)] transition-[background-color,color,box-shadow,transform] duration-200 ease-in-out hover:border-transparent hover:bg-[linear-gradient(135deg,#5b36ff,#7705c3)] hover:text-white hover:shadow-[0_6px_14px_rgba(99,56,246,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:border-[#d9d9e4] disabled:bg-[#f5f5f8] disabled:text-[#aaaaba] disabled:shadow-none"
            type="button"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={page === 0}
            aria-label="Previous items"
          >
            <ChevronIcon direction="left" />
          </button>
          <button
            className="grid h-10 w-10 cursor-pointer place-items-center rounded-full border-[1.5px] border-[#7654e8] bg-white text-[#6338f6] shadow-[0_3px_9px_rgba(99,56,246,0.12)] transition-[background-color,color,box-shadow,transform] duration-200 ease-in-out hover:border-transparent hover:bg-[linear-gradient(135deg,#5b36ff,#7705c3)] hover:text-white hover:shadow-[0_6px_14px_rgba(99,56,246,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:border-[#d9d9e4] disabled:bg-[#f5f5f8] disabled:text-[#aaaaba] disabled:shadow-none"
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={page === totalPages - 1}
            aria-label="Next items"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
};

export { itemListClass };
export default ItemsList;
