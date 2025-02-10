import express from 'express'
import { config as configDotenv } from 'dotenv'
import cors from 'cors'
import UserRouter from './routers/UserRouter.js'
import { configDb } from './config/config.js'

configDotenv()
const app = express()
app.use(cors('*')) 
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/users", UserRouter)
configDb()
app.listen(1144, () => {
    console.log('Project backend is running....')
})
