import express from "express";
import { buildInventory, buildVehicleDetail } from "../controllers/vehicleController.js";

const router = express.Router();

router.get("/inventory", buildInventory);

router.get("/detail/:inventoryId", buildVehicleDetail);

export default router;