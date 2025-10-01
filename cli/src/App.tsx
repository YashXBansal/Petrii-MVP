import { useState, useEffect } from "react";
import type { User } from "./types";
import LoginPage from "./components/LoginPage";
import PendingPage from "./components/PendingPage";
import AdminDashboard from "./components/AdminDashboard";
import ResearcherDashboard from "./components/ResearcherDashboard";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const loggedInUser = localStorage.getItem("user");
      if (loggedInUser) {
        setUser(JSON.parse(loggedInUser));
      }
    } catch (error) {
      localStorage.removeItem("user");
    }
    setLoading(false);
  }, []);

  const handleLogin = (loggedInUser: User) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (user.status !== "approved") {
    return (
      <PendingPage
        onLogout={handleLogout}
        email={user.email}
        status={user.status}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 text-2xl font-bold text-indigo-600">
              Petrii
            </div>
            <div className="flex items-center">
              <span className="mr-4 font-medium">
                Welcome, {user.name} ({user.role})
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="p-4 sm:p-8">
        {user.role === "admin" && <AdminDashboard />}
        {user.role === "researcher" && <ResearcherDashboard />}
      </main>
    </div>
  );
}
