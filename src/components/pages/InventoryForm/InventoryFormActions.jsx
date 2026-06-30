const InventoryFormActions = ({ isEdit, saving, onCancel, onDelete }) => {


  return (
    <div className="mt-[34px] flex items-center justify-center gap-5 max-[520px]:flex-col max-[520px]:items-stretch max-[520px]:gap-[10px]">
      <button
        type="button"
        className="flex h-12 w-[150px] cursor-pointer items-center justify-center gap-[10px] rounded-[7px] text-[13px] font-bold max-[520px]:w-full border border-[#d6d9e6] bg-white text-[#101633] disabled:cursor-not-allowed disabled:opacity-[0.65]"
        onClick={onCancel}
        disabled={saving}
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex h-12 w-[150px] cursor-pointer items-center justify-center gap-[10px] rounded-[7px] text-[13px] font-bold max-[520px]:w-full border-0 bg-[linear-gradient(90deg,#5b36ff,#7705c3)] text-white disabled:cursor-wait disabled:opacity-70"
        disabled={saving}
      >
        <img className="h-[17px] w-[17px] object-contain" src="/assets/save.png" alt="" />
        {saving ? "Saving..." : isEdit ? "Update" : "Save"}
      </button>
      {isEdit && (
        <button
          type="button"
          className="flex h-12 w-[150px] cursor-pointer items-center justify-center gap-[10px] rounded-[7px] text-[13px] font-bold max-[520px]:w-full border border-[#ffb6b6] bg-white text-[#f00] disabled:cursor-not-allowed disabled:opacity-[0.65]"
          onClick={onDelete}
          disabled={saving}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default InventoryFormActions;
