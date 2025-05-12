import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { to: "/services", text: "सेवाएं" },
    { to: "/submit-form", text: "अपलोड करें" },
    { to: "/contact", text: "संपर्क करें" },
    { to: "/about", text: "हमारे बारे में" },
    ...(isAdmin
      ? [
          { to: "/dashboard", text: "Dashboard" },
          { onClick: handleLogout, text: "Logout" },
        ]
      : []),
  ];

  const getLinkStyles = ({ isActive }) => `
    block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200
    ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
    }
  `;

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
            >
              BK Studio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navLinks.map((link, index) =>
              link.onClick ? (
                <button
                  key={index}
                  onClick={link.onClick}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
                >
                  {link.text}
                </button>
              ) : (
                <NavLink key={link.to} to={link.to} className={getLinkStyles}>
                  {link.text}
                </NavLink>
              )
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {!isMenuOpen ? (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } md:hidden bg-white border-t border-gray-200`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navLinks.map((link, index) =>
            link.onClick ? (
              <button
                key={index}
                onClick={() => {
                  link.onClick();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors duration-200"
              >
                {link.text}
              </button>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={getLinkStyles}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.text}
              </NavLink>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
