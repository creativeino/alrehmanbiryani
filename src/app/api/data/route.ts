import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase, DatabaseSchema } from '@/lib/db';
import { MENU_ITEMS, DEFAULT_CATEGORIES } from '@/data/menu';

// GET all data from the database
export async function GET() {
  try {
    const db = getDatabase();
    return NextResponse.json({ success: true, data: db });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch database' },
      { status: 500 }
    );
  }
}

// POST: Save or partially update database
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const currentDb = getDatabase();

    // Reset action
    if (body.action === 'reset_menu') {
      currentDb.menu = MENU_ITEMS;
      currentDb.categories = DEFAULT_CATEGORIES;
      currentDb.settings.lastUpdated = new Date().toISOString();
      saveDatabase(currentDb);
      return NextResponse.json({ success: true, data: currentDb });
    }

    // Merge updates
    const updatedDb: DatabaseSchema = {
      menu: body.menu !== undefined ? body.menu : currentDb.menu,
      categories: body.categories !== undefined ? body.categories : currentDb.categories,
      orders: body.orders !== undefined ? body.orders : currentDb.orders,
      tables: body.tables !== undefined ? body.tables : currentDb.tables,
      waiters: body.waiters !== undefined ? body.waiters : currentDb.waiters,
      riders: body.riders !== undefined ? body.riders : currentDb.riders,
      settings: {
        ...currentDb.settings,
        orderTokenCounter:
          body.orderTokenCounter !== undefined
            ? body.orderTokenCounter
            : currentDb.settings.orderTokenCounter,
        lastUpdated: new Date().toISOString(),
      },
    };

    saveDatabase(updatedDb);
    return NextResponse.json({ success: true, data: updatedDb });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update database' },
      { status: 500 }
    );
  }
}
