import express from "express"
import * as reviewController from "../controllers/reviewController.js"

const router = express.Router()

router.post("/add", reviewController.addReview)

router.get("/edit/:reviewId", reviewController.buildEditReview)

router.post("/update", reviewController.editReview)

router.post("/delete", reviewController.removeReview)

export default router