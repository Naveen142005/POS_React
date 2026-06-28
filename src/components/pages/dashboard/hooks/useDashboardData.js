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

const useDashboardData = (dateRange) => {
  const inventory = useSelector((state) => state.inventory.items);
  const { bills, details } = useSelector((state) => state.billing);

  const dashboardData = useMemo(() => {
    const filteredDetails = details.filter((bill) =>
      isInDateRange(bill.created_at, dateRange),
    );

    const completedBills = filteredDetails.filter(
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
      stats: {
        totalSales,
        totalOrders: completedBills.length,
        totalCustomers: completedBills.length,
        averageOrderValue: completedBills.length ? totalSales / completedBills.length : 0,
        totalProfit: totalSales - totalCost,
      },
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
