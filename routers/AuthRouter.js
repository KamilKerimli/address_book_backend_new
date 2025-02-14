import express from 'express';
import { login, register, checkToken, sendVerificationCode } from '../controllers/AuthController.js';
import { authorize } from '../middleware/AuthMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/checkToken', checkToken);
router.get('/sendCode', sendVerificationCode);

router.get('/admin', authorize(['admin']), (req, res) => {
    res.status(200).json({ message: 'Welcome, admin!' });
});

router.get('/', authorize(['user']), (req, res) => {
    res.status(200).json({ message: 'Welcome, user!' });
});

export default router;