const keys = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "⌫"];

const inputBoxClass =
  "bill-input-box flex h-9 w-full items-center rounded-[7px] border border-[#e8e9f3] bg-[#fbfcff] px-[11px] max-[600px]:h-8 max-[600px]:px-[9px] [&_input]:h-full [&_input]:w-full [&_input]:border-0 [&_input]:bg-transparent [&_input]:text-[11px] [&_input]:font-semibold [&_input]:text-[#171445] [&_input]:outline-none [&_input]:placeholder:text-[11px] [&_input]:placeholder:text-[#8c7fb4] max-[600px]:[&_input]:text-[10px] max-[600px]:[&_input]:placeholder:text-[10px]";

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
    <div className="bill-calc-box grid items-center gap-[22px] rounded-xl bg-white px-[22px] py-4 shadow-[0_8px_24px_rgba(17,24,39,0.04)] [grid-area:calc-box] [grid-template-columns:1.3fr_1.2fr_0.55fr] max-[600px]:grid-cols-1 max-[600px]:gap-2.5 max-[600px]:p-2.5 min-[1201px]:gap-[14px]">
      <div className="bill-calc-left relative bottom-1.5 flex h-full flex-col justify-center gap-[18px] max-[600px]:gap-2.5">
        <div className="bill-input-group flex flex-col gap-[7px] max-[600px]:gap-[5px]">
          <label className="text-xs font-extrabold text-[#171445] max-[600px]:text-[10px]">Item Number</label>
          <div className={inputBoxClass}>
            <input
              value={itemCode}
              onChange={(event) => onItemCode(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && onAdd()}
              placeholder="Scan / Enter item number"
            />
            <img
              src="/assets/scanner.png"
              className="bill-scanner-icon h-[22px] w-[22px] shrink-0 cursor-pointer object-contain max-[600px]:h-[18px] max-[600px]:w-[18px]"
              alt=""
            />
          </div>
        </div>
        <div className="bill-input-group flex flex-col gap-[7px] max-[600px]:gap-[5px]">
          <label className="text-xs font-extrabold text-[#171445] max-[600px]:text-[10px]">Table No</label>
          <div className={`${inputBoxClass} bill-field-small max-[600px]:w-full`}>
            <input
              value={tableNo}
              onChange={(event) => onTableNo(event.target.value)}
              placeholder="Enter table no"
            />
          </div>
        </div>
        <div className="bill-input-group flex flex-col gap-[7px] max-[600px]:gap-[5px]">
          <label className="text-xs font-extrabold text-[#171445] max-[600px]:text-[10px]">No of Cover</label>
          <div className={`${inputBoxClass} bill-field-small max-[600px]:w-full`}>
            <input
              value={covers}
              onChange={(event) => onCovers(event.target.value)}
              placeholder="Enter no of cover"
            />
          </div>
        </div>
      </div>

      <div className="bill-calc-middle flex h-full flex-col justify-center gap-[18px] max-[600px]:gap-2.5">
        <div className="bill-input-group flex flex-col gap-[7px] max-[600px]:gap-[5px]">
          <label className="text-xs font-extrabold text-[#171445] max-[600px]:text-[10px]">Quantity</label>
          <div className="bill-qty-box grid h-9 w-full grid-cols-3 overflow-hidden rounded-[7px] border border-[#e8e9f3] bg-[#fbfcff] max-[600px]:h-8 [&_button]:grid [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-[13px] [&_button]:font-extrabold [&_button]:text-[#171445] [&_span]:grid [&_span]:place-items-center [&_span]:border-0 [&_span]:bg-transparent [&_span]:text-[13px] [&_span]:font-extrabold [&_span]:text-[#171445] max-[600px]:[&_button]:text-xs max-[600px]:[&_span]:text-xs">
            <button type="button" onClick={() => onQuantity(Math.max(1, quantity - 1))}>-</button>
            <span>{quantity}</span>
            <button type="button" onClick={() => onQuantity(quantity + 1)}>+</button>
          </div>
        </div>
        <div className="bill-num-pad grid w-full grid-cols-3 gap-[7px] max-[600px]:gap-1.5">
          {keys.map((key) => (
            <button
              className="h-8 cursor-pointer rounded-md border border-[#eef0f6] bg-[#fbfcff] text-[13px] font-extrabold text-[#111827] max-[600px]:h-[30px] max-[600px]:text-xs"
              type="button"
              key={key}
              onClick={() => pressKey(key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div className="bill-calc-right flex flex-col justify-evenly gap-5 pt-[25px] max-[600px]:grid max-[600px]:grid-cols-3 max-[600px]:gap-2 max-[600px]:pt-0 min-[1201px]:gap-3 min-[1201px]:pt-0">
        <button className="bill-add-btn h-9 w-full cursor-pointer rounded-[7px] border-0 bg-[linear-gradient(135deg,#5b36ff,#7705c3)] text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(91,54,255,0.28)] max-[600px]:h-8 max-[600px]:text-[10px]" type="button" onClick={onAdd}>Add</button>
        <button className="bill-clear-btn h-9 w-full cursor-pointer rounded-[7px] border-0 bg-[linear-gradient(135deg,#5b36ff,#7705c3)] text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(91,54,255,0.28)] max-[600px]:h-8 max-[600px]:text-[10px]" type="button" onClick={clearAll}>AC</button>
        <button className="bill-clear-btn h-9 w-full cursor-pointer rounded-[7px] border-0 bg-[linear-gradient(135deg,#5b36ff,#7705c3)] text-xs font-extrabold text-white shadow-[0_8px_18px_rgba(91,54,255,0.28)] max-[600px]:h-8 max-[600px]:text-[10px]" type="button" onClick={() => onItemCode("")}>Clear</button>
      </div>
    </div>
  );
};

export default Calculator;
