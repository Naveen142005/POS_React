import React from "react";

const FilterButtons = ({ onFilter, onReset }) => {
  return (
    <div className="flt-actions">
      <div className="flt-item">
        <div className="flt-label flt-spacer" aria-hidden="true">
          Filter
        </div>

        <button
          type="button"
          className="flt-input flt-apply"
          id="filterBtn"
          onClick={onFilter}
        >
          <img src="/assets/filter.png" alt="" />
          <span>Filter</span>
        </button>
      </div>

      <div className="flt-item">
        <div className="flt-label flt-spacer" aria-hidden="true">
          Reset
        </div>

        <button
          type="button"
          className="flt-input flt-reset"
          id="resetBtn"
          onClick={onReset}
        >
          <img src="/assets/reset_bacl.png" alt="" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default FilterButtons;
