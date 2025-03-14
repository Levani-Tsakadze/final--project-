import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome to Goal Oriented Academy(GOA) </h1>
      <div className="flex flex-col gap-4">
        <Link to="/login" className="bg-blue-500 text-white px-6 py-2 rounded">
          Login
        </Link>
        <Link to="/register" className="bg-green-500 text-white px-6 py-2 rounded">
          Register
        </Link>
        <Link to="/courses" className="bg-gray-500 text-white px-6 py-2 rounded">
          Go as Guest
        </Link>
      </div>
    </div>
  );
}

export default Home;
