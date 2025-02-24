import express from 'express'
import { config as configDotenv } from 'dotenv'
import cors from 'cors'
import UserRouter from './routers/UserRouter.js'
import AdminRouter from './routers/AdminRouter.js'
import AuthRouter from './routers/AuthRouter.js'
import AddressRouter from './routers/AddressRouter.js'
import DataRouter from './routers/DataRouter.js'
import { mongoDbConfig } from './config/mongoDbConfig.js'
import { cloudinaryConfig } from "./config/cloudinaryConfig.js";

configDotenv();
const app = express();
app.use(cors('*')) ;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", UserRouter);
app.use("/admin", AdminRouter);
app.use("/auth", AuthRouter);
app.use("/address", AddressRouter);
app.use("/data", DataRouter);
mongoDbConfig();
cloudinaryConfig();

app.listen(1144, () => {
    console.log('Project backend is running....')
})
