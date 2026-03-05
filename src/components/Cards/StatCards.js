import React, { useState } from "react";

export default function StatCard({ label, value, icon: Icon, color, bg }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: "#fff", borderRadius: 16, padding: "28px 24px", boxShadow: "0 2px 16px rgba(30,60,120,0.07)", borderLeft: `5px solid ${color}`, display: "flex", alignItems: "center", gap: 18, transform: hovered ? "translateY(-3px)" : "translateY(0)", transition: "transform 0.18s" }}
    >
      <div style={{ width: 54, height: 54, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={24} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color: "#1a2340", lineHeight: 1 }}>
          {value ?? <span style={{ color: "#ccc", fontSize: 20 }}>—</span>}
        </div>
        <div style={{ fontSize: 13, color: "#7a8aaa", marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}