import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NavCard({ to, icon: Icon, color, title, desc }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: "32px 28px",
          border: `1px solid ${hovered ? `${color}40` : "#f1f5f9"}`,
          borderLeft: `4px solid ${color}`,
          boxShadow: hovered ? `0 8px 24px ${color}12` : "0 1px 4px rgba(0,0,0,0.04)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: `${color}08`,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, transition: "transform 0.2s",
          transform: hovered ? "scale(1.05)" : "scale(1)"
        }}>
          <Icon size={26} color={color} strokeWidth={1.8} />
        </div>

        <h3 style={{
          fontSize: 18, fontWeight: 800,
          color: hovered ? color : "#0f172a",
          margin: "0 0 8px", transition: "color 0.2s"
        }}>
          {title}
        </h3>

        <p style={{
          fontSize: 14, color: "#64748b", margin: "0 0 24px",
          lineHeight: 1.6, flex: 1
        }}>
          {desc}
        </p>

        <div  style={{ marginTop:"auto",padding:11,borderRadius:11,border:"none",background:"linear-gradient(135deg,#b6d7df,#0e7490)",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 3px 12px rgba(8,145,178,0.3)" }}>
        
          <span style={{ fontSize: 14, fontWeight: 700, color: color }}>Accéder</span>
          <ArrowRight size={16} color={color} style={{
            transition: "transform 0.2s",
            transform: hovered ? "translateX(4px)" : "translateX(0)"
          }} />
        </div>
      </div>
    </Link>
  );
}