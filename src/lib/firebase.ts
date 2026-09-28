import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  Firestore,
  addDoc,
  serverTimestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";

// Firebase credentials configuration from environment variables (client-safe)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Checks if Firebase has been configured with real non-placeholder credentials
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      !firebaseConfig.apiKey.includes("your_api_key") &&
      !firebaseConfig.projectId.includes("your_project_id")
  );
}

// Safe singleton Firebase app initialization
let app: FirebaseApp | undefined = undefined;
let db: Firestore | undefined = undefined;
let auth: Auth | undefined = undefined;

if (typeof window !== "undefined" || isFirebaseConfigured()) {
  try {
    if (isFirebaseConfigured()) {
      app = getApps().length ? getApp() : initializeApp(firebaseConfig);
      db = getFirestore(app);
      auth = getAuth(app);
    }
  } catch (error) {
    console.warn("Firebase initialization skipped or encountered error:", error);
  }
}

export { app, db, auth };

// ==============================================================================
// INITIAL SEED DATASETS FOR LEO CLUB OF ST. THOMAS' COLLEGE (PURE TYPESCRIPT CONSTANTS)
// ==============================================================================

export const INITIAL_PROJECTS = [
  {
    id: "proj-stc-1",
    slug: "wagging-tails",
    title: "Wagging Tails",
    category: "Animal Welfare",
    directorate: "Directorate of Community Service & Environmental",
    icon: "HeartHandshake",
    color: "rose",
    summary:
      "An ongoing animal welfare initiative caring for stray and community animals around Matara — feeding drives, basic care support, and awareness on the humane treatment of animals.",
    impactMetric: "Ongoing Initiative",
    date: "Leistic Year 2026/27",
    location: "Matara",
    status: "Ongoing",
    volunteers: "Leo Volunteers",
    beneficiaries: "Community & Stray Animals of Matara",
    highlights: [
      "Regular feeding and welfare check drives for stray animals in the area.",
      "Awareness sessions on humane treatment and responsible pet care.",
      "Collaboration with the wider school community to sustain the initiative.",
    ],
    image: "",
  },
  {
    id: "proj-stc-2",
    slug: "heena-arunalu",
    title: "Heena Arunalu",
    category: "Community Service",
    directorate: "Directorate of Joint Projects",
    icon: "Users",
    color: "indigo",
    summary:
      "A community and social welfare project supporting underprivileged families and individuals in and around Matara, reflecting the club's commitment to social responsibility.",
    impactMetric: "Ongoing Initiative",
    date: "Leistic Year 2026/27",
    location: "Matara",
    status: "Ongoing",
    volunteers: "Leo Volunteers",
    beneficiaries: "Underprivileged Families in Matara",
    highlights: [
      "Outreach visits and welfare support for families in need.",
      "Community engagement activities led by club members.",
      "A continuing project under the club's social welfare focus.",
    ],
    image: "",
  },
  {
    id: "proj-stc-3",
    slug: "drug-prevention",
    title: "Drug Prevention",
    category: "Health Awareness",
    directorate: "Directorate of Community Service & Environmental",
    icon: "ShieldAlert",
    color: "amber",
    summary:
      "A health and youth awareness project educating schoolchildren and young people on the dangers of substance abuse, promoting healthy, drug-free lifestyles.",
    impactMetric: "Ongoing Initiative",
    date: "Leistic Year 2026/27",
    location: "Matara",
    status: "Ongoing",
    volunteers: "Leo Volunteers",
    beneficiaries: "Schoolchildren & Youth of Matara",
    highlights: [
      "Awareness sessions on the dangers of drug and substance abuse.",
      "Youth-focused health education programs.",
      "Delivered in partnership with the school community and advisors.",
    ],
    image: "",
  },
];

export const INITIAL_MAGAZINES: any[] = [];

export const INITIAL_DOCUMENTS = [
  {
    id: "doc-1",
    title: "Leo Club Constitution & By-Laws",
    category: "Governance & Statutes",
    description:
      "Official club constitution, governance framework, election procedures, and membership duties accredited by Leo District 306 D8.",
    format: "PDF Document",
    size: "—",
    driveUrl: "",
    updatedAt: "Leistic Year 2026/27",
  },
  {
    id: "doc-2",
    title: "Membership Application Form",
    category: "Membership & Induction",
    description:
      "Official registration and profile submission form for prospective student members of the club.",
    format: "PDF / DOCX",
    size: "—",
    driveUrl: "",
    updatedAt: "Leistic Year 2026/27",
  },
  {
    id: "doc-3",
    title: "Project Proposal & Budget Template",
    category: "Project Management",
    description:
      "Standardized project proposal blueprint including executive summary, committee roster, action timeline, and budget estimates.",
    format: "DOCX Document",
    size: "—",
    driveUrl: "",
    updatedAt: "Leistic Year 2026/27",
  },
  {
    id: "doc-4",
    title: "Post-Project Evaluation Report",
    category: "Reporting & Auditing",
    description:
      "Project completion reporting template detailing community impact, expenditure, and photo documentation.",
    format: "DOCX Document",
    size: "—",
    driveUrl: "",
    updatedAt: "Leistic Year 2026/27",
  },
];

export const INITIAL_LEADERSHIP = {
  leisticYear: "2026/2027",
  district: "Leo District 306 D8",
  sponsoringClub: "Lions Club of Ruhunu Millennium",
  charterSince: "2024",
  photosDriveUrl: "",
  stats: [
    { label: "Advisory Mentors", value: "03", desc: "Staff Advisors & Guiding Lion" },
    { label: "Executive Officers", value: "09", desc: "Top Table Management" },
    { label: "Board of Directors", value: "07", desc: "Portfolio Directors" },
  ],
  advisoryCouncil: [
    {
      id: "adv-1",
      category: "Staff Mentorship",
      roleBadge: "CLUB STAFF ADVISOR",
      title: "Club Staff Advisor",
      name: "Mrs. Indika Chathurani",
      designation: "Club Staff Advisor",
      institution: "St. Thomas' College, Matara",
      scope:
        "Provides day-to-day guidance to the club's executive board and oversees adherence to the school's standards in all club activities.",
      email: "indjayasekara@gmail.com",
      initials: "IC",
      image: "/advisor/indika.jpeg",
    },
    {
      id: "adv-2",
      category: "Staff Mentorship",
      roleBadge: "CLUB STAFF ADVISOR",
      title: "Club Staff Advisor",
      name: "Mrs. Sahindi Alas",
      designation: "Club Staff Advisor",
      institution: "St. Thomas' College, Matara",
      scope:
        "Supports the club's programs and mentors student leaders in planning and delivering community service initiatives.",
      email: "sahindi97alles@gmail.com ",
      initials: "SA",
      image: "/advisor/sahindi.jpeg",
    },
    {
      id: "adv-3",
      category: "LCI District Governance",
      roleBadge: "GUIDING LION",
      title: "Leo Club Advisor (Guiding Lion)",
      name: "Lion Rashmi Purasinghe",
      designation: "Deputy Cabinet Secretary",
      institution: "Lions Club of Ruhunu Millennium • Leo District 306 D8",
      scope:
        "Ensures adherence to the Lions Clubs International Constitution, mentors club officers on youth leadership stewardship, and coordinates district engagement.",
      email: "rashmipurasinghe@yahoo.com",
      initials: "RP",
      image: "/advisor/rashmi.jpeg",
    },
  ],
  president: {
    id: "exco-pres",
    roleBadge: "CLUB PRESIDENT & CEO",
    designation: "Club President",
    name: "Leo Sanija Bathila",
    faculty: "St. Thomas' College, Matara",
    institution: "St. Thomas' College, Matara",
    term: "Leistic Year 2026/2027",
    responsibilities:
      "Presides over all executive and general assemblies, directs the club's overall strategic vision, represents the club at Leo District 306 D8 events, and stewards community service initiatives.",
    email: "",
    motto: "“Leadership, Experience, Opportunity — leading with purpose for St. Thomas' College and Matara.”",
    initials: "SB",
    image: "/exco/sanija.jpg",
  },
  ipp: null as any,
  excoOfficers: [
    {
      id: "exco-vp1",
      roleBadge: "TOP TABLE OFFICER",
      designation: "1st Vice President",
      name: "Leo Ravindu Mudalige",
      faculty: "St. Thomas' College, Matara",
      scope:
        "Directs project directorate coordination, supervises internal operational logistics, and represents the President in executive assemblies.",
      email: "",
      initials: "RM",
      color: "cyan",
      image: "/exco/ravindu.jpeg",
    },
    {
      id: "exco-vp2",
      roleBadge: "TOP TABLE OFFICER",
      designation: "2nd Vice President",
      name: "Leo Haseen Himansana",
      faculty: "St. Thomas' College, Matara",
      scope: "Assists with portfolio administration, membership engagement, and inter-club collaboration.",
      email: "",
      initials: "HH",
      color: "blue",
      image: "/exco/haseen.jpg",
    },
    {
      id: "exco-vp3",
      roleBadge: "TOP TABLE OFFICER",
      designation: "3rd Vice President",
      name: "Leo Dovindu Himash",
      faculty: "St. Thomas' College, Matara",
      scope: "Supports the Top Table with project coordination and general assembly operations.",
      email: "",
      initials: "DH",
      color: "blue",
      image: "/exco/dovindu.jpg",
    },
    {
      id: "exco-sec",
      roleBadge: "TOP TABLE OFFICER",
      designation: "Secretary",
      name: "Leo Haamid Muhammed",
      faculty: "St. Thomas' College, Matara",
      scope:
        "Stewards official records, meeting minutes, district activity reporting, and inter-club correspondence.",
      email: "",
      initials: "HM",
      color: "blue",
      image: "/exco/haamid.jpg",
    },
    {
      id: "exco-tre",
      roleBadge: "TOP TABLE OFFICER",
      designation: "Club Treasurer",
      name: "Leo Esandu Mathagadeera",
      faculty: "St. Thomas' College, Matara",
      scope:
        "Manages treasury accounts, oversees project funding allocations, and ensures fiscal accountability.",
      email: "",
      initials: "EM",
      color: "emerald",
      image: "/exco/esandu.jpg",
    },
    {
      id: "exco-asst-tre",
      roleBadge: "EXECUTIVE COUNCIL",
      designation: "Assistant Treasurer",
      name: "Leo Hesandu Minrada",
      faculty: "St. Thomas' College, Matara",
      scope: "Assists in financial bookkeeping, project budget tracking, and treasury records.",
      email: "",
      initials: "HM",
      color: "emerald",
      image: "/exco/hesandu.jpg",
    },
    {
      id: "exco-asst-sec",
      roleBadge: "EXECUTIVE COUNCIL",
      designation: "Assistant Secretary",
      name: "Leo Luthira Yapa",
      faculty: "St. Thomas' College, Matara",
      scope: "Maintains official membership rolls, secretarial dispatch, and meeting attendance records.",
      email: "",
      initials: "LY",
      color: "amber",
      image: "/exco/luthira.jpg",
    },
    {
      id: "exco-coord",
      roleBadge: "EXECUTIVE COUNCIL",
      designation: "Chief Coordinator",
      name: "Leo Ahas Samarawickrama",
      faculty: "St. Thomas' College, Matara",
      scope: "Coordinates cross-portfolio logistics, venue management, and assembly operations.",
      email: "",
      initials: "AS",
      color: "indigo",
      image: "/exco/ahas.jpg",
    },
  ],
  directors: [
    {
      id: "dir-1",
      portfolio: "Administration",
      designation: "Director of Administration",
      name: "Leo Viduna Bosara",
      faculty: "St. Thomas' College, Matara",
      scope: "Oversees administrative operations, internal coordination, and board governance support.",
      email: "",
      initials: "VB",
      image: "/director/viduna.jpg",
    },
    {
      id: "dir-2",
      portfolio: "PR & Media",
      designation: "Director of PR & Media",
      name: "Leo Manul Yoshitha",
      faculty: "St. Thomas' College, Matara",
      scope: "Directs club publications, social media presence, and public relations.",
      email: "",
      initials: "MY",
      image: "/director/manul.jpg",
    },
    {
      id: "dir-3",
      portfolio: "Fundraising",
      designation: "Director of Fundraising",
      name: "Leo Enuka Henuka",
      faculty: "St. Thomas' College, Matara",
      scope: "Leads fundraising strategy and financial sustainability initiatives for club projects.",
      email: "",
      initials: "EH",
      image: "/director/enuka.jpg",
    },
    {
      id: "dir-4",
      portfolio: "Fundraising",
      designation: "Board of Directors",
      name: "Leo Himesh Gimhan",
      faculty: "St. Thomas' College, Matara",
      scope: "Supports the fundraising directorate in planning and executing club initiatives.",
      email: "",
      initials: "HG",
      image: "/director/himesh.jpg",
    },
    {
      id: "dir-5",
      portfolio: "Joint Projects",
      designation: "Director of Joint Projects",
      name: "Leo Dinada Bulegoda",
      faculty: "St. Thomas' College, Matara",
      scope: "Coordinates joint projects with the sponsoring Lions Club and partner organizations.",
      email: "",
      initials: "DB",
      image: "/director/dinada.jpg",
    },
    {
      id: "dir-6",
      portfolio: "Joint Projects",
      designation: "Board of Directors",
      name: "Leo Chanithu Randira",
      faculty: "St. Thomas' College, Matara",
      scope: "Supports the joint projects directorate in planning and delivery.",
      email: "",
      initials: "CR",
      image: "/director/chanithu.jpg",
    },
    {
      id: "dir-7",
      portfolio: "Community Service & Environmental",
      designation: "Director of Community Service & Environmental",
      name: "Leo Thamindu Thathsara",
      faculty: "St. Thomas' College, Matara",
      scope:
        "Leads community service and environmental initiatives, including Wagging Tails and Drug Prevention.",
      email: "",
      initials: "TT",
      image: "/director/thamindu.jpg",
    },
  ],
  assistantDirectors: [] as any[],
  creativeCrew: [] as any[],
  signatureProjects: [
    {
      id: "sig-proj-1",
      title: "Wagging Tails",
      subtitle: "Animal Welfare Initiative",
      scope: "Caring for and supporting the welfare of stray and community animals in Matara.",
      category: "Animal Welfare",
      tag: "Ongoing",
    },
    {
      id: "sig-proj-2",
      title: "Heena Arunalu",
      subtitle: "Community & Social Welfare Project",
      scope: "Supporting underprivileged families and communities in and around Matara.",
      category: "Community Service",
      tag: "Ongoing",
    },
    {
      id: "sig-proj-3",
      title: "Drug Prevention",
      subtitle: "Health & Youth Awareness Project",
      scope: "Raising awareness among schoolchildren and youth on the dangers of substance abuse.",
      category: "Health Awareness",
      tag: "Ongoing",
    },
  ],
  milestoneEvents: [
    {
      id: "event-installation",
      title: "Installation of Officers",
      date: "Leistic Year 2026/27",
      venue: "St. Thomas' College, Matara",
      desc: "Formal induction of the newly elected Executive Board and Director Board for 2026/27.",
    },
    {
      id: "event-charter",
      title: "Club Charter",
      date: "Since 2024",
      venue: "St. Thomas' College, Matara",
      desc: "Marking the founding of the Leo Club of St. Thomas' College under Leo District 306 D8.",
    },
  ],
  governance: {
    title: "Official Governance Hierarchy & Lion Mentorship",
    description:
      "Operating under the charter of Lions Clubs International and the mentorship of the sponsoring Lions Club of Ruhunu Millennium (Leo District 306 D8), our leadership hierarchy enforces transparency, student-led accountability, and strict adherence to the LCI Leo Club Constitution.",
    badges: [
      { label: "Charter / Since", value: "2024" },
      { label: "District Code", value: "Leo District 306 D8" },
      { label: "Sponsoring Parent", value: "Lions Club of Ruhunu Millennium" },
      { label: "School Base", value: "St. Thomas' College, Matara" },
    ],
  },
};

export const INITIAL_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Membership Drive for Leistic Year 2026/27",
    category: "Membership",
    priority: "high" as const,
    date: "Leistic Year 2026/27",
    summary:
      "Registration is open for St. Thomas' College students interested in joining the Leo Club and its community service initiatives.",
    linkUrl: "/join",
    scope: "All St. Thomas' College Students",
  },
  {
    id: "ann-2",
    title: "Executive Board & Director Board Assembly",
    category: "Administration",
    priority: "normal" as const,
    date: "Leistic Year 2026/27",
    summary: "Regular review of ongoing projects and planning for upcoming community initiatives.",
    scope: "Executive Board & Directors",
  },
];

export const INITIAL_EVENTS = [
  {
    id: "ev-1",
    title: "Installation of Officers 2026/27",
    date: "Date to be announced",
    day: "TBA",
    month: "",
    time: "To be announced",
    venue: "St. Thomas' College, Matara",
    category: "Ceremony",
    description:
      "Official installation ceremony of the incoming Executive Board and Director Board for the 2026/27 Leistic Year.",
  },
  {
    id: "ev-2",
    title: "Wagging Tails Outreach Day",
    date: "Date to be announced",
    day: "TBA",
    month: "",
    time: "To be announced",
    venue: "Matara",
    category: "Animal Welfare",
    description: "A community outreach session supporting the welfare of stray and community animals in Matara.",
  },
  {
    id: "ev-3",
    title: "Drug Prevention Awareness Program",
    date: "Date to be announced",
    day: "TBA",
    month: "",
    time: "To be announced",
    venue: "St. Thomas' College, Matara",
    category: "Health Awareness",
    description: "An awareness program educating schoolchildren and youth on the dangers of substance abuse.",
  },
];

export const INITIAL_GALLERY_PHOTOS: any[] = [];

export const INITIAL_IMPACT_STATS = {
  id: "main_stats",
  stat1: { value: "2024", label: "Year Chartered" },
  stat2: { value: "5", label: "Service Pillars" },
  stat3: { value: "9", label: "Executive Officers" },
  stat4: { value: "3", label: "Signature Projects" },
  description:
    "Where the Leo Club of St. Thomas' College, Matara stands today in our mission of leadership, service and youth empowerment.",
};

export const INITIAL_HERO_SLIDES = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
    tag: "LEO CLUB OF ST. THOMAS' COLLEGE, MATARA",
    title: "Leadership, Experience, Opportunity",
    subtitle: "Fostering leadership, fellowship, and service since 2024",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=85",
    tag: "WAGGING TAILS",
    title: "Caring for the Animals of Matara",
    subtitle: "An ongoing animal welfare initiative by the club",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85",
    tag: "HEENA ARUNALU",
    title: "Standing With Our Community",
    subtitle: "Supporting underprivileged families across Matara",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=85",
    tag: "DRUG PREVENTION",
    title: "Empowering a Healthier Youth",
    subtitle: "Awareness programs for schoolchildren and young people",
  },
];

export const INITIAL_TESTIMONIALS: any[] = [];

export const INITIAL_PILLARS = [
  {
    id: "youth-leadership",
    title: "Youth Leadership & Empowerment",
    tagline: "Building tomorrow's changemakers",
    description:
      "Leadership training, public speaking, and personal development programs that equip young Thomians with confidence and civic responsibility.",
    icon: "GraduationCap",
    color: "blue",
  },
  {
    id: "animal-welfare",
    title: "Animal Welfare",
    tagline: "Caring for creatures who can't ask",
    description:
      "Through Project Wagging Tails, the club supports the care and welfare of stray and community animals across Matara.",
    icon: "HeartHandshake",
    color: "rose",
  },
  {
    id: "environment",
    title: "Environmental Conservation",
    tagline: "Protecting Matara's natural heritage",
    description:
      "Clean-up drives, tree planting, and sustainability awareness initiatives that protect the environment for future generations.",
    icon: "TreePine",
    color: "emerald",
  },
  {
    id: "health-drug-prevention",
    title: "Health Awareness & Drug Prevention",
    tagline: "Protecting young minds and bodies",
    description:
      "Through Project Drug Prevention, the club runs awareness campaigns on substance abuse and healthy living among schoolchildren and youth.",
    icon: "ShieldAlert",
    color: "amber",
  },
  {
    id: "community-welfare",
    title: "Community & Social Welfare",
    tagline: "Standing with those who need it most",
    description:
      "Through Project Heena Arunalu and other outreach initiatives, the club supports underprivileged families and community welfare across Matara.",
    icon: "Users",
    color: "indigo",
  },
];

export const INITIAL_CLUB_PROFILE = {
  id: "leo-stc",
  name: "Leo Club of St. Thomas' College, Matara",
  shortName: "STC Leos",
  type: "club",
  district: "Leo District 306 D8",
  multipleDistrict: "Leo Multiple District 306",
  country: "Sri Lanka",
  charterYear: 2024,
  sponsoringLionsClub: "Lions Club of Ruhunu Millennium",
  tagline: "Leadership • Experience • Opportunity",
  motto: "Leadership, Experience, Opportunity",
  description:
    "The Leo Club of St. Thomas' College, Matara is an active school-based Leo Club under Leo District 306 D8 of Leo Multiple District 306, representing Sri Lanka and the Maldives. The club operates under the guidance and mentorship of its sponsoring Lions Club of Ruhunu Millennium, with the aim of developing leadership, social responsibility, and a strong spirit of volunteerism among young students.",
  logos: {
    main: "/logos/stc-leo-badge.png",
    lion: "/logos/lions-international.png",
    leo: "/logos/stc-leo-badge.png",
    district: "/logos/stc-crest.png",
  },
  contact: {
    email: "thomian.leos@gmail.com",
    phone: "",
    address: "St. Thomas' College, Matara, Sri Lanka",
    meetingSchedule: "Regular Club Meetings — schedule to be confirmed",
    socials: {
      facebook: "",
      instagram: "",
      linkedin: "",
      youtube: "",
      twitter: "",
    },
  },
};

export const INITIAL_FAQS = [
  {
    q: "How can I join the Leo Club of St. Thomas' College?",
    a: "St. Thomas' College students interested in joining can reach out through the Join page or speak directly with the Club Staff Advisors or any Executive Officer.",
  },
  {
    q: "How quickly does the club respond to messages?",
    a: "Our Secretary and Executive Council check official correspondence regularly. Standard inquiries receive a response within a few days.",
  },
  {
    q: "Can other Leo or Lions clubs organize joint projects with us?",
    a: "Yes — we welcome collaboration with other Leo and Lions clubs. Please reach out via our contact page to discuss a joint initiative.",
  },
  {
    q: "Who guides and mentors the club?",
    a: "The club is guided by its Club Staff Advisors, Mrs. Indika Chathurani and Mrs. Sahindi Alas, along with Guiding Lion Rashmi Purasinghe of the sponsoring Lions Club of Ruhunu Millennium.",
  },
];

// ==============================================================================
// FIRESTORE CRUD & REAL-TIME HELPERS
// ==============================================================================

/**
 * Fetch all documents from a Firestore collection with fallback to initial static data
 */
export async function getFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  fallbackData: T[] = []
): Promise<T[]> {
  if (!isFirebaseConfigured() || !db) {
    return fallbackData;
  }

  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return fallbackData;
    }

    const items: T[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as T;
      items.push({ ...data, id: docSnap.id });
    });

    return items;
  } catch (err: any) {
    if (err?.code === "unavailable" || err?.message?.includes("offline")) {
      // Graceful local fallback when Firestore database is offline or unseeded
    } else {
      console.warn(`Firestore read notice for collection "${collectionName}":`, err?.message || err);
    }
    return fallbackData;
  }
}

/**
 * Fetch a single document from a Firestore collection
 */
export async function getFirestoreDoc<T>(
  collectionName: string,
  docId: string,
  fallbackData: T
): Promise<T> {
  if (!isFirebaseConfigured() || !db) {
    return fallbackData;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
      return fallbackData;
    }
    return { ...snap.data(), id: snap.id } as T;
  } catch (err: any) {
    if (err?.code === "unavailable" || err?.message?.includes("offline")) {
      // Graceful local fallback when Firestore database is offline or unseeded
    } else {
      console.warn(`Firestore read notice for document ${collectionName}/${docId}:`, err?.message || err);
    }
    return fallbackData;
  }
}

/**
 * Subscribe to real-time updates on a Firestore collection
 */
export function subscribeFirestoreCollection<T extends { id: string }>(
  collectionName: string,
  fallbackData: T[] = [],
  callback: (items: T[]) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    callback(fallbackData);
    return () => {};
  }

  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(
      colRef,
      (snap) => {
        if (snap.empty) {
          callback(fallbackData);
          return;
        }
        const items: T[] = [];
        snap.forEach((docSnap) => {
          const data = docSnap.data() as T;
          items.push({ ...data, id: docSnap.id });
        });
        callback(items);
      },
      (err) => {
        console.warn(`Firestore real-time subscription error for ${collectionName}:`, err);
        callback(fallbackData);
      }
    );
  } catch (err) {
    console.warn(`Failed to initialize Firestore listener for ${collectionName}:`, err);
    callback(fallbackData);
    return () => {};
  }
}

/**
 * Subscribe to real-time updates on a single Firestore document
 */
export function subscribeFirestoreDoc<T>(
  collectionName: string,
  docId: string,
  fallbackData: T,
  callback: (data: T) => void
): Unsubscribe | (() => void) {
  if (!isFirebaseConfigured() || !db) {
    callback(fallbackData);
    return () => {};
  }

  try {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(
      docRef,
      (snap) => {
        if (!snap.exists()) {
          callback(fallbackData);
          return;
        }
        callback({ ...snap.data(), id: snap.id } as T);
      },
      (err) => {
        console.warn(`Firestore real-time subscription error for ${collectionName}/${docId}:`, err);
        callback(fallbackData);
      }
    );
  } catch (err) {
    console.warn(`Failed to initialize Firestore doc listener for ${collectionName}/${docId}:`, err);
    callback(fallbackData);
    return () => {};
  }
}

/**
 * Save or update a document in a Firestore collection
 */
export async function saveFirestoreDoc(
  collectionName: string,
  docId: string,
  data: Record<string, any>
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    return false;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return true;
  } catch (err) {
    console.error(`Firestore save failed for ${collectionName}/${docId}:`, err);
    return false;
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteFirestoreDoc(
  collectionName: string,
  docId: string
): Promise<boolean> {
  if (!isFirebaseConfigured() || !db) {
    return false;
  }

  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Firestore delete failed for ${collectionName}/${docId}:`, err);
    return false;
  }
}

/**
 * Seed initial datasets into Firestore with 1 click
 */
export async function seedFirestoreData(): Promise<{
  success: boolean;
  seededCount: number;
  message: string;
}> {
  if (!isFirebaseConfigured() || !db) {
    return {
      success: false,
      seededCount: 0,
      message: "Firebase credentials are not configured in environment variables.",
    };
  }

  try {
    let count = 0;

    // 1. Projects
    for (const proj of INITIAL_PROJECTS) {
      await saveFirestoreDoc("projects", proj.id, proj);
      count++;
    }

    // 2. Magazines
    for (const mag of INITIAL_MAGAZINES) {
      await saveFirestoreDoc("magazines", mag.id, mag);
      count++;
    }

    // 3. Documents
    for (const docItem of INITIAL_DOCUMENTS) {
      await saveFirestoreDoc("documents", docItem.id, docItem);
      count++;
    }

    // 4. Announcements
    for (const ann of INITIAL_ANNOUNCEMENTS) {
      await saveFirestoreDoc("announcements", ann.id, ann);
      count++;
    }

    // 5. Events
    for (const ev of INITIAL_EVENTS) {
      await saveFirestoreDoc("events", ev.id, ev);
      count++;
    }

    // 6. Gallery
    for (const gal of INITIAL_GALLERY_PHOTOS) {
      await saveFirestoreDoc("gallery", gal.id, gal);
      count++;
    }

    // 7. Leadership
    await saveFirestoreDoc("leadership", "current", INITIAL_LEADERSHIP);
    count++;

    // 8. Impact Stats
    await saveFirestoreDoc("settings", "impact_stats", INITIAL_IMPACT_STATS);
    count++;

    // 9. Club Profile & Contact Info
    await saveFirestoreDoc("settings", "club_profile", INITIAL_CLUB_PROFILE);
    count++;

    // 10. Hero Carousel Slides
    await saveFirestoreDoc("settings", "hero_slides", { slides: INITIAL_HERO_SLIDES });
    count++;

    // 11. Testimonials / Reflections
    await saveFirestoreDoc("settings", "testimonials", { testimonials: INITIAL_TESTIMONIALS });
    count++;

    // 12. Pillars / Service Causes
    await saveFirestoreDoc("settings", "pillars", { pillars: INITIAL_PILLARS });
    count++;

    // 13. FAQs
    await saveFirestoreDoc("settings", "faqs", { faqs: INITIAL_FAQS });
    count++;

    return {
      success: true,
      seededCount: count,
      message: `Successfully seeded ${count} documents across Projects, Magazines, Documents, Events, Gallery, Leadership, Impact Stats, Club Profile, Hero Slides, Testimonials, Pillars, and FAQs into Firestore!`,
    };
  } catch (err: any) {
    console.error("Firestore seeding failed:", err);
    return {
      success: false,
      seededCount: 0,
      message: `Seeding error: ${err?.message || "Unknown error"}`,
    };
  }
}

/**
 * Save a new student membership applicant to Firestore
 */
export async function submitMembershipApplicant(applicantData: {
  name: string;
  regNo: string;
  faculty: string;
  academicYear: string;
  email: string;
  phone: string;
  interests: string;
}): Promise<{ success: boolean; id?: string }> {
  if (!isFirebaseConfigured() || !db) {
    return { success: false };
  }

  try {
    const colRef = collection(db, "membership_applicants");
    const docRef = await addDoc(colRef, {
      ...applicantData,
      status: "pending",
      appliedDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      createdAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (err) {
    console.error("Failed to submit applicant to Firestore:", err);
    return { success: false };
  }
}

/**
 * Submit contact message to Firestore
 */
export async function submitContactForm(messageData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success: boolean }> {
  if (!isFirebaseConfigured() || !db) {
    return { success: false };
  }

  try {
    const colRef = collection(db, "contact_inquiries");
    await addDoc(colRef, {
      ...messageData,
      status: "unread",
      timestamp: serverTimestamp(),
      receivedDate: new Date().toISOString(),
    });
    return { success: true };
  } catch (err) {
    console.error("Failed to submit contact message to Firestore:", err);
    return { success: false };
  }
}
