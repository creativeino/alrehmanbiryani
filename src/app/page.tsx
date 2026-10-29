'use client';

import React, { useState, useEffect } from 'react';
import {
  MENU_ITEMS,
  DEFAULT_CATEGORIES,
  MenuItem,
  CartItem,
  OrderType,
  Order
} from '@/data/menu';
import { LeftSidebar } from '@/components/LeftSidebar';
import { MenuGrid } from '@/components/MenuGrid';
import { CartSidebar } from '@/components/CartSidebar';
import { ReceiptModal } from '@/components/ReceiptModal';
import { OrderHistoryModal } from '@/components/OrderHistoryModal';
import { MenuCardModal } from '@/components/MenuCardModal';
import { AddMenuItemModal } from '@/components/AddMenuItemModal';
import { EditMenuItemModal } from '@/components/EditMenuItemModal';
import { FlyingItemBurst, Particle } from '@/components/FlyingItemBurst';
import {
  Clock,
  Edit3,
  Menu as MenuIcon,
  ShoppingBag,
  Layers,
  FileCheck2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function POSPage() {
  const [menuList, setMenuList] = useState<MenuItem[]>(MENU_ITEMS);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [orderType, setOrderType] = useState<OrderType>('Dine-In');
  const [burstParticles, setBurstParticles] = useState<Particle[]>([]);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileCart, setShowMobileCart] = useState(false);

  // Tables, Waiters, Riders
  const [selectedTable, setSelectedTable] = useState<string>('T-1');
  const [tablesList, setTablesList] = useState<string[]>([
    'T-1',
    'T-2',
    'T-3',
    'T-4',
    'T-5',
    'T-6',
    'T-7',
    'T-8',
    'Family-1',
    'Family-2'
  ]);

  const [selectedWaiter, setSelectedWaiter] = useState<string>('Aslam');
  const [waitersList, setWaitersList] = useState<string[]>([
    'Aslam',
    'Rashid',
    'Bilal',
    'Farhan',
    'Tariq'
  ]);

  const [selectedRider, setSelectedRider] = useState<string>('Kamran (Bykea)');
  const [ridersList, setRidersList] = useState<string[]>([
    'Kamran (Bykea)',
    'Zubair (Rider)',
    'Naveed (Shop Rider)'
  ]);

  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);

  // Modals
  const [activeReceiptOrder, setActiveReceiptOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyDefaultFilter, setHistoryDefaultFilter] = useState<'Completed' | 'Pending' | 'Cancelled' | 'All'>('All');
  const [showMenuCardModal, setShowMenuCardModal] = useState(false);
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDateStr, setCurrentDateStr] = useState<string>('');
  const [orderTokenCounter, setOrderTokenCounter] = useState<number>(101);

  // Live digital clock & date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDateStr(now.toLocaleDateString('en-GB'));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load state from Database (with LocalStorage fallback)
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/data');
        const json = await res.json();
        if (json.success && json.data) {
          const db = json.data;
          if (db.menu && db.menu.length > 0) setMenuList(db.menu);
          if (db.categories && db.categories.length > 0) setCategories(db.categories);
          if (db.orders) setOrderHistory(db.orders);
          if (db.tables && db.tables.length > 0) setTablesList(db.tables);
          if (db.waiters && db.waiters.length > 0) setWaitersList(db.waiters);
          if (db.riders && db.riders.length > 0) setRidersList(db.riders);
          if (db.settings?.orderTokenCounter) {
            setOrderTokenCounter(db.settings.orderTokenCounter);
          }
          return;
        }
      } catch (err) {
        console.warn('API fetch failed, falling back to local storage', err);
      }

      // Fallback to localStorage if API is unreachable
      try {
        const savedOrders = localStorage.getItem('al_rehman_orders');
        if (savedOrders) setOrderHistory(JSON.parse(savedOrders));

        const savedCategories = localStorage.getItem('al_rehman_categories');
        if (savedCategories) setCategories(JSON.parse(savedCategories));

        const savedWaiters = localStorage.getItem('al_rehman_waiters');
        if (savedWaiters) setWaitersList(JSON.parse(savedWaiters));

        const savedTables = localStorage.getItem('al_rehman_tables');
        if (savedTables) setTablesList(JSON.parse(savedTables));

        const savedRiders = localStorage.getItem('al_rehman_riders');
        if (savedRiders) setRidersList(JSON.parse(savedRiders));

        const savedCustomMenu = localStorage.getItem('al_rehman_custom_menu');
        if (savedCustomMenu) setMenuList(JSON.parse(savedCustomMenu));
      } catch (e) {
        console.error('LocalStorage error', e);
      }
    }

    loadData();
  }, []);

  // Sync state to Database API helper
  const syncToDatabase = async (payload: Record<string, any>) => {
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('Failed to sync with database:', e);
    }
  };

  // Table handlers
  const handleAddTable = (t: string) => {
    if (!tablesList.includes(t)) {
      const updated = [...tablesList, t];
      setTablesList(updated);
      setSelectedTable(t);
      localStorage.setItem('al_rehman_tables', JSON.stringify(updated));
      syncToDatabase({ tables: updated });
    }
  };

  const handleDeleteTable = (t: string) => {
    const updated = tablesList.filter((item) => item !== t);
    setTablesList(updated);
    if (selectedTable === t) setSelectedTable(updated[0] || '');
    localStorage.setItem('al_rehman_tables', JSON.stringify(updated));
    syncToDatabase({ tables: updated });
  };

  // Waiter handlers
  const handleAddWaiter = (name: string) => {
    if (!waitersList.includes(name)) {
      const updated = [...waitersList, name];
      setWaitersList(updated);
      setSelectedWaiter(name);
      localStorage.setItem('al_rehman_waiters', JSON.stringify(updated));
      syncToDatabase({ waiters: updated });
    }
  };

  const handleDeleteWaiter = (name: string) => {
    const updated = waitersList.filter((w) => w !== name);
    setWaitersList(updated);
    if (selectedWaiter === name) setSelectedWaiter(updated[0] || '');
    localStorage.setItem('al_rehman_waiters', JSON.stringify(updated));
    syncToDatabase({ waiters: updated });
  };

  // Rider handlers
  const handleAddRider = (name: string) => {
    if (!ridersList.includes(name)) {
      const updated = [...ridersList, name];
      setRidersList(updated);
      setSelectedRider(name);
      localStorage.setItem('al_rehman_riders', JSON.stringify(updated));
      syncToDatabase({ riders: updated });
    }
  };

  const handleDeleteRider = (name: string) => {
    const updated = ridersList.filter((r) => r !== name);
    setRidersList(updated);
    if (selectedRider === name) setSelectedRider(updated[0] || '');
    localStorage.setItem('al_rehman_riders', JSON.stringify(updated));
    syncToDatabase({ riders: updated });
  };

  // Add new food item to menu with optional custom category
  const handleAddMenuItem = (newItem: MenuItem, newCategoryName?: string) => {
    let updatedCats = categories;
    if (newCategoryName && !categories.includes(newCategoryName)) {
      updatedCats = [...categories, newCategoryName];
      setCategories(updatedCats);
      localStorage.setItem('al_rehman_categories', JSON.stringify(updatedCats));
    }

    const updatedMenu = [newItem, ...menuList];
    setMenuList(updatedMenu);
    localStorage.setItem('al_rehman_custom_menu', JSON.stringify(updatedMenu));
    syncToDatabase({ menu: updatedMenu, categories: updatedCats });
  };

  // Update existing food item
  const handleUpdateMenuItem = (updatedItem: MenuItem) => {
    const updated = menuList.map((m) => (m.id === updatedItem.id ? updatedItem : m));
    setMenuList(updated);
    localStorage.setItem('al_rehman_custom_menu', JSON.stringify(updated));
    syncToDatabase({ menu: updated });
  };

  // Delete food item from menu
  const handleDeleteMenuItem = (itemId: string) => {
    const updated = menuList.filter((m) => m.id !== itemId);
    setMenuList(updated);
    localStorage.setItem('al_rehman_custom_menu', JSON.stringify(updated));
    syncToDatabase({ menu: updated });
  };

  // Reset menu back to physical card defaults
  const handleResetMenuToDefault = async () => {
    if (confirm('Reset entire menu and prices back to original menu card?')) {
      setMenuList(MENU_ITEMS);
      setCategories(DEFAULT_CATEGORIES);
      localStorage.removeItem('al_rehman_custom_menu');
      localStorage.removeItem('al_rehman_categories');
      await syncToDatabase({ action: 'reset_menu' });
    }
  };

  // Cart operations with Flying Particle Burst
  const handleAddToCart = (item: MenuItem, e?: React.MouseEvent) => {
    // Trigger Flying Burst Animation
    if (e) {
      const clickX = e.clientX;
      const clickY = e.clientY;
      // Cart target is roughly right sidebar top
      const targetX = window.innerWidth - 180;
      const targetY = 120;

      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
        targetX,
        targetY,
        label: `${item.name} (${item.variant})`,
      };

      setBurstParticles((prev) => [...prev, newParticle]);
    }

    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleParticleComplete = (id: number) => {
    setBurstParticles((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const handleUpdateNotes = (itemId: string, notes: string) => {
    setCart((prev) =>
      prev.map((ci) => (ci.item.id === itemId ? { ...ci, notes } : ci))
    );
  };

  const handleClearCart = () => {
    setCart([]);
    setEditingOrderId(null);
  };

  // Save / Update Checkout (Final Settle)
  const handleCheckout = (orderData: Partial<Order>) => {
    const now = new Date();

    if (editingOrderId) {
      const updatedList = orderHistory.map((o) => {
        if (o.id === editingOrderId) {
          return {
            ...o,
            orderType: orderData.orderType || o.orderType,
            tableNumber: orderData.tableNumber,
            waiterName: orderData.waiterName,
            riderName: orderData.riderName,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerAddress: orderData.customerAddress,
            paymentMethod: orderData.paymentMethod || o.paymentMethod,
            items: [...cart],
            subtotal: orderData.subtotal || 0,
            discount: 0,
            deliveryCharge: orderData.deliveryCharge || 0,
            total: orderData.total || 0,
            cashReceived: orderData.cashReceived,
            change: orderData.change,
            status: 'Completed' as const,
            isHold: false,
          };
        }
        return o;
      });

      const updatedOrder = updatedList.find((o) => o.id === editingOrderId);
      setOrderHistory(updatedList);
      localStorage.setItem('al_rehman_orders', JSON.stringify(updatedList));
      syncToDatabase({ orders: updatedList });
      setEditingOrderId(null);
      setCart([]);
      if (updatedOrder) setActiveReceiptOrder(updatedOrder);
      return;
    }

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderTokenCounter,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderType: orderData.orderType || orderType,
      tableNumber: orderData.tableNumber,
      waiterName: orderData.waiterName,
      riderName: orderData.riderName,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      paymentMethod: orderData.paymentMethod || 'Cash',
      items: [...cart],
      subtotal: orderData.subtotal || 0,
      discount: 0,
      tax: 0,
      deliveryCharge: orderData.deliveryCharge || 0,
      total: orderData.total || 0,
      cashReceived: orderData.cashReceived,
      change: orderData.change,
      status: 'Completed',
      isHold: false,
    };

    try {
      // $1000 Luxury Multi-Stage Celebration Confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7, x: 0.5 },
        colors: ['#f59e0b', '#fbbf24', '#10b981', '#f97316', '#ffffff'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f59e0b', '#10b981'],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#f59e0b', '#10b981'],
        });
      }, 150);
    } catch (e) {
      // ignore
    }

    const nextCounter = orderTokenCounter + 1;
    const updatedOrders = [newOrder, ...orderHistory];
    setOrderHistory(updatedOrders);
    setOrderTokenCounter(nextCounter);
    setCart([]);
    setActiveReceiptOrder(newOrder);

    localStorage.setItem('al_rehman_orders', JSON.stringify(updatedOrders));
    syncToDatabase({ orders: updatedOrders, orderTokenCounter: nextCounter });
  };

  // Hold / Running Dine-In Order (Open Tab)
  const handleHoldOrder = (orderData: Partial<Order>) => {
    const now = new Date();

    if (editingOrderId) {
      // Update existing running order
      const updatedList = orderHistory.map((o) => {
        if (o.id === editingOrderId) {
          return {
            ...o,
            orderType: orderData.orderType || o.orderType,
            tableNumber: orderData.tableNumber,
            waiterName: orderData.waiterName,
            riderName: orderData.riderName,
            customerName: orderData.customerName,
            customerPhone: orderData.customerPhone,
            customerAddress: orderData.customerAddress,
            items: [...cart],
            subtotal: orderData.subtotal || 0,
            deliveryCharge: orderData.deliveryCharge || 0,
            total: orderData.total || 0,
            status: 'Pending' as const,
            isHold: true,
          };
        }
        return o;
      });

      setOrderHistory(updatedList);
      localStorage.setItem('al_rehman_orders', JSON.stringify(updatedList));
      syncToDatabase({ orders: updatedList });
      setEditingOrderId(null);
      setCart([]);
      return;
    }

    // Create new running order / open tab
    const holdOrder: Order = {
      id: `ord-hold-${Date.now()}`,
      orderNumber: orderTokenCounter,
      date: now.toLocaleDateString('en-GB'),
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      orderType: orderData.orderType || orderType,
      tableNumber: orderData.tableNumber,
      waiterName: orderData.waiterName,
      riderName: orderData.riderName,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerAddress: orderData.customerAddress,
      paymentMethod: orderData.paymentMethod || 'Cash',
      items: [...cart],
      subtotal: orderData.subtotal || 0,
      discount: 0,
      tax: 0,
      deliveryCharge: orderData.deliveryCharge || 0,
      total: orderData.total || 0,
      status: 'Pending',
      isHold: true,
    };

    const nextCounter = orderTokenCounter + 1;
    const updatedOrders = [holdOrder, ...orderHistory];
    setOrderHistory(updatedOrders);
    setOrderTokenCounter(nextCounter);
    setCart([]);
    localStorage.setItem('al_rehman_orders', JSON.stringify(updatedOrders));
    syncToDatabase({ orders: updatedOrders, orderTokenCounter: nextCounter });
  };

  // Edit order
  const handleEditOrder = (order: Order) => {
    setCart(order.items);
    setOrderType(order.orderType);
    if (order.tableNumber) setSelectedTable(order.tableNumber);
    if (order.waiterName) setSelectedWaiter(order.waiterName);
    if (order.riderName) setSelectedRider(order.riderName);
    setEditingOrderId(order.id);
    setShowHistoryModal(false);
  };

  // Cancel order (mark status as Cancelled)
  const handleCancelOrder = (orderId: string, reason?: string) => {
    const updated = orderHistory.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Cancelled' as const,
        };
      }
      return o;
    });
    setOrderHistory(updated);
    localStorage.setItem('al_rehman_orders', JSON.stringify(updated));
    syncToDatabase({ orders: updated });
  };

  // Restore order to Completed
  const handleRestoreOrder = (orderId: string) => {
    const updated = orderHistory.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Completed' as const,
        };
      }
      return o;
    });
    setOrderHistory(updated);
    localStorage.setItem('al_rehman_orders', JSON.stringify(updated));
    syncToDatabase({ orders: updated });
  };

  // Permanent Delete
  const handleDeleteOrder = (orderId: string) => {
    const updated = orderHistory.filter((o) => o.id !== orderId);
    setOrderHistory(updated);
    localStorage.setItem('al_rehman_orders', JSON.stringify(updated));
    syncToDatabase({ orders: updated });
  };

  const todayOrders = currentDateStr
    ? orderHistory.filter((o) => o.date === currentDateStr)
    : orderHistory;
  const todayOrdersCount = todayOrders.length;
  const completedCount = todayOrders.filter((o) => o.status === 'Completed').length;
  const runningTabs = orderHistory.filter((o) => o.status === 'Pending');
  const runningTabsCount = runningTabs.length;
  const cancelledCount = todayOrders.filter((o) => o.status === 'Cancelled').length;

  // Tables currently occupied by running tabs
  const occupiedTables = runningTabs
    .filter((o) => o.orderType === 'Dine-In' && o.tableNumber)
    .map((o) => o.tableNumber as string);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.item.price * item.quantity, 0);

  return (
    <div className="flex h-screen h-[100dvh] w-screen bg-slate-50 text-slate-800 overflow-hidden font-sans select-none relative">
      {/* 1. Left-Hand Dynamic Slidebar (Responsive Desktop + Mobile Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 max-w-[85vw] transition-transform duration-300 xl:static xl:w-64 xl:max-w-none xl:translate-x-0 ${
          showMobileSidebar ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <LeftSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            setShowMobileSidebar(false);
          }}
          ordersCount={completedCount}
          activeTabsCount={runningTabsCount}
          cancelledCount={cancelledCount}
          onOpenHistory={() => {
            setHistoryDefaultFilter('Completed');
            setShowHistoryModal(true);
            setShowMobileSidebar(false);
          }}
          onOpenActiveTabs={() => {
            setHistoryDefaultFilter('Pending');
            setShowHistoryModal(true);
            setShowMobileSidebar(false);
          }}
          onOpenCancelled={() => {
            setHistoryDefaultFilter('Cancelled');
            setShowHistoryModal(true);
            setShowMobileSidebar(false);
          }}
          onOpenMenuCard={() => {
            setShowMenuCardModal(true);
            setShowMobileSidebar(false);
          }}
          onOpenAddMenuItem={() => {
            setShowAddMenuModal(true);
            setShowMobileSidebar(false);
          }}
          tablesList={tablesList}
          selectedTable={selectedTable}
          occupiedTables={occupiedTables}
          onSelectTable={(tbl) => {
            setSelectedTable(tbl);
            setShowMobileSidebar(false);
          }}
          onAddTable={handleAddTable}
          onDeleteTable={handleDeleteTable}
          waitersList={waitersList}
          selectedWaiter={selectedWaiter}
          onSelectWaiter={(w) => {
            setSelectedWaiter(w);
            setShowMobileSidebar(false);
          }}
          onAddWaiter={handleAddWaiter}
          onDeleteWaiter={handleDeleteWaiter}
          ridersList={ridersList}
          selectedRider={selectedRider}
          onSelectRider={(r) => {
            setSelectedRider(r);
            setShowMobileSidebar(false);
          }}
          onAddRider={handleAddRider}
          onDeleteRider={handleDeleteRider}
          onCloseMobile={() => setShowMobileSidebar(false)}
        />
      </div>

      {/* Backdrop for Mobile Sidebar */}
      {showMobileSidebar && (
        <div
          onClick={() => setShowMobileSidebar(false)}
          className="fixed inset-0 bg-black/60 z-30 xl:hidden backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* 2. Main Middle Menu Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Responsive Top Header Bar */}
        <header className="h-12 sm:h-13 bg-white border-b border-slate-200 px-2 sm:px-4 md:px-6 flex items-center justify-between z-10 shrink-0 gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            {/* Mobile / Tablet Menu Drawer Toggle Button */}
            <button
              onClick={() => setShowMobileSidebar(true)}
              className="xl:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer shrink-0"
              title="Open Navigation"
              aria-label="Open Navigation Menu"
            >
              <MenuIcon className="w-4 h-4" />
            </button>

            <h2 className="text-xs sm:text-sm font-black text-slate-900 uppercase truncate">
              Counter Terminal
            </h2>
            <span className="hidden xs:inline-block text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
              Live
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 text-xs shrink-0">
            {/* Live Free vs Occupied Table Counter */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {tablesList.length - occupiedTables.length} Free
              </span>
              <span className="text-slate-300">|</span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                {occupiedTables.length} Busy
              </span>
            </div>

            {editingOrderId && (
              <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 text-amber-900 px-2 py-0.5 rounded-md font-bold text-[10px]">
                <Edit3 className="w-3 h-3 shrink-0" />
                <span className="hidden md:inline">Editing Active Order</span>
              </div>
            )}

            <div className="hidden md:flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 text-slate-600 text-[11px]">
              <Clock className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="font-mono font-bold text-slate-800">{currentTime || '12:00'}</span>
            </div>

            {/* Daily Order Tickets Count Pill */}
            <div
              onClick={() => {
                setHistoryDefaultFilter('All');
                setShowHistoryModal(true);
              }}
              className="flex items-center gap-1 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 px-2 sm:px-2.5 py-1 rounded-md cursor-pointer transition-colors shadow-2xs"
              title="Today's Total Order Tickets"
            >
              <FileCheck2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden sm:inline text-[10px] font-bold text-amber-800">Today:</span>
              <strong className="text-xs font-mono font-black text-amber-950">
                {todayOrdersCount}
              </strong>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md border border-slate-200 text-slate-600 text-[11px]">
              <span className="text-[10px] font-mono font-black text-slate-900">Token #{orderTokenCounter}</span>
            </div>

            {/* Mobile / Tablet Cart / Ticket Toggle Button */}
            <button
              onClick={() => setShowMobileCart(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer shrink-0 transition-transform active:scale-95"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{cartItemCount}</span>
            </button>
          </div>
        </header>

        {/* Menu Grid */}
        <MenuGrid
          items={menuList}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          categories={categories}
          onAddToCart={handleAddToCart}
          onShowOriginalMenu={() => setShowMenuCardModal(true)}
          onEditItem={(item) => setEditingMenuItem(item)}
          onResetMenu={handleResetMenuToDefault}
        />
      </div>

      {/* 3. Right-Hand Cart Sidebar (Responsive Desktop + Mobile/Tablet Drawer) */}
      <div
        className={`fixed inset-y-0 right-0 z-40 w-80 sm:w-88 max-w-[90vw] lg:w-76 xl:w-84 2xl:w-[350px] transition-transform duration-300 lg:static lg:max-w-none lg:translate-x-0 ${
          showMobileCart ? 'translate-x-0 shadow-2xl' : 'translate-x-full'
        }`}
      >
        <CartSidebar
          cart={cart}
          orderType={orderType}
          setOrderType={setOrderType}
          selectedTable={selectedTable}
          setSelectedTable={setSelectedTable}
          occupiedTables={occupiedTables}
          tablesList={tablesList}
          selectedWaiter={selectedWaiter}
          setSelectedWaiter={setSelectedWaiter}
          waitersList={waitersList}
          onAddWaiter={handleAddWaiter}
          onDeleteWaiter={handleDeleteWaiter}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onUpdateNotes={handleUpdateNotes}
          onClearCart={handleClearCart}
          onCheckout={(orderData) => {
            handleCheckout(orderData);
            setShowMobileCart(false);
          }}
          onHoldOrder={(orderData) => {
            handleHoldOrder(orderData);
            setShowMobileCart(false);
          }}
          isEditingActiveOrder={Boolean(editingOrderId)}
          onCloseMobile={() => setShowMobileCart(false)}
        />
      </div>

      {/* Backdrop for Mobile Cart */}
      {showMobileCart && (
        <div
          onClick={() => setShowMobileCart(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-xs transition-opacity animate-in fade-in"
        />
      )}

      {/* Floating Bottom Bar for Mobile / Small Tablet Screen if Cart has items */}
      {cartItemCount > 0 && !showMobileCart && (
        <div className="fixed bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-6 lg:hidden z-20">
          <button
            onClick={() => setShowMobileCart(true)}
            className="w-full py-3 px-4 bg-linear-to-r from-amber-500 via-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-2xl flex items-center justify-between animate-shimmer-sweep active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-slate-950 text-amber-400 flex items-center justify-center font-mono text-xs font-black">
                {cartItemCount}
              </span>
              <span>View Current Order</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-sm font-black">
              <span>Rs. {cartSubtotal}</span>
              <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded">Checkout &rarr;</span>
            </div>
          </button>
        </div>
      )}

      {/* Modals */}
      <FlyingItemBurst
        particles={burstParticles}
        onComplete={handleParticleComplete}
      />

      {activeReceiptOrder && (
        <ReceiptModal
          order={activeReceiptOrder}
          onClose={() => setActiveReceiptOrder(null)}
        />
      )}

      {showHistoryModal && (
        <OrderHistoryModal
          orders={orderHistory}
          defaultFilter={historyDefaultFilter}
          onClose={() => setShowHistoryModal(false)}
          onViewOrderReceipt={(order) => {
            setShowHistoryModal(false);
            setActiveReceiptOrder(order);
          }}
          onEditOrder={handleEditOrder}
          onDeleteOrder={handleDeleteOrder}
          onCancelOrder={handleCancelOrder}
          onRestoreOrder={handleRestoreOrder}
        />
      )}

      {showMenuCardModal && (
        <MenuCardModal onClose={() => setShowMenuCardModal(false)} />
      )}

      {showAddMenuModal && (
        <AddMenuItemModal
          categories={categories}
          onClose={() => setShowAddMenuModal(false)}
          onAddItem={handleAddMenuItem}
        />
      )}

      {editingMenuItem && (
        <EditMenuItemModal
          item={editingMenuItem}
          categories={categories}
          onClose={() => setEditingMenuItem(null)}
          onSave={handleUpdateMenuItem}
          onDelete={handleDeleteMenuItem}
        />
      )}
    </div>
  );
}
