import express from "express"
import fs from "fs"
import path from "path"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"

dotenv.config()
const router = express.Router()
const dataFilePath = path.join(process.cwd(), "data.json")

// Helper function to read data from data.json
const readData = () => {
  if (!fs.existsSync(dataFilePath)) return { users: [] }
  const file = fs.readFileSync(dataFilePath)
  return JSON.parse(file)
}

// Helper function to write data to data.json
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2))
}

// **REGISTER API**
router.post("/register", async (req, res) => {
  const { email, password } = req.body

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  let data = readData()

  // Check if user already exists
  if (data.users.find((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" })
  }

  // Hash the password and save the user
  const hashedPassword = await bcrypt.hash(password, 10)
  data.users.push({ email, password: hashedPassword, isAdmin: email === "Kirola048@gmail.com" })

  writeData(data)
  res.status(201).json({ message: "User registered successfully" })
})

// **LOGIN API**
router.post("/login", async (req, res) => {
  const { email, password } = req.body
  let data = readData()

  // Find user by email
  const user = data.users.find((user) => user.email === email)
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" })
  }

  res.json({ message: "Login successful", email, isAdmin: user.isAdmin })
})

export default router
