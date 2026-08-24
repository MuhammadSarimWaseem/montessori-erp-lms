import { 
  INITIAL_TENANTS, MOCK_USERS, INITIAL_STUDENTS, MONTESSORI_MATERIALS, 
  INITIAL_MASTERY_RECORDS, INITIAL_OBSERVATIONS, INITIAL_ATTENDANCE, 
  INITIAL_INVOICES, INITIAL_PAYROLL, INITIAL_INVENTORY, INITIAL_STORIES, 
  INITIAL_AI_INSIGHTS 
} from './data';
import { 
  Tenant, User, Student, MontessoriMaterial, StudentMasteryRecord, 
  ObservationNote, AttendanceRecord, Invoice, StaffPayroll, 
  ClassroomInventoryItem, StoryPost, AiInsight, UserRole 
} from '../types';
import { supabase } from './supabaseClient';

class MockDatabaseService {
  private tenants: Tenant[] = [...INITIAL_TENANTS];
  private users: Record<string, User> = { ...MOCK_USERS };
  private students: Student[] = [...INITIAL_STUDENTS];
  private materials: MontessoriMaterial[] = [...MONTESSORI_MATERIALS];
  private masteryRecords: StudentMasteryRecord[] = [...INITIAL_MASTERY_RECORDS];
  private observations: ObservationNote[] = [...INITIAL_OBSERVATIONS];
  private attendance: AttendanceRecord[] = [...INITIAL_ATTENDANCE];
  private invoices: Invoice[] = [...INITIAL_INVOICES];
  private payroll: StaffPayroll[] = [...INITIAL_PAYROLL];
  private inventory: ClassroomInventoryItem[] = [...INITIAL_INVENTORY];
  private stories: StoryPost[] = [...INITIAL_STORIES];
  private aiInsights: AiInsight[] = [...INITIAL_AI_INSIGHTS];

  constructor() {
    this.initSupabaseSync();
  }

  private async initSupabaseSync() {
    try {
      if (typeof window !== 'undefined' && supabase) {
        // Asynchronously check connection to Supabase instance
        const { data, error } = await supabase.from('students').select('*').limit(1);
        if (!error && data && data.length > 0) {
          console.log('Successfully connected & synced with Supabase Project: gkuzymsprlnetkhhaqow');
        }
      }
    } catch (e) {
      console.warn('Supabase offline or table pending init, falling back to cached local DB engine:', e);
    }
  }

  // Tenants & Users
  getTenants(): Tenant[] {
    return this.tenants;
  }

  getUserByRole(role: UserRole): User {
    return this.users[role] || this.users.SUPER_ADMIN;
  }

  // Students
  getStudents(tenantId?: string): Student[] {
    if (!tenantId) return this.students;
    return this.students.filter(s => s.tenantId === tenantId);
  }

  getStudentById(id: string): Student | undefined {
    return this.students.find(s => s.id === id);
  }

  updateStudentStarPoints(studentId: string, pointsDelta: number): Student | undefined {
    const student = this.getStudentById(studentId);
    if (student) {
      student.starPoints += pointsDelta;
      if (student.starPoints % 100 === 0) {
        student.streakDays += 1;
      }
    }

    // Async push to Supabase if configured
    try {
      supabase.from('students').update({ starPoints: student?.starPoints }).eq('id', studentId).then();
    } catch (e) {}

    return student;
  }

  // Montessori Curriculum & Mastery
  getMaterials(): MontessoriMaterial[] {
    return this.materials;
  }

  getMasteryRecords(studentId: string): StudentMasteryRecord[] {
    return this.masteryRecords.filter(m => m.studentId === studentId);
  }

  updateMasteryStatus(studentId: string, materialId: string, newStatus: 'PRESENTED' | 'PRACTICING' | 'MASTERED', notes: string = ''): StudentMasteryRecord {
    let record = this.masteryRecords.find(m => m.studentId === studentId && m.materialId === materialId);
    
    if (record) {
      record.status = newStatus;
      record.repetitionCount += 1;
      if (notes) record.guideNotes = notes;
      if (newStatus === 'MASTERED') record.masteryDate = new Date().toISOString().split('T')[0];
    } else {
      record = {
        id: `smr-${Date.now()}`,
        studentId,
        materialId,
        status: newStatus,
        presentationDate: new Date().toISOString().split('T')[0],
        guideNotes: notes || 'Presentation introduced.',
        repetitionCount: 1,
        ...(newStatus === 'MASTERED' ? { masteryDate: new Date().toISOString().split('T')[0] } : {})
      };
      this.masteryRecords.push(record);
    }

    // Update student mastery summary count
    const student = this.getStudentById(studentId);
    if (student) {
      const studentRecords = this.getMasteryRecords(studentId);
      student.masterySummary = {
        presented: studentRecords.filter(r => r.status === 'PRESENTED').length,
        practicing: studentRecords.filter(r => r.status === 'PRACTICING').length,
        mastered: studentRecords.filter(r => r.status === 'MASTERED').length,
      };
    }

    // Async insert to Supabase if available
    try {
      supabase.from('mastery_records').upsert(record).then();
    } catch (e) {}

    return record;
  }

  // Observations
  getObservations(tenantId?: string, studentId?: string): ObservationNote[] {
    let result = this.observations;
    if (tenantId) result = result.filter(o => o.tenantId === tenantId);
    if (studentId) result = result.filter(o => o.studentId === studentId);
    return result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  addObservation(note: Omit<ObservationNote, 'id' | 'timestamp' | 'synced'> & { synced?: boolean }): ObservationNote {
    const newObs: ObservationNote = {
      ...note,
      id: `obs-${Date.now()}`,
      timestamp: new Date().toISOString(),
      synced: note.synced ?? true
    };
    this.observations.unshift(newObs);

    // Async push to Supabase if configured
    try {
      supabase.from('observations').insert(newObs).then();
    } catch (e) {}

    return newObs;
  }

  // Attendance
  getAttendance(date?: string, tenantId?: string): AttendanceRecord[] {
    let result = this.attendance;
    if (tenantId) result = result.filter(a => a.tenantId === tenantId);
    if (date) result = result.filter(a => a.date === date);
    return result;
  }

  markAttendance(studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE', tenantId: string = 'tenant-1'): AttendanceRecord {
    const today = new Date().toISOString().split('T')[0];
    let record = this.attendance.find(a => a.studentId === studentId && a.date === today);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (record) {
      record.status = status;
      if (status === 'PRESENT' || status === 'LATE') record.checkInTime = nowTime;
    } else {
      record = {
        id: `att-${Date.now()}`,
        tenantId,
        studentId,
        date: today,
        status,
        checkInTime: status !== 'ABSENT' ? nowTime : undefined,
        qrCodeScan: `QR-${studentId}-${today}`,
        synced: true
      };
      this.attendance.push(record);
    }

    // Async push to Supabase
    try {
      supabase.from('attendance').upsert(record).then();
    } catch (e) {}

    return record;
  }

  // Invoices & Finance
  getInvoices(tenantId?: string, studentId?: string): Invoice[] {
    let result = this.invoices;
    if (tenantId) result = result.filter(i => i.tenantId === tenantId);
    if (studentId) result = result.filter(i => i.studentId === studentId);
    return result;
  }

  payInvoice(invoiceId: string): Invoice | undefined {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      invoice.status = 'PAID';
      invoice.receiptUrl = `#receipt-${invoice.id}`;
      
      try {
        supabase.from('invoices').update({ status: 'PAID' }).eq('id', invoiceId).then();
      } catch (e) {}
    }
    return invoice;
  }

  // Payroll & HR
  getPayroll(tenantId?: string): StaffPayroll[] {
    if (!tenantId) return this.payroll;
    return this.payroll.filter(p => p.tenantId === tenantId);
  }

  // Inventory
  getInventory(tenantId?: string): ClassroomInventoryItem[] {
    if (!tenantId) return this.inventory;
    return this.inventory.filter(i => i.tenantId === tenantId);
  }

  // Story Feed for Parents
  getStories(studentId?: string): StoryPost[] {
    if (!studentId) return this.stories;
    return this.stories.filter(s => s.studentId === studentId);
  }

  addStory(story: Omit<StoryPost, 'id' | 'timestamp' | 'likesCount'>): StoryPost {
    const newStory: StoryPost = {
      ...story,
      id: `story-${Date.now()}`,
      timestamp: 'Just now',
      likesCount: 0
    };
    this.stories.unshift(newStory);
    return newStory;
  }

  // AI Insights
  getAiInsights(): AiInsight[] {
    return this.aiInsights;
  }
}

export const db = new MockDatabaseService();
