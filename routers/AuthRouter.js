import express from 'express';
import { login, register, sendVerificationCode, getCode } from '../controllers/AuthController.js';

const AuthRouter = express.Router();

AuthRouter.route("/")
.get(login)
.post(register);

AuthRouter.get('/sendCode', sendVerificationCode);
AuthRouter.get('/getCode', getCode);

export default AuthRouter;