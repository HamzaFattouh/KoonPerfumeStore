import { supabase } from '../utils/supabase';

const API_BASE = import.meta.env.VITE_API_URL || 'https://koonperfume-backend.onrender.com';

/**
 * Standardize product fields between Supabase/PostgreSQL (snake_case)
 * and React components (camelCase) to ensure zero UI regressions.
 */
export function normalizeProduct(p) {
  if (!p) return null;

  // Handle images array & fallback image
  let images = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    images = p.images;
  } else if (p.image_url) {
    images = [p.image_url];
  } else {
    images = ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop'];
  }

  const category = p.gender || p.category || 'unisex';
  const categoryName = p.categoryName || (
    category === 'men' ? 'عطور رجالية' :
    category === 'women' ? 'عطور نسائية' : 'للجنسين'
  );

  return {
    ...p,
    id: p.id,
    name: p.name,
    nameEn: p.name_en || p.nameEn || '',
    name_en: p.name_en || p.nameEn || '',
    brand: p.brand || 'KOON PERFUME',
    tagline: p.tagline || '',
    description: p.description || '',
    category,
    gender: category,
    categoryName,
    season: p.season || 'all_seasons',
    scentFamily: p.scent_family || p.scentFamily || 'شرقي فاخر',
    scent_family: p.scent_family || p.scentFamily || 'شرقي فاخر',
    concentration: p.concentration || 'Extrait de Parfum',
    longevity: p.longevity || 'ثبات عالي',
    projection: p.projection || 'فوحان ممتاز',
    price: Number(p.price) || 0,
    originalPrice: p.original_price != null ? Number(p.original_price) : Number(p.price),
    original_price: p.original_price != null ? Number(p.original_price) : Number(p.price),
    discount: p.discount || '',
    rating: Number(p.rating) || 4.9,
    reviewsCount: Number(p.reviews_count ?? p.reviewsCount ?? 0),
    reviews_count: Number(p.reviews_count ?? p.reviewsCount ?? 0),
    badge: p.badge || (p.is_bestseller ? 'الأكثر مبيعاً' : ''),
    isBestseller: Boolean(p.is_bestseller ?? p.isBestseller),
    is_bestseller: Boolean(p.is_bestseller ?? p.isBestseller),
    isFeatured: Boolean(p.is_featured ?? p.isFeatured),
    is_featured: Boolean(p.is_featured ?? p.isFeatured),
    images,
    image_url: images[0],
    video_url: p.video_url || '',
    notes: p.notes || { top: [], heart: [], base: [] },
    sizes: Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes : [
      { size: '50ml', price: Math.round((Number(p.price) || 0) * 0.75), stock: 10 },
      { size: '100ml', price: Number(p.price) || 0, stock: 20, isDefault: true }
    ]
  };
}

/**
 * Fetch products directly from Database / Backend API
 * Strictly returns database data; no static mock arrays.
 */
export async function getProducts(filters = {}) {
  // 1. Try Backend API first
  if (API_BASE) {
    try {
      const params = new URLSearchParams();
      if (filters.gender && filters.gender !== 'all') params.append('gender', filters.gender);
      if (filters.season && filters.season !== 'all') params.append('season', filters.season);
      if (filters.scentFamily && filters.scentFamily !== 'all') params.append('scent_family', filters.scentFamily);
      if (filters.note && filters.note !== 'all') params.append('note', filters.note);
      if (filters.brand && filters.brand !== 'all') params.append('brand', filters.brand);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.bestseller) params.append('bestseller', 'true');
      if (filters.featured) params.append('featured', 'true');
      if (filters.search) params.append('search', filters.search);
      if (filters.sort) params.append('sort', filters.sort);

      const res = await fetch(`${API_BASE}/api/products?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          return json.data.map(normalizeProduct);
        }
      }
    } catch (e) {
      console.warn('Backend API unreachable, connecting directly to Supabase client...', e);
    }
  }

  // 2. Direct Supabase Query fallback
  if (supabase) {
    try {
      let query = supabase.from('products').select('*').eq('is_active', true);

      if (filters.gender && filters.gender !== 'all') {
        query = query.eq('gender', filters.gender);
      }
      if (filters.season && filters.season !== 'all') {
        query = query.eq('season', filters.season);
      }
      if (filters.scentFamily && filters.scentFamily !== 'all') {
        query = query.ilike('scent_family', `%${filters.scentFamily}%`);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.bestseller) {
        query = query.eq('is_bestseller', true);
      }
      if (filters.featured) {
        query = query.eq('is_featured', true);
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data)) {
        return data.map(normalizeProduct);
      }
      if (error) {
        console.error('Supabase query error:', error);
      }
    } catch (e) {
      console.error('Supabase direct connection error:', e);
    }
  }

  // Pure database mode: return empty array if unreachable rather than fake static data
  return [];
}

/**
 * Fetch a single product by ID from Database
 */
export async function getProductById(id) {
  if (!id) return null;

  // 1. Try Backend API
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          return normalizeProduct(json.data);
        }
      }
    } catch (e) {
      console.warn('Backend API single product fetch failed, trying Supabase direct...', e);
    }
  }

  // 2. Try Supabase direct
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return normalizeProduct(data);
      }
    } catch (e) {
      console.error('Supabase getProductById error:', e);
    }
  }

  return null;
}

/**
 * Fetch related products (excluding the current one)
 */
export async function getRelatedProducts(currentId, limit = 3) {
  const all = await getProducts();
  return all.filter(p => p.id !== currentId).slice(0, limit);
}

/**
 * Fetch filter options from Database / Backend
 */
export async function getFilterOptions() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/products/filters`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {}
  }

  return {
    genders: [
      { id: 'all', labelAr: 'الكل' },
      { id: 'men', labelAr: 'رجالي' },
      { id: 'women', labelAr: 'ستاتي (نسائي)' },
      { id: 'unisex', labelAr: 'رجالي وستاتي (للجنسين)' }
    ],
    seasons: [
      { id: 'all', labelAr: 'جميع الفصول' },
      { id: 'summer', labelAr: 'صيفي منعش' },
      { id: 'winter', labelAr: 'شتوي دافئ' }
    ],
    scent_families: [
      'شرقي خشبي فاخر',
      'سويتي عنبري دافئ',
      'جلدي مدخن أروماتيك',
      'حمضيات مائية منعشة',
      'زهري أرستقراطي ناعم',
      'عود خشبي بخوري نيش'
    ],
    ingredients: [
      'عود كمبودي',
      'عنبر',
      'فانيليا بوربون',
      'زعفران كشميري',
      'برغموت',
      'ورد دي ماي',
      'خشب الأرز',
      'خشب الصندل',
      'مسك كوني',
      'جلود معتقة',
      'ياسمين ليلي'
    ]
  };
}
