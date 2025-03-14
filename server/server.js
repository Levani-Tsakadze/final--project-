import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import courseRoutes from "./routes/courses.js";

dotenv.config();
const app = express();

// ✅ Allow CORS for Frontend
const allowedOrigins = ["http://192.168.5.54:5173", "http://localhost:5173"]; // Change according to frontend port
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
