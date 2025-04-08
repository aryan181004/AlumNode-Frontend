import { Link, useNavigate } from "react-router-dom";
import { UserCircle, LogOut, Users, Home } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* // In the Navbar component, change the home link: */}
        <Link to="/dashboard" className="text-xl font-bold text-blue-600">
          AlumNode
        </Link>
        {isLoggedIn ? (
          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            {/* <Link
              to="/connections"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              <Users size={18} />
              <span>Connections</span>
            </Link> */}
            <Link
              to="/profile"
              className="flex items-center gap-1 text-gray-600 hover:text-blue-600"
            >
              <UserCircle size={18} />
              <span>Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white hover:bg-red-50 rounded-md"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
