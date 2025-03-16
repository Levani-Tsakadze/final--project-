import { useEffect, useState } from "react"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [admin, setAdmin] = useState(false)
  const [newCourse, setNewCourse] = useState({ title: "", description: "", image: "" })

  useEffect(() => {
    fetchCourses()
    checkAdminStatus()

    const handleBeforeUnload = () => {
      localStorage.removeItem("isAdmin") 
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`)
      if (!res.ok) throw new Error("Failed to fetch courses")

      const data = await res.json()
      setCourses(data)
    } catch (error) {
      console.error("Error fetching courses:", error)
    }
  }

  const checkAdminStatus = () => {
    const isAdmin = localStorage.getItem("isAdmin") === "true"
    if (!isAdmin) {
      localStorage.removeItem("email") // Ensure email is also removed
    }
    setAdmin(isAdmin)
  }

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value })
  }

  const handleAddCourse = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(`${API_BASE_URL}/api/courses`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newCourse, email: localStorage.getItem("email") })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to add course")
      }

      const data = await res.json()
      alert("Course added successfully!")
      setCourses([...courses, data.course])
      setNewCourse({ title: "", description: "", image: "" })
    } catch (error) {
      console.error("Error adding course:", error)
      alert(error.message)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Available Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="p-4 border rounded-lg shadow-md">
            <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-xl font-semibold mt-2">{course.title}</h2>
            <p className="text-gray-600">{course.description}</p>
          </div>
        ))}
      </div>

      {admin && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">Add New Course</h2>
          <form onSubmit={handleAddCourse} className="flex flex-col space-y-4">
            <input type="text" name="title" placeholder="Course Title" className="border p-2" value={newCourse.title} onChange={handleChange} required />
            <input type="text" name="description" placeholder="Description" className="border p-2" value={newCourse.description} onChange={handleChange} required />
            <input type="text" name="image" placeholder="Image URL" className="border p-2" value={newCourse.image} onChange={handleChange} required />
            <button className="bg-blue-500 text-white px-4 py-2">Add Course</button>
          </form>
        </div>
      )}
    </div>
  )
}

export default Courses
