import pool from "../database/index.js"

const mockInventory = [
  { inv_id: 1, inv_year: 2021, inv_make: "Ford", inv_model: "F-150 Lariat", inv_miles: 34000, inv_price: 42500, inv_color: "Black", category: "Trucks", status: "Available", inv_description: "A powerful full-size pickup truck with premium leather interior and great towing capacity." },
  { inv_id: 2, inv_year: 2019, inv_make: "Honda", inv_model: "Odyssey EX-L", inv_miles: 48500, inv_price: 28900, inv_color: "Silver", category: "Vans", status: "Available", inv_description: "The ultimate family minivan featuring spacious leather seating, rear entertainment system, and advanced safety features." },
  { inv_id: 3, inv_year: 2022, inv_make: "Toyota", inv_model: "Camry SE", inv_miles: 18200, inv_price: 26400, inv_color: "White", category: "Cars", status: "Available", inv_description: "A highly reliable, fuel-efficient midsize sedan with a sporty design and modern infotainment system." },
  { inv_id: 4, inv_year: 2020, inv_make: "Jeep", inv_model: "Grand Cherokee", inv_miles: 29000, inv_price: 31500, inv_color: "Gray", category: "SUVs", status: "In Service", inv_description: "A rugged yet refined midsize SUV with legendary 4x4 capability and premium cabin comfort." }
];

const vehicleModel = {
    getInventory: async () => {
        try {
            const result = await pool.query("SELECT * FROM public.inventory");
            if (result.rows.length > 0) return result.rows;
            return mockInventory;
        } catch (error) {
            console.log("Model database read error, using local sandbox array data instead.");
            return mockInventory;
        }
    },

    getVehicleById: async (invId) => {
        try {
            const result = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [invId]);
            if (result.rows[0]) return result.rows[0];
            
            return mockInventory.find(car => Number(car.inv_id) === Number(invId));
        } catch (error) {
            return mockInventory.find(car => Number(car.inv_id) === Number(invId));
        }
    }
};

export default vehicleModel;