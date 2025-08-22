// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, role, logout, loading } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) return null; // ⛔ don’t render until auth state is ready

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const adminLinks = (
    <>
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/admin/kb/create"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
        }
      >
        Create KB
      </NavLink>
      <NavLink
        to="/admin/kb"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
        }
      >
        Knowledge Base
      </NavLink>
    </>
  );

  const userLinks = (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/create-ticket"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
        }
      >
        Create Ticket
      </NavLink>
      <NavLink
        to="/knowledge-base"
        className={({ isActive }) =>
          isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
        }
      >
        Knowledge Base
      </NavLink>
    </>
  );

  return (
    <nav className="bg-indigo-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold">
            Smart Helpdesk
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {user ? (
              <>
                {role === "admin" ? adminLinks : userLinks}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    isActive ? "text-yellow-300 font-bold" : "hover:text-gray-200"
                  }
                >
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-indigo-700 px-4 pt-2 pb-3 space-y-2">
          {user ? (
            <>
              {role === "admin" ? (
                <>
                  <NavLink
                    to="/admin/dashboard"
                    className="block hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/admin/kb/create"
                    className="block hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Create KB
                  </NavLink>
                  <NavLink
                    to="/admin/kb"
                    className="block hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Knowledge Base
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink
                    to="/dashboard"
                    className="block hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                  <NavLink
                    to="/create-ticket"
                    className="block hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Create Ticket
                  </NavLink>
                  <NavLink
                    to="/knowledge-base"
                    className="block hover:text-gray-200"
                    onClick={() => setIsOpen(false)}
                  >
                    Knowledge Base
                  </NavLink>
                </>
              )}

              <button
                onClick={handleLogout}
                className="block bg-red-500 hover:bg-red-600 w-full px-3 py-1 rounded text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="block hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="block hover:text-gray-200"
                onClick={() => setIsOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
