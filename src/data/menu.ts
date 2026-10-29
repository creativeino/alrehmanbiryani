export interface MenuItem {
  id: string;
  name: string;
  category: string;
  variant: string;
  price: number;
  popular?: boolean;
  image: string;
  description?: string;
}

export const DEFAULT_CATEGORIES = [
  'All',
  'Chicken',
  'Beef Biryani',
  'Beef Afghani Pulao',
  'White Beef Pulao',
  'Chicken Pulao',
  'Beverages'
];

export const MENU_ITEMS: MenuItem[] = [
  // 1. Chicken
  {
    id: 'chk-bir-single',
    name: 'Chicken Biryani',
    category: 'Chicken',
    variant: 'Single',
    price: 220,
    popular: true,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80',
    description: 'Traditional spicy Karachi biryani with tender chicken & aloo.'
  },
  {
    id: 'chk-bir-half',
    name: 'Chicken Biryani',
    category: 'Chicken',
    variant: 'Half Kg',
    price: 280,
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=80',
    description: 'Fresh dum-cooked half kg spicy chicken biryani.'
  },
  {
    id: 'chk-bir-1kg',
    name: 'Chicken Biryani',
    category: 'Chicken',
    variant: '1 Kg',
    price: 560,
    popular: true,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    description: '1 Kg family pack of signature Al Rehman chicken biryani.'
  },
  {
    id: 'sada-bir-half',
    name: 'Sada Biryani',
    category: 'Chicken',
    variant: 'Half Kg',
    price: 200,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    description: 'Fragrant masala-infused biryani rice (without meat).'
  },
  {
    id: 'sada-bir-1kg',
    name: 'Sada Biryani',
    category: 'Chicken',
    variant: '1 Kg',
    price: 400,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=80',
    description: '1 Kg fragrant masala biryani rice.'
  },

  // 2. Beef Biryani
  {
    id: 'beef-bir-single',
    name: 'Beef Biryani',
    category: 'Beef Biryani',
    variant: 'Single',
    price: 300,
    popular: true,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=80',
    description: 'Signature tender beef boti cooked in traditional rich spices.'
  },
  {
    id: 'beef-bir-half',
    name: 'Beef Biryani',
    category: 'Beef Biryani',
    variant: 'Half Kg',
    price: 380,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=80',
    description: 'Half Kg slow-cooked tender beef biryani.'
  },
  {
    id: 'beef-bir-1kg',
    name: 'Beef Biryani',
    category: 'Beef Biryani',
    variant: '1 Kg',
    price: 760,
    popular: true,
    image: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=500&auto=format&fit=crop&q=80',
    description: '1 Kg traditional royal beef biryani.'
  },

  // 3. Beef Afghani Pulao
  {
    id: 'afghani-pulao-single',
    name: 'Beef Afghani Pulao',
    category: 'Beef Afghani Pulao',
    variant: 'Single',
    price: 300,
    popular: true,
    image: 'https://images.unsplash.com/photo-1785571903568-f53fcff99181?w=500&auto=format&fit=crop&q=80',
    description: 'Long-grain pulao topped with carrots, raisins & succulent beef.'
  },
  {
    id: 'afghani-pulao-half',
    name: 'Beef Afghani Pulao',
    category: 'Beef Afghani Pulao',
    variant: 'Half Kg',
    price: 380,
    image: 'https://images.unsplash.com/photo-1785571903557-dce44dcf3eab?w=500&auto=format&fit=crop&q=80',
    description: 'Half Kg authentic Kabuli Afghani beef pulao.'
  },
  {
    id: 'afghani-pulao-1kg',
    name: 'Beef Afghani Pulao',
    category: 'Beef Afghani Pulao',
    variant: '1 Kg',
    price: 760,
    popular: true,
    image: 'https://images.unsplash.com/photo-1785571903568-f53fcff99181?w=500&auto=format&fit=crop&q=80',
    description: '1 Kg traditional Afghani pulao with dry fruits & beef chunk.'
  },

  // 4. White Beef Pulao
  {
    id: 'white-beef-single',
    name: 'White Beef Pulao',
    category: 'White Beef Pulao',
    variant: 'Single',
    price: 300,
    image: 'https://images.unsplash.com/photo-1785571903568-f53fcff99181?w=500&auto=format&fit=crop&q=80',
    description: 'Authentic Yakhni white beef pulao simmered with whole spices.'
  },
  {
    id: 'white-beef-half',
    name: 'White Beef Pulao',
    category: 'White Beef Pulao',
    variant: 'Half Kg',
    price: 380,
    image: 'https://images.unsplash.com/photo-1785571903557-dce44dcf3eab?w=500&auto=format&fit=crop&q=80',
    description: 'Half Kg fragrant yakhni pulao with juicy beef chunks.'
  },
  {
    id: 'white-beef-1kg',
    name: 'White Beef Pulao',
    category: 'White Beef Pulao',
    variant: '1 Kg',
    price: 760,
    image: 'https://images.unsplash.com/photo-1785571903568-f53fcff99181?w=500&auto=format&fit=crop&q=80',
    description: '1 Kg slow-simmered aromatic white beef yakhni pulao.'
  },

  // 5. Chicken Pulao
  {
    id: 'chk-pulao-single',
    name: 'Chicken Pulao',
    category: 'Chicken Pulao',
    variant: 'Single',
    price: 220,
    image: 'https://images.unsplash.com/photo-1785571903557-dce44dcf3eab?w=500&auto=format&fit=crop&q=80',
    description: 'Savory chicken yakhni pulao with authentic desi taste.'
  },
  {
    id: 'chk-pulao-half',
    name: 'Chicken Pulao',
    category: 'Chicken Pulao',
    variant: 'Half Kg',
    price: 280,
    image: 'https://images.unsplash.com/photo-1785571903568-f53fcff99181?w=500&auto=format&fit=crop&q=80',
    description: 'Half Kg flavorful Chicken Yakhni Pulao.'
  },
  {
    id: 'chk-pulao-1kg',
    name: 'Chicken Pulao',
    category: 'Chicken Pulao',
    variant: '1 Kg',
    price: 560,
    image: 'https://images.unsplash.com/photo-1785571903557-dce44dcf3eab?w=500&auto=format&fit=crop&q=80',
    description: '1 Kg classic chicken yakhni pulao.'
  },

  // 6. Beverages
  {
    id: 'cold-drink-can',
    name: 'Cold Drink Can (330ml)',
    category: 'Beverages',
    variant: '330ml Can',
    price: 90,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    description: 'Chilled refreshing drink (Pakola / Coke / Sprite).'
  },
  {
    id: 'cold-drink-1-5l',
    name: 'Cold Drink 1.5 Liter',
    category: 'Beverages',
    variant: '1.5L Bottle',
    price: 220,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    description: 'Family size chilled soft drink.'
  },
  {
    id: 'mineral-water',
    name: 'Mineral Water (500ml)',
    category: 'Beverages',
    variant: '500ml Bottle',
    price: 50,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=500&auto=format&fit=crop&q=80',
    description: 'Clean drinking water.'
  }
];

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export type OrderType = 'Dine-In' | 'Takeaway' | 'Delivery';
export type PaymentMethod = 'Cash' | 'EasyPaisa' | 'JazzCash';

export interface Order {
  id: string;
  orderNumber: number;
  date: string;
  time: string;
  orderType: OrderType;
  tableNumber?: string;
  waiterName?: string;
  riderName?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  discount: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  cashReceived?: number;
  change?: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  isHold?: boolean; // For running / ongoing dine-in or open tab
}
