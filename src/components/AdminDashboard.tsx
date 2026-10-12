import React, { useState, useMemo } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import { JobPosting, UserRole } from '../types';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  Users,
  Search,
  Filter,
  Check,
  X,
  UserCheck,
  UserX,
  Calendar,
  Building2,
  Mail,
  MapPin,
  Plus
} from 'lucide-react';

export const AdminDashboard: React.FC<{ defaultTab?: 'queue' | 'users' }> = ({ defaultTab = 'queue' }) => {
  const {
    jobs,
    applications,
    users,
    approveJob,
    rejectJob,
    toggleUserStatus,
    setShowAuthModal,
    setAuthMode
  } = useJobPortal();

  const [activeAdminTab, setActiveAdminTab] = useState<'queue' | 'users' | 'registry'>(defaultTab);

  // Queue Modals state
  const [inspectingJob, setInspectingJob] = useState<JobPosting | null>(null);
  const [rejectingJobId, setRejectingJobId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Missing required salary transparency details');
  const [approvalNote, setApprovalNote] = useState('Meets corporate hiring guidelines');
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Users Filter State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserRole>('All');

  const pendingJobs = jobs.filter(j => j.status === 'PENDING_APPROVAL');
  const approvedJobs = jobs.filter(j => j.status === 'APPROVED');
  const rejectedJobs = jobs.filter(j => j.status === 'REJECTED');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchQuery =
        userSearchQuery === '' ||
        u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.companyOrHeadline.toLowerCase().includes(userSearchQuery.toLowerCase());
      const matchRole = userRoleFilter === 'All' || u.role === userRoleFilter;
      return matchQuery && matchRole;
    });
  }, [users, userSearchQuery, userRoleFilter]);

  const handleApprove = (jobId: string) => {
    approveJob(jobId, approvalNote);
    setActionSuccessMsg('Job successfully approved! It is now live on the WorkSpark Job Seeker board.');
    setInspectingJob(null);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  const handleReject = (jobId: string) => {
    rejectJob(jobId, rejectReason);
    setActionSuccessMsg('Job rejected and feedback returned to employer.');
    setRejectingJobId(null);
    setInspectingJob(null);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Platform Governance & Trust</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white mt-1">
            WorkSpark Administrative Console
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Approve employer job listings, manage registered users, and audit platform activity.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
          <button
            onClick={() => setActiveAdminTab('queue')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeAdminTab === 'queue'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Approval Queue ({pendingJobs.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeAdminTab === 'users'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Registered Users ({users.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('registry')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeAdminTab === 'registry'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            All Postings ({jobs.length})
          </button>
        </div>
      </div>

      {/* Success alert banner */}
      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Pending Review Queue</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              {pendingJobs.length}
            </span>
            <span className="text-[11px] text-neutral-400">needs review</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Live Postings</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {approvedJobs.length}
            </span>
            <span className="text-[11px] text-neutral-400">approved & active</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Total Candidates & Orgs</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {users.length}
            </span>
            <span className="text-[11px] text-neutral-400">registered users</span>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-neutral-500 dark:text-neutral-400">Active Applications</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              {applications.length}
            </span>
            <span className="text-[11px] text-neutral-400">across system</span>
          </div>
        </div>
      </div>

      {activeAdminTab === 'queue' ? (
        /* PENDING APPROVAL QUEUE */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-950 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending Vacancies Requiring Action ({pendingJobs.length})</span>
            </h2>
            <span className="text-xs text-neutral-500">
              Approved postings instantly publish to candidate search
            </span>
          </div>

          {pendingJobs.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6">
              <CheckCircle className="w-9 h-9 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Queue is completely clear!
              </h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                No vacancies are waiting for admin approval. When an employer creates a new job post, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingJobs.map(job => (
                <div
                  key={job.id}
                  className="bg-white dark:bg-neutral-900 border border-amber-200/80 dark:border-amber-900/50 rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 rounded">
                        Requires Approval
                      </span>
                      <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                        {job.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">{job.company}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.department}</span>
                      <span aria-hidden="true">·</span>
                      <span>{job.location}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums font-medium text-neutral-800 dark:text-neutral-200">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Posted {new Date(job.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mt-1">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.skills.map(s => (
                        <span key={s} className="px-2 py-0.5 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 md:self-center shrink-0">
                    <button
                      onClick={() => setInspectingJob(job)}
                      className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Inspect Post
                    </button>
                    <button
                      onClick={() => setRejectingJobId(job.id)}
                      className="px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-lg transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleApprove(job.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Publish</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeAdminTab === 'users' ? (
        /* REGISTERED USERS MANAGEMENT */
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name, email, or company..."
                  value={userSearchQuery}
                  onChange={e => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value as 'All' | UserRole)}
                className="text-xs px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-800 dark:text-neutral-200"
              >
                <option value="All">All User Roles</option>
                <option value="seeker">Candidates</option>
                <option value="employer">Employers</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            <button
              onClick={() => {
                setAuthMode('register');
                setShowAuthModal(true);
              }}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Platform User</span>
            </button>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">User Profile</th>
                    <th className="px-4 py-3 font-semibold">Role</th>
                    <th className="px-4 py-3 font-semibold">Affiliation / Headline</th>
                    <th className="px-4 py-3 font-semibold">Location</th>
                    <th className="px-4 py-3 font-semibold">Joined Date</th>
                    <th className="px-4 py-3 font-semibold">Account Status</th>
                    <th className="px-4 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center text-xs">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white">{user.name}</div>
                            <div className="text-[11px] text-neutral-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium capitalize ${
                            user.role === 'admin'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                              : user.role === 'employer'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 max-w-xs truncate">
                        {user.companyOrHeadline}
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{user.location}</td>
                      <td className="px-4 py-3 text-neutral-500 tabular-nums">{user.joinedAt}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}
                        >
                          {user.status === 'ACTIVE' ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`text-xs font-medium hover:underline ${
                              user.status === 'ACTIVE'
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {user.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ALL POSTINGS REGISTRY */
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Position & Employer</th>
                    <th className="px-4 py-3 font-semibold">Department</th>
                    <th className="px-4 py-3 font-semibold">Salary Range</th>
                    <th className="px-4 py-3 font-semibold">Compliance Status</th>
                    <th className="px-4 py-3 font-semibold">Applicants</th>
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {jobs.map(job => (
                    <tr key={job.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-neutral-900 dark:text-white">{job.title}</div>
                        <div className="text-[11px] text-neutral-500">{job.company} · {job.location}</div>
                      </td>
                      <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{job.department}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300 tabular-nums">
                        ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[11px] font-medium ${
                            job.status === 'APPROVED'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : job.status === 'PENDING_APPROVAL'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400'
                          }`}
                        >
                          {job.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-4 py-3 tabular-nums font-semibold text-neutral-800 dark:text-neutral-200">
                        {job.applicantsCount}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setInspectingJob(job)}
                          className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT MODAL */}
      {inspectingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400">Compliance Audit</span>
                <h3 className="text-lg font-bold text-neutral-950 dark:text-white mt-0.5">
                  {inspectingJob.title}
                </h3>
                <p className="text-neutral-500">{inspectingJob.company} · {inspectingJob.location}</p>
              </div>
              <button
                onClick={() => setInspectingJob(null)}
                className="p-1 rounded-md text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <strong className="block text-neutral-900 dark:text-white mb-1">Description:</strong>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed bg-neutral-50 dark:bg-neutral-800 p-3 rounded-lg">
                  {inspectingJob.description}
                </p>
              </div>

              <div>
                <strong className="block text-neutral-900 dark:text-white mb-1">Requirements:</strong>
                <ul className="list-disc pl-5 text-neutral-600 dark:text-neutral-400 space-y-0.5">
                  {inspectingJob.requirements.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              {inspectingJob.status === 'PENDING_APPROVAL' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <label className="block font-medium text-amber-900 dark:text-amber-200 mb-1">
                    Approval Verification Note
                  </label>
                  <input
                    type="text"
                    value={approvalNote}
                    onChange={e => setApprovalNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded text-xs"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => setInspectingJob(null)}
                className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900"
              >
                Close
              </button>
              {inspectingJob.status === 'PENDING_APPROVAL' && (
                <button
                  onClick={() => handleApprove(inspectingJob.id)}
                  className="px-4 py-1.5 font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-xs"
                >
                  Confirm Approval
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {rejectingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md w-full p-5 shadow-2xl space-y-4 text-xs">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Decline Job Posting
            </h3>
            <p className="text-neutral-500">
              State the reason for declining this post. The employer will be notified.
            </p>
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Reason for rejection
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRejectingJobId(null)}
                className="px-3 py-1.5 text-neutral-500"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(rejectingJobId)}
                className="px-4 py-1.5 font-medium text-white bg-red-600 hover:bg-red-500 rounded-lg"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
