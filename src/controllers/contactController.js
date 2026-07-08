import { insertMessage, getAllMessages } from "../models/contactModel.js"

export async function buildContactForm(req, res, next) {
  try {
    res.render("contact/index", {
      title: "Contact Us",
    })
  } catch (error) {
    next(error)
  }
}

export async function processContactSubmission(req, res, next) {
  try {
    const { contact_name, contact_email, contact_message } = req.body
    
    const account_id = req.session.user ? req.session.user.account_id : null

    const result = await insertMessage(contact_name, contact_email, contact_message, account_id)

    if (result) {
      req.flash("notice", "Thank you for your message! Our marketing team will reach out shortly.")
      res.redirect("/contact")
    } else {
      req.flash("notice", "Sorry, your message could not be sent at this time.")
      res.status(500).render("contact/index", {
        title: "Contact Us",
        contact_name,
        contact_email,
        contact_message
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function buildContactManage(req, res, next) {
  try {
    const messages = await getAllMessages()
    res.render("contact/manage", {
      title: "Manage Contact Inquiries",
      messages
    })
  } catch (error) {
    next(error)
  }
}