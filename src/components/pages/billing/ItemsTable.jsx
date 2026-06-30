import { useEffect, useMemo, useState } from "react";
import { itemListClass } from "./ItemsList";

const ITEMS_PER_PAGE = 8;

const pagerButtonClass =
  "grid h-10 w-10 cursor-pointer place-items-center rounded-full border-[1.5px] border-[#7654e8] bg-white text-[#6338f6] shadow-[0_3px_9px_rgba(99,56,246,0.12)] transition-[background-color,color,box-shadow,transform] duration-200 ease-in-out hover:border-transparent hover:bg-[linear-gradient(135deg,#5b36ff,#7705c3)] hover:text-white hover:shadow-[0_6px_14px_rgba(99,56,246,0.28)] active:translate-y-0 disabled:cursor-not-allowed disabled:border-[#d9d9e4] disabled:bg-[#f5f5f8] disabled:text-[#aaaaba] disabled:shadow-none";

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
    <div className={`${itemListClass} bill-item-table-view`}>
      <div className="bill-menu-table-wrap min-h-0 flex-1 overflow-auto">
        <table className="bill-menu-table w-full min-w-[520px] border-collapse text-[#111827] [&_td]:whitespace-nowrap [&_td]:border-b [&_td]:border-[#ece8ff] [&_td]:px-3 [&_td]:py-2.5 [&_td]:text-left [&_td]:text-xs [&_th]:sticky [&_th]:top-0 [&_th]:z-[1] [&_th]:whitespace-nowrap [&_th]:border-b [&_th]:border-[#ece8ff] [&_th]:bg-[#f6f3ff] [&_th]:px-3 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-extrabold [&_th]:text-[#4b3f72]">
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
                      className="bill-menu-add-btn h-[30px] cursor-pointer rounded-md border-0 bg-[linear-gradient(135deg,#5b36ff,#7705c3)] px-[13px] text-xs font-extrabold text-white"
                      onClick={() => onAdd(item.itemCode, 1)}
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="bill-menu-empty !h-[120px] !text-center !font-bold !text-[#7b728f]">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="bill-pagination mt-2 flex h-10 shrink-0 items-center justify-center gap-3">
          <button
            className={pagerButtonClass}
            type="button"
            onClick={() => setPage((currentPage) => currentPage - 1)}
            disabled={safePage === 1}
            aria-label="Previous items"
          >
            ‹
          </button>
          <span className="bill-menu-page-text text-xs font-extrabold text-[#4b3f72]">
            {safePage} / {pages}
          </span>
          <button
            className={pagerButtonClass}
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
