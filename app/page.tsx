'use client';

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OfflineBanner from './components/OfflineBanner';
import AiAssistantDrawer from './components/AiAssistantDrawer';
import MontessoriSandbox from './components/MontessoriSandbox';
import ReportCardModal from './components/ReportCardModal';
import ObservationModal from './components/ObservationModal';
import AttendanceScannerModal from './components/AttendanceScannerModal';

import AdminDashboard from './components/dashboards/AdminDashboard';
import TeacherDashboard from './components/dashboards/TeacherDashboard';
import ParentDashboard from './components/dashboards/ParentDashboard';
import StudentDashboard from './components/dashboards/StudentDashboard';
import FinanceHrDashboard from './components/dashboards/FinanceHrDashboard';

function DashboardRouter() {
  const { activeRole } = useApp();

  switch (activeRole) {
    case 'SUPER_ADMIN':
      return <AdminDashboard />;
    case 'TEACHER':
      return <TeacherDashboard />;
    case 'PARENT':
      return <ParentDashboard />;
    case 'STUDENT':
      return <StudentDashboard />;
    case 'FINANCE_HR':
      return <FinanceHrDashboard />;
    default:
      return <TeacherDashboard />;
  }
}

function MainAppLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      <Navbar />
      <OfflineBanner />

      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          <DashboardRouter />
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <AiAssistantDrawer />
      <MontessoriSandbox />
      <ReportCardModal />
      <ObservationModal />
      <AttendanceScannerModal />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainAppLayout />
    </AppProvider>
  );
}
