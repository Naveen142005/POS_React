import React, { useState } from "react";
import FilterButtons from "./FilterButtons";
import "./filter.css";

const FilterComp = ({ filters, onFilter, onReset }) => {
  const [selected, setSelected] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSelected((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openDatePicker = (event) => {
    const dateInput = event.currentTarget.querySelector(
      'input[type="date"]'
    );

    try {
      if (dateInput?.showPicker) dateInput.showPicker();
      else dateInput?.focus();
    } catch {
      dateInput?.focus();
    }
  };

  const applyFilter = () => {
    onFilter?.(selected);
  };

  const resetFilter = () => {
    setSelected({});
    onReset?.();
  };

  return (
    <div className="flt-bar">
      <div className="flt-fields">
        {filters?.map((filter) => (
          <div className="flt-item" key={filter.name}>
            <label className="flt-label" htmlFor={filter.name}>
              {filter.title}
            </label>

            <div
              className={`flt-input ${filter.isSelect ? "" : "flt-date"}`}
              onClick={!filter.isSelect ? openDatePicker : undefined}
            >
              {filter.img && <img src={filter.img} alt="" />}

              {filter.isSelect ? (
                <select
                  id={filter.name}
                  name={filter.name}
                  value={selected[filter.name] || ""}
                  onChange={handleChange}
                >
                  <option value="">{filter.placeholder}</option>

                  {filter.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="date"
                  id={filter.name}
                  name={filter.name}
                  value={selected[filter.name] || ""}
                  onChange={handleChange}
                />
              )}

              <img src="/assets/down_arrow_blac.png" alt="" />
            </div>
          </div>
        ))}
      </div>

      <FilterButtons
        onFilter={applyFilter}
        onReset={resetFilter}
      />
    </div>
  );
};

export default FilterComp;
