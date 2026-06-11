import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHackathons, createHackathon, deleteHackathon } from "../services/hackathon";

function HackathonList() {
  const navigate = useNavigate();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newHack, setNewHack] = useState({
    name: "",
    platform: "Devpost",
    stages: [
      { name: "Ideation", deadline: "" },
      { name: "Design", deadline: "" },
      { name: "Development", deadline: "" },
      { name: "Submission", deadline: "" }
    ]
  });

  const handleAddStageRow = () => {
    setNewHack(prev => ({
      ...prev,
      stages: [...prev.stages, { name: "", deadline: "" }]
    }));
  };

  const handleRemoveStageRow = (index) => {
    setNewHack(prev => ({
      ...prev,
      stages: prev.stages.filter((_, i) => i !== index)
    }));
  };

  const handleStageChange = (index, field, value) => {
    setNewHack(prev => {
      const updatedStages = [...prev.stages];
      updatedStages[index] = { ...updatedStages[index], [field]: value };
      return { ...prev, stages: updatedStages };
    });
  };

  const loadHackathons = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      const data = await getHackathons(token, { status: statusFilter });
      if (data) setHackathons(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHackathons();
  }, [statusFilter]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewHack(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateHackathon = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const payload = {
      name: newHack.name,
      platform: newHack.platform,
      stages: newHack.stages
        .filter(s => s.name.trim() !== "")
        .map(s => ({
          name: s.name.trim(),
          deadline: s.deadline ? new Date(s.deadline).toLocaleDateString() : "Not Declared"
        }))
    };

    const created = await createHackathon(token, payload);
    if (created) {
      setShowAddModal(false);
      setNewHack({
        name: "",
        platform: "Devpost",
        stages: [
          { name: "Ideation", deadline: "" },
          { name: "Design", deadline: "" },
          { name: "Development", deadline: "" },
          { name: "Submission", deadline: "" }
        ]
      });
      loadHackathons();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hackathon? All associated tasks will be removed.")) return;
    const token = localStorage.getItem("token");
    if (token) {
      const deleted = await deleteHackathon(token, id);
      if (deleted) {
        loadHackathons();
      }
    }
  };

  const filteredHacks = hackathons.filter(hack => 
    hack.hackathonName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hack.platform?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dash-content" style={{ animation: "fadeIn 0.4s ease" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            Hackathon <span style={{ color: "var(--accent-teal)" }}>Arena</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Track milestones, review completion metrics, and register your team for events.
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)} 
          className="dash-logout-btn"
          style={{ 
            background: "var(--accent-gradient)", 
            color: "var(--bg-primary)", 
            border: "none", 
            fontWeight: "700", 
            padding: "12px 24px", 
            borderRadius: "12px", 
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(79, 209, 197, 0.25)",
            transition: "transform 0.2s ease"
          }}
          onMouseEnter={(e) => e.target.style.transform = "scale(1.03)"}
          onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
        >
          + Register Hackathon
        </button>
      </div>

      {/* SEARCH AND FILTERS */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "32px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
          <input 
            type="text" 
            placeholder="Search by hackathon name or platform..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 42px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "12px",
              color: "var(--text-primary)",
              outline: "none",
              fontFamily: "var(--sans)"
            }}
          />
          <svg 
            width="18" 
            height="18" 
            fill="none" 
            stroke="var(--text-muted)" 
            strokeWidth="2.2" 
            viewBox="0 0 24 24"
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4.35-4.35" />
          </svg>
        </div>

        {/* Tab Filters */}
        <div style={{ display: "flex", background: "var(--bg-secondary)", padding: "4px", borderRadius: "10px", border: "1px solid var(--border-color)" }}>
          <button 
            onClick={() => setStatusFilter("active")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              background: statusFilter === "active" ? "var(--bg-tertiary)" : "transparent",
              color: statusFilter === "active" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s ease"
            }}
          >
            Active
          </button>
          <button 
            onClick={() => setStatusFilter("completed")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              background: statusFilter === "completed" ? "var(--bg-tertiary)" : "transparent",
              color: statusFilter === "completed" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s ease"
            }}
          >
            Completed
          </button>
          <button 
            onClick={() => setStatusFilter("dropped")}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.85rem",
              background: statusFilter === "dropped" ? "var(--bg-tertiary)" : "transparent",
              color: statusFilter === "dropped" ? "var(--text-primary)" : "var(--text-muted)",
              transition: "all 0.2s ease"
            }}
          >
            Dropped
          </button>
        </div>
      </div>

      {/* CARDS GRID */}
      {loading ? (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px" }}>Loading hackathons...</p>
      ) : filteredHacks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>No {statusFilter} hackathons found.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {filteredHacks.map((hack) => {
            const totalTasks = hack.stats?.totalTasks || 0;
            const completedTasks = hack.stats?.completedTasks || 0;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            return (
              <div 
                key={hack.id}
                onClick={() => navigate(`/hackathon/${hack.id}`)}
                style={{ 
                  background: "var(--bg-secondary)", 
                  border: "1px solid var(--border-color)", 
                  borderRadius: "14px", 
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                  position: "relative",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.borderColor = "var(--border-glow)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                {/* Top Row: Platform and Actions */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--accent-teal)" }}>
                    {hack.platform || "Hackathon"}
                  </span>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(hack.id);
                    }}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", cursor: "pointer", fontWeight: "600", padding: 0 }}
                    title="Delete event"
                  >
                    Delete
                  </button>
                </div>

                {/* Title */}
                <h3 style={{ color: "var(--text-primary)", fontSize: "1.15rem", fontWeight: "800", margin: 0, lineHeight: "1.3" }}>
                  {hack.hackathonName}
                </h3>

                {/* Tag summary overview */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", color: "var(--text-secondary)", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", fontWeight: "600" }}>
                    {totalTasks} Tasks ({progress}% done)
                  </span>
                  <span style={{ fontSize: "0.72rem", background: "var(--bg-tertiary)", color: "var(--text-secondary)", padding: "4px 8px", borderRadius: "6px", border: "1px solid var(--border-color)", fontWeight: "600" }}>
                    {hack.stats?.completedStages || 0}/{hack.stats?.totalStages || 0} Stages
                  </span>
                </div>

                {/* Elegant bottom accent line progress indicator */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "rgba(255,255,255,0.03)", overflow: "hidden" }}>
                  <div style={{ width: `${progress}%`, height: "100%", background: "var(--accent-teal)", transition: "width 0.4s ease" }}></div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* ADD HACKATHON MODAL */}
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
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
            animation: "scaleUp 0.3s ease"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--text-primary)" }}>Register New Hackathon</h2>
              <button 
                onClick={() => setShowAddModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateHackathon} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Hackathon Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="e.g. ETHGlobal London 2026"
                  value={newHack.name}
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
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Platform / Host
                </label>
                <input 
                  type="text" 
                  name="platform"
                  placeholder="e.g. Devpost, MLH, Devfolio"
                  value={newHack.platform}
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
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", margin: 0 }}>
                    Workflow Stages
                  </label>
                  <button 
                    type="button" 
                    onClick={handleAddStageRow}
                    style={{ background: "none", border: "none", color: "var(--accent-teal)", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                  >
                    + Add Stage
                  </button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "180px", overflowY: "auto", paddingRight: "4px", marginBottom: "12px" }}>
                  {newHack.stages.map((stage, idx) => (
                    <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <input 
                        type="text" 
                        required
                        placeholder={`Stage #${idx + 1} Name`}
                        value={stage.name}
                        onChange={(e) => handleStageChange(idx, "name", e.target.value)}
                        style={{
                          flex: 1.5,
                          padding: "8px 12px",
                          background: "var(--bg-primary)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "6px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem"
                        }}
                      />
                      <input 
                        type="date" 
                        value={stage.deadline}
                        onChange={(e) => handleStageChange(idx, "deadline", e.target.value)}
                        style={{
                          flex: 1.2,
                          padding: "7px 10px",
                          background: "var(--bg-primary)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "6px",
                          color: "var(--text-secondary)",
                          outline: "none",
                          fontSize: "0.82rem"
                        }}
                      />
                      {newHack.stages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStageRow(idx)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--text-muted)",
                            fontSize: "1.15rem",
                            cursor: "pointer",
                            padding: "0 4px"
                          }}
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                    background: "var(--accent-gradient)",
                    border: "none",
                    borderRadius: "10px",
                    color: "var(--bg-primary)",
                    fontWeight: "700",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(79, 209, 197, 0.2)"
                  }}
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default HackathonList;
