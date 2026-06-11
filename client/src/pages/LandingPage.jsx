import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import "../styles/LandingPage.css";

const LandingPage = function() {
  return (
    <div className="landing-page">
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="container hero-grid">
          
          <div className="hero-content">
            
            <h1 className="hero-title">
              Track. <span className="color-blue">Collaborate.</span> <br />
              Win Hackathons <span className="color-teal">Together.</span>
            </h1>
            
            <p className="hero-desc">
              HackTrack is your team's command center during hackathons. Manage tasks, track stages, coordinate members, and hit every deadline &mdash; all in one elegant workspace.
            </p>
            
            <div className="hero-actions">
              <Link to="/register" className="btn-primary">
                Get Started Free &rarr;
              </Link>
              <a href="#demo" className="btn-secondary">
                View Demo &rsaquo;
              </a>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-val">500+</span>
                <span className="stat-lbl">Teams</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">12k+</span>
                <span className="stat-lbl">Tasks Tracked</span>
              </div>
              <div className="stat-item">
                <span className="stat-val">98%</span>
                <span className="stat-lbl">On-time Rate</span>
              </div>
            </div>
          </div>
          
          <div className="hero-image-side">
            <div className="hero-image-wrapper">
              <img src={heroImg} alt="HackTrack Dashboard Mockup" />
            </div>
          </div>
          
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section" id="features">
        <div className="container">
          
          <div className="section-header">
            <div className="section-tag teal">Features</div>
            <h2 className="section-title">Everything your team needs</h2>
            <p className="section-subtitle">
              From kickoff to submission, HackTrack keeps your team aligned, organized, and moving fast.
            </p>
          </div>
          
          <div className="features-grid">
            
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Team Workspaces</h3>
              <p className="feature-desc">
                Dedicated spaces for your hackathon team. Organize members, roles, and responsibilities seamlessly.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h3 className="feature-title">Task Tracking</h3>
              <p className="feature-desc">
                Kanban-style boards to assign, prioritize, and track every task from idea to submission.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="feature-title">Stage Timelines</h3>
              <p className="feature-desc">
                Visual timelines for Idea &rarr; Prototype &rarr; PPT &rarr; Final Submission with real-time status tracking.
              </p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="feature-title">Resource Management</h3>
              <p className="feature-desc">
                Central hub for GitHub repos, PPT links, demo videos, and submission URLs.
              </p>
            </div>

            {/* Card 5 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="feature-title">Progress Analytics</h3>
              <p className="feature-desc">
                Live dashboards showing completion rates, member contributions, and deadline health.
              </p>
            </div>

            {/* Card 6 */}
            <div className="feature-card">
              <div className="feature-icon-box">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="feature-title">Collaboration</h3>
              <p className="feature-desc">
                Activity feeds, task comments, and team notifications keep everyone in sync.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="workflow-section" id="workflow">
        <div className="container">
          
          <div className="section-header">
            <div className="section-tag">Workflow</div>
            <h2 className="section-title">From zero to submission</h2>
            <p className="section-subtitle">
              A streamlined six-step process designed to get your team ready and shipping on time.
            </p>
          </div>
          
          <div className="workflow-grid">
            
            {/* Step 1 */}
            <div className="workflow-card">
              <div className="workflow-num">01</div>
              <h3 className="workflow-title">Create Team</h3>
              <p className="workflow-desc">
                Set up your workspace and invite collaborators with a unique team code.
              </p>
            </div>

            {/* Step 2 */}
            <div className="workflow-card">
              <div className="workflow-num">02</div>
              <h3 className="workflow-title">Add Members</h3>
              <p className="workflow-desc">
                Members join with your team code and set their skills and roles.
              </p>
            </div>

            {/* Step 3 */}
            <div className="workflow-card">
              <div className="workflow-num">03</div>
              <h3 className="workflow-title">Create Hackathon</h3>
              <p className="workflow-desc">
                Add a hackathon with platform details, deadlines, and stages.
              </p>
            </div>

            {/* Step 4 */}
            <div className="workflow-card">
              <div className="workflow-num">04</div>
              <h3 className="workflow-title">Manage Tasks</h3>
              <p className="workflow-desc">
                Break down the work into tasks, assign them, and track progress.
              </p>
            </div>

            {/* Step 5 */}
            <div className="workflow-card">
              <div className="workflow-num">05</div>
              <h3 className="workflow-title">Track Stages</h3>
              <p className="workflow-desc">
                Move through Idea &rarr; Prototype &rarr; PPT &rarr; Final Submission stages.
              </p>
            </div>

            {/* Step 6 */}
            <div className="workflow-card">
              <div className="workflow-num">06</div>
              <h3 className="workflow-title">Submit Project</h3>
              <p className="workflow-desc">
                Hit your deadline with all resources linked and tasks completed.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-icon-box">
              <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            
            <h2 className="cta-title">Ready to track your next win?</h2>
            <p className="cta-desc">
              Join teams already crushing hackathons with HackTrack.
            </p>
            
            <Link to="/register" className="btn-primary">
              Create Free WorkSpace &rarr;
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
