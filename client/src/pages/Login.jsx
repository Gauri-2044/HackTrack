import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { login } from "../services/auth";

const Login = function() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    teamName: "",
    email: "",
    password: "",
    teamCode: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting login form: ", formData);
    
    const response = await login(formData);
    if (response && response.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="auth-container">
      
      {/* LEFT INFO PANEL */}
      <div className="auth-info-side">
        <div className="auth-info-header">
          <h2>
            Your hackathon<br />
            <span>command center</span>
          </h2>
          
          <div className="auth-features-list">
            
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="auth-feature-text">Collaborate with your team in real-time</div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div className="auth-feature-text">Track every task from idea to submission</div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="auth-feature-text">Never miss a stage deadline again</div>
            </div>

          </div>
        </div>
        
        <div>
          <div className="auth-progress-card">
            <div className="auth-card-title-row">
              <span className="auth-card-title">DevSprint 2025</span>
              <span className="auth-status-badge">Live</span>
            </div>
            
            <div className="auth-progress-list">
              <div className="auth-progress-item">
                <span className="auth-progress-label">Design</span>
                <div className="auth-progress-bar-bg">
                  <div className="auth-progress-bar-fill blue" style={{ width: "68%" }}></div>
                </div>
                <span className="auth-progress-percent">68%</span>
              </div>
              
              <div className="auth-progress-item">
                <span className="auth-progress-label">Backend</span>
                <div className="auth-progress-bar-bg">
                  <div className="auth-progress-bar-fill teal" style={{ width: "45%" }}></div>
                </div>
                <span className="auth-progress-percent">45%</span>
              </div>
              
              <div className="auth-progress-item">
                <span className="auth-progress-label">Pitch</span>
                <div className="auth-progress-bar-bg">
                  <div className="auth-progress-bar-fill purple" style={{ width: "90%" }}></div>
                </div>
                <span className="auth-progress-percent">90%</span>
              </div>
            </div>
          </div>
          
          <p className="auth-quote">"The team that tracks together, ships together."</p>
        </div>
      </div>

      {/* RIGHT FORM PANEL */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/" className="auth-back-link">
            &larr; Back to home
          </Link>
          
          <div className="auth-form-header">
            <h1>Welcome back</h1>
            <p className="auth-form-subtitle">Sign in to your HackTrack workspace</p>
          </div>
          
          <form className="auth-form" onSubmit={handleSubmit}>

            <div className="auth-form-group">
              <label htmlFor="teamName">Team Name </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  id="teamName"
                  name="teamName"
                  placeholder="eg. techbinders"
                  value={formData.teamName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="auth-form-group">
              <label htmlFor="password">Your Password</label>
              <div className="auth-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="teamCode">
                Team Code <span>(provided by your team lead)</span>
              </label>
              <div className="auth-input-wrapper">
                <input
                  type="text"
                  id="teamCode"
                  name="teamCode"
                  placeholder="e.g. HACK-2025-XK9"
                  value={formData.teamCode}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <button type="submit" className="auth-submit-btn">
              Sign In &rarr;
            </button>
          </form>
          
          <p className="auth-switch-prompt">
            Don't have a team? <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
