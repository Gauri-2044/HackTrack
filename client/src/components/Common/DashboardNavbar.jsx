import { Link, useLocation } from "react-router-dom";
import "../../styles/DashboardNavbar.css";

function DashboardNavbar() {
  const location = useLocation();
  const path = location.pathname;

  // Determine active item based on route path
  const getActiveTab = () => {
    if (path.startsWith("/dashboard")) return "home";
    if (path.startsWith("/team")) return "search";
    if (path.startsWith("/hackathons") || path.startsWith("/hackathon")) return "explore";
    if (path.startsWith("/notification")) return "message";
    if (path.startsWith("/members")) return "profile";
    return "home";
  };

  const activeTab = getActiveTab();

  return (
    <div className="dash-navbar-container">
      <nav className="curved-navbar">
        
        {/* TAB 1: HOME (Dashboard) */}
        <Link 
          to="/dashboard" 
          className={`nav-tab ${activeTab === "home" ? "active" : ""}`}
        >
          <div className="nav-icon-wrap">
            {/* Custom rounded house smile icon */}
            <svg className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.53 0 1.04.22 1.41.6l6.98 7.18c.37.38.61.88.61 1.42V19c0 1.66-1.34 3-3 3H6c-1.66 0-3-1.34-3-3v-6.8c0-.54.24-1.04.61-1.42l6.98-7.18C10.96 3.22 11.47 3 12 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 14.5c1.2 1.2 3.8 1.2 5 0" />
            </svg>
          </div>
          <span className="nav-tab-label">Home</span>
        </Link>

        {/* TAB 2: SEARCH (Team Profile / Search) */}
        <Link 
          to="/team" 
          className={`nav-tab ${activeTab === "search" ? "active" : ""}`}
        >
          <div className="nav-icon-wrap">
            {/* Custom magnifier icon */}
            <svg className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeLinecap="round" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 20l-4.35-4.35" />
            </svg>
          </div>
          <span className="nav-tab-label">Search</span>
        </Link>

        {/* TAB 3: EXPLORE (Hackathons list) */}
        <Link 
          to="/hackathons" 
          className={`nav-tab ${activeTab === "explore" ? "active" : ""}`}
        >
          <div className="nav-icon-wrap">
            {/* Custom compass icon */}
            <svg className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9.5" strokeLinecap="round" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-2.12 6.36-4.24 2.12 2.12-6.36 4.24-2.12z" />
            </svg>
          </div>
          <span className="nav-tab-label">Explore</span>
        </Link>

        {/* TAB 4: MESSAGE (Notifications) */}
        <Link 
          to="/notification" 
          className={`nav-tab ${activeTab === "message" ? "active" : ""}`}
        >
          <div className="nav-icon-wrap">
            {/* Custom paper plane icon */}
            <svg className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </div>
          <span className="nav-tab-label">Message</span>
        </Link>

        {/* TAB 5: PROFILE (Member Profile) */}
        <Link 
          to="/members/current" 
          className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
        >
          <div className="nav-icon-wrap">
            {/* Custom user outline icon */}
            <svg className="nav-svg-icon" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="12" cy="7.5" r="4" strokeLinecap="round" strokeLinejoin="round" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 20c0-3.58 3.36-6.5 7.5-6.5s7.5 2.92 7.5 6.5" />
            </svg>
          </div>
          <span className="nav-tab-label">Profile</span>
        </Link>

      </nav>
    </div>
  );
}

export default DashboardNavbar;
