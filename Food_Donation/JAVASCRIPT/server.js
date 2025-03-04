require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Create MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ✅ Ensure Tables Exist
async function setupDatabase() {
    try {
        const connection = await pool.getConnection();

        await connection.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS food_donations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL,
            foodType VARCHAR(255) NOT NULL,
            quantity INT NOT NULL,
            expiryTime DATETIME NOT NULL,
            pickupTime DATETIME NOT NULL,
            foodCondition ENUM('cooked', 'packaged', 'raw') NOT NULL,
            storageCondition ENUM('normal', 'refrigerated') NOT NULL,
            location VARCHAR(255) NOT NULL,
            notes TEXT,
            status ENUM('pending', 'accepted') DEFAULT 'pending'
        )`);

        connection.release();
        console.log("✅ Database setup complete");
    } catch (err) {
        console.error("❌ Error setting up database:", err.message);
    }
}
setupDatabase();

// 🟢 REGISTER USER
app.post("/register", async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = "INSERT INTO users (name, phone, email, password) VALUES (?, ?, ?, ?)";
        await pool.execute(sql, [name, phone, email, hashedPassword]);

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

// 🟢 LOGIN USER
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (users.length === 0) {
            return res.status(401).json({ error: "User not found" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ message: "Login successful", user });
    } catch (err) {
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

// 🟢 DONATE FOOD
app.post("/donate", async (req, res) => {
    try {
        const { name, email, phone, foodType, quantity, expiryTime, pickupTime, foodCondition, storageCondition, location, notes } = req.body;

        if (!name || !email || !phone || !foodType || !quantity || !expiryTime || !pickupTime || !foodCondition || !storageCondition || !location) {
            return res.status(400).json({ error: "All required fields must be filled!" });
        }

        const sql = `INSERT INTO food_donations (name, email, phone, foodType, quantity, expiryTime, pickupTime, foodCondition, storageCondition, location, notes)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        await pool.execute(sql, [name, email, phone, foodType, quantity, expiryTime, pickupTime, foodCondition, storageCondition, location, notes]);
        res.json({ message: "Donation submitted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Donation submission failed", details: err.message });
    }
});

// 🟢 GET FOOD DONATIONS (For NGO Dashboard)
app.get("/donations", async (req, res) => {
    try {
        const [donations] = await pool.execute("SELECT * FROM food_donations ORDER BY pickupTime DESC");
        res.json(donations);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch donations", details: err.message });
    }
});

// 🟢 ACCEPT DONATION (Mark as Accepted by NGO)
app.patch("/donations/:id/accept", async (req, res) => {
    try {
        const donationId = req.params.id;

        const [existingDonation] = await pool.execute("SELECT * FROM food_donations WHERE id = ?", [donationId]);
        if (existingDonation.length === 0) {
            return res.status(404).json({ error: "Donation not found" });
        }

        await pool.execute("UPDATE food_donations SET status = 'accepted' WHERE id = ?", [donationId]);

        res.json({ message: "Donation accepted successfully!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to accept donation", details: err.message });
    }
});

// 🟢 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
