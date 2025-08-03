const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");

const PORT = 5050;
const MONGO_URL = "mongodb://mongo:27017"; // Mongo container name
const DATABASE_NAME = "mydatabase";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let db; // Global variable for database connection

// Connect to MongoDB once on startup
async function connectDB() {
    try {
        const client = new MongoClient(MONGO_URL);
        await client.connect();
        db = client.db(DATABASE_NAME);
        console.log("✅ Connected to MongoDB");
    } catch (err) {
        console.error("❌ Failed to connect to MongoDB", err);
        process.exit(1);
    }
}
connectDB();

// ========== ROUTES ==========

// GET all users
app.get("/getUsers", async (req, res) => {
    try {
        const data = await db.collection("users").find({}).toArray();
        res.send(data);
    } catch (err) {
        res.status(500).send("Error fetching users");
    }
});

// POST new user
app.post("/addUser", async (req, res) => {
    try {
        const userObj = req.body;
        await db.collection("users").insertOne(userObj);
        res.send("User added successfully");
    } catch (err) {
        res.status(500).send("Error adding user");
    }
});

// Create new account
app.post("/signup", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if username already exists
        const existing = await db.collection("users").findOne({ username });
        if (existing) {
            return res.status(400).send("Username already exists!");
        }

        await db.collection("users").insertOne({ email, username, password });
        res.send("Account created successfully");
    } catch (err) {
        res.status(500).send("Error creating account");
    }
});

// Login existing user
app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await db.collection("users").findOne({ username, password });
        if (!user) {
            return res.status(401).send("Invalid username or password");
        }

        res.send("Login successful");
    } catch (err) {
        res.status(500).send("Error logging in");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
