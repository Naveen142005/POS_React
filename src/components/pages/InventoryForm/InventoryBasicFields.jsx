const InventoryBasicFields = ({
  form,
  errors,
  categoryOptions,
  unitOptions,
  supplierOptions,
  imageUpload,
  changeField,
  validateField,
}) => {


  return (
    <>
      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="itemCode">
          Item Code
        </label>
        <input className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] px-[15px] placeholder:text-[#35457c] placeholder:opacity-100 disabled:bg-[#fafafa] disabled:text-[#243b82] disabled:opacity-100" id="itemCode" value={form.itemCode} disabled />
        <small className="text-[10px] font-semibold text-[#243b82]">
          Auto-generated
        </small>
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="itemName">
          Item Name <sup className="text-[#f00]">*</sup>
        </label>
        <input
          className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] px-[15px] placeholder:text-[#35457c] placeholder:opacity-100 disabled:bg-[#fafafa] disabled:text-[#243b82] disabled:opacity-100"
          id="itemName"
          name="itemName"
          value={form.itemName}
          onChange={changeField}
          onBlur={() => validateField("itemName")}
          placeholder="Enter item name"
        />
        {errors.itemName && (
          <small className="text-[11px] font-semibold text-[#d93025]">
            {errors.itemName}
          </small>
        )}
      </div>

      {imageUpload}

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="itemDescription">
          Item Description
        </label>
        <textarea
          className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[154px] resize-y px-[15px] py-[18px] font-[inherit] placeholder:text-[#35457c] placeholder:opacity-100"
          id="itemDescription"
          name="itemDescription"
          value={form.itemDescription}
          onChange={changeField}
          placeholder="Enter item description"
        />
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="category">
          Category <sup className="text-[#f00]">*</sup>
        </label>
        <select
          className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] cursor-pointer appearance-none bg-[url('/assets/down_arrow_blac.png')] bg-[length:12px] bg-[right_15px_center] bg-no-repeat pl-[15px] pr-[42px]"
          id="category"
          name="category"
          value={form.category}
          onChange={changeField}
          onBlur={() => validateField("category")}
        >
          <option value="">Select category</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        {errors.category && (
          <small className="text-[11px] font-semibold text-[#d93025]">
            {errors.category}
          </small>
        )}
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="basePrice">
          Base Price <sup className="text-[#f00]">*</sup>
        </label>
        <div className="relative w-full">
          <input
            className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] py-0 pl-[15px] pr-[75px] placeholder:text-[#35457c] placeholder:opacity-100"
            type="number"
            id="basePrice"
            name="basePrice"
            min="0"
            step="0.01"
            value={form.basePrice}
            onChange={changeField}
            onBlur={() => validateField("basePrice")}
            placeholder="Enter price"
          />
          <span className="pointer-events-none absolute right-[15px] top-1/2 max-w-[65px] -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#243b82]">
            {form.basePrice === "" ? "0.00" : Number(form.basePrice).toFixed(2)}
          </span>
        </div>
        {errors.basePrice && (
          <small className="text-[11px] font-semibold text-[#d93025]">
            {errors.basePrice}
          </small>
        )}
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="unit">
          Unit <sup className="text-[#f00]">*</sup>
        </label>
        <select
          className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] cursor-pointer appearance-none bg-[url('/assets/down_arrow_blac.png')] bg-[length:12px] bg-[right_15px_center] bg-no-repeat pl-[15px] pr-[42px]"
          id="unit"
          name="unit"
          value={form.unit}
          onChange={changeField}
          onBlur={() => validateField("unit")}
        >
          <option value="">Select unit</option>
          {unitOptions.map((unit) => (
            <option key={unit} value={unit}>
              {unit}
            </option>
          ))}
        </select>
        {errors.unit && (
          <small className="text-[11px] font-semibold text-[#d93025]">
            {errors.unit}
          </small>
        )}
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="inStock">
          In Stock <sup className="text-[#f00]">*</sup>
        </label>
        <div className="relative w-full">
          <input
            className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] py-0 pl-[15px] pr-[75px] placeholder:text-[#35457c] placeholder:opacity-100"
            type="number"
            id="inStock"
            name="inStock"
            min="0"
            step="1"
            value={form.inStock}
            onChange={changeField}
            onBlur={() => validateField("inStock")}
            placeholder="Enter stock quantity"
          />
          <span className="pointer-events-none absolute right-[15px] top-1/2 max-w-[65px] -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#243b82]">
            {form.inStock === "" ? "0" : form.inStock}
          </span>
        </div>
        {errors.inStock && (
          <small className="text-[11px] font-semibold text-[#d93025]">
            {errors.inStock}
          </small>
        )}
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="sellingPrice">
          Selling Price <sup className="text-[#f00]">*</sup>
        </label>
        <div className="relative w-full">
          <input
            className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] py-0 pl-[15px] pr-[75px] placeholder:text-[#35457c] placeholder:opacity-100"
            type="number"
            id="sellingPrice"
            name="sellingPrice"
            min="0"
            step="0.01"
            value={form.sellingPrice}
            onChange={changeField}
            onBlur={() => validateField("sellingPrice")}
            placeholder="Enter price"
          />
          <span className="pointer-events-none absolute right-[15px] top-1/2 max-w-[65px] -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#243b82]">
            {form.sellingPrice === ""
              ? "0.00"
              : Number(form.sellingPrice).toFixed(2)}
          </span>
        </div>
        {errors.sellingPrice && (
          <small className="text-[11px] font-semibold text-[#d93025]">
            {errors.sellingPrice}
          </small>
        )}
      </div>

      <div className="relative flex min-w-0 flex-col gap-[10px]">
        <label className="text-[12px] font-bold text-[#101633]" htmlFor="supplier">
          Supplier
        </label>
        <select
          className="w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)] h-[47px] cursor-pointer appearance-none bg-[url('/assets/down_arrow_blac.png')] bg-[length:12px] bg-[right_15px_center] bg-no-repeat pl-[15px] pr-[42px]"
          id="supplier"
          name="supplier"
          value={form.supplier}
          onChange={changeField}
        >
          <option value="">Select supplier</option>
          {supplierOptions.map((supplier) => (
            <option key={supplier} value={supplier}>
              {supplier}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default InventoryBasicFields;
