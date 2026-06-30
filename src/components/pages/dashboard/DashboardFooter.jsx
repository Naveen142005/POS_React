import React from "react";

const DashboardFooter = () => {
  return (
    <footer className="mt-3 h-[70px] w-full bg-white border-t border-[rgb(232,230,242)] flex items-center justify-between px-7 max-[768px]:flex-col max-[768px]:text-center max-[768px]:gap-2.5 max-[768px]:p-[15px] max-[768px]:h-auto min-[1470px]:h-[54px] min-[1470px]:mt-0 min-[1470px]:shrink-0">
      <p className="m-0 text-xs font-bold text-[rgb(105,100,135)]">
        © 2024 POS Cafe. All rights reserved.
      </p>

      <p className="m-0 text-xs font-bold text-[rgb(105,100,135)]">
        Made with <span className="text-[rgb(91,61,255)] text-[13px] mx-1">♥</span> for your business
      </p>
    </footer>
  );
};

export default DashboardFooter;
