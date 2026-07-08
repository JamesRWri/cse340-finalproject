export function checkLogin(req, res, next) {
  if (req.session && req.session.user) {
    next()
  } else {
    req.flash("notice", "Please log in to access this page.")
    return res.redirect("/account/login")
  }
}

export function checkAdmin(req, res, next) {
  if (req.session && req.session.user && (req.session.user.account_type === 'Admin' || req.session.user.account_type === 'Employee')) {
    next()
  } else {
    req.flash("notice", "Access denied. Administrative permissions required.")
    return res.redirect("/account/login")
  }
}