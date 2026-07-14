import express from "express"
const router = express.Router()

router.get("/", (req, res) => {
  if (!req.session || !req.session.loggedin) {
    return res.redirect("/account/login")
  }
  
  res.render("index", { title: "Home | Vehicle Management Agency" })
})

export default router