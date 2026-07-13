import pool from "../database/pool.js"
import bcrypt from "bcryptjs"

export async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(account_password, saltRounds);

    const sql = `INSERT INTO public.account 
                 (account_firstname, account_lastname, account_email, account_password, account_type) 
                 VALUES ($1, $2, $3, $4, 'Client') RETURNING *`
                 
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, hashedPassword])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error registering account: " + error)
    throw error
  }
}

export async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rowCount
  } catch (error) {
    console.error("Model error checking email: " + error)
    throw error
  }
}

export async function getAccountByEmail(account_email) {
  try {
    const sql = "SELECT * FROM public.account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])
    return result.rows[0]
  } catch (error) {
    console.error("Model error fetching account by email: " + error)
    throw error
  }
}