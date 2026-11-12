import { supabase } from '../utils/supabase';
import { PRODUCTS } from '../data/products';

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Fetch products with advanced multi-dimensional filtering
 * @param {Object} filters
 * @param {string} filters.gender - 'men' | 'women' | 'unisex' | 'all'
 * @param {string} filters.season - 'summer' | 'winter' | 'all_seasons' | 'all'
 * @param {string} filters.scentFamily - Scent category
 * @param {string} filters.note - Specific note or ingredient (oud, amber, vanilla, etc.)
 * @param {string} filters.brand - Brand name
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @param {string} filters.search - Search text
 * @param {string} filters.sort - 'price_asc' | 'price_desc' | 'rating' | 'newest'
 */
export async function getProducts(filters = {}) {
  // 1. Try Backend API if API_BASE is configured
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
        if (json.success && json.data?.length > 0) {
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Backend API request failed, falling back to Supabase/local', e);
    }
  }

  // 2. Try Supabase Client directly
  if (supabase) {
    try {
      let query = supabase.from('products').select('*');

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
      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.warn('Supabase query failed, falling back to local dataset', e);
    }
  }

  // 3. Resilient In-Memory Fallback
  let result = [...PRODUCTS];

  if (filters.gender && filters.gender !== 'all') {
    result = result.filter(p => p.category === filters.gender || p.gender === filters.gender);
  }
  if (filters.season && filters.season !== 'all') {
    result = result.filter(p => p.season === filters.season || p.season?.includes(filters.season) || p.season?.includes('جميع الفصول'));
  }
  if (filters.scentFamily && filters.scentFamily !== 'all') {
    result = result.filter(p => p.scentFamily?.includes(filters.scentFamily) || p.scent_family?.includes(filters.scentFamily));
  }
  if (filters.note && filters.note !== 'all') {
    const qNote = filters.note.toLowerCase();
    result = result.filter(p => {
      const allNotes = [
        ...(p.notes?.top || []),
        ...(p.notes?.heart || []),
        ...(p.notes?.base || [])
      ].map(n => n.toLowerCase());
      return allNotes.some(n => n.includes(qNote));
    });
  }
  if (filters.minPrice) {
    result = result.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    result = result.filter(p => p.price <= filters.maxPrice);
  }
  if (filters.bestseller) {
    result = result.filter(p => p.isBestseller || p.is_bestseller);
  }
  if (filters.featured) {
    result = result.filter(p => p.isFeatured || p.is_featured);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(p => 
      p.name?.toLowerCase().includes(q) ||
      p.nameEn?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  if (filters.sort === 'price_asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'price_desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (filters.sort === 'rating') {
    result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
  }

  return result;
}

/**
 * Fetch available filter options
 */
export async function getFilterOptions() {
  if (API_BASE) {
    try {
      const res = await fetch(`${API_BASE}/api/products/filters`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) return json.data;
      }
    } catch (e) {
      // fallback
    }
  }

  // Local fallback filter options
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

