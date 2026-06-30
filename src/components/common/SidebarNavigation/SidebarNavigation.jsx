import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearCurrentUser } from "../../../redux/authSlice";

const isMobileView = () => window.matchMedia("(max-width: 768px)").matches;

const cx = (...classes) => classes.filter(Boolean).join(" ");

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

const sidebarBaseClass =
  "fixed left-0 top-0 z-[999] h-[100dvh] w-[200px] translate-x-0 overflow-hidden bg-[linear-gradient(180deg,#121343,#080923)] px-[14px] py-[18px] text-white transition-all duration-200 ease-[ease] max-[768px]:-translate-x-full max-[600px]:duration-300";

const sidebarLayoutClass = "relative flex h-full flex-col justify-between";
const sidebarBrandClass =
  "mb-[26px] flex flex-col items-center justify-center gap-[14px]";
const sidebarLogoClass =
  "flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-[14px] bg-[linear-gradient(135deg,#5b36ff,#7705c3)] shadow-[0_8px_18px_rgba(91,54,255,0.35)] max-[768px]:h-10 max-[768px]:w-10";
const sidebarLogoImageClass =
  "h-6 w-6 object-cover max-[768px]:h-5 max-[768px]:w-5";
const sidebarMenuClass = "flex flex-col gap-1.5 max-[600px]:gap-1";
const sidebarItemBaseClass =
  "flex h-10 w-full cursor-pointer items-center gap-[11px] rounded-[7px] border-0 bg-transparent px-[11px] text-left [font-family:inherit] text-xs font-medium text-[#e1e1eb] transition duration-[220ms] ease-[ease] hover:scale-[1.04] hover:bg-[rgba(255,255,255,0.1)] max-[600px]:h-9 max-[600px]:px-2";
const sidebarItemActiveClass =
  "bg-[linear-gradient(90deg,#5b36ff,#7c3aed)] font-semibold text-white shadow-[0_5px_12px_rgba(91,54,255,0.3)] hover:scale-100";
const sidebarUserClass =
  "flex w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent p-0 text-left";
const sidebarUserAvatarClass =
  "flex h-[35px] w-[35px] shrink-0 items-center justify-center rounded-full bg-[#830ad3] text-xs font-bold text-white";
const dropdownClass =
  "absolute bottom-[62px] left-[14px] right-[14px] z-20 rounded-md bg-white p-3 shadow-[0_12px_28px_rgba(0,0,0,0.22)]";

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

  const sidebarClass = cx(
    sidebarBaseClass,
    isMobileOpen && "max-[768px]:!translate-x-0",
    isDesktopClosed && "!-translate-x-full",
  );

  const navItemClass = (isActive) =>
    cx(sidebarItemBaseClass, isActive && sidebarItemActiveClass);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[998] bg-transparent"
          onClick={closeMobileSidebar}
        />
      )}

      <div className={sidebarClass} id="sidebar-nav">
        <div className={sidebarLayoutClass}>
          <div>
            <div className={sidebarBrandClass}>
              <div className={sidebarLogoClass}>
                <img
                  className={sidebarLogoImageClass}
                  src="/assets/coffee.png"
                  alt="POS Cafe"
                />
              </div>

              <div className="text-center">
                <h2 className="m-0 text-base font-bold leading-[1.1] text-white">
                  POS Cafe
                </h2>
              </div>
            </div>

            <nav className={sidebarMenuClass} aria-label="Main navigation">
              {menuItems.map((item) => (
                <button
                  type="button"
                  key={item.key}
                  className={navItemClass(activePage === item.key)}
                  onClick={() => handleMenuItemClick(item.path)}
                >
                  <img
                    className="h-[21px] w-[21px] shrink-0 object-contain"
                    src={`/assets/icons/${item.icon}`}
                    alt=""
                  />
                  <span className="whitespace-nowrap text-xs">
                    {item.label}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <button
            type="button"
            className={sidebarUserClass}
            onClick={() => setUserMenuOpen((open) => !open)}
            aria-expanded={userMenuOpen}
          >
            <div className={sidebarUserAvatarClass}>{userInitial}</div>

            <div className="flex flex-col gap-0.5">
              <div className="whitespace-nowrap text-[13px] font-bold text-white">
                {username}
              </div>
              <div className="text-[11px] font-medium text-[#dcdcdc]">
                Administrator
              </div>
            </div>

            <img
              src="/assets/down-arrow.png"
              className="ml-auto h-[13px] w-[13px] shrink-0"
              alt=""
            />
          </button>

          {userMenuOpen && (
            <div className={dropdownClass}>
              <div className="text-[13px] font-extrabold text-[#080923]">
                {username}
              </div>
              <div className="mt-[3px] text-[11px] font-semibold text-[#6b7280]">
                Administrator
              </div>
              <button
                type="button"
                className="mt-2.5 h-[34px] w-full cursor-pointer rounded-md border-0 bg-[#f1edff] px-2.5 text-left text-xs font-extrabold text-[#6c38ff] hover:bg-[#e4dcff]"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full min-w-0">
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
