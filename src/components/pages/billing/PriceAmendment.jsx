const PriceAmendment = ({ total, gst, payable, tender, change, onTenderChange }) => (
  <div className="bill-price-box" id="priceBox">
    <div className="bill-price-head">
      <img src="/assets/tag_purple.png" alt="" />
      <h3>Price Amendment</h3>
    </div>
    <div className="bill-price-line"></div>
    <div className="bill-price-row"><p>Total Amount</p><h4>₹{total.toFixed(2)}</h4></div>
    <div className="bill-price-row"><p>GST Amount (7%)</p><h4>₹{gst.toFixed(2)}</h4></div>
    <div className="bill-price-line"></div>
    <div className="bill-price-row bill-payable-row"><p>Payable</p><h2>₹{payable.toFixed(2)}</h2></div>
    <div className="bill-price-line"></div>
    <div className="bill-price-row bill-tender-row">
      <p>Tender</p>
      <div className="bill-tender-box">
        <span>₹</span>
        <input type="text" value={tender} onChange={(event) => onTenderChange(event.target.value)} />
      </div>
    </div>
    <div className="bill-change-box">
      <p>Change (Balance)</p>
      <h2>₹{change.toFixed(2)}</h2>
    </div>
  </div>
);

export default PriceAmendment;
