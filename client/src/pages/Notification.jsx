import { useState } from "react";

function Notification() {
  const [filter, setFilter] = useState("all");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "deadline",
      title: "Upcoming Submission Deadline",
      message: "DevSprint 2025 submission deadline is in 2 days (Dec 18, 2025). Please ensure all codebase submissions are reviewed.",
      time: "2 hours ago",
      read: false,
      priority: "high"
    },
    {
      id: 2,
      type: "task",
      title: "New Task Assigned",
      message: "You have been assigned the task: 'Design Member Profile Cards' under MLH Hackathon.",
      time: "5 hours ago",
      read: false,
      priority: "medium"
    },
    {
      id: 3,
      type: "team",
      title: "New Member Joined",
      message: "Alex Chen added John Doe to the team roster as a UI/UX Designer.",
      time: "Yesterday",
      read: true,
      priority: "low"
    },
    {
      id: 4,
      type: "success",
      title: "Milestone Completed!",
      message: "Congratulations! The team has resolved all pending Ideation tasks for ETHGlobal London 2026.",
      time: "Yesterday",
      read: true,
      priority: "low"
    },
    {
      id: 5,
      type: "system",
      title: "Prisma Database Migrated",
      message: "The backend server has applied migration: 'add_password_to_member' and successfully verified database relations.",
      time: "2 days ago",
      read: true,
      priority: "low"
    }
  ]);

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "all") return true;
    if (filter === "unread") return !notif.read;
    return notif.type === filter;
  });

  const getIcon = (type) => {
    switch(type) {
      case "deadline":
        return (
          <div style={{ background: "rgba(236, 72, 153, 0.1)", color: "var(--accent-pink)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        );
      case "task":
        return (
          <div style={{ background: "rgba(245, 158, 11, 0.1)", color: "var(--accent-orange)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
          </div>
        );
      case "success":
        return (
          <div style={{ background: "rgba(79, 209, 197, 0.1)", color: "var(--accent-teal)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case "team":
        return (
          <div style={{ background: "rgba(59, 130, 246, 0.1)", color: "var(--accent-blue)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div style={{ background: "rgba(139, 92, 246, 0.1)", color: "var(--accent-purple)", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="dash-content" style={{ animation: "fadeIn 0.4s ease" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.5px" }}>
            Message <span style={{ color: "var(--accent-teal)" }}>Center</span>
          </h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>
            Review tasks updates, system migration status, and timeline warnings.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead} 
            className="dash-logout-btn"
            style={{ 
              fontWeight: "600", 
              padding: "10px 18px", 
              borderRadius: "10px", 
              cursor: "pointer"
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "32px", overflowX: "auto", paddingBottom: "8px" }}>
        {[
          { id: "all", label: "All Alerts" },
          { id: "unread", label: `Unread (${unreadCount})` },
          { id: "deadline", label: "Deadlines" },
          { id: "task", label: "Tasks" },
          { id: "team", label: "Team" },
          { id: "success", label: "Milestones" }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilter(btn.id)}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              background: filter === btn.id ? "var(--bg-secondary)" : "transparent",
              color: filter === btn.id ? "var(--text-primary)" : "var(--text-secondary)",
              fontWeight: "600",
              fontSize: "0.85rem",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* NOTIFICATIONS LIST */}
      {filteredNotifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "var(--bg-secondary)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>No notifications found in this category.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredNotifications.map((notif) => (
            <div 
              key={notif.id}
              style={{
                display: "flex",
                gap: "16px",
                padding: "20px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                position: "relative",
                transition: "transform 0.2s ease, border-color 0.2s ease",
                opacity: notif.read ? 0.75 : 1,
                borderLeft: !notif.read ? "4px solid var(--accent-teal)" : "1px solid var(--border-color)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateX(2px)";
                e.currentTarget.style.borderColor = "var(--border-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateX(0)";
                e.currentTarget.style.borderColor = "var(--border-color)";
              }}
            >
              {/* Icon */}
              {getIcon(notif.type)}

              {/* Text info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <h3 style={{ color: "var(--text-primary)", fontSize: "1.02rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
                    {notif.title}
                    {!notif.read && (
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent-teal)" }}></span>
                    )}
                  </h3>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{notif.time}</span>
                </div>
                
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                  {notif.message}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      style={{ background: "none", border: "none", color: "var(--accent-teal)", fontSize: "0.78rem", fontWeight: "700", cursor: "pointer" }}
                    >
                      Mark as Read
                    </button>
                  )}
                  <button 
                    onClick={() => clearNotification(notif.id)}
                    style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: "600", cursor: "pointer" }}
                  >
                    Clear
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

export default Notification;
