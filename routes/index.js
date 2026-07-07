import express from 'express';
import vehicleModel from '../models/vehiclemodel.js';
import reviewRoute from './reviewroute.js';
import reviewController from '../controllers/review-controller.js';

const router = express.Router();

router.get('/vehicles/inventory', async (req, res, next) => {
    try {
        const vehicles = await vehicleModel.getInventory();
        res.render('inventory', {
            pageTitle: 'Vehicle Inventory Lot',
            vehicleList: vehicles
        });
    } catch (error) {
        next(error);
    }
});

router.get('/vehicles/detail/:id', async (req, res, next) => {
    try {
        const vehicleId = req.params.id;
        const vehicle = await vehicleModel.getVehicleById(vehicleId);
        
        if (!vehicle) {
            const err = new Error("Vehicle item not found");
            err.status = 404;
            return next(err);
        }
        
        const vehicleReviews = reviewController.getSandboxReviews(Number(vehicleId));
        
        res.render('inventory/detail', {
            pageTitle: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
            vehicle: vehicle,
            car: vehicle,
            reviews: vehicleReviews 
        });
    } catch (error) {
        next(error);
    }
});

router.use('/review', reviewRoute);

export default router;