import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

// Pages
import Home from "./pages/Home";
import Account from "./pages/Account";
import LinkValorant from "./pages/LinkValorant";
import Competitions from "./pages/Competitions";
import ClassementGlobal from "./pages/ClassementGlobal";
import Support from "./pages/Support";
import AuthForm from "./components/AuthForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword"; // ✅ utilisée pour 2 routes
import ResetSuccess from "./pages/ResetSuccess";
import AdminPanel from "./pages/AdminPanel";
import ConfirmCode from "./pages/ConfirmCode";

// Utils
import { fetchUserProfile } from "./services/api";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);

      if (!token) {
        setAuthChecked(true);
        return;
      }

      try {
        const user = await fetchUserProfile();
        setIsAdmin(user.isAdmin);
      } catch (err) {
        console.error("Auth check error:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  if (!authChecked) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">Loading...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-black text-white">
        <Header toggleSidebar={toggleSidebar} isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        <div className="p-6 mt-20">
          <Routes>
            {/* Pages principales */}
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/link-valorant" element={<LinkValorant />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/classement" element={<ClassementGlobal />} />
            <Route path="/support" element={<Support />} />

            {/* Auth pages */}
            <Route path="/login" element={<AuthForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/signup" element={<AuthForm setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/reset-password-code" element={<ResetPassword />} /> {/* ✅ même composant réutilisé */}
            <Route path="/reset-success" element={<ResetSuccess />} />

            {/* Email confirmation */}
            <Route path="/confirm-code" element={<ConfirmCode />} />

            {/* Admin */}
            <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
