// Mock Applicants Data for Employer Dashboard

export type ApplicationStatus =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "hired";

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  position: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: ApplicationStatus;
  matchScore: number;
  experience: string;
  education: string;
  skills: string[];
  resumeUrl?: string;
  coverLetter?: string;
  notes?: string;
}

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bgColor: string }
> = {
  pending: { label: "Pending", color: "#F59E0B", bgColor: "#FEF3C7" },
  reviewed: { label: "Reviewed", color: "#6B7280", bgColor: "#F3F4F6" },
  shortlisted: { label: "Shortlisted", color: "#8B2635", bgColor: "#FFE8EC" },
  interview: { label: "Interview", color: "#2196F3", bgColor: "#E3F2FD" },
  rejected: { label: "Rejected", color: "#EF4444", bgColor: "#FEE2E2" },
  hired: { label: "Hired", color: "#10B981", bgColor: "#D1FAE5" },
};

export const mockApplicants: Applicant[] = [
  {
    id: "app-001",
    name: "Kamal Perera",
    email: "kamal.perera@email.com",
    phone: "+94 77 123 4567",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=kamal&backgroundColor=b6e3f4",
    position: "Software Engineer",
    jobId: "job-001",
    jobTitle: "Senior Software Engineer",
    appliedDate: "2 days ago",
    status: "shortlisted",
    matchScore: 95,
    experience: "5 years",
    education: "BSc Computer Science - University of Colombo",
    skills: ["React", "TypeScript", "Node.js", "AWS", "PostgreSQL"],
    coverLetter:
      "I am excited to apply for the Senior Software Engineer position. With my 5 years of experience in full-stack development...",
    notes: "Strong technical background, good communication skills",
  },
  {
    id: "app-002",
    name: "Nimal Silva",
    email: "nimal.silva@email.com",
    phone: "+94 76 234 5678",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=nimal&backgroundColor=ffd5dc",
    position: "UI/UX Designer",
    jobId: "job-002",
    jobTitle: "UI/UX Designer",
    appliedDate: "3 days ago",
    status: "interview",
    matchScore: 88,
    experience: "4 years",
    education: "BA Graphic Design - University of Moratuwa",
    skills: ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research"],
    coverLetter:
      "As a passionate UI/UX designer with expertise in creating intuitive digital experiences...",
    notes: "Interview scheduled for next Monday",
  },
  {
    id: "app-003",
    name: "Sithara Fernando",
    email: "sithara.fernando@email.com",
    phone: "+94 71 345 6789",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=sithara&backgroundColor=c0aede",
    position: "Project Manager",
    jobId: "job-003",
    jobTitle: "Senior Project Manager",
    appliedDate: "1 week ago",
    status: "reviewed",
    matchScore: 82,
    experience: "7 years",
    education: "MBA - University of Sri Jayewardenepura",
    skills: [
      "Agile",
      "Scrum",
      "JIRA",
      "Stakeholder Management",
      "Risk Assessment",
    ],
    coverLetter:
      "With over 7 years of experience managing complex IT projects...",
  },
  {
    id: "app-004",
    name: "Amali Wickramasinghe",
    email: "amali.wickramasinghe@email.com",
    phone: "+94 78 456 7890",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=amali&backgroundColor=d1d4f9",
    position: "Data Analyst",
    jobId: "job-004",
    jobTitle: "Senior Data Analyst",
    appliedDate: "4 days ago",
    status: "pending",
    matchScore: 78,
    experience: "3 years",
    education: "BSc Statistics - University of Peradeniya",
    skills: ["Python", "SQL", "Tableau", "Power BI", "Machine Learning"],
    coverLetter:
      "I am eager to bring my analytical skills and data-driven mindset to your team...",
  },
  {
    id: "app-005",
    name: "Ruwan Jayawardena",
    email: "ruwan.jayawardena@email.com",
    phone: "+94 72 567 8901",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=ruwan&backgroundColor=b6e3f4",
    position: "DevOps Engineer",
    jobId: "job-005",
    jobTitle: "DevOps Engineer",
    appliedDate: "1 day ago",
    status: "pending",
    matchScore: 91,
    experience: "4 years",
    education: "BSc IT - SLIIT",
    skills: ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
    coverLetter:
      "I specialize in building and maintaining scalable infrastructure...",
  },
  {
    id: "app-006",
    name: "Dilani Rathnayake",
    email: "dilani.rathnayake@email.com",
    phone: "+94 75 678 9012",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=dilani&backgroundColor=ffd5dc",
    position: "Software Engineer",
    jobId: "job-001",
    jobTitle: "Senior Software Engineer",
    appliedDate: "5 days ago",
    status: "rejected",
    matchScore: 65,
    experience: "2 years",
    education: "BSc Computer Science - University of Kelaniya",
    skills: ["Java", "Spring Boot", "MySQL"],
    coverLetter:
      "I am a junior developer looking to grow in a challenging environment...",
    notes: "Does not meet experience requirements",
  },
  {
    id: "app-007",
    name: "Tharindu Gamage",
    email: "tharindu.gamage@email.com",
    phone: "+94 70 789 0123",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=tharindu&backgroundColor=c0aede",
    position: "Software Engineer",
    jobId: "job-001",
    jobTitle: "Senior Software Engineer",
    appliedDate: "6 days ago",
    status: "hired",
    matchScore: 92,
    experience: "6 years",
    education: "MSc Software Engineering - University of Moratuwa",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "GraphQL"],
    coverLetter: "With my extensive experience in modern web technologies...",
    notes: "Excellent candidate, offer accepted",
  },
  {
    id: "app-008",
    name: "Samanthi Peris",
    email: "samanthi.peris@email.com",
    phone: "+94 77 890 1234",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=samanthi&backgroundColor=d1d4f9",
    position: "Business Analyst",
    jobId: "job-006",
    jobTitle: "Business Analyst",
    appliedDate: "3 days ago",
    status: "shortlisted",
    matchScore: 85,
    experience: "5 years",
    education: "BSc Business Management - University of Colombo",
    skills: [
      "Requirements Analysis",
      "SQL",
      "Excel",
      "Process Mapping",
      "BPMN",
    ],
    coverLetter: "I bring a unique blend of technical and business acumen...",
  },
];

// Get unique job titles from applicants
export const getUniqueJobTitles = (): string[] => {
  return [...new Set(mockApplicants.map((a) => a.jobTitle))];
};

// Filter applicants by status
export const filterApplicantsByStatus = (
  status: ApplicationStatus | "all",
): Applicant[] => {
  if (status === "all") return mockApplicants;
  return mockApplicants.filter((a) => a.status === status);
};

// Filter applicants by job
export const filterApplicantsByJob = (jobId: string | "all"): Applicant[] => {
  if (jobId === "all") return mockApplicants;
  return mockApplicants.filter((a) => a.jobId === jobId);
};

// Get applicant stats
export const getApplicantStats = () => {
  return {
    total: mockApplicants.length,
    pending: mockApplicants.filter((a) => a.status === "pending").length,
    reviewed: mockApplicants.filter((a) => a.status === "reviewed").length,
    shortlisted: mockApplicants.filter((a) => a.status === "shortlisted")
      .length,
    interview: mockApplicants.filter((a) => a.status === "interview").length,
    rejected: mockApplicants.filter((a) => a.status === "rejected").length,
    hired: mockApplicants.filter((a) => a.status === "hired").length,
  };
};
