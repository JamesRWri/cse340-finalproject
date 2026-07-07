import vehicleModel from '../models/vehiclemodel.js';
import reviewModel from '../models/review-model.js';

const vehicleController = {
    getInventoryPage: async (req, res, next) => {
        try {
            const cars = await vehicleModel.getInventory();
            res.render('inventory', {
                pageTitle: 'Dealership Management - Active Inventory',
                vehicleList: cars
            });
        } catch (error) {
            next(error);
        }
    },

    getVehicleDetailPage: async (req, res, next) => {
        try {
            const invId = req.params.id;

            const carData = await vehicleModel.getVehicleById(invId); 

            const carReviews = await reviewModel.getReviewsByInvId(invId);

            res.render('inventory/detail', {
                car: carData,         
                reviews: carReviews   
            });
        } catch (error) {
            next(error); 
        }
    }
};

export default vehicleController;