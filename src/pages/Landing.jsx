import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-bold text-blue-600 mb-6">
        Welcome to AlumNode
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl">
        Connect with your department alumni, explore career opportunities, and
        stay updated with your network - all in one place.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </Link>
        <Link
          to="/signup"
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg text-lg hover:bg-blue-50 transition-colors"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Landing;
