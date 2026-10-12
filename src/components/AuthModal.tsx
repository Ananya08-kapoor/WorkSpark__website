import React, { useState } from 'react';
import { useJobPortal } from '../context/JobPortalContext';
import { UserRole } from '../types';
import { X, User, Building2, Shield, CheckCircle2, Sparkles, ArrowRight, Lock, Mail } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    setRole,
    registerUser
  } = useJobPortal();

  const [selectedRole, setSelectedRole] = useState<UserRole>('seeker');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!showAuthModal) return null;

  const handleQuickLogin = (roleToSet: UserRole, userEmail: string) => {
    setRole(roleToSet);
    setSuccessMsg(`Logged in successfully as ${roleToSet.toUpperCase()}`);
    setTimeout(() => {
      setSuccessMsg(null);
      setShowAuthModal(false);
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      setRole(selectedRole);
      setSuccessMsg(`Welcome back to WorkSpark!`);
      setTimeout(() => {
        setSuccessMsg(null);
        setShowAuthModal(false);
      }, 900);
    } else {
      registerUser({
        name: name || 'New WorkSpark Member',
        email: email || 'user@workspark.com',
        role: selectedRole,
        companyOrHeadline: headline || (selectedRole === 'employer' ? 'Tech Hiring Org' : 'Software Specialist'),
        location: location || 'United States'
      });
      setSuccessMsg(`Account created! Welcome to WorkSpark.`);
      setTimeout(() => {
        setSuccessMsg(null);
        setShowAuthModal(false);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Lockup */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white mx-auto mb-2 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <h2 className="text-xl font-bold text-neutral-950 dark:text-white">
            {authMode === 'login' ? 'Sign In to WorkSpark' : 'Create Your WorkSpark Account'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {authMode === 'login'
              ? 'Access candidate tracking, job posting, and verification queues'
              : 'Join over 98,000 candidates and vetted tech employers'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-5 text-xs font-medium">
          <button
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              authMode === 'login'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-1.5 rounded-md transition-colors ${
              authMode === 'register'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* One-Click Quick Persona Selection for Demo Testing */}
        <div className="mb-5 p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80 space-y-2 text-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
            Demo 1-Click Role Login:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => handleQuickLogin('seeker', 'alex.mercer.dev@gmail.com')}
              className="p-2 text-left rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-emerald-500 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-emerald-600 mb-1" />
              <div className="font-semibold text-neutral-900 dark:text-white">Seeker</div>
              <div className="text-[10px] text-neutral-400 truncate">Alex Mercer</div>
            </button>
            <button
              onClick={() => handleQuickLogin('employer', 'recruiting@apexfintech.com')}
              className="p-2 text-left rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600 mb-1" />
              <div className="font-semibold text-neutral-900 dark:text-white">Employer</div>
              <div className="text-[10px] text-neutral-400 truncate">Apex Fintech</div>
            </button>
            <button
              onClick={() => handleQuickLogin('admin', 'admin@workspark.com')}
              className="p-2 text-left rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600 mb-1" />
              <div className="font-semibold text-neutral-900 dark:text-white">Admin</div>
              <div className="text-[10px] text-neutral-400 truncate">Moderator</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Select Persona / Account Type */}
          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('seeker')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  selectedRole === 'seeker'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('employer')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  selectedRole === 'employer'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                Employer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-2.5 rounded-lg border text-center transition-colors ${
                  selectedRole === 'admin'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {authMode === 'register' && (
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rachel Adams"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  {selectedRole === 'employer' ? 'Company Name' : 'Headline / Specialization'}
                </label>
                <input
                  type="text"
                  placeholder={selectedRole === 'employer' ? 'e.g. Nexus Dynamics' : 'e.g. Lead Java Developer'}
                  value={headline}
                  onChange={e => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-700 dark:text-neutral-300 font-medium mb-1">
                  Location (City, Country)
                </label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 mt-4"
          >
            <span>{authMode === 'login' ? 'Sign In to WorkSpark' : 'Complete Registration'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
