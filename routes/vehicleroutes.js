import express from 'express';
const router = express.Router();
import vehicleController from '../controllers/vehicleController.js';

router.get('/inventory', vehicleController.getInventoryPage);

export default router;