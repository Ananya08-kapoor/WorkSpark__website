import React, { useState } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import { JobPosting } from '../types';
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Briefcase,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle,
  TrendingUp,
  Cpu,
  Palette,
  Check,
  Code2,
  DollarSign
} from 'lucide-react';

export const HomeScreen: React.FC<{
  onExploreJobs: (filter?: { query?: string; department?: string }) => void;
  onPostJob: () => void;
}> = ({ onExploreJobs, onPostJob }) => {
  const { jobs, setRole, setShowJavaModal, setShowAuthModal, setAuthMode } = useJobPortal();

  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [department, setDepartment] = useState('All');

  // Approved jobs for featured cards
  const approvedJobs = jobs.filter(j => j.status === 'APPROVED');

  const categories = [
    { name: 'Core Software & Java', count: 142, icon: <Code2 className="w-5 h-5 text-indigo-500" /> },
    { name: 'Cloud Platform & DevOps', count: 86, icon: <Cpu className="w-5 h-5 text-blue-500" /> },
    { name: 'Product & Design Systems', count: 54, icon: <Palette className="w-5 h-5 text-purple-500" /> },
    { name: 'Core Banking & Fintech', count: 78, icon: <TrendingUp className="w-5 h-5 text-emerald-500" /> },
    { name: 'Quality Assurance & QA', count: 41, icon: <CheckCircle className="w-5 h-5 text-amber-500" /> },
    { name: 'Corporate Operations', count: 65, icon: <Building2 className="w-5 h-5 text-rose-500" /> },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExploreJobs({ query: keyword, department: department !== 'All' ? department : undefined });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Modern Recruitment & Career Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 dark:text-white leading-[1.12]">
                Ignite your next career leap with <span className="text-indigo-600 dark:text-indigo-400">WorkSpark</span>.
              </h1>

              <p className="text-base text-neutral-600 dark:text-neutral-300 max-w-xl leading-relaxed">
                WorkSpark bridges premier engineering, design, and management talent with vetted companies. Experience seamless workflows: post vacancies, verify compliance, and track candidate pipelines in real time.
              </p>

              {/* SEARCH BAR BOX */}
              <form
                onSubmit={handleSearchSubmit}
                className="p-2 sm:p-2.5 bg-neutral-50 dark:bg-neutral-800/80 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-md flex flex-col sm:flex-row gap-2"
              >
                <div className="flex-1 relative flex items-center">
                  <Search className="w-4 h-4 text-neutral-400 absolute left-3" />
                  <input
                    type="text"
                    placeholder="Job title, skill (e.g. Java, React)..."
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                  />
                </div>

                <div className="sm:border-l border-neutral-200 dark:border-neutral-700 pl-2 flex items-center">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Location or Remote"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="w-full pl-2 pr-3 py-2 text-xs bg-transparent border-none text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Search Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Popular tags */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="font-medium text-neutral-700 dark:text-neutral-300">Popular:</span>
                {['Java 21', 'Spring Boot', 'React 19', 'Remote', 'Kubernetes', 'Product Design'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => onExploreJobs({ query: tag })}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-[11px]"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* STATS STRIP */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                <div>
                  <span className="block font-bold text-neutral-900 dark:text-white text-lg tabular-nums">
                    15,800+
                  </span>
                  <span className="text-neutral-500 text-[11px]">Active Vacancies</span>
                </div>
                <div>
                  <span className="block font-bold text-neutral-900 dark:text-white text-lg tabular-nums">
                    4,200+
                  </span>
                  <span className="text-neutral-500 text-[11px]">Vetted Employers</span>
                </div>
                <div>
                  <span className="block font-bold text-neutral-900 dark:text-white text-lg tabular-nums">
                    100%
                  </span>
                  <span className="text-neutral-500 text-[11px]">Admin Verified</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl aspect-16/11">
                <img
                  src="/src/assets/images/hero_recruitment_office_1791836556568.jpg"
                  alt="WorkSpark Collaborative Recruitment Workspace"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-neutral-950/10 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white text-xs">
                  <span className="font-bold text-sm block">Vetted Enterprise Recruiting</span>
                  <span className="text-neutral-300 text-[11px]">
                    Direct candidate-to-manager interview scheduling & transparency
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPLORE BY CATEGORY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Explore by Department
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Find openings tailored to your specific engineering and product domain
            </p>
          </div>
          <button
            onClick={() => onExploreJobs()}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {categories.map(c => (
            <div
              key={c.name}
              onClick={() => onExploreJobs({ query: c.name.split(' ')[0] })}
              className="group p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer space-y-2"
            >
              <div className="w-9 h-9 rounded-lg bg-neutral-50 dark:bg-neutral-800 flex items-center justify-center group-hover:scale-105 transition-transform">
                {c.icon}
              </div>
              <h3 className="font-semibold text-xs text-neutral-900 dark:text-white leading-snug">
                {c.name}
              </h3>
              <span className="text-[11px] text-neutral-400 tabular-nums block">
                {c.count} vacancies
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED VACANCIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Featured Positions on WorkSpark
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              All jobs pass administrative moderation before appearing on this verified board
            </p>
          </div>
          <button
            onClick={() => onExploreJobs()}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Browse All ({approvedJobs.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {approvedJobs.slice(0, 6).map(job => (
            <div
              key={job.id}
              className="group p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center font-bold text-neutral-700 dark:text-neutral-300 text-sm">
                    {job.company.charAt(0)}
                  </div>
                  <span className="px-2 py-0.5 text-[11px] font-medium rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    {job.type}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-neutral-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {job.company} · {job.location}
                  </p>
                </div>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 3).map(skill => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 text-[10px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                  ${(job.salaryMin / 1000).toFixed(0)}k - ${(job.salaryMax / 1000).toFixed(0)}k / yr
                </span>
                <button
                  onClick={() => onExploreJobs({ query: job.title })}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* RECRUITMENT WORKFLOW HIGHLIGHT */}
      <section className="bg-neutral-100/60 dark:bg-neutral-900/60 border-y border-neutral-200 dark:border-neutral-800 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Transparent Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-950 dark:text-white">
              How the WorkSpark System Works
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Designed from first principles to remove ghost job postings and give candidates clarity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">
                01. Post Vacancy
              </span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Employer Posts Job</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Companies list requirements, compensation, and qualifications. Starts in moderation queue.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400">
                02. Compliance Check
              </span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Admin Reviews & Approves</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Platform administrators verify salary transparency and validity before publication.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                03. Match & Apply
              </span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Seeker Finds & Applies</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Live candidate search with smart skill compatibility matcher and one-click applications.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-2">
              <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400">
                04. ATS Pipeline
              </span>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">Review & Progress</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Employer reviews resumes, schedules technical interviews, and candidate sees live updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP HIRING PARTNERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs uppercase font-bold text-neutral-400 tracking-wider">
          Trusted by Industry Innovators
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 text-neutral-400 text-sm font-semibold">
          <span>Apex Financial</span>
          <span aria-hidden="true">·</span>
          <span>CloudScale IO</span>
          <span aria-hidden="true">·</span>
          <span>Nova Commerce</span>
          <span aria-hidden="true">·</span>
          <span>Loomis Design Studio</span>
          <span aria-hidden="true">·</span>
          <span>Quantum Health</span>
        </div>
      </section>
    </div>
  );
};
