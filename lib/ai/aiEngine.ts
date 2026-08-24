import { db } from '../db';
import { UserRole, ChatMessage, AiInsight } from '../types';

export function processAiAssistantMessage(userText: string, userRole: UserRole, tenantId: string = 'tenant-1'): ChatMessage {
  const lower = userText.toLowerCase();
  let replyText = '';
  let actions: string[] = [];

  const students = db.getStudents(tenantId);
  const observations = db.getObservations(tenantId);
  const insights = db.getAiInsights();

  if (userRole === 'TEACHER') {
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
    } else if (lower.includes('lucas') || lower.includes('progress') || lower.includes('summary')) {
      replyText = `📊 **Lucas Vance - Montessori Progress Briefing:**\n` +
        `• **Mastered Works (15):** Pink Tower, Hand Washing, Cylinder Block 1, Sandpaper Letters (Group 1).\n` +
        `• **Current Focus (Practicing 8):** Golden Bead Bank System, Moveable Alphabet.\n` +
        `• **Observed Strengths:** Sustained 32-min concentration streak during math work cycle; exemplary Grace & Courtesy.\n` +
        `• **AI Recommendation:** Ready for Moveable Alphabet 3-letter phonetic word composition!`;
      actions = ['Record New Observation', 'Generate Parent Report Card', 'Update Mastery Grid'];
    } else {
      replyText = `Hello Guide! I'm **SkyeBot**, your Montessori Pedagogical AI Assistant. I can help you with:\n` +
        `• Crafting customized 3-Period Lesson Plans\n` +
        `• Summarizing student observation trends & focus duration\n` +
        `• Generating parent progress narratives\n\n` +
        `How can I assist your classroom today?`;
      actions = ['Generate Lesson Plan', 'Summarize Lucas Progress', 'Suggest Next Presentations'];
    }
  } else if (userRole === 'PARENT') {
    if (lower.includes('how is') || lower.includes('lucas') || lower.includes('doing') || lower.includes('today')) {
      replyText = `🌟 **Daily Highlight for Lucas:**\n\n` +
        `Lucas had a wonderful 3-hour work cycle today! He chose the **Golden Bead Bank System** independently and stayed deeply focused for **32 minutes**.\n\n` +
        `Guide Claire noted: *"Lucas showed fantastic mastery in exchange from units to tens and helped clean up the work mat with great care."*\n\n` +
        `**Star Points Earned Today:** +40 ⭐ (Current Streak: 14 Days!)`;
      actions = ['View Observation Photos', 'Send Thank You to Guide', 'Download Attendance Receipt'];
    } else if (lower.includes('fee') || lower.includes('invoice') || lower.includes('pay')) {
      replyText = `💳 **Financial Status Overview:**\n` +
        `• Fall Term Tuition Invoice (#INV-2026-001): **PAID** ($1,450.00)\n` +
        `• Toddler Activity & Material Fee (#INV-2026-002): **PENDING** ($320.00, Due Sept 5)\n\n` +
        `You can complete payment directly via our secure parent portal.`;
      actions = ['Pay Outstanding Invoice', 'Download Tax Receipt'];
    } else {
      replyText = `Welcome! I'm **SkyeBot**, your Montessori Parent Companion. Ask me anything about your child's daily observations, milestone radar, or fee invoices!`;
      actions = ['How is Lucas doing today?', 'Check Fee Invoices', 'View Milestone Radar'];
    }
  } else if (userRole === 'SUPER_ADMIN' || userRole === 'FINANCE_HR') {
    replyText = `📈 **Executive Intelligence Report (Sunrise Montessori Academy):**\n\n` +
      `• **Total Enrollment:** 148 Students (89% Capacity across 6 Casa rooms)\n` +
      `• **Attendance Rate Today:** 96.2% Present (4 Late, 1 Excused)\n` +
      `• **Financial Health:** $214,600 Total Term Invoiced | **92% Collected**\n` +
      `• **Classroom Material Status:** 2 items flagged for repair (Golden Bead frame, Australia Puzzle Pin)\n\n` +
      `**AI Operational Alert:** High parent engagement (+34% story views) on Practical Life observation posts!`;
    actions = ['Run Financial Forecast', 'View Staff Payroll Status', 'Export Audit Report'];
  } else {
    // Student role
    replyText = `Hi there, Explorer! 🚀 You have **340 Star Points** and a **14-Day Learning Streak**!\n\n` +
      `Today's Recommended Quest: Try the **Golden Beads Visualizer** in the Virtual Manipulative Sandbox to unlock your **Math Wizard Badge**!`;
    actions = ['Open Golden Beads Sandbox', 'View My Badges', 'Take Daily Quiz'];
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
  return db.getAiInsights();
}
