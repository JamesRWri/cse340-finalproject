const pool = require("../database/")

async function addReview(reviewText, invId, accountId) {
  try {
    const sql = "INSERT INTO public.reviews (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    return await pool.query(sql, [reviewText, invId, accountId])
  } catch (error) {
    return error.message
  }
}

async function getReviewsByInvId(invId) {
  try {
    const sql = "SELECT r.*, a.account_firstname, a.account_lastname FROM public.reviews r JOIN public.account a ON r.account_id = a.account_id WHERE r.inv_id = $1 ORDER BY r.review_date DESC"
    const data = await pool.query(sql, [invId])
    return data.rows
  } catch (error) {
    return error.message
  }
}

async function getReviewsByAccountId(accountId) {
  try {
    const sql = "SELECT r.*, i.inv_make, i.inv_model FROM public.reviews r JOIN public.inventory i ON r.inv_id = i.inv_id WHERE r.account_id = $1 ORDER BY r.review_date DESC"
    const data = await pool.query(sql, [accountId])
    return data.rows
  } catch (error) {
    return error.message
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId
}