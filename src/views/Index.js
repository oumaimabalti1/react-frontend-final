import React from "react";
import Navbar from "components/Navbars/FreeNavbar.js";
import { Link } from "react-router-dom";
import {
  UserPlus, BarChart3, Clock, BadgeCheck,
  Smile, TrendingUp, ArrowRight, Sparkles, Bot, FileSearch, BrainCircuit
} from "lucide-react";

const features = [
  { icon: UserPlus,   label: "Recrutement",          desc: "Publiez et gérez vos offres d'emploi avec génération IA automatique", color: "#0891b2" },
  { icon: BarChart3,  label: "Données RH",            desc: "Tableaux de bord et statistiques en temps réel", color: "#7c3aed" },
  { icon: Clock,      label: "Gestion du temps",      desc: "Congés, absences et suivi des demandes", color: "#059669" },
  { icon: BadgeCheck, label: "Sécurité",              desc: "JWT, bcrypt et contrôle d'accès par rôle (RBAC)", color: "#dc2626" },
  { icon: Smile,      label: "Expérience employé",    desc: "Portail dédié avec gestion des plaintes", color: "#ea580c" },
  { icon: TrendingUp, label: "Scoring IA",            desc: "Évaluation automatique des CV avec score 0-100", color: "#2563eb" },
];

const iaFeatures = [
  { icon: Sparkles,     title: "Génération IA",   desc: "Descriptions d'offres générées automatiquement via DeepSeek R1", color: "#7c3aed" },
  { icon: FileSearch,   title: "Scoring ATS",     desc: "Score de compatibilité CV/offre calculé par l'IA (0-100)", color: "#0891b2" },
  { icon: Bot,          title: "Chatbot RAG",     desc: "Assistant intelligent qui répond avec les vraies offres via ChromaDB", color: "#059669" },
];

export default function Index() {
  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      {/* HERO — split layout */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 32px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", minHeight: "85vh" }}>
        
        {/* Left — text */}
        <div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4",
            borderRadius: 8, padding: "6px 14px", fontSize: 13, fontWeight: 700,
            marginBottom: 24
          }}>
            <BrainCircuit size={14} /> 3 fonctionnalités IA intégrées
          </div>

          <h1 style={{
            fontSize: 52, fontWeight: 900, color: "#0f172a",
            lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.03em"
          }}>
            Gérez vos
            <br />
            <span style={{ color: "#0891b2" }}>ressources humaines</span>
            <br />
            intelligemment.
          </h1>

          <p style={{ fontSize: 17, color: "#64748b", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 460 }}>
            EasyRH automatise le recrutement, les congés et les plaintes avec l'intelligence artificielle. Une seule plateforme pour tous vos besoins RH.
          </p>

          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/Landing" style={{ textDecoration: "none" }}>
              <button style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 28px", borderRadius: 12, border: "none",
                background: "#0891b2", color: "#fff", fontSize: 15, fontWeight: 700,
                cursor: "pointer", boxShadow: "0 4px 16px rgba(8,145,178,0.3)",
                transition: "transform 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                Démarrer gratuitement <ArrowRight size={16} />
              </button>
            </Link>
            <Link to="/auth/login" style={{ textDecoration: "none" }}>
              <button style={{
                padding: "14px 28px", borderRadius: 12,
                border: "1.5px solid #e2e8f0", background: "white",
                color: "#475569", fontSize: 15, fontWeight: 600, cursor: "pointer"
              }}>
                Se connecter
              </button>
            </Link>
          </div>
        </div>

        {/* Right — IA features stack */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {iaFeatures.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={{
              display: "flex", gap: 16, alignItems: "flex-start",
              padding: "24px 28px", borderRadius: 16,
              background: "#fafafa", border: "1px solid #f1f5f9",
              transition: "transform 0.15s, box-shadow 0.15s"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateX(8px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: `${color}12`, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <Icon size={22} color={color} />
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            </div>
          ))}

          {/* Mini stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 8 }}>
            {[
              { value: "5", label: "Acteurs" },
              { value: "35", label: "User Stories" },
              { value: "3", label: "IA Features" },
            ].map(s => (
              <div key={s.label} style={{
                textAlign: "center", padding: "16px 8px", borderRadius: 12,
                background: "#f0fdfa", border: "1px solid #ccfbf1"
              }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: "#0891b2" }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2, fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES — horizontal scroll style */}
      <div style={{ background: "#f8fafc", padding: "80px 32px", borderTop: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 48 }}>
            <span style={{
              display: "inline-block", background: "#f0fdfa", color: "#0891b2",
              borderRadius: 8, padding: "5px 14px", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12
            }}>Fonctionnalités</span>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              Tout ce dont vous avez besoin
            </h2>
            <p style={{ color: "#94a3b8", fontSize: 15, margin: 0 }}>
              Une plateforme complète pour gérer l'ensemble de vos processus RH
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {features.map(({ icon: Icon, label, desc, color }) => (
              <div key={label} style={{
                background: "#fff", borderRadius: 16, padding: "28px 24px",
                borderLeft: `4px solid ${color}`,
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                transition: "transform 0.15s"
              }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
              >
                <Icon size={22} color={color} style={{ marginBottom: 12 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }}>{label}</h3>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: "80px 32px", textAlign: "center", background: "#fff", borderTop: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", margin: "0 0 12px" }}>
          Prêt à moderniser votre RH ?
        </h2>
        <p style={{ color: "#94a3b8", fontSize: 15, marginBottom: 32 }}>
          Rejoignez EasyRH et transformez votre gestion des ressources humaines.
        </p>
        <Link to="/contactus" style={{ textDecoration: "none" }}>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "14px 32px", borderRadius: 12, border: "none",
            background: "#0891b2", color: "#fff", fontSize: 15, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 4px 16px rgba(8,145,178,0.3)"
          }}>
            Nous contacter <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </div>
  );
}