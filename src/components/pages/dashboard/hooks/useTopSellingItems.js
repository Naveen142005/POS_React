import { useMemo, useState } from "react";

export const ranges = ["This Week", "Last Week", "This Month", "This Year", "All"];

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const getRange = (type) => {
  const today = new Date();
  const start = startOfDay(today);
  let end = endOfDay(today);

  if (type === "This Week") {
    start.setDate(start.getDate() - start.getDay());
    end = endOfDay(new Date(start));
    end.setDate(start.getDate() + 6);
    return [start, end];
  }

  if (type === "Last Week") {
    start.setDate(start.getDate() - start.getDay() - 7);
    end = endOfDay(new Date(start));
    end.setDate(start.getDate() + 6);
    return [start, end];
  }

  if (type === "This Month") {
    start.setDate(1);
    end = endOfDay(new Date(today.getFullYear(), today.getMonth() + 1, 0));
    return [start, end];
  }

  if (type === "This Year") {
    start.setMonth(0, 1);
    end = endOfDay(new Date(today.getFullYear(), 11, 31));
    return [start, end];
  }

  return [null, null];
};

const getTopItems = (bills, details, inventory, type) => {
  const [from, to] = getRange(type);
  const itemMap = {};

  details.forEach((bill) => {
    if (bill.status !== "Completed") return;

    const billDate = new Date(bill.created_at);
    if (Number.isNaN(billDate.getTime())) return;

    if (from && to && (billDate < from || billDate > to)) return;

    const billItems = Array.isArray(bills[bill.billId]) ? bills[bill.billId] : [];

    billItems.forEach((item) => {
      const itemCode = item.itemCode || item.itemName;
      if (!itemCode) return;

      const inventoryItem = inventory.find(
        (stockItem) => String(stockItem.itemCode) === String(itemCode),
      );

      if (!itemMap[itemCode]) {
        itemMap[itemCode] = {
          itemCode,
          itemName: item.itemName || inventoryItem?.itemName || itemCode,
          itemImage: item.itemImage || inventoryItem?.itemImage || "",
          qty: 0,
          revenue: 0,
        };
      }

      itemMap[itemCode].qty += Number(item.qty || 0);
      itemMap[itemCode].revenue += Number(item.total || 0);
    });
  });

  return Object.values(itemMap)
    .sort((first, second) => second.qty - first.qty)
    .slice(0, 5);
};

const useTopSellingItems = (bills, details, inventory) => {
  const [selectedRange, setSelectedRange] = useState("This Week");
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useMemo(
    () => getTopItems(bills, details, inventory, selectedRange),
    [bills, details, inventory, selectedRange],
  );

  const selectRange = (range) => {
    setSelectedRange(range);
    setMenuOpen(false);
  };

  return {
    items,
    menuOpen,
    ranges,
    selectRange,
    selectedRange,
    setMenuOpen,
  };
};

export default useTopSellingItems;
