import React from "react";
import { useOutletContext } from "react-router-dom";
import { getDate, getDay, getTime } from "../../utils/utils";

const PageHeader = ({ pageName }) => {
  const { openSidebar } = useOutletContext();

  return (
    <header className="flex w-full items-center justify-between max-[600px]:items-start">
      <div className="flex items-center gap-[10px]">
        <img
          className="h-5 w-5 cursor-pointer object-contain"
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
        <span className="text-[21px] font-semibold max-[600px]:text-[18px]">{pageName}</span>
      </div>

      <div className="flex items-center gap-3 rounded bg-white py-1 pl-1 pr-2 shadow-[0_0_10px_rgb(0_0_0_/_7%)] max-[600px]:hidden">
        <div className="flex items-center gap-[10px] p-[6px] text-left">
          <img className="h-[21px] w-[21px] object-contain" src="/assets/canlendar.png" alt="" />
          <span className="text-[10px] font-semibold">
            {getDate()} <br />
            <small className="text-[9px] text-[#2400ff]">{getDay()}</small>
          </span>
        </div>

        <span className="h-[23px] w-px bg-[#5f5d5d56]" />

        <div className="flex items-center gap-[10px] p-[6px] text-left">
          <img className="h-[21px] w-[21px] object-contain" src="/assets/clock.png" alt="" />
          <span className="text-[10px] font-semibold">{getTime()}</span>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
