const tableClass =
  "w-full border-collapse max-[600px]:min-w-[560px] [&_tr]:h-[52px] [&_tr]:border-b-0 [&_tr:first-child]:h-[42px] [&_tr:first-child]:border-b [&_tr:first-child]:border-[#eef0f6] [&_th]:px-[22px] [&_th]:text-left [&_th]:text-xs [&_th]:font-extrabold [&_th]:text-[#14184b] [&_td]:text-xs [&_td]:font-bold [&_td]:text-[#111827] [&_td:nth-child(2)]:text-center [&_td:nth-child(3)]:text-center [&_td:nth-child(4)]:text-center [&_th:nth-child(1)]:w-[38%] [&_th:nth-child(2)]:w-[18%] [&_th:nth-child(2)]:text-center [&_th:nth-child(3)]:w-[22%] [&_th:nth-child(3)]:text-center [&_th:nth-child(4)]:w-[22%] [&_th:nth-child(4)]:text-center";

const BillingTable = ({ items, inventory, onQuantityChange, onDelete }) => (
  <>
    <table className={tableClass} id="table_head">
      <tbody>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </tbody>
    </table>
    <table className={tableClass} id="billingTable">
      <tbody>
        {items.map((item) => {
          const stockItem = inventory.find((entry) => String(entry.itemCode) === String(item.itemCode));
          return (
            <tr key={item.billingId}>
              <td>
                <div className="bill-item flex items-center gap-2.5">
                  <div className="bill-item-icon">
                    <img className="flex h-[34px] w-[34px] items-center justify-center rounded-[7px] bg-[#f1edff] text-[17px]" src={item.itemImage || "/assets/soya_milk.png"} alt="" />
                  </div>
                  <span>{item.itemName}</span>
                </div>
              </td>
              <td>
                <div className="bill-qty-num mx-auto flex h-[34px] w-12 items-center justify-center overflow-hidden rounded-[7px] border border-[#e8e9f3] bg-white">
                  <input
                    className="h-full w-full border-0 bg-transparent text-center text-sm outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                    type="number"
                    min="1"
                    max={Number(stockItem?.inStock || 1)}
                    value={item.qty}
                    onChange={(event) => onQuantityChange(item.billingId, event.target.value)}
                  />
                </div>
              </td>
              <td>₹{Number(item.sellingPrice).toFixed(2)}</td>
              <td>₹{Number(item.total).toFixed(2)}</td>
              <td>
                <button className="bill-del-btn cursor-pointer border-0 bg-transparent text-[15px] text-[#37307d]" type="button" onClick={() => onDelete(item.billingId)}>
                  <img className="h-[25px] w-[25px]" src="/assets/delete.png" alt="" />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </>
);

export default BillingTable;
