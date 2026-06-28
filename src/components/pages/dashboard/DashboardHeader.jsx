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
    <header className="dash-header">
      <div className="dash-header-main">
        <img
          style={{ cursor: "pointer" }}
          src="/assets/icons/header-menu.svg"
          alt="header-menu icon"
          width="25"
          height="25"
          id="menu-icon"
          onClick={openSidebar}
        />

        <div className="dash-title-area">
          <img src="/assets/search.png" alt="" className="dash-title-search-icon" />
          <input type="text" placeholder="Search anything..." />
          <span className="dash-search-shortcut">Ctrl + K</span>
        </div>
      </div>

      <div className="dash-header-actions">
        <div className="dash-calendar-box" onClick={openDatePicker}>
          <button
            type="button"
            className="dash-all-date"
            onClick={resetToAll}
          >
            All
          </button>

          <div>
            <img
              src="/assets/calendar_blue.png"
              alt="calendar icon"
              className="dash-calendar-icon"
            />

            <input
              ref={inputRef}
              type="text"
              id="rangePicker"
              className="dash-range-picker"
            />

            <span id="dateText">{dateText}</span>

            <img
              src="/assets/icons/header-down-arrow.svg"
              alt="header-down-arrow icon"
              width="25"
              height="25"
              className="dash-down-arrow"
            />
          </div>
        </div>

        <div className="dash-profile-area">
          <div className="dash-bell-box">
            <span className="dash-alert-dot"></span>

            <img
              src="/assets/icons/header-bell.svg"
              alt="header-bell icon"
              width="25"
              height="25"
            />
          </div>

          <div className="dash-user-menu-wrap">
            <button
              type="button"
              className="dash-user-menu"
              onClick={() => setUserMenuOpen((open) => !open)}
              aria-expanded={userMenuOpen}
            >
              <div className="dash-user-avatar">{initials}</div>

              <div className="dash-user-info">
                <div className="dash-user-name">{username}</div>

                <div className="dash-user-role">Administrator</div>
              </div>

              <img
                src="/assets/icons/header-user-down-arrow.svg"
                alt=""
                width="25"
                height="25"
                className="dash-user-arrow"
              />
            </button>

            {userMenuOpen && (
              <div className="dash-user-dropdown">
                <div className="dash-user-dropdown-name">{username}</div>
                <div className="dash-user-dropdown-role">Administrator</div>
                <button
                  type="button"
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
