import express from "express"
import reviewController from "../controllers/review-controller.js"

const router = new express.Router()

router.post("/add", reviewController.addReview)

router.post("/delete", reviewController.deleteReview)

export default router