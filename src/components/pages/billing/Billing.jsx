import { useOutletContext } from "react-router-dom";
import { showPopups } from "../../../utils/utils";
import BillActions from "./BillActions";
import BillingHeader from "./BillingHeader";
import BillingTable from "./BillingTable";
import Calculator from "./Calculator";
import CashActions from "./CashActions";
import CategoryMenu from "./CategoryMenu";
import EmptyBill from "./EmptyBill";
import ItemsList from "./ItemsList";
import ItemsTable from "./ItemsTable";
import PriceAmendment from "./PriceAmendment";
import TransactionActions from "./TransactionActions";
import useBilling from "./hooks/useBilling";
import "./billing.css"


const Billing = () => {
  const bill = useBilling();
  const { sidebarClosed } = useOutletContext();

  return (
    <>

      <div
        className={`bill-page ${sidebarClosed ? "bill-page-sidebar-closed" : ""}`}
        id="main"
      >
        <BillingHeader
          total={bill.total}
          searchText={bill.searchText}
          onSearch={bill.setSearchText}
          viewMode={bill.viewMode}
          onViewModeChange={bill.setViewMode}
        />

        <main className="bill-content">
          <div className="bill-grid">
            <div className="bill-items">
              {bill.section === "price" && bill.billingItems.length ? (
                <PriceAmendment
                  total={bill.total}
                  gst={bill.gst}
                  payable={bill.payable}
                  tender={bill.tender}
                  change={bill.change}
                  onTenderChange={bill.setTender}
                />
              ) : bill.billingItems.length ? (
                <BillingTable
                  items={bill.billingItems}
                  inventory={bill.inventory}
                  onQuantityChange={bill.handleQuantityChange}
                  onDelete={bill.handleRemoveItem}
                />
              ) : (
                <EmptyBill />
              )}
            </div>

            <CategoryMenu
              selected={bill.selectedCategory}
              onSelect={bill.setSelectedCategory}
            />

            {bill.viewMode === "grid" ? (
              <ItemsList
                items={bill.filteredItems}
                onAdd={bill.handleAddItem}
              />
            ) : (
              <ItemsTable
                items={bill.filteredItems}
                onAdd={bill.handleAddItem}
              />
            )}

            <Calculator
              itemCode={bill.itemCode}
              quantity={bill.quantity}
              tableNo={bill.tableNo}
              covers={bill.covers}
              onItemCode={bill.setItemCode}
              onQuantity={bill.setQuantity}
              onTableNo={bill.setTableNo}
              onCovers={bill.setCovers}
              onAdd={() =>
                bill.handleAddItem(bill.itemCode.trim(), bill.quantity)
              }
            />

            <BillActions
              onNewBill={bill.handleStartNewBill}
              onPrice={bill.handleShowPrice}
              onCash={bill.handleCash}
              onGift={() => bill.showMessage("Gift voucher selected", true)}
            />

            <CashActions
              onOpenCashBox={() => bill.showMessage("Cash box opened", true)}
              onGoodsReturn={() => bill.showMessage("Goods return is ready")}
              onCancelItem={bill.handleCancelItem}
              onAddItem={() =>
                bill.handleAddItem(bill.itemCode.trim(), bill.quantity)
              }
            />

            <TransactionActions
              onTerminate={bill.handleTerminate}
              onPrint={bill.handleCompleteBill}
              onReserve={bill.handleReserveBill}
              onDeleteAll={bill.handleDeleteAll}
              onRestore={bill.handleRestore}
              onMainMenu={bill.handleMainMenu}
            />
          </div>
        </main>

        <footer className="bill-footer"></footer>
      </div>

      {bill.toast && showPopups(bill.toast.message)}
    </>
  );
};

export default Billing;
