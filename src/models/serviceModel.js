import pool from "../database/pool.js"

export async function insertServiceRequest(account_id, service_vehicle_info, service_description) {
  try {
    const sql = `INSERT INTO public.service_request 
                 (account_id, service_vehicle_info, service_description) 
                 VALUES ($1, $2, $3) RETURNING *`
    const result = await pool.query(sql, [account_id, service_vehicle_info, service_description])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error adding service request: " + error)
    throw error
  }
}

export async function getRequestsByAccount(account_id) {
  try {
    const sql = "SELECT * FROM public.service_request WHERE account_id = $1 ORDER BY service_date DESC"
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("Model error fetching user service requests: " + error)
    throw error
  }
}

export async function getAllServiceRequests() {
  try {
    const sql = `SELECT s.*, a.account_firstname, a.account_lastname 
                 FROM public.service_request s
                 JOIN public.account a ON s.account_id = a.account_id
                 ORDER BY s.service_date DESC`
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Model error fetching all service requests: " + error)
    throw error
  }
}