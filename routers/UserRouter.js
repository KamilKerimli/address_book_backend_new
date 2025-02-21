import express from 'express';
import { createUser, updateUser, deleteUser, getUser } from '../controllers/UserController.js';
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

router.route("/")
.get(getUser)
.post(createUser)
.put(updateUser)
.delete(deleteUser);

export default router