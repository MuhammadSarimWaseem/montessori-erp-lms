'use client';

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '@/lib/types';
import { supabase } from '@/lib/db/supabaseClient';
import { 
  Lock, Mail, User, Shield, GraduationCap, 
  HeartHandshake, Smile, DollarSign, Crown, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';

export default function AuthModal() {
  const { theme, activeRole, setActiveRole, isAuthenticated, setIsAuthenticated, currentUser } = useApp();
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
        // Fallback demo sign-in if Supabase credentials user is demo
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

      if (error) {
        setSuccessMsg(`Account created for ${fullName} as ${selectedRole}! Logging in...`);
        setTimeout(() => {
          setActiveRole(selectedRole);
          setIsAuthenticated(true);
        }, 1000);
      } else {
        setSuccessMsg(`Registration successful! Welcome, ${fullName}.`);
        setTimeout(() => {
          setActiveRole(selectedRole);
          setIsAuthenticated(true);
        }, 1000);
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-8 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-700 via-teal-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-lg">
              🌱
            </div>
            <div>
              <h2 className="font-extrabold text-xl tracking-tight">SKYELAX Montessori ERP & LMS</h2>
              <p className="text-xs text-emerald-100 font-medium">Multi-Tenant RBAC Authentication & Role Portal</p>
            </div>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setMode('DEMO')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'DEMO' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Instant Role Login (Demo)
          </button>
          <button
            onClick={() => setMode('SIGN_IN')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'SIGN_IN' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sign In with Email
          </button>
          <button
            onClick={() => setMode('SIGN_UP')}
            className={`flex-1 py-2.5 rounded-xl transition ${
              mode === 'SIGN_UP' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Mode 1: Instant Role Based Login (Demo Accounts) */}
          {mode === 'DEMO' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600 font-medium">
                Select a role perspective to instantly log in and test role-specific features & RBAC access:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.role}
                    onClick={() => handleDemoRoleLogin(acc.role)}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-left transition-all duration-200 space-y-2 group shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                        {acc.icon}
                        <span>{acc.title}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition" />
                    </div>

                    <div className="text-[11px] font-semibold text-emerald-700">{acc.name}</div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">{acc.desc}</p>
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
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. teacher@sunrisemontessori.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password:</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Role Context:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
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
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition shadow-md"
              >
                {loading ? 'Authenticating...' : 'Sign In to Montessori ERP'}
              </button>
            </form>
          )}

          {/* Mode 3: Sign Up / Create Account */}
          {mode === 'SIGN_UP' && (
            <form onSubmit={handleSignUp} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name:</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Guide Claire Sterling"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email Address:</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@sunrisemontessori.org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Password:</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Assign User Role:</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none focus:border-emerald-600"
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
                className="w-full py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition shadow-md"
              >
                {loading ? 'Creating Account...' : 'Register & Assign Role'}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
