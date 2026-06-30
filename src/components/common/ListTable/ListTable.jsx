import React, { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

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

const actionButtonBase =
  "flex min-h-10 border border-[#ddd9ff] rounded-[7px] bg-white shadow-[0_0_10px_rgb(0_0_0_/_7%)] items-center justify-center flex-[1_1_100px] gap-2.5 cursor-pointer text-xs font-semibold";

const actionButtonTone = {
  soft: "border-[#ddd9ff] bg-[#f3f1ff] text-[#2400ff]",
  primary: "!border-0 bg-[linear-gradient(90deg,#5b36ff,#7705c3)] text-white",
  plain: "text-[#02024b]",
};

const getActionClassName = (tone = "plain") =>
  `${actionButtonBase} ${actionButtonTone[tone] || actionButtonTone.plain}`;

const cellBaseClassName =
  "h-[45px] px-[14px] py-0 overflow-hidden text-[#02024b] text-[10px] font-bold text-center align-middle whitespace-nowrap";

const headerCellBaseClassName =
  "h-[45px] px-[14px] py-0 overflow-hidden bg-[#f4f2ff] text-[#2400ff] text-[11px] font-extrabold text-center align-middle whitespace-nowrap";

const sortButtonBaseClassName =
  "flex w-full min-w-0 overflow-hidden border-0 p-0 bg-transparent text-inherit cursor-default [font:inherit] [font-weight:inherit] text-inherit whitespace-nowrap items-center justify-center gap-[5px] disabled:opacity-100";

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
    <section className="flex w-full p-3 rounded-lg bg-white shadow-[0_0_10px_rgb(0_0_0_/_7%)] flex-col gap-3">
      <header className="flex w-full px-3 py-0 items-center justify-between max-[860px]:items-start max-[860px]:flex-col max-[860px]:gap-3 max-[550px]:relative max-[550px]:p-0">
        <div>
          <h2 className="text-[#08081f] text-sm font-bold">{title}</h2>
          <span className="text-[#0707c8ca] text-[10px] font-semibold">
            Total {items.length} {itemLabel} found
          </span>
        </div>

        <div className="flex w-[450px] gap-3 max-[860px]:w-[min(450px,100%)] max-[860px]:self-end max-[550px]:hidden">
          {actions.map((action) => (
            <button
              type="button"
              className={getActionClassName(action.tone)}
              id={action.id}
              key={action.label}
              onClick={() => runAction(action)}
            >
              {action.img && (
                <img
                  className="w-5 h-5 object-contain"
                  src={action.img}
                  alt=""
                />
              )}
              <span>{action.label}</span>
            </button>
          ))}
        </div>

        {actions.length > 0 && (
          <div className="relative hidden max-[550px]:absolute max-[550px]:top-0 max-[550px]:right-0 max-[550px]:block">
            <button
              type="button"
              className="grid w-[38px] h-[38px] border border-[#ddd9ff] rounded-md bg-white cursor-pointer place-items-center"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Show list actions"
              aria-expanded={menuOpen}
            >
              <img
                className="w-4 h-4 object-contain"
                src="/assets/three-dot.png"
                alt=""
              />
            </button>

            {menuOpen && (
              <div className="absolute top-11 right-0 z-20 flex w-[180px] p-2 border border-[#ebe8ff] rounded-[7px] bg-white shadow-[0_8px_24px_rgb(0_0_0_/_12%)] flex-col gap-1.5">
                {actions.map((action) => (
                  <button
                    type="button"
                    className="flex min-h-9 px-[9px] py-[7px] border-0 rounded-[5px] bg-white items-center gap-2 text-[#02024b] cursor-pointer text-[11px] font-bold hover:bg-[#f3f1ff]"
                    key={action.label}
                    onClick={() => runAction(action)}
                  >
                    {action.img && (
                      <img
                        className="w-[17px] h-[17px] object-contain"
                        src={action.img}
                        alt=""
                      />
                    )}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="w-full overflow-x-auto border border-[#ebe8ff] rounded-lg bg-white shadow-[0_0_10px_rgb(0_0_0_/_7%)]">
        <table
          className="w-full border-collapse table-fixed"
          id={tableId}
          style={{ minWidth }}
        >
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  className={`${headerCellBaseClassName} ${index === 0 ? "!text-left" : ""}`}
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                >
                  <button
                    type="button"
                    className={`${sortButtonBaseClassName} ${column.sortable ? "cursor-pointer" : ""} ${index === 0 ? "!justify-start" : ""}`}
                    onClick={() => changeSort(column)}
                    disabled={!column.sortable}
                  >
                    <span className="min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                      {column.label}
                    </span>
                    {column.sortable && (
                      <img
                        className="w-2 h-2 ml-0 shrink-0 align-middle"
                        src="/assets/sort.png"
                        alt=""
                      />
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
                  {columns.map((column, columnIndex) => (
                    <td
                      className={`${cellBaseClassName} border-t border-[#eeeafc] ${columnIndex === 0 ? "!text-left" : ""}`}
                      key={column.key}
                      title={column.titleValue?.(item) ?? String(item[column.key] ?? "")}
                    >
                      <div className="block w-full min-w-0 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                        {column.render ? column.render(item) : item[column.key] ?? "-"}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className={`${cellBaseClassName} !h-[100px] !text-[#77778c] !text-center`}
                  colSpan={columns.length}
                >
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
