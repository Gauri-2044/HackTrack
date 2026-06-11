import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getDashboardData } from "../services/dashboard";
import { addTeamMember, updateTeamProfile } from "../services/team";

function TeamProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [team, setTeam] = useState({ teamName: "TechBinder", tagline: "" });
  const [members, setMembers] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [isEditingTagline, setIsEditingTagline] = useState(false);
  const [editedTagline, setEditedTagline] = useState("");

  // Add member form state
  const [newMember, setNewMember] = useState({
    memberName: "",
    email: "",
    password: "",
    role: "Member",
    skills: ""
  });

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      const response = await getDashboardData(token);
      if (response && response.success) {
        const { team: teamData, members: membersData, hackathons: hacksData } = response.data;
        if (teamData) {
          setTeam(teamData);
          setEditedTagline(teamData.tagline || "");
        }
        if (membersData) setMembers(membersData);
        if (hacksData) setHackathons(hacksData);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const skillsArray = newMember.skills
      ? newMember.skills.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const payload = {
      ...newMember,
      skills: skillsArray
    };

    const added = await addTeamMember(token, payload);
    if (added) {
      setShowAddModal(false);
      setNewMember({
        memberName: "",
        email: "",
        password: "",
        role: "Member",
        skills: ""
      });
      loadData(); // Reload all data
    }
  };

  const handleSaveTagline = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const updated = await updateTeamProfile(token, { tagline: editedTagline });
    if (updated) {
      setTeam(prev => ({ ...prev, tagline: updated.tagline }));
      setIsEditingTagline(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const query = searchQuery.toLowerCase();
    const nameMatch = member.userName?.toLowerCase().includes(query);
    const roleMatch = member.role?.toLowerCase().includes(query);
    const skillMatch = member.skills?.some(s => s.toLowerCase().includes(query));
    return nameMatch || roleMatch || skillMatch;
  });

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Stats calculations
  const totalPlayed = hackathons.length;
  const runningHacks = hackathons.filter(h => h.status === "active" || h.status === "Live").length;
  const succeededHacks = hackathons.filter(h => h.status === "completed" || h.status === "succeed" || h.status === "win").length;

  return (
    <div className="dash-content" style={{ animation: "fadeIn 0.4s ease" }}>
      
      {/* TEAM PROFILE HERO HERO */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px" }}>Loading team details...</p>
      ) : (
        <>
          <div 
            style={{ 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--border-color)", 
              borderRadius: "20px", 
              padding: "32px", 
              marginBottom: "32px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              flexWrap: "wrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
            }}
          >
            {/* Team Logo (Initials box if no image) */}
            <div 
              style={{ 
                width: "90px", 
                height: "90px", 
                borderRadius: "18px", 
                background: "var(--bg-tertiary)", 
                border: "1px solid var(--border-color)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.2rem",
                fontWeight: "900",
                color: "var(--accent-teal)",
                boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)"
              }}
            >
              {team.teamName ? team.teamName.slice(0, 2).toUpperCase() : "TM"}
            </div>

            <div style={{ flex: 1, minWidth: "240px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.5px" }}>
                  {team.teamName}
                </h1>
                <button 
                  onClick={() => setShowAddModal(true)} 
                  className="dash-logout-btn"
                  style={{ 
                    background: "var(--accent-teal)", 
                    color: "var(--bg-primary)", 
                    border: "none", 
                    fontWeight: "700", 
                    padding: "8px 16px", 
                    borderRadius: "8px", 
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  + Add Member
                </button>
              </div>

              {/* Tagline Edit Row */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", width: "100%" }}>
                {isEditingTagline ? (
                  <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "500px" }}>
                    <input 
                      type="text" 
                      value={editedTagline} 
                      onChange={(e) => setEditedTagline(e.target.value)}
                      placeholder="Enter a catchy team tagline..."
                      style={{
                        flex: 1,
                        padding: "6px 12px",
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        outline: "none"
                      }}
                    />
                    <button 
                      onClick={handleSaveTagline}
                      style={{ background: "none", border: "none", color: "var(--accent-teal)", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => {
                        setEditedTagline(team.tagline || "");
                        setIsEditingTagline(false);
                      }}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", fontWeight: "600", cursor: "pointer", fontSize: "0.85rem" }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", margin: 0, fontStyle: team.tagline ? "normal" : "italic" }}>
                      {team.tagline || "No tagline set for this team yet."}
                    </p>
                    <button 
                      onClick={() => setIsEditingTagline(true)}
                      style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.82rem", padding: 0 }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* HACKATHON STATS ROW */}
          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "20px", 
              marginBottom: "40px" 
            }}
          >
            {/* Stat 1: Played */}
            <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <span style={{ display: "block", fontSize: "2.2rem", fontWeight: "900", color: "var(--accent-blue)", lineHeight: 1.2 }}>
                {totalPlayed}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Total Played
              </span>
            </div>

            {/* Stat 2: Running */}
            <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <span style={{ display: "block", fontSize: "2.2rem", fontWeight: "900", color: "var(--accent-teal)", lineHeight: 1.2 }}>
                {runningHacks}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Running
              </span>
            </div>

            {/* Stat 3: Completed / Win */}
            <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "24px", textAlign: "center" }}>
              <span style={{ display: "block", fontSize: "2.2rem", fontWeight: "900", color: "var(--accent-purple)", lineHeight: 1.2 }}>
                {succeededHacks}
              </span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Succeed / Win
              </span>
            </div>
          </div>

          {/* TEAM ROSTER HEADER */}
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-primary)" }}>
              Team Roster ({members.length})
            </h2>
          </div>

          {/* SEARCH BAR */}
          <div style={{ marginBottom: "32px" }}>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                placeholder="Search team members by name, role, or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 20px 14px 48px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "14px",
                  color: "var(--text-primary)",
                  fontSize: "0.95rem",
                  outline: "none"
                }}
              />
              <svg 
                width="20" 
                height="20" 
                fill="none" 
                stroke="var(--text-muted)" 
                strokeWidth="2.2" 
                viewBox="0 0 24 24"
                style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4.35-4.35" />
              </svg>
            </div>
          </div>

          {/* MEMBERS ROSTER GRID */}
          {filteredMembers.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
              <p style={{ color: "var(--text-secondary)" }}>No team members matching your query.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
              {filteredMembers.map((member) => (
                <Link 
                  to={`/members/${member.id}`}
                  key={member.id}
                  className="dash-stat-card"
                  style={{ 
                    background: "var(--bg-secondary)", 
                    border: "1px solid var(--border-color)", 
                    borderRadius: "16px", 
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    cursor: "pointer",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.25s ease, border-color 0.25s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.borderColor = "var(--border-glow)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.borderColor = "var(--border-color)";
                  }}
                >
                  {/* Role Badge */}
                  <span 
                    style={{ 
                      position: "absolute", 
                      top: "16px", 
                      right: "16px",
                      fontSize: "0.75rem",
                      fontWeight: "700",
                      padding: "4px 10px",
                      borderRadius: "99px",
                      background: member.role === "Team Lead" ? "rgba(236, 72, 153, 0.1)" : "rgba(59, 130, 246, 0.1)",
                      color: member.role === "Team Lead" ? "var(--accent-pink)" : "var(--accent-blue)"
                    }}
                  >
                    {member.role || "Member"}
                  </span>

                  {/* Avatar */}
                  <div 
                    style={{ 
                      width: "70px", 
                      height: "70px", 
                      borderRadius: "50%", 
                      background: "var(--accent-teal)", 
                      color: "var(--bg-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "800",
                      fontSize: "1.5rem",
                      marginBottom: "16px",
                      marginTop: "12px"
                    }}
                  >
                    {getInitials(member.userName)}
                  </div>

                  {/* Member Name */}
                  <h3 style={{ color: "var(--text-primary)", fontSize: "1.15rem", fontWeight: "700", marginBottom: "4px" }}>
                    {member.userName}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "16px" }}>
                    {member.email}
                  </p>

                  <div style={{ width: "100%", height: "1px", background: "var(--border-color)", marginBottom: "16px" }}></div>

                  {/* Skills tags */}
                  <div style={{ width: "100%" }}>
                    {member.skills && member.skills.length > 0 ? (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
                        {member.skills.slice(0, 3).map((skill, i) => (
                          <span 
                            key={i} 
                            style={{ 
                              fontSize: "0.72rem", 
                              background: "var(--bg-tertiary)", 
                              color: "var(--text-secondary)", 
                              padding: "3px 8px", 
                              borderRadius: "6px",
                              border: "1px solid var(--border-color)",
                              fontWeight: "500"
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                        {member.skills.length > 3 && (
                          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", padding: "3px", fontWeight: "600" }}>
                            +{member.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>
                        No skills listed yet
                      </span>
                    )}
                  </div>

                </Link>
              ))}
            </div>
          )}
        </>
      )}

      {/* ADD MEMBER MODAL */}
      {showAddModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1100,
          padding: "16px"
        }}>
          <div style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "460px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-primary)" }}>Add Team Member</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddMember} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Full Name
                </label>
                <input 
                  type="text" 
                  name="memberName"
                  required
                  placeholder="e.g. John Doe"
                  value={newMember.memberName}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="e.g. john@team.com"
                  value={newMember.email}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Temporary Password
                </label>
                <input 
                  type="password" 
                  name="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newMember.password}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Role
                </label>
                <select 
                  name="role"
                  value={newMember.role}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                >
                  <option value="Member">Developer / Member</option>
                  <option value="Designer">UI/UX Designer</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Team Lead">Team Lead</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Skills (comma separated)
                </label>
                <input 
                  type="text" 
                  name="skills"
                  placeholder="e.g. React, Node.js, Python, CSS"
                  value={newMember.skills}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    background: "transparent",
                    border: "1px solid var(--border-color)",
                    borderRadius: "10px",
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
                    padding: "12px",
                    background: "var(--accent-teal)",
                    border: "none",
                    borderRadius: "10px",
                    color: "var(--bg-primary)",
                    fontWeight: "700",
                    cursor: "pointer"
                  }}
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default TeamProfile;
