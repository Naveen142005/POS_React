import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import FilterComp from "../../common/filter/Filter";
import ListTable from "../../common/ListTable/ListTable";
import {
  showPopups,
  exportTableToExcel,
} from "../../../utils/utils";
import "./itemrequest.css";

const cleanText = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const toTime = (value, endOfDay = false) => {
  if (!value) return null;

  const date = /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? new Date(`${value}T${endOfDay ? "23:59:59.999" : "00:00:00"}`)
    : new Date(value);

  const time = date.getTime();
  return Number.isNaN(time) ? null : time;
};

export const ItemRequest = () => {
  const navigate = useNavigate();

  const allRequests = useSelector((state) => state.requests.items);
  const [shownRequests, setShownRequests] = useState([]);

  useEffect(() => {
    setShownRequests(allRequests);
  }, [allRequests]);

  const requestIds = useMemo(
    () => [...new Set(allRequests.map((item) => item.reqId).filter(Boolean))],
    [allRequests],
  );

  const requestedByList = useMemo(
    () => [
      ...new Set(
        allRequests.map((item) => item.requested_by).filter(Boolean),
      ),
    ],
    [allRequests],
  );

  const subjectList = useMemo(
    () => [
      ...new Set(allRequests.map((item) => item.subject).filter(Boolean)),
    ],
    [allRequests],
  );

  const filters = [
    {
      title: "Request ID",
      name: "reqId",
      isSelect: true,
      placeholder: "Select request ID",
      options: requestIds,
      img: null,
    },
    {
      title: "Subject",
      name: "subject",
      isSelect: true,
      placeholder: "Select subject",
      options: subjectList,
      img: null,
    },
    {
      title: "Requested By",
      name: "requested_by",
      isSelect: true,
      placeholder: "Select requested by",
      options: requestedByList,
      img: null,
    },
    {
      title: "Requested Date From",
      name: "dateFrom",
      isSelect: false,
      img: "/assets/calendar_blue.png",
    },
    {
      title: "Requested Date To",
      name: "dateTo",
      isSelect: false,
      img: "/assets/calendar_blue.png",
    },
  ];

  const applyFilter = (selected) => {
    const from = toTime(selected.dateFrom);
    const to = toTime(selected.dateTo, true);

    const filtered = allRequests.filter((item) => {
      const itemDate = toTime(item.requested_date);

      const sameId =
        !selected.reqId ||
        cleanText(item.reqId) === cleanText(selected.reqId);

      const sameSubject =
        !selected.subject ||
        cleanText(item.subject) === cleanText(selected.subject);

      const sameRequestedBy =
        !selected.requested_by ||
        cleanText(item.requested_by) === cleanText(selected.requested_by);

      const afterFrom =
        from === null || (itemDate !== null && itemDate >= from);

      const beforeTo =
        to === null || (itemDate !== null && itemDate <= to);

      return (
        sameId &&
        sameSubject &&
        sameRequestedBy &&
        afterFrom &&
        beforeTo
      );
    });

    setShownRequests(filtered);
  };

  const handleFilter = (filterData) => {
    applyFilter(filterData);
    showPopups("Filters applied successfully", true);
  };

  const handleReset = () => {
    setShownRequests(allRequests);
    showPopups("Filters reset", true);
  };

  const exportRequests = () => {
    const table = document.getElementById("item-request-table");

    if (table) {
      exportTableToExcel(table, "Item Request List");
    }
  };

  const columns = useMemo(
    () => [
      {
        key: "reqId",
        label: "Request ID",
        width: 120,
        sortable: true,
      },
      {
        key: "subject",
        label: "Subject",
        width: 180,
        sortable: true,
      },
      {
        key: "requested_by",
        label: "Requested By",
        width: 130,
        sortable: true,
      },
      {
        key: "requested_date",
        label: "Requested Date",
        width: 170,
        sortable: true,
        sortValue: (item) => toTime(item.requested_date) ?? 0,
      },
      {
        key: "expecting_delivery",
        label: "Expecting Delivery",
        width: 160,
        sortable: true,
      },
      {
        key: "status",
        label: "Status",
        width: 110,
        sortable: true,
        render: (item) => {
          const status = item.status || "Pending";

          const statusClass =
            status === "Received"
              ? "tbl-status-received"
              : status === "Pending"
                ? "tbl-status-pending"
                : "tbl-status-cancelled";

          return (
            <span className={`tbl-status ${statusClass}`}>
              {status}
            </span>
          );
        },
      },
      {
        key: "action",
        label: "Action",
        width: 80,
        render: (item) => (
          <button
            type="button"
            className="tbl-action-btn"
            onClick={() =>
              navigate(
                `/item_request_edit/${encodeURIComponent(item.reqId)}`,
              )
            }
            title="View Request"
          >
            <img src="/assets/eye.png" alt="View" />
          </button>
        ),
      },
    ],
    [navigate],
  );

  const actions = [
    {
      label: "New Item Request",
      img: "/assets/add.png",
      tone: "primary",
      id: "add-request-btn",
      onClick: () => navigate("/item_request_add"),
    },
    {
      label: "Export to Excel",
      img: "/assets/excel.png",
      tone: "plain",
      id: "export-request-btn",
      onClick: exportRequests,
    },
  ];

  return (
    <div>
      <main id="main_reg_page">
        <PageHeader pageName="Item Request" />

        <FilterComp
          filters={filters}
          onFilter={handleFilter}
          onReset={handleReset}
        />

        <ListTable
          title="Inventory Request List"
          items={shownRequests}
          columns={columns}
          actions={actions}
          rowKey="reqId"
          tableId="item-request-table"
          minWidth={1000}
          itemLabel="items"
          emptyText="No item requests found"
        />
      </main>
    </div>
  );
};
