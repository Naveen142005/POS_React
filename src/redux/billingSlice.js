import { createSlice } from "@reduxjs/toolkit";

const readObject = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "{}");
    return value && !Array.isArray(value) ? value : {};
  } catch {
    return {};
  }
};

const readArray = (key) => {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
};

const billingSlice = createSlice({
  name: "billing",
  initialState: {
    currentBillId:
      localStorage.getItem("CurrentBillId") || `Bill-${Date.now()}`,
    bills: readObject("Billings"),
    details: readArray("Billings_Details"),
  },
  reducers: {
    replaceBills: (state, action) => {
      state.bills = action.payload || {};
    },
    replaceBillDetails: (state, action) => {
      state.details = Array.isArray(action.payload) ? action.payload : [];
    },
    setCurrentBillId: (state, action) => {
      state.currentBillId = action.payload;
    },
    saveBillItems: (state, action) => {
      const { billId, items } = action.payload;
      state.bills[billId] = items;
    },
    removeBill: (state, action) => {
      delete state.bills[action.payload];
    },
    setBillStatus: (state, action) => {
      const { billId, status, createdAt } = action.payload;
      const detail = state.details.find((item) => item.billId === billId);

      if (detail) detail.status = status;
      else state.details.push({ billId, status, created_at: createdAt });
    },
  },
});

export const {
  replaceBills,
  replaceBillDetails,
  setCurrentBillId,
  saveBillItems,
  removeBill,
  setBillStatus,
} = billingSlice.actions;

export default billingSlice.reducer;
