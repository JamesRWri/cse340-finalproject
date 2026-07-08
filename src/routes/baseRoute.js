import express from "express"
const router = express.Router()

router.get("/", (req, res) => {
  res.render("index", { title: "Home | Vehicle Management Agency" })
})

export default router