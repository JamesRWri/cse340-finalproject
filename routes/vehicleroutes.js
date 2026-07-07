import express from 'express';
const router = express.Router();
import vehicleController from '../controllers/vehicleController.js';

router.get('/inventory', vehicleController.getInventoryPage);

router.get('/detail/:id', vehicleController.getVehicleDetailPage);

export default router;