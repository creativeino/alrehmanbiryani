import React, { useState } from 'react';
import { MenuItem } from '@/data/menu';
import { X, Plus, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AddMenuItemModalProps {
  categories: string[];
  onClose: () => void;
  onAddItem: (item: MenuItem, newCategoryName?: string) => void;
}

export const AddMenuItemModal: React.FC<AddMenuItemModalProps> = ({
  categories,
  onClose,
  onAddItem,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>(categories.find((c) => c !== 'All') || 'Chicken');
  const [isCreatingNewCategory, setIsCreatingNewCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [variant, setVariant] = useState('Single');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;

    const finalCategory = isCreatingNewCategory && customCategoryInput.trim()
      ? customCategoryInput.trim()
      : category;

    const newItem: MenuItem = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category: finalCategory,
      variant: variant.trim() || 'Standard',
      price: parseFloat(price) || 0,
      image:
        imageUrl.trim() ||
        'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
      description: description.trim() || undefined,
    };

    onAddItem(
      newItem,
      isCreatingNewCategory && customCategoryInput.trim() ? customCategoryInput.trim() : undefined
    );
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
        <div className="bg-slate-900 text-white p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm">Add New Food Item</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-slate-800 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Dish Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Special Zarda, Mutton Biryani, Gulab Jamun"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Selector or Add New Custom Category */}
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700">Category *</label>
              <button
                type="button"
                onClick={() => setIsCreatingNewCategory(!isCreatingNewCategory)}
                className="text-[10px] font-bold text-amber-700 hover:underline cursor-pointer flex items-center gap-0.5"
              >
                <PlusCircle className="w-3 h-3" />
                {isCreatingNewCategory ? 'Choose Existing' : '+ New Category'}
              </button>
            </div>

            {isCreatingNewCategory ? (
              <input
                type="text"
                required
                autoFocus
                placeholder="Type new category name (e.g. Desserts, BBQ, Roti)"
                value={customCategoryInput}
                onChange={(e) => setCustomCategoryInput(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-amber-400 rounded-lg text-xs font-bold text-slate-900 focus:outline-none"
              />
            ) : (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                {categories.filter((c) => c !== 'All').map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Portion / Variant *</label>
              <input
                type="text"
                required
                placeholder="e.g. Single, Half Kg, 1 Kg, Piece"
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Price (Rs) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Image URL (Optional)</label>
            <input
              type="url"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Description (Optional)</label>
            <textarea
              rows={2}
              placeholder="Freshly prepared delicious item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs resize-none focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-black cursor-pointer shadow-xs"
            >
              Add To Menu
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
