import React, { useState, useEffect } from "react";
import Navbar from "components/Navbars/HNavbar.js";
import { Users, Plus, X, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

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

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchEmployees = () => {
    setLoading(true);
    api.get("/rh/employees").then(res => setEmployees(res.data.employees || [])).catch(() => showToast("Erreur chargement employés", "error")).finally(() => setLoading(false));
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault(); setFormError(""); setFormLoading(true);
    try {
      await api.post("/rh/employees", form);
      showToast("Employé créé avec succès");
      setForm(emptyForm); setShowForm(false); fetchEmployees();
    } catch (err) { setFormError(err.response?.data?.message || "Erreur création"); }
    finally { setFormLoading(false); }
  };

  const input = { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#1a2340", outline: "none", background: "#f8fafc", boxSizing: "border-box" };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#1e293b 100%)", padding: "120px 24px 100px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(37,99,235,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(37,99,235,0.15)", color: "#93c5fd", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail RH
            </span>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Gestion des Employés</h1>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>{employees.length} employé{employees.length !== 1 ? "s" : ""}</p>
              </div>
              <button onClick={() => { setShowForm(!showForm); setFormError(""); }}
                style={{ padding: "11px 22px", borderRadius: 12, border: "none", background: showForm ? "rgba(255,255,255,0.15)" : "linear-gradient(135deg,#2563eb,#1d4ed8)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                {showForm ? <><X size={15} /> Annuler</> : <><Plus size={15} /> Nouvel Employé</>}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "-48px auto 0", padding: "0 24px 60px", position: "relative", zIndex: 2 }}>

          {/* Form */}
          {showForm && (
            <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 4px 24px rgba(30,60,120,0.08)", marginBottom: 24, border: "1px solid #e8edf5" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={18} color="#2563eb" /> Créer un employé
              </h2>
              {formError && (
                <div style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 13, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <XCircle size={14} /> {formError}
                </div>
              )}
              <form onSubmit={handleCreate}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
                  <div><label style={labelStyle}>Nom complet *</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={input} placeholder="vous" /></div>
                  <div><label style={labelStyle}>Email *</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={input} placeholder="vous@exemple.com" /></div>
                  <div><label style={labelStyle}>Mot de passe *</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required style={input} placeholder="••••••••" /></div>
                  <div>
                    <label style={labelStyle}>Département *</label>
                    <select value={form.departement} onChange={e => setForm({ ...form, departement: e.target.value })} required style={input}>
                      <option value="">Sélectionner...</option>
                      {depts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button type="submit" disabled={formLoading} style={{ padding: "11px 28px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: formLoading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={15} /> {formLoading ? "Création..." : "Créer l'employé"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Table */}
          <div style={{ background: "#fff", borderRadius: 20, boxShadow: "0 2px 16px rgba(30,60,120,0.07)", overflow: "hidden" }}>
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>Liste des employés</h2>
              <button onClick={fetchEmployees} style={{ width: 36, height: 36, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <RefreshCw size={15} color="#64748b" />
              </button>
            </div>
            {loading ? (
              <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>Chargement...</div>
            ) : employees.length === 0 ? (
              <div style={{ padding: 60, textAlign: "center", color: "#94a3b8" }}>
                <Users size={40} color="#e2e8f0" style={{ margin: "0 auto 12px" }} />
                <p style={{ margin: 0 }}>Aucun employé</p>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Employé", "Email", "Département"].map(h => (
                      <th key={h} style={{ padding: "12px 24px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, i) => (
                    <tr key={emp._id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                      <td style={{ padding: "14px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563eb,#1d4ed8)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>
                            {(emp.name || "?")[0].toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: "#1a2340", fontSize: 14 }}>{emp.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 24px", color: "#64748b", fontSize: 14 }}>{emp.email}</td>
                      <td style={{ padding: "14px 24px" }}>
                        <span style={{ background: "#eff6ff", color: "#2563eb", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600 }}>{emp.departement || "—"}</span>
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