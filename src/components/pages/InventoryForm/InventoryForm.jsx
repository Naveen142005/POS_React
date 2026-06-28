import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import "./inventoryForm.css";

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
      <main className="invf-main">
        <PageHeader pageName="Inventory" />

        <section className="invf-card">
          <header className="invf-head">
            <h1>{isEdit ? "Edit Inventory" : "Add New Item"}</h1>
            <p>
              {isEdit
                ? "Update the details of the inventory item"
                : "Add a new item to your inventory"}
            </p>
          </header>

          <form className="invf-form" onSubmit={saveItem} noValidate>
            <div className="invf-grid">
              <div className="invf-field">
                <label htmlFor="itemCode">Item Code</label>
                <input id="itemCode" value={form.itemCode} disabled />
                <small className="invf-help">Auto-generated</small>
              </div>

              <div className="invf-field">
                <label htmlFor="itemName">
                  Item Name <sup>*</sup>
                </label>
                <input
                  id="itemName"
                  name="itemName"
                  value={form.itemName}
                  onChange={changeField}
                  onBlur={() => validateField("itemName")}
                  placeholder="Enter item name"
                />
                {errors.itemName && <small className="invf-error">{errors.itemName}</small>}
              </div>

              <div className="invf-field">
                <label htmlFor="itemImage">Item Image</label>
                <button
                  type="button"
                  className={`invf-upload ${preview ? "has-image" : ""}`}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={dropImage}
                >
                  {preview ? (
                    <>
                      <img className="invf-preview" src={preview} alt="Item preview" />
                      <span className="invf-upload-text">
                        <strong>Change Image</strong>
                        <small>PNG, JPG or WEBP (Max. 2MB)</small>
                      </span>
                    </>
                  ) : (
                    <>
                      <img src="/assets/upload.png" alt="" />
                      <strong>Click to upload or drag and drop</strong>
                      <small>PNG, JPG or WEBP (Max. 2MB)</small>
                    </>
                  )}
                </button>
                <input
                  ref={fileRef}
                  className="invf-file"
                  type="file"
                  id="itemImage"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={selectImage}
                />
                {preview && (
                  <button type="button" className="invf-remove" onClick={removeImage}>
                    Remove image
                  </button>
                )}
                {errors.image && <small className="invf-error">{errors.image}</small>}
              </div>

              <div className="invf-field">
                <label htmlFor="itemDescription">Item Description</label>
                <textarea
                  id="itemDescription"
                  name="itemDescription"
                  value={form.itemDescription}
                  onChange={changeField}
                  placeholder="Enter item description"
                />
              </div>

              <div className="invf-field">
                <label htmlFor="category">
                  Category <sup>*</sup>
                </label>
                <select
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
                {errors.category && <small className="invf-error">{errors.category}</small>}
              </div>

              <div className="invf-field">
                <label htmlFor="basePrice">
                  Base Price <sup>*</sup>
                </label>
                <div className="invf-number">
                  <input
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
                  <span>{form.basePrice === "" ? "0.00" : Number(form.basePrice).toFixed(2)}</span>
                </div>
                {errors.basePrice && <small className="invf-error">{errors.basePrice}</small>}
              </div>

              <div className="invf-field">
                <label htmlFor="unit">
                  Unit <sup>*</sup>
                </label>
                <select
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
                {errors.unit && <small className="invf-error">{errors.unit}</small>}
              </div>

              <div className="invf-field">
                <label htmlFor="inStock">
                  In Stock <sup>*</sup>
                </label>
                <div className="invf-number">
                  <input
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
                  <span>{form.inStock === "" ? "0" : form.inStock}</span>
                </div>
                {errors.inStock && <small className="invf-error">{errors.inStock}</small>}
              </div>

              <div className="invf-field">
                <label htmlFor="sellingPrice">
                  Selling Price <sup>*</sup>
                </label>
                <div className="invf-number">
                  <input
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
                  <span>
                    {form.sellingPrice === "" ? "0.00" : Number(form.sellingPrice).toFixed(2)}
                  </span>
                </div>
                {errors.sellingPrice && (
                  <small className="invf-error">{errors.sellingPrice}</small>
                )}
              </div>

              <div className="invf-field">
                <label htmlFor="supplier">Supplier</label>
                <select
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

            <div className="invf-actions">
              <button
                type="button"
                className="invf-cancel"
                onClick={() => navigate("/inventory")}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" className="invf-save" disabled={saving}>
                <img src="/assets/save.png" alt="" />
                {saving ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="invf-delete"
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
        <div className="invf-modal-bg" role="presentation" onMouseDown={() => setShowDelete(false)}>
          <div
            className="invf-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2 id="delete-title">Delete inventory item?</h2>
            <p>This will permanently remove {form.itemName || form.itemCode}.</p>
            <div>
              <button type="button" onClick={() => setShowDelete(false)}>
                Cancel
              </button>
              <button type="button" className="invf-confirm" onClick={deleteItem}>
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
