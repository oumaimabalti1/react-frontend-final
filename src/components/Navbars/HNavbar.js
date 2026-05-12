import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Home, Users, Briefcase, FileText, Palmtree, Megaphone, LogOut, Menu, X } from "lucide-react";
import { logout } from "services/authService";
import logo from "assets/img/EASYRH.png";
import api from "services/api";

const ACCENT = "#0891b2";
const links = [
  { to: "/hr/accueil",      label: "Accueil",      icon: Home },
  { to: "/hr/employeelist", label: "Employés",     icon: Users },
  { to: "/hr/offres",       label: "Offres",       icon: Briefcase },
  { to: "/hr/candidatures", label: "Candidatures", icon: FileText },
  { to: "/hr/conges",       label: "Congés",       icon: Palmtree },
  { to: "/hr/plaintes",     label: "Plaintes",     icon: Megaphone },
];

export default function HNavbar() {
  const location = useLocation();
  const history  = useHistory();
  const [open, setOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const isActive = (p) => location.pathname === p;
  const handleLogout = () => { logout(); history.push("/auth/login"); };

  useEffect(() => {
    api.get("/rh/candidatures")
      .then(res => {
        const list = res.data.candidatures || [];
        setPendingCount(list.filter(c => c.statut === "EN_ATTENTE").length);
      })
      .catch(() => {});
  }, [location.pathname]);

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"rgba(255,255,255,0.92)",backdropFilter:"blur(16px)",borderBottom:"1px solid #e2e8f0",height:64,display:"flex",alignItems:"center",padding:"0 24px",justifyContent:"space-between" }}>
        <Link to="/hr/accueil" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
          <img src={logo} alt="EasyRH" style={{ height:36,width:"auto" }} />
          <span style={{ fontSize:11,fontWeight:700,color:ACCENT,textTransform:"uppercase",letterSpacing:"0.12em",background:"#f0fdfa",border:"1px solid #99f6e4",padding:"2px 8px",borderRadius:4 }}>RH</span>
        </Link>

        <div style={{ display:"flex",alignItems:"center",gap:2 }}>
          {links.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 12px",borderRadius:8,fontSize:13,fontWeight:active?700:600,textDecoration:"none",color:active?ACCENT:"#64748b",background:active?"#f0fdfa":"transparent",transition:"all 0.15s",position:"relative" }}>
                <Icon size={15} /> {label}
                {label === "Candidatures" && pendingCount > 0 && (
                  <span style={{
                    position: "absolute", top: 2, right: -2,
                    background: "#ef4444", color: "#fff",
                    borderRadius: 10, padding: "1px 6px",
                    fontSize: 10, fontWeight: 800, minWidth: 16,
                    textAlign: "center", lineHeight: "16px"
                  }}>{pendingCount}</span>
                )}
              </Link>
            );
          })}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <Link to="/profile" style={{ width:34,height:34,borderRadius:10,background:"#f0fdfa",display:"flex",alignItems:"center",justifyContent:"center",color:ACCENT,fontWeight:700,fontSize:12,textDecoration:"none" }}>RH</Link>
          <button onClick={handleLogout} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 13px",borderRadius:8,border:"1.5px solid #fecaca",background:"#fef2f2",color:"#dc2626",fontSize:12,fontWeight:600,cursor:"pointer" }}><LogOut size={14} /> Déconnexion</button>
          <button onClick={() => setOpen(!open)} style={{ background:"none",border:"none",cursor:"pointer",color:"#475569",padding:4 }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>

      {open && (
        <div style={{ position:"fixed",top:64,left:0,right:0,zIndex:999,background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4 }}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{ padding:"10px 14px",borderRadius:8,fontSize:14,fontWeight:600,textDecoration:"none",display:"flex",alignItems:"center",gap:10,color:isActive(to)?ACCENT:"#64748b",background:isActive(to)?"#f0fdfa":"transparent" }}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <button onClick={handleLogout} style={{ marginTop:8,padding:"10px 14px",borderRadius:8,border:"none",background:"#fef2f2",color:"#dc2626",fontSize:14,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:10 }}><LogOut size={16} /> Déconnexion</button>
        </div>
      )}
      <div style={{ height:64 }} />
    </>
  );
}