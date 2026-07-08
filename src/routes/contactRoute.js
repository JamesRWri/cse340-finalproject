import express from "express"
import * as contactController from "../controllers/contactController.js"

const router = express.Router()

router.get("/", contactController.buildContactForm)

router.post("/", contactController.processContactSubmission)

router.get("/manage", contactController.buildContactManage)

export default router