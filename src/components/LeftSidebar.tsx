'use client';

import React from 'react';
import {
  LayoutGrid,
  Clock,
  FileText,
  PlusCircle,
  Users,
  Bike,
  Armchair,
  XCircle,
  ChevronRight,
  Trash2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LeftSidebarProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  ordersCount: number;
  activeTabsCount?: number;
  cancelledCount: number;
  onOpenHistory: () => void;
  onOpenActiveTabs?: () => void;
  onOpenCancelled: () => void;
  onOpenMenuCard: () => void;
  onOpenAddMenuItem: () => void;
  // Tables
  tablesList: string[];
  selectedTable: string;
  occupiedTables?: string[];
  onSelectTable: (t: string) => void;
  onAddTable: (t: string) => void;
  onDeleteTable: (t: string) => void;
  // Waiters
  waitersList: string[];
  selectedWaiter: string;
  onSelectWaiter: (w: string) => void;
  onAddWaiter: (w: string) => void;
  onDeleteWaiter: (w: string) => void;
  // Riders
  ridersList: string[];
  selectedRider: string;
  onSelectRider: (r: string) => void;
  onAddRider: (r: string) => void;
  onDeleteRider: (r: string) => void;
  onCloseMobile?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  ordersCount,
  activeTabsCount = 0,
  cancelledCount,
  onOpenHistory,
  onOpenActiveTabs,
  onOpenCancelled,
  onOpenMenuCard,
  onOpenAddMenuItem,
  tablesList,
  selectedTable,
  occupiedTables = [],
  onSelectTable,
  onAddTable,
  onDeleteTable,
  waitersList,
  selectedWaiter,
  onSelectWaiter,
  onAddWaiter,
  onDeleteWaiter,
  ridersList,
  selectedRider,
  onSelectRider,
  onAddRider,
  onDeleteRider,
  onCloseMobile,
}) => {
  const [activeTab, setActiveTab] = React.useState<'categories' | 'tables' | 'staff'>('categories');
  const [newTableInput, setNewTableInput] = React.useState<string>('');
  const [showAddTable, setShowAddTable] = React.useState<boolean>(false);
  const [newWaiterInput, setNewWaiterInput] = React.useState<string>('');
  const [showAddWaiter, setShowAddWaiter] = React.useState<boolean>(false);
  const [newRiderInput, setNewRiderInput] = React.useState<string>('');
  const [showAddRider, setShowAddRider] = React.useState<boolean>(false);

  return (
    <aside className="w-full sm:w-72 lg:w-64 h-full bg-white text-slate-800 flex flex-col border-r border-slate-200/80 shrink-0 select-none shadow-[2px_0_16px_rgba(0,0,0,0.03)] z-10">
      {/* Brand & Logo Header - Clean White Brand Pill with Subtle Floating Animation */}
      <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-white">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="h-12 flex-1 flex items-center justify-center p-1 bg-amber-50/50 rounded-2xl border border-amber-100/90 shadow-2xs"
        >
          <img
            src="/logo.png"
            alt="Logo"
            className="h-full w-auto max-h-10 object-contain filter drop-shadow-xs"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </motion.div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          >
            <XCircle className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Modern Segmented Navigation Tabs with Fluid Pill */}
      <div className="p-2 border-b border-slate-100 bg-slate-50/70">
        <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-1 rounded-xl relative">
          {[
            { id: 'categories', label: 'Menu', icon: LayoutGrid },
            { id: 'tables', label: 'Tables', icon: Armchair },
            { id: 'staff', label: 'Staff', icon: Users },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative py-1.5 rounded-lg text-xs font-black flex items-center justify-center gap-1 transition-colors cursor-pointer z-10 ${
                  isActive ? 'text-slate-950' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarTabIndicator"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50 z-[-1]"
                    transition={{ type: 'spring', stiffness: 500, damping: 32 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1">
        {/* TAB 1: Categories with Modern Capsule Pills */}
        {activeTab === 'categories' && (
          <div className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Categories</span>
              <span className="text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-mono">
                {categories.length}
              </span>
            </div>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <motion.button
                  key={cat}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? 'bg-slate-950' : 'bg-slate-300'
                      }`}
                    />
                    <span>{cat}</span>
                  </div>
                  {isSelected && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  )}
                </motion.button>
              );
            })}

            {/* Quick Add Custom Item Button */}
            <div className="pt-3 border-t border-slate-100">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onOpenAddMenuItem}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 hover:bg-amber-100/70 text-slate-800 hover:text-amber-900 border border-slate-200 hover:border-amber-300 rounded-xl text-xs font-black transition-colors cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-600" />
                <span>+ Item / Category</span>
              </motion.button>
            </div>
          </div>
        )}

        {/* TAB 2: Tables Grid with Tactile Selection */}
        {activeTab === 'tables' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                Dining Tables
              </span>
              <button
                onClick={() => setShowAddTable(!showAddTable)}
                className="text-[10px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                + Add Table
              </button>
            </div>

            {showAddTable && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
              >
                <input
                  type="text"
                  placeholder="e.g. T-9 or VIP-1"
                  value={newTableInput}
                  onChange={(e) => setNewTableInput(e.target.value)}
                  className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={() => {
                    if (newTableInput.trim()) {
                      onAddTable(newTableInput.trim());
                      setNewTableInput('');
                      setShowAddTable(false);
                    }
                  }}
                  className="w-full py-1 bg-amber-500 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer"
                >
                  Save Table
                </button>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-1.5">
              {tablesList.map((tbl) => {
                const isSelected = selectedTable === tbl;
                const isOccupied = occupiedTables.includes(tbl);

                return (
                  <motion.div
                    key={tbl}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectTable(tbl)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all relative overflow-hidden ${
                      isOccupied
                        ? 'bg-rose-50 border-rose-300 shadow-sm'
                        : isSelected
                        ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {/* Pure color status dot: Rose if active order/busy, Emerald if free */}
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isOccupied
                            ? 'bg-rose-500 shadow-xs shadow-rose-500/50'
                            : 'bg-emerald-500 shadow-xs shadow-emerald-500/50'
                        }`}
                      />
                      <span
                        className={`font-black text-xs ${
                          isOccupied
                            ? 'text-rose-900'
                            : isSelected
                            ? 'text-amber-900'
                            : 'text-slate-800'
                        }`}
                      >
                        {tbl}
                      </span>
                    </div>

                    {tablesList.length > 2 && !isOccupied && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTable(tbl);
                        }}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-0.5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Staff (Waiters & Riders) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            {/* Waiters */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Waiters
                </span>
                <button
                  onClick={() => setShowAddWaiter(!showAddWaiter)}
                  className="text-[10px] text-amber-600 hover:text-amber-700 font-bold cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {showAddWaiter && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <input
                    type="text"
                    placeholder="Waiter Name"
                    value={newWaiterInput}
                    onChange={(e) => setNewWaiterInput(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (newWaiterInput.trim()) {
                        onAddWaiter(newWaiterInput.trim());
                        setNewWaiterInput('');
                        setShowAddWaiter(false);
                      }
                    }}
                    className="w-full py-1 bg-amber-500 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer"
                  >
                    Add Waiter
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {waitersList.map((w) => {
                  const isSelected = selectedWaiter === w;
                  return (
                    <motion.div
                      key={w}
                      whileHover={{ x: 2 }}
                      onClick={() => onSelectWaiter(w)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-amber-300 font-bold text-amber-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{w}</span>
                      </div>
                      {waitersList.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteWaiter(w);
                          }}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Riders */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  Delivery Riders
                </span>
                <button
                  onClick={() => setShowAddRider(!showAddRider)}
                  className="text-[10px] text-amber-600 hover:text-amber-700 font-bold cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {showAddRider && (
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <input
                    type="text"
                    placeholder="e.g. Tariq (Bykea)"
                    value={newRiderInput}
                    onChange={(e) => setNewRiderInput(e.target.value)}
                    className="w-full text-xs px-2 py-1 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <button
                    onClick={() => {
                      if (newRiderInput.trim()) {
                        onAddRider(newRiderInput.trim());
                        setNewRiderInput('');
                        setShowAddRider(false);
                      }
                    }}
                    className="w-full py-1 bg-amber-500 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer"
                  >
                    Add Rider
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {ridersList.map((r) => {
                  const isSelected = selectedRider === r;
                  return (
                    <motion.div
                      key={r}
                      whileHover={{ x: 2 }}
                      onClick={() => onSelectRider(r)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50 border-amber-300 font-bold text-amber-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <Bike className="w-3.5 h-3.5 text-slate-400" />
                        <span>{r}</span>
                      </div>
                      {ridersList.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteRider(r);
                          }}
                          className="text-slate-300 hover:text-rose-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer System Status & Order Log Action Pills */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/80 space-y-1.5">
        {/* Running / Active Tabs Quick Access Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenActiveTabs || onOpenHistory}
          className="w-full flex items-center justify-between px-3 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-md shadow-amber-500/20 cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-950 animate-ping" />
            <span>Running Orders (Tabs)</span>
          </div>
          <span className="font-mono text-[11px] font-black bg-slate-950 text-amber-400 px-2 py-0.5 rounded-md">
            {activeTabsCount}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenHistory}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>All Completed Logs</span>
          </div>
          <span className="font-mono text-[11px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
            {ordersCount}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenCancelled}
          className="w-full flex items-center justify-between px-3 py-1.5 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-700 transition-colors shadow-2xs cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <XCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Cancelled</span>
          </div>
          <span className="font-mono text-[11px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            {cancelledCount}
          </span>
        </motion.button>
      </div>
    </aside>
  );
};
