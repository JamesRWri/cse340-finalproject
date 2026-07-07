import express from 'express';
import vehicleRoutes from './vehicleroutes.js';
import reviewRoute from './reviewroute.js';

const router = express.Router();

router.use('/vehicles', vehicleRoutes);
router.use('/review', reviewRoute);

export default router;