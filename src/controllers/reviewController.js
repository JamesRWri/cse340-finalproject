import * as reviewModel from "../models/reviewModel.js";

export async function addReview(req, res, next) {
  try {
    const { review_text, inv_id } = req.body;
    const account_id = req.session.user.account_id;

    const result = await reviewModel.insertReview(review_text, inv_id, account_id);

    if (result) {
      req.flash("notice", "Your review was submitted successfully!");
    } else {
      req.flash("notice", "Failed to submit your review.");
    }
    return res.redirect(`/vehicles/detail/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

export async function buildEditReview(req, res, next) {
  try {
    const review_id = req.params.reviewId;
    const review = await reviewModel.getReviewById(review_id);

    if (!review || review.account_id !== req.session.user.account_id) {
      req.flash("notice", "You are not authorized to edit this review.");
      return res.redirect("/account/dashboard");
    }

    res.render("review/edit", {
      title: `Edit Review for ${review.inv_year} ${review.inv_make} ${review.inv_model}`,
      review
    });
  } catch (error) {
    next(error);
  }
}

export async function processEditReview(req, res, next) {
  try {
    const { review_id, review_text } = req.body;
    const review = await reviewModel.getReviewById(review_id);

    if (!review || review.account_id !== req.session.user.account_id) {
      req.flash("notice", "Unauthorized action.");
      return res.redirect("/account/dashboard");
    }

    await reviewModel.updateReview(review_id, review_text);
    req.flash("notice", "Review updated successfully.");
    res.redirect("/account/dashboard");
  } catch (error) {
    next(error);
  }
}

export async function buildDeleteReview(req, res, next) {
  try {
    const review_id = req.params.reviewId;
    const review = await reviewModel.getReviewById(review_id);

    const isOwner = review && review.account_id === req.session.user.account_id;
    const isStaff = req.session.user.account_type === "Employee" || req.session.user.account_type === "Admin";

    if (!review || (!isOwner && !isStaff)) {
      req.flash("notice", "Unauthorized action.");
      return res.redirect("/account/dashboard");
    }

    res.render("review/delete", {
      title: `Delete Review for ${review.inv_year} ${review.inv_make} ${review.inv_model}`,
      review
    });
  } catch (error) {
    next(error);
  }
}

export async function processDeleteReview(req, res, next) {
  try {
    const { review_id } = req.body;
    await reviewModel.deleteReview(review_id);
    req.flash("notice", "Review was successfully deleted.");
    res.redirect("/account/dashboard");
  } catch (error) {
    next(error);
  }
}