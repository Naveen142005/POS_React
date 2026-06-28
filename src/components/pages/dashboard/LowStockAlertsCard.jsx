import React from "react";

const LowStockAlertsCard = ({ items }) => {
  return (
    <div className="dash-stock-card">
      <div className="dash-card-header">
        <div className="dash-card-title dash-alert-heading">
          <img
            src="/assets/icons/low-stock-alert.svg"
            alt="low-stock-alert icon"
            width="25"
            height="25"
          />
          <h3>Low Stock Alerts</h3>
        </div>

        <a href="#" className="dash-view-all">
          View All Alerts
          <img
            src="/assets/icons/view-alert-right-arrow.svg"
            alt="view-alert-right-arrow icon"
            width="12"
            height="12"
          />
        </a>
      </div>

      <div className="dash-stock-list">
        {items.length > 0 ? (
          items.map((item) => (
            <div className="dash-stock-item" key={item.itemCode}>
              <div className="dash-stock-img">
                <img src={item.itemImage || "/assets/coffee.png"} alt="" />
              </div>

              <div>
                <h4>{item.itemName}</h4>
                <p>{item.itemCode}</p>
                <span>{Number(item.inStock || 0)} left</span>
              </div>
            </div>
          ))
        ) : (
          <div className="dash-empty-cell">No low stock items</div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlertsCard;
