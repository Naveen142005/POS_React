import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import SalesOverviewCard from "./SalesOverviewCard";
import TopSellingItemsCard from "./TopSellingItemsCard";
import RecentTransactionsCard from "./RecentTransactionsCard";
import LowStockAlertsCard from "./LowStockAlertsCard";
import QuickActionsCard from "./QuickActionsCard";
import DashboardFooter from "./DashboardFooter";
import useDashboardData, { formatMoney } from "./hooks/useDashboardData";

const defaultDateRange = {
  mode: "all",
  startDate: null,
  endDate: null,
  label: "All",
};

const Dashboard = () => {
  const { sidebarClosed } = useOutletContext();
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const { bills, dashboardData, details, inventory } = useDashboardData(dateRange);

  const resetDateRange = () => {
    setDateRange(defaultDateRange);
  };

  return (
    <>
      <div
        className={`ml-[200px] w-[calc(100%_-_200px)] min-h-screen transition-all duration-200 ease-in-out flex flex-col justify-between max-[768px]:ml-0 max-[768px]:w-full min-[1470px]:h-screen min-[1470px]:min-h-screen min-[1470px]:overflow-hidden min-[1470px]:justify-start ${sidebarClosed ? "!ml-0 !w-full" : ""}`}
        id="main"
      >
        <DashboardHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onDateRangeReset={resetDateRange}
        />

        <main className="bg-[#f5f6fa] px-[25px] pt-[25px] pb-0 min-[1470px]:flex-1 min-[1470px]:min-h-0 min-[1470px]:px-[25px] min-[1470px]:py-[18px] min-[1470px]:overflow-hidden min-[1470px]:flex min-[1470px]:!flex-col min-[1470px]:gap-[18px] min-[1470px]:[grid-template-rows:none!important]">
          <StatsCards stats={dashboardData.stats} formatMoney={formatMoney} />

          <div className="flex justify-between flex-wrap mt-6 gap-5 max-[1470px]:flex-col max-[1470px]:gap-3 min-[1470px]:w-full min-[1470px]:flex-1 min-[1470px]:min-h-0 min-[1470px]:!grid min-[1470px]:grid-cols-[1.35fr_1fr_1fr] min-[1470px]:gap-[18px]">
            <SalesOverviewCard
              bills={bills}
              details={details}
              formatMoney={formatMoney}
            />
            <TopSellingItemsCard
              bills={bills}
              details={details}
              inventory={inventory}
              formatMoney={formatMoney}
            />
            <RecentTransactionsCard
              transactions={dashboardData.recentTransactions}
              formatMoney={formatMoney}
            />
          </div>

          <div className="flex mt-6 gap-[18px] w-full max-[920px]:flex-col min-[1470px]:w-full min-[1470px]:h-[clamp(115px,16vh,165px)] min-[1470px]:shrink-0 min-[1470px]:!flex min-[1470px]:gap-[18px] min-[1470px]:m-0">
            <LowStockAlertsCard items={dashboardData.lowStockItems} />
            <QuickActionsCard />
          </div>
        </main>

        <DashboardFooter />
      </div>
    </>
  );
};

export default Dashboard;
