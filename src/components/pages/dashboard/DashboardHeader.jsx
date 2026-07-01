import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { formatDate } from "../../../utils/utils";

const DashboardHeader = ({
  dateRange,
  onDateRangeChange,
  onDateRangeReset,
}) => {
  const { openSidebar, logout } = useOutletContext();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const pickerRef = useRef(null);
  const dateText = dateRange?.label || "All";
  const username = currentUser?.fullname || "Admin User";
  const initials =
    username
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "AD";

  useEffect(() => {
    if (!inputRef.current) return;

    pickerRef.current = flatpickr(inputRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      onChange(selectedDates) {
        if (selectedDates.length !== 2) return;

        const startDate = new Date(selectedDates[0]);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(selectedDates[1]);
        endDate.setHours(23, 59, 59, 999);

        onDateRangeChange({
          mode: "custom",
          startDate,
          endDate,
          label: `${formatDate(startDate)} - ${formatDate(endDate)}, ${endDate.getFullYear()}`,
        });
      },
    });

    return () => {
      if (pickerRef.current) {
        pickerRef.current.destroy();
      }
    };
  }, [onDateRangeChange]);

  const openDatePicker = () => {
    if (pickerRef.current) {
      pickerRef.current.open();
      return;
    }

    inputRef.current?.focus();
  };

  const resetToAll = (event) => {
    event.stopPropagation();
    pickerRef.current?.clear();
    onDateRangeReset();
  };

  return (
    <header className="bg-white px-[25px] py-[15px] flex justify-between items-center min-[1470px]:h-16 min-[1470px]:py-3 min-[1470px]:px-[25px] min-[1470px]:shrink-0">
      <div className="flex w-auto flex-1 min-w-0 items-center gap-7">
        <img
          className="cursor-pointer shrink-0"
          src="/assets/icons/header-menu.svg"
          alt="header-menu icon"
          width="25"
          height="25"
          id="menu-icon"
          onClick={openSidebar}
        />
        <h3 className="relative left-[-20px] text-[21px] font-semibold max-[600px]:text-[18px]">DashBoard</h3>

      </div>

      <div className="flex items-center gap-8">
        <div
          className="relative cursor-pointer flex justify-between items-center gap-2.5 h-[35px] px-3.5 border border-[rgba(202,199,199,0.662)] rounded-md bg-white text-[13px] font-medium text-[#1f2937]"
          onClick={openDatePicker}
        >
          <button
            type="button"
            className="relative mr-[5px] cursor-pointer rounded-[5px] border border-[#d9b3f5] bg-transparent px-2 py-[3px] text-xs font-semibold text-[#830ad3] transition-all duration-300 ease-in-out after:content-[''] after:absolute after:right-[-10px] after:w-px after:h-[18px] after:bg-[#b2abab] hover:bg-[rgb(246,234,255)] hover:text-[#55018d]"
            onClick={resetToAll}
          >
            All
          </button>

          <div className="flex justify-center items-center gap-1">
            <img
              src="/assets/calendar_blue.png"
              alt="calendar icon"
              className="w-[18px] h-[18px] text-[#3f3f63]"
            />

            <input
              ref={inputRef}
              type="text"
              id="rangePicker"
              className="opacity-0 absolute cursor-pointer"
            />

            <span id="dateText" className="max-[820px]:hidden">
              {dateText}
            </span>

            <img
              src="/assets/icons/header-down-arrow.svg"
              alt="header-down-arrow icon"
              width="25"
              height="25"
              className="w-3.5 h-3.5 text-[#4b5563] ml-1"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="cursor-pointer relative flex items-center justify-center">
            <span className="absolute top-[-3px] right-[-4px] w-2 h-2 bg-[#6c38ff] border-2 border-white rounded-full"></span>

            <img
              src="/assets/icons/header-bell.svg"
              alt="header-bell icon"
              width="25"
              height="25"
              className="w-[23px] h-[23px] text-[#111827]"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              className="border-0 bg-transparent cursor-pointer flex items-center gap-2.5 p-0 text-left"
              onClick={() => setUserMenuOpen((open) => !open)}
              aria-expanded={userMenuOpen}
            >
              <div className="w-[35px] h-[35px] rounded-full bg-[#6c38ff] text-white flex items-center justify-center text-xs font-bold">
                {initials}
              </div>

              <div className="flex flex-col gap-0.5 max-[995px]:hidden">
                <div className="flex items-center gap-1 text-[13px] font-bold text-[#111827] whitespace-nowrap">
                  {username}
                </div>

                <div className="text-[11px] text-[#6b7280] font-medium">
                  Administrator
                </div>
              </div>

              <img
                src="/assets/icons/header-user-down-arrow.svg"
                alt=""
                width="25"
                height="25"
                className="w-[13px] h-[13px] text-[#111827]"
              />
            </button>

            {userMenuOpen && (
              <div className="absolute top-[calc(100%_+_10px)] right-0 z-30 w-[180px] p-3 border border-[#eeeafc] rounded-lg bg-white shadow-[0_12px_28px_rgba(15,23,42,0.16)]">
                <div className="text-[#111827] text-[13px] font-extrabold">
                  {username}
                </div>
                <div className="text-[#6b7280] text-[11px] font-semibold mt-[3px]">
                  Administrator
                </div>
                <button
                  type="button"
                  className="w-full h-[34px] mt-2.5 border-0 rounded-md bg-[#f1edff] text-[#6c38ff] cursor-pointer text-xs font-extrabold px-2.5 text-left hover:bg-[#e4dcff]"
                  onClick={() => {
                    setUserMenuOpen(false);
                    logout();
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 
