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

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4v5h5M20 20v-5h-5" strokeLinecap="round"/>
      <path d="M4 9a8 8 0 0114.93-2M20 15a8 8 0 01-14.93 2" strokeLinecap="round"/>
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

const emptyForm = { name: "", email: "", password: "", departement: "" };
const depts = ["RH", "Finance", "IT", "Marketing", "Commercial", "Production", "Direction"];

export default function Employeelist() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchEmployees = () => {
    setLoading(true);
    api.get("/rh/employees")
      .then(res => setEmployees(res.data.employees || []))
      .catch(() => showToast("Erreur chargement employés", "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    try {
      await api.post("/rh/employees", form);
      showToast("Employé créé avec succès");
      setForm(emptyForm);
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      setFormError(err.response?.data?.message || "Erreur création");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />
      <main className="page-root--padded">
        <div className="page-container--wide">

          <div className="page-header--row">
            <div>
              <h1 className="page-header__title">Gestion des Employés</h1>
              <p className="page-header__count">
                {employees.length} employé{employees.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => { setShowForm(!showForm); setFormError(""); }}
              className={showForm ? "btn--cancel" : "btn--primary"}
            >
              {showForm ? "Annuler" : "+ Nouvel Employé"}
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleCreate} className="form-card">
              <h2 className="form-title">Créer un employé</h2>
              {formError && (
                <div className="form-error">
                  <XIcon />
                  {formError}
                </div>
              )}
              <div className="form-grid">
                <div>
                  <label className="form-label">Nom complet *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="form-input"
                    placeholder="Ex: Jean Dupont"
                  />
                </div>
                <div>
                  <label className="form-label">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="form-input"
                    placeholder="jean@exemple.com"
                  />
                </div>
                <div>
                  <label className="form-label">Mot de passe *</label>
                  <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    required
                    className="form-input"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="form-label">Département *</label>
                  <select
                    name="departement"
                    value={form.departement}
                    onChange={e => setForm({ ...form, departement: e.target.value })}
                    required
                    className="form-input"
                  >
                    <option value="">Sélectionner...</option>
                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-footer">
                <button type="submit" disabled={formLoading} className="btn--primary-green">
                  {formLoading ? "Création..." : "Créer l'employé"}
                </button>
              </div>
            </form>
          )}

          <div className="table-card">
            <div className="table-card__header">
              <h2 className="table-card__title">Liste des employés</h2>
              <button onClick={fetchEmployees} className="btn--refresh">
                <RefreshIcon />
              </button>
            </div>
            {loading ? (
              <div className="loading-text">Chargement...</div>
            ) : employees.length === 0 ? (
              <div className="loading-text">Aucun employé</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    {["Employé", "Email", "Département"].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id}>
                      <td>
                        <div className="table-cell--name">
                          <div className="avatar avatar--blue avatar--sm">
                            {(emp.name || "?")[0].toUpperCase()}
                          </div>
                          <span>{emp.name}</span>
                        </div>
                      </td>
                      <td className="table-cell--email">{emp.email}</td>
                      <td>
                        <span className="dept-badge">{emp.departement || "—"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </>
  );
}