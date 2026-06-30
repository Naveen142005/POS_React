import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import {
  getCurrentDateTime,
  getNextCode,
  showPopups,
  uploadToCloudinary,
} from "../../../utils/utils";
import {
  addInventoryItem,
  deleteInventoryItem,
  updateInventoryItem,
} from "../../../redux/inventorySlice";

const defaultImage =
  "https://res.cloudinary.com/dyifzw0io/image/upload/v1780902691/spx6qyuhghvvnkgtvvxs.png";

const categories = [
  "Beverage",
  "Steamed Bun",
  "Steamed Timsum",
  "Deep Fry Timsum",
  "Bake",
  "Noodle/Dumplings",
  "Porridge",
];

const units = ["Kg", "Piece", "Liter"];
const suppliers = ["Supplier 1", "Supplier 2"];

const mainClass =
  "invf-main flex w-[calc(100%_-_200px)] min-h-screen ml-[200px] flex-col gap-3 p-3 max-[768px]:ml-0 max-[768px]:w-full max-[768px]:p-5 max-[520px]:p-3";
const sidebarClosedMainClass = "!ml-0 !w-full";

const cardClass =
  "w-full min-h-[calc(100vh_-_80px)] rounded-[8px] bg-white px-6 pb-8 pt-7 shadow-[0_0_10px_rgb(0_0_0_/_7%)] max-[520px]:px-[14px] max-[520px]:py-6";

const headClass = "flex flex-col items-center gap-[10px] text-center";
const titleClass = "text-[22px] font-bold text-[#08081f]";
const subtitleClass = "text-[13px] font-semibold text-[#676565]";

const formClass =
  "mx-auto mt-6 w-[min(1280px,_88%)] border-t border-[#d8dbe8] pt-7 max-[1000px]:w-[95%] max-[520px]:w-full";

const gridClass =
  "grid grid-cols-2 gap-x-[60px] gap-y-7 max-[1000px]:gap-x-8 max-[900px]:grid-cols-1";

const fieldClass = "relative flex min-w-0 flex-col gap-[10px]";
const labelClass = "text-[12px] font-bold text-[#101633]";
const requiredClass = "text-[#f00]";

const controlBaseClass =
  "w-full min-w-0 rounded-[7px] border border-[#b8b8cc] bg-white text-[13px] font-semibold text-[#243b82] outline-0 focus:border-[#5b36ff] focus:shadow-[0_0_0_2px_rgb(91_54_255_/_10%)]";

const inputClass = `${controlBaseClass} h-[47px] px-[15px] placeholder:text-[#35457c] placeholder:opacity-100 disabled:bg-[#fafafa] disabled:text-[#243b82] disabled:opacity-100`;

const selectClass = `${controlBaseClass} h-[47px] cursor-pointer appearance-none bg-[url('/assets/down_arrow_blac.png')] bg-[length:12px] bg-[right_15px_center] bg-no-repeat pl-[15px] pr-[42px]`;

const textareaClass = `${controlBaseClass} h-[154px] resize-y px-[15px] py-[18px] font-[inherit] placeholder:text-[#35457c] placeholder:opacity-100`;

const helpClass = "text-[10px] font-semibold text-[#243b82]";
const errorClass = "text-[11px] font-semibold text-[#d93025]";
const numberClass = "relative w-full";
const numberInputClass = `${controlBaseClass} h-[47px] py-0 pl-[15px] pr-[75px] placeholder:text-[#35457c] placeholder:opacity-100`;
const numberValueClass =
  "pointer-events-none absolute right-[15px] top-1/2 max-w-[65px] -translate-y-1/2 overflow-hidden text-ellipsis whitespace-nowrap text-[13px] font-semibold text-[#243b82]";

const uploadBaseClass =
  "flex h-[154px] w-full cursor-pointer gap-2 rounded-[7px] border border-[#c7cce1] bg-white text-[#101633]";
const uploadClass = (hasPreview) =>
  hasPreview
    ? `${uploadBaseClass} items-stretch justify-start overflow-hidden border-solid p-0 flex-row max-[520px]:h-auto max-[520px]:flex-col`
    : `${uploadBaseClass} flex-col items-center justify-center border-dashed p-3`;

const uploadIconClass = "h-8 w-8 object-contain";
const uploadStrongClass = "text-[12px]";
const uploadSmallClass = "text-[11px] font-semibold text-[#35457c]";
const previewClass =
  "h-full w-[45%] min-w-[140px] border-r border-[#c7cce1] p-[10px] object-contain max-[520px]:h-[130px] max-[520px]:w-full max-[520px]:border-r-0 max-[520px]:border-b";
const uploadTextClass =
  "flex min-w-0 flex-col items-start justify-center gap-[14px] p-[18px] text-left";
const fileClass = "hidden";
const removeClass =
  "w-max border-0 bg-transparent text-[10px] font-bold text-[#2400ff] underline cursor-pointer";

const actionsClass =
  "mt-[34px] flex items-center justify-center gap-5 max-[520px]:flex-col max-[520px]:items-stretch max-[520px]:gap-[10px]";
const actionButtonBaseClass =
  "flex h-12 w-[150px] cursor-pointer items-center justify-center gap-[10px] rounded-[7px] text-[13px] font-bold max-[520px]:w-full";
const cancelButtonClass = `${actionButtonBaseClass} border border-[#d6d9e6] bg-white text-[#101633] disabled:cursor-not-allowed disabled:opacity-[0.65]`;
const saveButtonClass = `${actionButtonBaseClass} border-0 bg-[linear-gradient(90deg,#5b36ff,#7705c3)] text-white disabled:cursor-wait disabled:opacity-70`;
const deleteButtonClass = `${actionButtonBaseClass} border border-[#ffb6b6] bg-white text-[#f00] disabled:cursor-not-allowed disabled:opacity-[0.65]`;
const saveIconClass = "h-[17px] w-[17px] object-contain";

const modalBgClass =
  "fixed inset-0 z-[100000] grid place-items-center bg-[rgb(5_5_20_/_48%)] p-5";
const modalClass =
  "w-[min(420px,100%)] rounded-[8px] bg-white p-6 shadow-[0_18px_50px_rgb(0_0_0_/_22%)]";
const modalTitleClass = "text-[18px] text-[#101633]";
const modalTextClass = "mt-[10px] text-[13px] leading-[1.5] text-[#626277]";
const modalActionsClass = "mt-[22px] flex justify-end gap-[10px]";
const modalButtonBaseClass =
  "h-[38px] min-w-[90px] cursor-pointer rounded-md border text-[12px] font-bold";
const modalButtonClass = `${modalButtonBaseClass} border-[#d6d9e6] bg-white`;
const confirmButtonClass = `${modalButtonBaseClass} border-[#e02828] bg-[#e02828] text-white`;

const getNewCode = (items) => {
  const latest = items.reduce((current, item) => {
    const currentNumber = Number(String(current).match(/\d+$/)?.[0] || 0);
    const itemNumber = Number(String(item.itemCode).match(/\d+$/)?.[0] || 0);
    return itemNumber > currentNumber ? item.itemCode : current;
  }, "ITM-00128");

  return getNextCode(latest);
};

const getInitialForm = (item, items) => ({
  itemCode: item?.itemCode || getNewCode(items),
  itemName: item?.itemName || "",
  itemImage: item?.itemImage || "",
  itemDescription: item?.itemDescription || "",
  category: item?.category || "",
  basePrice: item?.basePrice ?? "",
  unit: item?.unit || "",
  inStock: item?.inStock ?? "",
  sellingPrice: item?.sellingPrice ?? "",
  supplier: item?.supplier || "",
});

const validateForm = (form) => {
  const errors = {};

  if (!form.itemName.trim()) errors.itemName = "Item name is required";
  if (!form.category) errors.category = "Category is required";
  if (!form.unit) errors.unit = "Unit is required";

  if (
    form.basePrice === "" ||
    !Number.isFinite(Number(form.basePrice)) ||
    Number(form.basePrice) <= 0
  ) {
    errors.basePrice = "Enter a valid base price";
  }

  if (
    form.sellingPrice === "" ||
    !Number.isFinite(Number(form.sellingPrice)) ||
    Number(form.sellingPrice) <= 0
  ) {
    errors.sellingPrice = "Enter a valid selling price";
  }

  if (
    form.inStock === "" ||
    !Number.isFinite(Number(form.inStock)) ||
    Number(form.inStock) < 0
  ) {
    errors.inStock = "Enter a valid stock quantity";
  }

  return errors;
};

const getStatus = (stock) => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
};

const InventoryForm = ({ mode }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarClosed } = useOutletContext();
  const { itemCode } = useParams();
  const fileRef = useRef(null);
  const isEdit = mode === "edit";

  const items = useSelector((state) => state.inventory.items);
  const editItem = isEdit
    ? items.find((item) => String(item.itemCode) === String(itemCode))
    : null;
  const [form, setForm] = useState(() => getInitialForm(editItem, items));
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(editItem?.itemImage || "");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const categoryOptions = [...new Set([...categories, form.category].filter(Boolean))];
  const unitOptions = [...new Set([...units, form.unit].filter(Boolean))];
  const supplierOptions = [...new Set([...suppliers, form.supplier].filter(Boolean))];

  useEffect(() => {
    if (isEdit && !editItem) {
      showPopups("Inventory item not found", false);
      navigate("/inventory", { replace: true });
    }
  }, [editItem, isEdit, navigate]);

  useEffect(() => {
    if (!imageFile) {
      setPreview(form.itemImage || "");
      return undefined;
    }

    const imageUrl = URL.createObjectURL(imageFile);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [form.itemImage, imageFile]);

  const changeField = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));

    if (errors[name]) {
      const nextForm = { ...form, [name]: value };
      const nextErrors = validateForm(nextForm);
      setErrors((current) => ({
        ...current,
        [name]: nextErrors[name] || "",
      }));
    }
  };

  const validateField = (name) => {
    const nextErrors = validateForm(form);

    setErrors((current) => ({
      ...current,
      [name]: nextErrors[name] || "",
    }));
  };

  const setImage = (file) => {
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!validTypes.includes(file.type)) {
      setErrors((current) => ({ ...current, image: "Choose a PNG, JPG or WEBP image" }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((current) => ({ ...current, image: "Image must be 2MB or smaller" }));
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setImageFile(file);
    setErrors((current) => ({ ...current, image: "" }));
  };

  const selectImage = (event) => {
    setImage(event.target.files?.[0]);
  };

  const dropImage = (event) => {
    event.preventDefault();
    setImage(event.dataTransfer.files?.[0]);
  };

  const removeImage = (event) => {
    event.stopPropagation();
    setImageFile(null);
    setForm((current) => ({ ...current, itemImage: "" }));
    if (fileRef.current) fileRef.current.value = "";
  };

  const saveItem = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showPopups("Please fill all required fields", false);
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.itemImage || defaultImage;

      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
        if (!imageUrl) throw new Error("Image upload failed");
      }

      const stock = Number(form.inStock);
      const oldStock = Number(editItem?.inStock || 0);
      const oldPurchased = Number(editItem?.purchased || 0);
      const purchased = isEdit
        ? oldPurchased + Math.max(0, stock - oldStock)
        : stock;

      const item = {
        ...(editItem || {}),
        itemCode: form.itemCode,
        itemName: form.itemName.trim(),
        itemImage: imageUrl,
        itemDescription: form.itemDescription.trim(),
        category: form.category,
        basePrice: Number(form.basePrice),
        unit: form.unit,
        inStock: stock,
        sellingPrice: Number(form.sellingPrice),
        supplier: form.supplier,
        purchased,
        sold: Number(editItem?.sold || 0),
        status: getStatus(stock),
        update_at: getCurrentDateTime(),
      };

      dispatch(isEdit ? updateInventoryItem(item) : addInventoryItem(item));
      showPopups(isEdit ? "Item updated successfully" : "Item added successfully", true);
      setTimeout(() => navigate("/inventory"), 800);
    } catch (error) {
      showPopups(error.message || "Unable to save item", false);
      setSaving(false);
    }
  };

  const deleteItem = () => {
    dispatch(deleteInventoryItem(itemCode));
    setShowDelete(false);
    showPopups("Item deleted successfully", true);
    setTimeout(() => navigate("/inventory"), 800);
  };

  if (isEdit && !editItem) return null;

  return (
    <div>
      <main className={`${mainClass} ${sidebarClosed ? sidebarClosedMainClass : ""}`}>
        <PageHeader pageName="Inventory" />

        <section className={cardClass}>
          <header className={headClass}>
            <h1 className={titleClass}>{isEdit ? "Edit Inventory" : "Add New Item"}</h1>
            <p className={subtitleClass}>
              {isEdit
                ? "Update the details of the inventory item"
                : "Add a new item to your inventory"}
            </p>
          </header>

          <form className={formClass} onSubmit={saveItem} noValidate>
            <div className={gridClass}>
              <div className={fieldClass}>
                <label className={labelClass} htmlFor="itemCode">Item Code</label>
                <input className={inputClass} id="itemCode" value={form.itemCode} disabled />
                <small className={helpClass}>Auto-generated</small>
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="itemName">
                  Item Name <sup className={requiredClass}>*</sup>
                </label>
                <input
                  className={inputClass}
                  id="itemName"
                  name="itemName"
                  value={form.itemName}
                  onChange={changeField}
                  onBlur={() => validateField("itemName")}
                  placeholder="Enter item name"
                />
                {errors.itemName && <small className={errorClass}>{errors.itemName}</small>}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="itemImage">Item Image</label>
                <button
                  type="button"
                  className={uploadClass(Boolean(preview))}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={dropImage}
                >
                  {preview ? (
                    <>
                      <img className={previewClass} src={preview} alt="Item preview" />
                      <span className={uploadTextClass}>
                        <strong className={uploadStrongClass}>Change Image</strong>
                        <small className={uploadSmallClass}>PNG, JPG or WEBP (Max. 2MB)</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <img className={uploadIconClass} src="/assets/upload.png" alt="" />
                      <strong className={uploadStrongClass}>Click to upload or drag and drop</strong>
                      <small className={uploadSmallClass}>PNG, JPG or WEBP (Max. 2MB)</small>
                    </>
                  )}
                </button>
                <input
                  ref={fileRef}
                  className={fileClass}
                  type="file"
                  id="itemImage"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={selectImage}
                />
                {preview && (
                  <button type="button" className={removeClass} onClick={removeImage}>
                    Remove image
                  </button>
                )}
                {errors.image && <small className={errorClass}>{errors.image}</small>}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="itemDescription">Item Description</label>
                <textarea
                  className={textareaClass}
                  id="itemDescription"
                  name="itemDescription"
                  value={form.itemDescription}
                  onChange={changeField}
                  placeholder="Enter item description"
                />
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="category">
                  Category <sup className={requiredClass}>*</sup>
                </label>
                <select
                  className={selectClass}
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
                {errors.category && <small className={errorClass}>{errors.category}</small>}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="basePrice">
                  Base Price <sup className={requiredClass}>*</sup>
                </label>
                <div className={numberClass}>
                  <input
                    className={numberInputClass}
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
                  <span className={numberValueClass}>{form.basePrice === "" ? "0.00" : Number(form.basePrice).toFixed(2)}</span>
                </div>
                {errors.basePrice && <small className={errorClass}>{errors.basePrice}</small>}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="unit">
                  Unit <sup className={requiredClass}>*</sup>
                </label>
                <select
                  className={selectClass}
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
                {errors.unit && <small className={errorClass}>{errors.unit}</small>}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="inStock">
                  In Stock <sup className={requiredClass}>*</sup>
                </label>
                <div className={numberClass}>
                  <input
                    className={numberInputClass}
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
                  <span className={numberValueClass}>{form.inStock === "" ? "0" : form.inStock}</span>
                </div>
                {errors.inStock && <small className={errorClass}>{errors.inStock}</small>}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="sellingPrice">
                  Selling Price <sup className={requiredClass}>*</sup>
                </label>
                <div className={numberClass}>
                  <input
                    className={numberInputClass}
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
                  <span className={numberValueClass}>
                    {form.sellingPrice === "" ? "0.00" : Number(form.sellingPrice).toFixed(2)}
                  </span>
                </div>
                {errors.sellingPrice && (
                  <small className={errorClass}>{errors.sellingPrice}</small>
                )}
              </div>

              <div className={fieldClass}>
                <label className={labelClass} htmlFor="supplier">Supplier</label>
                <select
                  className={selectClass}
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
            </div>

            <div className={actionsClass}>
              <button
                type="button"
                className={cancelButtonClass}
                onClick={() => navigate("/inventory")}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className={saveButtonClass} disabled={saving}>
                <img className={saveIconClass} src="/assets/save.png" alt="" />
                {saving ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className={deleteButtonClass}
                  onClick={() => setShowDelete(true)}
                  disabled={saving}
                >
                  Delete
                </button>
              )}
            </div>
          </form>
        </section>
      </main>

      {showDelete && (
        <div className={modalBgClass} role="presentation" onMouseDown={() => setShowDelete(false)}>
          <div
            className={modalClass}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 className={modalTitleClass} id="delete-title">Delete inventory item?</h2>
            <p className={modalTextClass}>This will permanently remove {form.itemName || form.itemCode}.</p>
            <div className={modalActionsClass}>
              <button className={modalButtonClass} type="button" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button type="button" className={confirmButtonClass} onClick={deleteItem}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryForm;
