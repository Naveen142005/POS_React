import React from "react";

const StatsCards = ({ stats, formatMoney }) => {
  const cards = [
    {
      title: "Total Sales",
      value: formatMoney(stats.totalSales),
      icon: "/assets/icons/card-total-sales.svg",
      trendIcon: "/assets/icons/card-sales-trend-up.svg",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "/assets/icons/card-total-orders.svg",
      trendIcon: "/assets/icons/card-orders-trend-up.svg",
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: "/assets/icons/card-total-customers.svg",
      trendIcon: "/assets/icons/card-customers-trend-up.svg",
      gradient: "linear-gradient(135deg, #f0c95c, #eb7130)",
      extraClass: "dash-stat-customers",
    },
    {
      title: "Average order value",
      value: formatMoney(stats.averageOrderValue),
      icon: "/assets/icons/card-average-order-value.svg",
      trendIcon: "/assets/icons/card-average-trend-up.svg",
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    },
    {
      title: "Total Profit",
      value: formatMoney(stats.totalProfit),
      icon: "/assets/icons/card-total-profit.svg",
      trendIcon: "/assets/icons/card-profit-trend-up.svg",
      gradient: "linear-gradient(135deg, #a855f7, #7e22ce)",
    },
  ];

  return (
    <div className="dash-stat-list">
      {cards.map((card, index) => (
        <div className={`dash-stat-card ${card.extraClass || ""}`} key={index}>
          <div
            className="dash-stat-icon"
            style={
              card.gradient
                ? {
                    background: card.gradient,
                    color: "white",
                  }
                : undefined
            }
          >
            <img
              src={card.icon}
              alt={`${card.title} icon`}
              width="25"
              height="25"
            />
          </div>

          <div className="dash-stat-info">
            <div className="dash-stat-label">{card.title}</div>
            <div className="dash-stat-value">{card.value}</div>

            <div className="dash-stat-trend">
              <span>
                <img
                  src={card.trendIcon}
                  alt="trend up icon"
                  width="12"
                  height="12"
                />
                Live
              </span>

              <span className="dash-stat-note">from local data</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
