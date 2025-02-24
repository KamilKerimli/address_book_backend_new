import express from 'express';
import { authenticate, authorize } from "../middleware/AuthMiddleware.js";
import { createUser, updateUser, getUser, deleteUser, updatePassword, subscribeUser, getUsers, changeRole } from '../controllers/UserController.js';

const UserRouter = express.Router();

UserRouter.route("/")
.get(getUser)
.post(createUser)
.put(updateUser)
.delete(deleteUser);

UserRouter.post('/updatePassword', updatePassword);
UserRouter.post('/subscribe', subscribeUser);
UserRouter.post('/changeRole', authenticate, authorize(['admin']), changeRole);
UserRouter.get('/getUsers', getUsers);

export default UserRouter