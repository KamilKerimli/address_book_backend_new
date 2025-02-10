import express from 'express'
import { phoneCodes, createUser, getUser } from '../controllers/UserController.js'

const router = express.Router()

router.route("/")
.get(getUser)
.post(createUser) 

router.get("/phoneCodes", phoneCodes)


// router.route("/phoneCodes")
// .get(phoneCodes)
/* .post(postProducts)

router.route("/:id")
.delete(deleteProducts) */


export default router