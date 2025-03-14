import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";  // Correct import

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Ensure it uses the correct API URL

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isGuest, setIsGuest] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    fetchCourses();
    checkLoginStatus(); // Check login status when the page loads
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/courses`); // ✅ FIX: Use API_BASE_URL
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // If no token, user is a guest
      setIsGuest(true);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setAdmin(decoded.isAdmin); // Set admin status
    } catch (error) {
      console.error("Invalid token:", error);
      setIsGuest(true); // If token is invalid, fallback to guest
    }
  };

  const handleChange = (e) => {
    setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in as an admin to add courses");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/courses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(newCourse),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Course added successfully!");
      setCourses([...courses, data.course]);
      setNewCourse({ title: "", description: "", image: "" });
    } catch (error) {
      console.error("Error adding course:", error);
      alert(error.message);
    }
  };

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
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              className="border p-2"
              value={newCourse.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="border p-2"
              value={newCourse.description}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="image"
              placeholder="Image URL"
              className="border p-2"
              value={newCourse.image}
              onChange={handleChange}
              required
            />
            <button className="bg-blue-500 text-white px-4 py-2">Add Course</button>
          </form>
        </div>
      )}

    </div>
  );
};

export default Courses;
