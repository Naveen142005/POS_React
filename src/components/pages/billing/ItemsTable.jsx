import { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 8;

const ItemsTable = ({ items, onAdd }) => {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const pages = Math.max(1, Math.ceil(items.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, pages);

  const visibleItems = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, safePage]);

  return (
    <div className="bill-item-list bill-item-table-view">
      <div className="bill-menu-table-wrap">
        <table className="bill-menu-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Item Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <tr key={item.itemCode}>
                  <td>{item.itemCode}</td>
                  <td>{item.itemName}</td>
                  <td>₹ {Number(item.sellingPrice || 0).toFixed(2)}</td>
                  <td>{Number(item.inStock || 0)}</td>
                  <td>
                    <button
                      type="button"
                      className="bill-menu-add-btn"
                      onClick={() => onAdd(item.itemCode, 1)}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="bill-menu-empty">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="bill-pagination">
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={safePage === 1}
            aria-label="Previous items"
          >
            ‹
          </button>
          <span className="bill-menu-page-text">
            {safePage} / {pages}
          </span>
          <button
            type="button"
            onClick={() => setPage((currentPage) => currentPage + 1)}
            disabled={safePage === pages}
            aria-label="Next items"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemsTable;
