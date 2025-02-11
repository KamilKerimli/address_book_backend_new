import express from 'express'
import { config as configDotenv } from 'dotenv'
import cors from 'cors'
import UserRouter from './routers/UserRouter.js'
import { mongoDbConfig } from './config/mongoDbConfig.js'
import { cloudinaryConfig } from "./config/cloudinaryConfig.js";

configDotenv();
const app = express();
app.use(cors('*')) ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter)
mongoDbConfig();
cloudinaryConfig();

app.listen(1144, () => {
    console.log('Project backend is running....')
})
