import express from "express"
import reviewController from "../controllers/review-controller.js"

const router = new express.Router()

router.post("/add", reviewController.addReview)

export default router