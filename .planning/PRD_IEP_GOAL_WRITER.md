# PRD: IEP Goal Writer (Values Wizard)
**Product Requirements Document**  
**Project:** Interactive IEP Behavior Goal Generator  
**Date:** January 30, 2026  
**Owner:** Rob Spain  

---

## 🎯 Product Vision

Build a **free, web-based IEP Behavior Goal Generator** that creates research-backed, compliance-ready IEP goals in under 5 minutes.

**Key Differentiator:** Values-based approach ("Values Wizard") that creates student-driven goals students actually care about, leading to higher motivation and lasting behavior change beyond mere compliance.

**Deployment:**
- **Primary:** BehaviorSchool.com (public-facing, lead generation)
- **Secondary:** KCUSD Behavior Team site (Level 3 demo/internal use)

---

## 📊 Current State vs. Goal

### ✅ Current (Landing Page Only)
- **BehaviorSchool.com/iep-goals** - Marketing page, no actual tool
- Describes "Values Wizard" concept
- Shows Level 1-5 goal progression
- Waitlist signup form

### 🎯 Goal (Functional Tool)
- **Interactive goal generator** - Working web app
- Guided workflow (Values Wizard)
- Instant goal generation
- Copy/download/print functionality
- **No registration required** (friction-free)
- Email capture for advanced features

---

## 👥 User Personas

### Persona 1: Special Education Teacher
**Name:** Sarah, 3rd grade inclusion teacher  
**Pain Points:**
- Spends hours writing IEP goals that get rejected
- Struggles to make goals measurable
- Parents don't understand vague goals
- Students don't connect with compliance-focused goals

**Goals:**
- Write compliant goals quickly
- Create goals students understand
- Pass admin review on first submission
- Track progress easily

---

### Persona 2: BCBA/Behavior Specialist
**Name:** Marcus, school-based BCBA  
**Pain Points:**
- Traditional goals focus on stopping behavior (not replacement skills)
- Goals lack baseline, fluency, generalization, maintenance
- Students aren't invested in their own goals
- Hard to write goals parents support

**Goals:**
- Research-based goal structure
- Values-aligned (ACT framework)
- Level 5 SMART goals (all components)
- Evidence-based measurement systems

---

### Persona 3: School Psychologist
**Name:** Dr. Kim, district psychologist  
**Pain Points:**
- Inconsistent goal quality across schools
- Compliance issues during audits
- Teachers need training on goal writing
- Time pressure during IEP season

**Goals:**
- District-wide consistency
- Audit-proof goals
- Quick training tool for teachers
- Scalable solution

---

## 🔑 Core Features

### Feature 1: **Values Wizard (5-Step Guided Workflow)**

#### Purpose
Guide users through creating a **Level 5 SMART Goal** with all research-based components:
1. Baseline data
2. Specific behavior
3. Measurement criteria
4. Latency & fluency
5. Generalization (multiple settings)
6. Maintenance (4+ weeks)

---

### Step 1: Choose Student Values

**Question:** "What matters most to this student?"

**Values Options (8-10 core values):**
- **Kind** - Caring about others
- **Brave** - Trying new things despite fear
- **Focused** - Paying attention to what matters
- **Helpful** - Supporting others
- **Honest** - Telling the truth
- **Respectful** - Treating others well
- **Creative** - Thinking in new ways
- **Responsible** - Following through on commitments

**UI:**
```
┌──────────────────────────────────────────┐
│ Step 1 of 5: What Matters Most?          │
├──────────────────────────────────────────┤
│                                           │
│ Pick the value this student wants to     │
│ grow in (ask them if possible!):         │
│                                           │
│ [Large value cards with emojis]          │
│                                           │
│ 💛 Kind       🦁 Brave      🎯 Focused   │
│ 🤗 Helpful    🤝 Honest     🙏 Respectful│
│ 🌟 Creative   ✅ Responsible              │
│                                           │
│ Selected: 💛 Kind                        │
│                                           │
│ [Next Step →]                            │
│                                           │
└──────────────────────────────────────────┘
```

**Student-Facing Language (Optional Toggle):**
"What do you want to get better at?"

---

### Step 2: Define the Behavior (Increase or Decrease)

**Question:** "What behavior are we working on?"

**Options:**
1. **Increase a Positive Behavior** (Replacement skill)
2. **Decrease a Problem Behavior**

**If "Increase":**
```
┌──────────────────────────────────────────┐
│ Step 2 of 5: What Behavior?              │
├──────────────────────────────────────────┤
│                                           │
│ Value: 💛 Kind                           │
│                                           │
│ What KIND behavior do you want to see    │
│ MORE of?                                  │
│                                           │
│ Examples:                                │
│ • Using kind words with peers            │
│ • Helping classmates with tasks          │
│ • Sharing materials                      │
│ • Offering comfort when someone is sad   │
│                                           │
│ Behavior: [Text input]                   │
│ "Using kind words with peers when upset" │
│                                           │
│ [← Back] [Next →]                        │
│                                           │
└──────────────────────────────────────────┘
```

**If "Decrease":**
```
┌──────────────────────────────────────────┐
│ Problem Behavior to Decrease              │
├──────────────────────────────────────────┤
│                                           │
│ What behavior needs to stop?             │
│ Behavior: [Text input]                   │
│ "Yelling at peers"                       │
│                                           │
│ ⚠️ What should they do INSTEAD?          │
│ Replacement Behavior: [Text input]       │
│ "Using calm voice to express frustration"│
│                                           │
│ [← Back] [Next →]                        │
│                                           │
└──────────────────────────────────────────┘
```

**ABA Principle:** Always teach a replacement behavior, not just reduce the problem.

---

### Step 3: Set Baseline & Target Criteria

**Question:** "Where are they now? Where do we want them to be?"

```
┌──────────────────────────────────────────┐
│ Step 3 of 5: Baseline & Target           │
├──────────────────────────────────────────┤
│                                           │
│ Behavior: Using kind words with peers    │
│                                           │
│ Current Performance (Baseline):          │
│ [Number input] 40 %                      │
│ "Currently uses kind words in 40% of     │
│  observed interactions"                  │
│                                           │
│ Target Performance:                      │
│ [Slider: 80-100%] → 90%                 │
│                                           │
│ ✅ Research shows 90-100% accuracy       │
│    leads to better retention!            │
│                                           │
│ How will you measure it?                 │
│ ○ Percentage of opportunities            │
│ ○ Frequency (times per day/week)        │
│ ○ Duration (minutes)                     │
│ ○ Latency (seconds to respond)          │
│                                           │
│ Measurement: % of opportunities ✓        │
│                                           │
│ [← Back] [Next →]                        │
│                                           │
└──────────────────────────────────────────┘
```

**Smart Defaults:**
- Target: 90% (research-backed)
- Measurement: % of opportunities (most common for behavior)
- Warning if target < 80% ("Consider higher standard for lasting change")

---

### Step 4: Add Fluency & Generalization

**Question:** "How fast? Where else should it work?"

```
┌──────────────────────────────────────────┐
│ Step 4 of 5: Fluency & Generalization    │
├──────────────────────────────────────────┤
│                                           │
│ Fluency (Speed):                         │
│ Should the student respond quickly?      │
│                                           │
│ ☐ Add fluency requirement                │
│   Within [5] seconds of peer interaction │
│                                           │
│ Generalization (Settings):               │
│ Where should this behavior work?         │
│ (Pick at least 3 for best results)       │
│                                           │
│ ☑ Structured classroom                   │
│ ☑ Small group instruction                │
│ ☑ Independent work time                  │
│ ☐ Lunch/recess                           │
│ ☐ Transitions                            │
│ ☐ Specials (PE, art, music)             │
│ ☐ With different adults                  │
│                                           │
│ 💡 Tip: More settings = better transfer! │
│                                           │
│ [← Back] [Next →]                        │
│                                           │
└──────────────────────────────────────────┘
```

**Research Note:** Fluency + generalization are critical for skill retention (Level 3-4 goals).

---

### Step 5: Add Maintenance

**Question:** "How long should the skill last?"

```
┌──────────────────────────────────────────┐
│ Step 5 of 5: Maintenance                 │
├──────────────────────────────────────────┤
│                                           │
│ Maintenance Period:                      │
│ How many weeks after mastery should we   │
│ check to ensure the skill sticks?        │
│                                           │
│ [Slider: 2-8 weeks] → 4 weeks           │
│                                           │
│ ✅ Research recommends 4+ weeks for      │
│    lasting behavior change!              │
│                                           │
│ Maintenance Check:                       │
│ "[Student] will maintain the behavior    │
│  for 4 weeks following mastery to ensure │
│  long-term retention."                   │
│                                           │
│ [← Back] [Generate Goal! →]             │
│                                           │
└──────────────────────────────────────────┘
```

**Smart Default:** 4 weeks (research-backed standard)

---

### Feature 2: **Goal Generation & Output**

**Generated Goal (Level 5 SMART):**

```
┌──────────────────────────────────────────┐
│ 🎉 Your IEP Behavior Goal                │
├──────────────────────────────────────────┤
│                                           │
│ By [Date: 3 months from today],          │
│ when in a structured classroom, small    │
│ group instruction, and independent work  │
│ time, and given verbal prompts,          │
│ [Student Name] will increase using kind  │
│ words with peers when upset in 90% of    │
│ opportunities for 3 consecutively        │
│ measured school days, initiating the     │
│ behavior within 5 seconds of peer        │
│ interaction, across 3 different school   │
│ settings, as measured by teacher         │
│ observation. Additionally, [Student]     │
│ will maintain the behavior for 4 weeks   │
│ following mastery to ensure long-term    │
│ retention.                               │
│                                           │
│ Baseline:                                │
│ [Student] currently uses kind words in   │
│ 40% of observed peer interactions,       │
│ takes an average of 15 seconds to        │
│ respond kindly when upset, and is        │
│ inconsistent across different settings.  │
│                                           │
│ ─────────────────────────────────────   │
│                                           │
│ Goal Level: ⭐⭐⭐⭐⭐ Level 5          │
│ (All research components included!)      │
│                                           │
│ ✅ Baseline data                         │
│ ✅ Fluency (5 seconds)                   │
│ ✅ High accuracy (90%)                   │
│ ✅ Generalization (3 settings)           │
│ ✅ Maintenance (4 weeks)                 │
│                                           │
│ [Copy Goal] [Download PDF] [Email Me]   │
│ [Start Over] [Refine Goal]              │
│                                           │
└──────────────────────────────────────────┘
```

---

### Feature 3: **Goal Customization & Editing**

**After generation, users can:**
1. **Edit any field** - Click to edit inline
2. **Change date** - IEP end date picker
3. **Adjust criteria** - Lower/raise target percentage
4. **Add prompts** - "Visual cues", "Peer modeling", etc.
5. **Change measurement** - Switch from % to frequency

**Editable Fields:**
```
By [📅 Edit Date], when in [⚙️ Edit Settings],  
and given [⚙️ Edit Prompts], [Student] will  
[⚙️ Edit Behavior] in [⚙️ Edit %] of opportunities...
```

---

### Feature 4: **Export Options**

#### 1. Copy to Clipboard
- One-click copy of full goal text
- Paste into IEP software

#### 2. Download PDF
- Professional formatting
- School letterhead option
- Includes:
  - Full goal
  - Baseline narrative
  - Data collection sheet template
  - Progress monitoring calendar

#### 3. Email Me
- **Email capture (optional):**
  ```
  Want this goal emailed to you?
  Email: [Input]
  
  ☐ Send me tips for writing better IEP goals
  ☐ Notify me when full IEP goal writer launches
  
  [Send Goal to Email]
  ```

---

### Feature 5: **Goal Library (Premium Feature)**

**For registered users:**
- Save generated goals
- Tag by student/school/year
- Search past goals
- Reuse templates
- Share with team

---

### Feature 6: **Progress Monitoring Template**

**Auto-generated data sheet:**

```
┌──────────────────────────────────────────┐
│ Data Collection Sheet                    │
├──────────────────────────────────────────┤
│                                           │
│ Student: _____________                   │
│ Goal: Using kind words with peers        │
│ Target: 90% of opportunities             │
│ Baseline: 40%                            │
│                                           │
│ Week 1: [Chart grid]                     │
│ M T W T F → % Achieved: ___             │
│                                           │
│ Week 2: [Chart grid]                     │
│ M T W T F → % Achieved: ___             │
│                                           │
│ ... (12 weeks)                           │
│                                           │
│ Mastery Criteria: 90% for 3 consecutive  │
│ days across 3 settings                   │
│                                           │
│ Maintenance Check (4 weeks post):        │
│ Week 1: ___ Week 2: ___ Week 3: ___     │
│                                           │
└──────────────────────────────────────────┘
```

---

## 🎨 User Interface Design

### Home Screen (Above the Fold)

```
┌──────────────────────────────────────────┐
│                                           │
│  Finally, IEP Behavior Goals That        │
│           Actually Work                   │
│                                           │
│  Stop struggling with vague goals.       │
│  Create research-backed IEP behavior     │
│  goals in under 5 minutes.               │
│                                           │
│  ✓ No Registration Required              │
│  ✓ Under 5 Minutes                       │
│  ✓ IEP Compliant                         │
│                                           │
│  [Start Free Goal Generator →]           │
│                                           │
└──────────────────────────────────────────┘
```

### Progress Indicator (During Wizard)

```
Steps: ①━━━━②━━━━③━━━━④━━━━⑤
       Values  Behavior  Baseline  Fluency  Maintain
```

### Mobile-First Design
- Large touch targets
- One question per screen
- Swipe to next step
- Auto-save progress (localStorage)

---

## 🗄️ Data Model

### Goal Templates (Firestore)

```javascript
goalTemplates: {
  id: "template-123",
  value: "Kind",
  behaviorType: "increase", // or "decrease"
  behavior: "using kind words with peers",
  baseline: 40,
  target: 90,
  measurement: "percentage",
  fluency: {
    enabled: true,
    seconds: 5,
    description: "within 5 seconds of peer interaction"
  },
  generalization: [
    "structured classroom",
    "small group instruction",
    "independent work time"
  ],
  maintenance: {
    weeks: 4,
    description: "4 weeks following mastery"
  },
  generatedGoal: "Full goal text...",
  createdAt: timestamp
}
```

### User Goals (For Registered Users)

```javascript
userGoals: {
  id: "goal-456",
  userId: "user-789",
  studentName: "Anonymous", // privacy
  templateId: "template-123",
  customizations: {
    date: "2026-05-30",
    prompts: "visual cues"
  },
  exported: true,
  exportedAt: timestamp,
  tags: ["grade-3", "kind", "peer-interactions"]
}
```

---

## 🚀 Development Phases

### Phase 1: MVP (2-3 weeks)
**Goal:** Functional goal generator (free, no login)

**Features:**
1. 5-step Values Wizard
2. Goal generation (text output)
3. Copy to clipboard
4. Download PDF (basic)
5. Email capture (optional)

**Tech Stack:**
- Next.js 14
- Tailwind CSS
- jsPDF (PDF generation)
- localStorage (progress save)

**Deliverable:** Working tool on BehaviorSchool.com

---

### Phase 2: Advanced Features (1-2 weeks)

**Features:**
1. Goal editing (inline)
2. Data collection sheet generator
3. Professional PDF (with branding)
4. Improved UX (animations, validation)

**Deliverable:** Polished, production-ready tool

---

### Phase 3: Premium Features (2-3 weeks)

**Features:**
1. User accounts (Supabase Auth)
2. Goal library (save/search)
3. Team sharing
4. Analytics (track popular values/behaviors)
5. Integration with Supervision Platform

**Deliverable:** Premium tier for BCBAs

---

### Phase 4: Full IEP Goal Writer (4-6 weeks)

**Expansion beyond behavior goals:**
1. Academic goals (reading, math, writing)
2. Social/communication goals
3. Adaptive/life skills goals
4. Transition goals

**Deliverable:** Complete IEP goal suite

---

## 💰 Monetization Strategy

### Free Tier (Lead Generation)
- Unlimited behavior goals
- Copy/download
- Basic PDF export
- Email capture required for PDF

**Goal:** 1,000+ email captures/month

---

### Premium Tier ($19/month)
- Goal library (save unlimited)
- Advanced editing
- Team collaboration
- Custom templates
- No watermarks
- Priority support

**Target:** Individual BCBAs/teachers

---

### School License ($299/year)
- Unlimited users
- School branding
- Shared goal library
- Admin analytics
- Training materials
- API access (future)

**Target:** School districts

---

## 📊 Success Metrics

### User Engagement:
- Goals generated per day
- Completion rate (start → finish)
- Time to complete (target: < 5 min)
- Return usage rate

### Conversion:
- Email capture rate (free users)
- Free → Premium conversion
- Premium → School license

### Quality:
- Goal level distribution (% Level 5)
- User ratings/feedback
- PDF downloads

---

## 🛠️ Technical Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)

**Backend:**
- Firestore (templates, user goals)
- Supabase Auth (premium users)
- Vercel (hosting - free tier)

**Integrations:**
- jsPDF (PDF generation)
- Kit.com API (email capture)
- Analytics (Plausible or Umami)

---

## 📅 Timeline

**Total Development Time:** 6-10 weeks (1.5-2.5 months)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: MVP | 2-3 weeks | Functional tool (free) |
| Phase 2: Advanced | 1-2 weeks | Polished UX |
| Phase 3: Premium | 2-3 weeks | User accounts, library |
| Phase 4: Full Suite | 4-6 weeks | All goal types |

**Launch Target:** Q1 2026 (February-March)  
**MVP Launch:** ASAP (for CalABA March 5-7)

---

## 🎯 Next Steps

1. **Review PRD** with Rob
2. **Design mockups** (Figma optional)
3. **Build Phase 1 MVP** (2-3 weeks)
4. **Deploy to BehaviorSchool.com**
5. **Deploy to KCUSD (Level 3 demo)**
6. **Beta test** with 10-20 teachers
7. **Launch publicly** before CalABA

---

## ❓ Questions for Rob

1. Should MVP launch before CalABA (March 5-7)?
2. KCUSD Level 3 demo - same tool or simplified version?
3. Email capture required or optional for free tier?
4. Do you have example goals to use as templates?
5. Should students be able to use the tool directly?
6. Integration with existing KCUSD auth system?

---

**Created:** January 30, 2026  
**Last Updated:** January 30, 2026  
**Owner:** Rob Spain, Neo (AI Assistant)

---

## 📸 Wireframe Reference

Based on BehaviorSchool.com/iep-goals landing page:
- Level 1-5 goal progression (visual chart)
- Values Wizard concept (student-centered)
- Research citations (Cooper, Stokes & Baer, Kubina, Pitts)
- "Meet the Creator" section (Rob's credibility)

**Key Messaging:**
> "When we start with what matters to students — their own values like being brave, kind, or helpful — everything changes. The goals become meaningful, and students become invested in their own growth."

— Rob Spain, M.S., BCBA, IBA
