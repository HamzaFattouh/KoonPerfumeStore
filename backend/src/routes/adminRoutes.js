import { Router } from 'express';
import { 
  adminLogin, 
  verifySession, 
  getAdminOverview 
} from '../controllers/adminController.js';

const router = Router();

router.post('/login', adminLogin);
router.get('/verify', verifySession);
router.get('/overview', getAdminOverview);

export default router;
