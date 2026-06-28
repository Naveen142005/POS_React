import "./SidebarNavigation.css";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../../redux/authSlice";

const isMobileView = () => window.matchMedia("(max-width: 768px)").matches;

const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/dashboard",
    icon: "sidebar-dashboard.svg",
  },
  {
    key: "billing",
    label: "Billing",
    path: "/billing",
    icon: "sidebar-billing.svg",
  },
  {
    key: "inventory",
    label: "Inventory",
    path: "/inventory",
    icon: "sidebar-inventory.svg",
  },
  {
    key: "Item request",
    label: "Item request",
    path: "/item_request",
    icon: "sidebar-orders.svg",
  },
  {
    key: "Sales reports",
    label: "Sales Reports",
    path: "/sales_reports",
    icon: "sidebar-reports.svg",
  },
  {
    key: "settings",
    label: "Settings",
    path: null,
    icon: "sidebar-settings.svg",
  },
  {
    key: "users",
    label: "Users",
    path: null,
    icon: "sidebar-users.svg",
  },
];

const SidebarNavigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = useSelector((state) => state.auth.currentUser);

  const [sidebarMode, setSidebarMode] = useState("default");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isMobileOpen = sidebarMode === "mobileOpen";
  const isDesktopClosed = sidebarMode === "desktopClosed";

  const username = currentUser?.fullname || "Admin";
  const userInitial = username.charAt(0).toUpperCase();

  const activePage = menuItems.find(
    (item) => item.path && location.pathname.includes(item.path),
  )?.key;

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 768px)");

    const resetSidebar = () => {
      setSidebarMode("default");
    };

    mobileQuery.addEventListener("change", resetSidebar);

    return () => {
      mobileQuery.removeEventListener("change", resetSidebar);
    };
  }, []);

  const handleMenu = () => {
    if (isMobileView()) {
      setSidebarMode("mobileOpen");
      return;
    }

    setSidebarMode((mode) =>
      mode === "desktopClosed" ? "default" : "desktopClosed",
    );
  };

  const handleMenuItemClick = (path) => {
    if (path) {
      navigate(path);
    }

    if (isMobileOpen) {
      setSidebarMode("default");
    }
  };

  const closeMobileSidebar = () => {
    setSidebarMode("default");
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    localStorage.removeItem("CurrentUser");
    sessionStorage.removeItem("CurrentUser");
    dispatch(clearCurrentUser());
    navigate("/login", { replace: true });
  };

  const sidebarClass = `
    sidebar-navigation
    ${isMobileOpen ? "sidebar-nav-open" : ""}
    ${isDesktopClosed ? "sidebar-nav-closed" : ""}
  `;

  const pageClass = `
    sidebar-page
    ${isDesktopClosed ? "sidebar-page-closed" : ""}
  `;

  return (
    <>
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeMobileSidebar}
        />
      )}

      <div className={sidebarClass} id="sidebar-nav">
        <div className="sidebar-nav-layout">
          <div>
            <div className="sidebar-nav-brand">
              <div className="sidebar-nav-logo">
                <img src="/assets/coffee.png" alt="POS Cafe" />
              </div>

              <div className="sidebar-nav-title">
                <h2>POS Cafe</h2>
              </div>
            </div>

            <nav className="sidebar-nav-menu" aria-label="Main navigation">
              {menuItems.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className={`sidebar-nav-item ${
                    activePage === item.key ? "sidebar-nav-item-active" : ""
                  }`}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  <img src={`/assets/icons/${item.icon}`} alt="" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

            <button
              type="button"
              className="sidebar-nav-user"
              onClick={() => setUserMenuOpen((open) => !open)}
              aria-expanded={userMenuOpen}
            >
              <div className="sidebar-nav-user-avatar">{userInitial}</div>

              <div className="sidebar-nav-user-info">
                <div className="sidebar-nav-user-name">{username}</div>
                <div className="sidebar-nav-user-role">Administrator</div>
              </div>

              <img
                src="/assets/down-arrow.png"
                className="sidebar-nav-user-arrow"
                alt=""
              />
            </button>

            {userMenuOpen && (
              <div className="sidebar-user-dropdown">
                <div className="sidebar-user-dropdown-name">{username}</div>
                <div className="sidebar-user-dropdown-role">Administrator</div>
                <button type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
  

      <div className={pageClass}>
        <Outlet
          context={{
            openSidebar: handleMenu,
            toggleSidebar: handleMenu,
            sidebarClosed: isDesktopClosed,
            logout: handleLogout,
          }}
        />
      </div>
    </>
  );
};

export default SidebarNavigation;
