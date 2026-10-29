import React, { useState, useEffect, useMemo } from 'react';
import { Order, CartItem } from '@/data/menu';
import { Printer, X, CheckCircle2, UtensilsCrossed, UserCheck, Layers, Flame, Bike } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

type SlipTab = 'customer' | 'restaurant' | 'department' | 'rider';
type PrinterWidth = '80mm' | '58mm';
type PrintMode = 'customer' | 'restaurant' | 'department' | 'rider' | 'all';

interface DepartmentGroup {
  departmentName: string;
  items: CartItem[];
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const isDelivery = order.orderType === 'Delivery';
  const [activeTab, setActiveTab] = useState<SlipTab>('customer');
  const [printerWidth, setPrinterWidth] = useState<PrinterWidth>('80mm');
  const [printMode, setPrintMode] = useState<PrintMode>('customer');

  useEffect(() => {
    try {
      const savedWidth = localStorage.getItem('pos_thermal_width') as PrinterWidth | null;
      if (savedWidth === '80mm' || savedWidth === '58mm') {
        setPrinterWidth(savedWidth);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleWidthChange = (width: PrinterWidth) => {
    setPrinterWidth(width);
    try {
      localStorage.setItem('pos_thermal_width', width);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Group items by Kitchen / Deg Department
  const departmentGroups: DepartmentGroup[] = useMemo(() => {
    const groups: { [key: string]: CartItem[] } = {};

    order.items.forEach((item) => {
      const cat = item.item.category.toLowerCase();
      const name = item.item.name.toLowerCase();

      let dept = 'BIRYANI / DEG DEPARTMENT';
      if (cat.includes('beverage') || name.includes('drink') || name.includes('water')) {
        dept = 'BEVERAGES & DRINKS DEPARTMENT';
      } else if (cat.includes('pulao') || name.includes('pulao')) {
        dept = 'PULAO DEPARTMENT';
      } else if (cat.includes('biryani') || name.includes('biryani') || cat.includes('chicken')) {
        dept = 'BIRYANI / DEG DEPARTMENT';
      }

      if (!groups[dept]) {
        groups[dept] = [];
      }
      groups[dept].push(item);
    });

    return Object.entries(groups).map(([departmentName, items]) => ({
      departmentName,
      items,
    }));
  }, [order.items]);

  const triggerPrint = (mode: PrintMode) => {
    setPrintMode(mode);
    setTimeout(() => {
      window.print();
    }, 80);
  };

  const is58 = printerWidth === '58mm';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-1.5 sm:p-4 overflow-y-auto">
      {/* Outer Modal Container with Elastic Reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', stiffness: 450, damping: 28 }}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[96dvh] sm:max-h-[92vh] print:m-0 print:p-0 print:border-none print:shadow-none print:max-w-none print:max-h-none print:w-auto"
      >
        
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white p-3 sm:p-3.5 flex justify-between items-center print:hidden shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="font-bold text-xs sm:text-sm leading-tight truncate">Order Saved &amp; Billed</h3>
              <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                Token #{order.orderNumber} &bull; <span className="font-bold text-amber-300">{order.orderType}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close receipt modal"
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Controls Bar (Tabs & Width Selector) */}
        <div className="bg-slate-100 p-2 sm:p-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 print:hidden shrink-0">
          {/* Slip Switcher Tabs */}
          <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold overflow-x-auto max-w-full scrollbar-none">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                activeTab === 'customer'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Customer</span>
            </button>

            <button
              onClick={() => setActiveTab('restaurant')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                activeTab === 'restaurant'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Restaurant</span>
            </button>

            <button
              onClick={() => setActiveTab('department')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                activeTab === 'department'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Department ({departmentGroups.length})</span>
            </button>

            {isDelivery && (
              <button
                onClick={() => setActiveTab('rider')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap text-[11px] sm:text-xs ${
                  activeTab === 'rider'
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Bike className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>Rider Slip</span>
              </button>
            )}
          </div>

          {/* Width Selector */}
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 ml-auto shrink-0">
            <span className="text-slate-500 font-normal">Roll:</span>
            <div className="flex bg-slate-200/80 p-0.5 rounded-md">
              <button
                onClick={() => handleWidthChange('80mm')}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
                  printerWidth === '80mm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                80mm
              </button>
              <button
                onClick={() => handleWidthChange('58mm')}
                className={`px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold cursor-pointer transition-all ${
                  printerWidth === '58mm'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                58mm
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Receipt Body (Preview area) */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-4 bg-slate-100/50 flex justify-center print:p-0 print:bg-white print:overflow-visible">
          <div
            className={`transition-all duration-200 ${
              printerWidth === '58mm' ? 'w-[260px]' : 'w-[320px]'
            } print:w-full space-y-4 print:space-y-0`}
          >
            {/* 1. Customer Receipt Section */}
            <div
              className={`thermal-slip thermal-slip-customer bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs font-mono text-black select-text print:shadow-none print:border-none print:p-0 ${
                activeTab !== 'customer' ? 'hidden print:block' : 'block'
              } ${
                printMode === 'customer' || printMode === 'all' ? '' : 'print:!hidden'
              }`}
            >
              {/* Header */}
              <div className="text-center pb-2 border-b border-dashed border-black">
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
                <div className={`${is58 ? 'text-xs' : 'text-sm'} font-black uppercase tracking-wider`}>
                  AL. REHMAN BIRYANI
                </div>
                <div className="text-[10px] font-bold">&amp; PAKWAN CENTRE</div>
                <div className="text-[9px] mt-0.5">Kharadar / Burns Road Karachi</div>
                <div className="text-[9px]">Ph: 0300-1234567 / 021-32415555</div>
              </div>

              {/* Token & Metadata */}
              <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[10px]">
                <div className="flex justify-between items-center font-black text-xs">
                  <span>TOKEN #{order.orderNumber}</span>
                  <span className="border border-black px-1 uppercase text-[9px] font-bold">
                    {order.orderType}
                  </span>
                </div>
                <div className="flex justify-between text-[9px] text-gray-700">
                  <span>Date: {order.date}</span>
                  <span>Time: {order.time}</span>
                </div>
                {order.tableNumber && (
                  <div className="font-bold text-[10px]">TABLE NO: {order.tableNumber}</div>
                )}
                {order.waiterName && (
                  <div className="font-bold text-[10px]">WAITER: {order.waiterName}</div>
                )}
                {order.riderName && (
                  <div className="font-bold text-[10px]">RIDER: {order.riderName}</div>
                )}
                {order.customerName && (
                  <div className="text-[10px]">Cust: {order.customerName}</div>
                )}
                {order.customerPhone && (
                  <div className="text-[10px]">Cell: {order.customerPhone}</div>
                )}
                {order.customerAddress && (
                  <div className="text-[9px] leading-tight pt-0.5">
                    Address: {order.customerAddress}
                  </div>
                )}
                <div className="text-[10px]">Pay Method: {order.paymentMethod}</div>
              </div>

              {/* Items Table */}
              <div className="py-2 border-b border-dashed border-black">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b border-black text-left">
                      <th className="py-0.5">ITEM</th>
                      <th className="text-center py-0.5 w-7">QTY</th>
                      <th className="text-right py-0.5 w-12">RATE</th>
                      <th className="text-right py-0.5 w-14">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {order.items.map((cartItem, idx) => (
                      <tr key={idx} className="align-top">
                        <td className="py-1 pr-1 font-bold leading-tight">
                          {cartItem.item.name}
                          <span className="block text-[8px] font-normal text-gray-600">
                            {cartItem.item.variant}
                          </span>
                          {cartItem.notes && (
                            <span className="block text-[8px] italic font-semibold text-gray-800">
                              *{cartItem.notes}*
                            </span>
                          )}
                        </td>
                        <td className="text-center py-1 font-black">{cartItem.quantity}</td>
                        <td className="text-right py-1 font-mono">{cartItem.item.price}</td>
                        <td className="text-right py-1 font-mono font-bold">
                          {cartItem.item.price * cartItem.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals & Change Calculation */}
              <div className="py-2 border-b border-dashed border-black space-y-0.5 text-[10px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-mono">Rs. {order.subtotal}</span>
                </div>
                {order.deliveryCharge > 0 && (
                  <div className="flex justify-between font-bold">
                    <span>Rider Delivery:</span>
                    <span className="font-mono">Rs. {order.deliveryCharge}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-black pt-1 border-t border-black">
                  <span>TOTAL PAYABLE:</span>
                  <span className="font-mono">Rs. {order.total}</span>
                </div>
                {order.paymentMethod === 'Cash' && order.cashReceived !== undefined && (
                  <>
                    <div className="flex justify-between pt-0.5 text-gray-800">
                      <span>Cash Paid:</span>
                      <span className="font-mono">Rs. {order.cashReceived}</span>
                    </div>
                    <div className="flex justify-between font-black text-black">
                      <span>Change Return:</span>
                      <span className="font-mono">Rs. {order.change ?? 0}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Clean Receipt Footer */}
              <div className="text-center pt-2 text-[9px] leading-tight">
                <div className="font-bold">*** Thank You For Your Visit! ***</div>
                <div className="text-[8px] text-gray-600 mt-0.5">Software by Al Rehman POS</div>
              </div>
            </div>

            {/* Print Separator */}
            <div
              className={`print-page-break my-4 border-b-2 border-dashed border-slate-400 text-center text-[10px] text-slate-400 font-mono ${
                printMode === 'all' ? 'print:block' : 'hidden'
              }`}
            >
              --- CUT HERE ---
            </div>

            {/* 2. Restaurant Slip Section */}
            <div
              className={`thermal-slip thermal-slip-restaurant bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs font-mono text-black select-text print:shadow-none print:border-none print:p-0 ${
                activeTab !== 'restaurant' ? 'hidden print:block' : 'block'
              } ${
                printMode === 'restaurant' || printMode === 'all' ? '' : 'print:!hidden'
              }`}
            >
              {/* Slip Header */}
              <div className="text-center pb-2 border-b-2 border-dashed border-black">
                <div className="text-xs font-black uppercase tracking-wider">
                  AL. REHMAN BIRYANI
                </div>
                <div className="text-[11px] font-black uppercase tracking-widest bg-black text-white px-2 py-0.5 mt-1 inline-block">
                  *** RESTAURANT COPY ***
                </div>
              </div>

              {/* Order Details & Staff / Table Information */}
              <div className="py-2 border-b-2 border-dashed border-black space-y-1">
                <div className="flex justify-between items-center text-sm font-black">
                  <span>TOKEN #{order.orderNumber}</span>
                  <span className="border-2 border-black px-1.5 py-0.2 uppercase text-xs">
                    {order.orderType}
                  </span>
                </div>

                <div className="bg-slate-100 p-1.5 rounded border border-black/30 space-y-0.5 text-[11px] font-bold">
                  {order.tableNumber && (
                    <div className="text-xs font-black">TABLE NO: {order.tableNumber}</div>
                  )}
                  {order.waiterName && (
                    <div>WAITER: {order.waiterName}</div>
                  )}
                  {order.riderName && (
                    <div>RIDER: {order.riderName}</div>
                  )}
                  <div>PAYMENT: {order.paymentMethod}</div>
                </div>

                <div className="flex justify-between text-[9px] text-gray-700 pt-0.5">
                  <span>Date: {order.date}</span>
                  <span>Time: {order.time}</span>
                </div>
                {order.customerName && (
                  <div className="text-[9px] font-semibold">Cust: {order.customerName}</div>
                )}
                {order.customerPhone && (
                  <div className="text-[9px] text-gray-700">Cell: {order.customerPhone}</div>
                )}
              </div>

              {/* Items List (Items, Quantity, Rate & Total Amount) */}
              <div className="py-2 border-b-2 border-dashed border-black">
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b-2 border-black text-left">
                      <th className="py-1">ITEM DETAILS</th>
                      <th className="text-center py-1 w-7">QTY</th>
                      <th className="text-right py-1 w-12">RATE</th>
                      <th className="text-right py-1 w-14">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/30">
                    {order.items.map((cartItem, idx) => (
                      <tr key={idx} className="align-top">
                        <td className="py-1 pr-1 font-bold leading-tight">
                          <span className="text-[11px] font-black">{cartItem.item.name}</span>
                          <span className="block text-[8px] font-bold text-gray-700">
                            [{cartItem.item.variant}]
                          </span>
                          {cartItem.notes && (
                            <span className="block text-[8px] font-bold uppercase mt-0.5 bg-black text-white px-1 py-0.2 rounded-xs inline-block">
                              NOTE: {cartItem.notes}
                            </span>
                          )}
                        </td>
                        <td className="text-center py-1 font-black text-xs">
                          {cartItem.quantity}
                        </td>
                        <td className="text-right py-1 font-mono text-[10px]">
                          {cartItem.item.price}
                        </td>
                        <td className="text-right py-1 font-mono font-black text-[10px]">
                          {cartItem.item.price * cartItem.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary Items Count & Total Bill */}
              <div className="py-2 border-b border-dashed border-black space-y-1 text-[10px]">
                <div className="flex justify-between items-center font-bold">
                  <span>TOTAL ITEMS:</span>
                  <span className="text-xs font-black">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                </div>
                {order.deliveryCharge > 0 && (
                  <div className="flex justify-between font-bold">
                    <span>Delivery Charges:</span>
                    <span className="font-mono">Rs. {order.deliveryCharge}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs font-black pt-1 border-t border-black">
                  <span>BILL TOTAL:</span>
                  <span className="font-mono text-sm">Rs. {order.total}</span>
                </div>
              </div>

              {/* Restaurant Footer Note */}
              <div className="text-center pt-2 text-[9px] font-bold leading-tight">
                RESTAURANT AUDIT &amp; RECORD COPY
              </div>
            </div>

            {/* 3. Department Slips (Kitchen / Deg / Beverage Stations) */}
            {departmentGroups.map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                <div
                  className={`print-page-break my-4 border-b-2 border-dashed border-slate-400 text-center text-[10px] text-slate-400 font-mono ${
                    printMode === 'all' || printMode === 'department' ? 'print:block' : 'hidden'
                  }`}
                >
                  --- CUT HERE ---
                </div>

                <div
                  className={`thermal-slip thermal-slip-department bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs font-mono text-black select-text print:shadow-none print:border-none print:p-0 ${
                    activeTab !== 'department' ? 'hidden print:block' : 'block'
                  } ${
                    printMode === 'department' || printMode === 'all' ? '' : 'print:!hidden'
                  }`}
                >
                  {/* Department Header */}
                  <div className="text-center pb-2 border-b-2 border-dashed border-black">
                    <div className="text-xs font-black uppercase tracking-wider">
                      AL. REHMAN BIRYANI
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 mt-1 inline-block">
                      *** {group.departmentName} ***
                    </div>
                  </div>

                  {/* Token & Routing */}
                  <div className="py-2 border-b-2 border-dashed border-black space-y-1">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span className="text-base font-black">TOKEN #{order.orderNumber}</span>
                      <span className="border-2 border-black px-1.5 py-0.2 uppercase text-xs">
                        {order.orderType}
                      </span>
                    </div>

                    <div className="flex justify-between text-[10px] font-bold text-gray-800">
                      <span>Time: {order.time}</span>
                      {order.tableNumber && <span>TABLE: {order.tableNumber}</span>}
                    </div>

                    {order.waiterName && (
                      <div className="text-[10px] font-bold">WAITER: {order.waiterName}</div>
                    )}
                    {order.riderName && (
                      <div className="text-[10px] font-bold">RIDER: {order.riderName}</div>
                    )}
                  </div>

                  {/* Items List */}
                  <div className="py-2 border-b-2 border-dashed border-black">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b-2 border-black text-left">
                          <th className="py-1">ITEM &amp; VARIANT</th>
                          <th className="text-right py-1 w-12">QTY</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/30">
                        {group.items.map((cartItem, idx) => (
                          <tr key={idx} className="align-top">
                            <td className="py-1.5 pr-1 font-black leading-tight">
                              <span className="text-xs sm:text-sm font-black">{cartItem.item.name}</span>
                              <span className="block text-[10px] font-bold text-gray-800">
                                ({cartItem.item.variant})
                              </span>
                              {cartItem.notes && (
                                <span className="block text-[9px] font-black uppercase mt-1 bg-black text-white px-1 py-0.2 rounded-xs inline-block">
                                  NOTE: {cartItem.notes}
                                </span>
                              )}
                            </td>
                            <td className="text-right py-1.5 font-black text-base sm:text-lg">
                              &times; {cartItem.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Items Count */}
                  <div className="py-2 border-b border-dashed border-black flex justify-between items-center text-[10px] font-bold">
                    <span>DEPARTMENT ITEMS:</span>
                    <span className="text-xs font-black">
                      {group.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>

                  <div className="text-center pt-2 text-[9px] font-black uppercase">
                    DEPARTMENT COPY &bull; PREPARE IMMEDIATELY
                  </div>
                </div>
              </React.Fragment>
            ))}

            {/* 4. Rider Delivery Slip (Only when delivery) */}
            {isDelivery && (
              <React.Fragment>
                <div
                  className={`print-page-break my-4 border-b-2 border-dashed border-slate-400 text-center text-[10px] text-slate-400 font-mono ${
                    printMode === 'all' || printMode === 'rider' ? 'print:block' : 'hidden'
                  }`}
                >
                  --- CUT HERE ---
                </div>

                <div
                  className={`thermal-slip thermal-slip-rider bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs font-mono text-black select-text print:shadow-none print:border-none print:p-0 ${
                    activeTab !== 'rider' ? 'hidden print:block' : 'block'
                  } ${
                    printMode === 'rider' || printMode === 'all' ? '' : 'print:!hidden'
                  }`}
                >
                  {/* Rider Header */}
                  <div className="text-center pb-2 border-b-2 border-dashed border-black">
                    <div className="text-xs font-black uppercase tracking-wider">
                      AL. REHMAN BIRYANI
                    </div>
                    <div className="text-xs font-black uppercase tracking-wider bg-black text-white px-2 py-0.5 mt-1 inline-block">
                      *** RIDER DELIVERY DISPATCH ***
                    </div>
                  </div>

                  {/* Rider & Customer Dispatch Info */}
                  <div className="py-2 border-b-2 border-dashed border-black space-y-1.5">
                    <div className="flex justify-between items-center text-sm font-black">
                      <span className="text-base">TOKEN #{order.orderNumber}</span>
                      <span className="border-2 border-black bg-black text-white px-2 py-0.5 uppercase text-xs font-black">
                        DELIVERY
                      </span>
                    </div>

                    {/* Prominent Rider Box */}
                    <div className="bg-slate-100 p-2 rounded border border-black space-y-1 text-xs">
                      <div className="font-black text-sm">
                        RIDER: {order.riderName || 'UNASSIGNED'}
                      </div>
                      <div className="font-bold">
                        CUST: {order.customerName || 'Walk-in'}
                      </div>
                      <div className="font-black text-sm text-black">
                        PHONE: {order.customerPhone || 'N/A'}
                      </div>
                      {order.customerAddress && (
                        <div className="text-xs font-bold leading-tight pt-1 border-t border-black/40">
                          ADDRESS: {order.customerAddress}
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-[10px] text-gray-700">
                      <span>Dispatch Time: {order.time}</span>
                      <span>Date: {order.date}</span>
                    </div>
                  </div>

                  {/* Packaged Items to deliver */}
                  <div className="py-2 border-b-2 border-dashed border-black">
                    <table className="w-full text-[10px]">
                      <thead>
                        <tr className="border-b-2 border-black text-left">
                          <th className="py-1">PACKAGE ITEMS</th>
                          <th className="text-right py-1 w-10">QTY</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-black/30">
                        {order.items.map((cartItem, idx) => (
                          <tr key={idx} className="align-top">
                            <td className="py-1 pr-1 font-bold leading-tight">
                              <span className="text-[11px] font-black">{cartItem.item.name}</span>
                              <span className="block text-[9px] font-bold text-gray-800">
                                ({cartItem.item.variant})
                              </span>
                            </td>
                            <td className="text-right py-1 font-black text-xs">
                              &times; {cartItem.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Payment to Collect */}
                  <div className="py-2 border-b-2 border-dashed border-black space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Food Bill:</span>
                      <span className="font-mono">Rs. {order.subtotal}</span>
                    </div>
                    {order.deliveryCharge > 0 && (
                      <div className="flex justify-between font-bold">
                        <span>Rider Fee:</span>
                        <span className="font-mono">Rs. {order.deliveryCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center font-black text-xs pt-1 border-t border-black">
                      <span className="text-xs uppercase">COLLECT FROM CUSTOMER:</span>
                      <span className="font-mono text-base">Rs. {order.total}</span>
                    </div>
                    <div className="text-[10px] text-gray-700 font-bold">
                      Payment Mode: {order.paymentMethod}
                    </div>
                  </div>

                  <div className="text-center pt-2 text-[9px] font-black leading-tight uppercase">
                    RIDER COPY &bull; DELIVER SAFELY &amp; COLLECT AMOUNT
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions Bar (Buttons) */}
        <div className="p-2 sm:p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-1.5 sm:gap-2 print:hidden shrink-0">
          <button
            onClick={() => triggerPrint('customer')}
            className="flex-1 min-w-[95px] sm:min-w-[110px] py-2 sm:py-2.5 px-2 bg-slate-900 hover:bg-black text-white font-bold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span>Customer Slip</span>
          </button>

          <button
            onClick={() => triggerPrint('restaurant')}
            className="flex-1 min-w-[95px] sm:min-w-[110px] py-2 sm:py-2.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-200 shrink-0" />
            <span>Restaurant Slip</span>
          </button>

          <button
            onClick={() => triggerPrint('department')}
            className="flex-1 min-w-[95px] sm:min-w-[110px] py-2 sm:py-2.5 px-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all shadow-xs"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-200 shrink-0" />
            <span>Department Slip</span>
          </button>

          {isDelivery && (
            <button
              onClick={() => triggerPrint('rider')}
              className="flex-1 min-w-[95px] sm:min-w-[110px] py-2 sm:py-2.5 px-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all shadow-xs"
            >
              <Bike className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200 shrink-0" />
              <span>Rider Slip</span>
            </button>
          )}

          <button
            onClick={() => triggerPrint('all')}
            title="Print all relevant slips in sequence"
            className="py-2 sm:py-2.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] sm:text-xs rounded-xl flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer transition-all shadow-xs ml-auto"
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Print All</span>
          </button>

          <button
            onClick={onClose}
            className="py-2 sm:py-2.5 px-3 sm:px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-[11px] sm:text-xs rounded-xl cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
