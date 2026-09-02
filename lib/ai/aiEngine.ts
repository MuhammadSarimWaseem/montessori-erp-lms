import { db } from '../db';
import { UserRole, ChatMessage, AiInsight } from '../types';

export function processAiAssistantMessage(userText: string, userRole: UserRole, tenantId: string = 'tenant-1'): ChatMessage {
  const lower = userText.toLowerCase();
  let replyText = '';
  let actions: string[] = [];

  const students = db.getStudents(tenantId);
  const observations = db.getObservations(tenantId);
  const invoices = db.getInvoices(tenantId);
  const inventory = db.getInventory(tenantId);
  const materials = db.getMaterials();

  // Search if a specific student is referenced
  const matchedStudent = students.find(s => lower.includes(s.name.toLowerCase().split(' ')[0]));

  if (matchedStudent) {
    const studentObs = observations.filter(o => o.studentId === matchedStudent.id);
    const mastery = matchedStudent.masterySummary;
    replyText = `📊 **${matchedStudent.name} (${matchedStudent.classroom}) — Comprehensive AI Dossier:**\n\n` +
      `• **Work Cycle Streak:** ${matchedStudent.streakDays} Consecutive Days 🔥\n` +
      `• **Total Star Points:** ${matchedStudent.starPoints} ⭐\n` +
      `• **Mastery Breakdown:** ${mastery.mastered} Mastered, ${mastery.practicing} Practicing, ${mastery.presented} Presented\n` +
      `• **Unlocked Badges:** ${matchedStudent.badges.join(', ')}\n\n` +
      `**Recent Observational Log (${studentObs.length} notes recorded):**\n` +
      (studentObs.length > 0 
        ? `*"${studentObs[0].text}"* — recorded by ${studentObs[0].guideName} (${studentObs[0].focusMinutes} min focus)`
        : `*No recent observational flags. Standard progress.*`) +
      `\n\n**Pedagogical AI Next Step:** Introduce sequential apparatus in ${(mastery.mastered > 10 ? 'Mathematics' : 'Sensorial')} area during tomorrow's uninterrupted morning cycle.`;
    actions = [`Record Observation for ${matchedStudent.name}`, `Generate Report Card`, `Open Virtual Sandbox`];
  } else if (lower.includes('pink tower') || lower.includes('tower')) {
    const mat = materials.find(m => m.title.toLowerCase().includes('pink tower'));
    replyText = `🌸 **Montessori Material Profile: Pink Tower**\n\n` +
      `• **Area:** Sensorial\n` +
      `• **Age Range:** ${mat?.ageRange || '3 - 4 years'}\n` +
      `• **Direct Aim:** Visual discrimination of 3D dimensions, volume perception, and pre-math cubing preparation ($1^3$ to $10^3$).\n` +
      `• **Indirect Aim:** Preparation for decimal system and base-10 concepts.\n` +
      `• **Control of Error:** Visual disharmony if cubes are inverted or unstable.\n\n` +
      `*Recommended Presentation:* Guide carries mat, walks child to shelf with two hands on largest cube. Builds vertically from 10cm base down to 1cm peak cube.`;
    actions = ['Launch Pink Tower in Sandbox', 'Log Presentation', 'Print Material Card'];
  } else if (lower.includes('golden bead') || lower.includes('beads') || lower.includes('decimal')) {
    replyText = `🧮 **Montessori Material Profile: Golden Bead Bank System**\n\n` +
      `• **Area:** Mathematics (Ages 4 - 5.5)\n` +
      `• **Direct Aim:** Concrete introduction to the Decimal System (Units, Tens, Hundreds, Thousands).\n` +
      `• **Manipulatives:** 1 Single Bead (Unit), 1 Ten Bar (10 beads), 1 Hundred Square (100 beads), 1 Thousand Cube (1,000 beads).\n` +
      `• **Key Pedagogical Milestone:** The "Magic of 10" exchange: 10 units = 1 ten bar, 10 ten bars = 1 hundred square, 10 hundred squares = 1 thousand cube!`;
    actions = ['Launch Golden Beads Sandbox', 'Assign Student Quest', 'View Math Curriculum'];
  } else if (lower.includes('financial') || lower.includes('revenue') || lower.includes('tuition') || lower.includes('payroll')) {
    const totalCollected = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.amount, 0);
    const totalPending = invoices.filter(i => i.status !== 'PAID').reduce((s, i) => s + i.amount, 0);
    replyText = `💰 **Real-Time Financial & Accounts Summary:**\n\n` +
      `• **Total Invoices Issued:** ${invoices.length} invoices\n` +
      `• **Collected Revenue:** $${totalCollected.toLocaleString()} (Verified in Bank)\n` +
      `• **Pending Receivables:** $${totalPending.toLocaleString()}\n` +
      `• **Collection Efficiency:** ${Math.round((totalCollected / Math.max(1, totalCollected + totalPending)) * 100)}%\n\n` +
      `**Actionable Alert:** ${invoices.filter(i => i.status === 'OVERDUE').length} overdue accounts flagged for automatic gentle reminder.`;
    actions = ['View Tuition Ledger', 'Process Staff Payroll', 'Disburse Invoices'];
  } else if (lower.includes('inventory') || lower.includes('repair') || lower.includes('material')) {
    const needsRepair = inventory.filter(i => i.condition !== 'Excellent');
    replyText = `📦 **Classroom Material Inventory Diagnostic:**\n\n` +
      `• **Total Cataloged Apparatus:** ${inventory.length} items in tenant\n` +
      `• **Requires Maintenance:** ${needsRepair.length} flagged items\n\n` +
      needsRepair.map(item => `• **${item.materialName}** (${item.classroom}): *${item.condition}* — ${item.maintenanceNote || 'Inspect parts'}`).join('\n');
    actions = ['Schedule Material Maintenance', 'Order Replacement Parts'];
  } else if (userRole === 'TEACHER') {
    if (lower.includes('lesson plan') || lower.includes('presentation') || lower.includes('plan')) {
      replyText = `✨ **Montessori AI Lesson Plan Generated:**\n\n` +
        `**Target Skill:** Golden Bead Decimal Multiplication\n` +
        `**Area:** Mathematics (Ages 4.5 - 6)\n` +
        `**Materials Required:** Golden Bead Bank (Units, Tens, Hundreds, Thousands) & Large Number Cards.\n\n` +
        `**Three-Period Presentation Steps:**\n` +
        `1. **Period 1 (Naming):** Lay out 2 units, 2 tens, 2 hundred cubes. Invite child: "Let's take 232 two times."\n` +
        `2. **Period 2 (Recognition):** Have child slide quantities into unified tray and count totals.\n` +
        `3. **Period 3 (Recall):** Ask child to write product 464 on small paper slip independently.\n\n` +
        `*Direct Purpose:* Concrete understanding of multiplication as repeated addition.`;
      actions = ['Save to Daily Work Plan', 'Print Presentation Card', 'Log Observation Draft'];
    } else {
      replyText = `Hello Guide! I'm **SkyeBot**, your Montessori Pedagogical AI Assistant. I can help you with:\n` +
        `• Real-time child dossiers (ask me about **Lucas**, **Mateo**, **Sophia**, or **Emma**)\n` +
        `• Three-period lesson plans and material presentations\n` +
        `• Observational concentration trends\n` +
        `• Parent progress narratives\n\n` +
        `What can I assist your classroom with today?`;
      actions = ['Analyze Lucas Vance', 'Plan Math Presentation', 'Review Material Repairs'];
    }
  } else if (userRole === 'PARENT') {
    replyText = `Welcome! I'm **SkyeBot**, your Montessori Parent Companion.\n\n` +
      `Ask me about:\n` +
      `• How your child did in their 3-hour work cycle today\n` +
      `• Their lesson mastery in Practical Life, Sensorial, Language, and Math\n` +
      `• Tuition invoices and receipt statuses\n\n` +
      `How can I assist your family today?`;
    actions = ['How is Lucas doing today?', 'Check Fee Invoices', 'View Milestone Radar'];
  } else if (userRole === 'STUDENT') {
    const defaultStudent = students[0];
    replyText = `Hi there, Explorer! 🚀 You have **${defaultStudent.starPoints} Star Points** and a **${defaultStudent.streakDays}-Day Learning Streak**!\n\n` +
      `Today's Recommended Quest: Try the **Golden Beads Visualizer** or **Pink Tower** in the Virtual Manipulative Sandbox to unlock your next badge!`;
    actions = ['Open Golden Beads Sandbox', 'Stack Pink Tower', 'Take Daily Quiz'];
  } else {
    replyText = `📈 **Executive Intelligence Report (Sunrise Montessori Academy):**\n\n` +
      `• **Total Students:** ${students.length} active scholars\n` +
      `• **Observations Logged:** ${observations.length} pedagogical notes recorded\n` +
      `• **Campus Status:** Operational in full compliance with Montessori principles.`;
    actions = ['Run Financial Forecast', 'View Staff Payroll Status', 'Export Audit Report'];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'BOT',
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions: actions
  };
}

export function generateDynamicInsights(): AiInsight[] {
  const base = db.getAiInsights();
  const inventory = db.getInventory('tenant-1');
  const needsFix = inventory.filter(i => i.condition !== 'Excellent');

  const dynamicInsights: AiInsight[] = [...base];

  if (needsFix.length > 0) {
    dynamicInsights.push({
      id: `ins-inv-${Date.now()}`,
      type: 'OPERATIONAL',
      priority: 'HIGH',
      title: `${needsFix.length} Montessori Materials Require Maintenance`,
      description: `Classroom audit detected ${needsFix.map(n => n.materialName).join(', ')} with wear or missing components.`,
      recommendation: 'Dispatch replacement parts or schedule repair session with classroom guide.',
      timestamp: 'Just now'
    });
  }

  return dynamicInsights;
}
