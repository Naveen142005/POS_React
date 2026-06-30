import { useOutletContext } from "react-router-dom";

const viewButtonClass =
  "flex h-[38px] w-[38px] cursor-pointer items-center justify-center rounded-[7px] border-0 bg-white shadow-[0_10px_25px_rgba(17,24,39,0.04)] max-[768px]:h-9 max-[768px]:w-9 [&_img]:h-[18px] [&_img]:w-[18px] [&_img]:object-contain [&_img]:opacity-75";

const activeViewButtonClass =
  "bg-[linear-gradient(135deg,#5b36ff,#7705c3)] shadow-[0_8px_18px_rgba(91,54,255,0.28)] [&_img]:opacity-100 [&_img]:[filter:brightness(0)_invert(1)]";

const BillingHeader = ({
  total,
  searchText,
  onSearch,
  viewMode,
  onViewModeChange,
}) => {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="bill-header relative z-[1] flex h-16 w-full items-center justify-between px-[25px] max-[768px]:h-auto max-[768px]:flex-col max-[768px]:gap-3 max-[768px]:p-3">
      <div className="bill-header-main flex w-[43%] items-center justify-between max-[768px]:w-full">
        <div className="bill-title flex items-center gap-[18px] max-[768px]:gap-2.5">
          <img
            className="bill-menu-toggle h-5 w-5"
            src="/assets/static-menu.png"
            alt=""
            id="menu-icon"
            onClick={toggleSidebar}
          />
          <span className="text-base font-extrabold text-[#111827] max-[768px]:text-sm">
            Current Bill
          </span>
        </div>
        <div className="bill-total flex flex-col items-start">
          <div className="text-[10px] font-extrabold leading-none text-[#3b0764] max-[768px]:text-[9px]">
            Total Amount
          </div>
          <div className="text-[22px] font-extrabold leading-[1.1] text-[#5b21ff] max-[768px]:text-lg">
            ₹{total.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="bill-header-actions flex w-[45%] items-center justify-end gap-[14px] max-[768px]:w-full max-[768px]:justify-between max-[768px]:gap-2.5">
        <div className="bill-search relative h-[38px] w-[78%] rounded-md border border-[#eef0f6] bg-white shadow-[0_10px_25px_rgba(17,24,39,0.04)] max-[768px]:h-9 max-[768px]:w-auto max-[768px]:flex-1">
          <img
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60"
            src="/assets/search.png"
            alt=""
          />
          <input
            className="h-full w-full border-0 bg-transparent py-0 pl-11 pr-[14px] text-[11px] font-medium text-[#374151] outline-none placeholder:text-[#8b8fa3]"
            type="text"
            value={searchText}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search menu items..."
          />
        </div>
        <div className="bill-view-actions flex shrink-0 items-center gap-2">
          <button
            type="button"
            className={`bill-grid-btn ${viewButtonClass} w-[50px] ${
              viewMode === "grid" ? `bill-grid-active ${activeViewButtonClass}` : ""
            }`}
            onClick={() => onViewModeChange("grid")}
            aria-label="Show item card view"
          >
            <img src="/assets/box.png" alt="" />
          </button>
          <button
            type="button"
            className={`bill-list-btn ${viewButtonClass} ${
              viewMode === "table" ? `bill-list-active ${activeViewButtonClass}` : ""
            }`}
            onClick={() => onViewModeChange("table")}
            aria-label="Show item table view"
          >
            <img src="/assets/list.png" alt="" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default BillingHeader;
