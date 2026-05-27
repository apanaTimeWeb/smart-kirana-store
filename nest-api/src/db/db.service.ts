import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DbService implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }

  async query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
    const client: PoolClient = await this.pool.connect();
    try {
      const res = await client.query(text, params);
      return res.rows as T[];
    } finally {
      client.release();
    }
  }

  async queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
    const rows = await this.query<T>(text, params);
    return rows[0] ?? null;
  }

  getPool(): Pool {
    return this.pool;
  }

  async initDB(): Promise<void> {
    await this.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'General',
        brand TEXT,
        search_keywords TEXT[] NOT NULL DEFAULT '{}',
        shortcut TEXT,
        unit TEXT NOT NULL DEFAULT 'piece',
        buying_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        selling_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        current_stock INTEGER NOT NULL DEFAULT 0,
        min_stock_level INTEGER NOT NULL DEFAULT 5,
        barcode TEXT,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS brand TEXT`);
    await this.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS search_keywords TEXT[] NOT NULL DEFAULT '{}'`);
    await this.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS shortcut TEXT`);

    await this.query(`
      CREATE TABLE IF NOT EXISTS unit_master (
        id SERIAL PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        label TEXT NOT NULL,
        is_base_unit BOOLEAN NOT NULL DEFAULT false,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS unit_conversions (
        id SERIAL PRIMARY KEY,
        parent_unit TEXT NOT NULL REFERENCES unit_master(code),
        child_unit TEXT NOT NULL REFERENCES unit_master(code),
        multiplier NUMERIC(12,3) NOT NULL CHECK (multiplier > 0),
        UNIQUE (parent_unit, child_unit)
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        variant_name TEXT NOT NULL,
        unit_type TEXT NOT NULL,
        base_unit TEXT NOT NULL CHECK (base_unit IN ('gram','ml','piece')),
        base_quantity NUMERIC(12,3) NOT NULL CHECK (base_quantity > 0),
        selling_mode TEXT NOT NULL CHECK (selling_mode IN ('khula','fixed','variant','wholesale')),
        mrp NUMERIC(10,2) NOT NULL DEFAULT 0,
        purchase_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        selling_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        quick_select BOOLEAN NOT NULL DEFAULT false,
        barcode TEXT,
        stock_in_base_unit NUMERIC(14,3) NOT NULL DEFAULT 0,
        low_stock_threshold_in_base_unit NUMERIC(14,3) NOT NULL DEFAULT 0,
        usage_count INTEGER NOT NULL DEFAULT 0,
        preset_base_quantities NUMERIC(12,3)[] NOT NULL DEFAULT '{}',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS purchase_entries (
        id SERIAL PRIMARY KEY,
        variant_id INTEGER NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
        purchase_quantity NUMERIC(12,3) NOT NULL CHECK (purchase_quantity > 0),
        added_base_quantity NUMERIC(14,3) NOT NULL CHECK (added_base_quantity > 0),
        purchase_price NUMERIC(10,2),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS khata_transactions (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
        type TEXT NOT NULL CHECK (type IN ('credit','payment')),
        amount NUMERIC(10,2) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS bills (
        id SERIAL PRIMARY KEY,
        bill_number TEXT NOT NULL,
        customer_id INTEGER REFERENCES customers(id),
        customer_name TEXT,
        subtotal NUMERIC(10,2) NOT NULL DEFAULT 0,
        discount NUMERIC(10,2) NOT NULL DEFAULT 0,
        gst_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
        total NUMERIC(10,2) NOT NULL DEFAULT 0,
        payment_method TEXT NOT NULL DEFAULT 'cash',
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.query(`
      CREATE TABLE IF NOT EXISTS bill_items (
        id SERIAL PRIMARY KEY,
        bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
        product_id INTEGER REFERENCES products(id),
        variant_id INTEGER REFERENCES product_variants(id),
        product_name TEXT NOT NULL,
        variant_name TEXT,
        display_quantity TEXT,
        stock_delta_base_unit NUMERIC(14,3),
        quantity NUMERIC(10,3) NOT NULL,
        unit TEXT NOT NULL DEFAULT 'piece',
        buying_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        selling_price NUMERIC(10,2) NOT NULL DEFAULT 0,
        total NUMERIC(10,2) NOT NULL DEFAULT 0
      )
    `);

    await this.query(`ALTER TABLE bill_items ADD COLUMN IF NOT EXISTS variant_id INTEGER REFERENCES product_variants(id)`);
    await this.query(`ALTER TABLE bill_items ADD COLUMN IF NOT EXISTS variant_name TEXT`);
    await this.query(`ALTER TABLE bill_items ADD COLUMN IF NOT EXISTS display_quantity TEXT`);
    await this.query(`ALTER TABLE bill_items ADD COLUMN IF NOT EXISTS stock_delta_base_unit NUMERIC(14,3)`);

    await this.query(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY DEFAULT 1,
        shop_name TEXT NOT NULL DEFAULT 'Smart Kirana Store',
        shop_address TEXT,
        shop_phone TEXT,
        owner_name TEXT,
        gst_number TEXT,
        gst_enabled BOOLEAN NOT NULL DEFAULT false,
        currency TEXT NOT NULL DEFAULT '₹',
        low_stock_threshold INTEGER NOT NULL DEFAULT 5,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    await this.seedUnitsAndConversions();
    await this.seedIfEmpty();
  }

  private async seedUnitsAndConversions(): Promise<void> {
    const units = [
      ['GRAM', 'Gram', true],
      ['KG', 'Kilogram', false],
      ['ML', 'Millilitre', true],
      ['LITRE', 'Litre', false],
      ['PIECE', 'Piece', true],
      ['PACKET', 'Packet', false],
      ['BOX', 'Box', false],
      ['CARTON', 'Carton', false],
      ['TIN', 'Tin', false],
      ['DABBA', 'Dabba', false],
      ['BORA', 'Bora', false],
      ['BAG', 'Bag', false],
      ['DOZEN', 'Dozen', false],
      ['BUNDLE', 'Bundle', false],
    ];

    for (const unit of units) {
      await this.query(
        `INSERT INTO unit_master (code, label, is_base_unit)
         VALUES ($1,$2,$3)
         ON CONFLICT (code) DO NOTHING`,
        unit,
      );
    }

    const conversions = [
      ['KG', 'GRAM', 1000],
      ['LITRE', 'ML', 1000],
      ['BORA', 'KG', 50],
      ['CARTON', 'BOX', 20],
      ['BOX', 'PACKET', 10],
      ['TIN', 'LITRE', 15],
      ['DOZEN', 'PIECE', 12],
    ];

    for (const conversion of conversions) {
      await this.query(
        `INSERT INTO unit_conversions (parent_unit, child_unit, multiplier)
         VALUES ($1,$2,$3)
         ON CONFLICT (parent_unit, child_unit) DO NOTHING`,
        conversion,
      );
    }
  }

  private async seedIfEmpty(): Promise<void> {
    const count = await this.queryOne<{ count: string }>('SELECT COUNT(*) as count FROM products');
    if (count && parseInt(count.count) > 0) return;

    const products = [
      { name: 'Basmati Rice (5kg)', category: 'Grains', unit: 'bag', buying_price: 280, selling_price: 320, current_stock: 50, min_stock_level: 10 },
      { name: 'Toor Dal (1kg)', category: 'Pulses', unit: 'kg', buying_price: 95, selling_price: 115, current_stock: 80, min_stock_level: 20 },
      { name: 'Sunflower Oil (1L)', category: 'Oil & Ghee', unit: 'bottle', buying_price: 115, selling_price: 135, current_stock: 30, min_stock_level: 10 },
      { name: 'Aashirvaad Atta (5kg)', category: 'Grains', unit: 'bag', buying_price: 210, selling_price: 245, current_stock: 25, min_stock_level: 8 },
      { name: 'Parle-G Biscuit', category: 'Snacks', unit: 'packet', buying_price: 5, selling_price: 8, current_stock: 200, min_stock_level: 50 },
      { name: 'Amul Milk (1L)', category: 'Dairy', unit: 'pouch', buying_price: 56, selling_price: 60, current_stock: 40, min_stock_level: 15 },
      { name: 'Surf Excel (1kg)', category: 'Household', unit: 'packet', buying_price: 95, selling_price: 115, current_stock: 20, min_stock_level: 5 },
      { name: 'Maggi Noodles', category: 'Instant Food', unit: 'packet', buying_price: 12, selling_price: 15, current_stock: 3, min_stock_level: 10 },
      { name: 'Colgate Toothpaste', category: 'Personal Care', unit: 'tube', buying_price: 55, selling_price: 68, current_stock: 0, min_stock_level: 5 },
      { name: 'Moong Dal (1kg)', category: 'Pulses', unit: 'kg', buying_price: 85, selling_price: 105, current_stock: 60, min_stock_level: 15 },
      { name: 'Coconut Oil (500ml)', category: 'Oil & Ghee', unit: 'bottle', buying_price: 90, selling_price: 110, current_stock: 2, min_stock_level: 8 },
      { name: 'Sugar (1kg)', category: 'Sweeteners', unit: 'kg', buying_price: 42, selling_price: 50, current_stock: 100, min_stock_level: 25 },
      { name: 'Salt (1kg)', category: 'Spices', unit: 'packet', buying_price: 18, selling_price: 25, current_stock: 75, min_stock_level: 20 },
      { name: 'Turmeric Powder (100g)', category: 'Spices', unit: 'packet', buying_price: 22, selling_price: 30, current_stock: 45, min_stock_level: 12 },
      { name: 'Lifebuoy Soap', category: 'Personal Care', unit: 'piece', buying_price: 28, selling_price: 35, current_stock: 30, min_stock_level: 10 },
    ];

    for (const p of products) {
      await this.query(
        `INSERT INTO products (name, category, unit, buying_price, selling_price, current_stock, min_stock_level)
         VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [p.name, p.category, p.unit, p.buying_price, p.selling_price, p.current_stock, p.min_stock_level],
      );
    }

    const customerData = [
      { name: 'Ramesh Kumar', phone: '9876543210', address: 'Gandhi Nagar' },
      { name: 'Sunita Devi', phone: '9812345678', address: 'Station Road' },
      { name: 'Mohan Lal', phone: '9898765432', address: 'Old Bus Stand' },
    ];

    for (const c of customerData) {
      const [inserted] = await this.query<{ id: number }>(
        `INSERT INTO customers (name, phone, address) VALUES ($1,$2,$3) RETURNING id`,
        [c.name, c.phone, c.address],
      );
      await this.query(
        `INSERT INTO khata_transactions (customer_id, type, amount, description) VALUES ($1,'credit',$2,$3)`,
        [inserted.id, 350, 'Rice & Dal'],
      );
      await this.query(
        `INSERT INTO khata_transactions (customer_id, type, amount, description) VALUES ($1,'payment',$2,$3)`,
        [inserted.id, 200, 'Cash payment'],
      );
    }

    await this.query(
      `INSERT INTO app_settings (id, shop_name) VALUES (1, 'Smart Kirana Store') ON CONFLICT (id) DO NOTHING`,
    );
  }
}
