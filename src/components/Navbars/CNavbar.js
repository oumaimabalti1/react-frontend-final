import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Home, Briefcase, ClipboardList, FileText, LogOut, Menu, X } from "lucide-react";
import { logout } from "services/authService";
import logo from "assets/img/EASYRH.png";

const ACCENT = "#8b5cf6";
const links = [
  { to: "/candidat/accueil",      label: "Accueil",      icon: Home },
  { to: "/candidat/offre",        label: "Offres",       icon: Briefcase },
  { to: "/candidat/applications", label: "Candidatures", icon: ClipboardList },
  { to: "/candidat/moncv",        label: "Mon CV",       icon: FileText },
];

export default function CNavbar() {
  const location = useLocation();
  const history  = useHistory();
  const [open, setOpen] = useState(false);
  const isActive = (p) => location.pathname === p;
  const handleLogout = () => { logout(); history.push("/auth/login"); };

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"linear-gradient(135deg,#0f172a 0%,#1e293b 100%)",borderBottom:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",height:64,display:"flex",alignItems:"center",padding:"0 24px",justifyContent:"space-between" }}>
        <Link to="/candidat/accueil" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
          <img src={logo} alt="EasyRH" style={{ height:36,width:"auto" }} />
          <span style={{ fontSize:11,fontWeight:700,color:ACCENT,textTransform:"uppercase",letterSpacing:"0.12em",background:"rgba(139,92,246,0.12)",padding:"2px 8px",borderRadius:4 }}>Candidat</span>
        </Link>

        <div style={{ display:"flex",alignItems:"center",gap:2 }}>
          {links.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:8,fontSize:13,fontWeight:600,textDecoration:"none",color:active?"#fff":"rgba(255,255,255,0.5)",background:active?"rgba(139,92,246,0.18)":"transparent",borderBottom:`2px solid ${active?ACCENT:"transparent"}` }}>
                <Icon size={15} /> {label}
              </Link>
            );
          })}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <Link to="/profile" style={{ width:34,height:34,borderRadius:10,background:"rgba(139,92,246,0.15)",display:"flex",alignItems:"center",justifyContent:"center",color:ACCENT,fontWeight:700,fontSize:12,textDecoration:"none" }}>C</Link>
          <button onClick={handleLogout} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,border:"1px solid rgba(255,255,255,0.08)",background:"rgba(239,68,68,0.08)",color:"rgba(255,255,255,0.55)",fontSize:12,fontWeight:600,cursor:"pointer" }}><LogOut size={14} /> Déconnexion</button>
          <button onClick={() => setOpen(!open)} style={{ background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4 }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>

      {open && (
        <div style={{ position:"fixed",top:64,left:0,right:0,zIndex:999,background:"#1e293b",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4 }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{ padding:"10px 14px",borderRadius:8,fontSize:14,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:10,color:isActive(to)?"#fff":"rgba(255,255,255,0.6)",background:isActive(to)?"rgba(139,92,246,0.15)":"transparent" }}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{ marginTop:8,padding:"10px 14px",borderRadius:8,border:"none",background:"rgba(239,68,68,0.1)",color:"#f87171",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:10 }}><LogOut size={16} /> Déconnexion</button>
        </div>
      )}
      <div style={{ height:64 }} />
    </>
  );
}