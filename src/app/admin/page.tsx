"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Megaphone,
  FolderKanban,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  Edit,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  ShieldCheck,
  X,
  Sparkles,
  ArrowUpRight,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  AlertCircle,
  UserCheck,
  BookOpen,
  HardDrive,
  Download,
  Save,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  RefreshCw,
  Sliders,
  Database,
  Check,
  Building2,
} from "lucide-react";
import { StcLeoOfficialLogo } from "@/components/ui/BrandingLogos";
import {
  isFirebaseConfigured,
  getFirestoreCollection,
  getFirestoreDoc,
  saveFirestoreDoc,
  deleteFirestoreDoc,
  seedFirestoreData,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_EVENTS,
  INITIAL_GALLERY_PHOTOS,
  INITIAL_IMPACT_STATS,
  INITIAL_PROJECTS,
  INITIAL_MAGAZINES,
  INITIAL_DOCUMENTS,
  INITIAL_LEADERSHIP,
  INITIAL_CLUB_PROFILE,
  INITIAL_HERO_SLIDES,
  INITIAL_TESTIMONIALS,
  INITIAL_PILLARS,
} from "@/lib/firebase";

// Types
interface Announcement {
  id: string;
  title: string;
  category: string;
  priority: "normal" | "high" | "urgent";
  date: string;
  summary: string;
  linkUrl?: string;
  scope: string;
}

interface EventItem {
  id: string;
  title: string;
  date: string;
  day?: string;
  month?: string;
  time?: string;
  venue?: string;
  category?: string;
  description?: string;
}

interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  directorate: string;
  impactMetric: string;
  date: string;
  location: string;
  status: string;
  summary: string;
  volunteers?: string;
  beneficiaries?: string;
  highlights?: string[];
  image?: string;
}

interface MagazineItem {
  id: string;
  title: string;
  edition: string;
  category: string;
  date: string;
  pages: string;
  directorate: string;
  editor: string;
  driveUrl: string;
  summary: string;
  highlights?: string[];
  isFeatured?: boolean;
}

interface DocumentItem {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  size: string;
  driveUrl: string;
  updatedAt: string;
}

interface GalleryPhotoItem {
  id: string;
  category: string;
  title: string;
  url: string;
  date?: string;
}

interface MemberApplicant {
  id: string;
  name: string;
  regNo: string;
  faculty: string;
  academicYear: string;
  email: string;
  phone: string;
  interests: string;
  appliedDate: string;
  status: "pending" | "approved" | "inducted" | "rejected";
}

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: string;
  receivedDate?: string;
}

export default function AdminPage() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Navigation Tab State
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "club_profile"
    | "hero_slides"
    | "pillars"
    | "testimonials"
    | "announcements"
    | "events"
    | "projects"
    | "magazines"
    | "documents"
    | "leadership"
    | "gallery"
    | "stats"
    | "members"
    | "inquiries"
  >("overview");

  // App Data State
  const [clubProfile, setClubProfile] = useState<any>(INITIAL_CLUB_PROFILE);
  const [heroSlidesList, setHeroSlidesList] = useState<any[]>(INITIAL_HERO_SLIDES);
  const [testimonialsList, setTestimonialsList] = useState<any[]>(INITIAL_TESTIMONIALS);
  const [pillarsList, setPillarsList] = useState<any[]>(INITIAL_PILLARS);
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [magazines, setMagazines] = useState<MagazineItem[]>(INITIAL_MAGAZINES);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [gallery, setGallery] = useState<GalleryPhotoItem[]>(INITIAL_GALLERY_PHOTOS);
  const [leadership, setLeadership] = useState<any>(INITIAL_LEADERSHIP);
  const [impactStats, setImpactStats] = useState<any>(INITIAL_IMPACT_STATS);
  const [members, setMembers] = useState<MemberApplicant[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>("all");

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Seeding State
  const [isSeeding, setIsSeeding] = useState(false);

  // Modals State
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isMagazineModalOpen, setIsMagazineModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isLeaderModalOpen, setIsLeaderModalOpen] = useState(false);

  // Editing states
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);
  const [editingLeader, setEditingLeader] = useState<any | null>(null);

  // Form States - Announcement
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnCategory, setNewAnnCategory] = useState("Youth & STEM");
  const [newAnnPriority, setNewAnnPriority] = useState<"normal" | "high" | "urgent">("normal");
  const [newAnnDate, setNewAnnDate] = useState("");
  const [newAnnSummary, setNewAnnSummary] = useState("");
  const [newAnnLink, setNewAnnLink] = useState("");
  const [newAnnScope, setNewAnnScope] = useState("All Students");

  // Form States - Event
  const [newEvTitle, setNewEvTitle] = useState("");
  const [newEvCategory, setNewEvCategory] = useState("Leadership");
  const [newEvDate, setNewEvDate] = useState("");
  const [newEvDay, setNewEvDay] = useState("");
  const [newEvMonth, setNewEvMonth] = useState("");
  const [newEvTime, setNewEvTime] = useState("");
  const [newEvVenue, setNewEvVenue] = useState("");
  const [newEvDescription, setNewEvDescription] = useState("");

  // Form States - Project
  const [newProjTitle, setNewProjTitle] = useState("");
  const [newProjCategory, setNewProjCategory] = useState("Education");
  const [newProjDirectorate, setNewProjDirectorate] = useState("Directorate of Education & STEM");
  const [newProjMetric, setNewProjMetric] = useState("");
  const [newProjDate, setNewProjDate] = useState("");
  const [newProjLocation, setNewProjLocation] = useState("");
  const [newProjStatus, setNewProjStatus] = useState("Completed");
  const [newProjSummary, setNewProjSummary] = useState("");
  const [newProjHighlights, setNewProjHighlights] = useState("");
  const [newProjVolunteers, setNewProjVolunteers] = useState("");
  const [newProjBeneficiaries, setNewProjBeneficiaries] = useState("");
  const [newProjImage, setNewProjImage] = useState("");

  // Form States - Magazine
  const [newMagTitle, setNewMagTitle] = useState("");
  const [newMagEdition, setNewMagEdition] = useState("");
  const [newMagCategory, setNewMagCategory] = useState("Annual Flagship");
  const [newMagDate, setNewMagDate] = useState("");
  const [newMagPages, setNewMagPages] = useState("");
  const [newMagDirectorate, setNewMagDirectorate] = useState("Directorate of PR & Media");
  const [newMagEditor, setNewMagEditor] = useState("Leo Editorial Board — STC");
  const [newMagDriveUrl, setNewMagDriveUrl] = useState("");
  const [newMagSummary, setNewMagSummary] = useState("");
  const [newMagHighlights, setNewMagHighlights] = useState("");

  // Form States - Document
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState("Governance & Statutes");
  const [newDocFormat, setNewDocFormat] = useState("PDF Document");
  const [newDocSize, setNewDocSize] = useState("");
  const [newDocDriveUrl, setNewDocDriveUrl] = useState("");
  const [newDocDescription, setNewDocDescription] = useState("");

  // Form States - Gallery
  const [newGalTitle, setNewGalTitle] = useState("");
  const [newGalCategory, setNewGalCategory] = useState("community");
  const [newGalUrl, setNewGalUrl] = useState("");
  const [newGalDate, setNewGalDate] = useState("");

  // Form States - Leader
  const [newLeaderName, setNewLeaderName] = useState("");
  const [newLeaderRole, setNewLeaderRole] = useState("Director");
  const [newLeaderFaculty, setNewLeaderFaculty] = useState("St. Thomas' College, Matara");
  const [newLeaderEmail, setNewLeaderEmail] = useState("");
  const [newLeaderScope, setNewLeaderScope] = useState("");
  const [newLeaderInitials, setNewLeaderInitials] = useState("");
  const [newLeaderImage, setNewLeaderImage] = useState("");
  const [newLeaderType, setNewLeaderType] = useState<"director" | "exco" | "advisory">("director");

  // Dynamic inline Google Drive URLs editor map
  const [driveUrlEdits, setDriveUrlEdits] = useState<Record<string, string>>({});
  const [driveUrlDocEdits, setDriveUrlDocEdits] = useState<Record<string, string>>({});

  // Check saved session & fetch Firestore data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("stc_leo_admin_auth");
      if (stored === "true") {
        setIsAuthenticated(true);
      }
      setIsCheckingAuth(false);

      // Fetch live cloud data
      loadAllCloudData();
    }
  }, []);

  const loadAllCloudData = () => {
    if (isFirebaseConfigured()) {
      getFirestoreDoc<any>("settings", "club_profile", INITIAL_CLUB_PROFILE).then((data) => {
        if (data && data.name) setClubProfile(data);
      });
      getFirestoreDoc<any>("settings", "hero_slides", { slides: INITIAL_HERO_SLIDES }).then((data) => {
        if (data && data.slides) setHeroSlidesList(data.slides);
      });
      getFirestoreDoc<any>("settings", "testimonials", { testimonials: INITIAL_TESTIMONIALS }).then((data) => {
        if (data && data.testimonials) setTestimonialsList(data.testimonials);
      });
      getFirestoreDoc<any>("settings", "pillars", { pillars: INITIAL_PILLARS }).then((data) => {
        if (data && data.pillars) setPillarsList(data.pillars);
      });
      getFirestoreCollection<Announcement>("announcements", INITIAL_ANNOUNCEMENTS).then((data) => {
        if (data && data.length > 0) setAnnouncements(data);
      });
      getFirestoreCollection<EventItem>("events", INITIAL_EVENTS).then((data) => {
        if (data && data.length > 0) setEvents(data);
      });
      getFirestoreCollection<ProjectItem>("projects", INITIAL_PROJECTS).then((data) => {
        if (data && data.length > 0) setProjects(data);
      });
      getFirestoreCollection<MagazineItem>("magazines", INITIAL_MAGAZINES).then((data) => {
        if (data && data.length > 0) setMagazines(data);
      });
      getFirestoreCollection<DocumentItem>("documents", INITIAL_DOCUMENTS).then((docs) => {
        if (docs && docs.length > 0) setDocuments(docs);
      });
      getFirestoreCollection<GalleryPhotoItem>("gallery", INITIAL_GALLERY_PHOTOS).then((data) => {
        if (data && data.length > 0) setGallery(data);
      });
      getFirestoreDoc<any>("leadership", "current", INITIAL_LEADERSHIP).then((data) => {
        if (data && (data.president || data.excoOfficers)) setLeadership(data);
      });
      getFirestoreDoc<any>("settings", "impact_stats", INITIAL_IMPACT_STATS).then((data) => {
        if (data && (data.stat1 || data.stat2)) setImpactStats(data);
      });
      getFirestoreCollection<MemberApplicant>("membership_applicants", []).then((data) => {
        setMembers(data || []);
      });
      getFirestoreCollection<ContactInquiry>("contact_inquiries", []).then((data) => {
        setInquiries(data || []);
      });
    }
  };

  const handleSaveClubProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await saveFirestoreDoc("settings", "club_profile", clubProfile);
    if (ok) showToast("Club Profile and Contact Info saved successfully!");
    else showToast("Failed to save club profile.");
  };

  const handleSaveHeroSlides = async () => {
    const ok = await saveFirestoreDoc("settings", "hero_slides", { slides: heroSlidesList });
    if (ok) showToast("Hero Carousel Slides saved successfully!");
    else showToast("Failed to save hero slides.");
  };

  const handleSaveTestimonials = async () => {
    const ok = await saveFirestoreDoc("settings", "testimonials", { testimonials: testimonialsList });
    if (ok) showToast("Testimonials saved successfully!");
    else showToast("Failed to save testimonials.");
  };

  const handleSavePillars = async () => {
    const ok = await saveFirestoreDoc("settings", "pillars", { pillars: pillarsList });
    if (ok) showToast("Service Pillars saved successfully!");
    else showToast("Failed to save pillars.");
  };

  // One-click Seed Firebase
  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    const res = await seedFirestoreData();
    setIsSeeding(false);

    if (res.success) {
      showToast(res.message);
      loadAllCloudData();
    } else {
      showToast(res.message);
    }
  };

  // Handle Login Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    setTimeout(() => {
      const validEmails = ["admin@stcleos.org", "admin", "president.stcleos@gmail.com"];
      const validPasswords = ["stcleos2024", "admin123", "leo306d8", "admin"];

      const inputUser = loginEmail.trim().toLowerCase();
      const inputPass = loginPassword.trim();

      if (validEmails.includes(inputUser) && validPasswords.includes(inputPass)) {
        setIsAuthenticated(true);
        sessionStorage.setItem("stc_leo_admin_auth", "true");
        showToast("Welcome back, Officer Admin!");
      } else {
        setLoginError("Invalid credentials. Demo login: admin@stcleos.org / stcleos2024");
      }
      setIsLoggingIn(false);
    }, 400);
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("stc_leo_admin_auth");
    setLoginEmail("");
    setLoginPassword("");
    showToast("Logged out of Admin Portal.");
  };

  // ==============================================================================
  // CRUD HANDLERS
  // ==============================================================================

  // 1. Announcements
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnSummary) return;

    const newEntry: Announcement = {
      id: `ann-${Date.now()}`,
      title: newAnnTitle,
      category: newAnnCategory,
      priority: newAnnPriority,
      date: newAnnDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      summary: newAnnSummary,
      linkUrl: newAnnLink || undefined,
      scope: newAnnScope,
    };

    setAnnouncements([newEntry, ...announcements]);
    saveFirestoreDoc("announcements", newEntry.id, newEntry);
    setIsAnnouncementModalOpen(false);
    setNewAnnTitle("");
    setNewAnnSummary("");
    setNewAnnLink("");
    showToast("Announcement published successfully!");
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    deleteFirestoreDoc("announcements", id);
    showToast("Announcement removed.");
  };

  // 2. Events
  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEvTitle || !newEvDate) return;

    const dateParts = newEvDate.split(" ");
    const month = newEvMonth || (dateParts[0] ? dateParts[0].substring(0, 3).toUpperCase() : "EVENT");
    const day = newEvDay || (dateParts[1] ? dateParts[1].replace(",", "") : "15");

    const newEntry: EventItem = {
      id: `ev-${Date.now()}`,
      title: newEvTitle,
      date: newEvDate,
      day: day,
      month: month,
      time: newEvTime || "03:30 PM",
      venue: newEvVenue || "St. Thomas' College, Matara",
      category: newEvCategory,
      description: newEvDescription || newEvTitle,
    };

    setEvents([newEntry, ...events]);
    saveFirestoreDoc("events", newEntry.id, newEntry);
    setIsEventModalOpen(false);
    setNewEvTitle("");
    setNewEvDate("");
    setNewEvTime("");
    setNewEvVenue("");
    setNewEvDescription("");
    showToast("New event added to calendar!");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    deleteFirestoreDoc("events", id);
    showToast("Event removed from calendar.");
  };

  // 3. Projects
  const handleCreateOrUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjTitle || !newProjSummary) return;

    const slug = newProjTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (editingProj) {
      const updatedProj: ProjectItem = {
        ...editingProj,
        title: newProjTitle,
        category: newProjCategory,
        directorate: newProjDirectorate,
        impactMetric: newProjMetric || "Impact Underway",
        date: newProjDate || editingProj.date,
        location: newProjLocation || editingProj.location,
        status: newProjStatus,
        summary: newProjSummary,
        volunteers: newProjVolunteers || editingProj.volunteers,
        beneficiaries: newProjBeneficiaries || editingProj.beneficiaries,
        image: newProjImage || editingProj.image,
        highlights: newProjHighlights ? newProjHighlights.split("\n").filter((h) => h.trim().length > 0) : editingProj.highlights,
      };

      setProjects(projects.map((p) => (p.id === editingProj.id ? updatedProj : p)));
      saveFirestoreDoc("projects", editingProj.id, updatedProj);
      showToast("Project updated successfully!");
    } else {
      const newEntry: ProjectItem = {
        id: `proj-${Date.now()}`,
        slug: slug || `project-${Date.now()}`,
        title: newProjTitle,
        category: newProjCategory,
        directorate: newProjDirectorate,
        impactMetric: newProjMetric || "Impact Underway",
        date: newProjDate || "2025",
        location: newProjLocation || "Matara",
        status: newProjStatus,
        summary: newProjSummary,
        volunteers: newProjVolunteers || "30+ Volunteers",
        beneficiaries: newProjBeneficiaries || "Local Community",
        image: newProjImage || "",
        highlights: newProjHighlights ? newProjHighlights.split("\n").filter((h) => h.trim().length > 0) : [],
      };

      setProjects([newEntry, ...projects]);
      saveFirestoreDoc("projects", newEntry.id, newEntry);
      showToast("New project registered successfully!");
    }

    setIsProjectModalOpen(false);
    setEditingProj(null);
    setNewProjTitle("");
    setNewProjSummary("");
    setNewProjMetric("");
    setNewProjHighlights("");
    setNewProjVolunteers("");
    setNewProjBeneficiaries("");
    setNewProjImage("");
  };

  const handleOpenEditProject = (proj: ProjectItem) => {
    setEditingProj(proj);
    setNewProjTitle(proj.title);
    setNewProjCategory(proj.category);
    setNewProjDirectorate(proj.directorate);
    setNewProjMetric(proj.impactMetric);
    setNewProjDate(proj.date);
    setNewProjLocation(proj.location);
    setNewProjStatus(proj.status);
    setNewProjSummary(proj.summary);
    setNewProjHighlights(proj.highlights ? proj.highlights.join("\n") : "");
    setNewProjVolunteers(proj.volunteers || "");
    setNewProjBeneficiaries(proj.beneficiaries || "");
    setNewProjImage(proj.image || "");
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    deleteFirestoreDoc("projects", id);
    showToast("Project removed.");
  };

  // 4. Magazines
  const handleCreateMagazine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMagTitle || !newMagSummary) return;

    const newEntry: MagazineItem = {
      id: `mag-${Date.now()}`,
      title: newMagTitle,
      edition: newMagEdition || "Leistic Year 2024/2025",
      category: newMagCategory,
      date: newMagDate || "2025",
      pages: newMagPages ? `${newMagPages} Pages` : "32 Pages",
      directorate: newMagDirectorate,
      editor: newMagEditor || "Leo Editorial Board",
      driveUrl: newMagDriveUrl || "https://drive.google.com",
      summary: newMagSummary,
      highlights: newMagHighlights ? newMagHighlights.split("\n").filter((h) => h.trim().length > 0) : [],
      isFeatured: false,
    };

    setMagazines([newEntry, ...magazines]);
    saveFirestoreDoc("magazines", newEntry.id, newEntry);
    setIsMagazineModalOpen(false);
    setNewMagTitle("");
    setNewMagEdition("");
    setNewMagDriveUrl("");
    setNewMagSummary("");
    setNewMagHighlights("");
    showToast("New magazine issue added with Google Drive link!");
  };

  const handleDeleteMagazine = (id: string) => {
    setMagazines(magazines.filter((m) => m.id !== id));
    deleteFirestoreDoc("magazines", id);
    showToast("Magazine issue removed.");
  };

  const handleUpdateDriveUrl = (magId: string) => {
    const updatedUrl = driveUrlEdits[magId];
    if (!updatedUrl) return;

    setMagazines(magazines.map((m) => (m.id === magId ? { ...m, driveUrl: updatedUrl } : m)));
    saveFirestoreDoc("magazines", magId, { driveUrl: updatedUrl });
    showToast("Google Drive link updated successfully!");
  };

  // 5. Documents
  const handleCreateOrUpdateDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle || !newDocDriveUrl) return;

    if (editingDoc) {
      const updatedDoc: DocumentItem = {
        ...editingDoc,
        title: newDocTitle,
        category: newDocCategory,
        format: newDocFormat,
        size: newDocSize || "1.0 MB",
        driveUrl: newDocDriveUrl,
        description: newDocDescription,
        updatedAt: "Updated Just Now",
      };
      setDocuments(documents.map((d) => (d.id === editingDoc.id ? updatedDoc : d)));
      saveFirestoreDoc("documents", editingDoc.id, updatedDoc);
      showToast("Official document updated successfully!");
    } else {
      const newEntry: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: newDocTitle,
        category: newDocCategory,
        format: newDocFormat,
        size: newDocSize || "1.0 MB",
        driveUrl: newDocDriveUrl,
        description: newDocDescription,
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      };
      setDocuments([newEntry, ...documents]);
      saveFirestoreDoc("documents", newEntry.id, newEntry);
      showToast("New official document published with Google Drive link!");
    }

    setIsDocumentModalOpen(false);
    setEditingDoc(null);
    setNewDocTitle("");
    setNewDocCategory("Governance & Statutes");
    setNewDocFormat("PDF Document");
    setNewDocSize("");
    setNewDocDriveUrl("");
    setNewDocDescription("");
  };

  const handleOpenEditDoc = (docItem: DocumentItem) => {
    setEditingDoc(docItem);
    setNewDocTitle(docItem.title);
    setNewDocCategory(docItem.category);
    setNewDocFormat(docItem.format);
    setNewDocSize(docItem.size);
    setNewDocDriveUrl(docItem.driveUrl);
    setNewDocDescription(docItem.description);
    setIsDocumentModalOpen(true);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter((d) => d.id !== id));
    deleteFirestoreDoc("documents", id);
    showToast("Official document removed.");
  };

  const handleUpdateDocDriveUrl = (docId: string) => {
    const updatedUrl = driveUrlDocEdits[docId];
    if (!updatedUrl) return;

    setDocuments(documents.map((d) => (d.id === docId ? { ...d, driveUrl: updatedUrl } : d)));
    saveFirestoreDoc("documents", docId, { driveUrl: updatedUrl });
    showToast("Document Google Drive link updated!");
  };

  // 6. Gallery
  const handleCreateGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalTitle || !newGalUrl) return;

    const newEntry: GalleryPhotoItem = {
      id: `gal-${Date.now()}`,
      title: newGalTitle,
      category: newGalCategory,
      url: newGalUrl,
      date: newGalDate || "Recent Highlight",
    };

    setGallery([newEntry, ...gallery]);
    saveFirestoreDoc("gallery", newEntry.id, newEntry);
    setIsGalleryModalOpen(false);
    setNewGalTitle("");
    setNewGalUrl("");
    showToast("New photo added to Media Gallery!");
  };

  const handleDeleteGalleryPhoto = (id: string) => {
    setGallery(gallery.filter((g) => g.id !== id));
    deleteFirestoreDoc("gallery", id);
    showToast("Gallery photo removed.");
  };

  // 7. Leadership / Board
  const handleSaveLeader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaderName || !newLeaderRole) return;

    const currentData = { ...leadership };
    const newMember = {
      id: editingLeader?.id || `leader-${Date.now()}`,
      name: newLeaderName,
      designation: newLeaderRole,
      faculty: newLeaderFaculty,
      email: newLeaderEmail,
      scope: newLeaderScope,
      initials: newLeaderInitials || newLeaderName.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase(),
      image: newLeaderImage || "",
      portfolio: newLeaderRole,
      category: "Portfolio Directorate",
      roleBadge: "DIRECTORATE",
    };

    if (newLeaderType === "director") {
      const dirs = currentData.directors || [];
      if (editingLeader) {
        currentData.directors = dirs.map((d: any) => (d.id === editingLeader.id ? newMember : d));
      } else {
        currentData.directors = [...dirs, newMember];
      }
    } else if (newLeaderType === "exco") {
      const exco = currentData.excoOfficers || [];
      if (editingLeader) {
        currentData.excoOfficers = exco.map((o: any) => (o.id === editingLeader.id ? newMember : o));
      } else {
        currentData.excoOfficers = [...exco, newMember];
      }
    }

    setLeadership(currentData);
    saveFirestoreDoc("leadership", "current", currentData);
    setIsLeaderModalOpen(false);
    setEditingLeader(null);
    setNewLeaderName("");
    setNewLeaderRole("");
    setNewLeaderEmail("");
    setNewLeaderScope("");
    setNewLeaderImage("");
    showToast("Leadership directory updated!");
  };

  const handleDeleteLeader = (type: "director" | "exco", id: string) => {
    const currentData = { ...leadership };
    if (type === "director") {
      currentData.directors = (currentData.directors || []).filter((d: any) => d.id !== id);
    } else {
      currentData.excoOfficers = (currentData.excoOfficers || []).filter((o: any) => o.id !== id);
    }
    setLeadership(currentData);
    saveFirestoreDoc("leadership", "current", currentData);
    showToast("Leader profile removed.");
  };

  // 8. Impact Stats
  const handleSaveImpactStats = (e: React.FormEvent) => {
    e.preventDefault();
    saveFirestoreDoc("settings", "impact_stats", impactStats);
    showToast("Impact statistics updated in Firestore!");
  };

  // 9. Members
  const handleUpdateMemberStatus = (id: string, newStatus: MemberApplicant["status"]) => {
    setMembers(members.map((m) => (m.id === id ? { ...m, status: newStatus } : m)));
    saveFirestoreDoc("membership_applicants", id, { status: newStatus });
    showToast(`Applicant status updated to ${newStatus.toUpperCase()}`);
  };

  const handleDeleteMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    deleteFirestoreDoc("membership_applicants", id);
    showToast("Applicant record removed.");
  };

  // 10. Contact Inquiries
  const handleDeleteInquiry = (id: string) => {
    setInquiries(inquiries.filter((i) => i.id !== id));
    deleteFirestoreDoc("contact_inquiries", id);
    showToast("Inquiry removed.");
  };

  // ==============================================================================
  // SEARCH FILTERING
  // ==============================================================================
  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter(
    (e) =>
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (e.venue && e.venue.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredProjectsList = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMagazinesList = magazines.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.edition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMembersList = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.faculty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = memberStatusFilter === "all" || m.status === memberStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredDocumentsList = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.format.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If checking session on initial load, show minimal spinner
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-[#050E1A] flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-leo-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium text-slate-300">Checking secure admin session...</span>
        </div>
      </div>
    );
  }

  // ==============================================================================
  // LOGIN SCREEN
  // ==============================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050E1A] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden text-slate-900">
        
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-leo-cyan/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#0B2239]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-8 sm:p-10 space-y-8 animate-in fade-in zoom-in-95 duration-200">
          
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0B2239] via-[#0EA5E9] to-[#22D3EE] flex items-center justify-center mx-auto shadow-md">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            
            <div className="space-y-1">
              <h1 className="font-heading font-extrabold text-2xl text-slate-900 tracking-tight">
                Officer Admin Portal
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Leo Club of St. Thomas' College, Matara • Leo District 306 D8
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-start gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Admin Username / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin@stcleos.org"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B2239] focus:bg-white text-slate-900 font-medium transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Password Key
                </label>
                <span className="text-[10px] text-slate-400">Default: stcleos2024</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0B2239] focus:bg-white text-slate-900 font-medium transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gradient-to-br from-[#0B2239] via-[#0EA5E9] to-[#22D3EE] bg-[length:200%_200%] bg-left hover:bg-right shadow-glow-cyan hover:shadow-glow-cyan-lg text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 transform active:scale-[0.99] disabled:opacity-75"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Access Admin Control Panel</span>
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <Link href="/" className="hover:text-[#0B2239] transition-colors flex items-center gap-1 font-semibold">
              <span>← Back to Public Website</span>
            </Link>
            <span>Leo District 306 D8</span>
          </div>

        </div>
      </div>
    );
  }

  // ==============================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // ==============================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-3 text-xs font-semibold animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-leo-cyan shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Header Bar (Clean White) */}
      <header className="bg-white text-slate-900 border-b border-slate-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Official Brand Logo & Identity */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <Link href="/" className="shrink-0 hover:opacity-90 transition-opacity">
              <StcLeoOfficialLogo
                className="h-10 sm:h-12 w-auto"
                theme="dark"
              />
            </Link>

            <div className="h-8 w-px bg-slate-200 hidden sm:block shrink-0" />

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-sm sm:text-base text-slate-900 tracking-tight truncate">
                  Officer CMS Hub
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                  isFirebaseConfigured()
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span>{isFirebaseConfigured() ? "Firestore Live" : "Local Mock"}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block truncate">
                Leo District 306 D8 • Content &amp; Membership Database
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Seed Database Button */}
            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0B2239] text-xs font-bold border border-blue-200/80 transition-all shadow-xs"
              title="Seed all initial datasets to Firebase Firestore"
            >
              <Database className={`w-3.5 h-3.5 text-[#0B2239] ${isSeeding ? "animate-spin" : ""}`} />
              <span className="hidden md:inline">{isSeeding ? "Seeding..." : "Seed Database"}</span>
            </button>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">View Live Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-500" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs Header (Matching Main Website Styling) */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 py-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { id: "overview", label: "Overview", icon: Layers, count: null },
              { id: "club_profile", label: "Club Profile & Contact", icon: Building2, count: null },
              { id: "hero_slides", label: "Hero Slides", icon: Sparkles, count: heroSlidesList.length },
              { id: "pillars", label: "Pillars", icon: Award, count: pillarsList.length },
              { id: "testimonials", label: "Testimonials", icon: MessageSquare, count: testimonialsList.length },
              { id: "announcements", label: "Announcements", icon: Megaphone, count: announcements.length },
              { id: "events", label: "Events", icon: Calendar, count: events.length },
              { id: "projects", label: "Projects", icon: FolderKanban, count: projects.length },
              { id: "magazines", label: "Magazines", icon: BookOpen, count: magazines.length },
              { id: "documents", label: "Brand & Forms", icon: FileText, count: documents.length },
              { id: "leadership", label: "Leadership Board", icon: Users, count: null },
              { id: "gallery", label: "Gallery", icon: ImageIcon, count: gallery.length },
              { id: "stats", label: "Impact Stats", icon: Sliders, count: null },
              { id: "members", label: "Applicants", icon: UserCheck, count: members.length },
              { id: "inquiries", label: "Inquiries", icon: Mail, count: inquiries.length },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isActive
                      ? "bg-[#0B2239] text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ============================================================================== */}
        {/* TAB 1: OVERVIEW DASHBOARD                                                      */}
        {/* ============================================================================== */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Executive Welcome Hero Banner (Clean Brand Pearl/White with Cyan/Navy accents matching website) */}
            <div className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-xs">
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
              <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-cyan-50/60 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-[11px] font-bold tracking-wide text-[#0B2239] uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                    <span>Officer CMS Hub • Leo District 306 D8</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold font-heading text-slate-900 tracking-tight">
                    Leo Club Content Control Hub
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    Manage and publish official website content in real time. Changes made here directly update the public landing page, projects showcase, announcements, and member systems.
                  </p>
                </div>

                <div className="shrink-0 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab("projects")}
                    className="px-4 py-2.5 rounded-xl bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Project</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("announcements")}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 font-semibold text-xs border border-slate-200/80 transition-all flex items-center gap-2"
                  >
                    <Megaphone className="w-4 h-4 text-slate-500" />
                    <span>Post News</span>
                  </button>
                  <Link
                    href="/"
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-[#0B2239] font-bold text-xs border border-blue-200 transition-all flex items-center gap-2 shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-[#0B2239]" />
                    <span>Open Live Site</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { label: "Active Projects", count: projects.length, tab: "projects", icon: FolderKanban, color: "text-[#0B2239]", bg: "bg-blue-50" },
                { label: "Hero Slides", count: heroSlidesList.length, tab: "hero_slides", icon: Sparkles, color: "text-[#7F1D2D]", bg: "bg-amber-50" },
                { label: "Service Pillars", count: pillarsList.length, tab: "pillars", icon: Award, color: "text-[#22D3EE]", bg: "bg-cyan-50" },
                { label: "Testimonials", count: testimonialsList.length, tab: "testimonials", icon: MessageSquare, color: "text-[#0B2239]", bg: "bg-blue-50" },
                { label: "Announcements", count: announcements.length, tab: "announcements", icon: Megaphone, color: "text-[#22D3EE]", bg: "bg-cyan-50" },
                { label: "Events Scheduled", count: events.length, tab: "events", icon: Calendar, color: "text-rose-600", bg: "bg-rose-50" },
                { label: "Publications", count: magazines.length, tab: "magazines", icon: BookOpen, color: "text-[#0B2239]", bg: "bg-blue-50" },
                { label: "Brand Documents", count: documents.length, tab: "documents", icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50" },
                { label: "Gallery Photos", count: gallery.length, tab: "gallery", icon: ImageIcon, color: "text-[#7F1D2D]", bg: "bg-amber-50" },
                { label: "Member Applicants", count: members.length, tab: "members", icon: UserCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.label}
                    onClick={() => setActiveTab(card.tab as any)}
                    className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md hover:border-[#0B2239] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">{card.label}</span>
                      <div className={`w-8 h-8 rounded-lg ${card.bg} ${card.color} flex items-center justify-center shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#0B2239] font-heading">
                        {card.count}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 group-hover:text-[#0B2239] flex items-center gap-0.5 transition-colors">
                        Manage <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB: CLUB PROFILE & CONTACT                                                    */}
        {/* ============================================================================== */}
        {activeTab === "club_profile" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Club Profile &amp; Contact Information</h2>
              <p className="text-xs text-slate-500">Live identity, secretariat contact numbers, meeting times, and social channels stored in Firestore.</p>
            </div>

            <form onSubmit={handleSaveClubProfile} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Official Club Name</label>
                  <input
                    type="text"
                    required
                    value={clubProfile.name || ""}
                    onChange={(e) => setClubProfile({ ...clubProfile, name: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Short Name</label>
                  <input
                    type="text"
                    required
                    value={clubProfile.shortName || ""}
                    onChange={(e) => setClubProfile({ ...clubProfile, shortName: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">District</label>
                  <input
                    type="text"
                    required
                    value={clubProfile.district || ""}
                    onChange={(e) => setClubProfile({ ...clubProfile, district: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Sponsoring Lions Club</label>
                  <input
                    type="text"
                    required
                    value={clubProfile.sponsoringLionsClub || ""}
                    onChange={(e) => setClubProfile({ ...clubProfile, sponsoringLionsClub: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tagline</label>
                  <input
                    type="text"
                    value={clubProfile.tagline || ""}
                    onChange={(e) => setClubProfile({ ...clubProfile, tagline: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={clubProfile.description || ""}
                    onChange={(e) => setClubProfile({ ...clubProfile, description: e.target.value })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-heading">Secretariat &amp; Contact Coordinates</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Official Email</label>
                    <input
                      type="email"
                      value={clubProfile.contact?.email || ""}
                      onChange={(e) => setClubProfile({ ...clubProfile, contact: { ...clubProfile.contact, email: e.target.value } })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Hotline Phone</label>
                    <input
                      type="text"
                      value={clubProfile.contact?.phone || ""}
                      onChange={(e) => setClubProfile({ ...clubProfile, contact: { ...clubProfile.contact, phone: e.target.value } })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">School Address</label>
                    <input
                      type="text"
                      value={clubProfile.contact?.address || ""}
                      onChange={(e) => setClubProfile({ ...clubProfile, contact: { ...clubProfile.contact, address: e.target.value } })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700">Meeting Schedule</label>
                    <input
                      type="text"
                      value={clubProfile.contact?.meetingSchedule || ""}
                      onChange={(e) => setClubProfile({ ...clubProfile, contact: { ...clubProfile.contact, meetingSchedule: e.target.value } })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-heading">Social Media Links</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Facebook Page URL</label>
                    <input
                      type="url"
                      value={clubProfile.contact?.socials?.facebook || ""}
                      onChange={(e) => setClubProfile({
                        ...clubProfile,
                        contact: {
                          ...clubProfile.contact,
                          socials: { ...clubProfile.contact?.socials, facebook: e.target.value }
                        }
                      })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Instagram Handle/URL</label>
                    <input
                      type="url"
                      value={clubProfile.contact?.socials?.instagram || ""}
                      onChange={(e) => setClubProfile({
                        ...clubProfile,
                        contact: {
                          ...clubProfile.contact,
                          socials: { ...clubProfile.contact?.socials, instagram: e.target.value }
                        }
                      })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">LinkedIn Company Page</label>
                    <input
                      type="url"
                      value={clubProfile.contact?.socials?.linkedin || ""}
                      onChange={(e) => setClubProfile({
                        ...clubProfile,
                        contact: {
                          ...clubProfile.contact,
                          socials: { ...clubProfile.contact?.socials, linkedin: e.target.value }
                        }
                      })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">YouTube Channel URL</label>
                    <input
                      type="url"
                      value={clubProfile.contact?.socials?.youtube || ""}
                      onChange={(e) => setClubProfile({
                        ...clubProfile,
                        contact: {
                          ...clubProfile.contact,
                          socials: { ...clubProfile.contact?.socials, youtube: e.target.value }
                        }
                      })}
                      className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Club Profile &amp; Contact</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB: HERO CAROUSEL SLIDES                                                      */}
        {/* ============================================================================== */}
        {activeTab === "hero_slides" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Homepage Hero Carousel Slides</h2>
                <p className="text-xs text-slate-500">Add, edit, or remove the background slides displayed on the main landing page.</p>
              </div>
              <button
                onClick={() => {
                  setHeroSlidesList([
                    ...heroSlidesList,
                    {
                      id: Date.now(),
                      tag: "NEW INITIATIVE",
                      title: "New Highlight Title",
                      subtitle: "Brief description of the initiative or campaign",
                      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
                    },
                  ]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slide</span>
              </button>
            </div>

            <div className="space-y-4">
              {heroSlidesList.map((slide, sIdx) => (
                <div key={slide.id || sIdx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2239]">Slide #{sIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroSlidesList(heroSlidesList.filter((_, idx) => idx !== sIdx));
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Top Tag</label>
                      <input
                        type="text"
                        value={slide.tag || ""}
                        onChange={(e) => {
                          const updated = [...heroSlidesList];
                          updated[sIdx].tag = e.target.value;
                          setHeroSlidesList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Headline Title</label>
                      <input
                        type="text"
                        value={slide.title || ""}
                        onChange={(e) => {
                          const updated = [...heroSlidesList];
                          updated[sIdx].title = e.target.value;
                          setHeroSlidesList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Subtitle</label>
                      <input
                        type="text"
                        value={slide.subtitle || ""}
                        onChange={(e) => {
                          const updated = [...heroSlidesList];
                          updated[sIdx].subtitle = e.target.value;
                          setHeroSlidesList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Image URL</label>
                      <input
                        type="text"
                        value={slide.image || ""}
                        onChange={(e) => {
                          const updated = [...heroSlidesList];
                          updated[sIdx].image = e.target.value;
                          setHeroSlidesList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSaveHeroSlides}
                  className="px-6 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save All Hero Slides</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB: SERVICE PILLARS                                                           */}
        {/* ============================================================================== */}
        {activeTab === "pillars" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Core Service Pillars</h2>
                <p className="text-xs text-slate-500">Service domains displayed on the homepage causes grid.</p>
              </div>
              <button
                onClick={() => {
                  setPillarsList([
                    ...pillarsList,
                    {
                      id: `pillar-${Date.now()}`,
                      title: "New Service Pillar",
                      tagline: "Inspiring action across communities",
                      description: "Brief summary of projects and activities in this pillar domain.",
                      icon: "HeartHandshake",
                      color: "blue",
                    },
                  ]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Pillar</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pillarsList.map((pillar, pIdx) => (
                <div key={pillar.id || pIdx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2239]">Pillar #{pIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setPillarsList(pillarsList.filter((_, idx) => idx !== pIdx));
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Pillar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-700">Title</label>
                        <input
                          type="text"
                          value={pillar.title || ""}
                          onChange={(e) => {
                            const updated = [...pillarsList];
                            updated[pIdx].title = e.target.value;
                            setPillarsList(updated);
                          }}
                          className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-700">Tagline</label>
                        <input
                          type="text"
                          value={pillar.tagline || ""}
                          onChange={(e) => {
                            const updated = [...pillarsList];
                            updated[pIdx].tagline = e.target.value;
                            setPillarsList(updated);
                          }}
                          className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-700">Description</label>
                      <textarea
                        rows={2}
                        value={pillar.description || ""}
                        onChange={(e) => {
                          const updated = [...pillarsList];
                          updated[pIdx].description = e.target.value;
                          setPillarsList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSavePillars}
                className="px-6 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Service Pillars</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB: TESTIMONIALS                                                              */}
        {/* ============================================================================== */}
        {activeTab === "testimonials" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Member Reflections &amp; Testimonials</h2>
                <p className="text-xs text-slate-500">Student reflections, leader quotes, and advisor testimonials.</p>
              </div>
              <button
                onClick={() => {
                  setTestimonialsList([
                    ...testimonialsList,
                    {
                      id: `test-${Date.now()}`,
                      quote: "Being a Leo gave me purpose and the opportunity to lead transformative projects.",
                      author: "Leo Member Name",
                      role: "Director of Portfolio (2024/25)",
                      faculty: "St. Thomas' College, Matara",
                      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                      tag: "LEADERSHIP & SERVICE",
                    },
                  ]);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="space-y-4">
              {testimonialsList.map((test, tIdx) => (
                <div key={test.id || tIdx} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0B2239]">Testimonial #{tIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTestimonialsList(testimonialsList.filter((_, idx) => idx !== tIdx));
                      }}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Author Name</label>
                      <input
                        type="text"
                        value={test.author || ""}
                        onChange={(e) => {
                          const updated = [...testimonialsList];
                          updated[tIdx].author = e.target.value;
                          setTestimonialsList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Designation / Role</label>
                      <input
                        type="text"
                        value={test.role || ""}
                        onChange={(e) => {
                          const updated = [...testimonialsList];
                          updated[tIdx].role = e.target.value;
                          setTestimonialsList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Faculty / Advisory Body</label>
                      <input
                        type="text"
                        value={test.faculty || ""}
                        onChange={(e) => {
                          const updated = [...testimonialsList];
                          updated[tIdx].faculty = e.target.value;
                          setTestimonialsList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700">Avatar Image URL</label>
                      <input
                        type="text"
                        value={test.avatar || ""}
                        onChange={(e) => {
                          const updated = [...testimonialsList];
                          updated[tIdx].avatar = e.target.value;
                          setTestimonialsList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700">Quote / Reflection</label>
                      <textarea
                        rows={3}
                        value={test.quote || ""}
                        onChange={(e) => {
                          const updated = [...testimonialsList];
                          updated[tIdx].quote = e.target.value;
                          setTestimonialsList(updated);
                        }}
                        className="w-full p-2 text-xs bg-slate-50 border rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveTestimonials}
                className="px-6 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save All Testimonials</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 2: ANNOUNCEMENTS MANAGER                                                   */}
        {/* ============================================================================== */}
        {activeTab === "announcements" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Club Announcements</h2>
                <p className="text-xs text-slate-500">Manage official circulars and broadcasts displayed across the site.</p>
              </div>
              <button
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Announcement</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAnnouncements.map((ann) => (
                <div key={ann.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#0B2239] bg-blue-50 px-2 py-0.5 rounded">
                        {ann.category}
                      </span>
                      <span className="text-xs text-slate-400">{ann.date}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{ann.summary}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 truncate max-w-[200px]">{ann.scope}</span>
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 3: EVENTS MANAGER                                                          */}
        {/* ============================================================================== */}
        {activeTab === "events" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Events &amp; Timeline Calendar</h2>
                <p className="text-xs text-slate-500">Upcoming leadership summits, installations, and field missions.</p>
              </div>
              <button
                onClick={() => setIsEventModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Event</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredEvents.map((ev) => (
                <div key={ev.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0B2239] border border-blue-100 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-mono font-bold uppercase">{ev.month || "EV"}</span>
                      <span className="text-lg font-bold font-heading leading-none">{ev.day || "15"}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#0B2239] bg-blue-50 px-2 py-0.5 rounded">
                          {ev.category || "General"}
                        </span>
                        <span className="text-xs text-slate-400">{ev.date}</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">{ev.title}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{ev.venue} • {ev.time}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    className="self-end sm:self-center text-rose-500 hover:text-rose-700 p-2 rounded hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 4: PROJECTS MANAGER                                                        */}
        {/* ============================================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Humanitarian Projects</h2>
                <p className="text-xs text-slate-500">Service initiatives, metrics, and case studies.</p>
              </div>
              <button
                onClick={() => {
                  setEditingProj(null);
                  setNewProjTitle("");
                  setNewProjSummary("");
                  setIsProjectModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjectsList.map((proj) => (
                <div key={proj.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#0B2239] bg-blue-50 px-2 py-0.5 rounded">
                        {proj.category}
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">{proj.status}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.title}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3">{proj.summary}</p>
                    <div className="text-[11px] font-semibold text-[#0B2239] bg-slate-50 p-2 rounded-lg">
                      📊 {proj.impactMetric}
                    </div>
                  </div>

                  <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      onClick={() => handleOpenEditProject(proj)}
                      className="text-[#0B2239] hover:underline font-semibold flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 5: MAGAZINES & PUBLICATIONS                                                */}
        {/* ============================================================================== */}
        {activeTab === "magazines" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">ROAR Magazines &amp; Gazettes</h2>
                <p className="text-xs text-slate-500">Manage issue releases and Google Drive PDF download links.</p>
              </div>
              <button
                onClick={() => setIsMagazineModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Issue</span>
              </button>
            </div>

            <div className="space-y-4">
              {filteredMagazinesList.map((mag) => (
                <div key={mag.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B2239] border border-blue-100 flex items-center justify-center shrink-0">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#0B2239] bg-blue-50 px-2 py-0.5 rounded uppercase">
                          {mag.category}
                        </span>
                        <span className="text-xs text-slate-400">{mag.date} • {mag.pages}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{mag.title}</h3>
                      <p className="text-xs text-slate-500">{mag.edition} • {mag.editor}</p>
                    </div>
                  </div>

                  {/* Drive URL update inline */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Google Drive URL"
                      defaultValue={mag.driveUrl}
                      onChange={(e) => setDriveUrlEdits({ ...driveUrlEdits, [mag.id]: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-full sm:w-60 focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdateDriveUrl(mag.id)}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      Save Link
                    </button>
                    <button
                      onClick={() => handleDeleteMagazine(mag.id)}
                      className="text-rose-500 hover:text-rose-700 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 6: DOCUMENTS & BRAND FORMS                                                 */}
        {/* ============================================================================== */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Brand Forms &amp; Governance Documents</h2>
                <p className="text-xs text-slate-500">Official downloadable constitutions, project proposals, and induction forms.</p>
              </div>
              <button
                onClick={() => {
                  setEditingDoc(null);
                  setNewDocTitle("");
                  setIsDocumentModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Upload / Add Form</span>
              </button>
            </div>

            <div className="space-y-3">
              {filteredDocumentsList.map((docItem) => (
                <div key={docItem.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{docItem.category}</span>
                        <span className="text-[11px] text-slate-400">• {docItem.format} ({docItem.size})</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">{docItem.title}</h3>
                      <p className="text-xs text-slate-500">{docItem.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="text"
                      placeholder="Google Drive Download URL"
                      defaultValue={docItem.driveUrl}
                      onChange={(e) => setDriveUrlDocEdits({ ...driveUrlDocEdits, [docItem.id]: e.target.value })}
                      className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-full sm:w-56 focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleUpdateDocDriveUrl(docItem.id)}
                      className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleOpenEditDoc(docItem)}
                      className="text-[#0B2239] p-2 hover:bg-slate-50 rounded"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(docItem.id)}
                      className="text-rose-500 p-2 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 7: LEADERSHIP & BOARD DIRECTORY                                            */}
        {/* ============================================================================== */}
        {activeTab === "leadership" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Executive Committee &amp; Directors</h2>
                <p className="text-xs text-slate-500">Manage board appointments, advisor profiles, and leadership portfolios.</p>
              </div>
              <button
                onClick={() => {
                  setEditingLeader(null);
                  setNewLeaderName("");
                  setNewLeaderRole("");
                  setIsLeaderModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Leader / Director</span>
              </button>
            </div>

            {/* ExCo Officers */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Top Table Executive Officers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(leadership?.excoOfficers || []).map((officer: any) => (
                  <div key={officer.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#0B2239] uppercase">{officer.roleBadge || "EXCO"}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{officer.designation}</h4>
                      <p className="text-xs text-[#0B2239] font-medium">{officer.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{officer.faculty}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{officer.email}</span>
                      <button
                        onClick={() => handleDeleteLeader("exco", officer.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Directors */}
            <div className="space-y-3 pt-4">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Portfolio Directors</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(leadership?.directors || []).map((dir: any) => (
                  <div key={dir.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{dir.category || "Directorate"}</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{dir.portfolio}</h4>
                      <p className="text-xs text-[#0B2239] font-medium">{dir.name}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{dir.faculty}</p>
                    </div>
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400 truncate max-w-[140px]">{dir.email}</span>
                      <button
                        onClick={() => handleDeleteLeader("director", dir.id)}
                        className="text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 8: MEDIA GALLERY MANAGER                                                   */}
        {/* ============================================================================== */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Media Photo Highlights</h2>
                <p className="text-xs text-slate-500">Service photos, fellowship trips, and installation ceremonies.</p>
              </div>
              <button
                onClick={() => setIsGalleryModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Gallery Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((photo) => (
                <div key={photo.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
                  <div className="h-44 bg-slate-100 relative">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-xs">
                      {photo.category}
                    </span>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{photo.title}</h4>
                    <button
                      onClick={() => handleDeleteGalleryPhoto(photo.id)}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 9: IMPACT STATS MANAGER                                                    */}
        {/* ============================================================================== */}
        {activeTab === "stats" && (
          <div className="max-w-2xl bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Home Page Impact Statistics</h2>
              <p className="text-xs text-slate-500">Live numerical figures displayed on the home page impact counter matrix.</p>
            </div>

            <form onSubmit={handleSaveImpactStats} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stat 1 Value (e.g. 1)</label>
                  <input
                    type="text"
                    value={impactStats?.stat1?.value || ""}
                    onChange={(e) => setImpactStats({
                      ...impactStats,
                      stat1: { ...impactStats.stat1, value: e.target.value }
                    })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stat 2 Value (e.g. 150+)</label>
                  <input
                    type="text"
                    value={impactStats?.stat2?.value || ""}
                    onChange={(e) => setImpactStats({
                      ...impactStats,
                      stat2: { ...impactStats.stat2, value: e.target.value }
                    })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stat 3 Value (e.g. 6,500+)</label>
                  <input
                    type="text"
                    value={impactStats?.stat3?.value || ""}
                    onChange={(e) => setImpactStats({
                      ...impactStats,
                      stat3: { ...impactStats.stat3, value: e.target.value }
                    })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Stat 4 Value (e.g. 60+)</label>
                  <input
                    type="text"
                    value={impactStats?.stat4?.value || ""}
                    onChange={(e) => setImpactStats({
                      ...impactStats,
                      stat4: { ...impactStats.stat4, value: e.target.value }
                    })}
                    className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Impact Narrative Description</label>
                <textarea
                  rows={3}
                  value={impactStats?.description || ""}
                  onChange={(e) => setImpactStats({
                    ...impactStats,
                    description: e.target.value
                  })}
                  className="w-full p-2.5 text-xs bg-slate-50 border rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 bg-[#0B2239] hover:bg-[#071A2B] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Save Impact Stats
              </button>
            </form>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 10: MEMBER APPLICANTS MANAGER                                              */}
        {/* ============================================================================== */}
        {activeTab === "members" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-heading">Student Member Applications</h2>
                <p className="text-xs text-slate-500">Registrations submitted from the public /join recruitment form.</p>
              </div>

              <div className="flex items-center gap-2">
                {["all", "pending", "approved", "inducted"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setMemberStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase ${
                      memberStatusFilter === status
                        ? "bg-[#0B2239] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredMembersList.map((mem) => (
                <div key={mem.id} className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        mem.status === "approved" ? "bg-emerald-50 text-emerald-700" :
                        mem.status === "inducted" ? "bg-purple-50 text-purple-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {mem.status}
                      </span>
                      <span className="text-xs text-slate-400">{mem.regNo} • Applied {mem.appliedDate}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{mem.name}</h3>
                    <p className="text-xs text-slate-600">{mem.faculty} • {mem.academicYear}</p>
                    <p className="text-xs text-slate-500">📧 {mem.email} | 📞 {mem.phone}</p>
                    <p className="text-xs text-slate-600 italic">Interests: {mem.interests}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 self-start md:self-center">
                    <button
                      onClick={() => handleUpdateMemberStatus(mem.id, "approved")}
                      className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-100"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdateMemberStatus(mem.id, "inducted")}
                      className="px-2.5 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold hover:bg-purple-100"
                    >
                      Induct
                    </button>
                    <button
                      onClick={() => handleDeleteMember(mem.id)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================================== */}
        {/* TAB 11: CONTACT INQUIRIES                                                      */}
        {/* ============================================================================== */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">Public &amp; Sponsor Contact Inquiries</h2>
              <p className="text-xs text-slate-500">Messages sent via the public Secretariat contact form.</p>
            </div>

            {inquiries.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                No new contact messages received yet.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900">{inq.subject}</h3>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl">{inq.message}</p>
                    <div className="text-[11px] text-slate-400 flex items-center gap-3">
                      <span>From: <strong>{inq.name}</strong> ({inq.email})</span>
                      <span>•</span>
                      <span>{inq.receivedDate ? new Date(inq.receivedDate).toLocaleDateString() : "Recent"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ============================================================================== */}
      {/* MODALS FOR CREATING / EDITING DATA                                             */}
      {/* ============================================================================== */}

      {/* 1. Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                {editingProj ? "Edit Humanitarian Project" : "Add Humanitarian Project"}
              </h3>
              <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateProject} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project Sipnana Phase III"
                  value={newProjTitle}
                  onChange={(e) => setNewProjTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Category</label>
                  <select
                    value={newProjCategory}
                    onChange={(e) => setNewProjCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Environment">Environment</option>
                    <option value="Community">Community</option>
                    <option value="Youth Development">Youth Development</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status</label>
                  <select
                    value={newProjStatus}
                    onChange={(e) => setNewProjStatus(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Annual Flagship">Annual Flagship</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Key Impact Metric</label>
                <input
                  type="text"
                  placeholder="e.g. 500+ Students Supported"
                  value={newProjMetric}
                  onChange={(e) => setNewProjMetric(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Summary Narrative</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Project scope and details..."
                  value={newProjSummary}
                  onChange={(e) => setNewProjSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Key Highlights (1 per line)</label>
                <textarea
                  rows={3}
                  placeholder="Highlight 1&#10;Highlight 2"
                  value={newProjHighlights}
                  onChange={(e) => setNewProjHighlights(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2239] hover:bg-[#071A2B] text-white rounded-xl font-bold"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">Publish Announcement</h3>
              <button onClick={() => setIsAnnouncementModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Announcement Title"
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <textarea
                required
                rows={3}
                placeholder="Summary description..."
                value={newAnnSummary}
                onChange={(e) => setNewAnnSummary(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Registration / Form Link (Optional)"
                value={newAnnLink}
                onChange={(e) => setNewAnnLink(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAnnouncementModalOpen(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B2239] text-white font-bold rounded-xl">
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Event Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">Add Timeline Event</h3>
              <button onClick={() => setIsEventModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Event Title"
                value={newEvTitle}
                onChange={(e) => setNewEvTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Date e.g. July 26, 2025"
                  value={newEvDate}
                  onChange={(e) => setNewEvDate(e.target.value)}
                  className="p-2.5 bg-slate-50 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Time e.g. 04:30 PM"
                  value={newEvTime}
                  onChange={(e) => setNewEvTime(e.target.value)}
                  className="p-2.5 bg-slate-50 border rounded-xl"
                />
              </div>
              <input
                type="text"
                placeholder="Venue e.g. St. Thomas' College Auditorium"
                value={newEvVenue}
                onChange={(e) => setNewEvVenue(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <textarea
                rows={2}
                placeholder="Description..."
                value={newEvDescription}
                onChange={(e) => setNewEvDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsEventModalOpen(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B2239] text-white font-bold rounded-xl">
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Magazine Modal */}
      {isMagazineModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">Add Magazine Issue</h3>
              <button onClick={() => setIsMagazineModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateMagazine} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Magazine Title e.g. ROAR Vol 07"
                value={newMagTitle}
                onChange={(e) => setNewMagTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Edition e.g. Leistic Year 2024/2025"
                value={newMagEdition}
                onChange={(e) => setNewMagEdition(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                required
                placeholder="Google Drive PDF Shareable Link"
                value={newMagDriveUrl}
                onChange={(e) => setNewMagDriveUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <textarea
                required
                rows={3}
                placeholder="Issue Summary & Highlights..."
                value={newMagSummary}
                onChange={(e) => setNewMagSummary(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsMagazineModalOpen(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B2239] text-white font-bold rounded-xl">
                  Publish Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Document Modal */}
      {isDocumentModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">
                {editingDoc ? "Edit Official Document" : "Add Brand Form / Document"}
              </h3>
              <button onClick={() => setIsDocumentModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateOrUpdateDocument} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Document Title"
                value={newDocTitle}
                onChange={(e) => setNewDocTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                required
                placeholder="Google Drive Shareable Link"
                value={newDocDriveUrl}
                onChange={(e) => setNewDocDriveUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <textarea
                rows={2}
                placeholder="Brief description of usage..."
                value={newDocDescription}
                onChange={(e) => setNewDocDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsDocumentModalOpen(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B2239] text-white font-bold rounded-xl">
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">Add Gallery Photo</h3>
              <button onClick={() => setIsGalleryModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateGalleryPhoto} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Photo Title / Caption"
                value={newGalTitle}
                onChange={(e) => setNewGalTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                required
                placeholder="Image URL (Unsplash or direct image URL)"
                value={newGalUrl}
                onChange={(e) => setNewGalUrl(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <select
                value={newGalCategory}
                onChange={(e) => setNewGalCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              >
                <option value="community">Community Service</option>
                <option value="fellowship">Fellowship &amp; Camps</option>
                <option value="ceremonies">Installations &amp; Awards</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsGalleryModalOpen(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B2239] text-white font-bold rounded-xl">
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Leader Modal */}
      {isLeaderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-heading text-slate-900">Add Leader / Director</h3>
              <button onClick={() => setIsLeaderModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveLeader} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Full Name (e.g. Leo Kavindu Dilshan)"
                value={newLeaderName}
                onChange={(e) => setNewLeaderName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                required
                placeholder="Role / Portfolio Designation"
                value={newLeaderRole}
                onChange={(e) => setNewLeaderRole(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="text"
                placeholder="Faculty / advisory body"
                value={newLeaderFaculty}
                onChange={(e) => setNewLeaderFaculty(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={newLeaderEmail}
                onChange={(e) => setNewLeaderEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <textarea
                rows={2}
                placeholder="Scope of responsibilities..."
                value={newLeaderScope}
                onChange={(e) => setNewLeaderScope(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border rounded-xl"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsLeaderModalOpen(false)} className="px-3 py-2 bg-slate-100 rounded-xl font-semibold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-[#0B2239] text-white font-bold rounded-xl">
                  Save Leader
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
