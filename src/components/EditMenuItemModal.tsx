'use client';

import React, { useState } from 'react';
import { MenuItem } from '@/data/menu';
import { X, Trash2, Edit3, Image, DollarSign, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface EditMenuItemModalProps {
  item: MenuItem;
  categories: readonly string[];
  onClose: () => void;
  onSave: (updatedItem: MenuItem) => void;
  onDelete: (itemId: string) => void;
}

export const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  item,
  categories,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(item.name);
  const [variant, setVariant] = useState(item.variant);
  const [price, setPrice] = useState(item.price.toString());
  const [category, setCategory] = useState(item.category);
  const [imageUrl, setImageUrl] = useState(item.image);
  const [popular, setPopular] = useState(Boolean(item.popular));
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    onSave({
      ...item,
      name: name.trim(),
      variant: variant.trim(),
      price: Math.max(0, parseFloat(price) || 0),
      category,
      image: imageUrl.trim() || item.image,
      popular,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.18 } }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
        transition={{ type: 'spring', stiffness: 420, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Edit Dish / Pricing</h3>
              <p className="text-[11px] text-slate-400">Update rates or portion details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Dish Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Portion / Variant
              </label>
              <input
                type="text"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                placeholder="Single / Half Kg / 1 Kg"
                required
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Price (Rs.)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-400">
                  Rs.
                </span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full text-xs font-mono font-black pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-bold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none cursor-pointer"
              >
                {categories
                  .filter((c) => c !== 'All')
                  .map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 block mb-1">
              Image URL (Optional)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full text-xs font-medium px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPopular"
              checked={popular}
              onChange={(e) => setPopular(e.target.checked)}
              className="rounded text-amber-500 focus:ring-amber-500 cursor-pointer"
            />
            <label htmlFor="isPopular" className="text-xs font-bold text-slate-700 cursor-pointer">
              Mark as Popular / Hot Item
            </label>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {confirmDelete ? (
              <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-xl border border-rose-200">
                <span className="text-[10px] font-bold text-rose-700 pl-1">Delete item?</span>
                <button
                  type="button"
                  onClick={() => {
                    onDelete(item.id);
                    onClose();
                  }}
                  className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black cursor-pointer"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-1.5 py-1 text-slate-500 hover:text-slate-800 text-[10px]"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
