import React, { useState, useEffect } from "react";
import {
  UserCheck, UserX, Briefcase, FileText, CheckCircle, XCircle,
  Clock, Download, ChevronDown, ChevronUp, Mail, Filter
} from "lucide-react";
import HNavbar from "components/Navbars/HNavbar.js";
import api from "services/api";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const statutConfig = {
  EN_ATTENTE: { label: "En attente", color: "#d97706", bg: "#fffbeb", icon: Clock },
  ACCEPTEE:   { label: "Acceptée",   color: "#059669", bg: "#ecfdf5", icon: CheckCircle },
  REFUSEE:    { label: "Refusée",    color: "#ef4444", bg: "#fef2f2", icon: XCircle },
};

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

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

function CandidatureCard({ c, onAction, actionId }) {
  const [expanded, setExpanded] = useState(false);
  const statut = statutConfig[c.statut] || { label: c.statut, color: "#6b7280", bg: "#f1f5f9", icon: Clock };
  const StatutIcon = statut.icon;
  const initiale  = (c.candidatId?.name || "?")[0].toUpperCase();
  const accepting = actionId === c._id + "accept";
  const refusing  = actionId === c._id + "refuse";

  return (
    <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(30,60,120,0.06)", borderLeft: `3px solid ${statut.color}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 24px", flexWrap: "wrap" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(59,130,246,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#3b82f6", flexShrink: 0 }}>
          {initiale}
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>{c.candidatId?.name || "—"}</p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
            <Mail size={11} /> {c.candidatId?.email || "—"}
          </p>
          <p style={{ fontSize: 12, color: "#64748b", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
            <Briefcase size={11} /> {c.offreId?.titre || "—"}
          </p>
          {c.scoreIA > 0 && (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 4, padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    background: c.scoreIA >= 70 ? "#ecfdf5" : c.scoreIA >= 40 ? "#fffbeb" : "#fef2f2",
    color: c.scoreIA >= 70 ? "#059669" : c.scoreIA >= 40 ? "#d97706" : "#ef4444"
  }}>
    Score : {c.scoreIA}%
  </div>
)}
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>
          {new Date(c.createdAt).toLocaleDateString("fr-FR")}
        </p>
        <span style={{ background: statut.bg, color: statut.color, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap" }}>
          <StatutIcon size={12} /> {statut.label}
        </span>
       
        {c.statut === "EN_ATTENTE" && (
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => onAction(c._id, "accept")} disabled={accepting || refusing}
              style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: accepting ? "#e2e8f0" : "#ecfdf5", color: accepting ? "#94a3b8" : "#059669", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <UserCheck size={14} /> {accepting ? "..." : "Accepter"}
            </button>
            <button onClick={() => onAction(c._id, "refuse")} disabled={accepting || refusing}
              style={{ padding: "7px 14px", borderRadius: 8, border: "none", background: refusing ? "#e2e8f0" : "#fef2f2", color: refusing ? "#94a3b8" : "#ef4444", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <UserX size={14} /> {refusing ? "..." : "Refuser"}
            </button>
          </div>
        )}
        <button onClick={() => setExpanded(!expanded)}
          style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
      {expanded && (
        <div style={{ borderTop: "1px solid #f1f5f9", padding: "20px 24px", background: "#fafbfc", display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Description du poste</p>
            <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0 }}>{c.offreId?.description || "Aucune description disponible"}</p>
          </div>
          <div style={{ minWidth: 200 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>CV du candidat</p>
            {c.cv ? (
              <a href={`${BASE_URL}/images/${c.cv.fichier}`} target="_blank" rel="noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10, background: "linear-gradient(135deg,#3b82f6,#2563eb)", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none" }}>
                <Download size={15} /> Télécharger le CV
              </a>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: "#f1f5f9", color: "#94a3b8", fontSize: 13 }}>
                <FileText size={15} /> Aucun CV déposé
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Candidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [actionId, setActionId]         = useState(null);
  const [toast, setToast]               = useState(null);
  const [filter, setFilter]             = useState("ALL");
  const [modal, setModal]               = useState(null);
  const [dateInterview, setDateInterview] = useState("");
  const [messageRH, setMessageRH]         = useState("");

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchCandidatures = () => {
    setLoading(true);
    api.get("/rh/candidatures")
      .then(res => setCandidatures(res.data.candidatures || []))
      .catch(() => showToast("Erreur chargement candidatures", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCandidatures(); }, []);

  const handleAction = (id, action) => { setModal({ id, action }); setDateInterview(""); setMessageRH(""); };

  const handleConfirm = async () => {
    if (modal.action === "accept" && !dateInterview) { showToast("Veuillez choisir une date d'entretien", "error"); return; }
    const { id, action } = modal;
    setModal(null);
    setActionId(id + action);
    try {
      const body = { messageRH };
      if (action === "accept") body.dateInterview = dateInterview;
      await api.put(`/rh/candidatures/${id}/${action}`, body);
      showToast(action === "accept" ? "Candidature acceptée !" : "Candidature refusée");
      fetchCandidatures();
    } catch (err) { showToast(err.response?.data?.message || "Erreur", "error"); }
    finally { setActionId(null); }
  };

  const filtered = filter === "ALL" ? candidatures : candidatures.filter(c => c.statut === filter);

  const filterBtn = (key, label) => {
    const count  = key === "ALL" ? candidatures.length : candidatures.filter(c => c.statut === key).length;
    const active = filter === key;
    return (
      <button key={key} onClick={() => setFilter(key)}
        style={{ padding: "8px 18px", borderRadius: 20, border: active ? "none" : "1.5px solid #e2e8f0", background: active ? "#1a2340" : "#fff", color: active ? "#fff" : "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
        {label} ({count})
      </button>
    );
  };

  return (
    <>
      <HNavbar />
      <Toast toast={toast} />

      {/* Action modal */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 36, width: "100%", maxWidth: 440, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a2340", marginBottom: 6 }}>
              {modal.action === "accept" ? "Accepter la candidature" : "Refuser la candidature"}
            </h3>
            <p style={{ fontSize: 14, color: "#94a3b8", marginBottom: 24 }}>
              {modal.action === "accept" ? "Définissez la date d'entretien et un message pour le candidat." : "Vous pouvez laisser un message d'explication au candidat."}
            </p>
            {modal.action === "accept" && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Date et heure de l'entretien *</label>
                <input type="datetime-local" value={dateInterview} onChange={e => setDateInterview(e.target.value)}
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
              </div>
            )}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
                Message pour le candidat <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optionnel)</span>
              </label>
              <textarea value={messageRH} onChange={e => setMessageRH(e.target.value)} rows={3}
                placeholder={modal.action === "accept" ? "Ex: Merci pour votre candidature, nous avons le plaisir de vous inviter..." : "Ex: Merci pour votre candidature. Votre profil ne correspond pas à nos besoins actuels..."}
                style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }} />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModal(null)} style={{ flex: 1, padding: 11, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Annuler</button>
              <button onClick={handleConfirm} style={{ flex: 1, padding: 11, borderRadius: 10, border: "none", background: modal.action === "accept" ? "linear-gradient(135deg,#059669,#047857)" : "linear-gradient(135deg,#ef4444,#dc2626)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e293b 100%)", padding: "120px 24px 100px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(37,99,235,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(37,99,235,0.15)", color: "#93c5fd", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail RH
            </span>
            <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Candidatures reçues</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>{candidatures.length} candidature{candidatures.length !== 1 ? "s" : ""} au total</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1000, margin: "-48px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total"      value={candidatures.length}                                        color="#3b82f6" bg="rgba(59,130,246,0.08)" icon={Briefcase} />
            <StatCard label="En attente" value={candidatures.filter(c => c.statut === "EN_ATTENTE").length} color="#d97706" bg="#fffbeb"               icon={Clock} />
            <StatCard label="Acceptées"  value={candidatures.filter(c => c.statut === "ACCEPTEE").length}  color="#059669" bg="#ecfdf5"               icon={UserCheck} />
            <StatCard label="Refusées"   value={candidatures.filter(c => c.statut === "REFUSEE").length}   color="#ef4444" bg="#fef2f2"               icon={UserX} />
          </div>

          {/* Filters */}
          <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
            <Filter size={15} color="#94a3b8" />
            {filterBtn("ALL", "Toutes")}
            {filterBtn("EN_ATTENTE", "En attente")}
            {filterBtn("ACCEPTEE", "Acceptées")}
            {filterBtn("REFUSEE", "Refusées")}
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {Array(4).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 16, height: 80, opacity: 0.4 }} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 20, padding: "64px 24px", textAlign: "center", boxShadow: "0 2px 16px rgba(30,60,120,0.06)" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(59,130,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Briefcase size={26} color="#3b82f6" />
              </div>
              <p style={{ color: "#1a2340", fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Aucune candidature</p>
              <p style={{ color: "#94a3b8", fontSize: 13 }}>Les candidatures apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {filtered.map(c => <CandidatureCard key={c._id} c={c} onAction={handleAction} actionId={actionId} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}