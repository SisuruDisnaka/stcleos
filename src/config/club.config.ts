export interface ClubConfig {
  id: string;
  name: string;
  shortName: string;
  type: "multiple-district" | "district" | "club";
  district: string;
  multipleDistrict: string;
  country: string;
  charterYear: number;
  sponsoringLionsClub?: string;
  tagline: string;
  motto: string;
  description: string;
  logos: {
    main: string;
    lion: string;
    leo: string;
    district?: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
    meetingSchedule: string;
    socials: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      youtube?: string;
      twitter?: string;
    };
  };
  impactStats: {
    stat1: { value: string; label: string };
    stat2: { value: string; label: string };
    stat3: { value: string; label: string };
    stat4: { value: string; label: string };
    description: string;
  };
  affiliationDetails: {
    lciTitle: string;
    lciDescription: string;
    card1: {
      title: string;
      subtitle: string;
      linkText: string;
      linkUrl: string;
    };
    card2: {
      title: string;
      subtitle: string;
    };
    card3: {
      title: string;
      subtitle: string;
    };
  };
  pillars: {
    id: string;
    title: string;
    tagline: string;
    description: string;
    icon: string;
    color: string;
  }[];
  featuredProjects: {
    id: string;
    slug: string;
    title: string;
    category: string;
    categoryColor: string;
    image: string;
    summary: string;
    impactMetric: string;
    date: string;
    location: string;
    status: "Completed" | "Ongoing" | "Upcoming";
  }[];
  upcomingEvents: {
    id: string;
    title: string;
    date: string;
    day: string;
    month: string;
    time: string;
    venue: string;
    category: string;
    description: string;
  }[];
  boardMembers: {
    id: string;
    name: string;
    designation: string;
    roleCategory: "top-table" | "director" | "advisor";
    photo: string;
    motto?: string;
    email?: string;
    linkedin?: string;
  }[];
  testimonials: {
    id: string;
    quote: string;
    author: string;
    role: string;
    avatar: string;
    tag?: string;
    faculty?: string;
  }[];
}

export const CLUBS_DATA: Record<string, ClubConfig> = {
  "leo-stc": {
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
      email: "leoclub@stcmatara.lk",
      phone: "",
      address: "St. Thomas' College, Matara, Sri Lanka",
      meetingSchedule: "Regular Club Meetings — schedule to be confirmed",
      socials: {
        facebook: "",
        instagram: "",
        linkedin: "",
        youtube: "",
      },
    },
    impactStats: {
      stat1: { value: "2024", label: "Year Chartered" },
      stat2: { value: "5", label: "Service Pillars" },
      stat3: { value: "9", label: "Executive Officers" },
      stat4: { value: "3", label: "Signature Projects" },
      description:
        "Where the Leo Club of St. Thomas' College, Matara stands today in our mission of leadership, service and youth empowerment.",
    },
    affiliationDetails: {
      lciTitle: "Lions Clubs International",
      lciDescription:
        "Sponsored by the Lions Club of Ruhunu Millennium under Leo District 306 D8, our club unites students of St. Thomas' College, Matara in global humanitarian service, fostering leadership and community development.",
      card1: {
        title: "Lions International",
        subtitle: "Since 1917. 1.4M+ members worldwide serving communities.",
        linkText: "Read the history",
        linkUrl: "/about#lions-history",
      },
      card2: {
        title: "Leo Movement",
        subtitle: "Leadership. Experience. Opportunity. Empowering youth since 1957.",
      },
      card3: {
        title: "Leo District 306 D8",
        subtitle: "St. Thomas' College, Matara Leos serving under District 306 D8, Sri Lanka.",
      },
    },
    pillars: [
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
    ],
    featuredProjects: [
      {
        id: "proj-stc-1",
        slug: "wagging-tails",
        title: "Wagging Tails",
        category: "Animal Welfare",
        categoryColor: "bg-rose-100 text-rose-800 border-rose-200",
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80",
        summary:
          "An ongoing animal welfare initiative caring for stray and community animals around Matara.",
        impactMetric: "Ongoing Initiative",
        date: "Leistic Year 2026/27",
        location: "Matara",
        status: "Ongoing",
      },
      {
        id: "proj-stc-2",
        slug: "heena-arunalu",
        title: "Heena Arunalu",
        category: "Community Service",
        categoryColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        summary:
          "A community and social welfare project supporting underprivileged families and individuals in and around Matara.",
        impactMetric: "Ongoing Initiative",
        date: "Leistic Year 2026/27",
        location: "Matara",
        status: "Ongoing",
      },
      {
        id: "proj-stc-3",
        slug: "drug-prevention",
        title: "Drug Prevention",
        category: "Health Awareness",
        categoryColor: "bg-amber-100 text-amber-800 border-amber-200",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
        summary:
          "A health and youth awareness project educating schoolchildren and young people on the dangers of substance abuse.",
        impactMetric: "Ongoing Initiative",
        date: "Leistic Year 2026/27",
        location: "Matara",
        status: "Ongoing",
      },
    ],
    upcomingEvents: [
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
        description: "A community outreach session supporting the welfare of animals in Matara.",
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
    ],
    boardMembers: [
      {
        id: "bm-1",
        name: "Leo Sanija Bathila",
        designation: "Club President",
        roleCategory: "top-table",
        photo: "",
        motto: "Leadership, Experience, Opportunity — leading with purpose for St. Thomas' College and Matara.",
        email: "",
      },
      {
        id: "bm-2",
        name: "Leo Ravindu Mudalige",
        designation: "1st Vice President",
        roleCategory: "top-table",
        photo: "",
        email: "",
      },
      {
        id: "bm-3",
        name: "Leo Haamid Muhammed",
        designation: "Secretary",
        roleCategory: "top-table",
        photo: "",
        email: "",
      },
      {
        id: "bm-4",
        name: "Leo Esandu Mathagadeera",
        designation: "Club Treasurer",
        roleCategory: "top-table",
        photo: "",
        email: "",
      },
      {
        id: "bm-5",
        name: "Lion Rashmi Purasinghe",
        designation: "Leo Club Advisor (Guiding Lion) • Deputy Cabinet Secretary",
        roleCategory: "advisor",
        photo: "",
        email: "",
      },
    ],
    testimonials: [],
  },
};
