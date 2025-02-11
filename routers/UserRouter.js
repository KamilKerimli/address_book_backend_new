import express from 'express';
import { phoneCodes, createUser, getUser, uploadProfileFile } from '../controllers/UserController.js';
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage: storage})

router.route("/")
.get(getUser)
.post(createUser);

router.get("/phoneCodes", phoneCodes);
router.post("/upload", upload.single('file'), uploadProfileFile)


// router.route("/phoneCodes")
// .get(phoneCodes)
/* .post(postProducts)

router.route("/:id")
.delete(deleteProducts) */


export default router