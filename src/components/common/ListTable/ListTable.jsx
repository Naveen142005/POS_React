import React, { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";
import "./listTable.css";

const getValue = (item, column) =>
  column.sortValue ? column.sortValue(item) : item[column.key];

const compare = (first, second) => {
  const firstNumber = Number(first);
  const secondNumber = Number(second);

  if (
    first !== "" &&
    second !== "" &&
    Number.isFinite(firstNumber) &&
    Number.isFinite(secondNumber)
  ) {
    return firstNumber - secondNumber;
  }

  return String(first ?? "").localeCompare(String(second ?? ""), undefined, {
    numeric: true,
    sensitivity: "base",
  });
};

const ListTable = ({
  title,
  items = [],
  columns = [],
  actions = [],
  rowKey = "id",
  tableId,
  minWidth = 800,
  itemLabel = "items",
  emptyText = "No items found",
}) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sort, setSort] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const sortedItems = useMemo(() => {
    if (!sort) return items;

    const column = columns.find((item) => item.key === sort.key);
    if (!column) return items;

    return [...items].sort((first, second) => {
      const result = compare(getValue(first, column), getValue(second, column));
      return sort.order === "asc" ? result : -result;
    });
  }, [columns, items, sort]);

  const pages = Math.max(1, Math.ceil(sortedItems.length / size));
  const safePage = Math.min(page, pages);
  const start = (safePage - 1) * size;
  const shownItems = sortedItems.slice(start, start + size);

  useEffect(() => {
    setPage(1);
  }, [items]);

  const changeSort = (column) => {
    if (!column.sortable) return;

    setSort((current) => ({
      key: column.key,
      order: current?.key === column.key && current.order === "asc" ? "desc" : "asc",
    }));
    setPage(1);
  };

  const changeSize = (nextSize) => {
    setSize(nextSize);
    setPage(1);
  };

  const getKey = (item, index) => {
    if (typeof rowKey === "function") return rowKey(item, index);
    return item[rowKey] ?? `${safePage}-${index}`;
  };

  const runAction = (action) => {
    action.onClick?.();
    setMenuOpen(false);
  };

  return (
    <section className="lst-box">
      <header className="lst-head">
        <div className="lst-info">
          <h2>{title}</h2>
          <span>
            Total {items.length} {itemLabel} found
          </span>
        </div>

        <div className="lst-actions">
          {actions.map((action) => (
            <button
              type="button"
              className={`lst-btn lst-${action.tone || "plain"}`}
              id={action.id}
              key={action.label}
              onClick={() => runAction(action)}
            >
              {action.img && <img src={action.img} alt="" />}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {actions.length > 0 && (
          <div className="lst-mobile">
            <button
              type="button"
              className="lst-dots"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Show list actions"
              aria-expanded={menuOpen}
            >
              <img src="/assets/three-dot.png" alt="" />
            </button>

            {menuOpen && (
              <div className="lst-menu">
                {actions.map((action) => (
                  <button
                    type="button"
                    key={action.label}
                    onClick={() => runAction(action)}
                  >
                    {action.img && <img src={action.img} alt="" />}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="tbl-wrap">
        <table className="lst-tbl" id={tableId} style={{ minWidth }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key} style={column.width ? { width: column.width } : undefined}>
                  <button
                    type="button"
                    className={`tbl-sort ${column.sortable ? "tbl-can-sort" : ""}`}
                    onClick={() => changeSort(column)}
                    disabled={!column.sortable}
                  >
                    <span>{column.label}</span>
                    {column.sortable && (
                      <img src="/assets/sort.png" alt="" />
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {shownItems.length > 0 ? (
              shownItems.map((item, index) => (
                <tr key={getKey(item, index)}>
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      title={column.titleValue?.(item) ?? String(item[column.key] ?? "")}
                    >
                      <div className="tbl-cell">
                        {column.render ? column.render(item) : item[column.key] ?? "-"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="tbl-empty" colSpan={columns.length}>
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={safePage}
        size={size}
        total={sortedItems.length}
        pages={pages}
        onPage={setPage}
        onSize={changeSize}
      />
    </section>
  );
};

export default ListTable;
