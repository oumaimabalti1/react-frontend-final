import React from "react";
import { Briefcase, Building2, Send } from "lucide-react";

const COLOR = "#0891b2"; 

export default function OffreCard({ offre, onOpen }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background:"#fff",borderRadius:18,padding:24,boxShadow:hovered?"0 12px 32px rgba(30,60,120,0.13)":"0 2px 16px rgba(30,60,120,0.07)",border:"1.5px solid rgba(8,145,178,0.1)",display:"flex",flexDirection:"column",gap:12,transform:hovered?"translateY(-4px)":"translateY(0)",transition:"transform 0.18s, box-shadow 0.18s" }}
    >
      <div style={{ width:46,height:46,borderRadius:13,background:"rgba(8,145,178,0.08)",display:"flex",alignItems:"center",justifyContent:"center" }}>
        <Briefcase size={20} color={COLOR} />
      </div>
      <div>
        <h3 style={{ fontSize:16,fontWeight:700,color:"#1a2340",margin:0 }}>{offre.titre}</h3>
        {offre.entrepriseId?.nom && (
          <p style={{ fontSize:13,color:"#6b7280",marginTop:4,display:"flex",alignItems:"center",gap:4 }}>
            <Building2 size={13} /> {offre.entrepriseId.nom}
          </p>
        )}
      </div>
      <p style={{ fontSize:14,color:"#6b7280",lineHeight:1.6,margin:0,display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",overflow:"hidden" }}>{offre.description}</p>
      {offre.entrepriseId?.secteur && (
        <span style={{ alignSelf:"flex-start",background:"rgba(8,145,178,0.08)",color:COLOR,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:600 }}>{offre.entrepriseId.secteur}</span>
      )}
      <button onClick={() => onOpen(offre)} style={{ marginTop:"auto",padding:11,borderRadius:11,border:"none",background:"linear-gradient(135deg,#b6d7df,#0e7490)",color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 3px 12px rgba(8,145,178,0.3)" }}>
        <Send size={15} /> Voir & Postuler
      </button>
    </div>
  );
}