import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar.js";
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
  TRAITEE:    { label: "Traitée",    color: "#059669", bg: "#ecfdf5" },
};

export default function Plaintes() {
  const [plaintes, setPlaintes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [reponse, setReponse] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPlaintes = () => {
    setLoading(true);
    api.get("/rh/plaintes")
      .then(res => setPlaintes(res.data.plaintes || []))
      .catch(() => showToast("Erreur chargement plaintes", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlaintes(); }, []);

  const handleReply = async () => {
    if (!reponse.trim()) return;
    setReplyLoading(true);
    try {
      await api.put(`/rh/plaintes/${replyModal._id}/reply`, { reponse });
      showToast("Réponse envoyée avec succès");
      setReplyModal(null);
      setReponse("");
      fetchPlaintes();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally {
      setReplyLoading(false);
    }
  };

  const filtered = filter === "ALL" ? plaintes : plaintes.filter(p => p.statut === filter);

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {/* Reply Modal */}
      {replyModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px", maxWidth: 540, width: "100%", boxShadow: "0 8px 40px rgba(0,0,0,0.2)", position: "relative" }}>
            <button onClick={() => { setReplyModal(null); setReponse(""); }} style={{ position: "absolute", top: 16, right: 16, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", fontSize: 16 }}>✕</button>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>💬 Répondre à la plainte</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>De : {replyModal.employeId?.name} · {replyModal.employeId?.departement}</p>

            <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px", marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Plainte :</p>
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{replyModal.description}</p>
            </div>

            <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
              Votre réponse *
            </label>
            <textarea
              value={reponse}
              onChange={e => setReponse(e.target.value)}
              rows={4}
              placeholder="Rédigez votre réponse..."
              style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", resize: "vertical", boxSizing: "border-box", marginBottom: 20 }}
            />
            <button onClick={handleReply} disabled={replyLoading || !reponse.trim()} style={{
              width: "100%", padding: "12px", borderRadius: 12, border: "none",
              background: reponse.trim() ? "linear-gradient(135deg, #2563eb, #1d4ed8)" : "#e2e8f0",
              color: reponse.trim() ? "#fff" : "#94a3b8",
              fontWeight: 700, fontSize: 15, cursor: reponse.trim() ? "pointer" : "not-allowed",
            }}>
              {replyLoading ? "Envoi..." : "📨 Envoyer la réponse"}
            </button>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Plaintes des Employés</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{plaintes.length} plainte{plaintes.length !== 1 ? "s" : ""}</p>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {[
              { key: "ALL", label: "Toutes" },
              { key: "EN_ATTENTE", label: "En attente" },
              { key: "TRAITEE", label: "Traitées" },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding: "8px 18px", borderRadius: 20, border: "1.5px solid",
                borderColor: filter === f.key ? "#2563eb" : "#e2e8f0",
                background: filter === f.key ? "#eff6ff" : "#fff",
                color: filter === f.key ? "#2563eb" : "#6b7280",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}>
                {f.label} {f.key === "ALL" ? `(${plaintes.length})` : `(${plaintes.filter(p => p.statut === f.key).length})`}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 120, opacity: 0.5 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#94a3b8" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p>Aucune plainte</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {filtered.map(p => {
                const statut = statutConfig[p.statut] || { label: p.statut, color: "#6b7280", bg: "#f1f5f9" };
                return (
                  <div key={p._id} style={{ background: "#fff", borderRadius: 16, padding: "24px", boxShadow: "0 2px 16px rgba(30,60,120,0.07)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14, flexWrap: "wrap" }}>
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#ef4444", fontSize: 16, flexShrink: 0 }}>
                        {(p.employeId?.name || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>{p.employeId?.name}</p>
                        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>🏢 {p.employeId?.departement || "—"} · {new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>
                        {statut.label}
                      </span>
                    </div>

                    <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 16px", marginBottom: p.reponse ? 12 : 0 }}>
                      <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{p.description}</p>
                    </div>

                    {p.reponse && (
                      <div style={{ background: "#ecfdf5", borderRadius: 10, padding: "12px 16px", marginTop: 10 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "#059669", marginBottom: 4 }}>✅ Votre réponse :</p>
                        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{p.reponse}</p>
                      </div>
                    )}

                    {p.statut === "EN_ATTENTE" && (
                      <button onClick={() => { setReplyModal(p); setReponse(""); }} style={{
                        marginTop: 14, padding: "9px 20px", borderRadius: 10, border: "none",
                        background: "#eff6ff", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: "pointer",
                      }}>
                        💬 Répondre
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