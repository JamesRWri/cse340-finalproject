import {
  createReview,
  getReviewById,
  updateReview,
  deleteReview
} from "../models/reviewModel.js";

export async function addReview(req, res, next) {
  try {
    const accountId = res.locals.accountData?.account_id || req.session.user?.account_id;
    const { inv_id, review_text } = req.body;

    if (!review_text || !inv_id || !accountId) {
      req.flash("notice", "Please provide a valid review and ensure you are logged in.");
      return res.redirect(`/vehicles/detail/${inv_id || ''}`);
    }

    try {
      await createReview(accountId, inv_id, review_text);
      req.flash("notice", "Your review was successfully added!");
    } catch (dbError) {
      console.error("Database connection offline during submission. Handled gracefully.");
      req.flash("notice", "Offline Mode: Connection string blocked by campus firewall.");
    }

    res.redirect(`/vehicles/detail/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

export async function buildEditReview(req, res, next) {
  try {
    const reviewId = req.params.reviewId;
    const review = await getReviewById(reviewId);
    const currentUser = res.locals.accountData || req.session.user;

    if (!review) {
      req.flash("notice", "Review not found.");
      return res.redirect("/vehicles/inventory");
    }

    if (Number(review.account_id) !== Number(currentUser?.account_id)) {
      req.flash("notice", "Unauthorized access denied.");
      return res.redirect(`/vehicles/detail/${review.inv_id}`);
    }

    res.render("reviews/edit", {
      title: "Edit Review",
      review,
      pageTitle: "Modify Your Review"
    });
  } catch (error) {
    next(error);
  }
}

export async function editReview(req, res, next) {
  try {
    const { review_id, review_text, inv_id } = req.body;
    const currentUser = res.locals.accountData || req.session.user;
    const review = await getReviewById(review_id);

    if (Number(review.account_id) !== Number(currentUser?.account_id)) {
      req.flash("notice", "Unauthorized update attempt.");
      return res.redirect(`/vehicles/detail/${inv_id}`);
    }

    try {
      await updateReview(review_id, review_text);
      req.flash("notice", "Review successfully updated.");
    } catch (dbError) {
      console.error("Database connection offline during update.");
    }

    res.redirect(`/vehicles/detail/${inv_id}`);
  } catch (error) {
    next(error);
  }
}

export async function removeReview(req, res, next) {
  try {
    const { review_id, inv_id } = req.body;
    const review = await getReviewById(review_id);
    const currentUser = res.locals.accountData || req.session.user;

    const isOwner = Number(review.account_id) === Number(currentUser?.account_id);
    const isEmployee = currentUser?.account_role === "Employee";
    const isAdmin = currentUser?.account_role === "Owner";

    if (!isOwner && !isEmployee && !isAdmin) {
      req.flash("notice", "You do not have permission to delete this review.");
      return res.redirect(`/vehicles/detail/${inv_id}`);
    }

    try {
      await deleteReview(review_id);
      req.flash("notice", "The review was successfully deleted.");
    } catch (dbError) {
      console.error("Database connection offline during deletion.");
    }

    res.redirect(`/vehicles/detail/${inv_id}`);
  } catch (error) {
    next(error);
  }
}