import React, { useState, useEffect, useRef } from "react";
import Navbar from "components/Navbars/CNavbar.js";
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

export default function MonCV() {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

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
    if (file.type !== "application/pdf") {
      showToast("Seuls les fichiers PDF sont acceptés", "error");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("cv", file);
    try {
      await api.post("/candidat/cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast(cv ? "CV mis à jour avec succès" : "CV uploadé avec succès");
      fetchCV();
    } catch (err) {
      showToast(err.response?.data?.message || "Erreur upload", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete("/candidat/cv");
      showToast("CV supprimé");
      setCV(null);
    } catch {
      showToast("Erreur lors de la suppression", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Navbar />
      <Toast toast={toast} />

      <main style={{ minHeight: "100vh", background: "#f8fafc", paddingTop: 80 }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }}>

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a2340", margin: 0 }}>
              Mon CV
            </h1>
            <p style={{ color: "#94a3b8", fontSize: 14, marginTop: 4 }}>
              Gérez votre CV pour postuler aux offres
            </p>
          </div>

          {/* CV existant */}
          {!loading && cv && (
            <div style={{
              background: "#fff", borderRadius: 16, padding: "28px",
              boxShadow: "0 2px 16px rgba(30,60,120,0.07)",
              marginBottom: 24, display: "flex", alignItems: "center", gap: 20,
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: "#fef2f2", display: "flex",
                alignItems: "center", justifyContent: "center", fontSize: 26,
              }}>📄</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", margin: 0 }}>
                  {cv.fichier}
                </h3>
                <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                  Déposé le {new Date(cv.createdAt || cv.updatedAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: "8px 16px", borderRadius: 8, border: "none",
                  background: "#fef2f2", color: "#ef4444",
                  fontWeight: 600, fontSize: 13, cursor: "pointer",
                }}
              >
                {deleting ? "..." : "🗑️ Supprimer"}
              </button>
            </div>
          )}

          {/* Upload zone */}
          <div
            onClick={() => fileRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => {
              e.preventDefault();
              setDragOver(false);
              handleUpload(e.dataTransfer.files[0]);
            }}
            style={{
              border: `2px dashed ${dragOver ? "#2563eb" : "#cbd5e1"}`,
              borderRadius: 16, padding: "48px 24px",
              textAlign: "center", cursor: "pointer",
              background: dragOver ? "#eff6ff" : "#fff",
              transition: "all 0.2s",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>
              {uploading ? "⏳" : "📤"}
            </div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a2340", marginBottom: 8 }}>
              {uploading ? "Upload en cours..." : cv ? "Remplacer mon CV" : "Déposer mon CV"}
            </h3>
            <p style={{ color: "#94a3b8", fontSize: 13 }}>
              Glissez votre fichier PDF ici ou cliquez pour sélectionner
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={e => handleUpload(e.target.files[0])}
            />
          </div>

        </div>
      </main>
    </>
  );
}