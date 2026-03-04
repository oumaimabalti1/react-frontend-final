// ─────────────────────────────────────────────────────────────
// src/data/portalCards.js
// Données des cards pour chaque portail
// ─────────────────────────────────────────────────────────────

import { Users, Briefcase, FileText, Palmtree, Megaphone, ClipboardList } from "lucide-react";

export const hrCards = [
  { to: "/hr/employeelist",  icon: Users,        color: "#2563eb", title: "Employés",        desc: "Gérer les membres de votre équipe" },
  { to: "/hr/offres",        icon: Briefcase,    color: "#7c3aed", title: "Offres d'emploi", desc: "Publier et gérer vos offres" },
  { to: "/hr/candidatures",  icon: FileText,     color: "#059669", title: "Candidatures",    desc: "Examiner et traiter les dossiers" },
  { to: "/hr/conges",        icon: Palmtree,     color: "#d97706", title: "Congés",          desc: "Approuver les demandes de congé" },
  { to: "/hr/plaintes",      icon: Megaphone,    color: "#ef4444", title: "Plaintes",        desc: "Répondre aux signalements" },
];

export const employeeCards = [
  { to: "/employee/conge",   icon: Palmtree,     color: "#7c3aed", title: "Congés",          desc: "Soumettre et suivre vos demandes de congé" },
  { to: "/employee/plainte", icon: Megaphone,    color: "#ef4444", title: "Plaintes",        desc: "Signaler un problème à votre RH" },
];

export const candidatCards = [
  { to: "/candidat/offre",        icon: Briefcase,    color: "#0891b2", title: "Offres d'emploi",  desc: "Découvrez et postulez aux offres disponibles" },
  { to: "/candidat/applications", icon: ClipboardList,color: "#2563eb", title: "Mes Candidatures", desc: "Suivez l'état de vos candidatures" },
  { to: "/candidat/moncv",        icon: FileText,     color: "#059669", title: "Mon CV",           desc: "Déposez et gérez votre CV" },
];