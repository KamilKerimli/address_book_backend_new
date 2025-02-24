import express from 'express';
import { getPhoneCodes } from '../controllers/DataController.js';

const DataRouter = express.Router();

DataRouter.get('/getPhoneCodes', getPhoneCodes)

export default DataRouter