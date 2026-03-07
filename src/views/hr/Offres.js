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

function BriefcaseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/>
      <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" strokeLinecap="round"/>
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" strokeLinecap="round"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round"/>
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" strokeLinecap="round"/>
      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" strokeLinecap="round"/>
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinecap="round"/>
    </svg>
  );
}

function EmptyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 13h6m-3-3v6M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round"/>
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

export default function Offres() {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editOffre, setEditOffre] = useState(null);
  const [form, setForm] = useState({ titre: "", description: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchOffres = () => {
    setLoading(true);
    api.get("/rh/offres")
      .then(res => setOffres(res.data.offres || []))
      .catch(() => showToast("Erreur chargement offres", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOffres(); }, []);

  const openEdit = (offre) => {
    setEditOffre(offre);
    setForm({ titre: offre.titre, description: offre.description, domaine: offre.domaine || "Autre" });
    setShowForm(true);
  };

  const openNew = () => {
    setEditOffre(null);
    setForm({ titre: "", description: "", domaine: "Autre" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      if (editOffre) {
        await api.put(`/rh/offres/${editOffre._id}`, form);
        showToast("Offre mise à jour");
      } else {
        await api.post("/rh/offres", form);
        showToast("Offre publiée avec succès");
      }
      setShowForm(false);
      setEditOffre(null);
      fetchOffres();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur", "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/rh/offres/${id}`);
      showToast("Offre supprimée");
      fetchOffres();
    } catch {
      showToast("Erreur suppression", "error");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      {confirmId && (
        <div className="modal-backdrop">
          <div className="modal modal--sm">
            <div className="modal__warning-icon">
              <WarningIcon />
            </div>
            <h3 className="modal__title--lg">Supprimer l'offre ?</h3>
            <p className="modal__text">Cette action est irréversible.</p>
            <div className="modal__actions">
              <button onClick={() => setConfirmId(null)} className="modal__cancel-btn">
                Annuler
              </button>
              <button onClick={() => handleDelete(confirmId)} className="modal__delete-btn">
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop">
          <form onSubmit={handleSubmit} className="modal modal--lg">
            <button type="button" onClick={() => setShowForm(false)} className="modal__close">
              <XIcon />
            </button>
            <h2 className="modal__title">
              {editOffre ? "Modifier l'offre" : "Publier une offre"}
            </h2>
            <div className="form-group" style={{ marginTop: 20 }}>
              <label className="form-label">Titre *</label>
              <input
                value={form.titre}
                onChange={e => setForm({ ...form, titre: e.target.value })}
                required
                className="form-input"
                placeholder="Ex: Développeur Full Stack"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
                rows={5}
                className="form-textarea"
                placeholder="Décrivez le poste, les missions, les compétences requises..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Domaine *</label>
              <select
                value={form.domaine}
                onChange={e => setForm({ ...form, domaine: e.target.value })}
                required
                className="form-input"
              >
                {["Informatique","Marketing","Finance","RH","Commercial","Juridique","Ingénierie","Design","Communication","Autre"].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={formLoading} className="btn--full btn--full-primary">
              {formLoading ? "Enregistrement..." : editOffre ? "Mettre à jour" : "Publier l'offre"}
            </button>
          </form>
        </div>
      )}

      <main className="page-root--padded">
        <div className="page-container">

          <div className="page-header--row">
            <div>
              <h1 className="page-header__title">Gestion des Offres</h1>
              <p className="page-header__count">
                {offres.length} offre{offres.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button onClick={openNew} className="btn--primary">
              + Publier une offre
            </button>
          </div>

          {loading ? (
            <div className="skeleton-list">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="skeleton-item" style={{ height: 120 }} />
              ))}
            </div>
          ) : offres.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state__icon">
                <EmptyIcon />
              </div>
              <p>Aucune offre publiée pour le moment</p>
            </div>
          ) : (
            <div className="card-list">
              {offres.map(offre => (
                <div key={offre._id} className="card--offre">
                  <div className="avatar--icon">
                    <BriefcaseIcon />
                  </div>
                  <div className="offre-content">
                    <h3 className="offre-content__title">{offre.titre}</h3>
                    <p className="offre-content__desc">{offre.description}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      {offre.domaine && (
                        <span style={{ background: "#ecfeff", color: "#0891b2", borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600 }}>
                          {offre.domaine}
                        </span>
                      )}
                      <p className="offre-content__date" style={{ margin: 0 }}>
                        Publié le {new Date(offre.dateCreation || offre.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <div className="action-group" style={{ flexShrink: 0 }}>
                    <button onClick={() => openEdit(offre)} className="btn btn--edit">
                      <EditIcon /> Modifier
                    </button>
                    <button onClick={() => setConfirmId(offre._id)} className="btn btn--delete">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}