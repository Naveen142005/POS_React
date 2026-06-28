import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setCurrentUser } from "./authSlice";
import billingReducer, {
  replaceBillDetails,
  replaceBills,
  setCurrentBillId,
} from "./billingSlice";
import inventoryReducer, { replaceInventory } from "./inventorySlice";
import requestReducer, { replaceRequests } from "./requestSlice";

export const store = configureStore({
  reducer: {
    inventory: inventoryReducer,
    billing: billingReducer,
    requests: requestReducer,
    auth: authReducer,
  },
});

const saveJson = (key, value) => {
  const serialized = JSON.stringify(value);
  if (localStorage.getItem(key) !== serialized) {
    localStorage.setItem(key, serialized);
  }
};

const persistState = () => {
  const state = store.getState();

  saveJson("Inventory", state.inventory.items);
  saveJson("Billings", state.billing.bills);
  saveJson("Billings_Details", state.billing.details);
  saveJson("Items_Request", state.requests.items);

  if (localStorage.getItem("CurrentBillId") !== state.billing.currentBillId) {
    localStorage.setItem("CurrentBillId", state.billing.currentBillId);
  }
};

store.subscribe(persistState);
persistState();

const readEventValue = (event, fallback) => {
  try {
    return event.newValue === null ? fallback : JSON.parse(event.newValue);
  } catch {
    return fallback;
  }
};

window.addEventListener("storage", (event) => {
  if (event.key === "Inventory") {
    store.dispatch(replaceInventory(readEventValue(event, [])));
  }

  if (event.key === "Billings") {
    store.dispatch(replaceBills(readEventValue(event, {})));
  }

  if (event.key === "Billings_Details") {
    store.dispatch(replaceBillDetails(readEventValue(event, [])));
  }

  if (event.key === "Items_Request") {
    store.dispatch(replaceRequests(readEventValue(event, [])));
  }

  if (event.key === "CurrentBillId" && event.newValue) {
    store.dispatch(setCurrentBillId(event.newValue));
  }

  if (event.key === "CurrentUser") {
    store.dispatch(setCurrentUser(readEventValue(event, null)));
  }
});
