import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import loginStyles from "../login.css?inline";
import registerStyles from "../register.css?inline";

const AuthLayout = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === "/register";
  const authClass = (name) => `${isRegisterPage ? "reg" : "login"}-${name}`;
  
  return (
    <div className={authClass("layout")}>
      <style>{isRegisterPage ? registerStyles : loginStyles}</style>
      <div className={authClass("brand")}>
        <div className={authClass("brand-body")}>
          <div style={{ marginBottom: "1.6rem" }}>
            <img
              src="/assets/coffee.png"
              alt="coffee icon"
              className={authClass("logo")}
            />

            <h1 style={{ marginBottom: "8px" }}>POS Cafe</h1>
            <div style={{ marginBottom: "1.6rem" }}>Point of Sale System</div>

            <div className={authClass("brand-line")}></div>
          </div>

          <div>
            <b style={{ letterSpacing: "0.5px" }}>
              Smart Billing. Happy Business.
            </b>
            <br /> <br />
            <small>
              All-in-one POS solution to streamline <br /> your cafe operations.
            </small>
            <br />
            <br />
            <div>
              <div className={authClass("feature")}>
                <div className={authClass("feature-icon")}>
                  <img src="/assets/icons8-billing-48.png" alt="" width="24" />
                </div>

                <div className={authClass("feature-text")}>
                  <div style={{ marginBottom: "4px", fontSize: "15px" }}>
                    Fast & Easy Billing
                  </div>
                  <div style={{ fontSize: "11px" }}>
                    Create bills in seconds
                  </div>
                </div>
              </div>

              <div className={authClass("feature")}>
                <div className={authClass("feature-icon")}>
                  <img src="/assets/icons8-cube-30.png" alt="" />
                </div>

                <div className={authClass("feature-text")}>
                  <div style={{ marginBottom: "4px", fontSize: "15px" }}>
                    Inventory Management
                  </div>
                  <div style={{ fontSize: "11px" }}>
                    Track stock in real time
                  </div>
                </div>
              </div>

              <div className={authClass("feature")}>
                <div className={authClass("feature-icon")}>
                  <img src="/assets/icons8-bar-graph-24.png" alt="" />
                </div>

                <div className={authClass("feature-text")}>
                  <div style={{ marginBottom: "4px", fontSize: "15px" }}>
                    Detailed Reports
                  </div>
                  <div style={{ fontSize: "11px" }}>
                    Insights to grow your business
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
      <div className={authClass("panel")}>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
