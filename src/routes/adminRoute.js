import express from "express"
import * as vehicleModel from "../models/vehicleModel.js"
import * as categoryModel from "../models/categoryModel.js"
import { checkAdmin } from "../middleware/middleware.js"

const router = express.Router()

router.get("/", checkAdmin, async (req, res, next) => {
  try {
    res.render("admin/index", {
      title: "Admin Management Dashboard"
    })
  } catch (error) {
    next(error)
  }
})

router.get("/vehicles", checkAdmin, async (req, res, next) => {
  try {
    const vehicles = await vehicleModel.getAllVehicles()
    res.render("admin/vehicles", {
      title: "Manage Inventory",
      vehicles
    })
  } catch (error) {
    next(error)
  }
})

router.get("/add-vehicle", checkAdmin, async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories()
    res.render("admin/add-vehicle", {
      title: "Add New Vehicle",
      categories
    })
  } catch (error) {
    next(error)
  }
})

router.post("/add-vehicle", async (req, res, next) => {
  try {
    const result = await vehicleModel.insertVehicle(req.body)
    if (result) {
      req.flash("notice", "Vehicle successfully added to inventory.")
      res.redirect("/admin/vehicles")
    } else {
      req.flash("notice", "Failed to add vehicle.")
      const categories = await categoryModel.getAllCategories()
      res.status(501).render("admin/add-vehicle", {
        title: "Add New Vehicle",
        categories
      })
    }
  } catch (error) {
    next(error)
  }
})

router.get("/edit-vehicle/:inv_id", checkAdmin, async (req, res, next) => {
  try {
    const vehicle = await vehicleModel.getVehicleById(req.params.inv_id)
    const categories = await categoryModel.getAllCategories()
    res.render("admin/edit-vehicle", {
      title: `Edit ${vehicle.inv_make} ${vehicle.inv_model}`,
      vehicle,
      categories
    })
  } catch (error) {
    next(error)
  }
})

router.post("/edit-vehicle", async (req, res, next) => {
  try {
    const result = await vehicleModel.updateVehicle(req.body)
    if (result) {
      req.flash("notice", "Vehicle successfully updated.")
      res.redirect("/admin/vehicles")
    } else {
      req.flash("notice", "Failed to update vehicle.")
      res.redirect(`/admin/edit-vehicle/${req.body.inv_id}`)
    }
  } catch (error) {
    next(error)
  }
})

export default router