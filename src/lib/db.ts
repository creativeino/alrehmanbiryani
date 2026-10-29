import fs from 'fs';
import path from 'path';
import { MenuItem, Order, MENU_ITEMS, DEFAULT_CATEGORIES } from '@/data/menu';

export interface DatabaseSchema {
  menu: MenuItem[];
  categories: string[];
  orders: Order[];
  tables: string[];
  waiters: string[];
  riders: string[];
  settings: {
    restaurantName: string;
    orderTokenCounter: number;
    lastUpdated: string;
  };
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'pos_database.json');

const INITIAL_DATA: DatabaseSchema = {
  menu: MENU_ITEMS,
  categories: DEFAULT_CATEGORIES,
  orders: [],
  tables: ['T-1', 'T-2', 'T-3', 'T-4', 'T-5', 'T-6', 'T-7', 'T-8', 'Family-1', 'Family-2'],
  waiters: ['Aslam', 'Rashid', 'Bilal', 'Farhan', 'Tariq'],
  riders: ['Kamran (Bykea)', 'Zubair (Rider)'],
  settings: {
    restaurantName: 'Al. Rehman Biryani & Pakwan Centre',
    orderTokenCounter: 101,
    lastUpdated: new Date().toISOString(),
  },
};

// Ensure data folder and pos_database.json file exist
export function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
      return INITIAL_DATA;
    }

    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading database file:', error);
    return INITIAL_DATA;
  }
}

export function saveDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error saving database file:', error);
    return false;
  }
}
