import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {  
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message)

      localStorage.setItem("email", email)
      localStorage.setItem("isAdmin", data.isAdmin)
      alert("Login successful")
      navigate("/courses") 

    } catch (error) {
      console.error("Login failed:", error)
      setMessage(error.message)  
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col space-y-4">
        <input type="email" placeholder="Email" className="border p-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="border p-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="bg-green-500 text-white px-4 py-2">Login</button>
      </form>
      {message && <p className="text-red-500 mt-2">{message}</p>}

      <p className="mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-500 hover:underline">Register here</Link>
      </p>
    </div>
  )
}

export default Login
