import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "assets/img/EASYRH.png";

export default function FreeNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
        borderBottom: "1px solid #e2e8f0", height: 64,
        display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between"
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={logo} alt="EasyRH" style={{ height: 36, width: "auto" }} />
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { to: "/whyus", label: "Pourquoi nous ?" },
            { to: "/aboutus", label: "À propos" },
            { to: "/contactus", label: "Contact" },
          ].map(({ to, label }) => (
            <Link key={to} to={to} style={{
              padding: "7px 16px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: "#475569", textDecoration: "none", transition: "color 0.15s"
            }}>{label}</Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link to="/auth/login" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0",
              background: "white", color: "#334155", fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>Se connecter</button>
          </Link>
          <Link to="/Landing" style={{ textDecoration: "none" }}>
            <button style={{
              padding: "8px 20px", borderRadius: 10, border: "none",
              background: "#0891b2", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 2px 8px rgba(8,145,178,0.3)"
            }}>Commencer</button>
          </Link>
          <button onClick={() => setOpen(!open)} style={{
            background: "none", border: "none", cursor: "pointer", color: "#334155", padding: 4,
            display: "none"
          }}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </nav>

      {open && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0, zIndex: 999,
          background: "white", borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4
        }}>
          {[
            { to: "/whyus", label: "Pourquoi nous ?" },
            { to: "/aboutus", label: "À propos" },
            { to: "/contactus", label: "Contact" },
          ].map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)} style={{
              padding: "10px 14px", borderRadius: 8, fontSize: 14, fontWeight: 600,
              color: "#475569", textDecoration: "none"
            }}>{label}</Link>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <Link to="/auth/login" onClick={() => setOpen(false)} style={{ flex: 1, textDecoration: "none" }}>
              <button style={{
                width: "100%", padding: 10, borderRadius: 10, border: "1.5px solid #e2e8f0",
                background: "white", color: "#334155", fontWeight: 600, cursor: "pointer"
              }}>Se connecter</button>
            </Link>
            <Link to="/Landing" onClick={() => setOpen(false)} style={{ flex: 1, textDecoration: "none" }}>
              <button style={{
                width: "100%", padding: 10, borderRadius: 10, border: "none",
                background: "#0891b2", color: "#fff", fontWeight: 700, cursor: "pointer"
              }}>Commencer</button>
            </Link>
          </div>
        </div>
      )}
      <div style={{ height: 64 }} />
    </>
  );
}