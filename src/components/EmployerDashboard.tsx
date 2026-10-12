import React, { useState, useMemo } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import { JobPosting, JobApplication, ApplicationStatus, JobType, ExperienceLevel, InterviewDetails } from '../types';
import {
  Plus,
  Users,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Video,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Building2,
  X,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const { jobs, applications, postJob, updateApplicationStatus } = useJobPortal();

  // Tab: 'postings' | 'ats'
  const [activeEmployerTab, setActiveEmployerTab] = useState<'postings' | 'ats'>('ats');

  // Filter state for ATS
  const [selectedJobFilter, setSelectedJobFilter] = useState<string>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All');

  // Modals state
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [reviewingApplication, setReviewingApplication] = useState<JobApplication | null>(null);
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  // New Job Form State
  const [newTitle, setNewTitle] = useState('Senior Microservices Architect (Java & Cloud)');
  const [newCompany, setNewCompany] = useState('Apex Financial Technologies');
  const [newDepartment, setNewDepartment] = useState('Core Architecture');
  const [newLocation, setNewLocation] = useState('Boston, MA (Hybrid)');
  const [newType, setNewType] = useState<JobType>('Full-time');
  const [newExperience, setNewExperience] = useState<ExperienceLevel>('Senior');
  const [newSalaryMin, setNewSalaryMin] = useState<number>(155000);
  const [newSalaryMax, setNewSalaryMax] = useState<number>(195000);
  const [newDescription, setNewDescription] = useState(
    'Architect and implement distributed event-driven systems using Java 21, Spring Boot 3, and Apache Kafka. Ensure high reliability and enterprise SLA compliance across financial services.'
  );
  const [newResponsibilities, setNewResponsibilities] = useState(
    'Design high-throughput Java microservices\nConduct code reviews and mentor engineers\nCollaborate with DevOps on Kubernetes cluster tuning'
  );
  const [newRequirements, setNewRequirements] = useState(
    '5+ years production Java experience\nStrong experience with Spring Boot and Kafka\nSolid understanding of relational database indexing'
  );
  const [newSkills, setNewSkills] = useState('Java 21, Spring Boot, Kafka, Kubernetes, PostgreSQL');
  const [newDeadline, setNewDeadline] = useState('2026-11-30');
  const [postJobSuccess, setPostJobSuccess] = useState(false);

  // Interview Schedule State
  const [interviewDate, setInterviewDate] = useState('2026-10-20');
  const [interviewTime, setInterviewTime] = useState('14:00 EST');
  const [interviewType, setInterviewType] = useState<InterviewDetails['type']>('Technical Screen');
  const [interviewLink, setInterviewLink] = useState('https://meet.google.com/workspark-tech-interview');
  const [interviewNotes, setInterviewNotes] = useState('Focus on Java concurrency and JPA transaction boundaries.');

  // Status notes input in candidate drawer
  const [statusUpdateNote, setStatusUpdateNote] = useState('');

  // Handle Post Job Submit
  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postJob({
      title: newTitle,
      company: newCompany,
      department: newDepartment,
      location: newLocation,
      type: newType,
      experienceLevel: newExperience,
      salaryMin: Number(newSalaryMin),
      salaryMax: Number(newSalaryMax),
      currency: 'USD',
      description: newDescription,
      responsibilities: newResponsibilities.split('\n').filter(r => r.trim().length > 0),
      requirements: newRequirements.split('\n').filter(r => r.trim().length > 0),
      skills: newSkills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      postedByEmail: 'recruiting@apexfintech.com',
      deadline: newDeadline
    });

    setPostJobSuccess(true);
    setTimeout(() => {
      setPostJobSuccess(false);
      setShowPostJobModal(false);
      setActiveEmployerTab('postings');
    }, 1200);
  };

  // Filtered applications for ATS
  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const matchJob = selectedJobFilter === 'All' || app.jobId === selectedJobFilter;
      const matchStatus = selectedStatusFilter === 'All' || app.status === selectedStatusFilter;
      return matchJob && matchStatus;
    });
  }, [applications, selectedJobFilter, selectedStatusFilter]);

  // Employer stats
  const totalPostings = jobs.length;
  const approvedPostings = jobs.filter(j => j.status === 'APPROVED').length;
  const pendingModeration = jobs.filter(j => j.status === 'PENDING_APPROVAL').length;
  const totalApplicants = applications.length;
  const scheduledInterviews = applications.filter(a => a.status === 'INTERVIEW_SCHEDULED').length;

  // Handle status update
  const handleStatusChange = (status: ApplicationStatus) => {
    if (!reviewingApplication) return;

    if (status === 'INTERVIEW_SCHEDULED') {
      setShowInterviewModal(true);
      return;
    }

    updateApplicationStatus(reviewingApplication.id, status, statusUpdateNote || undefined);

    // Update local state in drawer
    setReviewingApplication(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status,
        employerNotes: statusUpdateNote || prev.employerNotes
      };
    });
    setStatusUpdateNote('');
  };

  const handleConfirmInterview = () => {
    if (!reviewingApplication) return;

    const interviewDetails: InterviewDetails = {
      date: interviewDate,
      time: interviewTime,
      type: interviewType,
      linkOrLocation: interviewLink,
      notes: interviewNotes
    };

    updateApplicationStatus(
      reviewingApplication.id,
      'INTERVIEW_SCHEDULED',
      interviewNotes,
      interviewDetails
    );

    setReviewingApplication(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: 'INTERVIEW_SCHEDULED',
        interviewDetails
      };
    });

    setShowInterviewModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Stats & Post Job Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Employer Recruitment & ATS Hub
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Post job vacancies, screen incoming candidates, schedule technical interviews, and advance hiring stages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPostJobModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Vacancies</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
              {totalPostings}
            </span>
            <span className="text-[11px] text-neutral-400">
              ({approvedPostings} active · {pendingModeration} in review)
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Applicants</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neutral-900 dark:text-white tabular-nums">
              {totalApplicants}
            </span>
            <span className="text-[11px] text-neutral-400">across all positions</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Interviews Scheduled</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {scheduledInterviews}
            </span>
            <span className="text-[11px] text-neutral-400">active invitations</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Pending Moderation</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {pendingModeration}
            </span>
            <span className="text-[11px] text-neutral-400">awaiting Admin check</span>
          </div>
        </div>
      </div>

      {/* Tabs: ATS Pipeline vs My Postings */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveEmployerTab('ats')}
          className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
            activeEmployerTab === 'ats'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          Applicant Tracking (ATS Pipeline) ({applications.length})
        </button>
        <button
          onClick={() => setActiveEmployerTab('postings')}
          className={`pb-3 text-sm font-medium transition-colors whitespace-nowrap ${
            activeEmployerTab === 'postings'
              ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400'
              : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          My Posted Vacancies ({jobs.length})
        </button>
      </div>

      {activeEmployerTab === 'ats' ? (
        /* ATS Pipeline View */
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Filter Candidates:
                </span>
              </div>

              <select
                value={selectedJobFilter}
                onChange={e => setSelectedJobFilter(e.target.value)}
                className="text-xs px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
              >
                <option value="All">All Job Vacancies</option>
                {jobs.map(j => (
                  <option key={j.id} value={j.id}>
                    {j.title}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatusFilter}
                onChange={e => setSelectedStatusFilter(e.target.value)}
                className="text-xs px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden"
              >
                <option value="All">All Application Stages</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="OFFER_EXTENDED">Offer Extended</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <span className="text-xs text-neutral-400 tabular-nums">
              Showing {filteredApplications.length} candidates
            </span>
          </div>

          {/* Applications Table / Cards */}
          {filteredApplications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
              <Users className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                No candidates match this criteria
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                When candidates apply to your approved jobs, they will immediately appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs overflow-hidden">
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {filteredApplications.map(app => {
                  return (
                    <div
                      key={app.id}
                      className="p-4 sm:p-5 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-sm shrink-0">
                          {app.candidateName.charAt(0)}
                        </div>

                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-semibold text-neutral-950 dark:text-white">
                              {app.candidateName}
                            </h3>
                            {/* Unboxed metadata separator */}
                            <span className="text-xs text-neutral-400" aria-hidden="true">·</span>
                            <span className="text-xs text-neutral-600 dark:text-neutral-400">
                              Applied for <strong className="text-neutral-900 dark:text-neutral-200">{app.jobTitle}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            {app.candidateHeadline}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500 pt-1">
                            <span>Experience: <strong className="text-neutral-700 dark:text-neutral-300 tabular-nums">{app.yearsExperience} yrs</strong></span>
                            <span aria-hidden="true">·</span>
                            <span>{app.candidateEmail}</span>
                            <span aria-hidden="true">·</span>
                            <span>{app.candidatePhone}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Review Action */}
                      <div className="flex items-center gap-3 sm:self-center shrink-0">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-medium whitespace-nowrap ${
                            app.status === 'SHORTLISTED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : app.status === 'INTERVIEW_SCHEDULED'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 ring-1 ring-purple-300 dark:ring-purple-800'
                              : app.status === 'OFFER_EXTENDED'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              : app.status === 'REJECTED'
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                              : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'
                          }`}
                        >
                          {app.status.replace('_', ' ')}
                        </span>

                        <button
                          onClick={() => {
                            setReviewingApplication(app);
                            setStatusUpdateNote(app.employerNotes || '');
                          }}
                          className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                        >
                          Review Candidate
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* My Postings View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div>
                    <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                      <span>{job.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {job.status === 'APPROVED' ? (
                      <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved & Live
                      </span>
                    ) : job.status === 'PENDING_APPROVAL' ? (
                      <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending Admin Review
                      </span>
                    ) : (
                      <span className="text-xs px-2.5 py-1 rounded-md font-medium bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Declined by Admin
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span>
                      Applicants:{' '}
                      <strong className="text-neutral-900 dark:text-white tabular-nums">
                        {job.applicantsCount}
                      </strong>
                    </span>
                    <span>
                      Posted:{' '}
                      <span className="tabular-nums">
                        {new Date(job.postedAt).toLocaleDateString()}
                      </span>
                    </span>
                    <span>
                      Deadline:{' '}
                      <span className="tabular-nums">{job.deadline}</span>
                    </span>
                  </div>

                  {job.status === 'PENDING_APPROVAL' && (
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 italic">
                      Tip: Switch to "Platform Admin" role at top to approve this posting immediately.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST NEW JOB MODAL */}
      {showPostJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
                  Post a New Job Vacancy
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Workflow Step 1: Newly posted jobs will enter the Admin Review Queue with status = PENDING_APPROVAL.
                </p>
              </div>
              <button
                onClick={() => setShowPostJobModal(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {postJobSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Job Vacancy Enqueued!
                </h3>
                <p className="text-xs text-neutral-500">
                  Status set to PENDING_APPROVAL. Dispatched to Admin Queue and logged to Java REST pipeline.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostJobSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Job Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Hiring Company
                    </label>
                    <input
                      type="text"
                      required
                      value={newCompany}
                      onChange={e => setNewCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Department
                    </label>
                    <input
                      type="text"
                      required
                      value={newDepartment}
                      onChange={e => setNewDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={e => setNewLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Job Type
                    </label>
                    <select
                      value={newType}
                      onChange={e => setNewType(e.target.value as JobType)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Remote">Remote</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Experience Level
                    </label>
                    <select
                      value={newExperience}
                      onChange={e => setNewExperience(e.target.value as ExperienceLevel)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    >
                      <option value="Entry-level">Entry-level</option>
                      <option value="Mid-level">Mid-level</option>
                      <option value="Senior">Senior</option>
                      <option value="Lead">Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Min Salary ($/yr)
                    </label>
                    <input
                      type="number"
                      step={1000}
                      value={newSalaryMin}
                      onChange={e => setNewSalaryMin(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Max Salary ($/yr)
                    </label>
                    <input
                      type="number"
                      step={1000}
                      value={newSalaryMax}
                      onChange={e => setNewSalaryMax(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Role Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Responsibilities (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={newResponsibilities}
                      onChange={e => setNewResponsibilities(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Requirements (one per line)
                    </label>
                    <textarea
                      rows={3}
                      value={newRequirements}
                      onChange={e => setNewRequirements(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Required Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newSkills}
                      onChange={e => setNewSkills(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Application Deadline
                    </label>
                    <input
                      type="date"
                      value={newDeadline}
                      onChange={e => setNewDeadline(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setShowPostJobModal(false)}
                    className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
                  >
                    Submit Vacancy for Admin Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CANDIDATE REVIEW DRAWER / MODAL */}
      {reviewingApplication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-indigo-700 dark:text-indigo-300 text-lg">
                  {reviewingApplication.candidateName.charAt(0)}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                    {reviewingApplication.candidateName}
                  </h2>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Applying for {reviewingApplication.jobTitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setReviewingApplication(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Details & Resume */}
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl space-y-2">
                <div className="grid grid-cols-2 gap-2 text-neutral-700 dark:text-neutral-300">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Email</span>
                    <strong>{reviewingApplication.candidateEmail}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Phone</span>
                    <strong>{reviewingApplication.candidatePhone}</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Experience</span>
                    <strong className="tabular-nums">{reviewingApplication.yearsExperience} Years</strong>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase">Applied Date</span>
                    <strong className="tabular-nums">{new Date(reviewingApplication.appliedAt).toLocaleDateString()}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/50 dark:border-neutral-700/50">
                  <span className="text-neutral-400 block text-[10px] uppercase">Attached Resume</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-medium text-neutral-900 dark:text-white flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-600" />
                      {reviewingApplication.resumeFileName}
                    </span>
                    <span className="text-[10px] text-neutral-400">Verified PDF</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Candidate Summary & Portfolio
                </h4>
                <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                  {reviewingApplication.resumeSummary}
                </p>
                {reviewingApplication.portfolioUrl && (
                  <a
                    href={reviewingApplication.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {reviewingApplication.portfolioUrl}
                  </a>
                )}
              </div>

              {reviewingApplication.coverNote && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Candidate Cover Note
                  </h4>
                  <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed italic bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    "{reviewingApplication.coverNote}"
                  </p>
                </div>
              )}

              {/* Status Update Controls */}
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/60 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Update Application Status
                  </h4>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Current: {reviewingApplication.status.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <label className="block text-neutral-600 dark:text-neutral-400 text-[11px] mb-1">
                    Internal Hiring Notes / Feedback (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Strong Java performance background, proceeding to tech interview"
                    value={statusUpdateNote}
                    onChange={e => setStatusUpdateNote(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white text-xs"
                  />
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleStatusChange('UNDER_REVIEW')}
                    className="px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100"
                  >
                    Mark Under Review
                  </button>
                  <button
                    onClick={() => handleStatusChange('SHORTLISTED')}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
                  >
                    Shortlist Candidate
                  </button>
                  <button
                    onClick={() => handleStatusChange('INTERVIEW_SCHEDULED')}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => handleStatusChange('OFFER_EXTENDED')}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    Extend Job Offer
                  </button>
                  <button
                    onClick={() => handleStatusChange('REJECTED')}
                    className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-600 hover:bg-red-500 text-white"
                  >
                    Decline Candidate
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setReviewingApplication(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white">
                  Schedule Candidate Interview
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Candidate: {reviewingApplication?.candidateName}
                </p>
              </div>
              <button
                onClick={() => setShowInterviewModal(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={interviewDate}
                    onChange={e => setInterviewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Time & Zone
                  </label>
                  <input
                    type="text"
                    value={interviewTime}
                    onChange={e => setInterviewTime(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Interview Format
                </label>
                <select
                  value={interviewType}
                  onChange={e => setInterviewType(e.target.value as InterviewDetails['type'])}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                >
                  <option value="Technical Screen">Technical Screen</option>
                  <option value="Hiring Manager">Hiring Manager Discussion</option>
                  <option value="Panel Interview">Full Engineering Panel</option>
                  <option value="HR Discussion">HR & Culture Fit</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Meeting URL or Room
                </label>
                <input
                  type="text"
                  value={interviewLink}
                  onChange={e => setInterviewLink(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Instructions / Topics for Candidate
                </label>
                <textarea
                  rows={2}
                  value={interviewNotes}
                  onChange={e => setInterviewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setShowInterviewModal(false)}
                className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInterview}
                className="px-4 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-xs"
              >
                Confirm & Dispatch Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
