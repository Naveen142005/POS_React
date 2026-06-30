import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import InventoryBasicFields from "./InventoryBasicFields";
import InventoryImageUpload from "./InventoryImageUpload";
import InventoryFormActions from "./InventoryFormActions";
import DeleteInventoryModal from "./DeleteInventoryModal";
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
      <main
        className={`invf-main flex w-[calc(100%_-_200px)] min-h-screen ml-[200px] flex-col gap-3 p-3 max-[768px]:ml-0 max-[768px]:w-full max-[768px]:p-5 max-[520px]:p-3 ${sidebarClosed ? "!ml-0 !w-full" : ""}`}
      >
        <PageHeader pageName="Inventory" />

        <section className="w-full min-h-[calc(100vh_-_80px)] rounded-[8px] bg-white px-6 pb-8 pt-7 shadow-[0_0_10px_rgb(0_0_0_/_7%)] max-[520px]:px-[14px] max-[520px]:py-6">
          <header className="flex flex-col items-center gap-[10px] text-center">
            <h1 className="text-[22px] font-bold text-[#08081f]">
              {isEdit ? "Edit Inventory" : "Add New Item"}
            </h1>
            <p className="text-[13px] font-semibold text-[#676565]">
              {isEdit
                ? "Update the details of the inventory item"
                : "Add a new item to your inventory"}
            </p>
          </header>

          <form
            className="mx-auto mt-6 w-[min(1280px,_88%)] border-t border-[#d8dbe8] pt-7 max-[1000px]:w-[95%] max-[520px]:w-full"
            onSubmit={saveItem}
            noValidate
          >
            <div className="grid grid-cols-2 gap-x-[60px] gap-y-7 max-[1000px]:gap-x-8 max-[900px]:grid-cols-1">
              <InventoryBasicFields
                form={form}
                errors={errors}
                categoryOptions={categoryOptions}
                unitOptions={unitOptions}
                supplierOptions={supplierOptions}
                imageUpload={
                  <InventoryImageUpload
                    fileRef={fileRef}
                    preview={preview}
                    errors={errors}
                    selectImage={selectImage}
                    dropImage={dropImage}
                    removeImage={removeImage}
                  />
                }
                changeField={changeField}
                validateField={validateField}
              />
            </div>

            <InventoryFormActions
              isEdit={isEdit}
              saving={saving}
              onCancel={() => navigate("/inventory")}
              onDelete={() => setShowDelete(true)}
            />
          </form>
        </section>
      </main>

      {showDelete && (
        <DeleteInventoryModal
          itemLabel={form.itemName || form.itemCode}
          onClose={() => setShowDelete(false)}
          onDelete={deleteItem}
        />
      )}
    </div>
  );
};

export default InventoryForm;
