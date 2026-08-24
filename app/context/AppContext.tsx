'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Tenant, User, Student, ObservationNote } from '@/lib/types';
import { db } from '@/lib/db';
import { getOfflineQueue, saveOfflineItem } from '@/lib/offline/indexedDb';
import { flushOfflineQueue } from '@/lib/offline/syncEngine';

interface AppContextType {
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  activeTenantId: string;
  setActiveTenantId: (id: string) => void;
  activeTenant: Tenant;
  currentUser: User;
  students: Student[];
  selectedStudent: Student;
  setSelectedStudentId: (id: string) => void;
  isOnline: boolean;
  offlineQueueCount: number;
  syncData: () => Promise<void>;
  isAiDrawerOpen: boolean;
  setIsAiDrawerOpen: (open: boolean) => void;
  isObservationModalOpen: boolean;
  setIsObservationModalOpen: (open: boolean) => void;
  isAttendanceModalOpen: boolean;
  setIsAttendanceModalOpen: (open: boolean) => void;
  isSandboxOpen: boolean;
  setIsSandboxOpen: (open: boolean) => void;
  isReportCardOpen: boolean;
  setIsReportCardOpen: (open: boolean) => void;
  addOfflineObservation: (note: any) => Promise<void>;
  markAttendance: (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => Promise<void>;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useState<UserRole>('TEACHER');
  const [activeTenantId, setActiveTenantId] = useState<string>('tenant-1');
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(0);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [isObservationModalOpen, setIsObservationModalOpen] = useState<boolean>(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState<boolean>(false);
  const [isSandboxOpen, setIsSandboxOpen] = useState<boolean>(false);
  const [isReportCardOpen, setIsReportCardOpen] = useState<boolean>(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('std-1');
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Synchronize network state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => {
        setIsOnline(true);
        syncData();
      };
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Check offline queue count
      updateQueueCount();

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const updateQueueCount = async () => {
    const queue = await getOfflineQueue();
    setOfflineQueueCount(queue.length);
  };

  const syncData = async () => {
    if (navigator.onLine) {
      const res = await flushOfflineQueue();
      await updateQueueCount();
      triggerRefresh();
    }
  };

  const addOfflineObservation = async (note: any) => {
    if (isOnline) {
      db.addObservation(note);
    } else {
      await saveOfflineItem('OBSERVATION', note);
      await updateQueueCount();
    }
    triggerRefresh();
  };

  const markAttendance = async (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    if (isOnline) {
      db.markAttendance(studentId, status, activeTenantId);
    } else {
      await saveOfflineItem('ATTENDANCE', { studentId, status, tenantId: activeTenantId });
      await updateQueueCount();
    }
    triggerRefresh();
  };

  const tenants = db.getTenants();
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0];
  const currentUser = db.getUserByRole(activeRole);
  const students = db.getStudents(activeTenantId);
  const selectedStudent = students.find(s => s.id === selectedStudentId) || students[0];

  return (
    <AppContext.Provider value={{
      activeRole,
      setActiveRole,
      activeTenantId,
      setActiveTenantId,
      activeTenant,
      currentUser,
      students,
      selectedStudent,
      setSelectedStudentId,
      isOnline,
      offlineQueueCount,
      syncData,
      isAiDrawerOpen,
      setIsAiDrawerOpen,
      isObservationModalOpen,
      setIsObservationModalOpen,
      isAttendanceModalOpen,
      setIsAttendanceModalOpen,
      isSandboxOpen,
      setIsSandboxOpen,
      isReportCardOpen,
      setIsReportCardOpen,
      addOfflineObservation,
      markAttendance,
      refreshTrigger,
      triggerRefresh
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
