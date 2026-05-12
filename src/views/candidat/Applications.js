import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "components/Navbars/CNavbar.js";
import api from "services/api";
import { Briefcase, Inbox, AlertCircle, CheckCircle, XCircle, Building2, Calendar, MessageSquare } from "lucide-react";

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div style={{
      position: "fixed", top: 24, right: 24, zIndex: 9999,
      background: isError ? "#fef2f2" : "#f0fdf4",
      border: `1px solid ${isError ? "#fecaca" : "#bbf7d0"}`,
      color: isError ? "#dc2626" : "#059669",
      borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14,
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      display: "flex", alignItems: "center", gap: 8
    }}>
      {isError ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
    </div>
  );
}

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  ACCEPTEE:   { label: "Acceptée",   color: "#059669", bg: "#ecfdf5" },
  REFUSEE:    { label: "Refusée",    color: "#ef4444", bg: "#fef2f2" },
};

export default function Applications() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

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
    try { await api.delete(`/candidat/candidatures/${id}`); showToast("Candidature annulée avec succès"); fetchCandidatures(); }
    catch (err) { showToast(err.response?.data?.message || "Erreur lors de l'annulation", "error"); }
    finally { setCanceling(null); setConfirmId(null); }
  };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {confirmId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 40px", maxWidth: 400, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <AlertCircle size={48} color="#f59e0b" style={{ marginBottom: 12 }} />
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Annuler la candidature ?</h3>
            <p style={{ color: "#64748b", marginBottom: 28 }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={() => setConfirmId(null)} style={{ padding: "10px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, cursor: "pointer" }}>Garder</button>
              <button onClick={() => handleAnnuler(confirmId)} disabled={!!canceling} style={{ padding: "10px 24px", borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                {canceling ? "Annulation..." : "Annuler la candidature"}
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ marginBottom: 32, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
            <div>
              <span style={{ display: "inline-block", background: "#f0fdfa", color: "#0891b2", border: "1px solid #99f6e4", borderRadius: 8, padding: "4px 12px", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Suivi</span>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>Mes Candidatures</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>{candidatures.length} candidature{candidatures.length !== 1 ? "s" : ""}</p>
            </div>
            <Link to="/candidat/offre" style={{
              padding: "10px 20px", borderRadius: 10, background: "#0891b2",
              color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none",
              boxShadow: "0 2px 8px rgba(8,145,178,0.3)"
            }}>
              + Voir les offres
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Array(4).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 100, border: "1px solid #f1f5f9" }} />)}
            </div>
          ) : candidatures.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
              <Inbox size={48} color="#94a3b8" style={{ marginBottom: 16 }} />
              <p style={{ fontSize: 16, marginBottom: 20 }}>Vous n'avez pas encore postulé à une offre</p>
              <Link to="/candidat/offre" style={{ padding: "12px 28px", borderRadius: 12, background: "#0891b2", color: "#fff", fontWeight: 700, textDecoration: "none" }}>Voir les offres</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {candidatures.map(c => {
                const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
                return (
                  <div key={c._id} style={{
                    background: "#fff", borderRadius: 16, padding: "24px",
                    border: "1px solid #f1f5f9", borderLeft: `4px solid ${statut.color}`,
                    display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap",
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Briefcase size={22} color="#0891b2" />
                    </div>

                    <div style={{ flex: 1, minWidth: 160 }}>
                      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{c.offreId?.titre || "Offre supprimée"}</h3>
                      <p style={{ fontSize: 13, color: "#64748b", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                        <Building2 size={14} /> {c.offreId?.entrepriseId?.nom || "—"} · {c.offreId?.entrepriseId?.secteur || "—"}
                      </p>
                      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Postulé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}</p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                      <span style={{ background: statut.bg, color: statut.color, borderRadius: 8, padding: "5px 14px", fontSize: 13, fontWeight: 700 }}>{statut.label}</span>
                      {c.statut === "ACCEPTEE" && c.dateInterview && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 10, padding: "8px 14px" }}>
                          <Calendar size={14} color="#059669" />
                          <div>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", margin: 0, textTransform: "uppercase" }}>Entretien</p>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#065f46", margin: 0 }}>
                              {new Date(c.dateInterview).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} à {new Date(c.dateInterview).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      )}
                      {c.messageRH && (
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 6, background: c.statut === "ACCEPTEE" ? "#ecfdf5" : "#fef2f2", border: `1px solid ${c.statut === "ACCEPTEE" ? "#bbf7d0" : "#fecaca"}`, borderRadius: 10, padding: "8px 14px", maxWidth: 280 }}>
                          <MessageSquare size={14} color={c.statut === "ACCEPTEE" ? "#059669" : "#ef4444"} style={{ marginTop: 2, flexShrink: 0 }} />
                          <p style={{ fontSize: 13, color: c.statut === "ACCEPTEE" ? "#065f46" : "#991b1b", margin: 0, lineHeight: 1.5 }}>{c.messageRH}</p>
                        </div>
                      )}
                    </div>

                    {c.statut === "EN_ATTENTE" && (
                      <button onClick={() => setConfirmId(c._id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Annuler</button>
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