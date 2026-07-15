import express from "express"
import * as serviceController from "../controllers/serviceController.js"
import { checkLogin, checkAdmin } from "../middleware/middleware.js"

const router = express.Router()

router.get("/detail", serviceController.buildServiceDetail)

router.post("/book", serviceController.processServiceBooking)

router.get("/my-requests", serviceController.buildMyRequests)

router.get("/manage", serviceController.buildServiceManage)

router.post("/update-status", checkLogin, serviceController.processStatusUpdate)

export default router