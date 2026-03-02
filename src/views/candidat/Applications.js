import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "components/Navbars/CNavbar.js";
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
  EN_ATTENTE:  { label: "En attente",  color: "#d97706", bg: "#fffbeb" },
  ACCEPTEE:    { label: "Acceptée",    color: "#059669", bg: "#ecfdf5" },
  REFUSEE:     { label: "Refusée",     color: "#ef4444", bg: "#fef2f2" },
};

export default function Applications() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCandidatures = () => {
    setLoading(true);
    api.get("/candidat/candidatures")
      .then(res => setCandidatures(res.data.candidatures || []))
      .catch(() => showToast("Erreur chargement des candidatures", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCandidatures(); }, []);

  const handleAnnuler = async (id) => {
    setCanceling(id);
    try {
      await api.delete(`/candidat/candidatures/${id}`);
      showToast("Candidature annulée avec succès");
      fetchCandidatures();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur lors de l'annulation", "error");
    } finally {
      setCanceling(null);
      setConfirmId(null);
    }
  };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {/* Confirm Modal */}
      {confirmId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: "36px 40px",
            maxWidth: 400, width: "90%", textAlign: "center",
            boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>
              Annuler la candidature ?
            </h3>
            <p style={{ color: "#6b7280", marginBottom: 28 }}>
              Cette action est irréversible.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{
                padding: "10px 24px", borderRadius: 10, border: "2px solid #e5e7eb",
                background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer",
              }}>
                Garder
              </button>
              <button onClick={() => handleAnnuler(confirmId)} disabled={!!canceling} style={{
                padding: "10px 24px", borderRadius: 10, border: "none",
                background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer",
              }}>
                {canceling ? "Annulation..." : "Annuler la candidature"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          {/* Header */}
          <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a2340", margin: 0 }}>
                Mes Candidatures
              </h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
                {candidatures.length} candidature{candidatures.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link to="/candidat/offres" style={{
              padding: "10px 20px", borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none",
            }}>
              + Voir les offres
            </Link>
          </div>

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Array(4).fill(0).map((_, i) => (
                <div key={i} style={{ background: "#fff", borderRadius: 16, height: 100, opacity: 0.5 }} />
              ))}
            </div>
          ) : candidatures.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
              <p style={{ fontSize: 16, marginBottom: 20 }}>Vous n'avez pas encore postulé à une offre</p>
              <Link to="/candidat/offres" style={{
                padding: "12px 28px", borderRadius: 12,
                background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                color: "#fff", fontWeight: 700, textDecoration: "none",
              }}>
                Voir les offres
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {candidatures.map(c => {
                const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
                return (
                  <div key={c._id} style={{
                    background: "#fff", borderRadius: 16, padding: "24px",
                    boxShadow: "0 2px 16px rgba(30,60,120,0.07)",
                    display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                  }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "#eff6ff", display: "flex",
                      alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>💼</div>

                    <div style={{ flex: 1, minWidth: 160 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>
                        {c.offreId?.titre || "Offre supprimée"}
                      </h3>
                      <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
                        🏢 {c.offreId?.entrepriseId?.nom || "—"} · {c.offreId?.entrepriseId?.secteur || "—"}
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                        Postulé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>

                    {/* Statut */}
                    <span style={{
                      background: statut.bg, color: statut.color,
                      borderRadius: 20, padding: "6px 16px",
                      fontSize: 13, fontWeight: 700,
                    }}>
                      {statut.label}
                    </span>

                    {/* Annuler si EN_ATTENTE */}
                    {c.statut === "EN_ATTENTE" && (
                      <button
                        onClick={() => setConfirmId(c._id)}
                        style={{
                          padding: "8px 16px", borderRadius: 8, border: "none",
                          background: "#fef2f2", color: "#ef4444",
                          fontWeight: 600, fontSize: 13, cursor: "pointer",
                        }}
                      >
                        Annuler
                      </button>
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