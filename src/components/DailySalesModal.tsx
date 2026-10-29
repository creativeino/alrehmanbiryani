import React, { useState } from 'react';
import { Order } from '@/data/menu';
import {
  X,
  Printer,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  CreditCard,
  Banknote,
  Bike,
  Armchair,
  Package,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DailySalesModalProps {
  orders: Order[];
  onClose: () => void;
  currentDateStr: string;
}

type RollWidth = '80mm' | '58mm';

export const DailySalesModal: React.FC<DailySalesModalProps> = ({
  orders,
  onClose,
  currentDateStr
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(currentDateStr);
  const [printerWidth, setPrinterWidth] = useState<RollWidth>('80mm');

  // Filter completed orders for the selected date
  const dayOrders = orders.filter((o) => {
    return o.status === 'Completed' && (selectedDate === 'All' || o.date === selectedDate);
  });

  const cancelledOrders = orders.filter(
    (o) => o.status === 'Cancelled' && (selectedDate === 'All' || o.date === selectedDate)
  );

  // Available unique dates in the system
  const availableDates = Array.from(new Set(orders.map((o) => o.date))).filter(Boolean);
  if (!availableDates.includes(currentDateStr)) {
    availableDates.unshift(currentDateStr);
  }

  // Key Financial Metrics
  const totalRevenue = dayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalFoodSubtotal = dayOrders.reduce((sum, o) => sum + o.subtotal, 0);
  const totalDeliveryCharges = dayOrders.reduce((sum, o) => sum + (o.deliveryCharge || 0), 0);
  const totalOrdersCount = dayOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Breakdown by Payment Method
  const cashSales = dayOrders
    .filter((o) => o.paymentMethod === 'Cash')
    .reduce((sum, o) => sum + o.total, 0);
  const easypaisaSales = dayOrders
    .filter((o) => o.paymentMethod === 'EasyPaisa')
    .reduce((sum, o) => sum + o.total, 0);
  const jazzcashSales = dayOrders
    .filter((o) => o.paymentMethod === 'JazzCash')
    .reduce((sum, o) => sum + o.total, 0);
  const onlineSales = easypaisaSales + jazzcashSales;

  // Breakdown by Order Type
  const dineInOrders = dayOrders.filter((o) => o.orderType === 'Dine-In');
  const takeawayOrders = dayOrders.filter((o) => o.orderType === 'Takeaway');
  const deliveryOrders = dayOrders.filter((o) => o.orderType === 'Delivery');

  const dineInRevenue = dineInOrders.reduce((sum, o) => sum + o.total, 0);
  const takeawayRevenue = takeawayOrders.reduce((sum, o) => sum + o.total, 0);
  const deliveryRevenue = deliveryOrders.reduce((sum, o) => sum + o.total, 0);

  // Top Selling Items Aggregation
  const itemQuantities: { [name: string]: { qty: number; revenue: number; variant: string } } = {};
  dayOrders.forEach((o) => {
    o.items.forEach((item) => {
      const key = `${item.item.name} (${item.item.variant})`;
      if (!itemQuantities[key]) {
        itemQuantities[key] = { qty: 0, revenue: 0, variant: item.item.variant };
      }
      itemQuantities[key].qty += item.quantity;
      itemQuantities[key].revenue += item.quantity * item.item.price;
    });
  });

  const sortedTopItems = Object.entries(itemQuantities)
    .sort((a, b) => b[1].qty - a[1].qty)
    .slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  const is58 = printerWidth === '58mm';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[96dvh] sm:max-h-[92vh] print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-auto"
      >
        
        {/* Top Header Bar (Hidden in print) */}
        <div className="bg-slate-900 text-white p-3 sm:p-4 flex justify-between items-center print:hidden shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base leading-tight truncate">Daily Sales &amp; Register Report</h3>
              <p className="text-[10px] sm:text-xs text-slate-400 truncate">Day-end settlement &amp; revenue audit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close sales report modal"
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Filter & Printer Roll Controls Bar (Hidden in print) */}
        <div className="bg-slate-100 p-2 sm:p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 sm:gap-3 print:hidden shrink-0">
          {/* Date Picker Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-semibold">
            <span className="text-slate-600 flex items-center gap-1 shrink-0">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Date:</span>
            </span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 sm:px-2.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {date} {date === currentDateStr ? '(Today)' : ''}
                </option>
              ))}
              <option value="All">All Time</option>
            </select>
          </div>

          {/* Roll Switcher & Print Action */}
          <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500">Roll:</span>
            <div className="flex bg-slate-200/80 p-0.5 rounded-md">
              <button
                onClick={() => setPrinterWidth('80mm')}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
                  printerWidth === '80mm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                80mm
              </button>
              <button
                onClick={() => setPrinterWidth('58mm')}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
                  printerWidth === '58mm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                58mm
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="py-1 sm:py-1.5 px-2.5 sm:px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] sm:text-xs rounded-lg flex items-center gap-1 cursor-pointer shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-50 print:p-0 print:bg-white print:overflow-visible">
          
          {/* Visual Cards Dashboard (Hidden during print) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 print:hidden">
            {/* Total Sales */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                Rs. {totalRevenue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {totalOrdersCount} Completed Orders
              </div>
            </div>

            {/* Cash in Drawer */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Cash Drawer</span>
                <Banknote className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-black text-amber-600 font-mono">
                Rs. {cashSales.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Physical Cash Collected
              </div>
            </div>

            {/* Online / Wallet */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Online &amp; Wallets</span>
                <CreditCard className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-black text-blue-600 font-mono">
                Rs. {onlineSales.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                JazzCash / EasyPaisa
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-semibold">Avg Ticket</span>
                <ShoppingBag className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-xl font-black text-slate-900 font-mono">
                Rs. {avgOrderValue.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Per Order Average
              </div>
            </div>
          </div>

          {/* Visual Order Type Breakdown (Hidden in print) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 print:hidden">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Armchair className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Dine-In</div>
                  <div className="text-[11px] text-slate-400">{dineInOrders.length} Orders</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-slate-900">
                  Rs. {dineInRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Takeaway</div>
                  <div className="text-[11px] text-slate-400">{takeawayOrders.length} Orders</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-slate-900">
                  Rs. {takeawayRevenue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                  <Bike className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Delivery</div>
                  <div className="text-[11px] text-slate-400">{deliveryOrders.length} Orders</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-black font-mono text-slate-900">
                  Rs. {deliveryRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* =========================================================================
              Thermal Slip Layout (Visible in Print & Previewed in Center)
              ========================================================================= */}
          <div className="flex justify-center">
            <div
              className={`thermal-slip bg-white p-4 rounded-xl border border-slate-300 shadow-sm font-mono text-black select-text print:shadow-none print:border-none print:p-0 ${
                is58 ? 'w-[260px]' : 'w-[320px]'
              } print:w-full`}
            >
              {/* Slip Header */}
              <div className="text-center pb-2 border-b-2 border-dashed border-black">
                <div className="flex justify-center mb-1">
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="h-10 w-auto object-contain grayscale contrast-200"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="text-sm font-black uppercase tracking-wider">
                  AL. REHMAN BIRYANI
                </div>
                <div className="text-[10px] font-bold">&amp; PAKWAN CENTRE</div>
                <div className="text-[11px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 mt-1 inline-block">
                  *** DAILY SALES SUMMARY ***
                </div>
              </div>

              {/* Timestamp & Report Metadata */}
              <div className="py-2 border-b-2 border-dashed border-black space-y-0.5 text-[10px]">
                <div className="flex justify-between font-bold">
                  <span>Report Date:</span>
                  <span>{selectedDate}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Generated At:</span>
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total Completed Orders:</span>
                  <span>{totalOrdersCount}</span>
                </div>
                {cancelledOrders.length > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Cancelled Orders:</span>
                    <span>{cancelledOrders.length}</span>
                  </div>
                )}
              </div>

              {/* Sales Revenue Breakdown */}
              <div className="py-2 border-b-2 border-dashed border-black space-y-1 text-[10px]">
                <div className="font-black text-[11px] uppercase border-b border-black pb-0.5">
                  1. REVENUE SETTLEMENT
                </div>
                <div className="flex justify-between">
                  <span>Food Sales Subtotal:</span>
                  <span className="font-mono">Rs. {totalFoodSubtotal}</span>
                </div>
                {totalDeliveryCharges > 0 && (
                  <div className="flex justify-between">
                    <span>Rider Delivery Fees:</span>
                    <span className="font-mono">Rs. {totalDeliveryCharges}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
                  <span>TOTAL SALES REVENUE:</span>
                  <span className="font-mono text-sm">Rs. {totalRevenue}</span>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="py-2 border-b-2 border-dashed border-black space-y-1 text-[10px]">
                <div className="font-black text-[11px] uppercase border-b border-black pb-0.5">
                  2. PAYMENT BREAKDOWN
                </div>
                <div className="flex justify-between font-bold">
                  <span>CASH IN DRAWER:</span>
                  <span className="font-mono">Rs. {cashSales}</span>
                </div>
                <div className="flex justify-between">
                  <span>EasyPaisa Wallet:</span>
                  <span className="font-mono">Rs. {easypaisaSales}</span>
                </div>
                <div className="flex justify-between">
                  <span>JazzCash Wallet:</span>
                  <span className="font-mono">Rs. {jazzcashSales}</span>
                </div>
                <div className="flex justify-between font-black border-t border-dashed border-black pt-0.5">
                  <span>TOTAL ONLINE / WALLET:</span>
                  <span className="font-mono">Rs. {onlineSales}</span>
                </div>
              </div>

              {/* Order Channels Breakdown */}
              <div className="py-2 border-b-2 border-dashed border-black space-y-1 text-[10px]">
                <div className="font-black text-[11px] uppercase border-b border-black pb-0.5">
                  3. CHANNELS SUMMARY
                </div>
                <div className="flex justify-between">
                  <span>Dine-In ({dineInOrders.length}):</span>
                  <span className="font-mono">Rs. {dineInRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Takeaway ({takeawayOrders.length}):</span>
                  <span className="font-mono">Rs. {takeawayRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery ({deliveryOrders.length}):</span>
                  <span className="font-mono">Rs. {deliveryRevenue}</span>
                </div>
              </div>

              {/* Top Selling Items */}
              {sortedTopItems.length > 0 && (
                <div className="py-2 border-b-2 border-dashed border-black space-y-1 text-[10px]">
                  <div className="font-black text-[11px] uppercase border-b border-black pb-0.5">
                    4. TOP SELLING ITEMS
                  </div>
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-black text-left">
                        <th className="py-0.5">ITEM</th>
                        <th className="text-center py-0.5 w-8">QTY</th>
                        <th className="text-right py-0.5 w-14">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-300">
                      {sortedTopItems.map(([name, data], idx) => (
                        <tr key={idx} className="align-top">
                          <td className="py-0.5 pr-1 font-semibold leading-tight">{name}</td>
                          <td className="text-center py-0.5 font-black">{data.qty}</td>
                          <td className="text-right py-0.5 font-mono">Rs. {data.revenue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Day-End Settlement Signatures */}
              <div className="pt-4 pb-2 space-y-4 text-[9px]">
                <div className="flex justify-between pt-4 border-t border-black">
                  <span>Cashier Signature</span>
                  <span>Manager Signature</span>
                </div>
                <div className="text-center text-[8px] text-gray-600">
                  *** End of Day Sales Audit Complete ***
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in print) */}
        <div className="p-2 sm:p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 print:hidden shrink-0">
          <button
            onClick={handlePrint}
            className="py-2 sm:py-2.5 px-3 sm:px-4 bg-slate-900 hover:bg-black text-white font-bold text-[11px] sm:text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span>Print Report Slip</span>
          </button>
          <button
            onClick={onClose}
            className="py-2 sm:py-2.5 px-3 sm:px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] sm:text-xs rounded-xl cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
