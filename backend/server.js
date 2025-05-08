require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); 
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const incomeRoutes = require("./routes/incomeRoutes")


const app = express();


// Enable Cross-Origin Resource Sharing (CORS) for the Express app.
// This allows the frontend (at CLIENT_URL or any origin if CLIENT_URL is not defined) to make requests to this backend.
// It explicitly allows GET, POST, PUT, and DELETE methods,
// and ensures that requests with "Content-Type" and "Authorization" headers are accepted.
app.use(
    cors({
        origin : process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.use(express.json());

connectDB();

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/income", incomeRoutes)

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))