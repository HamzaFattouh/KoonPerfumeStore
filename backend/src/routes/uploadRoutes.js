import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const cleanBase = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `koon_${cleanBase}_${uniqueSuffix}${ext}`);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (allowedMimes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('صيغة الملف غير مدعومة. يرجى رفع صورة بصيغة JPG أو PNG أو WEBP أو GIF أو SVG.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024 // 15 MB
  },
  fileFilter
});

/**
 * POST /api/upload
 * Single file image upload with Supabase storage sync (if available) & local static fallback
 */
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'لم يتم استلام أي صورة. يرجى اختيار ملف صورة لرفعه.'
      });
    }

    const filename = req.file.filename;
    const localRelativePath = `/uploads/${filename}`;
    const host = req.get('host');
    const protocol = req.protocol;
    const localFullUrl = `${protocol}://${host}${localRelativePath}`;

    let publicUrl = localFullUrl;
    let storageProvider = 'local';

    // If Supabase is available, attempt to also sync/upload to Supabase Storage 'uploads' bucket
    if (supabase) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(`public/${filename}`, fileBuffer, {
            contentType: req.file.mimetype,
            upsert: true
          });

        if (!error && data) {
          const { data: pubData } = supabase.storage.from('uploads').getPublicUrl(`public/${filename}`);
          if (pubData?.publicUrl) {
            publicUrl = pubData.publicUrl;
            storageProvider = 'supabase';
          }
        }
      } catch (storageErr) {
        // Fallback silently to local static URL
        console.warn('Supabase storage sync skipped or unavailable, using local hosting:', storageErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'تم رفع الصورة بنجاح 📸',
      url: publicUrl,
      path: localRelativePath,
      filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      provider: storageProvider
    });
  } catch (err) {
    console.error('Image Upload Error:', err);
    return res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء رفع الصورة',
      error: err.message
    });
  }
});

/**
 * POST /api/upload/base64
 * Upload image via Base64 Data URL (useful for direct canvas or camera captures)
 */
router.post('/base64', async (req, res) => {
  try {
    const { base64Data, filename: customName } = req.body;
    if (!base64Data || typeof base64Data !== 'string') {
      return res.status(400).json({ success: false, message: 'بيانات Base64 غير صالحة' });
    }

    // Extract mime type and raw data
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ success: false, message: 'تنسيق Base64 غير متوافق' });
    }

    const mimeType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    let ext = '.jpg';
    if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('gif')) ext = '.gif';
    else if (mimeType.includes('svg')) ext = '.svg';

    const filename = `koon_${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);

    const host = req.get('host');
    const protocol = req.protocol;
    const url = `${protocol}://${host}/uploads/${filename}`;

    return res.status(200).json({
      success: true,
      message: 'تم حفظ الصورة بنجاح',
      url,
      path: `/uploads/${filename}`,
      filename,
      size: buffer.length,
      mimetype: mimeType
    });
  } catch (err) {
    console.error('Base64 upload error:', err);
    return res.status(500).json({ success: false, message: 'خطأ في معالجة الصورة', error: err.message });
  }
});

/**
 * DELETE /api/upload/:filename
 * Remove uploaded image
 */
router.delete('/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const targetPath = path.join(uploadsDir, filename);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
      return res.json({ success: true, message: 'تم حذف الصورة بنجاح' });
    }
    return res.status(404).json({ success: false, message: 'الملف غير موجود' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'تعذر حذف الصورة', error: err.message });
  }
});

export default router;
