const DeleteInventoryModal = ({ itemLabel, onClose, onDelete }) => {
  return (
    <div
      className="fixed inset-0 z-[100000] grid place-items-center bg-[rgb(5_5_20_/_48%)] p-5"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="w-[min(420px,100%)] rounded-[8px] bg-white p-6 shadow-[0_18px_50px_rgb(0_0_0_/_22%)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className="text-[18px] text-[#101633]" id="delete-title">
          Delete inventory item?
        </h2>
        <p className="mt-[10px] text-[13px] leading-[1.5] text-[#626277]">
          This will permanently remove {itemLabel}.
        </p>
        <div className="mt-[22px] flex justify-end gap-[10px]">
          <button
            className="h-[38px] min-w-[90px] cursor-pointer rounded-md border border-[#d6d9e6] bg-white text-[12px] font-bold"
            type="button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-[38px] min-w-[90px] cursor-pointer rounded-md border border-[#e02828] bg-[#e02828] text-[12px] font-bold text-white"
            onClick={onDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteInventoryModal;
