import pool from "../database/pool.js";

export async function insertReview(review_text, inv_id, account_id) {
  try {
    const sql = `INSERT INTO reviews (review_text, inv_id, account_id) 
                 VALUES ($1, $2, $3) RETURNING *`;
    const result = await pool.query(sql, [review_text, inv_id, account_id]);
    return result.rows[0];
  } catch (error) {
    console.error("insertReview error: " + error);
    return error.message;
  }
}

export async function getReviewsByVehicleId(inv_id) {
  try {
    const sql = `SELECT r.*, a.account_firstname, a.account_lastname 
                 FROM reviews r 
                 JOIN account a ON r.account_id = a.account_id 
                 WHERE r.inv_id = $1 
                 ORDER BY r.review_date DESC`;
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    console.error("getReviewsByVehicleId error: " + error);
    return [];
  }
}

export async function getReviewsByAccountId(account_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
                 FROM reviews r 
                 JOIN inventory i ON r.inv_id = i.inv_id 
                 WHERE r.account_id = $1 
                 ORDER BY r.review_date DESC`;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error);
    return [];
  }
}

export async function getReviewById(review_id) {
  try {
    const sql = `SELECT r.*, i.inv_make, i.inv_model, i.inv_year 
                 FROM reviews r 
                 JOIN inventory i ON r.inv_id = i.inv_id 
                 WHERE r.review_id = $1`;
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("getReviewById error: " + error);
    return null;
  }
}

export async function updateReview(review_id, review_text) {
  try {
    const sql = "UPDATE reviews SET review_text = $1 WHERE review_id = $2 RETURNING *";
    const result = await pool.query(sql, [review_text, review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("updateReview error: " + error);
    return error.message;
  }
}

export async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1 RETURNING *";
    const result = await pool.query(sql, [review_id]);
    return result.rows[0];
  } catch (error) {
    console.error("deleteReview error: " + error);
    return error.message;
  }
}