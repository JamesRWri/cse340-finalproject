import { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail 
} from "../models/accountModel.js"
import { getReviewsByAccountId } from "../models/reviewModel.js"
import pool from "../database/pool.js"
import bcrypt from "bcryptjs" 

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
      return res.status(400).render("account/register", {
        title: "Register An Account",
        account_firstname,
        account_lastname,
        account_email,
        messages: { notice: "That email is already registered. Please login instead." }
      })
    }

    const regResult = await registerAccount(account_firstname, account_lastname, account_email, account_password)

    if (regResult) {
      return res.status(201).render("account/login", {
        title: "Login",
        messages: { notice: "Registration successful! Please log in." }
      })
    } else {
      return res.status(501).render("account/register", {
        title: "Register An Account",
        messages: { notice: "Sorry, registration failed." }
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
      return res.status(400).render("account/login", {
        title: "Login",
        account_email,
        messages: { notice: "Please check your credentials and try again." }
      })
    }
    
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)

    if (passwordMatch) {
      delete accountData.account_password
      
      req.session.user = accountData
      req.session.loggedin = true
      
      if (accountData.account_type === "Admin" || accountData.account_type === "Employee") {
        return res.redirect("/account/dashboard")
      } else {
        return res.redirect("/vehicles/inventory")
      }
    } else {
      return res.status(400).render("account/login", {
        title: "Login",
        account_email,
        messages: { notice: "Incorrect password." }
      })
    }
  } catch (error) {
    next(error)
  }
}

export async function buildDashboard(req, res, next) {
  try {
    if (!req.session || !req.session.loggedin) {
      return res.redirect("/account/login")
    }

    const accountData = req.session.user

    let userReviews = []
    try {
      userReviews = await getReviewsByAccountId(accountData.account_id)
    } catch (dbError) {
      console.error("Error retrieving dashboard reviews: ", dbError)
    }

    res.render("account/dashboard", {
      title: "Account Management Dashboard",
      accountData, 
      userReviews,
    })
  } catch (error) {
    next(error)
  }
}

export async function processLogout(req, res, next) {
  req.session.destroy()
  res.redirect("/")
}

export async function buildManageUsers(req, res) {
    try {
        const result = await pool.query(
            "SELECT account_id, account_firstname, account_lastname, account_email, account_type FROM account ORDER BY account_lastname ASC"
        );
        const users = result.rows;

        let userTable = '<table class="admin-table" style="width:100%; border-collapse: collapse; margin-top: 20px;">';
        userTable += '<thead><tr style="background-color: #f2f2f2; text-align: left;">';
        userTable += '<th style="padding: 10px; border-bottom: 1px solid #ddd;">Name</th>';
        userTable += '<th style="padding: 10px; border-bottom: 1px solid #ddd;">Email</th>';
        userTable += '<th style="padding: 10px; border-bottom: 1px solid #ddd;">Role</th>';
        userTable += '</tr></thead><tbody>';

        users.forEach(user => {
            userTable += `<tr style="border-bottom: 1px solid #ddd;">`;
            userTable += `<td style="padding: 10px;">${user.account_firstname} ${user.account_lastname}</td>`;
            userTable += `<td style="padding: 10px;">${user.account_email}</td>`;
            userTable += `<td style="padding: 10px;">${user.account_type}</td>`;
            userTable += `</tr>`;
        });

        userTable += '</tbody></table>';

        res.render("account/manage-users", {
            title: "Manage Users & Roles",
            userTable: userTable
        });

    } catch (error) {
        console.error("Error fetching users for admin:", error);
        res.status(500).send("Server Error loading user management screen.");
    }
}