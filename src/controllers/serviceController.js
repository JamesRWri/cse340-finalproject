import * as serviceModel from "../models/serviceModel.js"

export async function buildServiceDetail(req, res, next) {
  try {
    res.render("service/detail", {
      title: "Schedule Maintenance & Repair"
    })
  } catch (error) {
    next(error)
  }
}

export async function processServiceBooking(req, res, next) {
  try {
    const { service_vehicle_info, service_description } = req.body
    
    const account_id = req.session.user ? req.session.user.account_id : null
    if (!account_id) {
      req.flash("notice", "Please log in to schedule vehicle service.")
      return res.redirect("/account/login")
    }

    const result = await serviceModel.insertServiceRequest(account_id, service_vehicle_info, service_description)

    if (result) {
      req.flash("notice", "Service request successfully scheduled!")
      res.redirect("/service/my-requests")
    } else {
      req.flash("notice", "Could not complete registration of service request.")
      res.status(500).render("service/detail", {
        title: "Schedule Maintenance & Repair",
        service_vehicle_info,
        service_description
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function buildMyRequests(req, res, next) {
  try {
    const account_id = req.session.user ? req.session.user.account_id : null
    if (!account_id) {
      req.flash("notice", "Please log in to view your requests.")
      return res.redirect("/account/login")
    }

    const requests = await serviceModel.getRequestsByAccount(account_id)
    res.render("service/my-requests", {
      title: "My Service Log",
      requests
    })
  } catch (error) {
    next(error)
  }
}

export async function buildServiceManage(req, res, next) {
  try {
    const requests = await serviceModel.getAllServiceRequests()
    res.render("service/manage", {
      title: "Admin Service Center",
      requests
    })
  } catch (error) {
    next(error)
  }
}