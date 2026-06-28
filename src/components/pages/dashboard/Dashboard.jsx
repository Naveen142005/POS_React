import { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import StatsCards from "./StatsCards";
import SalesOverviewCard from "./SalesOverviewCard";
import TopSellingItemsCard from "./TopSellingItemsCard";
import RecentTransactionsCard from "./RecentTransactionsCard";
import LowStockAlertsCard from "./LowStockAlertsCard";
import QuickActionsCard from "./QuickActionsCard";
import DashboardFooter from "./DashboardFooter";
import useDashboardData, { formatMoney } from "./hooks/useDashboardData";

import "./dashboard.css";

const defaultDateRange = {
  mode: "all",
  startDate: null,
  endDate: null,
  label: "All",
};

const Dashboard = () => {
  const [dateRange, setDateRange] = useState(defaultDateRange);
  const { bills, dashboardData, details, inventory } = useDashboardData(dateRange);

  const resetDateRange = () => {
    setDateRange(defaultDateRange);
  };

  return (
    <>
      <div className="dash-page" id="main">
        <DashboardHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onDateRangeReset={resetDateRange}
        />

        <main className="dash-content">
          <StatsCards stats={dashboardData.stats} formatMoney={formatMoney} />

          <div className="dash-card-grid">
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

          <div className="dash-bottom-row">
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
