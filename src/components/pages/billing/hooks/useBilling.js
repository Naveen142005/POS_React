import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentDateTime, showPopups } from "../../../../utils/utils";
import {
  removeBill,
  saveBillItems,
  setBillStatus,
  setCurrentBillId,
} from "../../../../redux/billingSlice";
import { sellInventoryItems } from "../../../../redux/inventorySlice";
import {
  addBillingItem,
  changeBillingQuantity,
  createBillId,
} from "./billingService";

const cleanCategory = (value = "") =>
  value
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .trim();

const useBilling = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toastTimer = useRef(null);

  const inventory = useSelector((state) => state.inventory.items);
  const { currentBillId, bills, details } = useSelector(
    (state) => state.billing,
  );
  const billingItems = bills[currentBillId] || [];
  const [deletedItems, setDeletedItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [section, setSection] = useState(
    billingItems.length ? "billing" : "empty",
  );
  const [itemCode, setItemCode] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [tableNo, setTableNo] = useState("");
  const [covers, setCovers] = useState("");
  const [tender, setTender] = useState("160.00");
  const [toast, setToast] = useState(null);

  const total = useMemo(
    () =>
      billingItems.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
      ),
    [billingItems],
  );
  const gst = total * 0.07;
  const payable = total + gst;
  const change = (Number(tender) || 0) - payable;

  const filteredItems = useMemo(() => {
    const term = searchText.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesName = String(item.itemName || "")
        .toLowerCase()
        .includes(term);
      const matchesCode = String(item.itemCode || "")
        .toLowerCase()
        .includes(term);
      const matchesCategory =
        selectedCategory === "All Items" ||
        cleanCategory(item.category) === selectedCategory;

      return (matchesName || matchesCode) && matchesCategory;
    });
  }, [inventory, searchText, selectedCategory]);

  const showMessage = (message, isSuccess = false) => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, success: isSuccess });
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  };

  const resetItemForm = (nextSection = "empty") => {
    setItemCode("");
    setQuantity(1);
    setSection(nextSection);
  };

  const saveItems = (items) => {
    dispatch(saveBillItems({ billId: currentBillId, items }));
  };

  const startNewBill = () => {
    const nextId = createBillId();
    dispatch(setCurrentBillId(nextId));
    setDeletedItems([]);
  };

  const updateStatus = (status) => {
    dispatch(
      setBillStatus({
        billId: currentBillId,
        status,
        createdAt: getCurrentDateTime(),
      }),
    );
  };

  const handleStartNewBill = () => {
    startNewBill();
    resetItemForm();
  };

  const handleAddItem = (code, requestedQuantity = 1) => {
    const result = addBillingItem(
      inventory,
      billingItems,
      code,
      requestedQuantity,
    );

    if (!result.ok) return showMessage(result.message);

    saveItems(result.items);
    resetItemForm("billing");
  };

  const handleQuantityChange = (billingId, rawQuantity) => {
    const result = changeBillingQuantity(
      inventory,
      billingItems,
      billingId,
      rawQuantity,
    );

    if (result.ok) saveItems(result.items);
    if (result.message) showMessage(result.message);
  };

  const handleRemoveItem = (billingId) => {
    const items = billingItems.filter((item) => item.billingId !== billingId);
    saveItems(items);
    if (!items.length) setSection("empty");
  };

  const handleShowPrice = () => {
    if (!billingItems.length) return showMessage("Add at least one item first");
    setSection("price");
  };

  const handleCompleteBill = () => {
    if (!billingItems.length) return showMessage("No items in bill");
    if (section !== "price") {
      return showMessage("Open Price Amendment before completing the bill");
    }
    if (!tender || change < 0) {
      return showMessage("Enter a valid tender amount");
    }
    if (
      details.find((detail) => detail.billId === currentBillId)?.status ===
      "Completed"
    ) {
      return showMessage("This bill is already completed");
    }

    dispatch(sellInventoryItems(billingItems));
    updateStatus("Completed");
    startNewBill();
    showPopups("Bill completed successfully", true);
    resetItemForm();
  };

  const handleReserveBill = () => {
    if (!billingItems.length) return showMessage("No items in bill");

    updateStatus("Reserved");
    startNewBill();
    setSection("empty");
    showMessage("Transaction reserved", true);
  };

  const handleDeleteAll = () => {
    if (!billingItems.length) return showMessage("No items to delete");

    setDeletedItems(billingItems);
    saveItems([]);
    setSection("empty");
    showMessage("Bill items cleared");
  };

  const handleRestore = () => {
    if (!deletedItems.length) return showMessage("Nothing to restore");

    saveItems(deletedItems);
    setDeletedItems([]);
    setSection("billing");
    showMessage("Bill restored", true);
  };

  const handleTerminate = () => {
    dispatch(removeBill(currentBillId));
    updateStatus("Terminated");
    startNewBill();
    setSection("empty");
    showMessage("Transaction terminated");
  };

  const handleCash = (amount) => {
    setTender(String((Number(tender) || 0) + amount));
  };

  const handleCancelItem = () => {
    if (!billingItems.length) return showMessage("No item to cancel");
    handleRemoveItem(billingItems.at(-1).billingId);
  };

  return {
    inventory,
    billingItems,
    filteredItems,
    total,
    gst,
    payable,
    change,
    selectedCategory,
    searchText,
    viewMode,
    section,
    itemCode,
    quantity,
    tableNo,
    covers,
    tender,
    toast,
    setSelectedCategory,
    setSearchText,
    setViewMode,
    setItemCode,
    setQuantity,
    setTableNo,
    setCovers,
    setTender,
    showMessage,
    handleStartNewBill,
    handleAddItem,
    handleQuantityChange,
    handleRemoveItem,
    handleShowPrice,
    handleCompleteBill,
    handleReserveBill,
    handleDeleteAll,
    handleRestore,
    handleTerminate,
    handleCash,
    handleCancelItem,
    handleMainMenu: () => navigate("/dashboard"),
  };
};

export default useBilling;
