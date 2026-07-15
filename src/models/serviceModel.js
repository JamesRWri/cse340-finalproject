import pool from "../database/pool.js";

export async function insertServiceRequest(account_id, service_vehicle_info, service_description) {
  const sql = `INSERT INTO service_request 
    (account_id, service_vehicle_info, service_description, service_status) 
    VALUES ($1, $2, $3, 'Submitted') RETURNING *`;
  const result = await pool.query(sql, [account_id, service_vehicle_info, service_description]);
  return result.rows[0];
}

export async function getServicesByAccountId(account_id) {
  const sql = "SELECT * FROM service_request WHERE account_id = $1 ORDER BY service_date DESC";
  const result = await pool.query(sql, [account_id]);
  return result.rows;
}

export async function getAllServices() {
  const sql = `SELECT s.*, a.account_firstname, a.account_lastname 
               FROM service_request s 
               JOIN account a ON s.account_id = a.account_id 
               ORDER BY s.service_date DESC`;
  const result = await pool.query(sql);
  return result.rows;
}

export async function updateServiceStatus(service_id, service_status) {
  const sql = "UPDATE service_request SET service_status = $1 WHERE service_id = $2 RETURNING *";
  const result = await pool.query(sql, [service_status, service_id]);
  return result.rows[0];
}