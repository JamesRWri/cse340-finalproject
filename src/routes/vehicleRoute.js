import express from "express";
import { buildInventory, buildVehicleDetail, buildManagement, buildAddInventory, buildAddClassification, addClassificationSubmit, addInventorySubmit, buildInventoryByCategory, buildEmployeeInventoryView, buildEditVehicleView, updateVehicleSubmit } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/", buildManagement);

router.get("/add-inventory", buildAddInventory);
router.post("/add-inventory", addInventorySubmit);

router.get("/add-classification", buildAddClassification);
router.post("/add-classification", addClassificationSubmit);

router.get("/inventory", buildInventory);
router.get("/detail/:inventoryId", buildVehicleDetail);

router.get("/employee-list", buildEmployeeInventoryView)
router.get("/edit-vehicle/:inv_id", buildEditVehicleView)
router.post("/update", updateVehicleSubmit)

export default router;