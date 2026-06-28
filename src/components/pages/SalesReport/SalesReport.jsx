import PageHeader from "../../common/PageHeader";
import ListTable from "../../common/ListTable/ListTable";
import useSalesReport from "./useSalesReport";
import "./salesReport.css";

const SalesReport = () => {
  const report = useSalesReport();

  return (
    <main id="main_reg_page" className="sales-report-page">
      <PageHeader pageName="Sales Reports" />

      <section className="sales-filter-card">
        <div className="sales-filter-top-row">
          <label className="sales-field">
            <span>Item</span>
            <div className="sales-select-box">
              <select
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

          <div className="sales-date-group">
            <div className="sales-date-top">
              <span>Reported Date</span>
              <div className="sales-report-date-box">
                {report.tabs.map((tab) => (
                  <button
                    type="button"
                    key={tab}
                    className={`sales-date-tab ${
                      report.selectedTab === tab ? "sales-date-tab-active" : ""
                    }`}
                    onClick={() => report.selectTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="sales-date-bottom">
              <label className="sales-field">
                <span>Reported Date From</span>
                <div className="sales-select-box sales-date-box">
                  <input
                    type="date"
                    value={report.fromDate}
                    onChange={(event) => report.changeFromDate(event.target.value)}
                  />
                  <img src="/assets/calendar.png" alt="" />
                </div>
              </label>

              <label className="sales-field">
                <span>Reported Date To</span>
                <div className="sales-select-box sales-date-box">
                  <input
                    type="date"
                    value={report.toDateValue}
                    onChange={(event) => report.changeToDate(event.target.value)}
                  />
                  <img src="/assets/calendar.png" alt="" />
                </div>
              </label>
            </div>
          </div>

          <div className="sales-filter-actions">
            <button type="button" className="sales-apply" onClick={report.applyFilter}>
              <img src="/assets/filter.png" alt="" />
              Filter
            </button>
            <button type="button" className="sales-reset" onClick={report.resetFilter}>
              <img src="/assets/reset_bacl.png" alt="" />
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
