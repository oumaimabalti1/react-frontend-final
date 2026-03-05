import React from "react";
import { Link } from "react-router-dom";

export default function FooterSmall({ absolute }) {
  return (
    <footer style={{
      position: absolute ? "absolute" : "relative",
      bottom: absolute ? 0 : "auto",
      width: "100%",
      background: "#0f172a",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      padding: "20px 0",
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: 0, fontWeight: 500 }}>
          © {new Date().getFullYear()} <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>EasyRH</span> 
        </p>

        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            { to: "/aboutus", label: "À propos", internal: true },
           
          ].map(item => item.internal ? (
            <Link key={item.label} to={item.to} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", padding: "5px 12px", borderRadius: 6, textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.85)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
              {item.label}
            </Link>
          ) : (
            <a key={item.label} href={item.href} style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)", padding: "5px 12px", borderRadius: 6, textDecoration: "none" }}
              onMouseEnter={e => e.target.style.color = "rgba(255,255,255,0.85)"}
              onMouseLeave={e => e.target.style.color = "rgba(255,255,255,0.4)"}>
              {item.label}
            </a>
          ))}
        </nav>

      </div>
    </footer>
  );
}