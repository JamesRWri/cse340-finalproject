import pool from "../database/pool.js"

export async function insertMessage(contact_name, contact_email, contact_message, account_id = null) {
  try {
    const sql = `INSERT INTO public.contact 
                 (contact_name, contact_email, contact_message, account_id) 
                 VALUES ($1, $2, $3, $4) RETURNING *`
    const result = await pool.query(sql, [contact_name, contact_email, contact_message, account_id])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error saving contact message: " + error)
    throw error
  }
}

export async function getAllMessages() {
  try {
    const sql = "SELECT * FROM public.contact ORDER BY contact_date DESC"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Model error fetching contact messages: " + error)
    throw error
  }
}