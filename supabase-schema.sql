-- ====================================================================
-- SKYELAX MONTESSORI ERP & LMS - COMPLETE SUPABASE DATABASE SCHEMA & SEED
-- Project ID: gkuzymsprlnetkhhaqow
-- Execute this SQL script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gkuzymsprlnetkhhaqow/sql/new
-- ====================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. TENANTS / SCHOOL CAMPUSES
-- ====================================================================
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

-- ====================================================================
-- 2. USERS & ROLES
-- ====================================================================
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

-- ====================================================================
-- 3. STUDENTS
-- ====================================================================
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

-- ====================================================================
-- 4. MONTESSORI MATERIALS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.montessori_materials (
    id TEXT PRIMARY KEY,
    area TEXT NOT NULL CHECK (area IN ('Practical Life', 'Sensorial', 'Language', 'Mathematics', 'Culture & Science')),
    title TEXT NOT NULL,
    description TEXT,
    age_range TEXT,
    sequence_order INT DEFAULT 1,
    icon_name TEXT
);

-- ====================================================================
-- 5. STUDENT MASTERY RECORDS (THREE-PERIOD LESSONS)
-- ====================================================================
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

-- ====================================================================
-- 6. OBSERVATION NOTES
-- ====================================================================
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

-- ====================================================================
-- 7. ATTENDANCE LEDGER
-- ====================================================================
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

-- ====================================================================
-- 8. ACCOUNTS RECEIVABLE INVOICES
-- ====================================================================
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

-- ====================================================================
-- 9. STAFF PAYROLL
-- ====================================================================
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

-- ====================================================================
-- 10. CLASSROOM INVENTORY
-- ====================================================================
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
-- 11. DAILY STORY FEED POSTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.story_posts (
    id TEXT PRIMARY KEY,
    tenant_id TEXT REFERENCES public.tenants(id) ON DELETE CASCADE,
    student_id TEXT REFERENCES public.students(id) ON DELETE CASCADE,
    guide_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    photo_url TEXT,
    area TEXT,
    timestamp TEXT,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- 12. AI OPERATIONAL INSIGHTS
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('DEVELOPMENTAL', 'ACADEMIC', 'FINANCIAL', 'OPERATIONAL')),
    priority TEXT NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    target_id TEXT,
    target_name TEXT,
    timestamp TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ====================================================================
-- PERFORMANCE INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_users_tenant ON public.users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_students_tenant ON public.students(tenant_id);
CREATE INDEX IF NOT EXISTS idx_students_classroom ON public.students(classroom);
CREATE INDEX IF NOT EXISTS idx_mastery_student ON public.student_mastery_records(student_id);
CREATE INDEX IF NOT EXISTS idx_mastery_material ON public.student_mastery_records(material_id);
CREATE INDEX IF NOT EXISTS idx_observations_tenant ON public.observations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_observations_student ON public.observations(student_id);
CREATE INDEX IF NOT EXISTS idx_observations_timestamp ON public.observations(timestamp);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_tenant_student ON public.attendance(tenant_id, student_id);
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_status ON public.invoices(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_payroll_tenant ON public.staff_payroll(tenant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_tenant ON public.classroom_inventory(tenant_id);
CREATE INDEX IF NOT EXISTS idx_stories_student ON public.story_posts(student_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.montessori_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mastery_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;

-- Read policies (allow authenticated users to access their tenant data, and public read for demo)
CREATE POLICY "Allow read access for authenticated and demo users" ON public.tenants FOR SELECT USING (true);
CREATE POLICY "Allow read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Allow read materials" ON public.montessori_materials FOR SELECT USING (true);
CREATE POLICY "Allow read mastery" ON public.student_mastery_records FOR SELECT USING (true);
CREATE POLICY "Allow read observations" ON public.observations FOR SELECT USING (true);
CREATE POLICY "Allow read attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Allow read invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Allow read payroll" ON public.staff_payroll FOR SELECT USING (true);
CREATE POLICY "Allow read inventory" ON public.classroom_inventory FOR SELECT USING (true);
CREATE POLICY "Allow read stories" ON public.story_posts FOR SELECT USING (true);
CREATE POLICY "Allow read insights" ON public.ai_insights FOR SELECT USING (true);

-- Insert & Update policies
CREATE POLICY "Allow insert observations" ON public.observations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update observations" ON public.observations FOR UPDATE USING (true);
CREATE POLICY "Allow insert attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update attendance" ON public.attendance FOR UPDATE USING (true);
CREATE POLICY "Allow update invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Allow update students" ON public.students FOR UPDATE USING (true);
CREATE POLICY "Allow update mastery" ON public.student_mastery_records FOR ALL USING (true);

-- ====================================================================
-- SEED INITIAL DATA
-- ====================================================================

-- 1. Seed Tenants
INSERT INTO public.tenants (id, name, code, address, logo, student_count, staff_count)
VALUES 
    ('tenant-1', 'Sunrise Montessori Academy', 'SMA-MAIN', '742 Evergreen Terrace, Springfield', '☀️', 148, 18),
    ('tenant-2', 'Greenwood Montessori School', 'GMS-NORTH', '120 Pine Tree Lane, Greenfield', '🌿', 92, 12)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Users
INSERT INTO public.users (id, name, email, role, tenant_id, avatar, title)
VALUES
    ('user-admin', 'Dr. Maria Vance', 'admin@sunrisemontessori.org', 'SUPER_ADMIN', 'tenant-1', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'Head of School & Executive Director'),
    ('user-teacher-1', 'Guide Claire Sterling', 'teacher@sunrisemontessori.org', 'TEACHER', 'tenant-1', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'Lead Primary Montessori Guide (Casa 1)'),
    ('user-parent-1', 'Eleanor Vance', 'parent@sunrisemontessori.org', 'PARENT', 'tenant-1', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Parent of Lucas & Emma Vance'),
    ('user-student-1', 'Lucas Vance', 'student@sunrisemontessori.org', 'STUDENT', 'tenant-1', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150', 'Primary 3-6 Scholar'),
    ('user-finance-1', 'Arthur Pendelton', 'finance@sunrisemontessori.org', 'FINANCE_HR', 'tenant-1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Chief Financial Officer & HR Director')
ON CONFLICT (id) DO NOTHING;

-- 3. Seed Students
INSERT INTO public.students (id, tenant_id, name, date_of_birth, age_years, classroom, primary_guide_id, parent_id, avatar, allergies, streak_days, star_points, badges, mastery_summary)
VALUES
    ('std-1', 'tenant-1', 'Lucas Vance', '2021-04-12', 5, 'Casa 1 (Primary 3-6)', 'user-teacher-1', 'user-parent-1', 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150', ARRAY['Peanuts'], 14, 340, ARRAY['Sensorial Explorer', 'Math Wizard', '10-Day Streak'], '{"presented": 4, "practicing": 8, "mastered": 15}'::jsonb),
    ('std-2', 'tenant-1', 'Emma Vance', '2023-09-05', 3, 'Sunflower (Toddler 1.5-3)', 'user-teacher-1', 'user-parent-1', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', ARRAY[]::TEXT[], 8, 180, ARRAY['Pouring Champion', 'Self-Dresser'], '{"presented": 6, "practicing": 5, "mastered": 7}'::jsonb),
    ('std-3', 'tenant-1', 'Mateo Rossi', '2020-11-18', 5, 'Casa 1 (Primary 3-6)', 'user-teacher-1', 'user-parent-2', 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150', ARRAY['Bee Stings'], 21, 520, ARRAY['Golden Bead Master', 'Botany Detective'], '{"presented": 3, "practicing": 6, "mastered": 22}'::jsonb),
    ('std-4', 'tenant-1', 'Sophia Chen', '2021-01-30', 5, 'Casa 2 (Primary 3-6)', 'user-teacher-2', 'user-parent-3', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', ARRAY[]::TEXT[], 12, 290, ARRAY['Sandpaper Letters Specialist'], '{"presented": 5, "practicing": 9, "mastered": 12}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Montessori Materials
INSERT INTO public.montessori_materials (id, area, title, description, age_range, sequence_order)
VALUES
    ('mat-pl-1', 'Practical Life', 'Dry Pouring with Pitchers', 'Refines fine motor control, eye-hand coordination, and wrist flexibility.', '2.5 - 3.5 years', 1),
    ('mat-pl-2', 'Practical Life', 'Dressing Frames (Buttons & Snaps)', 'Develops personal dressing independence and fine finger dexterity.', '3 - 4 years', 2),
    ('mat-pl-3', 'Practical Life', 'Hand Washing Exercise', 'Complex 12-step sequential work promoting concentration and hygiene order.', '3.5 - 5 years', 3),
    ('mat-sen-1', 'Sensorial', 'Pink Tower', 'Visual discrimination of three-dimensional size, volume, and preparation for cubing.', '3 - 4 years', 1),
    ('mat-sen-2', 'Sensorial', 'Cylinder Blocks (Block 1-4)', 'Discrimination of height and diameter; pre-writing tripod grip training.', '3 - 4.5 years', 2),
    ('mat-lang-1', 'Language', 'Sandpaper Letters', 'Tactile and auditory association of phonemic letter sounds prior to writing.', '3.5 - 4.5 years', 1),
    ('mat-lang-2', 'Language', 'Moveable Alphabet', 'Early composition of words prior to physical handwriting control.', '4 - 5 years', 2),
    ('mat-math-1', 'Mathematics', 'Golden Bead Bank System', 'Concrete introduction to Decimal System (Units, Tens, Hundreds, Thousands).', '4 - 5.5 years', 1),
    ('mat-cul-1', 'Culture & Science', 'Puzzle Map of World Continents', 'Spatial geography, hemispheric identification, and motor placement accuracy.', '4 - 6 years', 1)
ON CONFLICT (id) DO NOTHING;

-- 5. Seed Student Mastery Records
INSERT INTO public.student_mastery_records (id, student_id, material_id, status, presentation_date, mastery_date, guide_notes, repetition_count)
VALUES
    ('smr-1', 'std-1', 'mat-math-1', 'PRACTICING', '2026-08-10', NULL, 'Lucas demonstrates strong grasp of unit vs ten beads. Working on exchange to hundreds.', 6),
    ('smr-2', 'std-1', 'mat-sen-1', 'MASTERED', '2026-05-14', '2026-06-20', 'Flawlessly builds Pink Tower vertically and horizontally without hesitation.', 18)
ON CONFLICT (id) DO NOTHING;

-- 6. Seed Observations
INSERT INTO public.observations (id, tenant_id, student_id, student_name, guide_id, guide_name, text, material_title, area, tags, focus_minutes, synced)
VALUES
    ('obs-1', 'tenant-1', 'std-1', 'Lucas Vance', 'user-teacher-1', 'Guide Claire Sterling', 'Lucas chose Golden Beads bank game independently during 3-hour work cycle. Sustained deep focus for 32 consecutive minutes.', 'Golden Bead Bank System', 'Mathematics', ARRAY['Concentration', 'Independence'], 32, TRUE),
    ('obs-2', 'tenant-1', 'std-3', 'Mateo Rossi', 'user-teacher-1', 'Guide Claire Sterling', 'Mateo completed Puzzle Map of World Continents and traced landmasses with colored pencils.', 'Puzzle Map of World Continents', 'Culture & Science', ARRAY['Concentration', 'Coordination'], 45, TRUE)
ON CONFLICT (id) DO NOTHING;

-- 7. Seed Invoices
INSERT INTO public.invoices (id, tenant_id, student_id, student_name, parent_name, title, category, amount, due_date, status)
VALUES
    ('inv-2026-001', 'tenant-1', 'std-1', 'Lucas Vance', 'Eleanor Vance', 'Fall Term Primary Tuition 2026', 'Tuition', 1450.00, '2026-09-01', 'PAID'),
    ('inv-2026-002', 'tenant-1', 'std-2', 'Emma Vance', 'Eleanor Vance', 'Toddler Program Materials & Activity Fee', 'Materials', 320.00, '2026-09-05', 'PENDING'),
    ('inv-2026-003', 'tenant-1', 'std-3', 'Mateo Rossi', 'Marco Rossi', 'Fall Term Primary Tuition 2026', 'Tuition', 1450.00, '2026-08-20', 'OVERDUE')
ON CONFLICT (id) DO NOTHING;

-- 8. Seed Staff Payroll
INSERT INTO public.staff_payroll (id, tenant_id, staff_id, staff_name, role_title, salary, bonus, deductions, month, status, leave_days_taken)
VALUES
    ('pay-1', 'tenant-1', 'user-teacher-1', 'Guide Claire Sterling', 'Lead Primary Guide', 4800.00, 300.00, 420.00, 'August 2026', 'PROCESSED', 1),
    ('pay-2', 'tenant-1', 'user-teacher-2', 'Guide Julian Thorne', 'Assistant Guide', 3600.00, 150.00, 310.00, 'August 2026', 'PROCESSED', 0)
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Classroom Inventory
INSERT INTO public.classroom_inventory (id, tenant_id, classroom, material_name, area, quantity, condition, last_inspected, maintenance_note)
VALUES
    ('inv-mat-1', 'tenant-1', 'Casa 1 (Primary 3-6)', 'Pink Tower Wooden Cubes Set', 'Sensorial', 2, 'Excellent', '2026-08-20', NULL),
    ('inv-mat-2', 'tenant-1', 'Casa 1 (Primary 3-6)', 'Golden Beads Thousand Cubes', 'Mathematics', 9, 'Needs Maintenance', '2026-08-22', 'One bead frame loose wire needs re-soldering.'),
    ('inv-mat-3', 'tenant-1', 'Casa 2 (Primary 3-6)', 'World Map Wooden Puzzle', 'Culture & Science', 1, 'Missing Part', '2026-08-19', 'Australia pin piece is currently mislaid.')
ON CONFLICT (id) DO NOTHING;

-- 10. Seed Story Posts
INSERT INTO public.story_posts (id, tenant_id, student_id, guide_name, title, content, photo_url, area, timestamp, likes_count)
VALUES
    ('story-1', 'tenant-1', 'std-1', 'Guide Claire Sterling', 'Lucas Mastery in Decimal Addition!', 'Today Lucas spent over 30 minutes with the Golden Bead decimal system. He successfully added 342 + 215 with complete independence and explained the concept to a peer!', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800', 'Mathematics', '2 hours ago', 12),
    ('story-2', 'tenant-1', 'std-1', 'Guide Claire Sterling', 'Grace & Courtesy in Action', 'Notice how Lucas gently pours water for snack time with two hands on the pitcher handle! Order and control of movement developing beautifully.', 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800', 'Practical Life', 'Yesterday', 19)
ON CONFLICT (id) DO NOTHING;

-- 11. Seed AI Insights
INSERT INTO public.ai_insights (id, type, priority, title, description, recommendation, target_id, target_name, timestamp)
VALUES
    ('ins-1', 'DEVELOPMENTAL', 'HIGH', 'Lucas Vance: High Readiness for Moveable Alphabet', 'Observation data shows 100% sound recall across Sandpaper Letters (m, a, t, s, p, f). Concentration duration averaged 28 mins in language work.', 'Present Moveable Alphabet three-letter word creation sequence during tomorrow morning work cycle.', 'std-1', 'Lucas Vance', 'Today, 08:30 AM'),
    ('ins-2', 'ACADEMIC', 'MEDIUM', 'Sensorial Area Utilization Peak', 'Pink Tower and Cylinder Blocks registered high demand today (84% of Casa 1 students chose sensorial works).', 'Ensure clean tray placement and introduce Binomial Cube presentation to interested 4-year-olds.', NULL, NULL, 'Today, 11:00 AM'),
    ('ins-3', 'FINANCIAL', 'MEDIUM', 'Tuition Fee Collection Forecast', '92% of Fall term invoices collected. 3 outstanding accounts requiring automatic friendly reminder.', 'Dispatch SMS/Email gentle notification to accounts with pending balances due before Sept 1.', NULL, NULL, 'Yesterday, 04:00 PM')
ON CONFLICT (id) DO NOTHING;
