import { supabase } from '../config/supabase.js';
import { INITIAL_PRODUCTS } from '../db/seed.js';

/**
 * Filter and fetch products
 * Supports: gender, season, scent_family, note/ingredient, brand, min_price, max_price, search, sort
 */
export const getProducts = async (req, res) => {
  try {
    const {
      gender,
      season,
      scent_family,
      note,
      brand,
      min_price,
      max_price,
      bestseller,
      featured,
      search,
      sort,
      page = 1,
      limit = 50
    } = req.query;

    // 1. Try fetching from Supabase if connected
    if (supabase) {
      let query = supabase.from('products').select('*', { count: 'exact' });

      // Apply Filter: Gender (رجالي / ستاتي / للجنسين)
      if (gender && gender !== 'all') {
        query = query.eq('gender', gender);
      }

      // Apply Filter: Season (صيفي / شتوي / جميع الفصول)
      if (season && season !== 'all') {
        query = query.eq('season', season);
      }

      // Apply Filter: Scent Family (العائلة العطرية)
      if (scent_family && scent_family !== 'all') {
        query = query.ilike('scent_family', `%${scent_family}%`);
      }

      // Apply Filter: Brand (الماركة)
      if (brand && brand !== 'all') {
        query = query.ilike('brand', `%${brand}%`);
      }

      // Apply Filter: Price Range
      if (min_price) {
        query = query.gte('price', parseFloat(min_price));
      }
      if (max_price) {
        query = query.lte('price', parseFloat(max_price));
      }

      // Apply Filter: Bestseller / Featured
      if (bestseller === 'true' || bestseller === '1') {
        query = query.eq('is_bestseller', true);
      }
      if (featured === 'true' || featured === '1') {
        query = query.eq('is_featured', true);
      }

      // Apply Search: Search keyword in name, name_en, description, or scent_family
      if (search) {
        query = query.or(`name.ilike.%${search}%,name_en.ilike.%${search}%,description.ilike.%${search}%,scent_family.ilike.%${search}%`);
      }

      // Apply Sorting
      if (sort === 'price_asc') {
        query = query.order('price', { ascending: true });
      } else if (sort === 'price_desc') {
        query = query.order('price', { ascending: false });
      } else if (sort === 'rating') {
        query = query.order('rating', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, count, error } = await query;

      if (!error && data && data.length > 0) {
        // If note/ingredient filter requested, filter further in memory or jsonb
        let finalData = data;
        if (note && note !== 'all') {
          const lowerNote = note.toLowerCase();
          finalData = finalData.filter(p => {
            const allNotes = [
              ...(p.notes?.top || []),
              ...(p.notes?.heart || []),
              ...(p.notes?.base || [])
            ].map(n => n.toLowerCase());
            return allNotes.some(n => n.includes(lowerNote));
          });
        }

        return res.json({
          success: true,
          source: 'database',
          total: finalData.length,
          page: parseInt(page),
          data: finalData
        });
      }
    }

    // 2. Fallback to Initial Products if Supabase is unconfigured or table is pending
    let filtered = [...INITIAL_PRODUCTS];

    if (gender && gender !== 'all') {
      filtered = filtered.filter(p => p.gender === gender);
    }

    if (season && season !== 'all') {
      filtered = filtered.filter(p => p.season === season || p.season === 'all_seasons');
    }

    if (scent_family && scent_family !== 'all') {
      filtered = filtered.filter(p => p.scent_family.includes(scent_family));
    }

    if (brand && brand !== 'all') {
      filtered = filtered.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
    }

    if (note && note !== 'all') {
      const lowerNote = note.toLowerCase();
      filtered = filtered.filter(p => {
        const allNotes = [
          ...(p.notes?.top || []),
          ...(p.notes?.heart || []),
          ...(p.notes?.base || [])
        ].map(n => n.toLowerCase());
        return allNotes.some(n => n.includes(lowerNote));
      });
    }

    if (min_price) {
      filtered = filtered.filter(p => p.price >= parseFloat(min_price));
    }
    if (max_price) {
      filtered = filtered.filter(p => p.price <= parseFloat(max_price));
    }

    if (bestseller === 'true' || bestseller === '1') {
      filtered = filtered.filter(p => p.is_bestseller);
    }
    if (featured === 'true' || featured === '1') {
      filtered = filtered.filter(p => p.is_featured);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.scent_family.toLowerCase().includes(q)
      );
    }

    if (sort === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return res.json({
      success: true,
      source: 'local_fallback',
      total: filtered.length,
      page: parseInt(page),
      data: filtered
    });

  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        return res.json({ success: true, data });
      }
    }

    // Fallback to local
    const product = INITIAL_PRODUCTS.find(p => p.id === id);
    if (product) {
      return res.json({ success: true, data: product });
    }

    return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Get dynamic filter options for UI
 */
export const getFilterOptions = async (req, res) => {
  try {
    const products = INITIAL_PRODUCTS;

    // Collect all unique scent families
    const scentFamilies = Array.from(new Set(products.map(p => p.scent_family)));

    // Collect all unique brands
    const brands = Array.from(new Set(products.map(p => p.brand)));

    // Collect all distinct ingredients/notes
    const notesSet = new Set();
    products.forEach(p => {
      [...(p.notes?.top || []), ...(p.notes?.heart || []), ...(p.notes?.base || [])].forEach(n => {
        notesSet.add(n);
      });
    });

    const filterData = {
      genders: [
        { id: 'all', labelAr: 'الكل', labelEn: 'All' },
        { id: 'men', labelAr: 'رجالي', labelEn: 'Men' },
        { id: 'women', labelAr: 'ستاتي (نسائي)', labelEn: 'Women' },
        { id: 'unisex', labelAr: 'رجالي وستاتي (للجنسين)', labelEn: 'Unisex' }
      ],
      seasons: [
        { id: 'all', labelAr: 'جميع الفصول', labelEn: 'All Seasons' },
        { id: 'summer', labelAr: 'عطور صيفية منعشة', labelEn: 'Summer' },
        { id: 'winter', labelAr: 'عطور شتوية دافئة', labelEn: 'Winter' }
      ],
      scent_families: scentFamilies,
      brands: brands,
      ingredients: Array.from(notesSet),
      price_range: {
        min: Math.min(...products.map(p => p.price)),
        max: Math.max(...products.map(p => p.price))
      }
    };

    return res.json({ success: true, data: filterData });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Create a new product
 */
export const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;

    if (!newProduct.name || !newProduct.price || !newProduct.image_url) {
      return res.status(400).json({
        success: false,
        message: 'الحقول الإلزامية: اسم المنتج، السعر، صورة المنتج'
      });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.status(201).json({ success: true, data });
    }

    // In-memory fallback
    const created = { ...newProduct, id: newProduct.id || `prod-${Date.now()}` };
    INITIAL_PRODUCTS.unshift(created);
    return res.status(201).json({ success: true, data: created });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.json({ success: true, data });
    }

    const index = INITIAL_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      INITIAL_PRODUCTS[index] = { ...INITIAL_PRODUCTS[index], ...updates };
      return res.json({ success: true, data: INITIAL_PRODUCTS[index] });
    }

    return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(400).json({ success: false, error: error.message });
      }

      return res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    }

    const index = INITIAL_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
      INITIAL_PRODUCTS.splice(index, 1);
      return res.json({ success: true, message: 'تم حذف المنتج بنجاح' });
    }

    return res.status(404).json({ success: false, message: 'المنتج غير موجود' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
