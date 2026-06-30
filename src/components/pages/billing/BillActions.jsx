const billTileClass =
  "flex flex-1 cursor-pointer flex-col items-center justify-center gap-[9px] border-r border-[rgba(255,255,255,0.18)] bg-[linear-gradient(135deg,#5b36ff,#7705c3)] text-center text-white";

const BillActions = ({ onNewBill, onPrice, onCash, onGift }) => (
  <div className="bill-actions flex overflow-hidden rounded-xl bg-[rgba(214,148,244,0.817)] gap-px shadow-[0_8px_24px_rgba(91,54,255,0.18)] [grid-area:bill-actions] max-[600px]:h-[90px] [&_img]:h-6 [&_img]:w-6 [&_img]:object-contain [&_img]:[filter:brightness(0)_invert(1)] max-[600px]:[&_img]:h-[17px] max-[600px]:[&_img]:w-[17px] [&_span]:text-xs [&_span]:font-semibold [&_span]:text-white max-[600px]:[&_span]:text-[9px]">
    <div className="bill-first-two flex w-[43%] gap-px">
      <div className={`bill-new-btn ${billTileClass}`} onClick={onNewBill}>
        <img src="/assets/plus.png" alt="" />
        <span>New Bill</span>
      </div>
      <div
        className={`bill-price-btn ${billTileClass} max-[1200px]:items-center max-[1200px]:justify-center max-[1200px]:text-xs max-[1200px]:[&_span]:text-center`}
        id="price-amendment"
        onClick={onPrice}
      >
        <img src="/assets/tag.png" alt="" />
        <span>Price Amendment</span>
      </div>
    </div>
    <div className="bill-price-list grid flex-1 grid-cols-3 grid-rows-2 gap-px">
      {[2, 5, 10, 20, 50].map((amount) => (
        <div
          className="bill-cash-value flex cursor-pointer items-center justify-center rounded bg-[linear-gradient(135deg,#ab4ae3,#b33beb)] text-center text-[15px] font-medium text-white max-[600px]:text-[11px]"
          key={amount}
          onClick={() => onCash(amount)}
        >
          ₹{amount}
        </div>
      ))}
      <div
        className="bill-cash-value bill-gift-voucher flex cursor-pointer flex-col items-center justify-center gap-[5px] rounded bg-[linear-gradient(135deg,#ab4ae3,#b33beb)] text-center text-xs font-medium text-white max-[600px]:gap-0.5 [&_img]:h-[22px] [&_img]:w-[22px] max-[600px]:[&_img]:h-4 max-[600px]:[&_img]:w-4 [&_span]:text-[11px] [&_span]:font-bold max-[600px]:[&_span]:text-[8px]"
        onClick={onGift}
      >
        <img src="/assets/gift.png" alt="" />
        <span>Gift Voucher</span>
      </div>
    </div>
  </div>
);

export default BillActions;
