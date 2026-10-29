import React from 'react';
import { Order } from '@/data/menu';
import { Printer, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  order: Order;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden border border-slate-200">
        {/* Top notification bar (Hidden during print) */}
        <div className="bg-slate-900 text-white p-3.5 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm leading-tight">Order Saved &amp; Billed</h3>
              <p className="text-[11px] text-slate-300">Token #{order.orderNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 80mm ESC/POS Thermal Receipt Paper Layout */}
        <div className="p-4 font-mono text-[11px] leading-tight text-black bg-white receipt-content select-text">
          {/* Header */}
          <div className="text-center pb-2 border-b border-dashed border-black">
            <div className="flex justify-center mb-1">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-12 w-auto object-contain grayscale contrast-200"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="text-sm font-black uppercase tracking-wider">
              AL. REHMAN BIRYANI
            </div>
            <div className="text-[10px] font-bold">&amp; PAKWAN CENTRE</div>
            <div className="text-[9px] mt-0.5">Kharadar / Burns Road Karachi</div>
            <div className="text-[9px]">Ph: 0300-1234567 / 021-32415555</div>
          </div>

          {/* Token & Metadata */}
          <div className="py-2 border-b border-dashed border-black space-y-0.5">
            <div className="flex justify-between items-center font-black text-xs">
              <span>TOKEN #{order.orderNumber}</span>
              <span className="border border-black px-1 uppercase text-[10px]">
                {order.orderType}
              </span>
            </div>
            <div className="flex justify-between text-[10px] text-gray-700">
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
              <div className="text-[10px] leading-none pt-0.5">
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
                  <th className="text-center py-0.5">QTY</th>
                  <th className="text-right py-0.5">RATE</th>
                  <th className="text-right py-0.5">TOTAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {order.items.map((cartItem, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="py-1 pr-1 font-bold">
                      {cartItem.item.name}
                      <span className="block text-[9px] font-normal text-gray-600">
                        {cartItem.item.variant}
                      </span>
                      {cartItem.notes && (
                        <span className="block text-[8px] italic">
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

          {/* Clean Receipt Footer (No Poetry) */}
          <div className="text-center pt-2 text-[9px] leading-tight">
            <div className="text-[9px] font-bold">
              *** Thank You For Your Visit! ***
            </div>
          </div>
        </div>

        {/* Buttons (Hidden when printing) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Print Thermal Receipt
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
