import React, { useState } from 'react';
import { Order } from '@/data/menu';
import {
  X,
  Search,
  Clock,
  Printer,
  Edit2,
  Trash2,
  XCircle,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderHistoryModalProps {
  orders: Order[];
  onClose: () => void;
  onViewOrderReceipt: (order: Order) => void;
  onEditOrder: (order: Order) => void;
  onDeleteOrder: (orderId: string) => void;
  onCancelOrder: (orderId: string, reason?: string) => void;
  onRestoreOrder: (orderId: string) => void;
  defaultFilter?: 'Completed' | 'Cancelled' | 'Pending' | 'All';
}

export const OrderHistoryModal: React.FC<OrderHistoryModalProps> = ({
  orders,
  onClose,
  onViewOrderReceipt,
  onEditOrder,
  onDeleteOrder,
  onCancelOrder,
  onRestoreOrder,
  defaultFilter = 'All'
}) => {
  const [statusFilter, setStatusFilter] = useState<'All' | 'Completed' | 'Pending' | 'Cancelled'>(defaultFilter);
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesType = typeFilter === 'All' || order.orderType === typeFilter;
    const matchesSearch =
      order.orderNumber.toString().includes(search) ||
      (order.customerName && order.customerName.toLowerCase().includes(search.toLowerCase())) ||
      (order.tableNumber && order.tableNumber.toLowerCase().includes(search.toLowerCase())) ||
      (order.waiterName && order.waiterName.toLowerCase().includes(search.toLowerCase())) ||
      (order.riderName && order.riderName.toLowerCase().includes(search.toLowerCase())) ||
      (order.customerPhone && order.customerPhone.includes(search));
    return matchesStatus && matchesType && matchesSearch;
  });

  const completedSales = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);

  const cancelledCount = orders.filter((o) => o.status === 'Cancelled').length;

  const handleConfirmCancel = (id: string) => {
    onCancelOrder(id, cancelReason);
    setCancellingOrderId(null);
    setCancelReason('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white border border-slate-200 text-slate-800 rounded-2xl max-w-4xl w-full max-h-[92dvh] h-[85vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-3 sm:p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">Daily Orders Management</h3>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                Completed: <span className="text-emerald-400 font-bold font-mono">Rs. {completedSales.toLocaleString()}</span> | Cancelled:{' '}
                <span className="text-rose-400 font-bold">{cancelledCount}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="p-2 sm:p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {/* Status Filter */}
            <div className="flex flex-wrap bg-slate-200 p-0.5 rounded-lg text-xs font-bold">
              {(['All', 'Pending', 'Completed', 'Cancelled'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2 py-1 rounded-md transition-all cursor-pointer text-[11px] sm:text-xs ${
                    statusFilter === s
                      ? s === 'Cancelled'
                        ? 'bg-rose-600 text-white'
                        : s === 'Pending'
                        ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                        : 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s === 'Pending' ? 'Running' : s}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex flex-wrap gap-1">
              {['All', 'Dine-In', 'Takeaway', 'Delivery'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2 py-1 rounded-lg text-[11px] sm:text-xs font-semibold cursor-pointer border transition-all ${
                    typeFilter === type
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full sm:w-auto min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token, table, rider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50">
          {filteredOrders.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Clock className="w-10 h-10 mb-2 stroke-[1.5] text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredOrders.map((order) => {
                const isCancelled = order.status === 'Cancelled';
                const isPending = order.status === 'Pending';

                return (
                  <div
                    key={order.id}
                    className={`p-3.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs transition-all border ${
                      isCancelled
                        ? 'bg-rose-50/60 border-rose-200 opacity-90'
                        : isPending
                        ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20'
                        : 'bg-white border-slate-200 hover:border-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center border ${
                          isCancelled
                            ? 'bg-rose-100 border-rose-300 text-rose-800'
                            : isPending
                            ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <span className="text-[9px] font-extrabold uppercase">
                          {isPending ? 'RUNNING' : 'TOKEN'}
                        </span>
                        <span className="text-sm font-black font-mono">#{order.orderNumber}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                              isCancelled
                                ? 'bg-rose-600 text-white border-rose-700'
                                : isPending
                                ? 'bg-amber-500 text-slate-950 font-black border-amber-600 animate-pulse'
                                : 'bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {isCancelled ? 'CANCELLED' : isPending ? 'RUNNING TAB (OPEN)' : order.orderType}
                          </span>
                          <span className="text-xs text-slate-500">{order.time}</span>
                          {order.tableNumber && (
                            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              Table: {order.tableNumber}
                            </span>
                          )}
                          {order.waiterName && (
                            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                              Waiter: {order.waiterName}
                            </span>
                          )}
                          {order.riderName && (
                            <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              Rider: {order.riderName}
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-700 mt-1 font-medium">
                          {order.items.map((i) => `${i.quantity}x ${i.item.name} (${i.item.variant})`).join(', ')}
                        </div>

                        {order.customerName && (
                          <div className="text-[11px] text-slate-500">
                            Customer: {order.customerName} {order.customerPhone ? `(${order.customerPhone})` : ''}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                      <div className="text-right mr-1">
                        <div className={`text-base font-black font-mono ${isCancelled ? 'line-through text-rose-600' : 'text-slate-900'}`}>
                          Rs. {order.total}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {order.paymentMethod}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!isCancelled && (
                          <>
                            {isPending ? (
                              <button
                                onClick={() => onEditOrder(order)}
                                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                                title="Add More Items / Settle Order"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Add Items / Settle
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => onViewOrderReceipt(order)}
                                  className="px-2.5 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Print Receipt"
                                >
                                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                                  Print
                                </button>

                                <button
                                  onClick={() => onEditOrder(order)}
                                  className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Edit Order"
                                >
                                  <Edit2 className="w-3.5 h-3.5 text-amber-700" />
                                  Edit
                                </button>
                              </>
                            )}
                          </>
                        )}

                        {/* Cancel Button */}
                        {!isCancelled ? (
                          cancellingOrderId === order.id ? (
                            <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-lg border border-rose-200">
                              <input
                                type="text"
                                placeholder="Reason (e.g. Customer left)"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="px-1.5 py-0.5 text-[10px] bg-white border border-rose-300 rounded w-28"
                              />
                              <button
                                onClick={() => handleConfirmCancel(order.id)}
                                className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Cancel Order
                              </button>
                              <button
                                onClick={() => setCancellingOrderId(null)}
                                className="px-1 py-0.5 text-slate-600 text-[10px]"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancellingOrderId(order.id)}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                              title="Cancel Order"
                            >
                              <XCircle className="w-3.5 h-3.5 text-rose-600" />
                              Cancel
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => onRestoreOrder(order.id)}
                            className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                            title="Restore to Completed"
                          >
                            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                            Restore
                          </button>
                        )}

                        {/* Permanent Delete */}
                        {confirmDeleteId === order.id ? (
                          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border">
                            <button
                              onClick={() => {
                                onDeleteOrder(order.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold cursor-pointer"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-[10px] px-1 text-slate-600"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(order.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
