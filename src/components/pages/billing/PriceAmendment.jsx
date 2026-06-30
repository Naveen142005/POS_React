const PriceAmendment = ({ total, gst, payable, tender, change, onTenderChange }) => (
  <div
    className="bill-price-box min-h-[400px] w-full rounded-[10px] bg-white p-5 shadow-[var(--box-shadow)] max-[900px]:min-h-0 max-[900px]:p-[18px] max-[600px]:rounded-lg max-[600px]:p-[15px]"
    id="priceBox"
  >
    <div className="bill-price-head flex items-center gap-3">
      <img className="h-[18px] w-[18px]" src="/assets/tag_purple.png" alt="" />
      <h3 className="text-base font-bold text-[#111] max-[600px]:text-[15px]">Price Amendment</h3>
    </div>
    <div className="bill-price-line my-5 h-px bg-[#eee] max-[600px]:my-4"></div>
    <div className="bill-price-row mx-[15px] my-[26px] flex items-center justify-between max-[900px]:mx-1 max-[900px]:my-3 max-[600px]:mx-[5px] max-[600px]:my-2.5 max-[420px]:mx-0 max-[420px]:my-[18px]">
      <p className="text-[13px] font-semibold text-[#111] max-[600px]:text-xs">Total Amount</p>
      <h4 className="text-[17px] font-bold text-[#111] max-[600px]:text-[15px]">₹{total.toFixed(2)}</h4>
    </div>
    <div className="bill-price-row mx-[15px] my-[26px] flex items-center justify-between max-[900px]:mx-1 max-[900px]:my-3 max-[600px]:mx-[5px] max-[600px]:my-2.5 max-[420px]:mx-0 max-[420px]:my-[18px]">
      <p className="text-[13px] font-semibold text-[#111] max-[600px]:text-xs">GST Amount (7%)</p>
      <h4 className="text-[17px] font-bold text-[#111] max-[600px]:text-[15px]">₹{gst.toFixed(2)}</h4>
    </div>
    <div className="bill-price-line my-5 h-px bg-[#eee] max-[600px]:my-4"></div>
    <div className="bill-price-row bill-payable-row mx-[15px] my-[26px] flex items-center justify-between max-[900px]:mx-1 max-[900px]:my-3 max-[600px]:mx-[5px] max-[600px]:my-2.5 max-[420px]:mx-0 max-[420px]:my-[18px]">
      <p className="text-[13px] font-semibold text-[#111] max-[600px]:text-xs">Payable</p>
      <h2 className="text-[25px] text-[#6338f6] max-[900px]:text-[22px] max-[600px]:text-[21px] max-[420px]:text-[19px]">₹{payable.toFixed(2)}</h2>
    </div>
    <div className="bill-price-line my-5 h-px bg-[#eee] max-[600px]:my-4"></div>
    <div className="bill-price-row bill-tender-row mx-[15px] mb-[26px] mt-3 flex items-center justify-between max-[900px]:mx-1 max-[900px]:my-3 max-[600px]:mx-[5px] max-[600px]:my-2.5 max-[420px]:mx-0 max-[420px]:my-[18px] max-[420px]:items-start max-[420px]:gap-2.5">
      <p className="text-[13px] font-semibold text-[#111] max-[600px]:text-xs">Tender</p>
      <div className="bill-tender-box flex h-[42px] w-[145px] items-center gap-5 rounded-[7px] border border-[#e4e4ef] px-[14px] max-[600px]:h-[38px] max-[600px]:w-[125px] max-[600px]:gap-2.5 max-[600px]:px-2.5 max-[420px]:w-[115px]">
        <span className="text-[15px] font-semibold text-[#4b4b72]">₹</span>
        <input
          className="w-20 border-0 bg-transparent text-base font-medium text-[#4b4b72] outline-none max-[600px]:w-[65px] max-[600px]:text-sm"
          type="text"
          value={tender}
          onChange={(event) => onTenderChange(event.target.value)}
        />
      </div>
    </div>
    <div className="bill-change-box mt-[18px] flex items-center justify-between rounded-[7px] bg-[linear-gradient(90deg,#f4efff,#eee5ff)] px-[15px] py-[18px] max-[900px]:h-[50px] max-[600px]:p-3">
      <p className="text-[13px] font-semibold text-[#111] max-[600px]:text-xs">Change (Balance)</p>
      <h2 className="text-[23px] text-[#6338f6] max-[900px]:text-[22px] max-[600px]:text-xl max-[420px]:text-[19px]">₹{change.toFixed(2)}</h2>
    </div>
  </div>
);

export default PriceAmendment;
