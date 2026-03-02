import React from "react";
import { Link } from "react-router-dom";
import ENavbar from "components/Navbars/ENavbar.js";
import { Palmtree, Megaphone, ArrowRight } from "lucide-react";

const cards = [
  {
    to: "/employee/conge",
    icon: Palmtree,
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
    title: "Congés",
    desc: "Soumettre et suivre vos demandes de congé",
  },
  {
    to: "/employee/plainte",
    icon: Megaphone,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    title: "Plaintes",
    desc: "Signaler un problème à votre RH",
  },
];

export default function AcceuilE() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <ENavbar />

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #1e293b 100%)",
          padding: "64px 24px 80px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(16,185,129,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(5,150,105,0.06)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(16,185,129,0.15)", color: "#34d399",
              borderRadius: 20, padding: "5px 16px", fontSize: 12,
              fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 20,
            }}>
              Portail Employé
            </span>

            <h1 style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800, color: "#fff", margin: "0 0 16px", lineHeight: 1.2,
            }}>
              Bienvenue{user?.nom ? `, ${user.nom}` : ""} 
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
              Gérez vos congés et signalez vos préoccupations directement à votre responsable RH.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: 620, margin: "-32px auto 0", padding: "0 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 18 }}>
            {cards.map(({ to, icon: Icon, color, bg, border, title, desc }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", borderRadius: 18, padding: "24px",
                  border: `1.5px solid ${border}`,
                  boxShadow: "0 4px 20px rgba(30,60,120,0.07)",
                  transition: "transform 0.18s, box-shadow 0.18s", cursor: "pointer",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,60,120,0.13)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,60,120,0.07)"; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                    <Icon size={22} color={color} />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: "0 0 6px" }}>{title}</h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.5 }}>{desc}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, color, fontSize: 13, fontWeight: 600 }}>
                    Accéder <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}