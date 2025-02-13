import express from 'express';
import { login, register, checkToken } from '../controllers/AuthController.js';
import { authenticate, authorize } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/checkToken', checkToken);

router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' });
});

router.get('/', authenticate, authorize(['user']), (req, res) => {
    res.status(200).json({ message: 'Welcome, user!' });
});

export default router;