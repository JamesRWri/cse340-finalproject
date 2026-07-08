import pool from "../database/pool.js"

export async function createReview(account_id, inv_id, review_text) {
  try {
    const sql = "INSERT INTO public.reviews (account_id, inv_id, review_text) VALUES ($1, $2, $3) RETURNING *"
    const result = await pool.query(sql, [account_id, inv_id, review_text])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error creating review: " + error)
    throw error
  }
}

export async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM public.reviews r 
                 JOIN public.account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("Model error fetching reviews by vehicle: " + error)
    throw error
  }
}

export async function getReviewById(review_id) {
  try {
    const sql = "SELECT * FROM public.reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rows[0]
  } catch (error) {
    console.error("Model error fetching review by ID: " + error)
    throw error
  }
}

export async function updateReview(review_id, review_text) {
  try {
    const sql = "UPDATE public.reviews SET review_text = $1 WHERE review_id = $2 RETURNING *"
    const result = await pool.query(sql, [review_text, review_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error updating review: " + error)
    throw error
  }
}

export async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error deleting review: " + error)
    throw error
  }
}