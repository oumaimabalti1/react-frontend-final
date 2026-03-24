import React, { useState, useEffect } from "react";
import { Building2, UserCog, Users, ClipboardList, Globe } from "lucide-react";
import Sidebar from "components/Sidebar/Sidebar.js";
import DNavbar from "components/Navbars/DNavbar.js";
import StatCard from "components/Cards/StatCards.js";
import api from "services/api";

function ProgressBar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ flex: 1, minWidth: 160 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{label}</span>
        <span style={{ fontSize: 13, color: "#6b7280" }}>{pct}%</span>
      </div>
      <div style={{ background: "#f1f5f9", borderRadius: 99, height: 8 }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 99, transition: "width 0.6s ease" }} />
      </div>
      <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{value} utilisateur{value !== 1 ? "s" : ""}</div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/admin/statistiques")
      .then(res => setStats(res.data.statistiques))
      .catch(() => setError("Erreur chargement des statistiques"))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: "Entreprises",        value: stats?.entreprises, icon: Building2,     color: "#2563eb", bg: "#eff6ff" },
    { label: "Responsables RH",    value: stats?.rh,          icon: UserCog,       color: "#0891b2", bg: "#ecfeff" },
    { label: "Employés",           value: stats?.employees,   icon: Users,         color: "#059669", bg: "#ecfdf5" },
    { label: "Candidats",          value: stats?.candidats,   icon: ClipboardList, color: "#d97706", bg: "#fffbeb" },
    { label: "Total Utilisateurs", value: stats?.totalUsers,  icon: Globe,         color: "#7c3aed", bg: "#f5f3ff" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f8fafc" }}>
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <div style={{ marginLeft: 240, flex: 1, minHeight: "100vh", background: "#f8fafc" }}>
        <DNavbar />

        <div style={{ padding: "40px 36px" }}>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Vue d'ensemble</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>Statistiques globales de la plateforme EasyRH</p>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 12, padding: "14px 20px", color: "#dc2626", marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {loading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} style={{ background: "#fff", borderRadius: 16, height: 110, opacity: 0.4 }} />
                ))
              : cards.map((c, i) => <StatCard key={i} {...c} />)
            }
          </div>

          {stats && (
            <div style={{ marginTop: 40, background: "#fff", borderRadius: 16, padding: "28px 32px", boxShadow: "0 2px 16px rgba(30,60,120,0.07)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 20 }}>Répartition des utilisateurs</h2>
              <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
                <ProgressBar label="RH"        value={stats.rh}        total={stats.totalUsers} color="#0891b2" />
                <ProgressBar label="Employés"  value={stats.employees}  total={stats.totalUsers} color="#059669" />
                <ProgressBar label="Candidats" value={stats.candidats}  total={stats.totalUsers} color="#d97706" />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}