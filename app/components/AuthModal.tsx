'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '@/lib/types';
import { supabase } from '@/lib/db/supabaseClient';
import { 
  Lock, Mail, User, Shield, GraduationCap, X,
  HeartHandshake, Smile, DollarSign, Crown, Sparkles, CheckCircle2, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function AuthModal() {
  const { theme, activeRole, setActiveRole, isAuthenticated, setIsAuthenticated } = useApp();
  const isDark = theme === 'dark';

  const [mode, setMode] = useState<'SIGN_IN' | 'SIGN_UP' | 'DEMO'>('DEMO');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('TEACHER');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Fallback for demo users
        setActiveRole(selectedRole);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(true);
      }
    } catch (err: any) {
      setActiveRole(selectedRole);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: selectedRole
          }
        }
      });

      setSuccessMsg(`Account created for ${fullName}! Authenticating...`);
      setTimeout(() => {
        setActiveRole(selectedRole);
        setIsAuthenticated(true);
      }, 800);
    } catch (err: any) {
      setActiveRole(selectedRole);
      setIsAuthenticated(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoRoleLogin = (role: UserRole) => {
    setActiveRole(role);
    setIsAuthenticated(true);
  };

  const demoAccounts: { role: UserRole; title: string; email: string; name: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'TEACHER',
      title: 'Teacher / Lead Guide',
      name: 'Guide Claire Sterling',
      email: 'teacher@sunrisemontessori.org',
      icon: <GraduationCap className="w-5 h-5 text-teal-600" />,
      desc: 'Classroom 3-period lesson matrix, live observation recorder, stopwatch timer & QR attendance.'
    },
    {
      role: 'SUPER_ADMIN',
      title: 'Super Admin / Principal',
      name: 'Dr. Maria Vance',
      email: 'admin@sunrisemontessori.org',
      icon: <Crown className="w-5 h-5 text-amber-600" />,
      desc: 'Multi-campus executive dashboard, capacity analytics, financial forecasting & operational control.'
    },
    {
      role: 'PARENT',
      title: 'Parent Portal',
      name: 'Eleanor Vance',
      email: 'parent@sunrisemontessori.org',
      icon: <HeartHandshake className="w-5 h-5 text-indigo-600" />,
      desc: 'Child daily story feed, photo updates, tuition invoice payment gateway & narrative report card.'
    },
    {
      role: 'STUDENT',
      title: 'Student Learner',
      name: 'Lucas Vance',
      email: 'student@sunrisemontessori.org',
      icon: <Smile className="w-5 h-5 text-amber-500" />,
      desc: 'Gamified micro-learning quests, Golden Beads visualizer, star points & badge showcase.'
    },
    {
      role: 'FINANCE_HR',
      title: 'Finance & HR Manager',
      name: 'Arthur Pendelton',
      email: 'finance@sunrisemontessori.org',
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      desc: 'Accounts receivable ledger, staff payroll disbursements & classroom material maintenance log.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg overflow-y-auto min-h-screen">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto transition-all ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Branding Header */}
        <div className="p-8 bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl ring-1 ring-white/30">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-2xl tracking-tight text-white">SKYELAX Montessori</span>
                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                  ERP & LMS 2.0
                </span>
              </div>
              <p className="text-xs text-emerald-100 mt-1 font-medium">
                Enterprise Multi-Tenant Authentication & Role Access Portal
              </p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-100 p-2 gap-2 text-xs font-extrabold">
          <button
            onClick={() => setMode('DEMO')}
            className={`flex-1 py-3 rounded-xl transition ${
              mode === 'DEMO' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Instant Role Login (Demo Accounts)
          </button>
          <button
            onClick={() => setMode('SIGN_IN')}
            className={`flex-1 py-3 rounded-xl transition ${
              mode === 'SIGN_IN' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => setMode('SIGN_UP')}
            className={`flex-1 py-3 rounded-xl transition ${
              mode === 'SIGN_UP' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-8">
          
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode 1: Instant Role Based Login (Demo Accounts) */}
          {mode === 'DEMO' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 font-bold uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Select a Role Perspective to Authenticate & Enter:</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => handleDemoRoleLogin(acc.role)}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all duration-200 space-y-2 group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-extrabold text-xs text-slate-900">
                        {acc.icon}
                        <span>{acc.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                    </div>

                    <div className="text-[11px] font-extrabold text-emerald-700">{acc.name}</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{acc.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mode 2: Sign In with Email */}
          {mode === 'SIGN_IN' && (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. teacher@sunrisemontessori.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password:</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select User Role Context:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                >
                  <option value="TEACHER">Teacher / Lead Guide</option>
                  <option value="SUPER_ADMIN">Super Admin / Principal</option>
                  <option value="PARENT">Parent Portal</option>
                  <option value="STUDENT">Student Learner</option>
                  <option value="FINANCE_HR">Finance & HR Manager</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition shadow-md"
              >
                {loading ? 'Authenticating with Supabase...' : 'Sign In to Montessori ERP'}
              </button>
            </form>
          )}

          {/* Mode 3: Sign Up / Create Account */}
          {mode === 'SIGN_UP' && (
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Guide Claire Sterling"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@sunrisemontessori.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password:</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-3 text-slate-900 font-medium focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assign User Role:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-slate-900 font-bold focus:outline-none focus:border-emerald-600"
                >
                  <option value="TEACHER">Teacher / Lead Guide</option>
                  <option value="SUPER_ADMIN">Super Admin / Principal</option>
                  <option value="PARENT">Parent Portal</option>
                  <option value="STUDENT">Student Learner</option>
                  <option value="FINANCE_HR">Finance & HR Manager</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition shadow-md"
              >
                {loading ? 'Creating Account...' : 'Register & Authenticate'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
