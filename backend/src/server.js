import dns from 'dns';
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { supabase } from './config/supabase.js';
import { autoMigrateDatabase } from './db/migrate.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*', // Allow all origins for dev and Render deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser Middleware (with generous limit for image payloads)
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Serve Uploaded Files Statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Koon Perfume API',
    database: supabase ? 'connected' : 'local_fallback_mode'
  });
});

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Root Welcome Endpoint
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #07080b; color: #f59e0b; min-height: 100vh;">
      <h1>🪐 Koon Perfume Backend API</h1>
      <p style="color: #cbd5e1;">الخادم يعمل بنجاح ومربوط مع قاعدة البيانات.</p>
      <div style="margin-top: 20px;">
        <a href="/api/products" style="color: #38bdf8; margin: 0 10px;">عرض المنتجات (/api/products)</a>
        <a href="/api/products/filters" style="color: #38bdf8; margin: 0 10px;">خيارات الفلاتر (/api/products/filters)</a>
        <a href="/api/health" style="color: #38bdf8; margin: 0 10px;">فحص الحالة (/api/health)</a>
      </div>
    </div>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'المسار غير موجود' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ success: false, message: 'خطأ داخلي في الخادم', error: err.message });
});

app.listen(PORT, async () => {
  console.log(`✨ Koon Perfume Backend running at http://localhost:${PORT}`);
  console.log(`📦 Database Mode: ${supabase ? 'Supabase PostgreSQL' : 'Local Fallback'}`);
  await autoMigrateDatabase();
});

