import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "assets/img/EASYRH.png";

export default function FreeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:1000,background:"rgba(15,23,42,0.85)",backdropFilter:"blur(12px)",borderBottom:"1px solid rgba(255,255,255,0.06)",boxShadow:"0 4px 24px rgba(0,0,0,0.3)",height:64,display:"flex",alignItems:"center",padding:"0 24px",justifyContent:"space-between" }}>
        <Link to="/" style={{ display:"flex",alignItems:"center",textDecoration:"none" }}>
          <img src={logo} alt="EasyRH" style={{ height:36,width:"auto" }} />
        </Link>

        <div style={{ display:"flex",alignItems:"center",gap:4 }}>
          {[{ to:"/whyus",label:"Pourquoi nous ?" },{ to:"/aboutus",label:"À propos" }].map(({ to, label }) => (
            <Link key={to} to={to} style={{ padding:"7px 14px",borderRadius:8,fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.6)",textDecoration:"none" }}>{label}</Link>
          ))}
        </div>

        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <Link to="/contactus" style={{ textDecoration:"none" }}>
            <button style={{ padding:"8px 18px",borderRadius:50,border:"1.5px solid rgba(255,255,255,0.15)",background:"transparent",color:"rgba(255,255,255,0.75)",fontSize:13,fontWeight:600,cursor:"pointer" }}>Contact</button>
          </Link>
          <Link to="/Landing" style={{ textDecoration:"none" }}>
            <button style={{ padding:"8px 18px",borderRadius:50,border:"none",background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(37,99,235,0.35)" }}>Commencer</button>
          </Link>
          <button onClick={() => setOpen(!open)} style={{ background:"none",border:"none",cursor:"pointer",color:"#fff",padding:4 }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>

      {open && (
        <div style={{ position:"fixed",top:64,left:0,right:0,zIndex:999,background:"#1e293b",borderBottom:"1px solid rgba(255,255,255,0.06)",padding:"12px 16px",display:"flex",flexDirection:"column",gap:4 }}>
          {[{ to:"/whyus",label:"Pourquoi nous ?" },{ to:"/aboutus",label:"À propos" }].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{ padding:"10px 14px",borderRadius:8,fontSize:14,fontWeight:600,color:"rgba(255,255,255,0.7)",textDecoration:"none" }}>{label}</Link>
          ))}
          <div style={{ display:"flex",gap:10,marginTop:8 }}>
            <Link to="/auth/login" onClick={() => setOpen(false)} style={{ flex:1,textDecoration:"none" }}>
              <button style={{ width:"100%",padding:10,borderRadius:50,border:"1.5px solid rgba(255,255,255,0.15)",background:"transparent",color:"#fff",fontWeight:600,cursor:"pointer" }}>Se connecter</button>
            </Link>
            <Link to="/Landing" onClick={() => setOpen(false)} style={{ flex:1,textDecoration:"none" }}>
              <button style={{ width:"100%",padding:10,borderRadius:50,border:"none",background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff",fontWeight:700,cursor:"pointer" }}>Commencer</button>
            </Link>
          </div>
        </div>
      )}
      <div style={{ height:64 }} />
    </>
  );
}