import {
  getAllVehicles,
  getVehicleById,
} from "../models/vehicleModel.js";
import { getReviewsByVehicleId } from "../models/reviewModel.js";

export async function buildInventory(req, res, next) {
  try {
    const vehicles = await getAllVehicles();
    
    console.log("Vehicles loaded from DB:", vehicles);

    res.render("vehicles/inventory", {
      title: "Main Lot Vehicle Inventory",
      vehicles: vehicles || []
    });
  } catch (error) {
    next(error);
  }
}

export async function buildVehicleDetail(req, res, next) {
  try {
    const vehicleId = req.params.inventoryId;

    const vehicle = await getVehicleById(vehicleId);

    if (!vehicle) {
      const err = new Error("The requested vehicle resource could not be found.");
      err.status = 404;
      return next(err);
    }

    let reviews = [];
    try {
      reviews = await getReviewsByVehicleId(vehicleId);
    } catch (dbError) {
      console.error("Database issue or model missing while fetching reviews: " + dbError);
    }

    res.render("vehicles/detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      reviews: reviews || [],
      sessionUser: req.session ? req.session.user : null,
    });
  } catch (error) {
    next(error);
  }
}