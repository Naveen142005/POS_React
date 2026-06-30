const InventoryImageUpload = ({
  fileRef,
  preview,
  errors,
  selectImage,
  dropImage,
  removeImage,
}) => {


  return (
    <div className="relative flex min-w-0 flex-col gap-[10px]">
      <label className="text-[12px] font-bold text-[#101633]" htmlFor="itemImage">
        Item Image
      </label>
      <button
        type="button"
        className={preview ? "flex h-[154px] w-full cursor-pointer gap-2 rounded-[7px] border border-[#c7cce1] bg-white text-[#101633] items-stretch justify-start overflow-hidden border-solid p-0 flex-row max-[520px]:h-auto max-[520px]:flex-col" : "flex h-[154px] w-full cursor-pointer gap-2 rounded-[7px] border border-[#c7cce1] bg-white text-[#101633] flex-col items-center justify-center border-dashed p-3"}
        onClick={() => fileRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={dropImage}
      >
        {preview ? (
          <>
            <img
              className="h-full w-[45%] min-w-[140px] border-r border-[#c7cce1] p-[10px] object-contain max-[520px]:h-[130px] max-[520px]:w-full max-[520px]:border-r-0 max-[520px]:border-b"
              src={preview}
              alt="Item preview"
            />
            <span className="flex min-w-0 flex-col items-start justify-center gap-[14px] p-[18px] text-left">
              <strong className="text-[12px]">Change Image</strong>
              <small className="text-[11px] font-semibold text-[#35457c]">
                PNG, JPG or WEBP (Max. 2MB)
              </small>
            </span>
          </>
        ) : (
          <>
            <img className="h-8 w-8 object-contain" src="/assets/upload.png" alt="" />
            <strong className="text-[12px]">Click to upload or drag and drop</strong>
            <small className="text-[11px] font-semibold text-[#35457c]">
              PNG, JPG or WEBP (Max. 2MB)
            </small>
          </>
        )}
      </button>
      <input
        ref={fileRef}
        className="hidden"
        type="file"
        id="itemImage"
        accept="image/png,image/jpeg,image/webp"
        onChange={selectImage}
      />
      {preview && (
        <button
          type="button"
          className="w-max cursor-pointer border-0 bg-transparent text-[10px] font-bold text-[#2400ff] underline"
          onClick={removeImage}
        >
          Remove image
        </button>
      )}
      {errors.image && (
        <small className="text-[11px] font-semibold text-[#d93025]">
          {errors.image}
        </small>
      )}
    </div>
  );
};

export default InventoryImageUpload;
