import express from "express";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const dataFilePath = path.join(process.cwd(), "data.json");

// Helper function to read data.json
const readData = () => {
  if (!fs.existsSync(dataFilePath)) return { users: [] }; // Ensure file exists
  const file = fs.readFileSync(dataFilePath);
  return JSON.parse(file);
};

// Helper function to write data.json
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// **REGISTER API**
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  let data = readData();
  if (data.users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  data.users.push({ email, password: hashedPassword });

  writeData(data);
  res.status(201).json({ message: "User registered successfully" });
});

// **LOGIN API**
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let data = readData();

  const user = data.users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Check if user is an admin
  const isAdmin = email === "Kirola048@gmail.com"; // Admin check

  // Generate JWT token with isAdmin flag
  const token = jwt.sign({ email, isAdmin }, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Login successful", token, isAdmin });
});

export default router;
