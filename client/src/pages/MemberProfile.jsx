import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTeamMembers, updateMemberProfile } from "../services/team";

function MemberProfile() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable links state
  const [links, setLinks] = useState({
    githubURL: "",
    linkedinURL: "",
    portfolioURL: ""
  });

  const loadProfile = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const userEmail = localStorage.getItem("userEmail");
    
    if (token) {
      const allMembers = await getTeamMembers(token);
      if (allMembers) {
        // Find matching member
        let foundMember = null;
        if (id === "current") {
          foundMember = allMembers.find(m => m.email === userEmail);
        } else {
          foundMember = allMembers.find(m => m.id === Number(id));
        }

        if (foundMember) {
          setMember(foundMember);
          setLinks({
            githubURL: foundMember.githubURL || "",
            linkedinURL: foundMember.linkedinURL || "",
            portfolioURL: foundMember.portfolioURL || ""
          });
        }
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLinks(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !member) return;

    const updated = await updateMemberProfile(token, member.id, links);
    if (updated) {
      setMember(updated);
      setIsEditing(false);
      loadProfile(); // Reload latest
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="dash-content">
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px" }}>Loading profile details...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="dash-content">
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Member profile not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-content" style={{ animation: "fadeIn 0.4s ease" }}>
      
      {/* HEADER TITLE */}
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
          Member <span style={{ color: "var(--accent-teal)" }}>Profile</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
          Manage your contact credentials and view performance contributions.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.8fr", gap: "32px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: HERO AVATAR & CONTRIBUTIONS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Roster Card */}
          <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div 
              style={{ 
                width: "90px", 
                height: "90px", 
                borderRadius: "50%", 
                background: "var(--accent-gradient)", 
                color: "var(--bg-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "900",
                fontSize: "2rem",
                marginBottom: "20px",
                boxShadow: "0 6px 16px rgba(79, 209, 197, 0.25)"
              }}
            >
              {getInitials(member.userName)}
            </div>

            <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", fontWeight: "800", marginBottom: "6px" }}>
              {member.userName}
            </h2>
            <span style={{ fontSize: "0.85rem", fontWeight: "700", padding: "4px 12px", borderRadius: "99px", background: "rgba(79, 209, 197, 0.1)", color: "var(--accent-teal)", marginBottom: "20px" }}>
              {member.role || "Developer"}
            </span>

            <div style={{ width: "100%", height: "1px", background: "var(--border-color)", marginBottom: "20px" }}></div>

            <div style={{ width: "100%", textAlign: "left", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Email</span>
                <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>{member.email}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--text-muted)" }}>Joined</span>
                <span style={{ color: "var(--text-secondary)", fontWeight: "600" }}>{new Date(member.joinedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Contribution Stats */}
          <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", marginBottom: "20px" }}>
              Performance Stats
            </h3>
            
            <div style={{ display: "flex", justifyContent: "space-around", alignItems: "center", padding: "10px 0" }}>
              <div style={{ textAlign: "center" }}>
                <span style={{ display: "block", fontSize: "2rem", fontWeight: "800", color: "var(--accent-blue)" }}>
                  {member.score || 0}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Contribution Score</span>
              </div>
              <div style={{ width: "1px", height: "40px", background: "var(--border-color)" }}></div>
              <div style={{ textAlign: "center" }}>
                <span style={{ display: "block", fontSize: "2rem", fontWeight: "800", color: "var(--accent-teal)" }}>
                  {member.tasks?.filter(t => t.status === "completed").length || 0}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase" }}>Tasks Finished</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DETAILED INFO & SOCIAL EDIT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* Skills Tag Cloud */}
          <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", marginBottom: "16px" }}>
              Skills & Technologies
            </h3>
            
            {member.skills && member.skills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {member.skills.map((skill, index) => (
                  <span 
                    key={index}
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: "600",
                      background: "var(--bg-tertiary)",
                      color: "var(--text-primary)",
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" }}>
                No tech stack skills declared. Update skills in the team directory tab.
              </p>
            )}
          </div>

          {/* Social Links Form */}
          <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>
                Social & Work Profiles
              </h3>
              {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  style={{ background: "none", border: "none", color: "var(--accent-teal)", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}
                >
                  Edit Links
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>GitHub Profile URL</label>
                  <input 
                    type="url" 
                    name="githubURL"
                    placeholder="https://github.com/username"
                    value={links.githubURL}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      outline: "none",
                      fontFamily: "var(--sans)"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>LinkedIn Profile URL</label>
                  <input 
                    type="url" 
                    name="linkedinURL"
                    placeholder="https://linkedin.com/in/username"
                    value={links.linkedinURL}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      outline: "none",
                      fontFamily: "var(--sans)"
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Portfolio URL</label>
                  <input 
                    type="url" 
                    name="portfolioURL"
                    placeholder="https://myportfolio.com"
                    value={links.portfolioURL}
                    onChange={handleInputChange}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-primary)",
                      outline: "none",
                      fontFamily: "var(--sans)"
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    style={{
                      flex: 1,
                      padding: "10px",
                      background: "transparent",
                      border: "1px solid var(--border-color)",
                      borderRadius: "8px",
                      color: "var(--text-secondary)",
                      fontWeight: "600",
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{
                      flex: 2,
                      padding: "10px",
                      background: "var(--accent-gradient)",
                      border: "none",
                      borderRadius: "8px",
                      color: "var(--bg-primary)",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    Save Links
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                
                {/* GitHub */}
                <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "12px" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "8px", borderRadius: "8px" }}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>GitHub</span>
                    {member.githubURL ? (
                      <a href={member.githubURL} target="_blank" rel="noreferrer" style={{ fontSize: "0.9rem", color: "var(--accent-teal)", fontWeight: "600" }}>
                        {member.githubURL.replace("https://", "")}
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontStyle: "italic" }}>Not connected</span>
                    )}
                  </div>
                </div>

                {/* LinkedIn */}
                <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "12px" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "8px", borderRadius: "8px" }}>
                    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>LinkedIn</span>
                    {member.linkedinURL ? (
                      <a href={member.linkedinURL} target="_blank" rel="noreferrer" style={{ fontSize: "0.9rem", color: "var(--accent-teal)", fontWeight: "600" }}>
                        {member.linkedinURL.replace("https://", "")}
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontStyle: "italic" }}>Not connected</span>
                    )}
                  </div>
                </div>

                {/* Portfolio */}
                <div style={{ display: "flex", alignItems: "center", justifyItems: "center", gap: "12px" }}>
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)", padding: "8px", borderRadius: "8px" }}>
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", display: "block" }}>Portfolio Website</span>
                    {member.portfolioURL ? (
                      <a href={member.portfolioURL} target="_blank" rel="noreferrer" style={{ fontSize: "0.9rem", color: "var(--accent-teal)", fontWeight: "600" }}>
                        {member.portfolioURL.replace("https://", "")}
                      </a>
                    ) : (
                      <span style={{ fontSize: "0.88rem", color: "var(--text-muted)", fontStyle: "italic" }}>Not connected</span>
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

export default MemberProfile;
