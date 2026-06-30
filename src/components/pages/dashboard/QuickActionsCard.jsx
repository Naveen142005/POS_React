import React from "react";

const actionIconClasses = {
  purple: "text-[rgb(91,61,255)] bg-[rgb(242,239,255)]",
  green: "text-[rgb(31,178,112)] bg-[rgb(229,249,240)]",
  orange: "text-[rgb(255,130,34)] bg-[rgb(255,239,225)]",
  blue: "text-[rgb(54,123,255)] bg-[rgb(232,240,255)]",
  violet: "text-[rgb(166,65,255)] bg-[rgb(247,236,255)]",
};

const actions = [
  {
    title: "New Bill",
    icon: "/assets/icons/quick-action-new-bill.svg",
    color: "purple",
  },
  {
    title: "Add Product",
    icon: "/assets/icons/quick-action-add-product.svg",
    color: "green",
  },
  {
    title: "New Order",
    icon: "/assets/icons/quick-action-new-order.svg",
    color: "orange",
  },
  {
    title: "Add Customer",
    icon: "/assets/icons/quick-action-add-customer.svg",
    color: "blue",
  },
  {
    title: "Reports",
    icon: "/assets/icons/quick-action-reports.svg",
    color: "violet",
  },
];

const QuickActionsCard = () => {
  return (
    <div className="flex-1 bg-white rounded-[14px] px-5 py-[18px] [font-family:Inter,Arial,sans-serif] shadow-[0_10px_30px_rgba(84,63,255,0.08)] max-[920px]:flex-1 min-[1470px]:!h-full min-[1470px]:px-[22px] min-[1470px]:py-[18px] min-[1470px]:overflow-hidden min-[1470px]:flex min-[1470px]:flex-col">
      <div className="flex justify-between items-center mb-[11px] min-[1470px]:shrink-0 min-[1470px]:mb-2.5">
        <div>
          <h3 className="text-sm font-extrabold text-[rgb(7,2,45)] m-0">
            Quick Actions
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-3.5 max-[1470px]:grid-cols-3 max-[920px]:grid-cols-2 max-[768px]:grid-cols-1 min-[1470px]:flex-1 min-[1470px]:min-h-0 min-[1470px]:grid-cols-[repeat(5,minmax(0,1fr))] min-[1470px]:gap-3">
        {actions.map((action, index) => (
          <a href="#" className="no-underline" key={index}>
            <div className="h-[88px] border border-[rgb(232,229,242)] rounded-xl bg-white flex flex-col items-center justify-center gap-2.5 cursor-pointer min-[1470px]:h-full min-[1470px]:min-h-0">
              <div
                className={`w-[42px] h-[42px] rounded-full flex items-center justify-center ${actionIconClasses[action.color]}`}
              >
                <img
                  src={action.icon}
                  alt={`${action.title} icon`}
                  width="25"
                  height="25"
                  className="w-[22px] h-[22px]"
                />
              </div>

              <p className="text-[9px] font-black text-[rgb(7,2,45)] m-0 whitespace-nowrap">
                {action.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
