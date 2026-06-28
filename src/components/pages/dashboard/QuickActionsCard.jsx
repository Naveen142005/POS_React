import React from "react";

const actions = [
  {
    title: "New Bill",
    icon: "/assets/icons/quick-action-new-bill.svg",
    colorClass: "dash-icon-purple",
  },
  {
    title: "Add Product",
    icon: "/assets/icons/quick-action-add-product.svg",
    colorClass: "dash-icon-green",
  },
  {
    title: "New Order",
    icon: "/assets/icons/quick-action-new-order.svg",
    colorClass: "dash-icon-orange",
  },
  {
    title: "Add Customer",
    icon: "/assets/icons/quick-action-add-customer.svg",
    colorClass: "dash-icon-blue",
  },
  {
    title: "Reports",
    icon: "/assets/icons/quick-action-reports.svg",
    colorClass: "dash-icon-violet",
  },
];

const QuickActionsCard = () => {
  return (
    <div className="dash-action-card">
      <div className="dash-card-header">
        <div className="dash-card-title">
          <h3>Quick Actions</h3>
        </div>
      </div>

      <div className="dash-action-list">
        {actions.map((action, index) => (
          <a href="#" style={{ textDecoration: "none" }} key={index}>
            <div className="dash-action-box" style={{ cursor: "pointer" }}>
              <div className={`dash-action-icon ${action.colorClass}`}>
                <img
                  src={action.icon}
                  alt={`${action.title} icon`}
                  width="25"
                  height="25"
                />
              </div>

              <p style={{ fontSize: "9px" }}>{action.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsCard;
