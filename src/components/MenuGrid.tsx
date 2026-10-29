'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/data/menu';
import {
  Search,
  Plus,
  Check,
  Image as ImageIcon,
  Utensils,
  Flame,
  Edit2,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MenuGridProps {
  items: MenuItem[];
  selectedCategory: string;
  onSelectCategory?: (cat: string) => void;
  categories?: readonly string[];
  onAddToCart: (item: MenuItem, event?: React.MouseEvent) => void;
  onShowOriginalMenu: () => void;
  onEditItem?: (item: MenuItem) => void;
  onResetMenu?: () => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({
  items,
  selectedCategory,
  onSelectCategory,
  categories = [],
  onAddToCart,
  onShowOriginalMenu,
  onEditItem,
  onResetMenu,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedId, setClickedId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.variant.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleItemClick = (item: MenuItem, e: React.MouseEvent) => {
    onAddToCart(item, e);
    setClickedId(item.id);
    setTimeout(() => setClickedId(null), 400);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8fafc] border-r border-slate-200/80">
      {/* Top Search & Filter Bar */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 py-2 sm:py-2.5 flex flex-wrap items-center justify-between gap-2 sm:gap-4 shadow-2xs">
        <div className="relative flex-1 min-w-[180px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-amber-500" />
          <input
            type="text"
            placeholder="Search biryani, pulao, drinks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-amber-500 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
          />
          {searchTerm && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileTap={{ scale: 0.8 }}
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 bg-slate-200 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
            >
              ×
            </motion.button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto">
          {onResetMenu && (
            <button
              onClick={onResetMenu}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              title="Reset all prices and items to original card menu"
            >
              <RotateCcw className="w-3 h-3 text-slate-400" />
              <span>Reset</span>
            </button>
          )}

          <div className="hidden xs:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg border border-slate-200/70 text-xs">
            <span className="text-slate-400 font-medium">Filter:</span>
            <span className="font-extrabold text-amber-800 truncate max-w-[80px] sm:max-w-none">{selectedCategory}</span>
          </div>

          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            onClick={onShowOriginalMenu}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 bg-linear-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 text-amber-900 border border-amber-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden xs:inline">Original Card</span>
            <span className="xs:hidden">Card</span>
          </motion.button>
        </div>
      </div>

      {/* Horizontal Category Quick-Selector for Tablet & Mobile screens */}
      {categories && categories.length > 0 && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory?.(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

      {/* Modern Card Grid with $1000 Fluid Spring Physics & Micro-Glows */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-3 pb-20 lg:pb-3">
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 min-[1800px]:grid-cols-5 gap-2 sm:gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isClicked = clickedId === item.id;
              const isBiryani = item.category.includes('Biryani') || item.category === 'Chicken';
              const isPulao = item.category.includes('Pulao');

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.12 } }}
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 30,
                    delay: Math.min(index * 0.015, 0.15)
                  }}
                  whileHover={{
                    y: -2,
                    scale: 1.015,
                    boxShadow: '0 10px 20px -5px rgba(245, 158, 11, 0.15), 0 3px 8px rgba(0, 0, 0, 0.04)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={(e) => handleItemClick(item, e)}
                  className={`group relative bg-white rounded-xl overflow-hidden border cursor-pointer flex flex-col justify-between select-none transition-colors duration-150 ${
                    isClicked
                      ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-md'
                      : 'border-slate-200/90 hover:border-amber-400 shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
                  }`}
                >
                  {/* Subtle Clean 2D Glow Overlay on Hover */}
                  <div className="absolute inset-0 rounded-xl bg-linear-to-r from-amber-500/0 via-amber-500/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

                  {/* Food Image Banner (Compact Height: 24 / 96px) */}
                  <div className="relative h-24 w-full overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Dark gradient for text legibility */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/15 to-transparent" />
                    
                    {/* Edit Trigger Icon on Hover */}
                    {onEditItem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditItem(item);
                        }}
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-lg bg-black/60 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs z-20 cursor-pointer shadow-sm"
                        title="Edit Dish Name, Price or Variant"
                      >
                        <Edit2 className="w-3 h-3 text-amber-400" />
                      </button>
                    )}

                    {/* Category Pill Tag */}
                    <span
                      className={`absolute top-1.5 left-1.5 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur-md text-white shadow-2xs ${
                        isBiryani
                          ? 'bg-orange-600/90'
                          : isPulao
                          ? 'bg-amber-600/90'
                          : 'bg-emerald-600/90'
                      }`}
                    >
                      {item.category}
                    </span>

                    {item.popular && (
                      <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-[8px] font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md border border-amber-400/40 px-1.5 py-0.2 rounded-full shadow-2xs">
                        <Flame className="w-2 h-2 text-orange-400 fill-orange-400" />
                        Hot
                      </span>
                    )}

                    {/* Price Tag with Luxury Glassmorphism */}
                    <div className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-md text-slate-900 font-mono font-black text-[11px] px-2 py-0.5 rounded shadow-sm border border-slate-200/60 group-hover:bg-amber-400 group-hover:text-slate-950 transition-colors">
                      Rs. {item.price}
                    </div>
                  </div>

                  {/* Compact Content Details */}
                  <div className="p-2 flex items-center justify-between bg-white relative z-10">
                    <div className="min-w-0 pr-1.5">
                      <h3 className="font-extrabold text-slate-900 text-[11px] truncate leading-tight group-hover:text-amber-800 transition-colors">
                        {item.name}
                      </h3>
                      <div className="text-[10px] font-bold text-amber-700 leading-none mt-0.5">
                        {item.variant}
                      </div>
                    </div>

                    {/* Add Button with High-Precision 2D Spring */}
                    <motion.div
                      animate={
                        isClicked
                          ? { scale: 1.25 }
                          : { scale: 1 }
                      }
                      transition={{ type: 'spring', stiffness: 600, damping: 20 }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold shrink-0 transition-all duration-150 shadow-2xs ${
                        isClicked
                          ? 'bg-emerald-500 text-white shadow-emerald-500/40 shadow-sm'
                          : 'bg-amber-100/70 text-amber-900 group-hover:bg-linear-to-tr group-hover:from-amber-500 group-hover:to-orange-500 group-hover:text-slate-950 group-hover:shadow-amber-500/30'
                      }`}
                    >
                      {isClicked ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-64 flex flex-col items-center justify-center text-slate-400"
          >
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <Utensils className="w-8 h-8 text-slate-300 stroke-[1.5]" />
            </div>
            <p className="text-sm font-bold text-slate-600">No dishes found in this category</p>
            <p className="text-xs text-slate-400 mt-0.5">Try searching another portion or keyword</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
