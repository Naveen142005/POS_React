const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "⌫"];

const Calculator = ({ itemCode, quantity, tableNo, covers, onItemCode, onQuantity, onTableNo, onCovers, onAdd }) => {
  const pressKey = (key) => {
    if (key === "⌫") return onItemCode(itemCode.slice(0, -1));
    if (key === "." && itemCode.includes(".")) return;
    onItemCode(`${itemCode}${key}`);
  };

  const clearAll = () => {
    onItemCode("");
    onQuantity(1);
    onTableNo("");
    onCovers("");
  };

  return (
    <div className="bill-calc-box">
      <div className="bill-calc-left">
        <div className="bill-input-group">
          <label>Item Number</label>
          <div className="bill-input-box"><input value={itemCode} onChange={(event) => onItemCode(event.target.value)} onKeyDown={(event) => event.key === "Enter" && onAdd()} placeholder="Scan / Enter item number" /><img src="/assets/scanner.png" className="bill-scanner-icon" alt="" /></div>
        </div>
        <div className="bill-input-group"><label>Table No</label><div className="bill-input-box bill-field-small"><input value={tableNo} onChange={(event) => onTableNo(event.target.value)} placeholder="Enter table no" /></div></div>
        <div className="bill-input-group"><label>No of Cover</label><div className="bill-input-box bill-field-small"><input value={covers} onChange={(event) => onCovers(event.target.value)} placeholder="Enter no of cover" /></div></div>
      </div>

      <div className="bill-calc-middle">
        <div className="bill-input-group">
          <label>Quantity</label>
          <div className="bill-qty-box"><button type="button" onClick={() => onQuantity(Math.max(1, quantity - 1))}>-</button><span>{quantity}</span><button type="button" onClick={() => onQuantity(quantity + 1)}>+</button></div>
        </div>
        <div className="bill-num-pad">
          {keys.map((key) => <button type="button" key={key} onClick={() => pressKey(key)}>{key}</button>)}
        </div>
      </div>

      <div className="bill-calc-right">
        <button className="bill-add-btn" type="button" onClick={onAdd}>Add</button>
        <button className="bill-clear-btn" type="button" onClick={clearAll}>AC</button>
        <button className="bill-clear-btn" type="button" onClick={() => onItemCode("")}>Clear</button>
      </div>
    </div>
  );
};

export default Calculator;
