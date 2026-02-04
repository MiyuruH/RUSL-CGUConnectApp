// Mock Employer Data

export interface Employer {
  id: string;
  companyName: string;
  registrationNo: string;
  logo: string;
  industry: string;
  companySize: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

export interface EmployerNotification {
  id: string;
  title: string;
  message: string;
  type: "application" | "message" | "approval" | "review" | "system";
  timestamp: string;
  isRead: boolean;
  jobTitle?: string;
  applicantName?: string;
  applicantAvatar?: string;
}

export const mockEmployer: Employer = {
  id: "employer-001",
  companyName: "Tech Solutions Lanka",
  registrationNo: "PV00123456",
  logo: "https://api.dicebear.com/7.x/initials/png?seed=TSL&backgroundColor=8B2635",
  industry: "Information Technology & Services",
  companySize: "50-200 employees",
  address: "123 Galle Road, Colombo 03, Sri Lanka",
  phone: "+94 11 234 5678",
  email: "hr@techsolutions.lk",
  website: "www.techsolutions.lk",
};

export const mockEmployerNotifications: EmployerNotification[] = [
  {
    id: "1",
    title: "New Application",
    message: "applied for",
    type: "application",
    timestamp: "5m ago",
    isRead: false,
    jobTitle: "Software Engineer",
    applicantName: "Kamal Perera",
    applicantAvatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=kamal&backgroundColor=b6e3f4",
  },
  {
    id: "2",
    title: "New Application",
    message: "applied for",
    type: "application",
    timestamp: "30m ago",
    isRead: false,
    jobTitle: "UI/UX Designer",
    applicantName: "Nimal Silva",
    applicantAvatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=nimal&backgroundColor=ffd5dc",
  },
  {
    id: "3",
    title: "Job Approved",
    message:
      'Your job post "DevOps Engineer" has been approved and is now live!',
    type: "approval",
    timestamp: "1h ago",
    isRead: false,
  },
  {
    id: "4",
    title: "New Message",
    message: "sent you a message regarding",
    type: "message",
    timestamp: "2h ago",
    isRead: true,
    jobTitle: "Project Manager",
    applicantName: "Sithara Fernando",
    applicantAvatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=sithara&backgroundColor=c0aede",
  },
  {
    id: "5",
    title: "Assessment Completed",
    message: "completed the assessment for",
    type: "review",
    timestamp: "3h ago",
    isRead: true,
    jobTitle: "Data Analyst",
    applicantName: "Amali Wickramasinghe",
    applicantAvatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=amali&backgroundColor=d1d4f9",
  },
  {
    id: "6",
    title: "Milestone Reached",
    message:
      "Your Software Engineer position has received 20+ applications! 🎉",
    type: "system",
    timestamp: "5h ago",
    isRead: true,
  },
  {
    id: "7",
    title: "New Application",
    message: "applied for",
    type: "application",
    timestamp: "1d ago",
    isRead: true,
    jobTitle: "Software Engineer",
    applicantName: "Ruwan Bandara",
    applicantAvatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=ruwan&backgroundColor=ffeaa7",
  },
];
