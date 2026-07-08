import pool from "../database/pool.js"

export async function getAllCategories() {
  try {
    const sql = "SELECT * FROM public.classification ORDER BY classification_name"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Model error fetching categories: " + error)
    throw error
  }
}

export async function insertCategory(classification_name) {
  try {
    const sql = `INSERT INTO public.classification (classification_name) 
                 VALUES ($1) RETURNING *`
    const result = await pool.query(sql, [classification_name])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error inserting category: " + error)
    throw error
  }
}