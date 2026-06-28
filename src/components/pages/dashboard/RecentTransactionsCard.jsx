import React from "react";

const RecentTransactionsCard = ({ transactions, formatMoney }) => {
  return (
    <div className="dash-recent-card">
      <div className="dash-card-header">
        <div className="dash-card-title">
          <h3>Recent Transactions</h3>
        </div>

        <a href="#" className="dash-view-all">
          View All
        </a>
      </div>

      <div className="dash-txn-list" style={{ marginTop: "12px" }}>
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div className="dash-txn-item" key={transaction.billId}>
              <div className="dash-txn-main">
                <div className="dash-txn-icon">₹</div>
                <div className="dash-txn-info">
                  <h4>{transaction.billId}</h4>
                  <p>{transaction.itemCount} items</p>
                </div>
              </div>

              <div className="dash-txn-value">
                <h4>{formatMoney(transaction.total)}</h4>
                <span>{transaction.status}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="dash-empty-cell">No transactions found</div>
        )}
      </div>

      <button className="dash-all-txn-btn" style={{ height: "38px" }}>
        View All Transactions
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default RecentTransactionsCard;
