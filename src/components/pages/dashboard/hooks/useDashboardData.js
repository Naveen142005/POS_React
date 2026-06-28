import { useMemo } from "react";
import { useSelector } from "react-redux";

export const formatMoney = (value) => `₹ ${Number(value || 0).toFixed(2)}`;

const toDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const isInDateRange = (value, dateRange) => {
  if (!dateRange || dateRange.mode === "all") return true;

  const date = toDate(value);
  if (!date) return false;

  const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
  const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

  return (!startDate || date >= startDate) && (!endDate || date <= endDate);
};

const startOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
};

const endOfDay = (date) => {
  const nextDate = new Date(date);
  nextDate.setHours(23, 59, 59, 999);
  return nextDate;
};

const isInBounds = (value, bounds) => {
  if (!bounds) return false;

  const date = toDate(value);
  return date ? date >= bounds.startDate && date <= bounds.endDate : false;
};

const getRangeBounds = (sourceDetails, dateRange) => {
  if (dateRange?.mode !== "all" && dateRange?.startDate && dateRange?.endDate) {
    return {
      startDate: startOfDay(dateRange.startDate),
      endDate: endOfDay(dateRange.endDate),
    };
  }

  const dates = sourceDetails
    .map((bill) => toDate(bill.created_at))
    .filter(Boolean);

  if (!dates.length) return null;

  return {
    startDate: startOfDay(new Date(Math.min(...dates.map((date) => date.getTime())))),
    endDate: endOfDay(new Date(Math.max(...dates.map((date) => date.getTime())))),
  };
};

const getPreviousBounds = (bounds) => {
  if (!bounds) return null;

  const rangeLength = bounds.endDate.getTime() - bounds.startDate.getTime() + 1;
  const previousEnd = new Date(bounds.startDate.getTime() - 1);
  const previousStart = new Date(previousEnd.getTime() - rangeLength + 1);

  return {
    startDate: previousStart,
    endDate: previousEnd,
  };
};

const getTrendPercentage = (current, previous) => {
  const currentValue = Number(current || 0);
  const previousValue = Number(previous || 0);

  if (previousValue === 0) {
    return currentValue === 0 ? 0 : 100;
  }

  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

const getTrendLabel = (bounds) => {
  if (!bounds) return "vs previous period";

  const dayLength = 24 * 60 * 60 * 1000;
  const days = Math.round(
    (endOfDay(bounds.endDate).getTime() - startOfDay(bounds.startDate).getTime()) /
      dayLength,
  ) + 1;

  return days === 7 ? "vs last week" : "vs previous period";
};

const useDashboardData = (dateRange) => {
  const inventory = useSelector((state) => state.inventory.items);
  const { bills, details } = useSelector((state) => state.billing);

  const dashboardData = useMemo(() => {
    const filteredDetails = details.filter((bill) =>
      isInDateRange(bill.created_at, dateRange),
    );

    const createStats = (sourceDetails) => {
      const completedBills = sourceDetails.filter(
        (bill) => bill.status === "Completed",
      );

      const completedItems = completedBills.flatMap((bill) =>
        Array.isArray(bills[bill.billId]) ? bills[bill.billId] : [],
      );

      const totalSales = completedItems.reduce(
        (sum, item) => sum + Number(item.total || 0),
        0,
      );

      const totalCost = completedItems.reduce((sum, item) => {
        const stockItem = inventory.find(
          (entry) => String(entry.itemCode) === String(item.itemCode),
        );
        return sum + Number(stockItem?.basePrice || 0) * Number(item.qty || 0);
      }, 0);

      return {
        totalSales,
        totalOrders: completedBills.length,
        totalCustomers: completedBills.length,
        averageOrderValue: completedBills.length ? totalSales / completedBills.length : 0,
        totalProfit: totalSales - totalCost,
      };
    };

    const currentStats = createStats(filteredDetails);
    const currentBounds = getRangeBounds(filteredDetails, dateRange);
    const previousBounds = getPreviousBounds(currentBounds);
    const previousStats = createStats(
      details.filter((bill) => isInBounds(bill.created_at, previousBounds)),
    );

    const stats = {
      ...currentStats,
      trendLabel: getTrendLabel(currentBounds),
      trends: {
        totalSales: getTrendPercentage(currentStats.totalSales, previousStats.totalSales),
        totalOrders: getTrendPercentage(currentStats.totalOrders, previousStats.totalOrders),
        totalCustomers: getTrendPercentage(
          currentStats.totalCustomers,
          previousStats.totalCustomers,
        ),
        averageOrderValue: getTrendPercentage(
          currentStats.averageOrderValue,
          previousStats.averageOrderValue,
        ),
        totalProfit: getTrendPercentage(currentStats.totalProfit, previousStats.totalProfit),
      },
    };

    const recentTransactions = [...filteredDetails]
      .sort((first, second) => {
        const firstTime = toDate(first.created_at)?.getTime() || 0;
        const secondTime = toDate(second.created_at)?.getTime() || 0;
        return secondTime - firstTime;
      })
      .slice(0, 5)
      .map((bill) => {
        const items = Array.isArray(bills[bill.billId]) ? bills[bill.billId] : [];
        const total = items.reduce((sum, item) => sum + Number(item.total || 0), 0);
        return {
          ...bill,
          total,
          itemCount: items.length,
        };
      });

    const lowStockItems = inventory
      .filter((item) => Number(item.inStock || 0) <= 10)
      .sort((first, second) => Number(first.inStock || 0) - Number(second.inStock || 0))
      .slice(0, 4);

    return {
      stats,
      recentTransactions,
      lowStockItems,
    };
  }, [bills, dateRange, details, inventory]);

  return {
    bills,
    dashboardData,
    details,
    inventory,
  };
};

export default useDashboardData;
