import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCurrentDateTime,
  getNextCode,
  showPopups,
} from "../../../utils/utils";
import { receiveInventoryItems } from "../../../redux/inventorySlice";
import {
  addRequest as addRequestToStore,
  updateRequest as saveRequestToStore,
  updateRequestStatus,
} from "../../../redux/requestSlice";

const isEmpty = (value) =>
  value === undefined || value === null || `${value}`.trim() === "";

const validateItemRequest = (formData, items) => {
  const errors = {};
  const itemRows = {};

  if (isEmpty(formData.subject)) {
    errors.subject = "Please enter the subject";
  }

  if (isEmpty(formData.expectingDelivery)) {
    errors.expectingDelivery = "Select expecting delivery date";
  }

  if (items.length === 0) {
    errors.items = "Add at least one item";
  }

  items.forEach((item, index) => {
    const rowErrors = {};

    if (isEmpty(item.itemCode)) rowErrors.itemCode = "Select an item";

    if (isEmpty(item.qty)) rowErrors.qty = "Enter the quantity";
    else if (Number(item.qty) <= 0) {
      rowErrors.qty = "Quantity must be greater than 0";
    }

    if (isEmpty(item.expected_date)) {
      rowErrors.expected_date = "Select expected date";
    }

    if (Object.keys(rowErrors).length > 0) itemRows[index] = rowErrors;
  });

  if (Object.keys(itemRows).length > 0) errors.itemRows = itemRows;
  return errors;
};

const getRequestId = (requests) => {
  if (requests.length === 0) return "REQ-000001";

  return getNextCode(requests[requests.length - 1].reqId);
};

const normalizeRequestState = (state) => {
  if (state === "Submitted" || state === "submitted") return "Submitted";
  return "Processing";
};

const getInitialForm = (request, requests) => ({
  reqId: request?.reqId || getRequestId(requests),
  subject: request?.subject || "",
  requestedBy: request?.requested_by || "Admin",
  requestedDate: request?.requested_date || getCurrentDateTime(),
  expectingDelivery: request?.expecting_delivery || "",
  status: request?.status || "Pending",
  state: normalizeRequestState(request?.state),
});

const useItemRequestForm = (mode) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const inventoryItems = useSelector((state) => state.inventory.items);
  const allRequests = useSelector((state) => state.requests.items);

  const [formData, setFormData] = useState(() =>
    getInitialForm(null, allRequests),
  );
  const [items, setItems] = useState([{}]);
  const [errors, setErrors] = useState({});
  const [oldRequest, setOldRequest] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    const requestId = decodeURIComponent(id);
    const index = allRequests.findIndex(
      (request) => request.reqId === requestId || request.id === requestId,
    );

    if (index === -1) {
      showPopups("Request not found", false);
      const timer = setTimeout(() => navigate("/item_request"), 1500);
      return () => clearTimeout(timer);
    }

    const request = allRequests[index];
    setOldRequest(request);
    setFormData(getInitialForm(request, allRequests));
    setItems(request.items?.length ? request.items : [{}]);
  }, [allRequests, id, mode, navigate]);

  const isReceivedMode = oldRequest?.status === "Received";
  const isSubmittedMode = formData.state === "Submitted";
  const isEditMode = mode === "edit";
  const canEditItems = !isReceivedMode && !isSubmittedMode;
  const canEditForm = !isReceivedMode && !isSubmittedMode;
  const canEditStatus = isSubmittedMode && !isReceivedMode;

  const closeModal = () => setModal(null);
  const goToRequests = () => navigate("/item_request");

  const showSuccessModal = (title, message) => {
    setModal({
      variant: "success",
      title,
      message,
      onClose: goToRequests,
      secondaryAction: {
        label: "Close",
        onClick: goToRequests,
      },
      primaryAction: {
        label: "View Requests",
        onClick: goToRequests,
      },
    });
  };

  const clearFormError = (name) => {
    setErrors((previous) => {
      if (!previous[name]) return previous;

      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  const clearItemError = (index, field) => {
    setErrors((previous) => {
      const currentRow = previous.itemRows?.[index];
      if (!currentRow?.[field] && !previous.items) return previous;

      const next = { ...previous };
      const itemRows = { ...(previous.itemRows || {}) };
      const row = { ...(currentRow || {}) };

      delete row[field];
      delete next.items;

      if (Object.keys(row).length > 0) itemRows[index] = row;
      else delete itemRows[index];

      if (Object.keys(itemRows).length > 0) next.itemRows = itemRows;
      else delete next.itemRows;

      return next;
    });
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;

    if (name === "status") {
      if (!canEditStatus) return;
      setFormData((previous) => ({ ...previous, status: value }));
      clearFormError("form");
      return;
    }

    if (!canEditForm) return;

    setFormData((previous) => ({ ...previous, [name]: value }));
    clearFormError(name);
  };

  const handleItemChange = (index, field, value) => {
    if (!canEditItems) return;

    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    );
    clearItemError(index, field);
  };

  const addRow = () => {
    if (!canEditItems) return;

    setItems((previous) => [...previous, {}]);
    clearFormError("items");
  };

  const deleteRow = (index) => {
    if (!canEditItems) return;

    if (items.length === 1) {
      setErrors((previous) => ({
        ...previous,
        items: "At least one item needed",
      }));
      return;
    }

    setItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
    setErrors((previous) => {
      const next = { ...previous };
      delete next.items;
      delete next.itemRows;
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = validateItemRequest(formData, items);
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getTableItems = () =>
    items.map((item) => {
      const inventoryItem = inventoryItems.find(
        (savedItem) =>
          String(savedItem.itemCode) === String(item.itemCode),
      );

      return {
        itemCode: item.itemCode,
        itemName: inventoryItem?.itemName || item.itemName || "",
        qty: Number(item.qty),
        expected_date: item.expected_date,
      };
    });

  const addItemsToInventory = () => {
    dispatch(receiveInventoryItems(getTableItems()));
  };

  const updateStatusOnly = (inventoryUpdated = oldRequest?.inventoryUpdated) => {
    dispatch(
      updateRequestStatus({
        id: oldRequest.reqId || oldRequest.id,
        status: formData.status || "Pending",
        updatedAt: getCurrentDateTime(),
        inventoryUpdated,
      }),
    );
  };

  const updateRequest = (nextState = "Processing") => {
    const request = {
      reqId: formData.reqId,
      id: formData.reqId,
      subject: formData.subject.trim(),
      requested_by: formData.requestedBy.trim(),
      requested_date: formData.requestedDate,
      expecting_delivery: formData.expectingDelivery,
      status: formData.status || "Pending",
      state: nextState,
      items: getTableItems(),
      inventoryUpdated: oldRequest?.inventoryUpdated || false,
      update_at: getCurrentDateTime(),
    };

    if (isEditMode) {
      dispatch(saveRequestToStore(request));
    } else {
      dispatch(addRequestToStore(request));
    }
  };

  const confirmReceived = () => {
    const shouldUpdateInventory =
      oldRequest?.status !== "Received" && oldRequest?.inventoryUpdated !== true;

    if (shouldUpdateInventory) {
      addItemsToInventory();
    }

    updateStatusOnly(true);
    showPopups("Status updated successfully", true);
    setTimeout(goToRequests, 1200);
  };

  const saveRequest = () => {
    if (isReceivedMode) {
      setErrors((previous) => ({
        ...previous,
        form: "Received request cannot be changed",
      }));
      return;
    }

    if (isSubmittedMode) {
      if (formData.status === "Received") {
        setModal({
          variant: "confirm",
          title: "Confirm Received Status",
          message:
            "The requested quantities will be added to inventory. Continue?",
          onClose: closeModal,
          secondaryAction: {
            label: "Cancel",
            onClick: closeModal,
          },
          primaryAction: {
            label: "Yes, Update",
            onClick: confirmReceived,
          },
        });
        return;
      }

      updateStatusOnly();
      showPopups("Status updated successfully", true);
      setTimeout(goToRequests, 1200);
      return;
    }

    if (!validateForm()) return;

    updateRequest("Processing");
    showPopups("Request updated successfully", true);
    setTimeout(goToRequests, 1200);
  };

  const confirmSubmit = () => {
    updateRequest("Submitted");
    showSuccessModal(
      "Item Request Submitted!",
      "Request submitted successfully.",
    );
  };

  const submitRequest = () => {
    if (!validateForm() || isReceivedMode || isSubmittedMode) return;

    setModal({
      variant: "confirm",
      iconSrc: "/assets/send.png",
      title: "Submit Item Request?",
      message:
        "Please confirm that you want to submit this item request. You will not be able to edit it after submission.",
      onClose: closeModal,
      secondaryAction: {
        label: "Cancel",
        onClick: closeModal,
      },
      primaryAction: {
        label: "Yes, Submit",
        iconSrc: "/assets/send.png",
        onClick: confirmSubmit,
      },
    });
  };

  const filledItemsCount = items.filter(
    (item) => item.itemCode || item.itemName || item.qty || item.expected_date,
  ).length;

  return {
    addRow,
    canEditForm,
    canEditItems,
    deleteRow,
    errors,
    filledItemsCount,
    formData,
    handleFormChange,
    handleItemChange,
    inventoryItems,
    isReceivedMode,
    isSubmittedMode,
    canEditStatus,
    items,
    modal,
    navigate,
    saveRequest,
    submitRequest,
  };
};

export default useItemRequestForm;
