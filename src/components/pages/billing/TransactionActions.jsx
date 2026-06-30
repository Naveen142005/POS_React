const actionClass =
  "flex cursor-pointer items-center justify-center gap-2 rounded-lg border-b border-r border-[rgba(255,255,255,0.16)] text-xs text-white max-[600px]:gap-1 max-[600px]:p-1 max-[600px]:text-[8px]";

const TransactionActions = ({ onTerminate, onPrint, onReserve, onDeleteAll, onRestore, onMainMenu }) => {
  const actions = [
    [<>Terminate<br />Transaction</>, "slash.png", onTerminate, "bill-terminate-btn", ""],
    [<>Print</>, "print.png", onPrint, "bill-print-btn", ""],
    [<>Reserved<br />Transaction</>, "bookmark.png", onReserve, "bill-reserve-btn", ""],
    [<>Delete All<br />Transaction</>, "delete_2.png", onDeleteAll, "bill-delete-btn", ""],
    [<>Restore</>, "reload.png", onRestore, "bill-restore-btn", "col-[1/3]"],
    [<>Main Menu</>, "home.png", onMainMenu, "bill-menu-btn", "col-[3/5]"],
  ];

  return (
    <div className="bill-txn-actions grid overflow-hidden rounded-[10px] bg-[linear-gradient(135deg,#ffb13b,#ff922b)] shadow-[0_8px_24px_rgba(255,146,43,0.18)] [grid-area:transaction-actions] [grid-template-columns:repeat(4,1fr)] [grid-template-rows:1fr_1fr] max-[600px]:h-[90px]">
      {actions.map(([label, icon, action, className, gridClass], index) => (
        <div className={`${className} ${actionClass} ${gridClass}`} key={index} onClick={action}>
          <img className="h-[18px] w-[18px] object-contain max-[600px]:h-[14px] max-[600px]:w-[14px]" src={`/assets/${icon}`} alt="" />
          <span
            className={`font-bold leading-[1.3] text-white max-[600px]:text-[8px] max-[600px]:leading-[1.1] ${
              className === "bill-print-btn" || className === "bill-restore-btn" || className === "bill-menu-btn"
                ? "text-[11px]"
                : "text-[10px]"
            }`}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default TransactionActions;
