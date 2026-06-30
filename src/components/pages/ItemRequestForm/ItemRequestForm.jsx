import { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import Modal from "../../common/Modal/Modal";
import useItemRequestForm from "./useItemRequestForm";

const mainPageClass = "flex w-[calc(100%_-_200px)] min-h-screen ml-[200px] flex-col gap-3 p-3 transition-[margin-left,width] duration-300 ease-[ease] max-[768px]:ml-0 max-[768px]:w-full max-[768px]:p-5 max-[480px]:p-3";
const sidebarClosedMainClass = "!ml-0 !w-full";

const pageClass =
  "flex w-full flex-col gap-5 font-[Inter,sans-serif] text-[#101633]";
const cardClass =
  "w-full rounded-lg bg-white p-6 shadow-[0_0_10px_rgb(0_0_0_/_7%)] max-[600px]:p-[18px]";
const cardTitleClass = "mb-5 text-[16px]";
const gridClass =
  "grid grid-cols-3 gap-x-12 gap-y-6 max-[900px]:grid-cols-1 max-[900px]:gap-[18px]";
const fieldClass = "flex min-w-0 flex-col gap-2";
const labelClass = "text-xs font-bold";
const requiredClass = "text-[#d60000]";
const helpClass = "text-[10px] font-semibold text-[#35457c]";
const errorClass =
  "m-0 block text-[11px] font-semibold leading-[1.3] text-[#d60000]";
const inputBaseClass =
  "h-[45px] w-full rounded-[7px] border border-[#dcddea] bg-white py-0 pl-3 pr-[42px] font-[inherit] text-[13px] font-semibold text-[#35457c] outline-none focus:border-[#5b36ff] disabled:bg-[#f7f7fb] disabled:opacity-100";
const selectBaseClass = `${inputBaseClass} appearance-none bg-[url('/assets/down_arrow_blac.png')] bg-[length:13px] bg-[right_14px_center] bg-no-repeat`;
const invalidClass = "!border-[#d60000] focus:!border-[#d60000]";
const dateWrapClass = "relative w-full";
const dateInputClass = `${inputBaseClass} [&::-webkit-calendar-picker-indicator]:opacity-0`;
const dateIconClass =
  "pointer-events-none absolute right-[14px] top-1/2 h-4 w-4 -translate-y-1/2";
const itemsHeadClass =
  "mb-6 flex items-center justify-between gap-4 max-[600px]:items-start";
const smallButtonBaseClass =
  "inline-flex min-h-[43px] cursor-pointer items-center justify-center gap-[9px] rounded-[7px] px-5 font-[inherit] text-xs font-bold";
const whiteIconClass =
  "h-[17px] w-[17px] [filter:brightness(0)_saturate(100%)_invert(1)]";
const tableCellClass =
  "border-b border-[#e5e8f6] p-4 text-left align-top";
const controlClass = "flex min-w-0 flex-col gap-2";
const noticeBaseClass =
  "mb-3 rounded border border-solid p-3 font-[Inter,sans-serif] text-[13px]";
const actionButtonClass = `${smallButtonBaseClass} max-[600px]:w-full`;

const getInputClass = (hasError = false) =>
  `${inputBaseClass} ${hasError ? invalidClass : ""}`;
const getDateInputClass = (hasError = false) =>
  `${dateInputClass} ${hasError ? invalidClass : ""}`;
const getSelectClass = (hasError = false) =>
  `${selectBaseClass} ${hasError ? invalidClass : ""}`;

const FieldError = ({ id, message }) => {
  if (!message) return null;
  return (
    <small id={id} className={errorClass}>
      {message}
    </small>
  );
};

const ItemRequestForm = ({ mode = "add" }) => {
  const { sidebarClosed } = useOutletContext();
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
      <main
        id="main_reg_page"
        className={`${mainPageClass} ${sidebarClosed ? sidebarClosedMainClass : ""}`}
      >
        <PageHeader
          pageName={mode === "add" ? "New Item Request" : "Edit Item Request"}
        />

        {isReceivedMode && (
          <div className={`${noticeBaseClass} border-[#ffc107] bg-[#fff3cd] text-[#856404]`}>
            This request is received. No changes allowed.
          </div>
        )}

        {isSubmittedMode && !isReceivedMode && (
          <div className={`${noticeBaseClass} border-[#bee5eb] bg-[#d1ecf1] text-[#0c5460]`}>
            Request already submitted. Only status can be updated.
          </div>
        )}

        {errors.form && (
          <div className={`${noticeBaseClass} border-[#f5c6cb] bg-[#f8d7da] text-[#721c24]`}>{errors.form}</div>
        )}

        <form
          className={pageClass}
          onSubmit={(event) => event.preventDefault()}
        >
          <section className={cardClass}>
            <h3 className={cardTitleClass}>Request Information</h3>

            <div className={gridClass}>
              <div className={fieldClass}>
                <label htmlFor="reqId" className={labelClass}>Request ID</label>
                <input
                  id="reqId"
                  className={inputBaseClass}
                  type="text"
                  value={formData.reqId}
                  disabled
                  readOnly
                />
                <small className={helpClass}>Auto-generated</small>
              </div>

              <div className={fieldClass}>
                <label htmlFor="subject" className={labelClass}>
                  Subject <sup className={requiredClass}>*</sup>
                </label>
                <input
                  id="subject"
                  className={getInputClass(errors.subject)}
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

              <div className={fieldClass}>
                <label htmlFor="requestedBy" className={labelClass}>Requested By</label>
                <input
                  id="requestedBy"
                  className={inputBaseClass}
                  type="text"
                  value={formData.requestedBy}
                  disabled
                  readOnly
                />
              </div>

              <div className={fieldClass}>
                <label htmlFor="requestedDate" className={labelClass}>Requested Date</label>
                <input
                  id="requestedDate"
                  className={inputBaseClass}
                  type="text"
                  value={formData.requestedDate}
                  disabled
                  readOnly
                />
              </div>

              <div className={fieldClass}>
                <label htmlFor="expectingDelivery" className={labelClass}>
                  Expecting Delivery <sup className={requiredClass}>*</sup>
                </label>
                <div
                  className={dateWrapClass}
                  onClick={() => {
                    if (!canEditForm) return;
                    dateInputRef.current?.showPicker?.();
                    dateInputRef.current?.focus();
                  }}
                >
                  <input
                    id="expectingDelivery"
                    ref={dateInputRef}
                    className={getDateInputClass(errors.expectingDelivery)}
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
                  <img className={dateIconClass} src="/assets/calendar_blue.png" alt="" />
                </div>
                <FieldError
                  id="expectingDelivery-error"
                  message={errors.expectingDelivery}
                />
              </div>

              <div className={fieldClass}>
                <label htmlFor="status" className={labelClass}>Status</label>
                <select
                  id="status"
                  className={selectBaseClass}
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

          <section className={cardClass}>
            <header className={itemsHeadClass}>
              <div>
                <h3 className="mb-[5px] text-[16px]">Items</h3>
                <span className="text-xs font-semibold text-[#5b36ff]">Total {filledItemsCount} items</span>
              </div>

              {canEditItems && (
                <button type="button" className={`${smallButtonBaseClass} border-0 bg-[#5b36ff] text-white max-[600px]:px-3.5`} onClick={addRow}>
                  <img className={whiteIconClass} src="/assets/plus.png" alt="" />
                  Add Item
                </button>
              )}
            </header>

            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse border border-[#e5e8f6]">
                <thead className="bg-[#f3f4fb]">
                  <tr>
                    <th className={`${tableCellClass} w-[32%] text-xs`}>
                      Item Name <sup className={requiredClass}>*</sup>
                    </th>
                    <th className={`${tableCellClass} w-[25%] text-xs`}>
                      Quantity <sup className={requiredClass}>*</sup>
                    </th>
                    <th className={`${tableCellClass} w-[32%] text-xs`}>
                      Expected Date <sup className={requiredClass}>*</sup>
                    </th>
                    <th className={`${tableCellClass} w-[11%] text-xs`}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => {
                    const rowErrors = errors.itemRows?.[index] || {};

                    return (
                      <tr key={index}>
                        <td className={tableCellClass}>
                          <div className={controlClass}>
                            <select
                              className={getSelectClass(rowErrors.itemCode)}
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

                        <td className={tableCellClass}>
                          <div className={controlClass}>
                            <input
                              className={getInputClass(rowErrors.qty)}
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

                        <td className={tableCellClass}>
                          <div className={controlClass}>
                            <div
                              className={dateWrapClass}
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
                                className={getDateInputClass(rowErrors.expected_date)}
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
                              <img className={dateIconClass} src="/assets/calendar_blue.png" alt="" />
                            </div>
                            <FieldError
                              id={`item-${index}-date-error`}
                              message={rowErrors.expected_date}
                            />
                          </div>
                        </td>

                        <td className={tableCellClass}>
                          {canEditItems && (
                            <button
                              type="button"
                              className="grid h-11 w-11 cursor-pointer place-items-center border-0 bg-transparent"
                              onClick={() => deleteRow(index)}
                              title="Delete item"
                              aria-label={`Delete item ${index + 1}`}
                            >
                              <img className="h-[22px] w-[22px]" src="/assets/delete.png" alt="" />
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
              <div className="mt-2.5 text-[11px] font-semibold text-[#d60000]">{errors.items}</div>
            )}
          </section>

          <div className="flex items-center justify-center gap-5 px-6 py-[22px] max-[600px]:flex-col max-[600px]:p-[18px]">
            <button
              type="button"
              className={`${actionButtonClass} border border-[#5b36ff] bg-white text-[#070b61]`}
              onClick={() => navigate("/item_request")}
            >
              Cancel
            </button>

            {!isReceivedMode && (
              <button
                type="button"
                className={`${actionButtonClass} border-0 bg-[#5b36ff] text-white`}
                onClick={saveRequest}
              >
                <img className={whiteIconClass} src="/assets/save.png" alt="" />
                Save
              </button>
            )}

            {!isReceivedMode && !isSubmittedMode && (
              <button
                type="button"
                className={`${actionButtonClass} border-0 bg-[#07952b] text-white`}
                onClick={submitRequest}
              >
                <img className={whiteIconClass} src="/assets/send.png" alt="" />
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
