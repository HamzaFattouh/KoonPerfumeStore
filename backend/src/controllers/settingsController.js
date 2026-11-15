import { supabase } from '../config/supabase.js';

/**
 * Get all site settings
 */
export const getAllSettings = async (req, res) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('site_settings').select('*');
      if (error) throw error;

      // Format as key-value dictionary for easy consumption
      const settingsMap = {};
      data.forEach(item => {
        settingsMap[item.key] = item.data;
      });

      return res.json({
        success: true,
        data: settingsMap
      });
    }

    res.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Get a specific setting by key
 */
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;

    if (supabase) {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('key', key)
        .single();

      if (error || !data) {
        return res.status(404).json({ success: false, message: 'القسم غير موجود' });
      }

      return res.json({ success: true, data: data.data });
    }

    res.status(404).json({ success: false, message: 'قاعدة البيانات غير متصلة' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Update or insert a setting by key
 */
export const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ success: false, message: 'البيانات مطلوبة' });
    }

    if (supabase) {
      const { data: updated, error } = await supabase
        .from('site_settings')
        .upsert({
          key,
          data,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      return res.json({
        success: true,
        message: `تم تحديث قسم ${key} بنجاح.`,
        data: updated
      });
    }

    res.status(400).json({ success: false, message: 'قاعدة البيانات غير متصلة' });
  } catch (error) {
    console.error(`Error updating setting ${req.params.key}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
};

