import React, { useState, useEffect } from "react";
import { MessageSquare, CheckCircle, XCircle, Clock, Send, X } from "lucide-react";
import HNavbar from "components/Navbars/HNavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  TRAITEE:    { label: "Traitée",    color: "#059669", bg: "#ecfdf5" },
};

function ReplyModal({ plainte, onClose, onSent }) {
  const [reponse, setReponse]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [toast, setToast]         = useState(null);
  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleReply = async () => {
    if (!reponse.trim()) return;
    setLoading(true);
    try {
      await api.put(`/rh/plaintes/${plainte._id}`, { reponse });
      onSent();
    } catch (err) { showToast(err.response?.data?.message || "Erreur", "error"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Toast toast={toast} />
      <div style={{ background: "#fff", borderRadius: 20, padding: "32px 36px", width: "100%", maxWidth: 520, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, background: "#f1f5f9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <X size={16} color="#64748b" />
        </button>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a2340", marginBottom: 4 }}>Répondre à la plainte</h2>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
          De : <strong>{plainte.employeId?.nom || plainte.employeId?.name || "—"}</strong>
          {plainte.employeId?.departement ? ` · ${plainte.employeId.departement}` : ""}
        </p>

        {/* Sujet */}
        {plainte.sujet && (
          <div style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Sujet</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1a2340", margin: 0 }}>{plainte.sujet}</p>
          </div>
        )}

        {/* Contenu de la plainte — message OU description selon backend */}
        <div style={{ background: "#f8fafc", borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Message</p>
          <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
            {plainte.message || plainte.description || "—"}
          </p>
        </div>

        <label style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", display: "block", marginBottom: 6 }}>Votre réponse *</label>
        <textarea
          value={reponse}
          onChange={e => setReponse(e.target.value)}
          rows={4}
          placeholder="Rédigez votre réponse..."
          style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", resize: "vertical", boxSizing: "border-box", marginBottom: 16 }}
        />
        <button onClick={handleReply} disabled={loading || !reponse.trim()}
          style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: !reponse.trim() ? "#e2e8f0" : "linear-gradient(135deg,#3b82f6,#2563eb)", color: !reponse.trim() ? "#94a3b8" : "#fff", fontWeight: 700, fontSize: 14, cursor: !reponse.trim() ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Send size={15} /> {loading ? "Envoi..." : "Envoyer la réponse"}
        </button>
      </div>
    </div>
  );
}

function PlainteCard({ p, onReply }) {
  const statut = statutConfig[p.statut] || { label: p.statut, color: "#6b7280", bg: "#f1f5f9" };
  const initiale = (p.employeId?.nom || p.employeId?.name || "?")[0].toUpperCase();
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(30,60,120,0.07)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#ef4444", flexShrink: 0 }}>
          {initiale}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: "#1a2340", margin: 0 }}>{p.employeId?.nom || p.employeId?.name || "—"}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {p.employeId?.departement || "—"} · {new Date(p.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700 }}>{statut.label}</span>
      </div>

      {/* Sujet */}
      {p.sujet && (
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1a2340", marginBottom: 6 }}>{p.sujet}</p>
      )}

      {/* Contenu — message OU description */}
      <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px", marginBottom: p.reponse || p.statut === "EN_ATTENTE" ? 12 : 0 }}>
        <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>
          {p.message || p.description || "—"}
        </p>
      </div>

      {/* Réponse RH */}
      {p.reponse && (
        <div style={{ background: "#ecfdf5", borderRadius: 10, padding: "12px 14px", border: "1px solid #86efac", marginBottom: 12, display: "flex", gap: 8 }}>
          <CheckCircle size={15} color="#059669" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", marginBottom: 4 }}>Réponse RH</p>
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, margin: 0 }}>{p.reponse}</p>
          </div>
        </div>
      )}

      {p.statut === "EN_ATTENTE" && (
        <button onClick={() => onReply(p)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "rgba(59,130,246,0.08)", color: "#2563eb", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <MessageSquare size={14} /> Répondre
        </button>
      )}
    </div>
  );
}

export default function Plaintes() {
  const [plaintes, setPlaintes]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [replyModal, setReplyModal] = useState(null);
  const [filter, setFilter]       = useState("ALL");
  const [toast, setToast]         = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchPlaintes = () => {
    setLoading(true);
    api.get("/rh/plaintes").then(res => setPlaintes(res.data.plaintes || [])).catch(() => showToast("Erreur chargement plaintes", "error")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlaintes(); }, []);

  const handleSent = () => {
    showToast("Réponse envoyée avec succès");
    setReplyModal(null);
    fetchPlaintes();
  };

  const filtered = filter === "ALL" ? plaintes : plaintes.filter(p => p.statut === filter);

  const filterBtn = (key, label) => {
    const count = key === "ALL" ? plaintes.length : plaintes.filter(p => p.statut === key).length;
    const active = filter === key;
    return (
      <button key={key} onClick={() => setFilter(key)} style={{ padding: "8px 18px", borderRadius: 20, border: active ? "none" : "1.5px solid #e2e8f0", background: active ? "#1a2340" : "#fff", color: active ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
        {label} ({count})
      </button>
    );
  };

  return (
    <>
      <HNavbar />
      <Toast toast={toast} />
      {replyModal && <ReplyModal plainte={replyModal} onClose={() => setReplyModal(null)} onSent={handleSent} />}

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Plaintes des Employés</h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{plaintes.length} plainte{plaintes.length !== 1 ? "s" : ""}</p>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {filterBtn("ALL", "Toutes")}
            {filterBtn("EN_ATTENTE", "En attente")}
            {filterBtn("TRAITEE", "Traitées")}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 14, height: 120, opacity: 0.4 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "60px 24px", textAlign: "center", boxShadow: "0 2px 16px rgba(30,60,120,0.07)" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle size={24} color="#059669" />
              </div>
              <p style={{ color: "#94a3b8", fontSize: 15 }}>Aucune plainte</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {filtered.map(p => <PlainteCard key={p._id} p={p} onReply={setReplyModal} />)}
            </div>
          )}

        </div>
      </main>
    </>
  );
}