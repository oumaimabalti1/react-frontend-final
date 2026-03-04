
// Card réutilisable pour les pages d'accueil


import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NavCard({ to, icon: Icon, color, title, desc }) {
  const bg     = color + "14"; // 8% opacity
  const border = color + "33"; // 20% opacity

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          background: "#fff", borderRadius: 18, padding: 24,
          border: `1.5px solid ${border}`,
          boxShadow: "0 4px 20px rgba(30,60,120,0.07)",
          transition: "transform 0.18s, box-shadow 0.18s",
          cursor: "pointer", height: "100%",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,60,120,0.13)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,60,120,0.07)";
        }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14, background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 16,
        }}>
          <Icon size={22} color={color} />
        </div>

        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: "0 0 6px" }}>
          {title}
        </h3>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.5 }}>
          {desc}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 4, color, fontSize: 13, fontWeight: 600 }}>
          Accéder <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}