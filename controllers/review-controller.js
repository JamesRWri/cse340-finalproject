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

export default reviewController