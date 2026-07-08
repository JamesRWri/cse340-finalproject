import express from "express"
import reviewRoute from "./reviewRoute.js"
import accountRoute from "./accountRoute.js"
import vehicleRoute from "./vehicleRoute.js"
import categoryRoute from "./categoryRoute.js"
import adminRoute from "./adminRoute.js"
import contactRoute from "./contactRoute.js"
import serviceRoute from "./serviceRoute.js"
import baseRoute from "./baseRoute.js"

const router = express.Router()

router.use("/vehicles", vehicleRoute)
router.use("/review", reviewRoute)
router.use("/account", accountRoute)
router.use("/category", categoryRoute)
router.use("/admin", adminRoute)
router.use("/contact", contactRoute)
router.use("/service", serviceRoute)
router.use("/", baseRoute)

export default router