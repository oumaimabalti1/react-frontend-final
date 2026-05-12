import React from "react";
import HNavbar from "components/Navbars/HNavbar.js";
import NavCard from "components/Cards/NavCards.js";
import { hrCards } from "components/Cards/PortalCards.js";

export default function AcceuilH() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <HNavbar />
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "48px 24px 60px", position: "relative", overflow: "hidden" }}>
          
          
          <div style={{ maxWidth: 860, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail Ressources Humaines
            </span>
            <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.2 }}>
              Bienvenue{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
              Gérez vos talents, suivez les performances et pilotez tous vos processus RH depuis un seul espace.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
            {hrCards.map(card => <NavCard key={card.to} {...card} />)}
          </div>
        </div>

      </main>
    </>
  );
}