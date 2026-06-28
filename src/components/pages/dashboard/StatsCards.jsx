import React from "react";

const StatsCards = ({ stats, formatMoney }) => {
  const cards = [
    {
      title: "Total Sales",
      value: formatMoney(stats.totalSales),
      icon: "/assets/icons/card-total-sales.svg",
      trend: stats.trends?.totalSales,
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: "/assets/icons/card-total-orders.svg",
      trend: stats.trends?.totalOrders,
      gradient: "linear-gradient(135deg, #22c55e, #16a34a)",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: "/assets/icons/card-total-customers.svg",
      trend: stats.trends?.totalCustomers,
      gradient: "linear-gradient(135deg, #f0c95c, #eb7130)",
      extraClass: "dash-stat-customers",
    },
    {
      title: "Average order value",
      value: formatMoney(stats.averageOrderValue),
      icon: "/assets/icons/card-average-order-value.svg",
      trend: stats.trends?.averageOrderValue,
      gradient: "linear-gradient(135deg, #3b82f6, #2563eb)",
    },
    {
      title: "Total Profit",
      value: formatMoney(stats.totalProfit),
      icon: "/assets/icons/card-total-profit.svg",
      trend: stats.trends?.totalProfit,
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
              <span
                className={Number(card.trend || 0) < 0 ? "dash-trend-down" : ""}
              >
                {Number(card.trend || 0) < 0 ? "↓" : "↑"}{" "}
                {Math.abs(Number(card.trend || 0)).toFixed(1)}%
              </span>

              <span className="dash-stat-note">
                {stats.trendLabel || "vs last week"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
