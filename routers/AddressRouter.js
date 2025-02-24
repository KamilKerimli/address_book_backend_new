import express from 'express';
import { getAddresses,  } from '../controllers/AddressController.js';

const AddressRouter = express.Router();

AddressRouter.get('/getAddresses', getAddresses)

export default AddressRouter