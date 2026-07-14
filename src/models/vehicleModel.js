import pool from "../database/pool.js"

export async function getClassifications() {
  try {
    const sql = "SELECT * FROM public.classification ORDER BY classification_name"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Model error fetching classifications: " + error)
    throw error
  }
}

export async function getAllVehicles() {
  try {
    const sql = "SELECT * FROM public.inventory ORDER BY inv_make, inv_model"
    const result = await pool.query(sql)
    return result.rows
  } catch (error) {
    console.error("Model error fetching all inventory: " + error)
    throw error
  }
}

export async function getVehicleById(inventoryId) {
  try {
    const sql = "SELECT * FROM public.inventory WHERE inv_id = $1"
    const result = await pool.query(sql, [inventoryId])
    return result.rows[0]
  } catch (error) {
    console.error("Model error fetching vehicle by ID: " + error)
    throw error
  }
}

export async function insertVehicle(vehicleData) {
  try {
    const {
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    } = vehicleData

    const sql = `INSERT INTO public.inventory 
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    
    const result = await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    ])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error inserting vehicle: " + error)
    throw error
  }
}

export async function updateVehicle(vehicleData) {
  try {
    const {
      inv_id, inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id
    } = vehicleData

    const sql = `UPDATE public.inventory 
      SET inv_make = $1, inv_model = $2, inv_year = $3, inv_description = $4, 
          inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, 
          inv_color = $9, classification_id = $10 
      WHERE inv_id = $11 RETURNING *`
    
    const result = await pool.query(sql, [
      inv_make, inv_model, inv_year, inv_description, 
      inv_image, inv_thumbnail, inv_price, inv_miles, 
      inv_color, classification_id, inv_id
    ])
    return result.rowCount > 0
  } catch (error) {
    console.error("Model error updating vehicle: " + error)
    throw error
  }
}

export async function insertClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0];
  } catch (error) {
    console.error("insertClassification error: " + error);
    return error.message;
  }
}

export async function insertInventoryItem(
  classification_id, inv_make, inv_model, inv_year, 
  inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
) {
  try {
    const sql = `INSERT INTO inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    
    const result = await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_year, 
      inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("insertInventoryItem error: " + error);
    return error.message;
  }
}