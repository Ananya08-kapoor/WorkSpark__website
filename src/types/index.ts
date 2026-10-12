export type UserRole = 'seeker' | 'employer' | 'admin';

export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Remote';

export type ExperienceLevel = 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead';

export type JobStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';

export type ApplicationStatus =
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'SHORTLISTED'
  | 'INTERVIEW_SCHEDULED'
  | 'OFFER_EXTENDED'
  | 'REJECTED';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  department: string;
  location: string;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  postedByEmail: string;
  postedAt: string;
  deadline: string;
  status: JobStatus;
  adminReviewNote?: string;
  applicantsCount: number;
}

export interface ApplicationTimelineEvent {
  status: ApplicationStatus;
  timestamp: string;
  note?: string;
}

export interface InterviewDetails {
  date: string;
  time: string;
  type: 'Technical Screen' | 'Hiring Manager' | 'Panel Interview' | 'HR Discussion';
  linkOrLocation: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  candidateAvatar?: string;
  candidateHeadline: string;
  yearsExperience: number;
  skills: string[];
  resumeFileName: string;
  resumeSummary: string;
  portfolioUrl?: string;
  coverNote?: string;
  appliedAt: string;
  status: ApplicationStatus;
  employerNotes?: string;
  interviewDetails?: InterviewDetails;
  timeline: ApplicationTimelineEvent[];
}

export interface NotificationItem {
  id: string;
  targetRole: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkJobId?: string;
}

export interface JavaApiLog {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  springController: string;
  statusCode: number;
  durationMs: number;
  requestPayload?: string;
  responsePayload?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  companyOrHeadline: string;
  location: string;
  joinedAt: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

