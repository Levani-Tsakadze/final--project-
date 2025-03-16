import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import coursesRoutes from "./routes/courses.js"
import authRoutes from "./routes/auth.js"

dotenv.config()

const app = express()

app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(express.json())

app.use("/api/courses", coursesRoutes)
app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
  res.send("API is working!")
})

const PORT = 3000
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`))
