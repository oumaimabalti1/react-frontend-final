import React, { useState, useEffect, useRef } from "react";
import { FileText, UploadCloud, Trash2, CheckCircle, XCircle, Loader2, Calendar } from "lucide-react";
import CNavbar from "components/Navbars/CNavbar.js";
import api from "services/api";

const Toast = ({ toast }) => !toast ? null : (
  <div style={{
    position: "fixed", top: 24, right: 24, zIndex: 9999,
    background: toast.type === "error" ? "#fef2f2" : "#f0fdf4",
    border: `1px solid ${toast.type === "error" ? "#fecaca" : "#bbf7d0"}`,
    color: toast.type === "error" ? "#dc2626" : "#059669",
    borderRadius: 12, padding: "14px 24px", fontWeight: 600, fontSize: 14,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex", alignItems: "center", gap: 8
  }}>
    {toast.type === "error" ? <XCircle size={18} /> : <CheckCircle size={18} />} {toast.msg}
  </div>
);

function CVCard({ cv, onDelete, deleting }) {
  return (
    <div style={{
      background: "#fff", borderRadius: 16, padding: 24,
      border: "1px solid #f1f5f9", borderLeft: "4px solid #0891b2",
      marginBottom: 20, display: "flex", alignItems: "center", gap: 16
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <FileText size={22} color="#0891b2" />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{cv.fichier}</h3>
        <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}>
          <Calendar size={12} /> Déposé le {new Date(cv.createdAt || cv.updatedAt).toLocaleDateString("fr-FR")}
        </p>
      </div>
      <button onClick={onDelete} disabled={deleting} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
        borderRadius: 8, border: "none", background: "#fef2f2",
        color: "#ef4444", fontWeight: 600, fontSize: 13,
        cursor: deleting ? "not-allowed" : "pointer"
      }}>
        {deleting ? <Loader2 size={14} /> : <Trash2 size={14} />}
        {deleting ? "..." : "Supprimer"}
      </button>
    </div>
  );
}

function DropZone({ onFile, uploading, hasCV, fileRef }) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onClick={() => fileRef.current.click()}
      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={e => { e.preventDefault(); setDragOver(false); onFile(e.dataTransfer.files[0]); }}
      style={{
        border: `2px dashed ${dragOver ? "#0891b2" : "#e2e8f0"}`,
        borderRadius: 16, padding: "52px 24px", textAlign: "center",
        cursor: uploading ? "not-allowed" : "pointer",
        background: dragOver ? "#f0fdfa" : "#fff",
        transition: "all 0.2s"
      }}
    >
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: dragOver ? "#f0fdfa" : "#f8fafc",
        border: `1px solid ${dragOver ? "#99f6e4" : "#f1f5f9"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 16px"
      }}>
        {uploading ? <Loader2 size={28} color="#0891b2" /> : <UploadCloud size={28} color={dragOver ? "#0891b2" : "#94a3b8"} />}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>
        {uploading ? "Upload en cours..." : hasCV ? "Remplacer mon CV" : "Déposer mon CV"}
      </h3>
      <p style={{ color: "#94a3b8", fontSize: 13, margin: 0 }}>Glissez votre fichier PDF ici ou cliquez pour sélectionner</p>
    </div>
  );
}

export default function MonCV() {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const fetchCV = () => {
    setLoading(true);
    api.get("/candidat/cv").then(res => setCV(res.data.cv)).catch(() => setCV(null)).finally(() => setLoading(false));
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

        {/* Hero - light */}
        <div style={{ padding: "48px 24px 60px", background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <span style={{
              display: "inline-block", background: "#f0fdfa", color: "#0891b2",
              border: "1px solid #99f6e4", borderRadius: 8, padding: "5px 14px",
              fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 16
            }}>
              Portail Candidat
            </span>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Mon CV</h1>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>Gérez votre CV pour postuler aux offres d'emploi</p>
          </div>
        </div>

        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px 60px" }}>
          {!loading && cv && <CVCard cv={cv} onDelete={handleDelete} deleting={deleting} />}
          <DropZone onFile={handleUpload} uploading={uploading} hasCV={!!cv} fileRef={fileRef} />
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => handleUpload(e.target.files[0])} />
        </div>
      </main>
    </>
  );
}