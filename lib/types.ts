export type UserRole = 'SUPER_ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT' | 'FINANCE_HR';

export interface Tenant {
  id: string;
  name: string;
  code: string;
  address: string;
  logo: string;
  studentCount: number;
  staffCount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  tenantId: string;
  avatar: string;
  title?: string;
}

export interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

export interface Student {
  id: string;
  tenantId: string;
  name: string;
  dateOfBirth: string;
  ageYears: number;
  classroom: string; // e.g. "Primary 3-6 (Rosa Room)", "Toddler (Sunflower)"
  primaryGuideId: string;
  parentId: string;
  avatar: string;
  allergies: string[];
  dietaryNotes?: string;
  emergencyContact: EmergencyContact;
  streakDays: number;
  starPoints: number;
  badges: string[];
  masterySummary: {
    presented: number;
    practicing: number;
    mastered: number;
  };
}

export type MontessoriArea = 
  | 'Practical Life' 
  | 'Sensorial' 
  | 'Language' 
  | 'Mathematics' 
  | 'Culture & Science';

export type MasteryStatus = 'PRESENTED' | 'PRACTICING' | 'MASTERED';

export interface MontessoriMaterial {
  id: string;
  area: MontessoriArea;
  title: string;
  description: string;
  ageRange: string;
  sequenceOrder: number;
  iconName: string;
}

export interface StudentMasteryRecord {
  id: string;
  studentId: string;
  materialId: string;
  status: MasteryStatus;
  presentationDate: string;
  masteryDate?: string;
  guideNotes: string;
  repetitionCount: number;
}

export type ObservationTag = 
  | 'Concentration' 
  | 'Repetition' 
  | 'Independence' 
  | 'Order' 
  | 'Coordination'
  | 'Social Interaction';

export interface ObservationNote {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  guideId: string;
  guideName: string;
  timestamp: string;
  text: string;
  materialTitle?: string;
  area?: MontessoriArea;
  tags: ObservationTag[];
  focusMinutes: number;
  photoUrl?: string;
  isVoiceRecorded?: boolean;
  synced: boolean;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  tenantId: string;
  studentId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  checkOutTime?: string;
  qrCodeScan: string;
  synced: boolean;
}

export type InvoiceStatus = 'PAID' | 'PENDING' | 'OVERDUE';

export interface Invoice {
  id: string;
  tenantId: string;
  studentId: string;
  studentName: string;
  parentName: string;
  title: string;
  category: 'Tuition' | 'Materials' | 'After-School' | 'Meal Plan';
  amount: number;
  dueDate: string;
  issuedDate: string;
  status: InvoiceStatus;
  receiptUrl?: string;
}

export type PayrollStatus = 'PROCESSED' | 'PENDING';

export interface StaffPayroll {
  id: string;
  tenantId: string;
  staffId: string;
  staffName: string;
  roleTitle: string;
  salary: number;
  bonus: number;
  deductions: number;
  month: string;
  status: PayrollStatus;
  leaveDaysTaken: number;
}

export interface ClassroomInventoryItem {
  id: string;
  tenantId: string;
  classroom: string;
  materialName: string;
  area: MontessoriArea;
  quantity: number;
  condition: 'Excellent' | 'Good' | 'Needs Maintenance' | 'Missing Part';
  lastInspected: string;
  maintenanceNote?: string;
}

export interface AiInsight {
  id: string;
  type: 'ACADEMIC' | 'DEVELOPMENTAL' | 'OPERATIONAL' | 'FINANCIAL';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  recommendation: string;
  targetId?: string; // e.g. studentId
  targetName?: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  sender: 'USER' | 'BOT';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}

export interface StoryPost {
  id: string;
  tenantId: string;
  studentId: string;
  guideName: string;
  title: string;
  content: string;
  photoUrl: string;
  area: MontessoriArea;
  timestamp: string;
  likesCount: number;
}

export interface OfflineQueueItem {
  id: string;
  type: 'OBSERVATION' | 'ATTENDANCE';
  payload: any;
  createdAt: string;
}
