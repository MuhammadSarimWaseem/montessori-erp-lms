-- ====================================================================
-- SKYELAX MONTESSORI ERP & LMS - COMPLETE SUPABASE DATABASE SCHEMA & SEED
-- Project ID: gkuzymsprlnetkhhaqow
-- Execute this SQL script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gkuzymsprlnetkhhaqow/sql/new
-- ====================================================================

-- 1. TENANTS / SCHOOL CAMPUSES
CREATE TABLE IF NOT EXISTS public.tenants (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    address TEXT,
    logo TEXT,
    student_count INT DEFAULT 0,
    staff_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USERS & ROLES
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('SUPER_ADMIN', 'TEACHER', 'PARENT', 'STUDENT', 'FINANCE_HR')),
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE SET NULL,
    avatar TEXT,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. STUDENTS
CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    date_of_birth DATE,
    age_years INT,
    classroom TEXT,
    primary_guide_id TEXT,
    parent_id TEXT,
    avatar TEXT,
    allergies TEXT[],
    dietary_notes TEXT,
    emergency_contact JSONB,
    streak_days INT DEFAULT 0,
    star_points INT DEFAULT 0,
    badges TEXT[],
    mastery_summary JSONB DEFAULT '{"presented": 0, "practicing": 0, "mastered": 0}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MONTESSORI MATERIALS
CREATE TABLE IF NOT EXISTS public.montessori_materials (
    id TEXT PRIMARY KEY,
    area TEXT NOT NULL CHECK (area IN ('Practical Life', 'Sensorial', 'Language', 'Mathematics', 'Culture & Science')),
    title TEXT NOT NULL,
    description TEXT,
    age_range TEXT,
    sequence_order INT DEFAULT 1,
    icon_name TEXT
);

-- 5. STUDENT MASTERY RECORDS (THREE-PERIOD LESSONS)
CREATE TABLE IF NOT EXISTS public.student_mastery_records (
    id TEXT PRIMARY KEY,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    material_id TEXT REFERENCES public.montessori_materials(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('PRESENTED', 'PRACTICING', 'MASTERED')),
    presentation_date DATE DEFAULT CURRENT_DATE,
    mastery_date DATE,
    guide_notes TEXT,
    repetition_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. OBSERVATION NOTES
CREATE TABLE IF NOT EXISTS public.observations (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT,
    guide_id TEXT,
    guide_name TEXT,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    text TEXT NOT NULL,
    material_title TEXT,
    area TEXT,
    tags TEXT[],
    focus_minutes INT DEFAULT 0,
    photo_url TEXT,
    is_voice_recorded BOOLEAN DEFAULT FALSE,
    synced BOOLEAN DEFAULT TRUE
);

-- 7. ATTENDANCE LEDGER
CREATE TABLE IF NOT EXISTS public.attendance (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED')),
    check_in_time TEXT,
    check_out_time TEXT,
    qr_code_scan TEXT,
    synced BOOLEAN DEFAULT TRUE
);

-- 8. ACCOUNTS RECEIVABLE INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    student_name TEXT,
    parent_name TEXT,
    title TEXT NOT NULL,
    category TEXT CHECK (category IN ('Tuition', 'Materials', 'After-School', 'Meal Plan')),
    amount NUMERIC(10,2) NOT NULL,
    due_date DATE,
    issued_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL CHECK (status IN ('PAID', 'PENDING', 'OVERDUE')),
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. STAFF PAYROLL
CREATE TABLE IF NOT EXISTS public.staff_payroll (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    staff_id TEXT,
    staff_name TEXT NOT NULL,
    role_title TEXT,
    salary NUMERIC(10,2) NOT NULL,
    bonus NUMERIC(10,2) DEFAULT 0,
    deductions NUMERIC(10,2) DEFAULT 0,
    month TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PROCESSED', 'PENDING')),
    leave_days_taken INT DEFAULT 0
);

-- 10. CLASSROOM INVENTORY
CREATE TABLE IF NOT EXISTS public.classroom_inventory (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    classroom TEXT NOT NULL,
    material_name TEXT NOT NULL,
    area TEXT,
    quantity INT DEFAULT 1,
    condition TEXT CHECK (condition IN ('Excellent', 'Good', 'Needs Maintenance', 'Missing Part')),
    last_inspected DATE DEFAULT CURRENT_DATE,
    maintenance_note TEXT
);

-- ====================================================================
-- SEED INITIAL DATA DATA ROWS
-- ====================================================================

-- Seed Tenants
INSERT INTO public.tenants (id, name, code, address, logo, student_count, staff_count)
VALUES 
    ('tenant-1', 'Sunrise Montessori Academy', 'SMA-MAIN', '742 Evergreen Terrace, Springfield', '☀️', 148, 18),
    ('tenant-2', 'Greenwood Montessori School', 'GMS-NORTH', '120 Pine Tree Lane, Greenfield', '🌿', 92, 12)
ON CONFLICT (id) DO NOTHING;

-- Seed Users
INSERT INTO public.users (id, name, email, role, tenant_id, avatar, title)
VALUES
    ('user-admin', 'Dr. Maria Vance', 'admin@sunrisemontessori.org', 'SUPER_ADMIN', 'tenant-1', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Head of School & Executive Director'),
    ('user-teacher-1', 'Guide Claire Sterling', 'teacher@sunrisemontessori.org', 'TEACHER', 'tenant-1', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Lead Primary Montessori Guide (Casa 1)'),
    ('user-parent-1', 'Eleanor Vance', 'parent@sunrisemontessori.org', 'PARENT', 'tenant-1', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Parent of Lucas & Emma Vance'),
    ('user-student-1', 'Lucas Vance', 'student@sunrisemontessori.org', 'STUDENT', 'tenant-1', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150', 'Primary 3-6 Scholar'),
    ('user-finance-1', 'Arthur Pendelton', 'finance@sunrisemontessori.org', 'FINANCE_HR', 'tenant-1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Chief Financial Officer & HR Director')
ON CONFLICT (id) DO NOTHING;

-- Seed Students
INSERT INTO public.students (id, tenant_id, name, date_of_birth, age_years, classroom, primary_guide_id, parent_id, avatar, allergies, streak_days, star_points, badges, mastery_summary)
VALUES
    ('std-1', 'tenant-1', 'Lucas Vance', '2021-04-12', 5, 'Casa 1 (Primary 3-6)', 'user-teacher-1', 'user-parent-1', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150', ARRAY['Peanuts'], 14, 340, ARRAY['Sensorial Explorer', 'Math Wizard'], '{"presented": 4, "practicing": 8, "mastered": 15}'::jsonb),
    ('std-2', 'tenant-1', 'Emma Vance', '2023-09-05', 3, 'Sunflower (Toddler 1.5-3)', 'user-teacher-1', 'user-parent-1', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', ARRAY[]::TEXT[], 8, 180, ARRAY['Pouring Champion'], '{"presented": 6, "practicing": 5, "mastered": 7}'::jsonb),
    ('std-3', 'tenant-1', 'Mateo Rossi', '2020-11-18', 5, 'Casa 1 (Primary 3-6)', 'user-teacher-1', 'user-parent-2', 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150', ARRAY['Bee Stings'], 21, 520, ARRAY['Golden Bead Master'], '{"presented": 3, "practicing": 6, "mastered": 22}'::jsonb),
    ('std-4', 'tenant-1', 'Sophia Chen', '2021-01-30', 5, 'Casa 2 (Primary 3-6)', 'user-teacher-2', 'user-parent-3', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', ARRAY[]::TEXT[], 12, 290, ARRAY['Sandpaper Letters Specialist'], '{"presented": 5, "practicing": 9, "mastered": 12}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Seed Montessori Materials
INSERT INTO public.montessori_materials (id, area, title, description, age_range, sequence_order)
VALUES
    ('mat-pl-1', 'Practical Life', 'Dry Pouring with Pitchers', 'Refines fine motor control, eye-hand coordination, and wrist flexibility.', '2.5 - 3.5 years', 1),
    ('mat-sen-1', 'Sensorial', 'Pink Tower', 'Visual discrimination of three-dimensional size, volume, and preparation for cubing.', '3 - 4 years', 1),
    ('mat-lang-1', 'Language', 'Sandpaper Letters', 'Tactile and auditory association of phonemic letter sounds prior to writing.', '3.5 - 4.5 years', 1),
    ('mat-math-1', 'Mathematics', 'Golden Bead Bank System', 'Introduction to Decimal System (Units, Tens, Hundreds, Thousands).', '4 - 5.5 years', 1),
    ('mat-cul-1', 'Culture & Science', 'Puzzle Map of World Continents', 'Spatial geography, hemispheric identification, and motor placement accuracy.', '4 - 6 years', 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Observations
INSERT INTO public.observations (id, tenant_id, student_id, student_name, guide_id, guide_name, text, material_title, area, tags, focus_minutes, synced)
VALUES
    ('obs-1', 'tenant-1', 'std-1', 'Lucas Vance', 'user-teacher-1', 'Guide Claire Sterling', 'Lucas chose Golden Beads bank game independently during 3-hour work cycle. Sustained deep focus for 32 consecutive minutes.', 'Golden Bead Bank System', 'Mathematics', ARRAY['Concentration', 'Independence'], 32, TRUE),
    ('obs-2', 'tenant-1', 'std-3', 'Mateo Rossi', 'user-teacher-1', 'Guide Claire Sterling', 'Mateo completed Puzzle Map of World Continents and traced landmasses with colored pencils.', 'Puzzle Map of World Continents', 'Culture & Science', ARRAY['Concentration', 'Coordination'], 45, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Seed Invoices
INSERT INTO public.invoices (id, tenant_id, student_id, student_name, parent_name, title, category, amount, due_date, status)
VALUES
    ('inv-2026-001', 'tenant-1', 'std-1', 'Lucas Vance', 'Eleanor Vance', 'Fall Term Primary Tuition 2026', 'Tuition', 1450.00, '2026-09-01', 'PAID'),
    ('inv-2026-002', 'tenant-1', 'std-2', 'Emma Vance', 'Eleanor Vance', 'Toddler Program Materials & Activity Fee', 'Materials', 320.00, '2026-09-05', 'PENDING'),
    ('inv-2026-003', 'tenant-1', 'std-3', 'Mateo Rossi', 'Marco Rossi', 'Fall Term Primary Tuition 2026', 'Tuition', 1450.00, '2026-08-20', 'OVERDUE')
ON CONFLICT (id) DO NOTHING;
