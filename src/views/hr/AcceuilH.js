import React from "react";
import HNavbar from "components/Navbars/HNavbar.js";
import NavCard from "components/Cards/NavCards.js";
import { hrCards } from "components/Cards/PortalCards.js";

export default function AcceuilH() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <>
      <HNavbar />
      <main className="page-root">
        <div className="hero hero--rh">
          <div className="hero__blob hero__blob--top hero__blob--rh-top" />
          <div className="hero__blob hero__blob--bottom hero__blob--rh-bottom" />
          <div className="hero__inner">
            <span className="hero__badge hero__badge--rh">
              Portail Ressources Humaines
            </span>
            <h1 className="hero__title">
              Bienvenue{user?.nom ? `, ${user.nom}` : ""}
            </h1>
            <p className="hero__subtitle">
              Gérez vos talents, suivez les performances et pilotez tous vos processus RH depuis un seul espace.
            </p>
          </div>
        </div>
        <div className="navcards-grid">
          <div className="navcards-grid__inner">
            {hrCards.map(card => <NavCard key={card.to} {...card} />)}
          </div>
        </div>
      </main>
    </>
  );
}