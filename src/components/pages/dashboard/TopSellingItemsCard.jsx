import React from "react";
import useTopSellingItems from "./hooks/useTopSellingItems";

const TopSellingItemsCard = ({ bills, details, inventory, formatMoney }) => {
  const topSelling = useTopSellingItems(bills, details, inventory);

  return (
    <div className="flex-1 bg-white rounded-[14px] p-3 flex flex-col gap-2.5 [font-family:Inter,Arial,sans-serif] shadow-[0_10px_30px_rgba(84,63,255,0.08)] max-[1470px]:w-full min-[1470px]:!w-auto min-[1470px]:!h-full min-[1470px]:min-w-0 min-[1470px]:min-h-0 min-[1470px]:p-[18px] min-[1470px]:overflow-hidden">
      <div className="flex w-full justify-between items-center mb-[11px]">
        <div>
          <h3 className="m-0 text-[15px] font-extrabold text-[rgb(7,2,45)]">
            Top Selling items
          </h3>
        </div>

        <div className="relative w-fit">
          <button
            type="button"
            className="w-fit h-8 px-2 border border-[rgb(227,222,243)] rounded-[7px] text-[10px] font-extrabold text-[rgb(7,2,45)] flex justify-center items-center gap-1.5 bg-white"
            onClick={() => topSelling.setMenuOpen((open) => !open)}
          >
            <span>{topSelling.selectedRange}</span>

            <img
              src="/assets/icons/top-selling-dropdown-arrow.svg"
              alt=""
              width="12"
              height="12"
              className="w-3 h-3"
            />
          </button>

          <div className={`${topSelling.menuOpen ? "block" : "hidden"} absolute top-9 right-0 min-w-[130px] bg-white border border-[#e5e7eb] rounded-lg shadow-[0_8px_18px_rgba(0,0,0,0.12)] z-[100] overflow-hidden`}>
            {topSelling.ranges.map((range) => (
              <button
                type="button"
                className="w-full border-0 bg-transparent text-left py-[9px] px-3 text-[13px] cursor-pointer hover:bg-[#f3f4f6]"
                key={range}
                onClick={() => topSelling.selectRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden min-[1470px]:flex-1 min-[1470px]:min-h-0">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <td
                colSpan="3"
                className="p-1.5 text-[10px] font-medium text-[#868585] text-left"
              >
                Items
              </td>
              <td className="p-1.5 text-[10px] font-medium text-[#868585] text-center">
                Qty Sold
              </td>
              <td className="p-1.5 text-[10px] font-medium text-[#868585] text-center">
                Revenue
              </td>
            </tr>
          </thead>

          <tbody id="topItemsBody">
            {topSelling.items.length > 0 ? (
              topSelling.items.map((item, index) => (
                <tr key={item.itemCode}>
                  <td className="p-1.5 text-[10px] font-medium text-center border-b border-transparent">
                    {index + 1}.
                  </td>
                  <td className="p-1.5 text-[10px] font-medium text-center border-b border-transparent">
                    <img
                      src={item.itemImage || "/assets/coffee.png"}
                      alt={item.itemName}
                      className="w-[30px] h-[30px] rounded-md object-cover"
                    />
                  </td>
                  <td className="p-1.5 text-[10px] font-medium text-center border-b border-[rgb(230,226,242)]">
                    {item.itemName}
                  </td>
                  <td className="p-1.5 text-[10px] font-medium text-center border-b border-[rgb(230,226,242)]">
                    {item.qty}
                  </td>
                  <td className="p-1.5 text-[10px] font-medium text-center border-b border-[rgb(230,226,242)]">
                    {formatMoney(item.revenue)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="py-[22px] px-0 text-center text-[#7b728f] text-[11px] font-extrabold"
                >
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="w-full flex cursor-pointer justify-center items-center">
        <button className="cursor-pointer transition-all duration-[400ms] w-full flex items-center justify-center h-[38px] bg-transparent text-[#830ad3] font-extrabold text-[11px] border border-[rgb(230,226,242)] rounded-md hover:bg-[#830ad3] hover:text-white">
          View All Products
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-3 h-3 ml-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TopSellingItemsCard;
