const BillingTable = ({ items, inventory, onQuantityChange, onDelete }) => (
  <>
    <table id="table_head">
      <tbody>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Unit Price</th>
          <th>Total</th>
        </tr>
      </tbody>
    </table> 
    <table id="billingTable">
      <tbody>
        {items.map((item) => {
          const stockItem = inventory.find((entry) => String(entry.itemCode) === String(item.itemCode));
          return (
            <tr key={item.billingId}>
              <td>
                <div className="bill-item"><div className="bill-item-icon"><img src={item.itemImage || "/assets/soya_milk.png"} alt="" /></div><span>{item.itemName}</span></div>
              </td>
              <td>
                <div className="bill-qty-num"><input type="number" min="1" max={Number(stockItem?.inStock || 1)} value={item.qty} onChange={(event) => onQuantityChange(item.billingId, event.target.value)} /></div>
              </td>
              <td>₹{Number(item.sellingPrice).toFixed(2)}</td>
              <td>₹{Number(item.total).toFixed(2)}</td>
              <td>
                <button className="bill-del-btn" type="button" onClick={() => onDelete(item.billingId)}><img src="/assets/delete.png" alt="" /></button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </>
);

export default BillingTable;
