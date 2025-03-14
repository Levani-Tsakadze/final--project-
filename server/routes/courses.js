import express from "express";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const dataFilePath = path.join(process.cwd(), "data.json");

// Helper function to read data.json
const readData = () => {
  const file = fs.readFileSync(dataFilePath);
  return JSON.parse(file);
};

// Hardcoded courses array
let courses = [
  { id: 1, title: "JavaScript Basics", description: "Learn the fundamentals of JS.", image: "https://via.placeholder.com/150" },
  { id: 2, title: "React for Beginners", description: "Understand React and build web apps.", image: "https://via.placeholder.com/150" },
  { id: 3, title: "Node.js Crash Course", description: "Learn backend development with Node.js.", image: "https://via.placeholder.com/150" }
];

// Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Get token from header
    if (!token) return res.status(401).json({ message: "Unauthorized - No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const data = readData();

    // Hardcoded admin check
    const adminEmails = ["Kirola048@gmail.com"];
    if (!adminEmails.includes(decoded.email)) {
      return res.status(403).json({ message: "Access denied - Admins only" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// GET all courses
router.get("/", (req, res) => {
  res.json(courses);
});

// POST a new course (Only Admins)
router.post("/", verifyAdmin, (req, res) => {
  const { title, description, image } = req.body;

  if (!title || !description || !image) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const newCourse = {
    id: courses.length + 1,
    title,
    description,
    image
  };

  courses.push(newCourse);
  res.status(201).json({ message: "Course added successfully!", course: newCourse });
});

export default router;
