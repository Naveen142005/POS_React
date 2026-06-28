import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

const FALLBACK_CARD_WIDTH = 110;
const FALLBACK_CARD_HEIGHT = 100;
const FALLBACK_GRID_GAP = 14;
const PAGINATION_SPACE = 50;

const ChevronIcon = ({ direction }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
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
    <div className="bill-item-list" ref={containerRef}>
      <div className="bill-item-grid">
        {visibleItems.map((item) => {
          return (
            <div
              className="bill-item-card"
              id={item.itemCode}
              key={item.itemCode}
              onClick={() => onAdd(item.itemCode, 1)}
              style={{ cursor: "pointer" }}
            >
              <span className="bill-item-id" onClick={(event) => copyCode(event, item.itemCode)}>
                {copiedCode === String(item.itemCode) ? "Copied!" : item.itemCode}
              </span>
              <img src={item.itemImage} alt="" />
              <div className="bill-img-title">
                {item.itemName}
                <div>₹ {item.sellingPrice}</div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="bill-pagination">
          <button type="button" onClick={() => setPage((currentPage) => currentPage - 1)} disabled={page === 0} aria-label="Previous items">
            <ChevronIcon direction="left" />
          </button>
          <button type="button" onClick={() => setPage((currentPage) => currentPage + 1)} disabled={page === totalPages - 1} aria-label="Next items">
            <ChevronIcon direction="right" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
