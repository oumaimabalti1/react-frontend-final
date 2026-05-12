import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { LayoutDashboard, Building2, LogOut, Menu, X } from "lucide-react";
import { logout } from "services/authService";
import logo from "assets/img/EASYRH.png";

const ACCENT = "#0891b2";
const links = [
  { to: "/admin/dashboard",   label: "Dashboard",   icon: LayoutDashboard },
  { to: "/admin/entreprises", label: "Entreprises", icon: Building2 },
];

export default function DNavbar() {
  const location = useLocation();
  const history  = useHistory();
  const [open, setOpen] = useState(false);
  const isActive = (p) => location.pathname === p;
  const handleLogout = () => { logout(); history.push("/auth/login"); };

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"#b6d7df",backdropFilter:"blur(16px)",borderBottom:"1px solid #e2e8f0",height:64,display:"flex",alignItems:"center",padding:"0 24px",justifyContent:"space-between" }}>
        <Link to="/admin/dashboard" style={{ display:"flex",alignItems:"center",gap:10,textDecoration:"none" }}>
          <img src={logo} alt="EasyRH" style={{ height:36,width:"auto" }} />
          <span style={{ fontSize:11,fontWeight:700,color:ACCENT,textTransform:"uppercase",letterSpacing:"0.12em",background:"#f0fdfa",border:"1px solid #99f6e4",padding:"2px 8px",borderRadius:4 }}>Admin</span>
        </Link>

        <div style={{ display:"flex",alignItems:"center",gap:2 }}>
          {links.map(({ to, label, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link key={to} to={to} style={{ display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:8,fontSize:13,fontWeight:active?700:600,textDecoration:"none",color:active?ACCENT:"#64748b",background:active?"#f0fdfa":"transparent",transition:"all 0.15s" }}>
                <Icon size={15} /> {label}
              </Link>
            );
          })}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <Link to="/profile" style={{ width:34,height:34,borderRadius:10,background:"#f0fdfa",display:"flex",alignItems:"center",justifyContent:"center",color:ACCENT,fontWeight:700,fontSize:12,textDecoration:"none" }}>A</Link>
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