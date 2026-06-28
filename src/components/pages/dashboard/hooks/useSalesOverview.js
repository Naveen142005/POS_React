import { useMemo, useState } from "react";

export const graphTypes = [
  "Daily",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "This Year",
];

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

const addDays = (date, count) => {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
};

const getWeekStart = (date, offset = 0) => {
  const next = startOfDay(date);
  next.setDate(next.getDate() - next.getDay() + offset);
  return next;
};

const getMonthStart = (date, offset = 0) => {
  const next = new Date(date.getFullYear(), date.getMonth() + offset, 1);
  return startOfDay(next);
};

const getMonthEnd = (date, offset = 0) =>
  endOfDay(new Date(date.getFullYear(), date.getMonth() + offset + 1, 0));

const formatLabel = (date) =>
  `${date.getDate()} ${date.toLocaleString("en-US", { month: "short" })}`;

const getBillTotal = (bills, billId) =>
  (Array.isArray(bills[billId]) ? bills[billId] : []).reduce(
    (sum, item) => sum + Number(item.total || 0),
    0,
  );

const getRangeTotal = (bills, details, from, to) =>
  details.reduce((sum, bill) => {
    if (bill.status !== "Completed") return sum;
    const billDate = new Date(bill.created_at);
    if (Number.isNaN(billDate.getTime()) || billDate < from || billDate > to) {
      return sum;
    }
    return sum + getBillTotal(bills, bill.billId);
  }, 0);

const getWeekSeries = (bills, details, startDate) => {
  const labels = [];
  const values = [];

  for (let index = 0; index < 7; index += 1) {
    const day = addDays(startDate, index);
    labels.push(formatLabel(day));
    values.push(getRangeTotal(bills, details, startOfDay(day), endOfDay(day)));
  }

  return { labels, values };
};

const getMonthSeries = (bills, details, date) => {
  const labels = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const values = [0, 0, 0, 0];
  const from = getMonthStart(date);
  const to = getMonthEnd(date);

  details.forEach((bill) => {
    if (bill.status !== "Completed") return;
    const billDate = new Date(bill.created_at);
    if (Number.isNaN(billDate.getTime()) || billDate < from || billDate > to) {
      return;
    }
    const weekIndex = Math.min(3, Math.floor((billDate.getDate() - 1) / 7));
    values[weekIndex] += getBillTotal(bills, bill.billId);
  });

  return { labels, values };
};

const getYearSeries = (bills, details, date) => {
  const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const values = Array(12).fill(0);
  const from = startOfDay(new Date(date.getFullYear(), 0, 1));
  const to = endOfDay(new Date(date.getFullYear(), 11, 31));

  details.forEach((bill) => {
    if (bill.status !== "Completed") return;
    const billDate = new Date(bill.created_at);
    if (Number.isNaN(billDate.getTime()) || billDate < from || billDate > to) {
      return;
    }
    values[billDate.getMonth()] += getBillTotal(bills, bill.billId);
  });

  return { labels, values };
};

const getGraphPayload = (bills, details, type) => {
  const today = new Date();

  if (type === "Daily") {
    const thisWeekStart = getWeekStart(today);
    const lastWeekStart = addDays(thisWeekStart, -7);
    const current = getWeekSeries(bills, details, thisWeekStart);
    const previous = getWeekSeries(bills, details, lastWeekStart);
    return {
      labels: current.labels,
      values: current.values,
      previousValues: previous.values,
      footerLeftLabel: "This Week Sales",
      footerRightLabel: "Last Week Sales",
    };
  }

  if (type === "This Week") {
    const current = getWeekSeries(bills, details, getWeekStart(today));
    return {
      labels: current.labels,
      values: current.values,
      previousValues: [],
      footerLeftLabel: "This Week Sales",
      footerRightLabel: "Last Week Sales",
    };
  }

  if (type === "Last Week") {
    const current = getWeekSeries(bills, details, addDays(getWeekStart(today), -7));
    return {
      labels: current.labels,
      values: current.values,
      previousValues: [],
      footerLeftLabel: "Last Week Sales",
      footerRightLabel: "This Week Sales",
    };
  }

  if (type === "This Month") {
    const current = getMonthSeries(bills, details, today);
    const previous = getMonthSeries(bills, details, getMonthStart(today, -1));
    return {
      labels: current.labels,
      values: current.values,
      previousValues: previous.values,
      footerLeftLabel: "This Month Sales",
      footerRightLabel: "Last Month Sales",
    };
  }

  if (type === "Last Month") {
    const current = getMonthSeries(bills, details, getMonthStart(today, -1));
    return {
      labels: current.labels,
      values: current.values,
      previousValues: [],
      footerLeftLabel: "Last Month Sales",
      footerRightLabel: "This Month Sales",
    };
  }

  const current = getYearSeries(bills, details, today);
  return {
    labels: current.labels,
    values: current.values,
    previousValues: [],
    footerLeftLabel: "This Year Sales",
    footerRightLabel: "Last Week Sales",
  };
};

const useSalesOverview = (bills, details) => {
  const [selectedType, setSelectedType] = useState("Daily");
  const [menuOpen, setMenuOpen] = useState(false);

  const graph = useMemo(
    () => getGraphPayload(bills, details, selectedType),
    [bills, details, selectedType],
  );

  const currentTotal = graph.values.reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const previousTotal = graph.previousValues.reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
  const profitPercent =
    previousTotal > 0
      ? (((currentTotal - previousTotal) / previousTotal) * 100).toFixed(1)
      : currentTotal > 0
        ? "100.0"
        : "0.0";

  const selectType = (type) => {
    setSelectedType(type);
    setMenuOpen(false);
  };

  return {
    currentTotal,
    graph,
    graphTypes,
    menuOpen,
    previousTotal,
    profitPercent,
    selectType,
    selectedType,
    setMenuOpen,
  };
};

export default useSalesOverview;
