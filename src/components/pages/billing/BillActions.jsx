const BillActions = ({ onNewBill, onPrice, onCash, onGift }) => (
  <div className="bill-actions">
    <div className="bill-first-two">
      <div className="bill-new-btn" onClick={onNewBill}>
        <img src="/assets/plus.png" alt="" /><span>New Bill</span>
      </div>
      <div className="bill-price-btn" id="price-amendment" onClick={onPrice}>
        <img src="/assets/tag.png" alt="" /><span>Price Amendment</span>
      </div>
    </div>
    <div className="bill-price-list">
      {[2, 5, 10, 20, 50].map((amount) => (
        <div className="bill-cash-value" key={amount} onClick={() => onCash(amount)}>₹{amount}</div>
      ))}
      <div className="bill-cash-value bill-gift-voucher" onClick={onGift}>
        <img src="/assets/gift.png" alt="" /><span>Gift Voucher</span>
      </div>
    </div>
  </div>
);

export default BillActions;
