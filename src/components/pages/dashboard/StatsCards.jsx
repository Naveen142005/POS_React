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
      extraClass:
        "[@media_(min-width:1406px)_and_(max-width:1436px)]:flex-col [@media_(min-width:1406px)_and_(max-width:1436px)]:items-start [@media_(min-width:1406px)_and_(max-width:1436px)]:justify-start",
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
    <div className="grid grid-cols-5 gap-5 max-[1200px]:grid-cols-2 max-[768px]:grid-cols-1">
      {cards.map((card, index) => {
        const trendNumber = Number(card.trend || 0);

        return (
          <div
            className={`flex items-center gap-[18px] bg-white w-auto min-w-0 min-h-[112px] flex-nowrap p-[22px_24px] border border-[#ece9f8] rounded-[10px] shadow-[0_8px_22px_rgba(35,28,89,0.08)] ${card.extraClass || ""}`}
            key={index}
          >
            <div
              className="flex justify-center items-center rounded-full bg-[linear-gradient(90deg,#a931f9,#9a34f3)] w-[52px] h-[52px] flex-[0_0_52px] shadow-[0_6px_16px_rgba(105,57,255,0.22)]"
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
                className="w-[25px] h-[25px]"
              />
            </div>

            <div className="flex flex-col min-w-0 gap-1">
              <div className="text-[#3d3a5d] text-xs font-extrabold whitespace-nowrap">
                {card.title}
              </div>
              <div className="text-[#08042a] text-[19px] font-black leading-[1.1]">
                {card.value}
              </div>

              <div className="flex items-center gap-1 flex-wrap leading-[1.1]">
                <span
                  className={`inline-flex items-center gap-0.5 text-[8px] font-extrabold ${trendNumber < 0 ? "text-[#ef2a41]" : "text-[#18b96b]"}`}
                >
                  {trendNumber < 0 ? "↓" : "↑"} {Math.abs(trendNumber).toFixed(1)}%
                </span>

                <span className="inline-flex items-center gap-0.5 text-[#5f5a82] text-[8px] font-extrabold">
                  {stats.trendLabel || "vs last week"}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
