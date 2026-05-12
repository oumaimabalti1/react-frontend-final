import React from "react";
import CNavbar from "components/Navbars/CNavbar.js";
import NavCard from "components/Cards/NavCards.js";
import { candidatCards } from "components/Cards/PortalCards.js";

export default function AcceuilC() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <CNavbar />
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero - light */}
        <div style={{ padding: "48px 24px 60px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <span style={{
              display: "inline-block", background: "#f0fdfa", color: "#0891b2",
              border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 16
            }}>
              Portail Candidat
            </span>
            <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 12px", lineHeight: 1.2 }}>
              Bienvenue{user?.nom ? `, ${user.nom}` : ""}
            </h1>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
              Explorez les opportunités d'emploi, gérez vos candidatures et déposez votre CV en toute simplicité.
            </p>
          </div>
        </div>

        {/* Cards */}
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px 60px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 18 }}>
            {candidatCards.map(card => <NavCard key={card.to} {...card} />)}
          </div>
        </div>

      </main>
    </>
  );
}