import { 
  Tenant, User, Student, MontessoriMaterial, StudentMasteryRecord, 
  ObservationNote, AttendanceRecord, Invoice, StaffPayroll, 
  ClassroomInventoryItem, StoryPost, AiInsight 
} from '../types';

export const INITIAL_TENANTS: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'Sunrise Montessori Academy',
    code: 'SMA-MAIN',
    address: '742 Evergreen Terrace, Springfield',
    logo: '☀️',
    studentCount: 148,
    staffCount: 18,
  },
  {
    id: 'tenant-2',
    name: 'Greenwood Montessori School',
    code: 'GMS-NORTH',
    address: '120 Pine Tree Lane, Greenfield',
    logo: '🌿',
    studentCount: 92,
    staffCount: 12,
  }
];

export const MOCK_USERS: Record<string, User> = {
  SUPER_ADMIN: {
    id: 'user-admin',
    name: 'Dr. Maria Vance',
    email: 'principal.vance@sunrisemontessori.org',
    role: 'SUPER_ADMIN',
    tenantId: 'tenant-1',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Head of School & Executive Director',
  },
  TEACHER: {
    id: 'user-teacher-1',
    name: 'Guide Claire Sterling',
    email: 'c.sterling@sunrisemontessori.org',
    role: 'TEACHER',
    tenantId: 'tenant-1',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Primary Montessori Guide (Casa 1)',
  },
  PARENT: {
    id: 'user-parent-1',
    name: 'Eleanor Vance',
    email: 'eleanor.vance@example.com',
    role: 'PARENT',
    tenantId: 'tenant-1',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    title: 'Parent of Lucas & Emma Vance',
  },
  STUDENT: {
    id: 'user-student-1',
    name: 'Lucas Vance',
    email: 'lucas.vance@student.org',
    role: 'STUDENT',
    tenantId: 'tenant-1',
    avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&auto=format&fit=crop&q=80',
    title: 'Primary 3-6 Scholar',
  },
  FINANCE_HR: {
    id: 'user-finance-1',
    name: 'Arthur Pendelton',
    email: 'finance@sunrisemontessori.org',
    role: 'FINANCE_HR',
    tenantId: 'tenant-1',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Chief Financial Officer & HR Director',
  }
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'std-1',
    tenantId: 'tenant-1',
    name: 'Lucas Vance',
    dateOfBirth: '2021-04-12',
    ageYears: 5,
    classroom: 'Casa 1 (Primary 3-6)',
    primaryGuideId: 'user-teacher-1',
    parentId: 'user-parent-1',
    avatar: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&auto=format&fit=crop&q=80',
    allergies: ['Peanuts', 'Dairy (Mild)'],
    dietaryNotes: 'Lactose-free milk during snack time',
    emergencyContact: {
      name: 'Eleanor Vance',
      relation: 'Mother',
      phone: '+1 (555) 234-5678'
    },
    streakDays: 14,
    starPoints: 340,
    badges: ['Sensorial Explorer', 'Math Wizard', 'Grace & Courtesy Star', '10-Day Streak'],
    masterySummary: {
      presented: 4,
      practicing: 8,
      mastered: 15
    }
  },
  {
    id: 'std-2',
    tenantId: 'tenant-1',
    name: 'Emma Vance',
    dateOfBirth: '2023-09-05',
    ageYears: 3,
    classroom: 'Sunflower (Toddler 1.5-3)',
    primaryGuideId: 'user-teacher-1',
    parentId: 'user-parent-1',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    allergies: [],
    dietaryNotes: 'No restriction',
    emergencyContact: {
      name: 'Eleanor Vance',
      relation: 'Mother',
      phone: '+1 (555) 234-5678'
    },
    streakDays: 8,
    starPoints: 180,
    badges: ['Pouring Champion', 'Self-Dresser'],
    masterySummary: {
      presented: 6,
      practicing: 5,
      mastered: 7
    }
  },
  {
    id: 'std-3',
    tenantId: 'tenant-1',
    name: 'Mateo Rossi',
    dateOfBirth: '2020-11-18',
    ageYears: 5,
    classroom: 'Casa 1 (Primary 3-6)',
    primaryGuideId: 'user-teacher-1',
    parentId: 'user-parent-2',
    avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80',
    allergies: ['Bee Stings'],
    dietaryNotes: 'EpiPen stored in guide cabinet A-2',
    emergencyContact: {
      name: 'Marco Rossi',
      relation: 'Father',
      phone: '+1 (555) 876-5432'
    },
    streakDays: 21,
    starPoints: 520,
    badges: ['Golden Bead Master', 'Botany Detective', 'Granular Pourer'],
    masterySummary: {
      presented: 3,
      practicing: 6,
      mastered: 22
    }
  },
  {
    id: 'std-4',
    tenantId: 'tenant-1',
    name: 'Sophia Chen',
    dateOfBirth: '2021-01-30',
    ageYears: 5,
    classroom: 'Casa 2 (Primary 3-6)',
    primaryGuideId: 'user-teacher-2',
    parentId: 'user-parent-3',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    allergies: [],
    dietaryNotes: 'Vegetarian snack options preferred',
    emergencyContact: {
      name: 'Wei Chen',
      relation: 'Father',
      phone: '+1 (555) 345-6789'
    },
    streakDays: 12,
    starPoints: 290,
    badges: ['Sandpaper Letters Specialist'],
    masterySummary: {
      presented: 5,
      practicing: 9,
      mastered: 12
    }
  }
];

export const MONTESSORI_MATERIALS: MontessoriMaterial[] = [
  // Practical Life
  {
    id: 'mat-pl-1',
    area: 'Practical Life',
    title: 'Dry Pouring with Pitchers',
    description: 'Refines fine motor control, eye-hand coordination, and wrist flexibility.',
    ageRange: '2.5 - 3.5 years',
    sequenceOrder: 1,
    iconName: 'Coffee'
  },
  {
    id: 'mat-pl-2',
    area: 'Practical Life',
    title: 'Dressing Frames (Buttons & Snaps)',
    description: 'Develops independence in personal dressing skills and finger dexterity.',
    ageRange: '3 - 4 years',
    sequenceOrder: 2,
    iconName: 'Shirt'
  },
  {
    id: 'mat-pl-3',
    area: 'Practical Life',
    title: 'Hand Washing Exercise',
    description: 'Complex multi-step sequential work promoting deep concentration and hygiene order.',
    ageRange: '3.5 - 5 years',
    sequenceOrder: 3,
    iconName: 'Sparkles'
  },
  // Sensorial
  {
    id: 'mat-sen-1',
    area: 'Sensorial',
    title: 'Pink Tower',
    description: 'Visual discrimination of three-dimensional size, volume, and preparation for cubing.',
    ageRange: '3 - 4 years',
    sequenceOrder: 1,
    iconName: 'Box'
  },
  {
    id: 'mat-sen-2',
    area: 'Sensorial',
    title: 'Cylinder Blocks (Block 1-4)',
    description: 'Discrimination of height and diameter; pre-writing tripod grip training.',
    ageRange: '3 - 4.5 years',
    sequenceOrder: 2,
    iconName: 'Columns'
  },
  {
    id: 'mat-sen-3',
    area: 'Sensorial',
    title: 'Color Tablets (Box 3 Gradient)',
    description: 'Visual perception of subtle color shades and chromatic gradation.',
    ageRange: '3.5 - 5 years',
    sequenceOrder: 3,
    iconName: 'Palette'
  },
  // Language
  {
    id: 'mat-lang-1',
    area: 'Language',
    title: 'Sandpaper Letters',
    description: 'Tactile and auditory association of phonemic letter sounds prior to writing.',
    ageRange: '3.5 - 4.5 years',
    sequenceOrder: 1,
    iconName: 'PenTool'
  },
  {
    id: 'mat-lang-2',
    area: 'Language',
    title: 'Moveable Alphabet',
    description: 'Early composition of words prior to physical handwriting control.',
    ageRange: '4 - 5 years',
    sequenceOrder: 2,
    iconName: 'Grid'
  },
  {
    id: 'mat-lang-3',
    area: 'Language',
    title: 'Object Classification Cards',
    description: 'Vocabulary expansion and categorical conceptualization of living things.',
    ageRange: '3 - 5 years',
    sequenceOrder: 3,
    iconName: 'BookOpen'
  },
  // Mathematics
  {
    id: 'mat-math-1',
    area: 'Mathematics',
    title: 'Number Rods & Cards',
    description: 'Concrete representation of quantity 1 to 10 as fixed composite lengths.',
    ageRange: '3.5 - 4.5 years',
    sequenceOrder: 1,
    iconName: 'Ruler'
  },
  {
    id: 'mat-math-2',
    area: 'Mathematics',
    title: 'Golden Bead Bank System',
    description: 'Introduction to Decimal System (Units, Tens, Hundreds, Thousands).',
    ageRange: '4 - 5.5 years',
    sequenceOrder: 2,
    iconName: 'Layers'
  },
  {
    id: 'mat-math-3',
    area: 'Mathematics',
    title: 'Spindle Boxes',
    description: 'Concept of loose quantities and introducing the concept of zero (0).',
    ageRange: '3.5 - 4.5 years',
    sequenceOrder: 3,
    iconName: 'Archive'
  },
  // Culture & Science
  {
    id: 'mat-cul-1',
    area: 'Culture & Science',
    title: 'Puzzle Map of World Continents',
    description: 'Spatial geography, hemispheric identification, and motor placement accuracy.',
    ageRange: '4 - 6 years',
    sequenceOrder: 1,
    iconName: 'Globe'
  },
  {
    id: 'mat-cul-2',
    area: 'Culture & Science',
    title: 'Botany Cabinet & Leaf Cards',
    description: 'Identification of leaf shapes, margin structures, and plant morphology.',
    ageRange: '4 - 6 years',
    sequenceOrder: 2,
    iconName: 'Leaf'
  }
];

export const INITIAL_MASTERY_RECORDS: StudentMasteryRecord[] = [
  {
    id: 'smr-1',
    studentId: 'std-1',
    materialId: 'mat-math-2',
    status: 'PRACTICING',
    presentationDate: '2026-08-10',
    guideNotes: 'Lucas demonstrates strong grasp of unit vs ten beads. Working on exchange to hundreds.',
    repetitionCount: 6
  },
  {
    id: 'smr-2',
    studentId: 'std-1',
    materialId: 'mat-sen-1',
    status: 'MASTERED',
    presentationDate: '2026-05-14',
    masteryDate: '2026-06-20',
    guideNotes: 'Flawlessly builds Pink Tower vertically and horizontally without hesitation. Self-corrected base placement.',
    repetitionCount: 18
  },
  {
    id: 'smr-3',
    studentId: 'std-1',
    materialId: 'mat-lang-2',
    status: 'PRACTICING',
    presentationDate: '2026-08-15',
    guideNotes: 'Spelling 3-letter CVC phonetic words ("cat", "sun", "mat") enthusiastically.',
    repetitionCount: 4
  },
  {
    id: 'smr-4',
    studentId: 'std-1',
    materialId: 'mat-pl-3',
    status: 'MASTERED',
    presentationDate: '2026-04-02',
    masteryDate: '2026-04-28',
    guideNotes: 'Executes entire 12-step hand washing sequence independently and tidies up workstation.',
    repetitionCount: 22
  }
];

export const INITIAL_OBSERVATIONS: ObservationNote[] = [
  {
    id: 'obs-1',
    tenantId: 'tenant-1',
    studentId: 'std-1',
    studentName: 'Lucas Vance',
    guideId: 'user-teacher-1',
    guideName: 'Guide Claire Sterling',
    timestamp: '2026-08-24T09:45:00Z',
    text: 'Lucas chose Golden Beads bank game independently during 3-hour work cycle. Sustained deep focus for 32 consecutive minutes, performing addition exchange with 3-digit quantities.',
    materialTitle: 'Golden Bead Bank System',
    area: 'Mathematics',
    tags: ['Concentration', 'Independence', 'Repetition'],
    focusMinutes: 32,
    photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
    synced: true
  },
  {
    id: 'obs-2',
    tenantId: 'tenant-1',
    studentId: 'std-1',
    studentName: 'Lucas Vance',
    guideId: 'user-teacher-1',
    guideName: 'Guide Claire Sterling',
    timestamp: '2026-08-23T11:15:00Z',
    text: 'Offered assistance to peer Emma when her water pitcher spilled. Showed high empathy and carried floor cloth carefully according to Grace & Courtesy norms.',
    materialTitle: 'Grace & Courtesy',
    area: 'Practical Life',
    tags: ['Social Interaction', 'Order', 'Coordination'],
    focusMinutes: 15,
    synced: true
  },
  {
    id: 'obs-3',
    tenantId: 'tenant-1',
    studentId: 'std-3',
    studentName: 'Mateo Rossi',
    guideId: 'user-teacher-1',
    guideName: 'Guide Claire Sterling',
    timestamp: '2026-08-24T10:10:00Z',
    text: 'Mateo completed Puzzle Map of World Continents and traced each landmass onto drawing paper with precision colored pencils.',
    materialTitle: 'Puzzle Map of World Continents',
    area: 'Culture & Science',
    tags: ['Concentration', 'Coordination'],
    focusMinutes: 45,
    photoUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
    synced: true
  }
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    tenantId: 'tenant-1',
    studentId: 'std-1',
    date: '2026-08-24',
    status: 'PRESENT',
    checkInTime: '08:25 AM',
    checkOutTime: '03:15 PM',
    qrCodeScan: 'QR-STD-1-20260824',
    synced: true
  },
  {
    id: 'att-2',
    tenantId: 'tenant-1',
    studentId: 'std-2',
    date: '2026-08-24',
    status: 'PRESENT',
    checkInTime: '08:28 AM',
    checkOutTime: '03:15 PM',
    qrCodeScan: 'QR-STD-2-20260824',
    synced: true
  },
  {
    id: 'att-3',
    tenantId: 'tenant-1',
    studentId: 'std-3',
    date: '2026-08-24',
    status: 'PRESENT',
    checkInTime: '08:40 AM',
    qrCodeScan: 'QR-STD-3-20260824',
    synced: true
  },
  {
    id: 'att-4',
    tenantId: 'tenant-1',
    studentId: 'std-4',
    date: '2026-08-24',
    status: 'LATE',
    checkInTime: '09:12 AM',
    qrCodeScan: 'QR-STD-4-20260824',
    synced: true
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-2026-001',
    tenantId: 'tenant-1',
    studentId: 'std-1',
    studentName: 'Lucas Vance',
    parentName: 'Eleanor Vance',
    title: 'Fall Term Primary Tuition 2026',
    category: 'Tuition',
    amount: 1450.00,
    dueDate: '2026-09-01',
    issuedDate: '2026-08-15',
    status: 'PAID',
    receiptUrl: '#receipt-001'
  },
  {
    id: 'inv-2026-002',
    tenantId: 'tenant-1',
    studentId: 'std-2',
    studentName: 'Emma Vance',
    parentName: 'Eleanor Vance',
    title: 'Toddler Program Materials & Activity Fee',
    category: 'Materials',
    amount: 320.00,
    dueDate: '2026-09-05',
    issuedDate: '2026-08-15',
    status: 'PENDING'
  },
  {
    id: 'inv-2026-003',
    tenantId: 'tenant-1',
    studentId: 'std-3',
    studentName: 'Mateo Rossi',
    parentName: 'Marco Rossi',
    title: 'Fall Term Primary Tuition 2026',
    category: 'Tuition',
    amount: 1450.00,
    dueDate: '2026-08-20',
    issuedDate: '2026-08-01',
    status: 'OVERDUE'
  }
];

export const INITIAL_PAYROLL: StaffPayroll[] = [
  {
    id: 'pay-1',
    tenantId: 'tenant-1',
    staffId: 'user-teacher-1',
    staffName: 'Guide Claire Sterling',
    roleTitle: 'Lead Primary Guide',
    salary: 4800.00,
    bonus: 300.00,
    deductions: 420.00,
    month: 'August 2026',
    status: 'PROCESSED',
    leaveDaysTaken: 1
  },
  {
    id: 'pay-2',
    tenantId: 'tenant-1',
    staffId: 'user-teacher-2',
    staffName: 'Guide Julian Thorne',
    roleTitle: 'Assistant Guide',
    salary: 3600.00,
    bonus: 150.00,
    deductions: 310.00,
    month: 'August 2026',
    status: 'PROCESSED',
    leaveDaysTaken: 0
  }
];

export const INITIAL_INVENTORY: ClassroomInventoryItem[] = [
  {
    id: 'inv-mat-1',
    tenantId: 'tenant-1',
    classroom: 'Casa 1 (Primary 3-6)',
    materialName: 'Pink Tower Wooden Cubes Set',
    area: 'Sensorial',
    quantity: 2,
    condition: 'Excellent',
    lastInspected: '2026-08-20'
  },
  {
    id: 'inv-mat-2',
    tenantId: 'tenant-1',
    classroom: 'Casa 1 (Primary 3-6)',
    materialName: 'Golden Beads Thousand Cubes',
    area: 'Mathematics',
    quantity: 9,
    condition: 'Needs Maintenance',
    lastInspected: '2026-08-22',
    maintenanceNote: 'One bead frame loose wire needs re-soldering.'
  },
  {
    id: 'inv-mat-3',
    tenantId: 'tenant-1',
    classroom: 'Casa 2 (Primary 3-6)',
    materialName: 'World Map Wooden Puzzle',
    area: 'Culture & Science',
    quantity: 1,
    condition: 'Missing Part',
    lastInspected: '2026-08-19',
    maintenanceNote: 'Australia pin piece is currently mislaid.'
  }
];

export const INITIAL_STORIES: StoryPost[] = [
  {
    id: 'story-1',
    tenantId: 'tenant-1',
    studentId: 'std-1',
    guideName: 'Guide Claire Sterling',
    title: 'Lucas Mastery in Decimal Addition!',
    content: 'Today Lucas spent over 30 minutes with the Golden Bead decimal system. He successfully added 342 + 215 with complete independence and explained the concept to a peer!',
    photoUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80',
    area: 'Mathematics',
    timestamp: '2 hours ago',
    likesCount: 12
  },
  {
    id: 'story-2',
    tenantId: 'tenant-1',
    studentId: 'std-1',
    guideName: 'Guide Claire Sterling',
    title: 'Grace & Courtesy in Action',
    content: 'Notice how Lucas gently pours water for snack time with two hands on the pitcher handle! Order and control of movement developing beautifully.',
    photoUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop&q=80',
    area: 'Practical Life',
    timestamp: 'Yesterday',
    likesCount: 19
  }
];

export const INITIAL_AI_INSIGHTS: AiInsight[] = [
  {
    id: 'ins-1',
    type: 'DEVELOPMENTAL',
    priority: 'HIGH',
    title: 'Lucas Vance: High Readiness for Moveable Alphabet',
    description: 'Observation data shows 100% sound recall across Sandpaper Letters (m, a, t, s, p, f). Concentration duration averaged 28 mins in language work.',
    recommendation: 'Present Moveable Alphabet three-letter word creation sequence during tomorrow morning work cycle.',
    targetId: 'std-1',
    targetName: 'Lucas Vance',
    timestamp: 'Today, 08:30 AM'
  },
  {
    id: 'ins-2',
    type: 'ACADEMIC',
    priority: 'MEDIUM',
    title: 'Sensorial Area Utilization Peak',
    description: 'Pink Tower and Cylinder Blocks registered high demand today (84% of Casa 1 students chose sensorial works).',
    recommendation: 'Ensure clean tray placement and introduce Binomial Cube presentation to interested 4-year-olds.',
    timestamp: 'Today, 11:00 AM'
  },
  {
    id: 'ins-3',
    type: 'FINANCIAL',
    priority: 'MEDIUM',
    title: 'Tuition Fee Collection Forecast',
    description: '92% of Fall term invoices collected. 3 outstanding accounts requiring automatic friendly reminder.',
    recommendation: 'Dispatch SMS/Email gentle notification to accounts with pending balances due before Sept 1.',
    timestamp: 'Yesterday, 04:00 PM'
  }
];
