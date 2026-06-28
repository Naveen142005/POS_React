import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { exportTableToExcel, showPopups } from "../../../utils/utils";

const tabs = ["Today", "Yesterday", "This Week", "This Month", "Custom"];

const defaultFilter = {
  tab: "This Month",
  itemName: "",
  fromDate: "",
  toDate: "",
};

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const startOfDay = (date) => {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
};

const endOfDay = (date) => {
  const next = new Date(date);
  next.setHours(23, 59, 59, 999);
  return next;
};

const getRangeForTab = (tab) => {
  const now = new Date();

  if (tab === "Today") {
    return {
      from: startOfDay(now),
      to: endOfDay(now),
    };
  }

  if (tab === "Yesterday") {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return {
      from: startOfDay(yesterday),
      to: endOfDay(yesterday),
    };
  }

  if (tab === "This Week") {
    const firstDay = new Date(now);
    const day = firstDay.getDay();
    const diff = firstDay.getDate() - day + (day === 0 ? -6 : 1);
    firstDay.setDate(diff);
    return {
      from: startOfDay(firstDay),
      to: endOfDay(now),
    };
  }

  if (tab === "Custom") {
    return {
      from: null,
      to: null,
    };
  }

  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1),
    to: endOfDay(now),
  };
};

const getCustomRange = (fromDate, toDateValue) => ({
  from: fromDate ? new Date(`${fromDate}T00:00:00`) : null,
  to: toDateValue ? new Date(`${toDateValue}T23:59:59`) : null,
});

const clean = (value) => String(value ?? "").trim().toLowerCase();

const getCompletedBillIds = (details, range) =>
  new Set(
    details
      .filter((bill) => {
        if (bill.status !== "Completed") return false;

        const billDate = toDate(bill.created_at);
        if (!billDate) return false;

        const afterFrom = !range.from || billDate >= range.from;
        const beforeTo = !range.to || billDate <= range.to;
        return afterFrom && beforeTo;
      })
      .map((bill) => bill.billId),
  );

const buildReportItems = (billIds, bills) => {
  const itemMap = {};

  billIds.forEach((billId) => {
    const billItems = Array.isArray(bills[billId]) ? bills[billId] : [];

    billItems.forEach((item) => {
      const itemCode = item.itemCode || item.itemName;
      if (!itemCode) return;

      if (!itemMap[itemCode]) {
        itemMap[itemCode] = {
          itemCode,
          itemName: item.itemName || itemCode,
          sold: 0,
          total: 0,
        };
      }

      itemMap[itemCode].sold += Number(item.qty || item.itemQty || 0);
      itemMap[itemCode].total += Number(item.total || item.itemTotal || 0);
    });
  });

  return Object.values(itemMap);
};

const useSalesReport = () => {
  const { bills, details } = useSelector((state) => state.billing);
  const [draftFilter, setDraftFilter] = useState(defaultFilter);
  const [appliedFilter, setAppliedFilter] = useState(defaultFilter);

  const itemOptions = useMemo(() => {
    const allCompletedIds = getCompletedBillIds(details, {
      from: null,
      to: null,
    });
    const allItems = buildReportItems(allCompletedIds, bills);
    return [...new Set(allItems.map((item) => item.itemName).filter(Boolean))]
      .sort((first, second) => first.localeCompare(second));
  }, [bills, details]);

  const reportItems = useMemo(() => {
    const range =
      appliedFilter.fromDate || appliedFilter.toDate
        ? getCustomRange(appliedFilter.fromDate, appliedFilter.toDate)
        : getRangeForTab(appliedFilter.tab);

    const billIds = getCompletedBillIds(details, range);
    const items = buildReportItems(billIds, bills);

    if (!appliedFilter.itemName) return items;

    return items.filter(
      (item) => clean(item.itemName) === clean(appliedFilter.itemName),
    );
  }, [appliedFilter, bills, details]);

  const applyFilter = () => {
    setAppliedFilter({ ...draftFilter });
    showPopups("Filters applied successfully", true);
  };

  const resetFilter = () => {
    setDraftFilter(defaultFilter);
    setAppliedFilter(defaultFilter);
    showPopups("Filters reset", true);
  };

  const setSelectedItem = (itemName) => {
    setDraftFilter((previous) => ({
      ...previous,
      itemName,
    }));
  };

  const selectTab = (tab) => {
    setDraftFilter((previous) => ({
      ...previous,
      tab,
      fromDate: tab === "Custom" ? previous.fromDate : "",
      toDate: tab === "Custom" ? previous.toDate : "",
    }));
  };

  const changeFromDate = (value) => {
    setDraftFilter((previous) => ({
      ...previous,
      tab: "Custom",
      fromDate: value,
    }));
  };

  const changeToDate = (value) => {
    setDraftFilter((previous) => ({
      ...previous,
      tab: "Custom",
      toDate: value,
    }));
  };

  const exportReport = () => {
    const table = document.getElementById("sales-report-table");
    if (table) exportTableToExcel(table, "Sales Report");
  };

  const columns = useMemo(
    () => [
      {
        key: "itemName",
        label: "Item Name",
        sortable: true,
        width: 240,
      },
      {
        key: "sold",
        label: "Qty Sold",
        sortable: true,
        width: 140,
        render: (item) => Number(item.sold || 0),
      },
      {
        key: "total",
        label: "Total",
        sortable: true,
        width: 160,
        render: (item) => `₹ ${Number(item.total || 0).toFixed(2)}`,
      },
    ],
    [],
  );

  const actions = useMemo(
    () => [
      {
        label: "Export to Excel",
        img: "/assets/excel.png",
        tone: "plain",
        onClick: exportReport,
      },
    ],
    [],
  );

  return {
    actions,
    applyFilter,
    changeFromDate,
    changeToDate,
    columns,
    fromDate: draftFilter.fromDate,
    itemOptions,
    reportItems,
    resetFilter,
    selectedItem: draftFilter.itemName,
    selectedTab: draftFilter.tab,
    selectTab,
    setSelectedItem,
    tabs,
    toDateValue: draftFilter.toDate,
  };
};

export default useSalesReport;
