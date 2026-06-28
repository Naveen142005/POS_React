import React from "react";
import useTopSellingItems from "./hooks/useTopSellingItems";

const TopSellingItemsCard = ({ bills, details, inventory, formatMoney }) => {
  const topSelling = useTopSellingItems(bills, details, inventory);

  return (
    <div className="dash-selling-card">
      <div className="dash-card-header">
        <div className="dash-card-title">
          <h3>Top Selling items</h3>
        </div>

        <div className="dash-selling-filter">
          <button
            type="button"
            className="dash-drop-down"
            onClick={() => topSelling.setMenuOpen((open) => !open)}
          >
            <span>{topSelling.selectedRange}</span>

            <img
              src="/assets/icons/top-selling-dropdown-arrow.svg"
              alt=""
              width="12"
              height="12"
            />
          </button>

          <div className={`dash-selling-menu ${topSelling.menuOpen ? "dash-menu-open" : ""}`}>
            {topSelling.ranges.map((range) => (
              <button
                type="button"
                key={range}
                onClick={() => topSelling.selectRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dash-table-content">
        <table className="dash-product-table">
          <thead>
            <tr>
              <td colSpan="3" style={{ textAlign: "left" }}>
                Items
              </td>
              <td style={{ textAlign: "center" }}>Qty Sold</td>
              <td>Revenue</td>
            </tr>
          </thead>

          <tbody id="topItemsBody">
            {topSelling.items.length > 0 ? (
              topSelling.items.map((item, index) => (
                <tr key={item.itemCode}>
                  <td style={{ borderBottom: "1px solid transparent" }}>
                    {index + 1}.
                  </td>
                  <td style={{ borderBottom: "1px solid transparent" }}>
                    <img
                      src={item.itemImage || "/assets/coffee.png"}
                      alt={item.itemName}
                    />
                  </td>
                  <td>{item.itemName}</td>
                  <td style={{ textAlign: "center" }}>{item.qty}</td>
                  <td>{formatMoney(item.revenue)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="dash-empty-cell">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="dash-view-products">
        <button>
          View All Products
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ width: "12px", height: "12px", marginLeft: "12px" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopSellingItemsCard;
