import React, { useState } from "react";
import FilterButtons from "./FilterButtons";

const filterBarClass =
  "flex w-full p-[18px] rounded-[8px] bg-white shadow-[0_0_10px_rgb(0_0_0_/_7%)] items-end gap-[14px] max-[1250px]:items-stretch max-[1250px]:flex-col";

const filterFieldsClass =
  "grid min-w-0 flex-1 grid-cols-[repeat(5,minmax(120px,1fr))] gap-[14px] max-[900px]:grid-cols-[repeat(2,minmax(0,1fr))] max-[600px]:grid-cols-1";

const filterItemClass = "flex min-w-0 flex-col gap-[8px]";

const filterLabelClass =
  "h-[14px] text-[#2400ff] text-[10px] font-extrabold leading-[14px]";

const filterInputBoxClass =
  "relative flex w-full h-[38px] min-w-0 px-[10px] py-0 border border-[#b8b8cc] rounded-[6px] bg-white items-center gap-[8px]";

const filterControlClass =
  "min-w-0 h-full border-0 outline-0 bg-transparent flex-1 text-[#04047a] cursor-pointer text-[11px] font-semibold";

const filterIconClass = "w-[14px] h-[14px] object-contain shrink-0";

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
    <div className={filterBarClass}>
      <div className={filterFieldsClass}>
        {filters?.map((filter) => (
          <div className={filterItemClass} key={filter.name}>
            <label className={filterLabelClass} htmlFor={filter.name}>
              {filter.title}
            </label>

            <div
              className={filterInputBoxClass}
              onClick={!filter.isSelect ? openDatePicker : undefined}
            >
              {filter.img && <img className={filterIconClass} src={filter.img} alt="" />}

              {filter.isSelect ? (
                <select
                  className={`${filterControlClass} appearance-none`}
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
                  className={`${filterControlClass} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                  type="date"
                  id={filter.name}
                  name={filter.name}
                  value={selected[filter.name] || ""}
                  onChange={handleChange}
                />
              )}

              <img className={filterIconClass} src="/assets/down_arrow_blac.png" alt="" />
            </div>
          </div>
        ))}
      </div>

      <FilterButtons
        filterInputBoxClass={filterInputBoxClass}
        filterItemClass={filterItemClass}
        filterLabelClass={filterLabelClass}
        filterIconClass={filterIconClass}
        onFilter={applyFilter}
        onReset={resetFilter}
      />
    </div>
  );
};

export default FilterComp;
