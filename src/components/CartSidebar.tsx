'use client';

import React, { useState } from 'react';
import {
  CartItem,
  OrderType,
  PaymentMethod,
  Order
} from '@/data/menu';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Receipt,
  UtensilsCrossed,
  Package,
  Bike,
  ArrowRight,
  BookmarkPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartSidebarProps {
  cart: CartItem[];
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  selectedTable: string;
  setSelectedTable: (table: string) => void;
  occupiedTables?: string[];
  tablesList?: string[];
  selectedWaiter: string;
  setSelectedWaiter: (waiter: string) => void;
  waitersList: string[];
  onAddWaiter: (name: string) => void;
  onDeleteWaiter: (name: string) => void;
  onUpdateQuantity: (itemId: string, delta: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateNotes: (itemId: string, notes: string) => void;
  onClearCart: () => void;
  onCheckout: (orderData: Partial<Order>) => void;
  onHoldOrder?: (orderData: Partial<Order>) => void;
  isEditingActiveOrder?: boolean;
  onCloseMobile?: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({
  cart,
  orderType,
  setOrderType,
  selectedTable,
  setSelectedTable,
  occupiedTables = [],
  tablesList = [],
  selectedWaiter,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onHoldOrder,
  isEditingActiveOrder,
  onCloseMobile,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [riderName, setRiderName] = useState('');
  const [manualDeliveryCharges, setManualDeliveryCharges] = useState<string>('100');
  const [cashTendered, setCashTendered] = useState<string>('');

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);
  
  const parsedDeliveryCharge = orderType === 'Delivery' ? (parseFloat(manualDeliveryCharges) || 0) : 0;
  const netTotal = Math.max(0, subtotal + parsedDeliveryCharge);

  // Exact Calculation of Cash Received vs Change Due
  const tenderNumber = parseFloat(cashTendered) || 0;
  const changeDue = tenderNumber >= netTotal ? tenderNumber - netTotal : 0;
  const shortAmount = tenderNumber > 0 && tenderNumber < netTotal ? netTotal - tenderNumber : 0;

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;

    onCheckout({
      orderType,
      tableNumber: orderType === 'Dine-In' ? selectedTable : undefined,
      waiterName: orderType === 'Dine-In' ? selectedWaiter : undefined,
      riderName: orderType === 'Delivery' ? riderName.trim() : undefined,
      customerName: customerName.trim() || undefined,
      customerPhone: customerPhone.trim() || undefined,
      customerAddress: orderType === 'Delivery' ? customerAddress.trim() : undefined,
      paymentMethod,
      subtotal,
      discount: 0,
      deliveryCharge: parsedDeliveryCharge,
      total: netTotal,
      cashReceived: paymentMethod === 'Cash' ? (tenderNumber > 0 ? tenderNumber : netTotal) : netTotal,
      change: paymentMethod === 'Cash' ? changeDue : 0,
    });
  };

  const handleHoldClick = () => {
    if (cart.length === 0) return;
    if (onHoldOrder) {
      onHoldOrder({
        orderType,
        tableNumber: orderType === 'Dine-In' ? selectedTable : undefined,
        waiterName: orderType === 'Dine-In' ? selectedWaiter : undefined,
        riderName: orderType === 'Delivery' ? riderName.trim() : undefined,
        customerName: customerName.trim() || undefined,
        customerPhone: customerPhone.trim() || undefined,
        customerAddress: orderType === 'Delivery' ? customerAddress.trim() : undefined,
        paymentMethod,
        subtotal,
        discount: 0,
        deliveryCharge: parsedDeliveryCharge,
        total: netTotal,
        status: 'Pending',
        isHold: true,
      });
    }
  };

  return (
    <div className="w-full sm:w-80 xl:w-[350px] flex flex-col h-full bg-white border-l border-slate-200/90 shadow-2xl z-20 select-none">
      {/* 1. Header with Mode Switcher */}
      <div className="p-2.5 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <motion.div
              key={itemCount}
              initial={{ scale: 0.7, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="w-6 h-6 rounded-lg bg-linear-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-black text-xs"
            >
              {itemCount}
            </motion.div>
            <h2 className="font-extrabold text-xs text-slate-900 tracking-tight">
              Order Ticket
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {cart.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClearCart}
                className="text-[10px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Clear
              </motion.button>
            )}

            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
                title="Close Ticket"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Order Type Tabs with Sliding Bubble Indicator */}
        <div className="grid grid-cols-3 gap-1 bg-slate-200/70 p-1 rounded-xl relative">
          {(['Dine-In', 'Takeaway', 'Delivery'] as OrderType[]).map((type) => {
            const isActive = orderType === type;
            return (
              <button
                key={type}
                onClick={() => setOrderType(type)}
                className={`relative py-1.5 rounded-lg text-[11px] font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer z-10 ${
                  isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="orderTypeIndicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/60 z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                  />
                )}
                {type === 'Dine-In' && <UtensilsCrossed className="w-3.5 h-3.5" />}
                {type === 'Takeaway' && <Package className="w-3.5 h-3.5" />}
                {type === 'Delivery' && <Bike className="w-3.5 h-3.5" />}
                <span>{type}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Context Header (Dine-in / Delivery) */}
        <AnimatePresence mode="wait">
          {orderType === 'Dine-In' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs overflow-hidden"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">Table:</span>
                <div className="flex items-center gap-1">
                  {/* Subtle color dot indicator for selected table */}
                  <span
                    className={`w-2 h-2 rounded-full ${
                      occupiedTables.includes(selectedTable)
                        ? 'bg-rose-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                  <select
                    value={selectedTable}
                    onChange={(e) => setSelectedTable(e.target.value)}
                    className={`font-black text-xs px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
                      occupiedTables.includes(selectedTable)
                        ? 'bg-rose-50 text-rose-900 border-rose-300'
                        : 'bg-emerald-50 text-emerald-950 border-emerald-300'
                    }`}
                  >
                    {tablesList.map((tbl) => {
                      const isOccupied = occupiedTables.includes(tbl);
                      return (
                        <option key={tbl} value={tbl}>
                          {tbl} {isOccupied ? '●' : '○'}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold text-[11px]">Waiter:</span>
                <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                  {selectedWaiter}
                </span>
              </div>
            </motion.div>
          )}

          {orderType === 'Delivery' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 pt-2 border-t border-slate-200/60 space-y-1.5 overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block">
                    Rider
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kamran (Bykea)"
                    value={riderName}
                    onChange={(e) => setRiderName(e.target.value)}
                    className="w-full text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-md focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-bold text-slate-500 uppercase block">
                    Charges (Rs.)
                  </label>
                  <input
                    type="number"
                    value={manualDeliveryCharges}
                    onChange={(e) => setManualDeliveryCharges(e.target.value)}
                    className="w-full text-xs font-bold px-2 py-1 bg-white border border-slate-200 rounded-md focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase block">
                  Delivery Address &amp; Contact
                </label>
                <textarea
                  rows={2}
                  placeholder="House #, Street, Block, Area &amp; Phone..."
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full text-xs font-medium px-2 py-1 bg-white border border-slate-200 rounded-md focus:border-amber-500 focus:outline-none resize-none"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Cart Items List with Ultra-Smooth Spring Enter & Exit */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        <AnimatePresence initial={false}>
          {cart.map((cartItem) => (
            <motion.div
              key={cartItem.item.id}
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85, x: 20, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="bg-white border border-slate-200/90 hover:border-amber-400/80 rounded-xl p-2.5 shadow-[0_2px_6px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-xs text-slate-900 truncate">
                    {cartItem.item.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                      {cartItem.item.variant}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      Rs. {cartItem.item.price} each
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-mono font-black text-slate-900">
                    Rs. {cartItem.item.price * cartItem.quantity}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper & Remove */}
              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100">
                <div className="flex items-center gap-1.5 bg-slate-100/90 rounded-lg p-0.5 border border-slate-200/70">
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdateQuantity(cartItem.item.id, -1)}
                    className="w-5 h-5 rounded-md bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs cursor-pointer"
                  >
                    <Minus className="w-3 h-3 stroke-[3]" />
                  </motion.button>
                  <motion.span
                    key={cartItem.quantity}
                    initial={{ scale: 1.3, color: '#f59e0b' }}
                    animate={{ scale: 1, color: '#0f172a' }}
                    className="font-mono font-extrabold text-xs w-5 text-center"
                  >
                    {cartItem.quantity}
                  </motion.span>
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => onUpdateQuantity(cartItem.item.id, 1)}
                    className="w-5 h-5 rounded-md bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3 h-3 stroke-[3]" />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onRemoveItem(cartItem.item.id)}
                  className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {cart.length === 0 && (
          <div className="h-64 flex flex-col items-center justify-center text-slate-400 select-none">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-3 shadow-inner"
            >
              <ShoppingBag className="w-6 h-6 text-amber-500 stroke-[1.8]" />
            </motion.div>
            <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Ticket is Empty
            </p>
            <p className="text-[11px] text-slate-400 text-center max-w-[180px] mt-1 font-medium">
              Click any delicious dish on the menu to begin
            </p>
          </div>
        )}
      </div>

      {/* 3. Balanced Payment & Dynamic Animated Change Box */}
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 450, damping: 28 }}
          className="p-3 bg-white border-t border-slate-200/90 shadow-2xl space-y-2 relative"
        >
          {/* Micro Payment Method Pills with Fluid Active Slider */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 rounded-xl relative">
            {(['Cash', 'EasyPaisa', 'JazzCash'] as PaymentMethod[]).map((m) => {
              const isSelected = paymentMethod === m;
              return (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`relative py-1 rounded-lg text-[10px] font-black text-center transition-colors cursor-pointer z-10 ${
                    isSelected ? 'text-slate-950' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="paymentMethodPill"
                      className="absolute inset-0 bg-linear-to-r from-amber-400 to-amber-500 rounded-lg shadow-xs z-[-1]"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  {m}
                </button>
              );
            })}
          </div>

          {/* Clean Cash Tender & Change Due with $1000 Spring Scale Animation */}
          {paymentMethod === 'Cash' && (
            <div className="bg-amber-50/70 p-2 rounded-xl border border-amber-200/90 space-y-1.5">
              <div className="grid grid-cols-2 gap-2">
                {/* Paid Input */}
                <div className="bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-2xs focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase block leading-none">
                    Cash Paid
                  </span>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="text-xs text-slate-400 font-mono font-bold">Rs.</span>
                    <input
                      type="number"
                      value={cashTendered}
                      onChange={(e) => setCashTendered(e.target.value)}
                      placeholder={String(netTotal)}
                      className="w-full text-xs font-mono font-black text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Change Due Display */}
                <motion.div
                  key={changeDue}
                  initial={{ scale: 0.9, backgroundColor: '#ecfdf5' }}
                  animate={{ scale: 1, backgroundColor: '#ecfdf5' }}
                  transition={{ type: 'spring', stiffness: 550, damping: 22 }}
                  className="bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-300 flex flex-col justify-center shadow-2xs"
                >
                  <span className="text-[9px] font-black text-emerald-800 uppercase block leading-none">
                    Change Due
                  </span>
                  <div className="text-sm font-black text-emerald-700 font-mono leading-tight mt-0.5">
                    Rs. {changeDue}
                  </div>
                </motion.div>
              </div>

              {shortAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[9px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex justify-between"
                >
                  <span>Short Cash:</span>
                  <span className="font-mono font-bold">Rs. {shortAmount} more</span>
                </motion.div>
              )}
            </div>
          )}

          {/* Pricing Row */}
          <div className="flex items-center justify-between text-xs px-1 pt-0.5">
            <span className="text-slate-500 text-[11px] font-medium">
              Sub: <strong className="text-slate-800">Rs.{subtotal}</strong>
              {orderType === 'Delivery' && (
                <span className="text-amber-700 ml-1 font-semibold">
                  (+Rs.{parsedDeliveryCharge})
                </span>
              )}
            </span>
            <span className="font-black text-slate-900 font-mono text-xs flex items-center gap-1">
              Net Total:
              <motion.span
                key={netTotal}
                initial={{ scale: 1.15, color: '#f59e0b' }}
                animate={{ scale: 1, color: '#b45309' }}
                className="font-extrabold text-base text-amber-700"
              >
                Rs.{netTotal}
              </motion.span>
            </span>
          </div>

          {/* Checkout & Hold Running Order Buttons */}
          <div className="grid grid-cols-5 gap-1.5 pt-0.5">
            {/* Hold / Running Order Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHoldClick}
              className="col-span-2 py-2.5 px-2 bg-slate-800 hover:bg-slate-900 text-amber-400 font-black text-[11px] uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm border border-slate-700"
              title="Save as Active / Running Order to add items later"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEditingActiveOrder ? 'Update Tab' : 'Hold / Tab'}</span>
            </motion.button>

            {/* Settle & Charge Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              onClick={handleCheckoutClick}
              className="col-span-3 py-2.5 px-2 bg-linear-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer animate-shimmer-sweep"
            >
              <Receipt className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Settle &amp; Bill</span>
              <ArrowRight className="w-3 h-3 stroke-[3]" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
