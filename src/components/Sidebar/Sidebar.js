/*eslint-disable*/
import React from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    to: "/admin/dashboard",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Entreprises",
    to: "/admin/entreprises",
    icon: (
      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0,
      width: 240, height: "100vh",
      background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
      display: "flex", flexDirection: "column",
      zIndex: 40, boxShadow: "4px 0 24px rgba(0,0,0,0.18)",
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#fff",
            boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
          }}>E</div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, lineHeight: 1 }}>EasyRH</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{
          color: "#475569", fontSize: 10, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: "0.1em",
          padding: "0 12px", marginBottom: 8,
        }}>Navigation</p>

        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <li key={item.label} style={{ marginBottom: 4 }}>
                <Link
                  to={item.to}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 14px", borderRadius: 10,
                    textDecoration: "none",
                    color: isActive ? "#fff" : "#94a3b8",
                    background: isActive ? "linear-gradient(135deg, #3b82f6, #1d4ed8)" : "transparent",
                    fontWeight: isActive ? 600 : 500, fontSize: 14,
                    transition: "all 0.18s",
                    boxShadow: isActive ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "#94a3b8";
                    }
                  }}
                >
                  <span style={{ opacity: isActive ? 1 : 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User info */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", marginBottom: 8,
          background: "rgba(255,255,255,0.04)", borderRadius: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #10b981, #059669)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 700, color: "#fff",
          }}>A</div>
          <div>
            <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>Admin</div>
            <div style={{ color: "#64748b", fontSize: 11 }}>Administrateur</div>
          </div>
        </div>
      </div>
    </nav>
  );
}