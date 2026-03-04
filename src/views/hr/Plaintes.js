import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar.js";
import api from "services/api";

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function XIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ReplyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <div className={`toast ${isError ? "toast--error" : "toast--success"}`}>
      <span className={`toast__icon ${isError ? "toast__icon--error" : "toast__icon--success"}`}>
        {isError ? <XIcon /> : <CheckIcon />}
      </span>
      {toast.msg}
    </div>
  );
}

const statutConfig = {
  EN_ATTENTE: { label: "En attente", cls: "status-badge--pending" },
  TRAITEE:    { label: "Traitée",    cls: "status-badge--success" },
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

      {replyModal && (
        <div className="modal-backdrop">
          <div className="modal modal--md">
            <button
              onClick={() => { setReplyModal(null); setReponse(""); }}
              className="modal__close"
            >
              <XIcon />
            </button>

            <h2 className="modal__title">Répondre à la plainte</h2>
            <p className="modal__subtitle">
              De : {replyModal.employeId?.name} · {replyModal.employeId?.departement}
            </p>

            <div className="reply-complaint-box">
              <p className="reply-complaint-box__label">Plainte :</p>
              <p>{replyModal.description}</p>
            </div>

            <label className="form-label">Votre réponse *</label>
            <textarea
              value={reponse}
              onChange={e => setReponse(e.target.value)}
              rows={4}
              placeholder="Rédigez votre réponse..."
              className="form-textarea"
            />
            <button
              onClick={handleReply}
              disabled={replyLoading || !reponse.trim()}
              className={`btn--full ${reponse.trim() ? "btn--full-primary" : "btn--full-disabled"}`}
            >
              {replyLoading ? "Envoi..." : "Envoyer la réponse"}
            </button>
          </div>
        </div>
      )}

      <main className="page-root--padded">
        <div className="page-container">

          <div className="page-header">
            <h1 className="page-header__title">Plaintes des Employés</h1>
            <p className="page-header__count">
              {plaintes.length} plainte{plaintes.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="filter-bar">
            {[
              { key: "ALL",       label: "Toutes" },
              { key: "EN_ATTENTE", label: "En attente" },
              { key: "TRAITEE",   label: "Traitées" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`filter-btn${filter === f.key ? " filter-btn--active" : ""}`}
              >
                {f.label}&nbsp;
                ({f.key === "ALL" ? plaintes.length : plaintes.filter(p => p.statut === f.key).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="skeleton-list">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="skeleton-item" style={{ height: 120 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
                </svg>
              </div>
              <p>Aucune plainte</p>
            </div>
          ) : (
            <div className="card-list">
              {filtered.map(p => {
                const statut = statutConfig[p.statut] || { label: p.statut, cls: "status-badge--neutral" };
                return (
                  <div key={p._id} className="card--complaint">
                    <div className="complaint-header">
                      <div className="avatar avatar--red">
                        {(p.employeId?.name || "?")[0].toUpperCase()}
                      </div>
                      <div className="card-info">
                        <p className="card-info__name">{p.employeId?.name}</p>
                        <p className="card-info__sub">
                          {p.employeId?.departement || "—"} · {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <span className={`status-badge ${statut.cls}`}>{statut.label}</span>
                    </div>

                    <div className="complaint-body">
                      <p>{p.description}</p>
                    </div>

                    {p.reponse && (
                      <div className="complaint-reply">
                        <p className="complaint-reply__label">Réponse :</p>
                        <p>{p.reponse}</p>
                      </div>
                    )}

                    {p.statut === "EN_ATTENTE" && (
                      <button
                        onClick={() => { setReplyModal(p); setReponse(""); }}
                        className="btn--reply"
                      >
                        <ReplyIcon /> Répondre
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