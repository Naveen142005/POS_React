import React from "react";
import { useOutletContext } from "react-router-dom";
import { getDate, getDay, getTime } from "../../utils/utils";
import "./PageHeader.css";

const PageHeader = ({ pageName }) => {
  const { openSidebar } = useOutletContext();

  return (
    <header className="pg-head">
      <div className="pg-title">
        <img
          src="/assets/static-menu.png"
          alt=""
          id="menu-icon"
          onClick={openSidebar}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") openSidebar();
          }}
        />
        <span>{pageName}</span>
      </div>

      <div className="pg-meta">
        <div className="pg-date">
          <img src="/assets/canlendar.png" alt="" />
          <span>
            {getDate()} <br />
            <small>{getDay()}</small>
          </span>
        </div>

        <span className="pg-line" />

        <div className="pg-time">
          <img src="/assets/clock.png" alt="" />
          <span>{getTime()}</span>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
