import { createSlice } from "@reduxjs/toolkit";

const readCurrentUser = () => {
  try {
    const saved =
      localStorage.getItem("CurrentUser") ||
      sessionStorage.getItem("CurrentUser");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: readCurrentUser(),
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.currentUser = action.payload;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
});

export const { setCurrentUser, clearCurrentUser } = authSlice.actions;
export default authSlice.reducer;
