import React, { useState, useEffect } from "react";
import { Calendar, Palmtree, CheckCircle, Clock, XCircle, Plus, X, AlertTriangle } from "lucide-react";
import ENavbar from "components/Navbars/ENavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb" },
  APPROUVE:   { label: "Approuvé",   color: "#059669", bg: "#ecfdf5" },
  REFUSE:     { label: "Refusé",     color: "#ef4444", bg: "#fef2f2" },
};

function StatCard({ label, value, color, bg, icon: Icon }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 16px rgba(30,60,120,0.06)", borderTop: `3px solid ${color}`, display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={22} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, fontWeight: 500 }}>{label}</div>
      </div>
    </div>
  );
}

function ConfirmModal({ onConfirm, onCancel, loading }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, maxWidth: 400, width: "100%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <AlertTriangle size={28} color="#ef4444" />
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>Annuler ce congé ?</h3>
        <p style={{ color: "#6b7280", marginBottom: 32, lineHeight: 1.6 }}>Cette action est irréversible.</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 11, borderRadius: 10, border: "2px solid #e5e7eb", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer", fontSize: 14 }}>Garder</button>
          <button onClick={onConfirm} disabled={loading} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: "#ef4444", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            {loading ? "Annulation..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CongeCard({ c, onCancel }) {
  const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9" };
  const debut  = new Date(c.dateDebut).toLocaleDateString("fr-FR");
  const fin    = new Date(c.dateFin).toLocaleDateString("fr-FR");
  const jours  = Math.ceil((new Date(c.dateFin) - new Date(c.dateDebut)) / (1000 * 60 * 60 * 24));
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 16px rgba(30,60,120,0.06)", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", borderLeft: `3px solid ${statut.color}` }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: statut.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Palmtree size={20} color={statut.color} />
      </div>
      <div style={{ flex: 1, minWidth: 150 }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>Du {debut} au {fin}</p>
        <p style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>
          <span style={{ fontWeight: 600 }}>{jours} jour{jours > 1 ? "s" : ""}</span> · Demandé le {new Date(c.createdAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, whiteSpace: "nowrap" }}>{statut.label}</span>
      {c.statut === "EN_ATTENTE" && (
        <button onClick={() => onCancel(c._id)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#fef2f2", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
          <X size={13} /> Annuler
        </button>
      )}
    </div>
  );
}

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

export default function Conge() {
  const [conges, setConges]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState({ dateDebut: "", dateFin: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState("");
  const [confirmId, setConfirmId]     = useState(null);
  const [cancelingId, setCancelingId] = useState(null);
  const [toast, setToast]             = useState(null);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchConges = () => {
    setLoading(true);
    api.get("/employee/conges").then(res => setConges(res.data.conges || [])).catch(() => showToast("Erreur chargement congés", "error")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchConges(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try {
      await api.post("/employee/conges", form);
      showToast("Demande de congé envoyée !");
      setForm({ dateDebut: "", dateFin: "" }); setShowForm(false); fetchConges();
    } catch (err) { setFormError(err.response?.data?.message || "Erreur lors de la demande"); }
    finally { setFormLoading(false); }
  };

  const handleCancel = async (id) => {
    setCancelingId(id);
    try { await api.delete(`/employee/conges/${id}`); showToast("Congé annulé"); fetchConges(); }
    catch (err) { showToast(err.response?.data?.message || "Erreur annulation", "error"); }
    finally { setCancelingId(null); setConfirmId(null); }
  };

  return (
    <>
      <ENavbar />
      <Toast toast={toast} />
      {confirmId && <ConfirmModal onConfirm={() => handleCancel(confirmId)} onCancel={() => setConfirmId(null)} loading={!!cancelingId} />}

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#2e1065 60%,#1e293b 100%)", padding: "120px 24px 100px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(124,58,237,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(124,58,237,0.15)", color: "#a78bfa", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail Employé
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Mes Congés</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>{conges.length} demande{conges.length !== 1 ? "s" : ""} au total</p>
              </div>
              <button onClick={() => { setShowForm(!showForm); setFormError(""); }}
                style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: showForm ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg,#7c3aed,#6d28d9)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                {showForm ? <><X size={15} /> Annuler</> : <><Plus size={15} /> Nouvelle demande</>}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "-48px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total"      value={conges.length}                                       color="#7c3aed" bg="rgba(124,58,237,0.08)" icon={Calendar} />
            <StatCard label="Approuvés"  value={conges.filter(c => c.statut === "APPROUVE").length}  color="#059669" bg="#ecfdf5"               icon={CheckCircle} />
            <StatCard label="En attente" value={conges.filter(c => c.statut === "EN_ATTENTE").length} color="#d97706" bg="#fffbeb"               icon={Clock} />
          </div>

          {/* Form */}
          {showForm && (
            <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 4px 24px rgba(30,60,120,0.08)", marginBottom: 28, border: "1px solid #e8edf5" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Palmtree size={18} color="#7c3aed" /> Nouvelle demande de congé
              </h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <XCircle size={14} /> {formError}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={labelStyle}>Date de début *</label>
                    <input type="date" value={form.dateDebut} onChange={e => setForm({ ...form, dateDebut: e.target.value })} required style={inputStyle} min={new Date().toISOString().split("T")[0]} />
                  </div>
                  <div>
                    <label style={labelStyle}>Date de fin *</label>
                    <input type="date" value={form.dateFin} onChange={e => setForm({ ...form, dateFin: e.target.value })} required style={inputStyle} min={form.dateDebut || new Date().toISOString().split("T")[0]} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={15} /> {formLoading ? "Envoi..." : "Envoyer la demande"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {Array(3).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 90, opacity: 0.5 }} />)}
            </div>
          ) : conges.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "64px 24px", textAlign: "center", boxShadow: "0 2px 16px rgba(30,60,120,0.06)" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Palmtree size={26} color="#d97706" />
              </div>
              <p style={{ color: "#1a2340", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Aucune demande de congé</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Cliquez sur "Nouvelle demande" pour commencer</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {conges.map(c => <CongeCard key={c._id} c={c} onCancel={setConfirmId} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}