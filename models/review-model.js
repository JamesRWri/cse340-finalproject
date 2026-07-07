import pool from "../database/index.js"

export async function addReview(reviewText, invId, accountId) {
  try {
    const sql = "INSERT INTO public.reviews (review_text, inv_id, account_id) VALUES ($1, $2, $3) RETURNING *"
    const result = await pool.query(sql, [reviewText, invId, accountId])
    return result.rows[0] 
  } catch (error) {
    console.error("model error: " + error)
    return null
  }
}

export async function getReviewsByInvId(invId) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM public.reviews r 
      JOIN public.account a ON r.account_id = a.account_id 
      WHERE r.inv_id = $1 
      ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [invId])
    return data.rows
  } catch (error) {
    console.error("model error: " + error)
    return []
  }
}

export async function getReviewsByAccountId(accountId) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model 
      FROM public.reviews r 
      JOIN public.inventory i ON r.inv_id = i.inv_id 
      WHERE r.account_id = $1 
      ORDER BY r.review_date DESC`
    const data = await pool.query(sql, [accountId])
    return data.rows
  } catch (error) {
    console.error("model error: " + error)
    return []
  }
}

export async function deleteReviewById(review_id) {
  try {
    const sql = 'DELETE FROM public.reviews WHERE review_id = $1';
    const result = await pool.query(sql, [review_id]);
    return result.rowCount > 0; 
  } catch (error) {
    console.error("model error: " + error)
    return false;
  }
}

export default {
  addReview,
  getReviewsByInvId,
  getReviewsByAccountId,
  deleteReviewById
}