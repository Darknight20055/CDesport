import React from "react";
import { Link } from "react-router-dom";

const Header = ({ toggleSidebar, isAuthenticated }) => {
  return (
    <header className="fixed top-0 left-0 w-full h-20 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shadow-lg z-50 flex justify-between items-center px-6 py-4 backdrop-blur-sm">
      <Link to="/">
        <img
          src="/avatars/logo CDesport.png"
          alt="CDesport Logo"
          className="h-14 w-auto"
        />
      </Link>

      <div className="flex items-center space-x-6">
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className="text-cyan-400 hover:text-red-500 font-semibold transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-red-500 hover:text-cyan-400 font-semibold transition"
            >
              Sign Up
            </Link>
          </>
        )}
        <button
          onClick={toggleSidebar}
          className="text-white text-3xl hover:text-cyan-300 transition"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Header;
