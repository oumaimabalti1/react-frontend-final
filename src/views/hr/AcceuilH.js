import React from "react";
import { Link } from "react-router-dom";
import HNavbar from "components/Navbars/HNavbar.js";
import { Users, Briefcase, FileText, Palmtree, Megaphone, ArrowRight } from "lucide-react";

const cards = [
  {
    to: "/hr/employeelist",
    icon: Users,
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.2)",
    title: "Employés",
    desc: "Gérer les membres de votre équipe",
  },
  {
    to: "/hr/offres",
    icon: Briefcase,
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
    title: "Offres d'emploi",
    desc: "Publier et gérer vos offres",
  },
  {
    to: "/hr/candidatures",
    icon: FileText,
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(5,150,105,0.2)",
    title: "Candidatures",
    desc: "Examiner et traiter les dossiers",
  },
  {
    to: "/hr/conges",
    icon: Palmtree,
    color: "#d97706",
    bg: "rgba(217,119,6,0.08)",
    border: "rgba(217,119,6,0.2)",
    title: "Congés",
    desc: "Approuver les demandes de congé",
  },
  {
    to: "/hr/plaintes",
    icon: Megaphone,
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    title: "Plaintes",
    desc: "Répondre aux signalements",
  },
];

export default function AcceuilH() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <>
      <HNavbar />

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e293b 100%)",
          padding: "64px 24px 80px",
          position: "relative", overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(59,130,246,0.07)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(139,92,246,0.06)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(59,130,246,0.15)", color: "#60a5fa",
              borderRadius: 20, padding: "5px 16px", fontSize: 12,
              fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              marginBottom: 20,
            }}>
              Portail Ressources Humaines
            </span>

            <h1 style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800, color: "#fff", margin: "0 0 16px",
              lineHeight: 1.2,
            }}>
              Bienvenue{user?.nom ? `, ${user.nom}` : ""} 
            </h1>

            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.55)", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
              Gérez vos talents, suivez les performances et pilotez tous vos processus RH depuis un seul espace.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: 860, margin: "-32px auto 0", padding: "0 24px 60px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 18,
          }}>
            {cards.map(({ to, icon: Icon, color, bg, border, title, desc }) => (
              <Link key={to} to={to} style={{ textDecoration: "none" }}>
                <div style={{
                  background: "#fff", borderRadius: 18,
                  padding: "24px", border: `1.5px solid ${border}`,
                  boxShadow: "0 4px 20px rgba(30,60,120,0.07)",
                  transition: "transform 0.18s, box-shadow 0.18s",
                  cursor: "pointer",
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,60,120,0.13)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(30,60,120,0.07)";
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: bg, display: "flex",
                    alignItems: "center", justifyContent: "center", marginBottom: 16,
                  }}>
                    <Icon size={22} color={color} />
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: "0 0 6px" }}>
                    {title}
                  </h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.5 }}>
                    {desc}
                  </p>

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