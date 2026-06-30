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

const Billing = () => {
  const bill = useBilling();
  const { sidebarClosed } = useOutletContext();

  return (
    <>
      <div
        className={`bill-page relative z-[1] min-h-[100dvh] transition-all duration-300 ease-in-out max-[768px]:ml-0 max-[768px]:w-full min-[1201px]:h-screen min-[1201px]:overflow-hidden ${
          sidebarClosed ? "ml-0 w-full" : "ml-[200px] w-[calc(100%-200px)]"
        }`}
        id="main"
      >
        <BillingHeader
          total={bill.total}
          searchText={bill.searchText}
          onSearch={bill.setSearchText}
          viewMode={bill.viewMode}
          onViewModeChange={bill.setViewMode}
        />

        <main className="bill-content relative z-[1] grid h-[calc(100vh-64px)] w-full place-items-center p-4 max-[768px]:h-auto max-[768px]:min-h-[calc(100dvh-64px)] max-[768px]:overflow-y-auto min-[1201px]:h-[calc(100vh-64px)] min-[1201px]:overflow-hidden">
          <div className="bill-grid grid h-full w-full grid-cols-[45fr_12fr_5fr_38fr] grid-rows-[45fr_30fr_12fr] gap-[14px] [grid-template-areas:'items-add_items-menu_items-list-box_items-list-box'_'calc-box_items-menu_items-list-box_items-list-box'_'bill-actions_cash-actions_cash-actions_transaction-actions'] max-[1200px]:grid-cols-[3fr_1fr_1fr_2fr] max-[1200px]:grid-rows-[400px_0.1fr_0.2fr_0.5fr_0.5fr] max-[1200px]:[grid-template-areas:'items-add_items-add_items-add_items-add'_'items-menu_items-menu_items-menu_items-menu'_'items-list-box_items-list-box_items-list-box_items-list-box'_'calc-box_bill-actions_bill-actions_bill-actions'_'calc-box_cash-actions_transaction-actions_transaction-actions'] max-[1037px]:grid-cols-[1fr_1fr_1fr] max-[1037px]:grid-rows-[400px_auto_auto_auto_auto_auto] max-[1037px]:[grid-template-areas:'items-add_items-add_items-add'_'items-menu_items-menu_items-menu'_'items-list-box_items-list-box_items-list-box'_'calc-box_calc-box_calc-box'_'bill-actions_bill-actions_bill-actions'_'cash-actions_transaction-actions_transaction-actions'] max-[600px]:h-auto max-[600px]:grid-cols-[1fr] max-[600px]:grid-rows-[350px_auto_auto_auto_90px_90px_90px] max-[600px]:gap-3 max-[600px]:[grid-template-areas:'items-add'_'items-menu'_'items-list-box'_'calc-box'_'bill-actions'_'cash-actions'_'transaction-actions'] min-[1201px]:h-full min-[1201px]:min-h-0 min-[1201px]:grid-rows-[42fr_34fr_12fr] min-[1201px]:[&>*]:min-h-0 min-[1201px]:[&>*]:overflow-hidden">
            <div className="bill-items relative z-[1] flex max-h-[480px] flex-col overflow-hidden rounded-xl bg-white p-[22px] shadow-[0_8px_24px_rgba(17,24,39,0.04)] [grid-area:items-add] max-[600px]:overflow-x-auto max-[600px]:p-3 min-[1201px]:max-h-none min-[1201px]:!overflow-y-scroll">
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

        <footer className="bill-footer relative z-[1]"></footer>
      </div>

      {bill.toast && showPopups(bill.toast.message)}
    </>
  );
};

export default Billing;
