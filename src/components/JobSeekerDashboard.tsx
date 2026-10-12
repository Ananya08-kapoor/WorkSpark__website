import React, { useState, useMemo } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import { JobPosting, JobApplication } from '../types';
import {
  Search,
  MapPin,
  DollarSign,
  Briefcase,
  CheckCircle,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  Calendar,
  ExternalLink,
  ChevronRight,
  X,
  Filter,
  Video
} from 'lucide-react';

export const JobSeekerDashboard: React.FC<{
  activeSubTab: 'jobs' | 'my-applications';
  setActiveSubTab: (t: 'jobs' | 'my-applications') => void;
}> = ({
  activeSubTab,
  setActiveSubTab
}) => {
  const { jobs, applications, applyForJob } = useJobPortal();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExperience, setSelectedExperience] = useState('All');

  // Modals state
  const [viewingJob, setViewingJob] = useState<JobPosting | null>(null);
  const [applyingJob, setApplyingJob] = useState<JobPosting | null>(null);

  // Application Form State
  const [candidateName, setCandidateName] = useState('Alex Mercer');
  const [candidateEmail, setCandidateEmail] = useState('alex.mercer.dev@gmail.com');
  const [candidatePhone, setCandidatePhone] = useState('+1 (555) 349-2810');
  const [candidateHeadline, setCandidateHeadline] = useState('Senior Backend Engineer · 6 Yrs Java / Spring / Cloud');
  const [yearsExperience, setYearsExperience] = useState(6);
  const [coverNote, setCoverNote] = useState(
    'I have extensive production experience building resilient distributed microservices in Java and Spring Boot. I would love to contribute to your team.'
  );
  const [resumeFileName, setResumeFileName] = useState('Alex_Mercer_Senior_Engineer_CV.pdf');
  const [applicationSubmittedSuccess, setApplicationSubmittedSuccess] = useState(false);

  // Only APPROVED jobs are visible to candidates on the public board
  const approvedJobs = useMemo(() => {
    return jobs.filter(j => j.status === 'APPROVED');
  }, [jobs]);

  // Unique departments for filter
  const departments = useMemo(() => {
    const list = Array.from(new Set(approvedJobs.map(j => j.department)));
    return ['All', ...list];
  }, [approvedJobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return approvedJobs.filter(job => {
      const matchQuery =
        searchQuery.trim() === '' ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchDept = selectedDepartment === 'All' || job.department === selectedDepartment;
      const matchType = selectedType === 'All' || job.type === selectedType;
      const matchExp = selectedExperience === 'All' || job.experienceLevel === selectedExperience;

      return matchQuery && matchDept && matchType && matchExp;
    });
  }, [approvedJobs, searchQuery, selectedDepartment, selectedType, selectedExperience]);

  // Applications list for current user email (simulate current user's apps)
  const myApplications = useMemo(() => {
    return applications;
  }, [applications]);

  // Calculate skill match score between candidate and selected job
  const getSkillMatch = (jobSkills: string[]) => {
    const candidateSkills = ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka', 'React', 'TypeScript', 'Redis'];
    const matches = jobSkills.filter(s =>
      candidateSkills.some(cs => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
    );
    const score = Math.round((matches.length / (jobSkills.length || 1)) * 100);
    return Math.min(100, Math.max(45, score));
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    applyForJob(applyingJob.id, {
      name: candidateName,
      email: candidateEmail,
      phone: candidatePhone,
      headline: candidateHeadline,
      yearsExperience,
      skills: ['Java 21', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka'],
      coverNote,
      resumeFileName,
      resumeSummary: `Demonstrated ${yearsExperience} years experience matching core requirements for ${applyingJob.title}.`,
      portfolioUrl: 'https://github.com/alexmercer-dev'
    });

    setApplicationSubmittedSuccess(true);
    setTimeout(() => {
      setApplicationSubmittedSuccess(false);
      setApplyingJob(null);
      setActiveSubTab('my-applications');
    }, 1200);
  };

  // Status step visual helper
  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 0;
      case 'UNDER_REVIEW':
        return 1;
      case 'SHORTLISTED':
        return 2;
      case 'INTERVIEW_SCHEDULED':
        return 3;
      case 'OFFER_EXTENDED':
        return 4;
      case 'REJECTED':
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sub navigation tabs */}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Job Seeker Portal
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Browse verified openings, apply in one click, and track real-time hiring stage transitions.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveSubTab('jobs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'jobs'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Explore Openings ({approvedJobs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('my-applications')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeSubTab === 'my-applications'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            My Applications ({myApplications.length})
          </button>
        </div>
      </div>

      {activeSubTab === 'jobs' ? (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by job title, skill (e.g. Java, React), or company..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-neutral-900 dark:text-white placeholder-neutral-400"
                />
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                <select
                  value={selectedDepartment}
                  onChange={e => setSelectedDepartment(e.target.value)}
                  className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Departments</option>
                  {departments
                    .filter(d => d !== 'All')
                    .map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>

                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Remote">Remote</option>
                  <option value="Contract">Contract</option>
                </select>

                <select
                  value={selectedExperience}
                  onChange={e => setSelectedExperience(e.target.value)}
                  className="text-xs px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="All">All Experience</option>
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <span className="tabular-nums">Showing {filteredJobs.length} approved vacancies</span>
              <span className="text-[11px]">Admin-verified compliance status: Active</span>
            </div>
          </div>

          {/* Job Postings Grid */}
          {filteredJobs.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
              <Briefcase className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                No matching jobs found
              </h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
                Try resetting your filters or check the Admin Queue if an employer just posted a new vacancy.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('All');
                  setSelectedType('All');
                  setSelectedExperience('All');
                }}
                className="mt-4 px-4 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/40"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map(job => {
                const hasApplied = applications.some(a => a.jobId === job.id);
                const skillMatch = getSkillMatch(job.skills);

                return (
                  <div
                    key={job.id}
                    className="group bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-xs"
                  >
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 shrink-0 text-base">
                          {job.company.charAt(0)}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-semibold text-neutral-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {job.title}
                            </h3>
                          </div>

                          {/* Zero-Pill Metadata Rule: unboxed clean text with typographic separators */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                            <span className="font-medium text-neutral-700 dark:text-neutral-300">{job.company}</span>
                            <span aria-hidden="true">·</span>
                            <span>{job.location}</span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums font-medium text-neutral-900 dark:text-neutral-200">
                              ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>{job.type}</span>
                            <span aria-hidden="true">·</span>
                            <span>{job.experienceLevel}</span>
                          </div>

                          <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-2 leading-relaxed">
                            {job.description}
                          </p>

                          {/* Skills list as clean text items */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-2">
                            {job.skills.map(skill => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          <span>Candidate Match: <strong className="text-neutral-900 dark:text-white tabular-nums">{skillMatch}%</strong></span>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => setViewingJob(job)}
                            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors whitespace-nowrap"
                          >
                            Details
                          </button>

                          {hasApplied ? (
                            <span className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center justify-center gap-1 whitespace-nowrap">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Applied
                            </span>
                          ) : (
                            <button
                              onClick={() => setApplyingJob(job)}
                              className="flex-1 sm:flex-none px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shadow-xs"
                            >
                              Apply Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* My Applications Tab */
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 shadow-xs">
            <h2 className="text-base font-semibold text-neutral-950 dark:text-white mb-1">
              Active Application Tracking
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Real-time synchronization with employer reviews and interview dispatch systems.
            </p>
          </div>

          {myApplications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-8">
              <FileText className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                No active applications yet
              </h3>
              <p className="text-sm text-neutral-500 mt-1">
                Explore the job board above to submit your first application.
              </p>
              <button
                onClick={() => setActiveSubTab('jobs')}
                className="mt-4 px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
              >
                Browse Vacancies
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myApplications.map(app => {
                const currentStepIdx = getStatusIndex(app.status);
                const isRejected = app.status === 'REJECTED';

                const workflowStages = [
                  'Application Submitted',
                  'Under Review',
                  'Shortlisted',
                  'Interview Scheduled',
                  'Offer Extended'
                ];

                return (
                  <div
                    key={app.id}
                    className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-xs space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                      <div>
                        <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                          {app.jobTitle}
                        </h3>
                        {/* Unboxed metadata */}
                        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">{app.company}</span>
                          <span aria-hidden="true">·</span>
                          <span>Applied on {new Date(app.appliedAt).toLocaleDateString()}</span>
                          <span aria-hidden="true">·</span>
                          <span>ID: {app.id}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                            isRejected
                              ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                              : app.status === 'INTERVIEW_SCHEDULED'
                              ? 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 ring-1 ring-purple-300 dark:ring-purple-800'
                              : app.status === 'OFFER_EXTENDED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                          }`}
                        >
                          Status: {app.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Progress Pipeline Visualization */}
                    {!isRejected ? (
                      <div className="py-2">
                        <div className="relative">
                          {/* Background Track */}
                          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-1/2 bg-neutral-200 dark:bg-neutral-800 -z-0" />

                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 relative z-10">
                            {workflowStages.map((stageName, idx) => {
                              const isCompleted = idx <= currentStepIdx;
                              const isCurrent = idx === currentStepIdx;

                              return (
                                <div
                                  key={stageName}
                                  className="flex sm:flex-col items-center sm:text-center gap-2.5 sm:gap-2"
                                >
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 transition-colors ${
                                      isCompleted
                                        ? 'bg-indigo-600 text-white shadow-xs'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-neutral-300 dark:border-neutral-700'
                                    }`}
                                  >
                                    {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                                  </div>

                                  <div className="text-left sm:text-center">
                                    <p
                                      className={`text-xs font-medium ${
                                        isCurrent
                                          ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                                          : isCompleted
                                          ? 'text-neutral-900 dark:text-neutral-200'
                                          : 'text-neutral-400 dark:text-neutral-500'
                                      }`}
                                    >
                                      {stageName}
                                    </p>
                                    {isCurrent && (
                                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                                        Current Stage
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50/50 dark:bg-red-950/20 rounded-lg text-xs text-red-700 dark:text-red-300">
                        This application has been concluded or declined by the hiring team.
                      </div>
                    )}

                    {/* Interview scheduled box if active */}
                    {app.interviewDetails && (
                      <div className="bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                                {app.interviewDetails.type} Confirmed
                              </h4>
                              <p className="text-xs text-neutral-700 dark:text-neutral-300 mt-1">
                                Scheduled Date:{' '}
                                <strong className="tabular-nums">
                                  {app.interviewDetails.date} at {app.interviewDetails.time}
                                </strong>
                              </p>
                              {app.interviewDetails.notes && (
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 italic">
                                  "{app.interviewDetails.notes}"
                                </p>
                              )}
                            </div>
                          </div>

                          {app.interviewDetails.linkOrLocation && (
                            <a
                              href={app.interviewDetails.linkOrLocation}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-md transition-colors flex items-center gap-1.5 shrink-0"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Join Meeting
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status history timeline */}
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-200 mb-2">
                        Workflow Audit Timeline
                      </h4>
                      <div className="space-y-2 border-l border-neutral-200 dark:border-neutral-800 ml-2 pl-3">
                        {app.timeline.map((evt, idx) => (
                          <div key={idx} className="relative text-xs">
                            <span className="absolute -left-[17px] top-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                              <span className="font-medium text-neutral-800 dark:text-neutral-200">
                                {evt.status.replace('_', ' ')}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">
                                {new Date(evt.timestamp).toLocaleString()}
                              </span>
                            </div>
                            {evt.note && (
                              <p className="text-neutral-600 dark:text-neutral-400 mt-0.5 text-[11px]">
                                {evt.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* JOB DETAIL MODAL */}
      {viewingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
                  {viewingJob.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mt-1">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{viewingJob.company}</span>
                  <span aria-hidden="true">·</span>
                  <span>{viewingJob.location}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums font-medium text-neutral-900 dark:text-neutral-100">
                    ${(viewingJob.salaryMin / 1000).toFixed(0)}k - ${(viewingJob.salaryMax / 1000).toFixed(0)}k / yr
                  </span>
                </div>
              </div>
              <button
                onClick={() => setViewingJob(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-neutral-700 dark:text-neutral-300">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  About the Role
                </h3>
                <p className="leading-relaxed">{viewingJob.description}</p>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Key Responsibilities
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {viewingJob.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Requirements & Qualifications
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  {viewingJob.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Required Technologies
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {viewingJob.skills.map(s => (
                    <span
                      key={s}
                      className="px-2 py-0.5 text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setViewingJob(null)}
                className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setApplyingJob(viewingJob);
                  setViewingJob(null);
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg"
              >
                Apply for this Position
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK APPLY MODAL */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-950 dark:text-white">
                  Apply for {applyingJob.title}
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {applyingJob.company} · {applyingJob.location}
                </p>
              </div>
              <button
                onClick={() => setApplyingJob(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applicationSubmittedSuccess ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Application Submitted!
                </h3>
                <p className="text-xs text-neutral-500">
                  Transferred to Employer review queue. Status initialized to SUBMITTED.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
                {/* Match Banner */}
                <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="font-medium text-neutral-800 dark:text-neutral-200">
                      Your Skill Compatibility Score
                    </span>
                  </div>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
                    {getSkillMatch(applyingJob.skills)}% Match
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={candidateName}
                      onChange={e => setCandidateName(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={candidateEmail}
                      onChange={e => setCandidateEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={candidatePhone}
                      onChange={e => setCandidatePhone(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Years of Experience
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={30}
                      value={yearsExperience}
                      onChange={e => setYearsExperience(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    value={candidateHeadline}
                    onChange={e => setCandidateHeadline(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Attached Resume / CV File
                  </label>
                  <div className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <input
                      type="text"
                      value={resumeFileName}
                      onChange={e => setResumeFileName(e.target.value)}
                      className="flex-1 bg-transparent border-none text-xs text-neutral-900 dark:text-white focus:outline-hidden"
                    />
                    <span className="text-[10px] text-neutral-400">PDF / Verified</span>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Brief Note to Hiring Team
                  </label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
