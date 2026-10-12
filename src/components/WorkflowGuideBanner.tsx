import React from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import { PlusCircle, CheckCircle, Search, UserCheck, ArrowRight } from 'lucide-react';
import { UserRole } from '../types';

export const WorkflowGuideBanner: React.FC<{ setActiveTab: (tab: string) => void }> = ({
  setActiveTab
}) => {
  const { role, setRole, jobs, applications } = useJobPortal();

  const pendingJobsCount = jobs.filter(j => j.status === 'PENDING_APPROVAL').length;
  const approvedJobsCount = jobs.filter(j => j.status === 'APPROVED').length;
  const pendingReviewApps = applications.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW').length;

  const steps: {
    num: string;
    title: string;
    targetRole: UserRole;
    actionLabel: string;
    countNotice?: string;
    icon: React.ReactNode;
  }[] = [
    {
      num: '01',
      title: 'Employer Posts Vacancy',
      targetRole: 'employer',
      actionLabel: 'Post as Employer',
      countNotice: 'Ready to post',
      icon: <PlusCircle className="w-4 h-4 text-blue-500" />
    },
    {
      num: '02',
      title: 'Admin Reviews & Approves',
      targetRole: 'admin',
      actionLabel: 'Open Admin Queue',
      countNotice: pendingJobsCount > 0 ? `${pendingJobsCount} pending review` : 'All reviewed',
      icon: <CheckCircle className="w-4 h-4 text-amber-500" />
    },
    {
      num: '03',
      title: 'Candidate Searches & Applies',
      targetRole: 'seeker',
      actionLabel: 'Search & Apply',
      countNotice: `${approvedJobsCount} live vacancies`,
      icon: <Search className="w-4 h-4 text-emerald-500" />
    },
    {
      num: '04',
      title: 'Employer Reviews & Updates Status',
      targetRole: 'employer',
      actionLabel: 'Review ATS Pipeline',
      countNotice: pendingReviewApps > 0 ? `${pendingReviewApps} awaiting review` : `${applications.length} candidates`,
      icon: <UserCheck className="w-4 h-4 text-indigo-500" />
    }
  ];

  return (
    <div className="bg-neutral-100/70 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 py-3 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              Recruitment Workflow Pipeline:
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 w-full lg:w-auto">
            {steps.map((s, idx) => {
              const isCurrentRole = s.targetRole === role;
              return (
                <div
                  key={s.num}
                  onClick={() => {
                    setRole(s.targetRole);
                    if (s.targetRole === 'admin') setActiveTab('admin-queue');
                    else if (s.targetRole === 'employer') setActiveTab('employer-portal');
                    else setActiveTab('jobs');
                  }}
                  className={`cursor-pointer rounded-md p-2.5 transition-all text-xs border ${
                    isCurrentRole
                      ? 'bg-white dark:bg-neutral-800 border-indigo-500/40 shadow-xs ring-1 ring-indigo-500/30'
                      : 'bg-white/40 dark:bg-neutral-800/40 border-neutral-200/60 dark:border-neutral-700/60 hover:bg-white dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-semibold text-neutral-400">
                        {s.num}
                      </span>
                      {s.icon}
                      <span className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {s.title}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                    <span className="tabular-nums">{s.countNotice}</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5">
                      {s.actionLabel}
                      <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
