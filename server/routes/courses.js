import express from "express"
import fs from "fs"
import path from "path"

const router = express.Router()
const dataFilePath = path.join(process.cwd(), "data.json")

// Function to read users from data.json
const readData = () => {
  if (!fs.existsSync(dataFilePath)) return { users: [] }
  const file = fs.readFileSync(dataFilePath)
  return JSON.parse(file)
}

// Middleware to verify if the user is an admin
const verifyAdmin = (req, res, next) => {
  const { email } = req.body
  const data = readData()

  const user = data.users.find((user) => user.email === email)
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Access denied - Admins only" })
  }
  next()
}

// List of available courses
let courses = [
  {
    id: 1,
    title: "Goa Programming",
    description: "შეისწავლე პროგრამირება მაღალი ხარისხით Goa-ში",
    image: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/408864179_342479481868687_2724919989645877908_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=rSeppXfekq4Q7kNvgGz7t4L&_nc_oc=AdjruDpM0OuGIKsZKzdq4sK8PEX4DpDDxaahKN-jPl-UYYOTzTDm2An0gRs-4ukUtqI&_nc_zt=23&_nc_ht=scontent.ftbs6-2.fna&_nc_gid=KmBqpLA3idSt2Qt16XQzaw&oh=00_AYHdeaIbR4RJGauvfutUzBXNgz0dD42kSKdOa26qHmymaQ&oe=67DC4DD3"
  },
  {
    id: 2,
    title: "Algorithms and Data Structures",
    description: "შეისწავლე ალგორითმები და ხელოვნურ ინტელექტი",
    image: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/438119840_424537040329597_6681389974086246164_n.jpg?stp=dst-jpg_p526x395_tt6&_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_ohc=cF_6wiJT_6IQ7kNvgHN2bDZ&_nc_oc=Adg6e4dE0cuPkJvLg4MWrlbW-YS7W8Rs4W3K4QYfC_sZz02u3IvC5siFI9Z8G5Bn3Ko&_nc_zt=23&_nc_ht=scontent.ftbs6-2.fna&_nc_gid=c_OWyFnbXYR9oHShxfOX6g&oh=00_AYFMbTwCHqSjYzoeeQPJNxBwjZkOvNEwyTPb_IKO5hyB7Q&oe=67DC3089"
  },
  {
    id: 3,
    title: "G.O.A MMA Academy",
    description: "ისწავლე საბრძოლო ხელოვნების საფუძვლები GOA MMA Academy-ში და განივითარე უნარები პროფესიონალ ტრენერებთან.",
    image: "https://scontent.ftbs6-2.fna.fbcdn.net/v/t39.30808-6/473801313_8921769074585951_2428163049335763725_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=b07MuqFiUmsQ7kNvgGI7qDJ&_nc_oc=Adice8_K1BJ8b4rsprquc1-VnNLjZjiFEM73tRs-KavkMvMh-F0SMaWc-Wu393XKj8A&_nc_zt=23&_nc_ht=scontent.ftbs6-2.fna&_nc_gid=DtwxU5hd0Yib3xAof2omuQ&oh=00_AYGDChGojW6ALSU1mDb1gTA69uDyWL0hexE9C7l0EUIdPw&oe=67DC5B86"
  }
];

// Route to get all courses
router.get("/", (req, res) => {
  res.json(courses)
})

// Route to add a new course (Admin only)
router.post("/", verifyAdmin, (req, res) => {
  const { title, description, image } = req.body

  // Check if all required fields are provided
  if (!title || !description || !image) {
    return res.status(400).json({ message: "All fields are required" })
  }

  // Create a new course object
  const newCourse = {
    id: courses.length > 0 ? courses[courses.length - 1].id + 1 : 1,
    title,
    description,
    image
  }

  // Add the course to the list
  courses.push(newCourse)
  res.status(201).json({ message: "Course added successfully", course: newCourse })
})

export default router
