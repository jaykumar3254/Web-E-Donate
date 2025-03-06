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

const nodemailer = require("nodemailer");

// ✅ Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail", // Change this if using another service
    auth: {
        user: process.env.EMAIL_USER, // Your email (from .env)
        pass: process.env.EMAIL_PASS  // Your app password (from .env)
    }
});

// ✅ Function to Send Email
async function sendDonationAcceptedEmail(donorEmail, donorName, ngoName) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: donorEmail,
        subject: "Your Donation Has Been Accepted!",
        text: `Dear ${donorName},\n\nThank you for your donation! Your food donation has been accepted by ${ngoName}. We appreciate your generosity.\n\nBest regards,\nFood Donation Platform`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${donorEmail}`);
    } catch (error) {
        console.error("❌ Email Sending Error:", error);
    }
}

// ✅ Ensure Tables Exist
async function setupDatabase() {
    try {
        const connection = await pool.getConnection();

        await connection.query(`CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )`);

        await connection.query(`CREATE TABLE IF NOT EXISTS ngo (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ngo_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            phone VARCHAR(20) NOT NULL UNIQUE,
            website VARCHAR(255),
            ngo_type ENUM('education', 'health', 'environment') NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
            status ENUM('pending', 'accepted') DEFAULT 'pending',
            assigned_ngo_id INT NULL
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

// 🟢 REGISTER NGO
app.post("/ngo/register", async (req, res) => {
    try {
        console.log("📩 Received Registration Data:", req.body);
        const { ngoName, email, phone, website, ngoType, password } = req.body;

        if (!ngoName || !email || !phone || !ngoType || !password) {
            return res.status(400).json({ error: "All required fields must be filled!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO ngo (ngo_name, email, phone, website, ngo_type, password_hash) VALUES (?, ?, ?, ?, ?, ?)";
        await pool.execute(sql, [ngoName, email, phone, website, ngoType, hashedPassword]);

        console.log("✅ NGO Registered Successfully!");
        res.json({ message: "NGO registered successfully" });
    } catch (err) {
        console.error("❌ Registration Error:", err.message);

        if (err.code === "ER_DUP_ENTRY") {
            if (err.sqlMessage.includes("email")) {
                return res.status(400).json({ error: "Email already exists" });
            } else if (err.sqlMessage.includes("phone")) {
                return res.status(400).json({ error: "Phone number already exists" });
            }
        }

        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

// 🟢 LOGIN NGO
app.post("/ngo/login", async (req, res) => {
    try {
        console.log("📩 NGO Login Attempt:", req.body);
        const { email, password } = req.body;
        const [ngos] = await pool.execute("SELECT * FROM ngo WHERE email = ?", [email]);

        if (ngos.length === 0) {
            return res.status(401).json({ error: "NGO not found" });
        }

        const ngo = ngos[0];
        const isMatch = await bcrypt.compare(password, ngo.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        console.log("✅ NGO Login Successful:", email);
        res.json({ message: "Login successful", ngoId: ngo.id });
    } catch (err) {
        console.error("❌ Login Error:", err.message);
        res.status(500).json({ error: "Login failed", details: err.message });
    }
});

// 🟢 GET NGO Dashboard Data
app.get("/ngo/dashboard/:ngoId", async (req, res) => {
    try {
        const ngoId = req.params.ngoId;
        const [ngos] = await pool.execute("SELECT * FROM ngo WHERE id = ?", [ngoId]);

        if (ngos.length === 0) {
            return res.status(404).json({ error: "NGO not found" });
        }

        res.json(ngos[0]);
    } catch (err) {
        console.error("❌ Dashboard Fetch Error:", err.message);
        res.status(500).json({ error: "Failed to fetch NGO data", details: err.message });
    }
});

// 🟢 GET ALL FOOD DONATIONS (For NGO Dashboard)
app.get("/donations", async (req, res) => {
    try {
        const [donations] = await pool.execute("SELECT * FROM food_donations ORDER BY pickupTime DESC");
        res.json(donations);
    } catch (err) {
        console.error("❌ Fetch Donations Error:", err.message);
        res.status(500).json({ error: "Failed to fetch donations", details: err.message });
    }
});

// 🟢 ACCEPT DONATION (Assign donation to an NGO & Notify User)
app.patch("/donations/:id/accept/:ngoId", async (req, res) => {
    try {
        const { id, ngoId } = req.params;

        // Check if the donation exists and is still pending
        const [existingDonation] = await pool.execute("SELECT * FROM food_donations WHERE id = ?", [id]);
        if (existingDonation.length === 0) {
            return res.status(404).json({ error: "Donation not found" });
        }

        if (existingDonation[0].status !== "pending") {
            return res.status(400).json({ error: "Donation has already been accepted" });
        }

        // Get donor details
        const { name: donorName, email: donorEmail } = existingDonation[0];

        // Get NGO Name
        const [ngo] = await pool.execute("SELECT ngo_name FROM ngo WHERE id = ?", [ngoId]);
        if (ngo.length === 0) {
            return res.status(404).json({ error: "NGO not found" });
        }
        const ngoName = ngo[0].ngo_name;

        // Assign donation to NGO
        await pool.execute("UPDATE food_donations SET status = 'accepted', assigned_ngo_id = ? WHERE id = ?", [ngoId, id]);

        // Send email notification to donor
        sendDonationAcceptedEmail(donorEmail, donorName, ngoName);

        res.json({ message: "Donation assigned to NGO successfully & email sent!" });
    } catch (err) {
        console.error("❌ Accept Donation Error:", err.message);
        res.status(500).json({ error: "Failed to assign donation", details: err.message });
    }
});

// 🟢 Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});