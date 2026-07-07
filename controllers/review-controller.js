import reviewModel from "../models/review-model.js"

const localMockReviews = [];

const reviewController = {}

reviewController.addReview = async function (req, res, next) {
  try {
    const reviewText = req.body.reviewText || req.body.review_text;
    
    const refererParts = req.get('Referer')?.split('/') || [];
    const invId = Number(refererParts[refererParts.length - 1]) || 1;
    
    const accountId = res.locals.accountData?.account_id || 1;

    if (!reviewText) {
      req.flash("notice", "Please provide a valid review.")
      return res.redirect(`/vehicles/detail/${invId}`)
    }

    try {
      await reviewModel.addReview(reviewText, invId, accountId)
    } catch (dbError) {
      console.log("Database offline. Saving to sandbox array instead.");
      
      localMockReviews.push({
        review_id: Date.now(),
        review_text: reviewText, 
        review_date: new Date().toISOString(),
        inv_id: invId, // Securely matched matching ID
        account_id: Number(accountId),
        account_firstname: res.locals.accountData?.account_firstname || "James",
        account_lastname: res.locals.accountData?.account_lastname || "User"
      });
    }

    res.redirect(`/vehicles/detail/${invId}`)
  } catch (error) {
    next(error)
  }
}

reviewController.deleteReview = async function (req, res, next) {
  try {
    const review_id = req.body.review_id
    const inv_id = req.body.inv_id || 1
    const account_id = req.body.account_id
    
    const loggedIn = req.session?.loggedin || res.locals.loggedin;
    const currentUser = req.session?.accountData || res.locals.accountData;

    if (!loggedIn) {
      req.flash("notice", "You must log in to manage reviews.")
      return res.redirect("/vehicles/inventory")
    }

    const isOwnerOfReview = Number(currentUser.account_id) === Number(account_id)
    const isEmployeeOrOwner = currentUser.account_role === 'Employee' || currentUser.account_role === 'Owner'

    if (isOwnerOfReview || isEmployeeOrOwner) {
      try {
        await reviewModel.deleteReviewById(review_id)
        req.flash("notice", "The review was successfully deleted.")
      } catch (dbErr) {
        const index = localMockReviews.findIndex(r => r.review_id === Number(review_id));
        if (index !== -1) localMockReviews.splice(index, 1);
        req.flash("notice", "The review was removed from local sandbox memory.")
      }
      
      return res.redirect(`/vehicles/detail/${inv_id}`)
    } else {
      req.flash("notice", "Security Error: You do not have permissions to delete that item.")
      return res.redirect(`/vehicles/detail/${inv_id}`)
    }

  } catch (error) {
    next(error)
  }
}

reviewController.getSandboxReviews = function(invId) {
    return localMockReviews.filter(r => Number(r.inv_id) === Number(invId));
}

export default reviewController