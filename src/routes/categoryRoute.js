import express from "express"
import * as categoryController from "../controllers/categoryController.js"

const router = express.Router()

router.get("/", categoryController.buildCategoryList)

router.post("/add", categoryController.processAddCategory)

export default router