import { useOutletContext } from "react-router-dom";

const BillingHeader = ({
  total,
  searchText,
  onSearch,
  viewMode,
  onViewModeChange,
}) => {
  const { toggleSidebar } = useOutletContext();

  return (
    <header className="bill-header">
    <div className="bill-header-main">
      <div className="bill-title">
        <img className="bill-menu-toggle" src="/assets/static-menu.png" alt="" id="menu-icon" onClick={toggleSidebar} />
        <span>Current Bill</span>
      </div>
      <div className="bill-total">
        <div>Total Amount</div>
        <div>₹{total.toFixed(2)}</div>
      </div>
    </div>

    <div className="bill-header-actions">
      <div className="bill-search">
        <img src="/assets/search.png" alt="" />
        <input type="text" value={searchText} onChange={(event) => onSearch(event.target.value)} placeholder="Search menu items..." />
      </div>
      <div className="bill-view-actions">
        <button
          type="button"
          className={`bill-grid-btn ${viewMode === "grid" ? "bill-grid-active" : ""}`}
          style={{ width: "50px" }}
          onClick={() => onViewModeChange("grid")}
          aria-label="Show item card view"
        >
          <img src="/assets/box.png" alt="" />
        </button>
        <button
          type="button"
          className={`bill-list-btn ${viewMode === "table" ? "bill-list-active" : ""}`}
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
