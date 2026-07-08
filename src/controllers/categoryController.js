import { getAllCategories, insertCategory } from "../models/categoryModel.js"

export async function buildCategoryList(req, res, next) {
  try {
    const categories = await getAllCategories()
    res.render("vehicles/categories", {
      title: "Vehicle Categories",
      categories
    })
  } catch (error) {
    next(error)
  }
}

export async function processAddCategory(req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await insertCategory(classification_name)

    if (result) {
      req.flash("notice", `Category "${classification_name}" successfully added!`)
      res.redirect("/category")
    } else {
      req.flash("notice", "Failed to add category.")
      res.status(501).render("vehicles/categories", {
        title: "Vehicle Categories",
        categories: await getAllCategories()
      })
    }
  } catch (error) {
    next(error)
  }
}