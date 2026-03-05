import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NavCard({ to, icon: Icon, color, title, desc }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <Link to={to} style={{ textDecoration:"none" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background:"#fff",borderRadius:18,padding:24,border:`1.5px solid ${color}33`,boxShadow:hovered?"0 12px 32px rgba(30,60,120,0.13)":"0 4px 20px rgba(30,60,120,0.07)",transform:hovered?"translateY(-4px)":"translateY(0)",transition:"transform 0.18s, box-shadow 0.18s",cursor:"pointer",height:"100%" }}
      >
        <div style={{ width:48,height:48,borderRadius:14,background:`${color}14`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16 }}>
          <Icon size={22} color={color} />
        </div>
        <h3 style={{ fontSize:16,fontWeight:700,color:"#1a2340",margin:"0 0 6px" }}>{title}</h3>
        <p style={{ fontSize:13,color:"#94a3b8",margin:"0 0 16px",lineHeight:1.5 }}>{desc}</p>
        <div style={{ display:"flex",alignItems:"center",gap:4,color,fontSize:13,fontWeight:600 }}>
          Accéder <ArrowRight size={14} />
        </div>
      </div>
    </Link>
  );
}