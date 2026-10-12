import React, { useState } from 'react';
import { JobPortalProvider, useJobPortal } from './context/JobPortalContext';
import { Navbar } from './components/Navbar';
import { WorkflowGuideBanner } from './components/WorkflowGuideBanner';
import { HomeScreen } from './components/HomeScreen';
import { JobSeekerDashboard } from './components/JobSeekerDashboard';
import { EmployerDashboard } from './components/EmployerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { JavaArchitectureModal } from './components/JavaArchitectureModal';
import { AuthModal } from './components/AuthModal';
import { Sparkles, Code2 } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, setRole, setShowJavaModal, setShowAuthModal, setAuthMode } = useJobPortal();
  const [activeTab, setActiveTab] = useState<'home' | 'jobs' | 'my-applications' | 'employer-portal' | 'admin-queue' | 'admin-users'>('home');
  const [seekerSubTab, setSeekerSubTab] = useState<'jobs' | 'my-applications'>('jobs');

  // Handle tab routing
  const handleNavTab = (tab: string) => {
    if (tab === 'home') {
      setActiveTab('home');
    } else if (tab === 'jobs') {
      setRole('seeker');
      setActiveTab('jobs');
      setSeekerSubTab('jobs');
    } else if (tab === 'my-applications') {
      setRole('seeker');
      setActiveTab('my-applications');
      setSeekerSubTab('my-applications');
    } else if (tab === 'employer-portal') {
      setRole('employer');
      setActiveTab('employer-portal');
    } else if (tab === 'admin-queue') {
      setRole('admin');
      setActiveTab('admin-queue');
    } else if (tab === 'admin-users') {
      setRole('admin');
      setActiveTab('admin-users');
    }
  };

  const handleHomeExploreJobs = (filter?: { query?: string; department?: string }) => {
    setRole('seeker');
    setActiveTab('jobs');
    setSeekerSubTab('jobs');
  };

  const handleHomePostJob = () => {
    setRole('employer');
    setActiveTab('employer-portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Navbar activeTab={activeTab} setActiveTab={handleNavTab} />

      {/* Interactive 4-Step Recruitment Workflow Stepper */}
      <WorkflowGuideBanner setActiveTab={handleNavTab} />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeScreen
            onExploreJobs={handleHomeExploreJobs}
            onPostJob={handleHomePostJob}
          />
        )}

        {(activeTab === 'jobs' || activeTab === 'my-applications') && (
          <JobSeekerDashboard activeSubTab={seekerSubTab} setActiveSubTab={setSeekerSubTab} />
        )}

        {activeTab === 'employer-portal' && <EmployerDashboard />}

        {activeTab === 'admin-queue' && <AdminDashboard defaultTab="queue" />}

        {activeTab === 'admin-users' && <AdminDashboard defaultTab="users" />}
      </main>

      {/* Java Architecture & Spring REST Simulation Modal */}
      <JavaArchitectureModal />

      {/* Login & Registration Modal */}
      <AuthModal />

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-8 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              </div>
              <span className="font-bold text-neutral-900 dark:text-white text-sm">WorkSpark</span>
              <span aria-hidden="true">·</span>
              <span>Online Job Portal & Recruitment Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleNavTab('home')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => handleNavTab('jobs')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Find Jobs
              </button>
              <button
                onClick={() => handleNavTab('employer-portal')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Employer Hub
              </button>
              <button
                onClick={() => handleNavTab('admin-queue')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Admin Queue
              </button>
              <button
                onClick={() => handleNavTab('admin-users')}
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                Platform Users
              </button>
              <button
                onClick={() => setShowJavaModal(true)}
                className="text-amber-600 dark:text-amber-400 font-medium hover:underline flex items-center gap-1"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Java Spring API</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400">
            <span>© 2026 WorkSpark Inc. All verified jobs subject to administrative compliance.</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setShowAuthModal(true);
                }}
                className="hover:underline"
              >
                Sign In
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  setAuthMode('register');
                  setShowAuthModal(true);
                }}
                className="hover:underline"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <JobPortalProvider>
      <MainContent />
    </JobPortalProvider>
  );
}
