import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getFilterOptions, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  handleSeedProducts
} from '../controllers/productController.js';

const router = Router();

// 1. Get available dynamic filter options (must be above /:id)
router.get('/filters', getFilterOptions);

// 2. On-demand Seeding endpoint
router.get('/seed', handleSeedProducts);
router.post('/seed', handleSeedProducts);

// 3. Products CRUD and filtering
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

