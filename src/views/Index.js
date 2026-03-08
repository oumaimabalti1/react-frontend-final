import React from "react";
import Navbar from "components/Navbars/FreeNavbar.js";
import { Link } from "react-router-dom";
import bgImage from "assets/img/bleu.jpeg";
import {
  UserPlus, BarChart3, Clock, BadgeCheck,
  Smile, TrendingUp, ArrowRight, Sparkles,
} from "lucide-react";

const features = [
  { icon: UserPlus,   label: "Recrutement",          desc: "Publiez et gérez vos offres d'emploi" },
  { icon: BarChart3,  label: "Données RH",            desc: "Tableaux de bord et statistiques" },
  { icon: Clock,      label: "Gestion du temps",      desc: "Congés, absences et planning" },
  { icon: BadgeCheck, label: "Sécurité",              desc: "Accès sécurisé par rôle" },
  { icon: Smile,      label: "Expérience employé",    desc: "Portail dédié pour chaque collaborateur" },
  { icon: TrendingUp, label: "Performance",           desc: "Suivez et améliorez les résultats" },
];

export default function Index() {
  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", fontFamily: "system-ui, sans-serif" }}>
      <Navbar />

      {/* HERO */}
      <div style={{
        position: "relative", overflow: "hidden",
        minHeight: "100vh", display: "flex", alignItems: "center",
      }}>
        {/* Background image with overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.15,
        }} />

        {/* Gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #0f172a 0%, rgba(15,23,42,0.85) 50%, #1e1b4b 100%)",
        }} />

        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 500, height: 500, borderRadius: "50%", background: "rgba(59,130,246,0.08)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(139,92,246,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "120px 24px 80px", position: "relative", width: "100%" }}>

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(59,130,246,0.12)", color: "#60a5fa",
              border: "1px solid rgba(59,130,246,0.25)",
              borderRadius: 20, padding: "6px 18px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
            }}>
              <Sparkles size={13} /> Plateforme RH intelligente
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: "clamp(32px, 6vw, 68px)",
            fontWeight: 900, color: "#fff",
            textAlign: "center", lineHeight: 1.1,
            margin: "0 0 24px", letterSpacing: "-0.02em",
          }}>
            La RH Moderne,{" "}
            <span style={{
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Simplifiée
            </span>
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: "clamp(15px, 2vw, 19px)",
            color: "rgba(255,255,255,0.5)",
            textAlign: "center", maxWidth: 580,
            margin: "0 auto 48px", lineHeight: 1.7,
          }}>
            Automatisez vos processus RH et concentrez-vous sur vos collaborateurs.
            EasyRH vous offre clarté, contrôle et productivité.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/Landing" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 50, border: "none",
                background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(37,99,235,0.5)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(37,99,235,0.35)"; }}
              >
                Commencer <ArrowRight size={16} />
              </button>
            </Link>

            <Link to="/auth/login" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 32px", borderRadius: 50,
                border: "1.5px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.05)",
                color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.8)"; }}
              >
                Se connecter
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div style={{
            display: "flex", gap: 40, justifyContent: "center",
            marginTop: 64, flexWrap: "wrap",
          }}>
            {[
              { value: "100%", label: "Sécurisé" },
              { value: "4",    label: "Types d'utilisateurs" },
              { value: "∞",    label: "Possibilités" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>

          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <span style={{
              display: "inline-block",
              background: "rgba(59,130,246,0.08)", color: "#2563eb",
              borderRadius: 20, padding: "5px 16px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 16,
            }}>
              Fonctionnalités
            </span>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, color: "#1a2340", margin: 0 }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 15, marginTop: 12 }}>
              Une plateforme complète pour gérer l'ensemble de vos processus RH
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {features.map(({ icon: Icon, label, desc }, i) => (
              <div key={label} style={{
                background: "#fff", borderRadius: 18, padding: "28px 24px",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 2px 16px rgba(30,60,120,0.05)",
                transition: "transform 0.18s, box-shadow 0.18s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(30,60,120,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(30,60,120,0.05)"; }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.1))",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16,
                }}>
                  <Icon size={22} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: "0 0 8px" }}>{label}</h3>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BOTTOM */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b, #0f172a)",
        padding: "80px 24px", textAlign: "center",
      }}>
        <h2 style={{ fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 800, color: "#fff", margin: "0 0 16px" }}>
          Prêt à moderniser votre RH ?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 36 }}>
          Rejoignez EasyRH et transformez votre gestion des ressources humaines.
        </p>
        <Link to="/contactus" style={{ textDecoration: "none" }}>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 36px", borderRadius: 50, border: "none",
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
          }}>
            Démarrer maintenant <ArrowRight size={16} />
          </button>
        </Link>
      </div>

    </div>
  );
}