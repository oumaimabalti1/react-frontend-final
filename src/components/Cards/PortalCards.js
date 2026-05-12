
import { Users, Briefcase, FileText, Palmtree, Megaphone, ClipboardList } from "lucide-react";

export const hrCards = [
  { to: "/hr/employeelist",  icon: Users,      title: "Employés",        desc: "Gérer les membres de votre équipe" },
  { to: "/hr/offres",        icon: Briefcase,   title: "Offres d'emploi", desc: "Publier et gérer vos offres" },
  { to: "/hr/candidatures",  icon: FileText,     title: "Candidatures",    desc: "Examiner et traiter les dossiers" },
  { to: "/hr/conges",        icon: Palmtree,    title: "Congés",          desc: "Approuver les demandes de congé" },
  { to: "/hr/plaintes",      icon: Megaphone,  title: "Plaintes",        desc: "Répondre aux signalements" },
];

export const employeeCards = [
  { to: "/employee/conge",   icon: Palmtree,      title: "Congés",          desc: "Soumettre et suivre vos demandes de congé" },
  { to: "/employee/plainte", icon: Megaphone,    title: "Plaintes",        desc: "Signaler un problème à votre RH" },
];

export const candidatCards = [
  { to: "/candidat/offre",        icon: Briefcase,    title: "Offres d'emploi",  desc: "Découvrez et postulez aux offres disponibles" },
  { to: "/candidat/applications", icon: ClipboardList, title: "Mes Candidatures", desc: "Suivez l'état de vos candidatures" },
  { to: "/candidat/moncv",        icon: FileText,      title: "Mon CV",           desc: "Déposez et gérez votre CV" },
];