const actionClass =
  "flex cursor-pointer flex-col items-center justify-center gap-[7px] border-b border-r border-[rgba(255,255,255,0.12)] text-white max-[1200px]:flex-row max-[1037px]:flex-col max-[1037px]:p-3 max-[600px]:h-auto max-[600px]:gap-1 max-[600px]:p-1.5";

const CashActions = ({ onOpenCashBox, onGoodsReturn, onCancelItem, onAddItem }) => {
  const actions = [
    ["Open Cash Box", "cash-box.png", onOpenCashBox, "bill-cash-btn"],
    ["Goods Return", "star.png", onGoodsReturn, "bill-return-btn"],
    ["Cancel Item", "reload.png", onCancelItem, "bill-cancel-btn"],
    ["Add Item", "cart.png", onAddItem, "bill-add-item-btn"],
  ];

  return (
    <div className="bill-cash-actions grid overflow-hidden rounded-xl bg-[linear-gradient(135deg,#2dd4bf,#0f9f8f)] shadow-[0_8px_24px_rgba(15,159,143,0.18)] [grid-area:cash-actions] [grid-template-columns:repeat(2,1fr)] [grid-template-rows:repeat(2,1fr)] max-[1200px]:grid-cols-1 max-[1200px]:[grid-template-rows:repeat(4,1fr)] max-[1037px]:[grid-template-columns:repeat(2,1fr)] max-[1037px]:[grid-template-rows:repeat(2,1fr)] max-[600px]:h-[90px]">
      {actions.map(([label, icon, action, className]) => (
        <div className={`${className} ${actionClass}`} key={label} onClick={action}>
          <img
            className={`${
              label === "Goods Return" ? "h-[18px] w-[18px]" : "h-[23px] w-[23px]"
            } object-contain max-[600px]:h-4 max-[600px]:w-4`}
            src={`/assets/${icon}`}
            alt=""
          />
          <span className="text-center text-[10px] font-medium text-white max-[600px]:text-[8px] max-[600px]:leading-[1.1]">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CashActions;
