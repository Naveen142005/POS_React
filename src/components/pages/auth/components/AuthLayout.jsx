import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const loginClasses = {
  layout:
    "w-[99vw] h-[99vh] flex shadow-[2px_gray] rounded-2xl overflow-hidden bg-white my-[0.5vh] mx-auto font-['Inter',sans-serif]",
  brand:
    "relative w-[55%] h-full bg-[url('/assets/cafe_billing.png')] bg-[position:0px] bg-no-repeat bg-cover before:content-[''] before:absolute before:inset-0 before:bg-[rgba(0,0,0,0.55)] before:z-[1] max-[1100px]:w-[42%] max-[900px]:w-[38%] max-[800px]:hidden",
  brandBody:
    "relative z-[2] text-white flex flex-col justify-center h-full ml-[4.5rem] min-[1200px]:ml-20 max-[1100px]:ml-12 max-[900px]:ml-8",
  logo:
    "p-2 rounded-full bg-[#830ad3] w-[75px] mb-3 max-[900px]:w-[60px]",
  brandLine: "w-12 h-[3px] bg-[rgb(155,17,197)]",
  feature: "flex h-[2.9rem] mb-[25px]",
  featureIcon:
    "w-[2.8rem] h-[2.8rem] rounded-full text-center flex justify-center items-center bg-[linear-gradient(90deg,rgba(110,36,214,1)_35%,rgb(168,39,207)_100%)]",
  featureText: "flex flex-col justify-center ml-3",
  panel:
    "relative w-[45%] min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden before:content-[''] before:absolute before:w-[100px] before:h-[100px] before:bg-[#f94dff2b] before:rounded-full before:bottom-3 before:right-[-4rem] after:content-[''] after:absolute after:w-[100px] after:h-[100px] after:border-[30px] after:border-[#f94dff2b] after:rounded-full after:bottom-[-6.4rem] after:right-[0.8rem] max-[1100px]:w-[58%] max-[900px]:w-[62%] max-[800px]:w-full",
};

const registerClasses = {
  layout: "flex h-screen w-screen rounded-2xl bg-white shadow-[2px_gray]",
  brand:
    "relative h-full w-[45%] bg-[url('/assets/cafe_billing.png')] bg-[position:0px] bg-no-repeat bg-cover text-white before:absolute before:inset-0 before:z-[1] before:content-[''] before:bg-[rgba(0,0,0,0.55)] max-[1100px]:w-[42%] max-[900px]:w-[38%] max-[800px]:hidden",
  brandBody:
    "relative z-[2] flex h-full flex-col justify-center text-white ml-[4.5rem] max-[1100px]:ml-12 max-[900px]:ml-8",
  logo: "mb-3 w-[75px] rounded-full bg-[rgb(125,9,160)] p-2",
  brandLine: "h-[3px] w-12 bg-[rgb(155,17,197)]",
  feature: "mb-[25px] flex h-[2.9rem]",
  featureIcon:
    "flex h-[2.8rem] w-[2.8rem] items-center justify-center rounded-full bg-[linear-gradient(90deg,rgba(110,36,214,1)_35%,rgb(168,39,207)_100%)] text-center",
  featureText: "ml-3 flex flex-col justify-center",
  panel:
    "relative flex h-full w-[55%] flex-col items-center justify-center overflow-y-auto bg-white text-[11px] max-[1100px]:w-[58%] max-[900px]:w-[62%] max-[800px]:w-full",
};

const AuthLayout = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  const classes = isRegisterPage ? registerClasses : loginClasses;

  const featureTitleClass = isRegisterPage
    ? "mb-1 text-[15px]"
    : "mb-1 text-[15px]";
  const featureDescriptionClass = "text-[11px]";

  return (
    <div className={classes.layout}>
      <div className={classes.brand}>
        <div className={classes.brandBody}>
          <div className="mb-[1.6rem]">
            <img
              src="/assets/coffee.png"
              alt="coffee icon"
              className={classes.logo}
            />

            <h1 className="mb-2">POS Cafe</h1>
            <div className="mb-[1.6rem]">Point of Sale System</div>

            <div className={classes.brandLine}></div>
          </div>

          <div>
            <b className="tracking-[0.5px]">Smart Billing. Happy Business.</b>
            <br /> <br />
            <small>
              All-in-one POS solution to streamline <br /> your cafe operations.
            </small>
            <br />
            <br />
            <div>
              <div className={classes.feature}>
                <div className={classes.featureIcon}>
                  <img src="/assets/icons8-billing-48.png" alt="" width="24" />
                </div>

                <div className={classes.featureText}>
                  <div className={featureTitleClass}>Fast & Easy Billing</div>
                  <div className={featureDescriptionClass}>Create bills in seconds</div>
                </div>
              </div>

              <div className={classes.feature}>
                <div className={classes.featureIcon}>
                  <img src="/assets/icons8-cube-30.png" alt="" />
                </div>

                <div className={classes.featureText}>
                  <div className={featureTitleClass}>Inventory Management</div>
                  <div className={featureDescriptionClass}>Track stock in real time</div>
                </div>
              </div>

              <div className={classes.feature}>
                <div className={classes.featureIcon}>
                  <img src="/assets/icons8-bar-graph-24.png" alt="" />
                </div>

                <div className={classes.featureText}>
                  <div className={featureTitleClass}>Detailed Reports</div>
                  <div className={featureDescriptionClass}>Insights to grow your business</div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className={classes.panel}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
