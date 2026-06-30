import React from "react";

const filterActionsClass =
  "grid w-[min(240px,100%)] grid-cols-2 gap-[12px] max-[1250px]:self-end max-[600px]:w-full max-[380px]:grid-cols-1";

const buttonBaseClass = "justify-center cursor-pointer text-[11px] font-bold";

const FilterButtons = ({
  filterInputBoxClass,
  filterItemClass,
  filterLabelClass,
  filterIconClass,
  onFilter,
  onReset,
}) => {
  const spacerClass = `${filterLabelClass} opacity-0 max-[380px]:hidden`;

  return (
    <div className={filterActionsClass}>
      <div className={filterItemClass}>
        <div className={spacerClass} aria-hidden="true">
          Filter
        </div>

        <button
          type="button"
          className={`${filterInputBoxClass} ${buttonBaseClass} !border-0 !bg-[linear-gradient(90deg,#5b36ff,#7705c3)] text-white`}
          id="filterBtn"
          onClick={onFilter}
        >
          <img className={filterIconClass} src="/assets/filter.png" alt="" />
          <span>Filter</span>
        </button>
      </div>

      <div className={filterItemClass}>
        <div className={spacerClass} aria-hidden="true">
          Reset
        </div>

        <button
          type="button"
          className={`${filterInputBoxClass} ${buttonBaseClass} text-[#2400ff]`}
          id="resetBtn"
          onClick={onReset}
        >
          <img className={filterIconClass} src="/assets/reset_bacl.png" alt="" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default FilterButtons;
