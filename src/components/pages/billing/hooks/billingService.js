export const success = (message = "", data = {}) => ({
  ok: true,
  message,
  ...data,
});

export const failure = (message) => ({ ok: false, message });

export const createBillId = () => `Bill-${Date.now()}`;

export const addBillingItem = (
  inventory,
  billingItems,
  code,
  requestedQuantity = 1,
) => {
  const item = inventory.find(
    (entry) => String(entry.itemCode) === String(code),
  );
  if (!item) return failure("Item not found");

  const available = Number(item.inStock || 0);
  const addQuantity = Math.max(1, Number(requestedQuantity) || 1);
  const existing = billingItems.find(
    (entry) => String(entry.itemCode) === String(code),
  );
  const nextQuantity = Number(existing?.qty || 0) + addQuantity;

  if (available <= 0) return failure("This item is out of stock");
  if (nextQuantity > available) {
    return failure(`Only ${available} item(s) available`);
  }

  const sellingPrice = Number(item.sellingPrice || 0);
  const basePrice = Number(item.basePrice || 0);

  if (existing) {
    const items = billingItems.map((entry) =>
      entry.billingId === existing.billingId
        ? {
            ...entry,
            qty: nextQuantity,
            total: nextQuantity * sellingPrice,
            profit: nextQuantity * (sellingPrice - basePrice),
          }
        : entry,
    );
    return success("", { items });
  }

  const newItem = {
    billingId: `bill-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    itemCode: item.itemCode,
    itemName: item.itemName,
    itemImage: item.itemImage,
    sellingPrice,
    qty: addQuantity,
    total: addQuantity * sellingPrice,
    status: "processing",
    profit: addQuantity * (sellingPrice - basePrice),
  };

  return success("", { items: [...billingItems, newItem] });
};

export const changeBillingQuantity = (
  inventory,
  billingItems,
  billingId,
  rawQuantity,
) => {
  const current = billingItems.find(
    (entry) => entry.billingId === billingId,
  );
  if (!current) return failure("Billing item not found");

  const stockItem = inventory.find(
    (entry) => String(entry.itemCode) === String(current.itemCode),
  );
  const available = Number(stockItem?.inStock || 0);
  const requested = Math.max(1, Number(rawQuantity) || 1);
  const nextQuantity = Math.min(requested, available);
  const message =
    requested > available ? `Only ${available} item(s) available` : "";

  const items = billingItems.map((entry) =>
    entry.billingId === billingId
      ? {
          ...entry,
          qty: nextQuantity,
          total: nextQuantity * Number(entry.sellingPrice),
        }
      : entry,
  );

  return success(message, { items });
};

