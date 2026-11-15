import { Router } from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  getOrderStats 
} from '../controllers/orderController.js';

const router = Router();

// Stats must be above /:id
router.get('/stats', getOrderStats);

// Orders CRUD
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);

export default router;

