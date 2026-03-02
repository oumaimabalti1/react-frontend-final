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

const emptyForm = { name: "", email: "", password: "", departement: "" };

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

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340",
    outline: "none", background: "#f8fafc", boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: 12, fontWeight: 600, color: "#64748b",
    textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", marginBottom: 6,
  };

  const depts = ["RH", "Finance", "IT", "Marketing", "Commercial", "Production", "Direction"];

  return (
    <>
      <Navbar />
      <Toast toast={toast} />
      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>

          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1a2340", margin: 0 }}>Gestion des Employés</h1>
              <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>{employees.length} employé{employees.length !== 1 ? "s" : ""}</p>
            </div>
            <button onClick={() => { setShowForm(!showForm); setFormError(""); }} style={{
              padding: "11px 22px", borderRadius: 12, border: "none",
              background: showForm ? "#e2e8f0" : "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: showForm ? "#374151" : "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
              boxShadow: showForm ? "none" : "0 4px 14px rgba(37,99,235,0.3)",
            }}>
              {showForm ? "✕ Annuler" : "+ Nouvel Employé"}
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <form onSubmit={handleCreate} style={{
              background: "#fff", borderRadius: 20, padding: "32px",
              boxShadow: "0 2px 20px rgba(30,60,120,0.08)", marginBottom: 32,
            }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a2340", marginBottom: 24 }}>👤 Créer un employé</h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 20 }}>
                  ❌ {formError}
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <div>
                  <label style={labelStyle}>Nom complet *</label>
                  <input name="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={inputStyle} placeholder="Ex: Jean Dupont" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={inputStyle} placeholder="jean@exemple.com" />
                </div>
                <div>
                  <label style={labelStyle}>Mot de passe *</label>
                  <input name="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={inputStyle} placeholder="••••••••" />
                </div>
                <div>
                  <label style={labelStyle}>Département *</label>
                  <select name="departement" value={form.departement} onChange={e => setForm({ ...form, departement: e.target.value })} required style={inputStyle}>
                    <option value="">Sélectionner...</option>
                    {depts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <button type="submit" disabled={formLoading} style={{
                  padding: "11px 28px", borderRadius: 12, border: "none",
                  background: "linear-gradient(135deg, #059669, #047857)",
                  color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}>
                  {formLoading ? "Création..." : "✓ Créer l'employé"}
                </button>
              </div>
            </form>
          )}

          {/* Table */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 20px rgba(30,60,120,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "20px 28px", borderBottom: "1px solid #f0f2f8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>Liste des employés</h2>
              <button onClick={fetchEmployees} style={{ padding: "7px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>🔄</button>
            </div>
            {loading ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Chargement...</div>
            ) : employees.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>Aucun employé</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Employé", "Email", "Département"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #f0f2f8" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={emp._id} style={{ borderBottom: i < employees.length - 1 ? "1px solid #f0f2f8" : "none" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#fafbff"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "#2563eb", fontSize: 15 }}>
                            {(emp.name || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#1a2340" }}>{emp.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", color: "#6b7280", fontSize: 14 }}>{emp.email}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>
                          {emp.departement || "—"}
                        </span>
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