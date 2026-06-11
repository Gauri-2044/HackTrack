import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { getDashboardData } from "../services/dashboard";

const Dashboard = function() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [teamName, setTeamName] = useState("TechBinder");
  const [memberName, setMemberName] = useState("Alex Chen");
  const [stats, setStats] = useState({
    activeHackathonsCount: 3,
    pendingTasksCount: 4,
    completedTasksCount: 28,
    upcomingDeadlinesCount: 2
  });

  // Hackathons list state (starts with fallback, updated from API)
  const [hackathons, setHackathons] = useState([
    {
      id: 1,
      hackathonName: "DevSprint 2025",
      platform: "MLH",
      status: "Live",
      stage: "Prototype",
      dueDate: "Dec 18, 2025",
      completedTasks: 16,
      totalTasks: 24,
      progressPercent: 68,
      members: ["AC", "JK", "MR", "PL"]
    }
  ]);

  // Tasks list state (starts with fallback, updated from API)
  const [tasks, setTasks] = useState([
    { id: 1, title: "Implement Auth API Integration", priority: "high", due: "Due today", status: "inprogress" },
    { id: 2, title: "Setup Dashboard Layout Grid", priority: "medium", due: "Due tomorrow", status: "inprogress" },
    { id: 3, title: "Integrate Toast Notifications", priority: "medium", due: "Due in 2 days", status: "pending" },
    { id: 4, title: "Design Member Profile Cards", priority: "low", due: "Due in 3 days", status: "pending" },
  ]);

  useEffect(() => {
    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        const storedTeam = localStorage.getItem("teamName");
        const storedUser = localStorage.getItem("userName");
        const storedEmail = localStorage.getItem("userEmail");

        if (storedTeam) setTeamName(storedTeam);
        if (storedUser) setMemberName(storedUser);

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await getDashboardData(token);
        if (response && response.success) {
          const { team, members, hackathons: apiHackathons, activeTasks: apiTasks } = response.data;
          
          if (team) setTeamName(team.teamName);
          
          // Identify the current member's ID by email
          let currentMemberId = null;
          if (members && storedEmail) {
            const currentMember = members.find(m => m.email === storedEmail);
            if (currentMember) {
              currentMemberId = currentMember.id;
              setMemberName(currentMember.userName);
            }
          }

          // Format & set Hackathons list
          if (apiHackathons && apiHackathons.length > 0) {
            const formattedHackathons = apiHackathons.map(h => {
              // Calculate task progress per hackathon
              const hackathonTasks = apiTasks?.filter(t => t.hackathonId === h.id) || [];
              const completed = hackathonTasks.filter(t => t.status === "completed").length;
              const total = hackathonTasks.length;
              const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
              
              return {
                id: h.id,
                hackathonName: h.hackathonName,
                platform: h.platform || "Hackathon",
                status: h.status === "active" ? "Live" : h.status,
                stage: h.stages?.[0]?.stageName || "General",
                dueDate: h.stages?.[0]?.deadline || "Not declared",
                completedTasks: completed,
                totalTasks: total,
                progressPercent: percent,
                members: members?.map(m => m.userName.split(" ").map(n => n[0]).join("")).slice(0, 4) || ["U"]
              };
            });
            setHackathons(formattedHackathons);
          }

          // Format & set member-specific Tasks list
          if (apiTasks) {
            // Filter tasks assigned to currently logged-in member
            const memberTasks = currentMemberId 
              ? apiTasks.filter(t => t.assignedToId === currentMemberId)
              : apiTasks; // fallback to showing all active team tasks if member matching fails

            const formattedTasks = memberTasks.map(t => ({
              id: t.id,
              title: t.title,
              priority: t.priority || "medium",
              due: t.createdAt ? `Created ${new Date(t.createdAt).toLocaleDateString()}` : "Active",
              status: t.status === "todo" ? "pending" : t.status === "inprogress" ? "inprogress" : t.status
            }));
            setTasks(formattedTasks);

            // Calculate Counts for stats
            const pendingCount = apiTasks.filter(t => t.status === "todo" || t.status === "inprogress").length;
            const completedCount = apiTasks.filter(t => t.status === "completed").length;

            setStats({
              activeHackathonsCount: apiHackathons?.length || 0,
              pendingTasksCount: pendingCount,
              completedTasksCount: 28 + completedCount, // adding baseline complete count
              upcomingDeadlinesCount: apiHackathons?.length || 0
            });
          }
        }
      } catch (error) {
        console.error("Error setting dashboard state from API: ", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleTaskStatus = (id) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === id) {
          const nextStatus = task.status === "completed" ? "inprogress" : "completed";
          return { ...task, status: nextStatus };
        }
        return task;
      })
    );
  };

  const inProgressTasks = tasks.filter(t => t.status === "inprogress");
  const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "todo");

  if (loading) {
    return (
      <div className="dashboard-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", fontWeight: "600" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      
      {/* DASHBOARD CONTENT CONTAINER */}
      <div className="dash-content">
        
        {/* Welcome Section */}
        <header className="dash-welcome-section">
          <h1 className="dash-welcome-title">
            Welcome, <span>{teamName}</span>
          </h1>
          <p className="dash-welcome-subtitle">
            Hello {memberName}, here is what's happening with your team today.
          </p>
        </header>

        {/* Stats Grid */}
        <section className="dash-stats-grid">
          
          {/* Stat 1 */}
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrapper">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a3 3 0 10-3 3h3zm0-3a1 1 0 100-2 1 1 0 000 2z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21v-8a3 3 0 00-3-3H8a3 3 0 00-3 3v8" />
              </svg>
            </div>
            <span className="dash-stat-num">{stats.activeHackathonsCount}</span>
            <span className="dash-stat-label">Active Hackathons</span>
            <span className="dash-stat-footer blue">+1 this month</span>
          </div>

          {/* Stat 2 */}
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrapper">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="dash-stat-num">{stats.pendingTasksCount}</span>
            <span className="dash-stat-label">Pending Tasks</span>
            <span className="dash-stat-footer orange">3 overdue</span>
          </div>

          {/* Stat 3 */}
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrapper">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
              </svg>
            </div>
            <span className="dash-stat-num">{stats.completedTasksCount}</span>
            <span className="dash-stat-label">Completed Tasks</span>
            <span className="dash-stat-footer teal">+5 this week</span>
          </div>

          {/* Stat 4 */}
          <div className="dash-stat-card">
            <div className="dash-stat-icon-wrapper">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="dash-stat-num">{stats.upcomingDeadlinesCount}</span>
            <span className="dash-stat-label">Upcoming Deadlines</span>
            <span className="dash-stat-footer purple">Next: Dec 18</span>
          </div>

        </section>

        {/* Main Sections (Hackathons & Tasks Split Grid) */}
        <div className="dash-sections-grid">
          
          {/* Active Hackathons Section */}
          <div className="dash-section-box">
            <h2>
              Active Hackathons
              <Link to="/hackathons" className="dash-view-all">View all &rsaquo;</Link>
            </h2>
            
            <div className="dash-hackathon-list">
              {hackathons.map(hack => (
                <div className="dash-hackathon-card" key={hack.id}>
                  <div className="dash-hackathon-header">
                    <div className="dash-hack-title-wrap">
                      <span className="dash-hack-title">{hack.hackathonName}</span>
                      <span className="dash-hack-badge">{hack.status}</span>
                    </div>
                  </div>
                  
                  <p className="dash-hack-meta">
                    {hack.platform} <span>&bull;</span> Stage: {hack.stage} <span>&bull;</span> Due: {hack.dueDate}
                  </p>
                  
                  <div className="dash-hack-progress-label">
                    <span>Tasks: {hack.completedTasks}/{hack.totalTasks}</span>
                    <span className="dash-hack-progress-percent">{hack.progressPercent}%</span>
                  </div>
                  
                  <div className="dash-hack-progress-bar">
                    <div className="dash-hack-progress-bar-fill" style={{ width: `${hack.progressPercent}%` }}></div>
                  </div>
                  
                  <div className="dash-avatars-stack">
                    {hack.members.map((initial, index) => (
                      <div className={`dash-avatar-item ${index === 0 ? "ac" : index === 1 ? "jk" : index === 2 ? "mr" : "pl"}`} key={index}>
                        {initial}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Member Tasks Section */}
          <div className="dash-section-box">
            <h2>Your Tasks</h2>
            
            <div className="dash-tasks-card">
              
              {/* In Progress Group */}
              {inProgressTasks.length > 0 && (
                <div className="dash-tasks-group">
                  <div className="dash-tasks-group-title">In Progress</div>
                  <div className="dash-task-list">
                    {inProgressTasks.map(task => (
                      <div className="dash-task-item" key={task.id}>
                        <div 
                          className="dash-task-checkbox" 
                          onClick={() => toggleTaskStatus(task.id)}
                        ></div>
                        <div className="dash-task-content">
                          <div className="dash-task-title">{task.title}</div>
                          <div className="dash-task-meta-row">
                            <span className={`dash-task-priority ${task.priority}`}>{task.priority}</span>
                            <span className="dash-task-due">{task.due}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pending / Todo Group */}
              {pendingTasks.length > 0 && (
                <div className="dash-tasks-group">
                  <div className="dash-tasks-group-title">Todo / Pending</div>
                  <div className="dash-task-list">
                    {pendingTasks.map(task => (
                      <div className="dash-task-item" key={task.id}>
                        <div 
                          className="dash-task-checkbox" 
                          onClick={() => toggleTaskStatus(task.id)}
                        ></div>
                        <div className="dash-task-content">
                          <div className="dash-task-title">{task.title}</div>
                          <div className="dash-task-meta-row">
                            <span className={`dash-task-priority ${task.priority}`}>{task.priority}</span>
                            <span className="dash-task-due">{task.due}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when all tasks are checked */}
              {inProgressTasks.length === 0 && pendingTasks.length === 0 && (
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", textAlign: "center", padding: "12px 0" }}>
                  All caught up! No active tasks.
                </p>
              )}

            </div>
          </div>
          
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
