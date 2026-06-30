import React from "react";

const RecentTransactionsCard = ({ transactions, formatMoney }) => {
  return (
    <div className="flex-1 h-[385px] bg-white rounded-[14px] pt-[22px] px-[22px] pb-[18px] [font-family:Inter,Arial,sans-serif] shadow-[0_10px_30px_rgba(84,63,255,0.08)] max-[1470px]:w-full min-[1470px]:!w-auto min-[1470px]:!h-full min-[1470px]:min-w-0 min-[1470px]:min-h-0 min-[1470px]:pt-5 min-[1470px]:px-[22px] min-[1470px]:pb-5 min-[1470px]:overflow-hidden min-[1470px]:flex min-[1470px]:flex-col">
      <div className="flex justify-between items-center mb-[18px] min-[1470px]:mb-2.5 min-[1470px]:shrink-0">
        <div>
          <h3 className="text-[15px] font-extrabold text-[rgb(7,2,45)] m-0">
            Recent Transactions
          </h3>
        </div>

        <a
          href="#"
          className="flex items-center gap-[7px] text-[rgb(77,55,255)] text-[10px] font-extrabold no-underline"
        >
          View All
        </a>
      </div>

      <div className="flex flex-col mt-3 min-[1470px]:flex-1 min-[1470px]:min-h-0 min-[1470px]:overflow-hidden">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              className="flex justify-between items-center py-[8.7px] border-b border-[rgb(239,236,248)] last:border-b-0 min-[1470px]:py-[7px]"
              key={transaction.billId}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[rgb(244,240,255)] text-[rgb(96,65,255)] flex items-center justify-center">
                  ₹
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-[rgb(10,5,45)] m-[0_0_4px]">
                    {transaction.billId}
                  </h4>
                  <p className="text-[9px] font-semibold text-[rgb(119,113,145)] m-0">
                    {transaction.itemCount} items
                  </p>
                </div>
              </div>

              <div className="text-right">
                <h4 className="text-[11px] font-black text-[rgb(5,1,39)] m-[0_0_5px]">
                  {formatMoney(transaction.total)}
                </h4>
                <span className="text-[8px] font-extrabold text-[rgb(22,172,91)] bg-[rgb(226,250,238)] py-1 px-[7px] rounded-[20px]">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-[#7b728f] text-[11px] font-extrabold">
            No transactions found
          </div>
        )}
      </div>

      <button className="w-full h-[38px] border border-[rgb(230,226,242)] bg-white rounded-lg text-[#830ad3] text-[11px] font-extrabold flex items-center justify-center gap-2.5 cursor-pointer transition-all duration-[400ms] hover:bg-[#830ad3] hover:text-white min-[1470px]:h-9 min-[1470px]:shrink-0">
        View All Transactions
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-[13px] h-[13px]"
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
