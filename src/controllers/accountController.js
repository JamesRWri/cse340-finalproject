import { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail 
} from "../models/accountModel.js"

export async function buildLogin(req, res, next) {
  try {
    res.render("account/login", {
      title: "Login",
    })
  } catch (error) {
    next(error)
  }
}

export async function buildRegister(req, res, next) {
  try {
    res.render("account/register", {
      title: "Register An Account",
    })
  } catch (error) {
    next(error)
  }
}

export async function processRegistration(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    const emailExists = await checkExistingEmail(account_email)
    if (emailExists) {
      req.flash("notice", "That email is already registered. Please login instead.")
      return res.status(400).render("account/register", {
        title: "Register An Account",
        account_firstname,
        account_lastname,
        account_email
      })
    }

    const regResult = await registerAccount(account_firstname, account_lastname, account_email, account_password)

    if (regResult) {
      req.flash("notice", "Registration successful! Please log in.")
      res.redirect("/account/login")
    } else {
      req.flash("notice", "Sorry, registration failed.")
      res.status(501).render("account/register", {
        title: "Register An Account",
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function processLogin(req, res, next) {
  try {
    const { account_email, account_password } = req.body
    const accountData = await getAccountByEmail(account_email)

    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        account_email,
      })
    }

    if (account_password === accountData.account_password) {
      req.session.user = accountData
      res.locals.accountData = accountData
      res.locals.loggedin = 1
      
      req.flash("notice", `Welcome back, ${accountData.account_firstname}!`)
      return res.redirect("/")
    } else {
      req.flash("notice", "Incorrect password.")
      return res.status(400).render("account/login", {
        title: "Login",
        account_email,
      })
    }
  } catch (error) {
    next(error)
  }
}