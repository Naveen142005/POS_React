const EmptyBill = () => (
  <div
    className="bill-empty-bill flex flex-1 flex-col items-center justify-center text-[#14184b]"
    id="noBillingItem"
  >
    <div className="bill-empty-icon mb-4 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#f1edff]">
      <img className="h-[34px] w-[34px] object-contain" src="/assets/bill.png" alt="" />
    </div>
    <h4 className="mb-2 text-[13px] font-extrabold">No items added yet</h4>
    <p className="text-[11px] font-medium text-[#6b5ca5]">
      Select items from the menu to add to the bill
    </p>
  </div>
);

export default EmptyBill;
