import { useRef } from "react";
import PageHeader from "../../common/PageHeader";
import Modal from "../../common/Modal/Modal";
import useItemRequestForm from "./useItemRequestForm";
import "./itemRequestForm.css";

const FieldError = ({ id, message }) => {
  if (!message) return null;
  return (
    <small id={id} className="reqf-error">
      {message}
    </small>
  );
};

const ItemRequestForm = ({ mode = "add" }) => {
  const dateInputRef = useRef(null);

  const {
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
  } = useItemRequestForm(mode);

  return (
    <div>
      <main id="main_reg_page">
        <PageHeader
          pageName={mode === "add" ? "New Item Request" : "Edit Item Request"}
        />

        {isReceivedMode && (
          <div className="reqf-notice reqf-notice--warning">
            This request is received. No changes allowed.
          </div>
        )}

        {isSubmittedMode && !isReceivedMode && (
          <div className="reqf-notice reqf-notice--info">
            Request already submitted. Only status can be updated.
          </div>
        )}

        {errors.form && (
          <div className="reqf-notice reqf-notice--error">{errors.form}</div>
        )}

        <form
          className="reqf-page"
          onSubmit={(event) => event.preventDefault()}
        >
          <section className="reqf-card">
            <h3>Request Information</h3>

            <div className="reqf-grid">
              <div className="reqf-field">
                <label htmlFor="reqId">Request ID</label>
                <input
                  id="reqId"
                  type="text"
                  value={formData.reqId}
                  disabled
                  readOnly
                />
                <small className="reqf-help">Auto-generated</small>
              </div>

              <div className="reqf-field">
                <label htmlFor="subject">
                  Subject <sup>*</sup>
                </label>
                <input
                  id="subject"
                  className={errors.subject ? "reqf-invalid" : ""}
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  placeholder="Enter subject"
                  disabled={!canEditForm}
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={
                    errors.subject ? "subject-error" : undefined
                  }
                />
                <FieldError id="subject-error" message={errors.subject} />
              </div>

              <div className="reqf-field">
                <label htmlFor="requestedBy">Requested By</label>
                <input
                  id="requestedBy"
                  type="text"
                  value={formData.requestedBy}
                  disabled
                  readOnly
                />
              </div>

              <div className="reqf-field">
                <label htmlFor="requestedDate">Requested Date</label>
                <input
                  id="requestedDate"
                  type="text"
                  value={formData.requestedDate}
                  disabled
                  readOnly
                />
              </div>

              <div className="reqf-field">
                <label htmlFor="expectingDelivery">
                  Expecting Delivery <sup>*</sup>
                </label>
                <div
                  className="reqf-date"
                  onClick={() => {
                    if (!canEditForm) return;
                    dateInputRef.current?.showPicker?.();
                    dateInputRef.current?.focus();
                  }}
                >
                  <input
                    id="expectingDelivery"
                    ref={dateInputRef}
                    className={errors.expectingDelivery ? "reqf-invalid" : ""}
                    type="date"
                    name="expectingDelivery"
                    value={formData.expectingDelivery}
                    onChange={handleFormChange}
                    disabled={!canEditForm}
                    aria-invalid={Boolean(errors.expectingDelivery)}
                    aria-describedby={
                      errors.expectingDelivery
                        ? "expectingDelivery-error"
                        : undefined
                    }
                  />
                  <img src="/assets/calendar_blue.png" alt="" />
                </div>
                <FieldError
                  id="expectingDelivery-error"
                  message={errors.expectingDelivery}
                />
              </div>

              <div className="reqf-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                  disabled={!canEditStatus}
                >
                  <option value="Pending">Pending</option>
                  <option value="Received">Received</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </section>

          <section className="reqf-card reqf-items">
            <header className="reqf-items-head">
              <div>
                <h3>Items</h3>
                <span>Total {filledItemsCount} items</span>
              </div>

              {canEditItems && (
                <button type="button" className="reqf-add-btn" onClick={addRow}>
                  <img src="/assets/plus.png" alt="" />
                  Add Item
                </button>
              )}
            </header>

            <div className="reqf-table-wrap">
              <table className="reqf-table">
                <thead>
                  <tr>
                    <th>
                      Item Name <sup>*</sup>
                    </th>
                    <th>
                      Quantity <sup>*</sup>
                    </th>
                    <th>
                      Expected Date <sup>*</sup>
                    </th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => {
                    const rowErrors = errors.itemRows?.[index] || {};

                    return (
                      <tr key={index}>
                        <td>
                          <div className="reqf-control">
                            <select
                              className={
                                rowErrors.itemCode ? "reqf-invalid" : ""
                              }
                              value={item.itemCode || ""}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  "itemCode",
                                  event.target.value,
                                )
                              }
                              disabled={!canEditItems}
                              aria-invalid={Boolean(rowErrors.itemCode)}
                              aria-describedby={
                                rowErrors.itemCode
                                  ? `item-${index}-code-error`
                                  : undefined
                              }
                            >
                              <option value="">Select item</option>
                              {inventoryItems.map((inventoryItem) => (
                                <option
                                  key={inventoryItem.itemCode}
                                  value={inventoryItem.itemCode}
                                >
                                  {inventoryItem.itemName}
                                </option>
                              ))}
                            </select>
                            <FieldError
                              id={`item-${index}-code-error`}
                              message={rowErrors.itemCode}
                            />
                          </div>
                        </td>

                        <td>
                          <div className="reqf-control">
                            <input
                              className={rowErrors.qty ? "reqf-invalid" : ""}
                              type="number"
                              min="1"
                              value={item.qty || ""}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  "qty",
                                  event.target.value,
                                )
                              }
                              placeholder="Enter quantity"
                              disabled={!canEditItems}
                              aria-invalid={Boolean(rowErrors.qty)}
                              aria-describedby={
                                rowErrors.qty
                                  ? `item-${index}-qty-error`
                                  : undefined
                              }
                            />
                            <FieldError
                              id={`item-${index}-qty-error`}
                              message={rowErrors.qty}
                            />
                          </div>
                        </td>

                        <td>
                          <div className="reqf-control">
                            <div
                              className="reqf-date"
                              onClick={(event) => {
                                if (!canEditItems) return;
                                const input =
                                  event.currentTarget.querySelector(
                                    'input[type="date"]',
                                  );
                                input?.showPicker?.();
                                input?.focus();
                              }}
                            >
                              <input
                                className={
                                  rowErrors.expected_date ? "reqf-invalid" : ""
                                }
                                type="date"
                                value={item.expected_date || ""}
                                onChange={(event) =>
                                  handleItemChange(
                                    index,
                                    "expected_date",
                                    event.target.value,
                                  )
                                }
                                disabled={!canEditItems}
                                aria-invalid={Boolean(rowErrors.expected_date)}
                                aria-describedby={
                                  rowErrors.expected_date
                                    ? `item-${index}-date-error`
                                    : undefined
                                }
                              />
                              <img src="/assets/calendar_blue.png" alt="" />
                            </div>
                            <FieldError
                              id={`item-${index}-date-error`}
                              message={rowErrors.expected_date}
                            />
                          </div>
                        </td>

                        <td>
                          {canEditItems && (
                            <button
                              type="button"
                              className="reqf-delete-btn"
                              onClick={() => deleteRow(index)}
                              title="Delete item"
                              aria-label={`Delete item ${index + 1}`}
                            >
                              <img src="/assets/delete.png" alt="" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {errors.items && (
              <div className="reqf-table-error">{errors.items}</div>
            )}
          </section>

          <div className="reqf-actions reqf-card-actions">
            <button
              type="button"
              className="reqf-cancel-btn"
              onClick={() => navigate("/item_request")}
            >
              Cancel
            </button>

            {!isReceivedMode && (
              <button
                type="button"
                className="reqf-save-btn"
                onClick={saveRequest}
              >
                <img src="/assets/save.png" alt="" />
                Save
              </button>
            )}

            {!isReceivedMode && !isSubmittedMode && (
              <button
                type="button"
                className="reqf-submit-btn"
                onClick={submitRequest}
              >
                <img src="/assets/send.png" alt="" />
                Submit Request
              </button>
            )}
          </div>
        </form>
      </main>

      <Modal open={Boolean(modal)} {...modal} />
    </div>
  );
};

export default ItemRequestForm;
