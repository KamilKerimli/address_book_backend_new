import express from 'express';
import { authenticate, authorize } from "../middleware/AuthMiddleware.js";
import { getStatistics, updateUserAndAddress } from '../controllers/AdminController.js';

const AdminRouter = express.Router();

AdminRouter.route("/")
.get(authenticate, authorize(['admin']), getStatistics)
.post(authenticate, authorize(['admin']), updateUserAndAddress);


export default AdminRouter