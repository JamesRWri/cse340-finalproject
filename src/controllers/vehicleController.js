import {
  getAllVehicles,
  getVehicleById,
  getClassifications, 
  insertClassification,
  insertInventoryItem,
  getVehiclesByClassificationId,
  updateVehicle
} from "../models/vehicleModel.js";
import { getReviewsByVehicleId } from "../models/reviewModel.js";

export async function buildInventory(req, res, next) {
  try {
    const classifications = await getClassifications();
    const vehicles = await getAllVehicles();
    
    console.log("Vehicles loaded from DB:", vehicles);

    res.render("vehicles/inventory", {
      title: "Main Lot Vehicle Inventory",
      vehicles, classifications
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

export async function buildManagement(req, res, next) {
  try {
    res.render("vehicles/management", {
      title: "Vehicle Management Panel",
    })
  } catch (error) {
    next(error)
  }
}

export async function buildAddInventory(req, res, next) {
  try {
    let classificationData = await getClassifications();
    
    const rows = classificationData.rows || classificationData;

    let classificationSelect = '<select name="classification_id" id="classification_id" required>';
    classificationSelect += '<option value="">Choose a Classification</option>';
    
    rows.forEach(row => {
      classificationSelect += `<option value="${row.classification_id}">${row.classification_name}</option>`;
    });
    
    classificationSelect += '</select>';

    res.render("vehicles/add-inventory", {
      title: "Add New Vehicle to Inventory",
      classificationSelect,
    });
  } catch (error) {
    next(error);
  }
}

export async function buildAddClassification(req, res, next) {
  try {
    res.render("vehicles/add-classification", {
      title: "Add New Vehicle Classification",
    })
  } catch (error) {
    next(error)
  }
}

export async function addClassificationSubmit(req, res, next) {
  try {
    const { classification_name } = req.body;

    const result = await insertClassification(classification_name);

    if (result) {
      req.flash("notice", `The ${classification_name} classification was successfully added.`);
      return res.redirect("/vehicles");
    } else {
      req.flash("notice", "Sorry, adding the classification failed.");
      return res.status(500).render("vehicles/add-classification", {
        title: "Add New Vehicle Classification",
        classification_name
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function addInventorySubmit(req, res, next) {
  try {
    const {
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    } = req.body;

    const result = await insertInventoryItem(
      classification_id, inv_make, inv_model, inv_year,
      inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    );

    if (result) {
      req.flash("notice", `The ${inv_make} ${inv_model} was successfully added to inventory.`);
      return res.redirect("/vehicles");
    } else {
      let classificationData = await getClassifications();
      const rows = classificationData.rows || classificationData;
      let classificationSelect = '<select name="classification_id" id="classification_id" required>';
      rows.forEach(row => {
        classificationSelect += `<option value="${row.classification_id}" ${row.classification_id == classification_id ? 'selected' : ''}>${row.classification_name}</option>`;
      });
      classificationSelect += '</select>';

      req.flash("notice", "Failed to add inventory item.");
      return res.status(500).render("vehicles/add-inventory", {
        title: "Add New Vehicle to Inventory",
        classificationSelect,
        inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
      });
    }
  } catch (error) {
    next(error);
  }
}

export async function buildInventoryByCategory(req, res, next) {
  try {
    const classificationId = req.params.classificationId;
    const vehicles = await getVehiclesByClassificationId(classificationId);
    
    res.render("vehicles/inventory", {
      title: "Filtered Inventory",
      vehicles: vehicles || []
    });
  } catch (error) {
    next(error);
  }
}

export async function buildEmployeeInventoryView(req, res, next) {
  try {
    const vehicles = await getAllVehicles(); 
    
    res.render("vehicles/employee-inventory", {
      title: "Staff Inventory Registry",
      vehicles
    });
  } catch (error) {
    next(error);
  }
}

export async function buildEditVehicleView(req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    
    const vehicleData = await getVehicleById(inv_id) 
    const classifications = await getClassifications()
    
    res.render("vehicles/edit-vehicle", {
      title: `Edit ${vehicleData.inv_make} ${vehicleData.inv_model}`,
      classifications,
      inv_id: vehicleData.inv_id,
      inv_make: vehicleData.inv_make,
      inv_model: vehicleData.inv_model,
      inv_year: vehicleData.inv_year,
      inv_description: vehicleData.inv_description,
      inv_price: vehicleData.inv_price,
      inv_miles: vehicleData.inv_miles,
      inv_color: vehicleData.inv_color,
      classification_id: vehicleData.classification_id
    })
  } catch (error) {
    next(error)
  }
}

export async function updateVehicleSubmit(req, res, next) {
  try {
    const {
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    } = req.body

    const vehicleData = {
      inv_id: parseInt(inv_id),
      inv_make,
      inv_model,
      inv_year: parseInt(inv_year),
      inv_description,
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: parseFloat(inv_price),
      inv_miles: parseInt(inv_miles),
      inv_color,
      classification_id: parseInt(classification_id)
    }

    const updateResult = await updateVehicle(vehicleData)

    if (updateResult) {
      req.flash("notice", `Successfully updated ${inv_make} ${inv_model}!`)
      res.redirect("/vehicles/employee-list")
    } else {
      req.flash("notice", "Sorry, the update failed. Please try again.")
      res.redirect(`/vehicles/edit-vehicle/${inv_id}`)
    }
  } catch (error) {
    next(error)
  }
}