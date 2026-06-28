const CashActions = ({ onOpenCashBox, onGoodsReturn, onCancelItem, onAddItem }) => {
  const actions = [
    ["Open Cash Box", "cash-box.png", onOpenCashBox, "bill-cash-btn"],
    ["Goods Return", "star.png", onGoodsReturn, "bill-return-btn"],
    ["Cancel Item", "reload.png", onCancelItem, "bill-cancel-btn"],
    ["Add Item", "cart.png", onAddItem, "bill-add-item-btn"],
  ];

  return (
    <div className="bill-cash-actions">
      {actions.map(([label, icon, action, className]) => (
        <div className={className} key={label} onClick={action}>
          <img src={`/assets/${icon}`} alt="" style={label === "Goods Return" ? { width: "18px", height: "18px" } : undefined} /><span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default CashActions;
