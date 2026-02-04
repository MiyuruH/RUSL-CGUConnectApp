// Contract type matching job seeker's structure
export type ContractType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship";

// Job status type
export type JobStatus = "active" | "paused" | "closed";

// Job data type for employers - aligned with job seeker's Job type
export interface EmployerJob {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  contractType: ContractType;
  salary?: string;
  postedDate: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  companyInfo: string;
  // Employer-specific fields
  applicants: number;
  views: number;
  status: JobStatus;
}

// Form data type (without id)
export type EmployerJobFormData = Omit<EmployerJob, "id">;

// Empty job template for creating new jobs
export const emptyJobTemplate: EmployerJobFormData = {
  title: "",
  company: "Tech Solutions Lanka",
  location: "",
  contractType: "Full-time",
  salary: "",
  postedDate: "Just now",
  description: "",
  requirements: [],
  responsibilities: [],
  companyInfo:
    "Tech Solutions Lanka is a leading software development company in Sri Lanka, delivering innovative solutions to clients worldwide.",
  applicants: 0,
  views: 0,
  status: "active",
};

// Contract type options
export const CONTRACT_TYPES: ContractType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

// Tab types for job filtering
export type JobTabType = "all" | "active" | "paused" | "closed";

// Tab configuration
export const JOB_TABS: { key: JobTabType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "closed", label: "Closed" },
];
