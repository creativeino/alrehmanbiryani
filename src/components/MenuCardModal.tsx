import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface MenuCardModalProps {
  onClose: () => void;
}

export const MenuCardModal: React.FC<MenuCardModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-700 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl">
        <div className="p-4 bg-stone-950 border-b border-stone-800 flex items-center justify-between text-white">
          <div>
            <h3 className="font-bold text-base text-amber-400">
              Al. Rehman Biryani &amp; Pakwan Centre - Original Menu Card
            </h3>
            <p className="text-xs text-stone-400">
              Verified Official Rates &amp; Traditional Karachi Items
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 flex flex-col items-center justify-center bg-stone-950/80">
          <img
            src="/menu.jpeg"
            alt="Original Menu Card of Al Rehman Biryani"
            className="max-h-[75vh] w-auto rounded-lg shadow-lg object-contain border border-stone-800"
          />
        </div>

        <div className="p-3 bg-stone-900 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
