import { createSlice } from "@reduxjs/toolkit";

const readItems = (key) => {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const getInitialItems = () => {
  return readItems("Inventory");
};

const getStatus = (stock) => {
  if (stock <= 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: getInitialItems(),
  },
  reducers: {
    replaceInventory: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    addInventoryItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateInventoryItem: (state, action) => {
      const index = state.items.findIndex(
        (item) => String(item.itemCode) === String(action.payload.itemCode),
      );

      if (index !== -1) state.items[index] = action.payload;
    },
    deleteInventoryItem: (state, action) => {
      state.items = state.items.filter(
        (item) => String(item.itemCode) !== String(action.payload),
      );
    },
    sellInventoryItems: (state, action) => {
      action.payload.forEach((billedItem) => {
        const item = state.items.find(
          (stockItem) =>
            String(stockItem.itemCode) === String(billedItem.itemCode),
        );

        if (!item) return;

        const soldQuantity = Number(billedItem.qty || 0);
        item.inStock = Math.max(0, Number(item.inStock || 0) - soldQuantity);
        item.sold = Number(item.sold || 0) + soldQuantity;
        item.status = getStatus(item.inStock);
      });
    },
    receiveInventoryItems: (state, action) => {
      action.payload.forEach((receivedItem) => {
        const item = state.items.find(
          (stockItem) =>
            String(stockItem.itemCode) === String(receivedItem.itemCode),
        );

        if (!item) return;

        const quantity = Number(receivedItem.qty || 0);
        item.inStock = Number(item.inStock || 0) + quantity;
        item.purchased = Number(item.purchased || 0) + quantity;
        item.status = getStatus(item.inStock);
      });
    },
  },
});

export const {
  replaceInventory,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  sellInventoryItems,
  receiveInventoryItems,
} = inventorySlice.actions;

export default inventorySlice.reducer;
