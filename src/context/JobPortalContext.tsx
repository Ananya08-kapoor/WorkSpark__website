import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  JobPosting,
  JobApplication,
  NotificationItem,
  UserRole,
  ApplicationStatus,
  JavaApiLog,
  InterviewDetails,
  UserAccount
} from '../types';
import {
  INITIAL_JOBS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_JAVA_LOGS,
  INITIAL_USERS
} from '../data/mockData';

interface JobPortalContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  jobs: JobPosting[];
  applications: JobApplication[];
  notifications: NotificationItem[];
  javaLogs: JavaApiLog[];
  users: UserAccount[];
  showJavaModal: boolean;
  setShowJavaModal: (show: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  
  // Actions
  postJob: (jobData: Omit<JobPosting, 'id' | 'postedAt' | 'status' | 'applicantsCount'>) => void;
  approveJob: (jobId: string, note?: string) => void;
  rejectJob: (jobId: string, reason: string) => void;
  applyForJob: (
    jobId: string,
    candidateData: {
      name: string;
      email: string;
      phone: string;
      headline: string;
      yearsExperience: number;
      skills: string[];
      coverNote?: string;
      resumeFileName?: string;
      resumeSummary?: string;
      portfolioUrl?: string;
    }
  ) => void;
  updateApplicationStatus: (
    applicationId: string,
    newStatus: ApplicationStatus,
    employerNotes?: string,
    interviewDetails?: InterviewDetails
  ) => void;
  toggleUserStatus: (userId: string) => void;
  registerUser: (userData: {
    name: string;
    email: string;
    role: UserRole;
    companyOrHeadline: string;
    location: string;
  }) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  resetDemoData: () => void;
}

const JobPortalContext = createContext<JobPortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  JOBS: 'workspark_jobs_v2',
  APPLICATIONS: 'workspark_apps_v2',
  NOTIFICATIONS: 'workspark_notifs_v2',
  JAVA_LOGS: 'workspark_javalogs_v2',
  USERS: 'workspark_users_v2',
  ROLE: 'workspark_role_v2',
  THEME: 'workspark_theme_v2'
};

export const JobPortalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Role state
  const [role, setRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    if (saved === 'seeker' || saved === 'employer' || saved === 'admin') return saved;
    return 'seeker';
  });

  // Data states
  const [jobs, setJobs] = useState<JobPosting[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOBS);
      return saved ? JSON.parse(saved) : INITIAL_JOBS;
    } catch {
      return INITIAL_JOBS;
    }
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [javaLogs, setJavaLogs] = useState<JavaApiLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JAVA_LOGS);
      return saved ? JSON.parse(saved) : INITIAL_JAVA_LOGS;
    } catch {
      return INITIAL_JAVA_LOGS;
    }
  });

  const [users, setUsers] = useState<UserAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [showJavaModal, setShowJavaModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Sync theme with HTML root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JAVA_LOGS, JSON.stringify(javaLogs));
  }, [javaLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem(STORAGE_KEYS.ROLE, newRole);
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addJavaLog = (log: Omit<JavaApiLog, 'id' | 'timestamp'>) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
    const newLog: JavaApiLog = {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      ...log
    };
    setJavaLogs(prev => [newLog, ...prev.slice(0, 19)]);
  };

  // 1. Employer Posts a Job
  const postJob = (jobData: Omit<JobPosting, 'id' | 'postedAt' | 'status' | 'applicantsCount'>) => {
    const newId = `job-${Date.now()}`;
    const newJob: JobPosting = {
      ...jobData,
      id: newId,
      postedAt: new Date().toISOString(),
      status: 'PENDING_APPROVAL',
      applicantsCount: 0
    };

    setJobs(prev => [newJob, ...prev]);

    // Dispatch admin notification
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'admin',
      title: 'New Vacancy Awaiting Approval',
      message: `"${newJob.title}" posted by ${newJob.company} requires compliance review.`,
      timestamp: new Date().toISOString(),
      read: false,
      linkJobId: newId
    };
    setNotifications(prev => [newNotification, ...prev]);

    // Add Java Spring Boot API execution log
    addJavaLog({
      method: 'POST',
      endpoint: '/api/v1/jobs',
      springController: 'JobPostingController.createJobPosting(@Valid @RequestBody JobRequestDto dto)',
      statusCode: 201,
      durationMs: 34,
      requestPayload: JSON.stringify({
        title: newJob.title,
        company: newJob.company,
        department: newJob.department,
        salaryMin: newJob.salaryMin,
        salaryMax: newJob.salaryMax
      }),
      responsePayload: JSON.stringify({
        id: newId,
        status: 'PENDING_APPROVAL',
        queueState: 'ENQUEUED_ADMIN_REVIEW'
      })
    });
  };

  // 2. Admin Approves a Job
  const approveJob = (jobId: string, note: string = 'Approved for publication') => {
    let jobTitle = '';

    setJobs(prev =>
      prev.map(job => {
        if (job.id === jobId) {
          jobTitle = job.title;
          return {
            ...job,
            status: 'APPROVED',
            adminReviewNote: note
          };
        }
        return job;
      })
    );

    // Notify Employer and Seekers
    const newEmployerNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'employer',
      title: 'Job Approved & Published',
      message: `Your posting "${jobTitle}" was approved by the WorkSpark admin and is now live!`,
      timestamp: new Date().toISOString(),
      read: false,
      linkJobId: jobId
    };
    setNotifications(prev => [newEmployerNotif, ...prev]);

    // Add Java Log
    addJavaLog({
      method: 'PUT',
      endpoint: `/api/v1/admin/jobs/${jobId}/approve`,
      springController: 'AdminWorkflowController.approveJobPosting(@PathVariable String jobId)',
      statusCode: 200,
      durationMs: 26,
      requestPayload: JSON.stringify({ note }),
      responsePayload: JSON.stringify({
        jobId,
        status: 'APPROVED',
        activeInCandidatePortal: true,
        jpaCacheEvicted: true
      })
    });
  };

  // Admin Rejects a Job
  const rejectJob = (jobId: string, reason: string) => {
    let jobTitle = '';

    setJobs(prev =>
      prev.map(job => {
        if (job.id === jobId) {
          jobTitle = job.title;
          return {
            ...job,
            status: 'REJECTED',
            adminReviewNote: reason
          };
        }
        return job;
      })
    );

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'employer',
      title: 'Job Posting Not Approved',
      message: `Your vacancy "${jobTitle}" was declined. Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      read: false,
      linkJobId: jobId
    };
    setNotifications(prev => [newNotif, ...prev]);

    addJavaLog({
      method: 'PUT',
      endpoint: `/api/v1/admin/jobs/${jobId}/reject`,
      springController: 'AdminWorkflowController.rejectJobPosting(@PathVariable String jobId)',
      statusCode: 200,
      durationMs: 19,
      requestPayload: JSON.stringify({ reason }),
      responsePayload: JSON.stringify({ jobId, status: 'REJECTED' })
    });
  };

  // 3. Candidate Searches and Applies
  const applyForJob = (
    jobId: string,
    candidateData: {
      name: string;
      email: string;
      phone: string;
      headline: string;
      yearsExperience: number;
      skills: string[];
      coverNote?: string;
      resumeFileName?: string;
      resumeSummary?: string;
      portfolioUrl?: string;
    }
  ) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const newAppId = `app-${Date.now()}`;
    const newApplication: JobApplication = {
      id: newAppId,
      jobId,
      jobTitle: job.title,
      company: job.company,
      candidateId: `cand-${Date.now().toString().slice(-4)}`,
      candidateName: candidateData.name,
      candidateEmail: candidateData.email,
      candidatePhone: candidateData.phone,
      candidateAvatar: '/src/assets/images/avatar_candidate_seeker_1791836579280.jpg',
      candidateHeadline: candidateData.headline || 'Experienced Professional',
      yearsExperience: candidateData.yearsExperience || 3,
      skills: candidateData.skills || job.skills.slice(0, 4),
      resumeFileName: candidateData.resumeFileName || `${candidateData.name.replace(/\s+/g, '_')}_Resume.pdf`,
      resumeSummary:
        candidateData.resumeSummary ||
        `Hands-on professional with ${candidateData.yearsExperience} years experience matching core requirements for ${job.title}. Proficient in ${job.skills.join(', ')}.`,
      coverNote: candidateData.coverNote,
      portfolioUrl: candidateData.portfolioUrl,
      appliedAt: new Date().toISOString(),
      status: 'SUBMITTED',
      timeline: [
        {
          status: 'SUBMITTED',
          timestamp: new Date().toISOString(),
          note: 'Application submitted via WorkSpark portal'
        }
      ]
    };

    setApplications(prev => [newApplication, ...prev]);

    // Update job applicant count
    setJobs(prev =>
      prev.map(j => (j.id === jobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j))
    );

    // Notify Employer
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'employer',
      title: 'New Candidate Application',
      message: `${candidateData.name} applied for "${job.title}".`,
      timestamp: new Date().toISOString(),
      read: false,
      linkJobId: jobId
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Java REST Trace
    addJavaLog({
      method: 'POST',
      endpoint: `/api/v1/jobs/${jobId}/apply`,
      springController: 'ApplicationController.submitCandidateApplication(@PathVariable String jobId, @Valid @RequestBody ApplicationDto dto)',
      statusCode: 201,
      durationMs: 42,
      requestPayload: JSON.stringify({
        candidateEmail: candidateData.email,
        candidateName: candidateData.name,
        skillsCount: candidateData.skills.length
      }),
      responsePayload: JSON.stringify({
        applicationId: newAppId,
        status: 'SUBMITTED',
        message: 'Persisted to PostgreSQL table job_applications'
      })
    });
  };

  // 4. Employer Reviews and Updates Application Status
  const updateApplicationStatus = (
    applicationId: string,
    newStatus: ApplicationStatus,
    employerNotes?: string,
    interviewDetails?: InterviewDetails
  ) => {
    let jobTitle = '';

    setApplications(prev =>
      prev.map(app => {
        if (app.id === applicationId) {
          jobTitle = app.jobTitle;

          const updatedTimeline = [
            ...app.timeline,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              note: employerNotes || `Status updated to ${newStatus.replace('_', ' ')}`
            }
          ];

          return {
            ...app,
            status: newStatus,
            employerNotes: employerNotes !== undefined ? employerNotes : app.employerNotes,
            interviewDetails: interviewDetails || app.interviewDetails,
            timeline: updatedTimeline
          };
        }
        return app;
      })
    );

    // Notify Seeker of progress
    const statusReadable = newStatus.replace('_', ' ');
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      targetRole: 'seeker',
      title: `Application Status Updated: ${statusReadable}`,
      message: `Your application for "${jobTitle}" is now marked as ${statusReadable}.${
        interviewDetails ? ` Scheduled for ${interviewDetails.date} at ${interviewDetails.time}.` : ''
      }`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Java Spring REST Log
    addJavaLog({
      method: 'PATCH',
      endpoint: `/api/v1/applications/${applicationId}/status`,
      springController: 'ApplicationController.updateApplicationStatus(@PathVariable String id, @RequestBody StatusUpdateDto dto)',
      statusCode: 200,
      durationMs: 25,
      requestPayload: JSON.stringify({
        status: newStatus,
        hasInterview: Boolean(interviewDetails)
      }),
      responsePayload: JSON.stringify({
        applicationId,
        newStatus,
        notificationDispatched: true
      })
    });
  };

  // Toggle user status in Admin Users panel
  const toggleUserStatus = (userId: string) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === userId
          ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }
          : u
      )
    );
  };

  // Register new user
  const registerUser = (userData: {
    name: string;
    email: string;
    role: UserRole;
    companyOrHeadline: string;
    location: string;
  }) => {
    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      ...userData,
      joinedAt: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    };
    setUsers(prev => [newUser, ...prev]);
    setRole(userData.role);

    // Add Java log
    addJavaLog({
      method: 'POST',
      endpoint: '/api/v1/auth/register',
      springController: 'AuthenticationController.registerUser(@Valid @RequestBody UserRegistrationDto dto)',
      statusCode: 201,
      durationMs: 31,
      requestPayload: JSON.stringify({ email: userData.email, role: userData.role }),
      responsePayload: JSON.stringify({ userId: newUser.id, status: 'CREATED', tokenGenerated: true })
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.JOBS);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.JAVA_LOGS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    setJobs(INITIAL_JOBS);
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setJavaLogs(INITIAL_JAVA_LOGS);
    setUsers(INITIAL_USERS);
  };

  return (
    <JobPortalContext.Provider
      value={{
        role,
        setRole,
        theme,
        toggleTheme,
        jobs,
        applications,
        notifications,
        javaLogs,
        users,
        showJavaModal,
        setShowJavaModal,
        showAuthModal,
        setShowAuthModal,
        authMode,
        setAuthMode,
        postJob,
        approveJob,
        rejectJob,
        applyForJob,
        updateApplicationStatus,
        toggleUserStatus,
        registerUser,
        markNotificationRead,
        clearNotifications,
        resetDemoData
      }}
    >
      {children}
    </JobPortalContext.Provider>
  );
};

export const useJobPortal = () => {
  const context = useContext(JobPortalContext);
  if (!context) {
    throw new Error('useJobPortal must be used within a JobPortalProvider');
  }
  return context;
};
