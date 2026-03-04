import React, { useState, useEffect, useRef } from "react";
import { FileText, UploadCloud, Trash2, CheckCircle, XCircle, Loader2, Calendar } from "lucide-react";
import CNavbar from "components/Navbars/CNavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, background: toast.type === "error" ? "#ef4444" : "#10b981", color: "#fff", borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", gap: 8 }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

export default function MonCV() {
  const [cv, setCV]           = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [toast, setToast]     = useState(null);
  const [dragOver, setDragOver]   = useState(false);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchCV = () => {
    setLoading(true);
    api.get("/candidat/cv")
      .then(res => setCV(res.data.cv))
      .catch(() => setCV(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCV(); }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { showToast("Seuls les fichiers PDF sont acceptés", "error"); return; }
    setUploading(true);
    const fd = new FormData(); fd.append("cv", file);
    try {
      await api.post("/candidat/cv", fd, { headers: { "Content-Type": "multipart/form-data" } });
      showToast(cv ? "CV mis à jour avec succès" : "CV uploadé avec succès");
      fetchCV();
    } catch (err) { showToast(err.response?.data?.message || "Erreur upload", "error"); }
    finally { setUploading(false); }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await api.delete("/candidat/cv"); showToast("CV supprimé"); setCV(null); }
    catch { showToast("Erreur lors de la suppression", "error"); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <CNavbar />
      <Toast toast={toast} />

      <main style={{ minHeight: "100vh", background: "#f8fafc" }}>

        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #0f172a 0%, #164e63 60%, #1e293b 100%)", padding: "64px 24px 48px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(8,145,178,0.07)", filter: "blur(60px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 700, margin: "0 auto", position: "relative" }}>
            <span style={{ display: "inline-block", background: "rgba(8,145,178,0.15)", color: "#67e8f9", borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>
              Portail Candidat
            </span>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Mon CV</h1>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", margin: 0 }}>Gérez votre CV pour postuler aux offres d'emploi</p>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 60px" }}>

          {/* CV existant */}
          {!loading && cv && (
            <div style={{ background: "#fff", borderRadius: 18, padding: 24, boxShadow: "0 2px 16px rgba(30,60,120,0.07)", border: "1.5px solid rgba(8,145,178,0.15)", marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(8,145,178,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={24} color="#0891b2" />
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a2340", margin: 0 }}>{cv.fichier}</h3>
                <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
                  <Calendar size={12} /> Déposé le {new Date(cv.createdAt || cv.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <button onClick={handleDelete} disabled={deleting} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "none", background: "rgba(239,68,68,0.08)", color: "#ef4444", fontWeight: 600, fontSize: 13, cursor: deleting ? "not-allowed" : "pointer" }}>
                {deleting ? <Loader2 size={14} /> : <Trash2 size={14} />}
                {deleting ? "..." : "Supprimer"}
              </button>
            </div>
          )}

          {/* Drop zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
            style={{ border: `2px dashed ${dragOver ? "#0891b2" : "#cbd5e1"}`, borderRadius: 18, padding: "52px 24px", textAlign: "center", cursor: uploading ? "not-allowed" : "pointer", background: dragOver ? "rgba(8,145,178,0.04)" : "#fff", transition: "all 0.2s" }}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: dragOver ? "rgba(8,145,178,0.1)" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              {uploading ? <Loader2 size={28} color="#0891b2" /> : <UploadCloud size={28} color={dragOver ? "#0891b2" : "#94a3b8"} />}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>
              {uploading ? "Upload en cours..." : cv ? "Remplacer mon CV" : "Déposer mon CV"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>
              Glissez votre fichier PDF ici ou cliquez pour sélectionner
            </p>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleUpload(e.target.files[0])} />
          </div>

        </div>
      </main>
    </>
  );
}