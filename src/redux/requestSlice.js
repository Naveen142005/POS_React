import { createSlice } from "@reduxjs/toolkit";

const readRequests = () => {
  try {
    const requests = JSON.parse(localStorage.getItem("Items_Request") || "[]");
    return Array.isArray(requests) ? requests : [];
  } catch {
    return [];
  }
};

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    items: readRequests(),
  },
  reducers: {
    replaceRequests: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },
    addRequest: (state, action) => {
      state.items.push(action.payload);
    },
    updateRequest: (state, action) => {
      const index = state.items.findIndex(
        (request) =>
          request.reqId === action.payload.reqId ||
          request.id === action.payload.id,
      );

      if (index !== -1) state.items[index] = action.payload;
    },
    updateRequestStatus: (state, action) => {
      const { id, status, updatedAt, inventoryUpdated } = action.payload;
      const request = state.items.find(
        (item) => item.reqId === id || item.id === id,
      );

      if (request) {
        request.status = status;
        request.update_at = updatedAt;
        if (inventoryUpdated !== undefined) {
          request.inventoryUpdated = inventoryUpdated;
        }
      }
    },
  },
});

export const {
  replaceRequests,
  addRequest,
  updateRequest,
  updateRequestStatus,
} = requestSlice.actions;

export default requestSlice.reducer;
