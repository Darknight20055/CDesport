import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchUserProfile } from "../services/api";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      if (token) {
        try {
          const userData = await fetchUserProfile();
          setIsAdmin(userData.isAdmin);
        } catch (err) {
          console.error("Failed to fetch user profile:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();
  }, [location.pathname, isOpen]);

  const menuItems = [
    { label: "My Account", path: "/account", requiresAuth: true },
    { label: "Link Valorant Account", path: "/link-valorant", requiresAuth: true },
    { label: "Competitions", path: "/competitions", requiresAuth: false },
    { label: "Global Ranking", path: "/classement", requiresAuth: true },
    { label: "Support", path: "/support", requiresAuth: false },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-black shadow-lg z-50 pt-16 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ✕
        </button>

        {/* 🔥 Badge Admin Mode */}
        {isAuthenticated && isAdmin && (
          <div className="text-green-400 text-center text-sm font-bold mb-6">
            🛡️ Admin Mode
          </div>
        )}

        {/* Navigation */}
        <nav className="mt-4 flex flex-col space-y-6 px-6">
          {menuItems
            .filter(item => !item.requiresAuth || isAuthenticated)
            .map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={toggleSidebar}
                className="text-cyan-400 hover:text-red-500 text-lg font-semibold transition-colors"
              >
                {item.label}
              </Link>
            ))}

          {/* 🔥 Bouton Admin Panel visible uniquement pour Admin */}
          {isAuthenticated && isAdmin && (
            <Link
              to="/admin"
              onClick={toggleSidebar}
              className="text-green-400 hover:text-red-500 text-lg font-semibold transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Logout */}
        {isAuthenticated && (
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="mt-10 text-red-500 hover:text-cyan-400 text-lg font-semibold px-6 text-left transition-colors"
          >
            Log out
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;
