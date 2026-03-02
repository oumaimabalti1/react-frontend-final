import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar";
import api from "services/api";

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: toast.type === "error" ? "#ef4444" : "#10b981",
      color: "#fff", borderRadius: 12, padding: "14px 24px",
      fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    }}>
      {toast.type === "error" ? "❌" : "✅"} {toast.msg}
    </div>
  );
}

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  APPROUVE:   { label: "Approuvé",   color: "#059669", bg: "#ecfdf5" },
  REFUSE:     { label: "Refusé",     color: "#ef4444", bg: "#fef2f2" },
};

export default function Conges() {
  const [conges, setConges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchConges = () => {
    setLoading(true);
    api.get("/rh/conges")
      .then(res => setConges(res.data.conges || []))
      .catch(() => showToast("Erreur chargement congés", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchConges(); }, []);

  const handleAction = async (id, action) => {
    setActionId(id + action);
    try {
      await api.put(`/rh/conges/${id}/${action}`);
      showToast(action === "approve" ? "Congé approuvé ✓" : "Congé refusé");
      fetchConges();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally {
      setActionId(null);
    }
  };

  const filtered = filter === "ALL" ? conges : conges.filter(c => c.statut === filter);

  return (
    <>
      <Navbar />
      <Toast toast={toast} />
      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Demandes de Congé</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{conges.length} demande{conges.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { key: "ALL", label: "Toutes" },
              { key: "EN_ATTENTE", label: "En attente" },
              { key: "APPROUVE", label: "Approuvées" },
              { key: "REFUSE", label: "Refusées" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "8px 18px", borderRadius: 20, border: "1.5px solid",
                borderColor: filter === f.key ? "#2563eb" : "#e2e8f0",
                background: filter === f.key ? "#eff6ff" : "#fff",
                color: filter === f.key ? "#2563eb" : "#6b7280",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>
                {f.label} {f.key === "ALL" ? `(${conges.length})` : `(${conges.filter(c => c.statut === f.key).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Array(4).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 110, opacity: 0.5 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🏖️</div>
              <p>Aucune demande de congé</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map(c => {
                const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
                return (
                  <div key={c._id} style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 16px rgba(30,60,120,0.07)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                    <div style={{ width: 42, height: 42, borderRadius: 11, background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#d97706", fontSize: 16, flexShrink: 0 }}>
                      {(c.employeId?.name || "?")[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 150 }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>{c.employeId?.name}</p>
                      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>🏢 {c.employeId?.departement || "—"}</p>
                      <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                          Du {new Date(c.dateDebut).toLocaleDateString("fr-FR")} au {new Date(c.dateFin).toLocaleDateString("fr-FR")}
                        </p>
                        {c.motif && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>· {c.motif}</p>}
                      </div>
                    </div>
                    <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                      {statut.label}
                    </span>
                    {c.statut === "EN_ATTENTE" && (
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleAction(c._id, "approve")} disabled={actionId === c._id + "approve"} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#ecfdf5", color: "#059669", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                          {actionId === c._id + "approve" ? "..." : "✓ Approuver"}
                        </button>
                        <button onClick={() => handleAction(c._id, "refuse")} disabled={actionId === c._id + "refuse"} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                          {actionId === c._id + "refuse" ? "..." : "✕ Refuser"}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}