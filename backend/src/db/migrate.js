import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import { INITIAL_PRODUCTS } from './seed.js';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Automatically creates and validates tables and seeds products in PostgreSQL/Supabase
 */
export async function autoMigrateDatabase() {
  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DB_URL;
  
  if (!dbUrl) {
    console.log('ℹ️ ملاحظة: لإنشاء الجداول تلقائياً من الباك إند، أضف DATABASE_URL في متغيرات البيئة.');
    return;
  }

  console.log('🔄 Checking and auto-creating database tables in Supabase...');

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    // 1. Run schema SQL to create table, indexes, and triggers
    await pool.query(sql);
    console.log('✅ تم إنشاء/التحقق من جدول products والفهارس بنجاح تلقائياً في Supabase!');

    // 2. Check if products table is empty, and seed if needed
    const countRes = await pool.query('SELECT COUNT(*) FROM public.products;');
    const count = parseInt(countRes.rows[0].count, 10);

    if (count === 0) {
      console.log('🌱 Table is empty. Automatically seeding 6 initial Koon perfumes...');
      for (const p of INITIAL_PRODUCTS) {
        await pool.query(`
          INSERT INTO public.products (
            id, name, name_en, brand, tagline, description, gender, season, scent_family,
            concentration, longevity, projection, price, original_price, discount,
            image_url, images, video_url, rating, reviews_count, badge, is_bestseller,
            is_featured, is_active, notes, sizes
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
            $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26
          ) ON CONFLICT (id) DO NOTHING;
        `, [
          p.id, p.name, p.name_en, p.brand, p.tagline, p.description, p.gender, p.season, p.scent_family,
          p.concentration, p.longevity, p.projection, p.price, p.original_price, p.discount,
          p.image_url, p.images, p.video_url, p.rating, p.reviews_count, p.badge, p.is_bestseller,
          p.is_featured, p.is_active, JSON.stringify(p.notes), JSON.stringify(p.sizes)
        ]);
      }
      console.log('🎉 تم ملء قاعدة البيانات بالمنتجات الأولية بنجاح!');
    } else {
      console.log(`📦 Database already contains ${count} products.`);
    }
  } catch (err) {
    console.error('❌ Auto-migration error:', err.message);
  } finally {
    await pool.end();
  }
}

// Standalone execution (npm run migrate)
if (process.argv[1]?.endsWith('migrate.js')) {
  autoMigrateDatabase();
}
