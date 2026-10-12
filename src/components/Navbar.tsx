import React, { useState } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import {
  Briefcase,
  Sun,
  Moon,
  Bell,
  CheckCircle2,
  Code2,
  Shield,
  User,
  Building2,
  RotateCcw,
  Check,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({
  activeTab,
  setActiveTab
}) => {
  const {
    role,
    setRole,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    clearNotifications,
    setShowJavaModal,
    setShowAuthModal,
    setAuthMode,
    resetDemoData
  } = useJobPortal();

  const [showNotifications, setShowNotifications] = useState(false);

  // Unread notifications for current role
  const roleNotifs = notifications.filter(n => n.targetRole === role);
  const unreadCount = roleNotifs.filter(n => !n.read).length;

  const roleMeta: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    seeker: {
      label: 'Job Seeker',
      icon: <User className="w-3.5 h-3.5" />,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    employer: {
      label: 'Employer',
      icon: <Building2 className="w-3.5 h-3.5" />,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    admin: {
      label: 'Platform Admin',
      icon: <Shield className="w-3.5 h-3.5" />,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <span className="text-xl font-bold tracking-tight text-neutral-950 dark:text-white whitespace-nowrap">
            WorkSpark
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-400">
          <button
            onClick={() => setActiveTab('home')}
            className={`transition-colors whitespace-nowrap hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'home'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-indigo-600 decoration-2'
                : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setRole('seeker');
              setActiveTab('jobs');
            }}
            className={`transition-colors whitespace-nowrap hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'jobs'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-indigo-600 decoration-2'
                : ''
            }`}
          >
            Find Jobs
          </button>
          <button
            onClick={() => {
              setRole('seeker');
              setActiveTab('my-applications');
            }}
            className={`transition-colors whitespace-nowrap hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'my-applications'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-indigo-600 decoration-2'
                : ''
            }`}
          >
            My Applications
          </button>
          <button
            onClick={() => {
              setRole('employer');
              setActiveTab('employer-portal');
            }}
            className={`transition-colors whitespace-nowrap hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'employer-portal'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-indigo-600 decoration-2'
                : ''
            }`}
          >
            Employer ATS
          </button>
          <button
            onClick={() => {
              setRole('admin');
              setActiveTab('admin-queue');
            }}
            className={`transition-colors whitespace-nowrap hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'admin-queue'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-indigo-600 decoration-2'
                : ''
            }`}
          >
            Admin Queue
          </button>
          <button
            onClick={() => {
              setRole('admin');
              setActiveTab('admin-users');
            }}
            className={`transition-colors whitespace-nowrap hover:text-neutral-900 dark:hover:text-white ${
              activeTab === 'admin-users'
                ? 'text-neutral-900 dark:text-white font-semibold underline underline-offset-8 decoration-indigo-600 decoration-2'
                : ''
            }`}
          >
            Platform Users
          </button>
        </nav>

        {/* Zone 3: Primary Action & Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Java Spring Boot Blueprint Trigger */}
          <button
            onClick={() => setShowJavaModal(true)}
            title="Inspect Spring Boot REST Controllers & JPA Architecture"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-neutral-200 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors whitespace-nowrap"
          >
            <Code2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Java Backend</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-neutral-700" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl py-2 z-50">
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    Notifications ({roleMeta[role].label})
                  </span>
                  {unreadCount > 0 && (
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                  {roleNotifs.length === 0 ? (
                    <div className="px-4 py-6 text-center text-xs text-neutral-500">
                      No notifications for {roleMeta[role].label}
                    </div>
                  ) : (
                    roleNotifs.map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`px-4 py-3 cursor-pointer text-xs transition-colors ${
                          !n.read
                            ? 'bg-indigo-50/50 dark:bg-indigo-950/20'
                            : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-neutral-600 dark:text-neutral-400 mt-1">{n.message}</p>
                        <span className="text-[10px] text-neutral-400 mt-1 block">
                          {new Date(n.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Persona Role Selector */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg border border-neutral-200/80 dark:border-neutral-700/80">
            <button
              onClick={() => {
                setRole('seeker');
                setActiveTab('jobs');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                role === 'seeker'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span className="hidden sm:inline">Seeker</span>
            </button>
            <button
              onClick={() => {
                setRole('employer');
                setActiveTab('employer-portal');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                role === 'employer'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3 h-3" />
              <span className="hidden sm:inline">Employer</span>
            </button>
            <button
              onClick={() => {
                setRole('admin');
                setActiveTab('admin-queue');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                role === 'admin'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>

          {/* Sign In / Account Modal Trigger */}
          <button
            onClick={() => {
              setAuthMode('login');
              setShowAuthModal(true);
            }}
            className="px-3 py-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors whitespace-nowrap"
          >
            Sign In
          </button>

          {/* Reset Demo State Button */}
          <button
            onClick={resetDemoData}
            title="Reset to initial test data"
            className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};
