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

function XIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
  ACCEPTEE:   { label: "Acceptée",   cls: "status-badge--success" },
  REFUSEE:    { label: "Refusée",    cls: "status-badge--error"   },
};

export default function Candidatures() {
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCandidatures = () => {
    setLoading(true);
    api.get("/rh/candidatures")
      .then(res => setCandidatures(res.data.candidatures || []))
      .catch(() => showToast("Erreur chargement candidatures", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCandidatures(); }, []);

  const handleAction = async (id, action) => {
    setActionId(id + action);
    try {
      await api.put(`/rh/candidatures/${id}/${action}`);
      showToast(action === "accept" ? "Candidature acceptée" : "Candidature refusée");
      fetchCandidatures();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally {
      setActionId(null);
    }
  };

  const filtered = filter === "ALL" ? candidatures : candidatures.filter(c => c.statut === filter);

  return (
    <>
      <Navbar />
      <Toast toast={toast} />
      <main className="page-root--padded">
        <div className="page-container">

          <div className="page-header">
            <h1 className="page-header__title">Candidatures reçues</h1>
            <p className="page-header__count">
              {candidatures.length} candidature{candidatures.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="filter-bar">
            {[
              { key: "ALL",       label: "Toutes" },
              { key: "EN_ATTENTE", label: "En attente" },
              { key: "ACCEPTEE",  label: "Acceptées" },
              { key: "REFUSEE",   label: "Refusées" },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`filter-btn${filter === f.key ? " filter-btn--active" : ""}`}
              >
                {f.label}&nbsp;
                ({f.key === "ALL" ? candidatures.length : candidatures.filter(c => c.statut === f.key).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="skeleton-list">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="skeleton-item" style={{ height: 100 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 12h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
                </svg>
              </div>
              <p>Aucune candidature</p>
            </div>
          ) : (
            <div className="card-list">
              {filtered.map(c => {
                const statut = statutConfig[c.statut] || { label: c.statut, cls: "status-badge--neutral" };
                return (
                  <div key={c._id} className="card">
                    <div className="avatar avatar--green">
                      {(c.candidatId?.name || "?")[0].toUpperCase()}
                    </div>
                    <div className="card-info">
                      <p className="card-info__name">{c.candidatId?.name}</p>
                      <p className="card-info__sub">{c.candidatId?.email}</p>
                      <p className="card-info__meta">{c.offreId?.titre}</p>
                    </div>
                    <span className={`status-badge ${statut.cls}`}>{statut.label}</span>
                    {c.statut === "EN_ATTENTE" && (
                      <div className="action-group">
                        <button
                          className="btn btn--accept"
                          onClick={() => handleAction(c._id, "accept")}
                          disabled={actionId === c._id + "accept"}
                        >
                          {actionId === c._id + "accept" ? "..." : "Accepter"}
                        </button>
                        <button
                          className="btn btn--reject"
                          onClick={() => handleAction(c._id, "refuse")}
                          disabled={actionId === c._id + "refuse"}
                        >
                          {actionId === c._id + "refuse" ? "..." : "Refuser"}
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