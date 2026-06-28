import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ListTable from "../../common/ListTable/ListTable";
import PageHeader from "../../common/PageHeader";
import FilterComp from "../../common/filter/Filter";
import { exportTableToExcel } from "../../../utils/utils";
import "./inventory.css";

const cleanText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const toTime = (value, endOfDay = false) => {
  if (!value) return null;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(
        `${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`,
      )
    : new Date(value);

  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

const getStatus = (item) => {
  const stock = Number(item.inStock || 0);

  if (stock <= 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";

  return "In Stock";
};

const Inventory = () => {
  const navigate = useNavigate();

  const items = useSelector((state) => state.inventory.items);
  const [shownItems, setShownItems] = useState(items);

  useEffect(() => {
    setShownItems(items);
  }, [items]);

  const categories = [
    ...new Set(
      items.map((item) => item.category).filter(Boolean),
    ),
  ];

  const itemNames = [
    ...new Set(
      items.map((item) => item.itemName).filter(Boolean),
    ),
  ];

  const filters = [
    {
      title: "Category",
      name: "category",
      isSelect: true,
      img: "/assets/windo_black.png",
      placeholder: "All Categories",
      options: categories,
    },
    {
      title: "Item Name",
      name: "itemName",
      isSelect: true,
      img: "/assets/coffee_blue.png",
      placeholder: "All Items",
      options: itemNames,
    },
    {
      title: "Status",
      name: "status",
      isSelect: true,
      img: null,
      placeholder: "All Status",
      options: ["In Stock", "Low Stock", "Out of Stock"],
    },
    {
      title: "Date From",
      name: "dateFrom",
      isSelect: false,
      img: "/assets/calendar_blue.png",
    },
    {
      title: "Date To",
      name: "dateTo",
      isSelect: false,
      img: "/assets/calendar_blue.png",
    },
  ];

  const applyFilter = (selected) => {
    const from = toTime(selected.dateFrom);
    const to = toTime(selected.dateTo, true);

    const filtered = items.filter((item) => {
      const updatedDate = toTime(item.update_at);

      const sameCategory =
        !selected.category ||
        cleanText(item.category) ===
          cleanText(selected.category);

      const sameItem =
        !selected.itemName ||
        cleanText(item.itemName) ===
          cleanText(selected.itemName);

      const sameStatus =
        !selected.status ||
        cleanText(getStatus(item)) ===
          cleanText(selected.status);

      const afterFrom =
        from === null ||
        (updatedDate !== null && updatedDate >= from);

      const beforeTo =
        to === null ||
        (updatedDate !== null && updatedDate <= to);

      return (
        sameCategory &&
        sameItem &&
        sameStatus &&
        afterFrom &&
        beforeTo
      );
    });

    setShownItems(filtered);
  };

  const resetFilter = () => {
    setShownItems(items);
  };

  const exportItems = () => {
    const table = document.getElementById("inventory-table");

    if (table) {
      exportTableToExcel(table, "Inventory Table");
    }
  };

  const columns = [
    {
      key: "itemCode",
      label: "Item Code",
      width: 105,
      sortable: true,
    },
    {
      key: "itemName",
      label: "Item Name",
      width: 150,
      sortable: true,
      render: (item) => (
        <div className="tbl-item">
          {item.itemImage && (
            <img
              className="tbl-img"
              src={item.itemImage}
              alt=""
            />
          )}

          <span>{item.itemName || "-"}</span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Category",
      width: 120,
      sortable: true,
    },
    {
      key: "sellingPrice",
      label: "Price",
      width: 80,
      sortable: true,
      render: (item) =>
        `$${Number(item.sellingPrice || 0)}`,
      sortValue: (item) =>
        Number(item.sellingPrice || 0),
    },
    {
      key: "unit",
      label: "Unit",
      width: 80,
      sortable: true,
    },
    {
      key: "purchased",
      label: "Purchased",
      width: 95,
      sortable: true,
    },
    {
      key: "sold",
      label: "Sold",
      width: 70,
      sortable: true,
    },
    {
      key: "inStock",
      label: "In Stock",
      width: 85,
      sortable: true,
      render: (item) => {
        const stock = Number(item.inStock || 0);

        const className =
          stock <= 0
            ? "tbl-stock-empty"
            : stock <= 10
              ? "tbl-stock-warn"
              : "tbl-stock-ok";

        return (
          <span className={className}>{stock}</span>
        );
      },
      sortValue: (item) => Number(item.inStock || 0),
    },
    {
      key: "status",
      label: "Status",
      width: 105,
      sortable: true,
      render: (item) => {
        const status = getStatus(item);

        const className =
          status === "Out of Stock"
            ? "tbl-state-empty"
            : status === "Low Stock"
              ? "tbl-state-warn"
              : "tbl-state-ok";

        return (
          <span className={`tbl-state ${className}`}>
            {status}
          </span>
        );
      },
      sortValue: getStatus,
    },
    {
      key: "update_at",
      label: "Last Updated",
      width: 150,
      sortable: true,
      render: (item) => item.update_at || "-",
      sortValue: (item) =>
        toTime(item.update_at) || 0,
    },
    {
      key: "action",
      label: "Action",
      width: 75,
      render: (item) => (
        <button
          type="button"
          className="tbl-edit"
          onClick={() =>
            navigate(
              `/inventory/edit/${encodeURIComponent(
                item.itemCode,
              )}`,
            )
          }
        >
          Edit
        </button>
      ),
    },
  ];

  const actions = [
    {
      label: "Add Item",
      img: "/assets/add.png",
      tone: "soft",
      id: "add-item-btn",
      onClick: () => navigate("/inventory/add"),
    },
    {
      label: "Request Item",
      img: "/assets/download.png",
      tone: "primary",
      id: "req-item-btn",
      onClick: () => navigate("/item_request_add"),
    },
    {
      label: "Export to Excel",
      img: "/assets/excel.png",
      tone: "plain",
      id: "export-btn",
      onClick: exportItems,
    },
  ];

  return (
    <div>
      <main className="inv-main">
        <PageHeader pageName="Inventory" />

        <FilterComp
          filters={filters}
          onFilter={applyFilter}
          onReset={resetFilter}
        />

        <ListTable
          title="Inventory List"
          items={shownItems}
          columns={columns}
          actions={actions}
          rowKey="itemCode"
          tableId="inventory-table"
          minWidth={1100}
        />
      </main>
    </div>
  );
};

export default Inventory;
