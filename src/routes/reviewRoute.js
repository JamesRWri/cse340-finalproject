import express from "express"
import * as reviewController from "../controllers/reviewController.js"
import { checkAdmin } from "../middleware/middleware.js";

const router = express.Router()

function checkLogin(req, res, next) {
  if (req.session.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in to manage reviews.");
    res.redirect("/account/login");
  }
}

router.post("/add", checkLogin, reviewController.addReview);

router.get("/edit/:reviewId", checkLogin, reviewController.buildEditReview);
router.post("/update", checkLogin, reviewController.processEditReview);

router.get("/delete/:reviewId", checkLogin, reviewController.buildDeleteReview);
router.post("/delete", checkLogin, reviewController.processDeleteReview);

router.get("/moderate", checkAdmin, reviewController.buildModerationView)

export default router