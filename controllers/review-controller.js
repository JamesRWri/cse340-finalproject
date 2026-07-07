import reviewModel from "../models/review-model.js"

const reviewController = {}

reviewController.addReview = async function (req, res, next) {
  try {
    const { reviewText, invId, accountId } = req.body

    if (!reviewText || !invId || !accountId) {
      req.flash("notice", "Please provide a valid review.")
      return res.redirect(`/inv/detail/${invId}`)
    }

    const result = await reviewModel.addReview(reviewText, invId, accountId)

    if (result) {
      req.flash("notice", "Your review was successfully submitted!")
      res.redirect(`/inv/detail/${invId}`)
    } else {
      req.flash("notice", "Sorry, saving your review failed.")
      res.redirect(`/inv/detail/${invId}`)
    }
  } catch (error) {
    next(error)
  }
}

reviewController.deleteReview = async function (req, res, next) {
  try {
    const { review_id, account_id, inv_id } = req.body
    
    if (!req.session || !req.session.loggedin) {
      req.flash("notice", "You must log in to manage reviews.")
      return res.redirect("/account/login")
    }

    const currentUser = req.session.accountData

    const isOwnerOfReview = Number(currentUser.account_id) === Number(account_id)
    
    const isEmployeeOrOwner = currentUser.account_role === 'Employee' || currentUser.account_role === 'Owner'

    if (isOwnerOfReview || isEmployeeOrOwner) {
      const success = await reviewModel.deleteReviewById(review_id)
      
      if (success) {
        req.flash("notice", "The review was successfully deleted.")
      } else {
        req.flash("notice", "Error: The review could not be removed from the database.")
      }
      
      return res.redirect(`/inv/detail/${inv_id}`)
    } else {
      req.flash("notice", "Security Error: You do not have permissions to delete that item.")
      return res.redirect(`/inv/detail/${inv_id}`)
    }

  } catch (error) {
    next(error)
  }
}

export default reviewController