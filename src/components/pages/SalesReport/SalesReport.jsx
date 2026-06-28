import PageHeader from "../../common/PageHeader";
import ListTable from "../../common/ListTable/ListTable";
import useSalesReport from "./useSalesReport";

const fieldClass = "flex flex-col gap-2";
const labelClass = "text-[11px] font-bold text-[#060633] whitespace-nowrap";
const selectBoxClass =
  "relative flex h-[38px] w-full items-center rounded-md border border-[#b8b8cc] bg-white";
const inputClass =
  "h-full w-full border-0 bg-transparent pl-3 pr-8 text-[11px] font-semibold text-[rgb(4,4,122)] outline-none";

const SalesReport = () => {
  const report = useSalesReport();

  return (
    <main id="main_reg_page" className="flex flex-col gap-4">
      <PageHeader pageName="Sales Reports" />

      <section className="w-full rounded-lg bg-white px-5 py-4 shadow-[0_0_10px_rgba(0,0,0,0.073)]">
        <div className="flex w-full items-start justify-between gap-4 max-[1000px]:flex-wrap">
          <label className={`${fieldClass} w-[20%] min-w-[190px] max-[1000px]:w-full max-[1000px]:min-w-0 max-[1000px]:flex-[1_1_100%]`}>
            <span className={labelClass}>Item</span>
            <div className={selectBoxClass}>
              <select
                className={`${inputClass} cursor-pointer appearance-none bg-[url('/assets/down_arrow_blac.png')] bg-[length:10px] bg-[right_12px_center] bg-no-repeat`}
                value={report.selectedItem}
                onChange={(event) => report.setSelectedItem(event.target.value)}
              >
                <option value="">Select item</option>
                {report.itemOptions.map((itemName) => (
                  <option key={itemName} value={itemName}>
                    {itemName}
                  </option>
                ))}
              </select>
            </div>
          </label>

          <div className="flex min-w-[60%] flex-col gap-2.5 max-[1000px]:w-full max-[1000px]:min-w-0 max-[1000px]:flex-[1_1_100%]">
            <div className="flex flex-col gap-2">
              <span className={labelClass}>Reported Date</span>
              <div className="flex min-h-[36.4px] w-full items-stretch overflow-hidden rounded-md border border-[#b8b8cc] max-[560px]:flex-wrap">
                {report.tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    className={`m-0 flex-1 cursor-pointer whitespace-nowrap border-0 border-r border-[#b8b8cc] bg-white py-[9px] text-center text-[11px] font-semibold text-[#060633] last:border-r-0 max-[560px]:flex-[1_1_30%] ${
                      report.selectedTab === tab ? "bg-[#e8e8fc] text-[#2400ff]" : ""
                    }`}
                    onClick={() => report.selectTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex w-full gap-3 max-[560px]:flex-col">
              <label className={`${fieldClass} min-w-0 flex-1`}>
                <span className={labelClass}>Reported Date From</span>
                <div className={selectBoxClass}>
                  <input
                    className={`${inputClass} [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                    type="date"
                    value={report.fromDate}
                    onChange={(event) => report.changeFromDate(event.target.value)}
                  />
                  <img
                    className="pointer-events-none absolute right-3 h-3.5 w-3.5"
                    src="/assets/calendar.png"
                    alt=""
                  />
                </div>
              </label>

              <label className={`${fieldClass} min-w-0 flex-1`}>
                <span className={labelClass}>Reported Date To</span>
                <div className={selectBoxClass}>
                  <input
                    className={`${inputClass} [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0`}
                    type="date"
                    value={report.toDateValue}
                    onChange={(event) => report.changeToDate(event.target.value)}
                  />
                  <img
                    className="pointer-events-none absolute right-3 h-3.5 w-3.5"
                    src="/assets/calendar.png"
                    alt=""
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="flex flex-none items-center gap-2.5 pt-5 max-[1000px]:flex-[1_1_100%] max-[1000px]:justify-end max-[1000px]:pt-0 max-[560px]:justify-stretch">
            <button
              type="button"
              className="flex h-[38px] cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-md border-0 bg-gradient-to-r from-[#5b36ff] to-[#7705c3] px-[18px] text-[11px] font-bold text-white max-[560px]:flex-1 max-[560px]:justify-center"
              onClick={report.applyFilter}
            >
              <img className="h-3.5 w-3.5" src="/assets/filter.png" alt="" />
              Filter
            </button>
            <button
              type="button"
              className="flex h-[38px] cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-md border border-[#b8b8cc] bg-white px-[18px] text-[11px] font-bold text-[#2400ff] max-[560px]:flex-1 max-[560px]:justify-center"
              onClick={report.resetFilter}
            >
              <img className="h-3.5 w-3.5" src="/assets/reset_bacl.png" alt="" />
              Reset
            </button>
          </div>
        </div>
      </section>

      <ListTable
        title="Sales Report"
        items={report.reportItems}
        columns={report.columns}
        actions={report.actions}
        rowKey="itemCode"
        tableId="sales-report-table"
        minWidth={620}
        itemLabel="items"
        emptyText="No sales found"
      />
    </main>
  );
};

export default SalesReport;
