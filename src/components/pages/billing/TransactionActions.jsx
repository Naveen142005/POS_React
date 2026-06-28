const TransactionActions = ({ onTerminate, onPrint, onReserve, onDeleteAll, onRestore, onMainMenu }) => {
  const actions = [
    [<>Terminate<br />Transaction</>, "slash.png", onTerminate, "bill-terminate-btn"],
    [<>Print</>, "print.png", onPrint, "bill-print-btn"],
    [<>Reserved<br />Transaction</>, "bookmark.png", onReserve, "bill-reserve-btn"],
    [<>Delete All<br />Transaction</>, "delete_2.png", onDeleteAll, "bill-delete-btn"],
    [<>Restore</>, "reload.png", onRestore, "bill-restore-btn"],
    [<>Main Menu</>, "home.png", onMainMenu, "bill-menu-btn"],
  ];

  return (
    <div className="bill-txn-actions">
      {actions.map(([label, icon, action, className], index) => (
        <div className={className} key={index} onClick={action}>
          <img src={`/assets/${icon}`} alt="" /><span>{label}</span>
        </div>
      ))}
    </div>
  );
};

export default TransactionActions;
