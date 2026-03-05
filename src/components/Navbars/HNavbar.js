import React, { useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { Home, Users, Briefcase, FileText, Palmtree, Megaphone, LogOut, Menu, X } from "lucide-react";
import { logout } from "services/authService";
import logo from "assets/img/EASYRH.png";

const links = [
  { to: "/hr/accueil",      label: "Accueil",      icon: Home },
  { to: "/hr/employeelist", label: "Employés",     icon: Users },
  { to: "/hr/offres",       label: "Offres",       icon: Briefcase },
  { to: "/hr/candidatures", label: "Candidatures", icon: FileText },
  { to: "/hr/conges",       label: "Congés",       icon: Palmtree },
  { to: "/hr/plaintes",     label: "Plaintes",     icon: Megaphone },
];

const ACCENT = "#3b82f6";

const S = {
  nav: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
    height: 64, display: "flex", alignItems: "center",
    padding: "0 24px", justifyContent: "space-between",
  },
  logo: { display: "flex", alignItems: "center", gap: 10, textDecoration: "none" },
  logoImg: { height: 36, width: "auto" },
  badge: {
    fontSize: 11, fontWeight: 700, color: ACCENT,
    textTransform: "uppercase", letterSpacing: "0.12em",
    background: "rgba(59,130,246,0.12)", padding: "2px 8px", borderRadius: 4,
  },
  links: { display: "flex", alignItems: "center", gap: 2 },
  link: (active) => ({
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 12px", borderRadius: 8,
    fontSize: 13, fontWeight: 600, textDecoration: "none",
    color: active ? "#fff" : "rgba(255,255,255,0.5)",
    background: active ? "rgba(59,130,246,0.18)" : "transparent",
    borderBottom: `2px solid ${active ? ACCENT : "transparent"}`,
    transition: "all 0.15s",
  }),
  right: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 34, height: 34, borderRadius: 10,
    background: "rgba(59,130,246,0.15)",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: ACCENT, fontWeight: 700, fontSize: 12,
    textDecoration: "none",
  },
  logout: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 13px", borderRadius: 8,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(239,68,68,0.08)", color: "rgba(255,255,255,0.55)",
    fontSize: 12, fontWeight: 600, cursor: "pointer",
  },
  spacer: { height: 64 },
  mobileMenu: {
    position: "fixed", top: 64, left: 0, right: 0, zIndex: 999,
    background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4,
  },
  mobileLink: (active) => ({
    padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600,
    textDecoration: "none", display: "flex", alignItems: "center", gap: 10,
    color: active ? "#fff" : "rgba(255,255,255,0.6)",
    background: active ? "rgba(59,130,246,0.15)" : "transparent",
  }),
  mobileLogout: {
    marginTop: 8, padding: "10px 14px", borderRadius: 8,
    border: "none", background: "rgba(239,68,68,0.1)", color: "#f87171",
    fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", gap: 10,
  },
};

export default function HNavbar() {
  const location = useLocation();
  const history  = useHistory();
  const [open, setOpen] = useState(false);
  const isActive = (p) => location.pathname === p;
  const handleLogout = () => { logout(); history.push("/auth/login"); };

  return (
    <>
      <nav style={S.nav}>
        <Link to="/hr/accueil" style={S.logo}>
          <img src={logo} alt="EasyRH" style={S.logoImg} />
          <span style={S.badge}>RH</span>
        </Link>

        <div style={S.links}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} style={S.link(isActive(to))}>
              <Icon size={15} /> {label}
            </Link>
          ))}
        </div>

        <div style={S.right}>
          <Link to="/profile" style={S.avatar}>RH</Link>
          <button onClick={handleLogout} style={S.logout}><LogOut size={14} /> Déconnexion</button>
          <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 4 }}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div style={S.mobileMenu}>
          {links.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={S.mobileLink(isActive(to))}>
              <Icon size={16} /> {label}
            </Link>
          ))}
          <button onClick={handleLogout} style={S.mobileLogout}><LogOut size={16} /> Déconnexion</button>
        </div>
      )}
      <div style={S.spacer} />
    </>
  );
}