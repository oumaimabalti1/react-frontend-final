import React from "react";
import { Link } from "react-router-dom";

export default function FooterSmall({ absolute }) {
  return (
    <footer style={{
      position: absolute ? "absolute" : "relative",
      bottom: absolute ? 0 : "auto",
      width: "100%",
      background: "#fff",
      borderTop: "1px solid #e2e8f0",
      padding: "20px 0",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, fontWeight: 500 }}>
          © {new Date().getFullYear()} <span style={{ color: "#0891b2", fontWeight: 600 }}>EasyRH</span> 
        </p>

        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { to: "/aboutus", label: "À propos", internal: true },
          ].map(item => item.internal ? (
            <Link key={item.label} to={item.to} style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", padding: "5px 12px", borderRadius: 6, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "#0891b2"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}>
              {item.label}
            </Link>
          ) : (
            <a key={item.label} href={item.href} style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", padding: "5px 12px", borderRadius: 6, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "#0891b2"}
              onMouseLeave={e => e.target.style.color = "#94a3b8"}>
              {item.label}
            </a>
          ))}
        </nav>

      </div>
    </footer>
  );
}