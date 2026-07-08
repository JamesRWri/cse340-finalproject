import express from "express"
import * as accountController from "../controllers/accountController.js"

const router = express.Router()

router.get("/login", accountController.buildLogin)

router.get("/register", accountController.buildRegister)

router.post("/register", accountController.processRegistration)

router.post("/login", accountController.processLogin)

export default router