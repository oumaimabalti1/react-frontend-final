import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, Briefcase, UploadCloud, FileText, Mail, Building2, Check, Send, Loader2, UserCheck, X } from "lucide-react";
import CNavbar from "components/Navbars/CNavbar.js";
import OffreCard from "components/Cards/OffreCard.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={20} /> : <CheckCircle size={20} />} {toast.msg}
  </div>
);

const btnStyle = (bg, shadow, disabled) => ({
  width: "100%", padding: 12, borderRadius: 12, border: "none",
  background: disabled ? "#e2e8f0" : bg,
  color: disabled ? "#94a3b8" : "#fff",
  fontWeight: 700, fontSize: 14,
  cursor: disabled ? "not-allowed" : "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
  boxShadow: disabled ? "none" : shadow,
  transition: "all 0.2s",
});

export default function Offre() {
  const [offres, setOffres]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [selected, setSelected]         = useState(null);
  const [toast, setToast]               = useState(null);
  const [existingCV, setExistingCV]     = useState(null);
  const [cvFile, setCvFile]             = useState(null);
  const [uploadingCV, setUploadingCV]   = useState(false);
  const [cvUploaded, setCvUploaded]     = useState(false);
  const [dragOver, setDragOver]         = useState(false);
  const [applying, setApplying]         = useState(false);
  const [applied, setApplied]           = useState(false);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    api.get("/candidat/offres")
      .then(res => setOffres(res.data.offres || []))
      .catch(() => showToast("Erreur chargement des offres", "error"))
      .finally(() => setLoading(false));
  }, []);

  const openModal = async (offre) => {
    setSelected(offre); setCvFile(null); setCvUploaded(false); setApplied(false);
    try { const res = await api.get("/candidat/cv"); setExistingCV(res.data.cv); }
    catch { setExistingCV(null); }
  };

  const closeModal = () => { setSelected(null); setExistingCV(null); setCvFile(null); setCvUploaded(false); setApplied(false); };

  const handleCVSelect = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { showToast("Seuls les fichiers PDF sont acceptés", "error"); return; }
    setCvFile(file);
  };

  const handleUploadCV = async () => {
    setUploadingCV(true);
    const fd = new FormData(); fd.append("cv", cvFile);
    try {
      const res = await api.post("/candidat/cv", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setExistingCV(res.data.cv); setCvUploaded(true); showToast("CV uploadé avec succès !");
    } catch (err) { showToast(err.response?.data?.message || "Erreur upload CV", "error"); }
    finally { setUploadingCV(false); }
  };

  const handlePostuler = async () => {
    if (!existingCV && !cvUploaded) { showToast("Veuillez d'abord uploader votre CV", "error"); return; }
    setApplying(true);
    try { await api.post("/candidat/candidatures", { offreId: selected._id }); setApplied(true); showToast("Candidature envoyée !"); }
    catch (err) { showToast(err.response?.data?.message || "Erreur lors de la candidature", "error"); }
    finally { setApplying(false); }
  };

  const hasCV = existingCV || cvUploaded;

  return (
    <>
      <CNavbar />
      <Toast toast={toast} />

      {/* MODAL */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9998, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 24, width: "100%", maxWidth: 600, boxShadow: "0 8px 40px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto", position: "relative" }}>

            <button onClick={closeModal} style={{ position: "absolute", top: 14, right: 14, background: "rgba(255,255,255,0.15)", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <X size={16} color="#fff" />
            </button>

            {applied ? (
              <div style={{ padding: "60px 40px", textAlign: "center" }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                  <CheckCircle size={36} color="#10b981" />
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a2340", marginBottom: 8 }}>Candidature envoyée !</h2>
                <p style={{ color: "#6b7280", marginBottom: 28, lineHeight: 1.6 }}>Votre candidature pour <strong>{selected.titre}</strong> a été soumise.</p>
                <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                  <button onClick={closeModal} style={{ padding: "11px 24px", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Continuer</button>
                  <Link to="/candidat/applications" style={{ padding: "11px 24px", borderRadius: 12, background: "linear-gradient(135deg,#0891b2,#0e7490)", color: "#fff", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                    Mes candidatures <UserCheck size={15} />
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Dark header */}
                <div style={{ background: "linear-gradient(135deg,#0f172a,#164e63)", borderRadius: "24px 24px 0 0", padding: "28px 36px" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(8,145,178,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Briefcase size={22} color="#67e8f9" />
                  </div>
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>{selected.titre}</h2>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {selected.entrepriseId?.nom     && <span style={{ background: "rgba(255,255,255,0.1)",   color: "#e2e8f0", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}><Building2 size={12} />{selected.entrepriseId.nom}</span>}
                    {selected.entrepriseId?.secteur && <span style={{ background: "rgba(8,145,178,0.25)",    color: "#67e8f9", borderRadius: 20, padding: "3px 12px", fontSize: 12, fontWeight: 600 }}>{selected.entrepriseId.secteur}</span>}
                    {selected.entrepriseId?.email   && <span style={{ background: "rgba(255,255,255,0.07)", color: "#94a3b8", borderRadius: 20, padding: "3px 12px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><Mail size={11} />{selected.entrepriseId.email}</span>}
                  </div>
                </div>

                <div style={{ padding: "20px 36px" }}>
                  <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 18px" }}>
                    <p style={{ color: "#374151", lineHeight: 1.7, fontSize: 14, margin: 0 }}>{selected.description}</p>
                  </div>
                </div>

                <div style={{ height: 1, background: "#f0f2f8", margin: "0 36px" }} />

                {/* CV Section */}
                <div style={{ padding: "20px 36px 32px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
                    <FileText size={16} color="#0891b2" /> Votre CV
                  </h3>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 14 }}>Un CV est requis pour postuler</p>

                  {existingCV && !cvFile && (
                    <div style={{ background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <Check size={18} color="#059669" />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#059669", margin: 0 }}>CV existant détecté</p>
                        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{existingCV.fichier}</p>
                      </div>
                      <button onClick={() => fileRef.current.click()} style={{ padding: "5px 10px", borderRadius: 7, border: "1px solid #86efac", background: "#fff", color: "#059669", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Remplacer</button>
                    </div>
                  )}

                  {cvFile && (
                    <div style={{ border: "1.5px solid #0891b2", borderRadius: 12, padding: "12px 16px", background: "rgba(8,145,178,0.05)", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <FileText size={22} color="#0891b2" />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#1a2340", margin: 0 }}>{cvFile.name}</p>
                        <p style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{(cvFile.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button onClick={() => setCvFile(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={15} color="#94a3b8" /></button>
                    </div>
                  )}

                  {!existingCV && !cvFile && (
                    <div onClick={() => fileRef.current.click()}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleCVSelect(e.dataTransfer.files[0]); }}
                      style={{ border: `2px dashed ${dragOver ? "#0891b2" : "#cbd5e1"}`, borderRadius: 12, padding: "24px 20px", textAlign: "center", cursor: "pointer", background: dragOver ? "rgba(8,145,178,0.04)" : "#f8fafc", transition: "all 0.2s", marginBottom: 14 }}
                    >
                      <UploadCloud size={28} color={dragOver ? "#0891b2" : "#94a3b8"} style={{ marginBottom: 6 }} />
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#374151", margin: 0 }}>Glissez votre CV ici</p>
                      <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>ou cliquez pour sélectionner un PDF</p>
                    </div>
                  )}

                  <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleCVSelect(e.target.files[0])} />

                  {cvFile && !cvUploaded && (
                    <button onClick={handleUploadCV} disabled={uploadingCV}
                      style={{ ...btnStyle("linear-gradient(135deg,#0891b2,#0e7490)", "none", uploadingCV), marginBottom: 10 }}>
                      {uploadingCV ? <Loader2 size={16} /> : <UploadCloud size={16} />}
                      {uploadingCV ? "Upload en cours..." : "Confirmer l'upload"}
                    </button>
                  )}

                  <button onClick={handlePostuler} disabled={!hasCV || applying}
                    style={btnStyle("linear-gradient(135deg,#0891b2,#0e7490)", "0 4px 14px rgba(8,145,178,0.35)", !hasCV || applying)}>
                    {applying ? <Loader2 size={16} /> : hasCV ? <Send size={16} /> : <FileText size={16} style={{ opacity: 0.5 }} />}
                    {applying ? "Envoi en cours..." : hasCV ? "Postuler maintenant" : "Uploadez votre CV pour postuler"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* PAGE */}
      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#164e63 60%,#1e293b 100%)", padding: "64px 24px 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(8,145,178,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20 }}>
            <div>
              <span style={{ display: "inline-block", background: "rgba(8,145,178,0.15)", color: "#67e8f9", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
                Portail Candidat
              </span>
              <h1 style={{ fontSize: "clamp(24px,4vw,40px)", fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Offres d'emploi</h1>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                {loading ? "Chargement..." : `${offres.length} offre${offres.length !== 1 ? "s" : ""} disponible${offres.length !== 1 ? "s" : ""}`}
              </p>
            </div>
            <Link to="/candidat/applications" style={{ padding: "11px 22px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.07)", color: "#fff", fontWeight: 600, fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <UserCheck size={16} /> Mes candidatures
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div style={{ maxWidth: 1100, margin: "-32px auto 0", padding: "0 24px 60px" }}>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {Array(6).fill(0).map((_, i) => <div key={i} style={{ background: "#fff", borderRadius: 18, height: 200, opacity: 0.4 }} />)}
            </div>
          ) : offres.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Briefcase size={32} color="#cbd5e1" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 600 }}>Aucune offre disponible pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
              {offres.map(offre => <OffreCard key={offre._id} offre={offre} onOpen={openModal} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}