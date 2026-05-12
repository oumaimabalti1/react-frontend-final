import React from "react";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", to: "/admin/dashboard", icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  )},
  { label: "Entreprises", to: "/admin/entreprises", icon: (
    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )},
];

export default function Sidebar() {
  const location = useLocation();
  const isActive = (p) => location.pathname === p;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, width: 240, height: "100vh",
      background: "#ffffff", display: "flex", flexDirection: "column",
      zIndex: 40, borderRight: "1px solid #e2e8f0"
    }}>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "#0891b2", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 18, fontWeight: 800, color: "#fff",
            boxShadow: "0 2px 8px rgba(8,145,178,0.3)"
          }}>E</div>
          <div>
            <div style={{ color: "#0f172a", fontWeight: 700, fontSize: 16, lineHeight: 1 }}>EasyRH</div>
            <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={{ flex: 1, padding: "16px 12px", overflowY: "auto" }}>
        <p style={{
          color: "#94a3b8", fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.1em", padding: "0 12px", marginBottom: 8
        }}>Navigation</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item) => {
            const active = isActive(item.to);
            return (
              <li key={item.label} style={{ marginBottom: 4 }}>
                <Link to={item.to} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 14px", borderRadius: 10, textDecoration: "none",
                  color: active ? "#0891b2" : "#64748b",
                  background: active ? "#f0fdfa" : "transparent",
                  fontWeight: active ? 700 : 500, fontSize: 14,
                  borderLeft: active ? "3px solid #0891b2" : "3px solid transparent",
                  transition: "all 0.15s"
                }}>
                  <span style={{ color: active ? "#0891b2" : "#94a3b8" }}>{item.icon}</span>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* User */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #f1f5f9" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 14px", background: "#f8fafc", borderRadius: 10
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "#0891b2", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff"
          }}>A</div>
          <div>
            <div style={{ color: "#0f172a", fontSize: 13, fontWeight: 600 }}>Admin</div>
            <div style={{ color: "#94a3b8", fontSize: 11 }}>Administrateur</div>
          </div>
        </div>
      </div>
    </nav>
  );
}