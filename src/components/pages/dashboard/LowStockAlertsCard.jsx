import React from "react";

const LowStockAlertsCard = ({ items }) => {
  return (
    <div className="flex-1 bg-white rounded-[14px] px-5 py-[18px] [font-family:Inter,Arial,sans-serif] shadow-[0_10px_30px_rgba(84,63,255,0.08)] max-[920px]:flex-1 min-[1470px]:!h-full min-[1470px]:px-[22px] min-[1470px]:py-[18px] min-[1470px]:overflow-hidden">
      <div className="flex justify-between items-center mb-[11px]">
        <div className="flex items-center gap-2">
          <img
            src="/assets/icons/low-stock-alert.svg"
            alt="low-stock-alert icon"
            width="25"
            height="25"
            className="w-[19px] h-[19px] text-[rgb(255,68,86)]"
          />
          <h3 className="text-sm font-extrabold text-[rgb(7,2,45)] m-0">
            Low Stock Alerts
          </h3>
        </div>

        <a
          href="#"
          className="flex items-center gap-[7px] text-[rgb(77,55,255)] text-[10px] font-extrabold no-underline"
        >
          View All Alerts
          <img
            src="/assets/icons/view-alert-right-arrow.svg"
            alt="view-alert-right-arrow icon"
            width="12"
            height="12"
            className="w-3 h-3"
          />
        </a>
      </div>

      <div className="w-full flex justify-between max-[1470px]:flex-wrap max-[1470px]:gap-2.5 max-[920px]:flex-wrap max-[920px]:gap-2.5 min-[1470px]:flex-nowrap">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              className="h-[73px] border border-[rgb(232,229,242)] rounded-[10px] flex items-center gap-2.5 p-[9px] bg-white max-[1470px]:w-[45%] max-[920px]:w-[calc(100%_-_10px)] max-[768px]:w-full min-[1470px]:w-auto"
              key={item.itemCode}
            >
              <div className="w-10 h-[52px] border border-[rgba(159,152,152,0.543)] rounded-xl flex items-center justify-center">
                <img
                  src={item.itemImage || "/assets/coffee.png"}
                  alt=""
                  className="w-[30px] h-[42px]"
                />
              </div>

              <div>
                <h4 className="text-[10px] font-black text-[rgb(8,4,42)] m-[0_0_4px] whitespace-nowrap">
                  {item.itemName}
                </h4>
                <p className="text-[9px] font-bold text-[rgb(110,104,135)] m-[0_0_8px]">
                  {item.itemCode}
                </p>
                <span className="text-[10px] font-black text-[rgb(239,42,65)]">
                  {Number(item.inStock || 0)} left
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#7b728f] text-[11px] font-extrabold">
            No low stock items
          </div>
        )}
      </div>
    </div>
  );
};

export default LowStockAlertsCard;
