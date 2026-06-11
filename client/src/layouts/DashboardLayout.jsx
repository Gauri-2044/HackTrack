import { useState, useEffect } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import DashboardNavbar from "../components/Common/DashboardNavbar";
import "../styles/Dashboard.css"; // Import dashboard styles for top header

function DashboardLayout() {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState("TechBinder");
  const [memberName, setMemberName] = useState("Alex Chen");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    // Sync stored user information
    const storedTeam = localStorage.getItem("teamName");
    const storedUser = localStorage.getItem("userName");
    if (storedTeam) setTeamName(storedTeam);
    if (storedUser) setMemberName(storedUser);

    // Sync theme settings
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teamName");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="dashboard-layout-wrapper" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "var(--bg-primary)" }}>
      
      {/* GLOBAL HEADER NAV */}
      <nav className="dash-nav">
        <div className="dash-nav-left">
          <Link to="/dashboard" className="dash-logo" style={{ color: "var(--text-primary)" }}>
            <span style={{ color: "var(--accent-teal)" }}>Hack</span>Track
          </Link>
        </div>
        
        <div className="dash-nav-right">
          {/* THEME TOGGLE BUTTON */}
          <button 
            onClick={toggleTheme} 
            className="dash-logout-btn" 
            style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "8px", borderRadius: "50%" }}
            title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
          >
            {theme === "light" ? (
              // Moon Icon
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              // Sun Icon
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            )}
          </button>

          <div className="dash-user-profile">
            <div className="dash-avatar">
              {getInitials(memberName)}
            </div>
            <div className="dash-user-info" style={{ display: "flex", flexDirection: "column" }}>
              <span className="dash-user-name" style={{ color: "var(--text-primary)" }}>{memberName}</span>
              <span className="dash-user-role" style={{ color: "var(--text-muted)" }}>{teamName}</span>
            </div>
          </div>
          <button onClick={handleLogout} className="dash-logout-btn">
            Logout
          </button>
        </div>
      </nav>

      {/* DASHBOARD PAGE CONTENT */}
      <main className="dashboard-main-content" style={{ flex: 1, paddingBottom: "110px" }}>
        <Outlet />
      </main>

      {/* BOTTOM NAV BAR */}
      <DashboardNavbar />
    </div>
  );
}

export default DashboardLayout;
