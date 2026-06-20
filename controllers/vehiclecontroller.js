import vehicleModel from '../models/vehiclemodel.js';

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
    }
};

export default vehicleController;