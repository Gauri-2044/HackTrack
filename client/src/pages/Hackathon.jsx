import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHackathonDetails, addHackathonSubmission, updateStageStatus } from "../services/hackathon";
import { getTeamMembers } from "../services/team";
import { addTask, updateTaskStatus } from "../services/task";

function Hackathon() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hackathon, setHackathon] = useState(null);
  const [members, setMembers] = useState([]);
  
  // Modal toggles & states
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  
  const [newTask, setNewTask] = useState({
    taskTitle: "",
    assignedToId: ""
  });

  // Resources form state
  const [submission, setSubmission] = useState({
    git: "",
    linkedin: "",
    ppt: "",
    video: ""
  });

  const loadData = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (token) {
      const [details, teamMembers] = await Promise.all([
        getHackathonDetails(token, id),
        getTeamMembers(token)
      ]);
      
      if (details) {
        setHackathon(details);
        // Prepopulate submission forms with existing resource values
        const res = details.resources?.[details.resources.length - 1] || {};
        setSubmission({
          git: res.githubLink || "",
          linkedin: res.submissionLink || "",
          ppt: res.pptLink || "",
          video: res.videoLink || ""
        });
      }
      if (teamMembers) setMembers(teamMembers);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !newTask.taskTitle) return;

    const payload = {
      taskTitle: newTask.taskTitle,
      assignedToId: newTask.assignedToId || null,
      hackathonId: id
    };

    const added = await addTask(token, payload);
    if (added) {
      setShowTaskModal(false);
      setNewTask({ taskTitle: "", assignedToId: "" });
      loadData(); // Reload details
    }
  };

  const handleSubmissionSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const saved = await addHackathonSubmission(token, id, submission);
    if (saved) {
      setShowSubmissionModal(false);
      loadData(); // Reload to sync resources
    }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const nextStatus = currentStatus === "completed" ? "todo" : "completed";
    const updated = await updateTaskStatus(token, taskId, nextStatus);
    if (updated) {
      loadData();
    }
  };

  const handleToggleStage = async (stageId, currentStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const nextStatus = currentStatus === "done" ? "live" : "done";
    const updated = await updateStageStatus(token, stageId, nextStatus);
    if (updated) {
      loadData();
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  // Get active resources from data
  const hasResources = hackathon?.resources && hackathon.resources.length > 0;
  const activeResource = hasResources ? hackathon.resources[hackathon.resources.length - 1] : null;

  const hasAnyLink = activeResource && (
    activeResource.githubLink || 
    activeResource.pptLink || 
    activeResource.videoLink || 
    activeResource.submissionLink
  );

  if (loading) {
    return (
      <div className="dash-content">
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px" }}>Loading hackathon workspace...</p>
      </div>
    );
  }

  if (!hackathon) {
    return (
      <div className="dash-content">
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>Hackathon workspace not found.</p>
          <button onClick={() => navigate("/hackathons")} style={{ marginTop: "16px", background: "var(--accent-teal)", border: "none", padding: "10px 20px", borderRadius: "8px", color: "var(--bg-primary)", fontWeight: "700", cursor: "pointer" }}>
            Back to Arena
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dash-content" style={{ animation: "fadeIn 0.4s ease" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--accent-teal)", background: "rgba(79, 209, 197, 0.1)", padding: "4px 10px", borderRadius: "99px", textTransform: "uppercase" }}>
            {hackathon.platform || "Hackathon"}
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px", marginTop: "10px" }}>
            {hackathon.hackathonName}
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Status: <strong style={{ color: "var(--accent-teal)", textTransform: "capitalize" }}>{hackathon.status}</strong> &bull; Created: {new Date(hackathon.createdAt).toLocaleDateString()}
          </p>
        </div>
        
        <button 
          onClick={() => navigate("/hackathons")} 
          className="dash-logout-btn"
          style={{ fontWeight: "600", padding: "10px 18px", borderRadius: "10px", cursor: "pointer" }}
        >
          &larr; Arena
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px", alignItems: "start" }}>
        
        {/* LEFT COLUMN: TIMELINE STAGES */}
        <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: "800", color: "var(--text-primary)", marginBottom: "24px" }}>
            Workflow Timeline Stages
          </h2>

          {hackathon.stages && hackathon.stages.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0", position: "relative", paddingLeft: "8px" }}>
              {/* Central vertical track line */}
              <div style={{ position: "absolute", left: "20px", top: "10px", bottom: "10px", width: "2px", background: "var(--border-color)", zIndex: 1 }}></div>

              {hackathon.stages.map((stage, index) => {
                const isCompleted = stage.status === "completed" || stage.status === "done";
                
                return (
                  <div key={stage.id} style={{ display: "flex", gap: "20px", paddingBottom: "24px", position: "relative", zIndex: 2 }}>
                    
                    {/* Circle Node */}
                    <div style={{ 
                      width: "26px", 
                      height: "26px", 
                      borderRadius: "50%", 
                      background: isCompleted ? "var(--accent-teal)" : "var(--bg-secondary)", 
                      border: `2px solid ${isCompleted ? "var(--accent-teal)" : "var(--border-color)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: isCompleted ? "var(--bg-primary)" : "var(--text-muted)",
                      fontWeight: "700",
                      fontSize: "0.75rem",
                      flexShrink: 0,
                      boxShadow: isCompleted ? "0 0 10px rgba(79, 209, 197, 0.3)" : "none"
                    }}>
                      {isCompleted ? "✓" : index + 1}
                    </div>

                    {/* Stage Card info */}
                    <div style={{ flex: 1, padding: "14px 18px", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <h4 style={{ color: "var(--text-primary)", fontSize: "0.95rem", fontWeight: "700", margin: 0 }}>
                            {stage.stageName}
                          </h4>
                          <span style={{ 
                            fontSize: "0.72rem", 
                            fontWeight: "700", 
                            padding: "2px 8px", 
                            borderRadius: "99px",
                            background: isCompleted ? "rgba(79, 209, 197, 0.1)" : "rgba(255,255,255,0.03)",
                            color: isCompleted ? "var(--accent-teal)" : "var(--text-muted)",
                            textTransform: "capitalize"
                          }}>
                            {stage.status}
                          </span>
                        </div>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginTop: "4px", margin: 0 }}>
                          Deadline: {stage.deadline}
                        </p>
                      </div>

                      <button
                        onClick={() => handleToggleStage(stage.id, stage.status)}
                        style={{
                          background: isCompleted ? "transparent" : "var(--accent-teal)",
                          border: isCompleted ? "1px solid var(--border-color)" : "none",
                          color: isCompleted ? "var(--text-secondary)" : "var(--bg-primary)",
                          fontWeight: "700",
                          fontSize: "0.75rem",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "all 0.2s ease"
                        }}
                      >
                        {isCompleted ? "Mark Undo" : "Mark Done"}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic", margin: 0 }}>
              No workflow stages configured yet.
            </p>
          )}
        </div>

        {/* RIGHT COLUMN: SUBMISSION RESOURCES & LIVE TASKS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* RESOURCES DISPLAY PANEL */}
          <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)", margin: 0 }}>
                Hackathon Resources
              </h3>
              <button 
                onClick={() => setShowSubmissionModal(true)}
                style={{ background: "none", border: "none", color: "var(--accent-teal)", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}
              >
                {hasAnyLink ? "Edit Links" : "Link Resources"}
              </button>
            </div>

            {hasAnyLink ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                
                {/* GitHub */}
                {activeResource.githubLink && (
                  <a 
                    href={activeResource.githubLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      padding: "12px", 
                      background: "rgba(255, 255, 255, 0.02)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-teal)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
                    <div style={{ color: "var(--text-secondary)" }}>
                      <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block" }}>GitHub Repository</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{activeResource.githubLink}</span>
                    </div>
                  </a>
                )}

                {/* Slides PPT */}
                {activeResource.pptLink && (
                  <a 
                    href={activeResource.pptLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      padding: "12px", 
                      background: "rgba(255, 255, 255, 0.02)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-teal)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
                    <div style={{ color: "var(--accent-orange)" }}>
                      {/* Slides PPT Icon */}
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8M12 17v4M3 4h18M4 4v13a1 1 0 001 1h14a1 1 0 001-1V4H4z" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block" }}>Slide Deck PPT</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{activeResource.pptLink}</span>
                    </div>
                  </a>
                )}

                {/* Pitch Video */}
                {activeResource.videoLink && (
                  <a 
                    href={activeResource.videoLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      padding: "12px", 
                      background: "rgba(255, 255, 255, 0.02)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-teal)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
                    <div style={{ color: "var(--accent-pink)" }}>
                      {/* Play video icon */}
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block" }}>Pitch Video</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{activeResource.videoLink}</span>
                    </div>
                  </a>
                )}

                {/* Submission Platform */}
                {activeResource.submissionLink && (
                  <a 
                    href={activeResource.submissionLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "12px", 
                      padding: "12px", 
                      background: "rgba(255, 255, 255, 0.02)", 
                      border: "1px solid var(--border-color)", 
                      borderRadius: "8px",
                      textDecoration: "none",
                      color: "inherit",
                      transition: "border-color 0.2s ease"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent-teal)"}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border-color)"}
                  >
                    <div style={{ color: "var(--accent-blue)" }}>
                      {/* Link icon */}
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-primary)", display: "block" }}>Submission URL</span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{activeResource.submissionLink}</span>
                    </div>
                  </a>
                )}

              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", margin: 0, textAlign: "center", padding: "12px 0" }}>
                No submission links linked yet. Add links to display resources.
              </p>
            )}
          </div>

          {/* LIVE TASKS PANEL */}
          <div className="dash-stat-card" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)", borderRadius: "16px", padding: "28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 style={{ fontSize: "0.85rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>
                Live Tasks
              </h3>
              <button 
                onClick={() => setShowTaskModal(true)}
                style={{ background: "none", border: "none", color: "var(--accent-teal)", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}
              >
                + Add Task
              </button>
            </div>

            {hackathon.tasks && hackathon.tasks.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {hackathon.tasks.map((task) => {
                  const isChecked = task.status === "completed";
                  return (
                    <div 
                      key={task.id}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "12px", 
                        padding: "10px", 
                        background: "rgba(255,255,255,0.02)", 
                        border: "1px solid var(--border-color)", 
                        borderRadius: "8px" 
                      }}
                    >
                      {/* Checkbox */}
                      <div 
                        onClick={() => handleToggleTask(task.id, task.status)}
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "4px",
                          border: `1.5px solid ${isChecked ? "transparent" : "var(--text-muted)"}`,
                          background: isChecked ? "var(--accent-teal)" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--bg-primary)",
                          fontSize: "0.68rem",
                          fontWeight: "700",
                          cursor: "pointer",
                          flexShrink: 0
                        }}
                      >
                        {isChecked && "✓"}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ 
                          fontSize: "0.82rem", 
                          fontWeight: "600", 
                          color: isChecked ? "var(--text-muted)" : "var(--text-primary)", 
                          textDecoration: isChecked ? "line-through" : "none",
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}>
                          {task.title}
                        </span>
                        
                        {/* Assignee and Priority */}
                        <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "2px", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                          <span style={{ textTransform: "capitalize", fontWeight: "700", color: task.priority === "high" ? "var(--accent-pink)" : task.priority === "medium" ? "var(--accent-orange)" : "var(--accent-blue)" }}>
                            {task.priority}
                          </span>
                          <span>&bull;</span>
                          <span>{task.assignedTo ? task.assignedTo.userName : "Unassigned"}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontStyle: "italic", margin: 0, textAlign: "center", padding: "12px 0" }}>
                No active tasks for this event.
              </p>
            )}
          </div>

        </div>

      </div>

      {/* SUBMISSION RESOURCES POPUP MODAL */}
      {showSubmissionModal && (
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
              <h2 style={{ fontSize: "1.30rem", fontWeight: "800", color: "var(--text-primary)" }}>Submit Resource Links</h2>
              <button 
                onClick={() => setShowSubmissionModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmissionSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>GitHub Repository Link</label>
                <input 
                  type="url" 
                  placeholder="https://github.com/myteam/project"
                  value={submission.git}
                  onChange={(e) => setSubmission(prev => ({ ...prev, git: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", fontSize: "0.88rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Slide Deck PPT Link</label>
                <input 
                  type="url" 
                  placeholder="https://slides.google.com/presentation"
                  value={submission.ppt}
                  onChange={(e) => setSubmission(prev => ({ ...prev, ppt: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", fontSize: "0.88rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Pitch Video Link</label>
                <input 
                  type="url" 
                  placeholder="https://youtube.com/watch?v=pitch"
                  value={submission.video}
                  onChange={(e) => setSubmission(prev => ({ ...prev, video: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", fontSize: "0.88rem" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Final Submission Platform Link</label>
                <input 
                  type="url" 
                  placeholder="https://devpost.com/software/submission"
                  value={submission.linkedin}
                  onChange={(e) => setSubmission(prev => ({ ...prev, linkedin: e.target.value }))}
                  style={{ width: "100%", padding: "10px 14px", background: "var(--bg-primary)", border: "1px solid var(--border-color)", borderRadius: "8px", color: "var(--text-primary)", outline: "none", fontSize: "0.88rem" }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => setShowSubmissionModal(false)}
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
                  Save Links
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD TASK MODAL */}
      {showTaskModal && (
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
            maxWidth: "400px",
            padding: "32px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.4)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)" }}>Assign Task</h2>
              <button 
                onClick={() => setShowTaskModal(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.5rem", cursor: "pointer" }}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "6px", textTransform: "uppercase" }}>
                  Task Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Implement Timeline Components"
                  value={newTask.taskTitle}
                  onChange={(e) => setNewTask(prev => ({ ...prev, taskTitle: e.target.value }))}
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
                  Assign to Member
                </label>
                <select 
                  value={newTask.assignedToId}
                  onChange={(e) => setNewTask(prev => ({ ...prev, assignedToId: e.target.value }))}
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
                  <option value="">-- Unassigned / Backlog --</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.userName} ({member.role})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button 
                  type="button" 
                  onClick={() => setShowTaskModal(false)}
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
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Hackathon;
