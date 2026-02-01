# PRD: ACT Interactive Tools
**Product Requirements Document**  
**Project:** Web-Based ACT Tools for BehaviorSchool.com & KCUSD  
**Date:** January 30, 2026  
**Owner:** Rob Spain  

---

## 🎯 Product Vision

Build interactive web-based tools for Acceptance and Commitment Training (ACT) that replace static PDFs/Google Docs with engaging, user-friendly interfaces for:

1. **Metaphor Creator** - Generate and customize ACT metaphors for students
2. **Values Card Sort** - Interactive digital card sorting for identifying student values

**Use Cases:**
- School BCBAs working with students
- Teachers conducting ACT interventions
- Parents supporting their children
- Students doing self-guided values work

**Deployment:**
- Primary: **BehaviorSchool.com** (public-facing, lead generation)
- Secondary: **KCUSD Behavior Team site** (internal use)

---

## 🧩 Tool #1: ACT Metaphor Creator

### Purpose
Generate age-appropriate, values-aligned ACT metaphors to help students:
- Understand psychological flexibility concepts
- Practice defusion from unhelpful thoughts
- Connect with present-moment awareness
- Clarify and commit to values

### User Stories

**As a BCBA**, I can:
- Select student age/grade level
- Choose ACT process (defusion, acceptance, values, etc.)
- Generate metaphor examples from library
- Customize metaphor to student's interests
- Save/print metaphor for session use
- Track which metaphors work well

**As a student**, I can:
- Explore metaphors visually (interactive graphics)
- Answer reflection questions
- Save "my metaphors" for later
- Share metaphors with parents/teachers

---

### Core Features

#### 1. **Metaphor Library** (Based on KCUSD Examples)

**ACT Processes Covered:**
1. **Defusion** - Separating from thoughts
   - Leaves on a Stream
   - Passengers on the Bus
   - Clouds in the Sky
   - Movie Theater
   
2. **Acceptance** - Making room for feelings
   - Tug of War with a Monster
   - Quicksand
   - Beach Ball Underwater
   
3. **Present Moment** - Mindfulness
   - 5-4-3-2-1 Grounding
   - Mindful Eating (Raisin Exercise)
   - Body Scan
   
4. **Values** - What matters most
   - Values Compass
   - Life as a Garden
   - Climbing Your Mountain
   
5. **Committed Action** - Values-based behavior
   - Bus Driver
   - Planting Seeds
   - Building Your House

**Metaphor Structure:**
```javascript
{
  id: "leaves-on-stream",
  title: "Leaves on a Stream",
  actProcess: "defusion",
  gradeLevel: ["3-5", "6-8"],
  framework: "AIM", // or "DNA-V" or "general"
  
  setup: "Imagine sitting by a peaceful stream...",
  
  instructions: [
    "Close your eyes and picture...",
    "When a thought comes up...",
    "Watch the leaf float away..."
  ],
  
  reflection: [
    "What thoughts showed up?",
    "Was it hard to let them float by?",
    "How did it feel to watch without grabbing?"
  ],
  
  adaptations: {
    younger: "Use real leaves in water bowl",
    older: "Write thoughts on paper leaves",
    visual: "Draw stream on paper"
  },
  
  keywords: ["thoughts", "mindfulness", "observation"],
  source: "ACT Made Simple (adapted)",
  trustScore: 1.0
}
```

---

#### 2. **Metaphor Generator**

**Input Form:**
```
Student Age/Grade: [Dropdown: K-2, 3-5, 6-8, 9-12]

ACT Process: [Dropdown]
- Defusion (separating from thoughts)
- Acceptance (making room for feelings)
- Present Moment (mindfulness)
- Values (what matters)
- Committed Action (values-based behavior)

Student Interests (optional): [Tags]
- Sports
- Video Games
- Animals
- Music
- Art
- Nature

Framework Preference: [Dropdown: AIM | DNA-V | General]

[Generate Metaphor Button]
```

**Output:**
- 2-3 metaphor suggestions (from library)
- Full metaphor text
- Instructions for delivery
- Reflection questions
- Adaptations for different learning styles

**Customization:**
- Edit metaphor text inline
- Add student's specific interests (e.g., "Imagine you're playing Minecraft...")
- Save customized version

---

#### 3. **Interactive Metaphor Experience**

**Visual Components:**

**Example: "Leaves on a Stream" Interactive**
```
┌─────────────────────────────────────┐
│   🍃 Leaves on a Stream            │
├─────────────────────────────────────┤
│                                      │
│   [Animated stream flowing]         │
│                                      │
│   Type a thought:                   │
│   [Text Input] → [Add to Leaf] btn  │
│                                      │
│   🍂 "I'm bad at math" (floating)   │
│   🍂 "Nobody likes me" (floating)   │
│                                      │
│   [Watch them float away...]        │
│                                      │
└─────────────────────────────────────┘
```

**Animations:**
- Leaves (or clouds/buses) move across screen
- Students can "release" thoughts visually
- Sound effects (optional, calming)

---

#### 4. **Metaphor Session Tracker** (Optional Premium Feature)

**For BCBAs/Teachers:**
- Log which metaphors used with which students
- Rate effectiveness (1-5 stars)
- Add notes ("Student really connected with Passengers on Bus")
- Track student progress over time

---

### User Interface

#### Metaphor Creator Dashboard

```
┌──────────────────────────────────────────────┐
│ ACT Metaphor Creator                         │
├──────────────────────────────────────────────┤
│                                               │
│ Student Profile                               │
│ Grade Level: [6-8] Age: [12]                 │
│ Interests: [Sports] [Video Games]            │
│                                               │
│ What are you working on today?               │
│ ○ Dealing with negative thoughts (Defusion) │
│ ○ Managing big feelings (Acceptance)        │
│ ○ Staying focused (Present Moment)          │
│ ○ Knowing what matters (Values)             │
│ ○ Taking action (Committed Action)          │
│                                               │
│ [Find Metaphors] button                      │
│                                               │
│ ─────────────────────────────────────────   │
│                                               │
│ Suggested Metaphors (3):                     │
│                                               │
│ 🚌 Passengers on the Bus                    │
│ Perfect for middle schoolers who feel        │
│ controlled by their thoughts.                │
│ [Use This] [Preview] [Customize]            │
│                                               │
│ 🍃 Leaves on a Stream                       │
│ Great for visual learners. Calm & gentle.   │
│ [Use This] [Preview] [Customize]            │
│                                               │
│ ☁️ Clouds in the Sky                        │
│ Similar to leaves, works outdoors.          │
│ [Use This] [Preview] [Customize]            │
│                                               │
└──────────────────────────────────────────────┘
```

#### Interactive Metaphor View

```
┌──────────────────────────────────────────────┐
│ 🚌 Passengers on the Bus                    │
├──────────────────────────────────────────────┤
│                                               │
│ [Interactive Bus Graphic]                    │
│                                               │
│ You're the driver 🧑‍✈️ Heading toward:      │
│ [Student types value: "Being a good friend"]│
│                                               │
│ Your passengers (thoughts/feelings):         │
│ [+ Add Passenger]                            │
│                                               │
│ 😠 "You're going to fail"                   │
│ 😰 "Everyone will laugh at you"             │
│ 😔 "Just give up"                           │
│                                               │
│ These passengers are LOUD, but you're       │
│ still the driver. Keep going toward         │
│ "Being a good friend."                      │
│                                               │
│ Reflection:                                  │
│ • Can you hear the passengers but still     │
│   drive toward your goal?                   │
│ • What happens if you listen to them?       │
│                                               │
│ [Save Metaphor] [Print] [Share]             │
│                                               │
└──────────────────────────────────────────────┘
```

---

## 🃏 Tool #2: Interactive Values Card Sort

### Purpose
Replace static PDF "Values Sort" with dynamic, engaging web tool that helps students:
- Identify their core values
- Prioritize what matters most
- Connect values to goals/behaviors
- Track values alignment over time

### User Stories

**As a student**, I can:
- Drag and drop value cards into categories
- See definitions/examples for each value
- Narrow down to my top 3-5 values
- Explain why each value matters to me
- Save my values for later reference

**As a BCBA/teacher**, I can:
- Use tool during student interviews
- Print student's values results
- Compare values over time (change tracking)
- Connect values to IEP goals

---

### Core Features

#### 1. **Values Card Library**

**Categories:**
- **Relationships** - Being kind, helpful, loyal, respectful
- **Personal Growth** - Being brave, curious, creative, independent
- **School/Learning** - Being focused, responsible, hard-working, organized
- **Character** - Being honest, fair, patient, forgiving
- **Well-Being** - Being healthy, calm, happy, safe

**Full Values List (40-50 values):**
```javascript
[
  { id: 1, value: "Kind", definition: "Caring about others and their feelings", category: "relationships", emoji: "💛" },
  { id: 2, value: "Brave", definition: "Facing fears and trying new things", category: "growth", emoji: "🦁" },
  { id: 3, value: "Honest", definition: "Telling the truth even when it's hard", category: "character", emoji: "🤝" },
  { id: 4, value: "Focused", definition: "Paying attention to what matters", category: "school", emoji: "🎯" },
  { id: 5, value: "Helpful", definition: "Supporting others when they need it", category: "relationships", emoji: "🤗" },
  // ... 45 more values
]
```

**Age-Appropriate Versions:**
- **K-2:** 20 values with pictures/emojis
- **3-5:** 30 values with simple definitions
- **6-8:** 40 values with detailed explanations
- **9-12:** 50 values with real-world examples

---

#### 2. **Card Sorting Interface**

**Layout:**
```
┌──────────────────────────────────────────────┐
│ Values Card Sort                              │
├──────────────────────────────────────────────┤
│                                               │
│ All Values (40 cards)                        │
│ ┌─────────────────────────────────────┐     │
│ │ 💛 Kind  🦁 Brave  🤝 Honest         │     │
│ │ 🎯 Focused  🤗 Helpful  🌟 Creative  │     │
│ │ [... drag cards below ...]           │     │
│ └─────────────────────────────────────┘     │
│                                               │
│ Sort them into these piles:                  │
│                                               │
│ ┌─────────────┬─────────────┬─────────────┐│
│ │ Not Me      │ Sometimes   │ Very Me     ││
│ │             │             │             ││
│ │ [Drop zone] │ [Drop zone] │ [Drop zone] ││
│ │             │             │             ││
│ └─────────────┴─────────────┴─────────────┘│
│                                               │
│ [Next: Pick Top 5] button                    │
│                                               │
└──────────────────────────────────────────────┘
```

**Interactions:**
- **Drag & Drop** - Move cards between piles
- **Click for Definition** - Tap any card to see full explanation
- **Filter by Category** - Show only relationship values, etc.

---

#### 3. **Top Values Selection**

**After initial sort:**
```
┌──────────────────────────────────────────────┐
│ Your "Very Me" Values (12 cards)             │
├──────────────────────────────────────────────┤
│                                               │
│ Now pick your TOP 5 values - the ones that  │
│ matter MOST to you right now.                │
│                                               │
│ 1. [Drag card here] _______________          │
│ 2. [Drag card here] _______________          │
│ 3. [Drag card here] _______________          │
│ 4. [Drag card here] _______________          │
│ 5. [Drag card here] _______________          │
│                                               │
│ Available Cards:                             │
│ 💛 Kind  🦁 Brave  🤝 Honest                 │
│ 🎯 Focused  🤗 Helpful  🌟 Creative          │
│ ... 6 more ...                               │
│                                               │
│ [Next: Tell Me More] button                  │
│                                               │
└──────────────────────────────────────────────┘
```

---

#### 4. **Values Reflection**

**For each top value:**
```
┌──────────────────────────────────────────────┐
│ 💛 Kind                                      │
├──────────────────────────────────────────────┤
│                                               │
│ You picked "Kind" as one of your top values. │
│                                               │
│ Tell me more:                                │
│                                               │
│ Why is being kind important to you?          │
│ [Text area]                                  │
│                                               │
│ When do you act kind?                        │
│ [Text area]                                  │
│                                               │
│ When is it hard to be kind?                  │
│ [Text area]                                  │
│                                               │
│ [Next Value →]                               │
│                                               │
└──────────────────────────────────────────────┘
```

---

#### 5. **Values Summary & Export**

**Final Output:**
```
┌──────────────────────────────────────────────┐
│ Your Top 5 Values                            │
├──────────────────────────────────────────────┤
│                                               │
│ 1. 💛 Kind                                   │
│    "Being kind makes me feel good and helps  │
│     others. It's hard when I'm angry."       │
│                                               │
│ 2. 🦁 Brave                                  │
│    "I want to try new things even when I'm   │
│     scared. It helps me learn."              │
│                                               │
│ 3. 🤝 Honest                                 │
│    "Telling the truth builds trust. It's     │
│     hard when I might get in trouble."       │
│                                               │
│ 4. 🎯 Focused                                │
│    "Paying attention helps me learn better.  │
│     It's hard when I'm bored."               │
│                                               │
│ 5. 🤗 Helpful                                │
│    "Helping others makes them happy and me   │
│     too. Sometimes I'm too busy."            │
│                                               │
│ [Download PDF] [Share with Teacher] [Save]  │
│                                               │
└──────────────────────────────────────────────┘
```

**Export Options:**
- **PDF** - Printable summary (for binder/notes)
- **Share Link** - Send to parent/teacher
- **Save to Account** - Store in student profile
- **Compare Over Time** - See how values change

---

#### 6. **Values-to-Goals Connector**

**Next Step: Connect Values to Actions**
```
┌──────────────────────────────────────────────┐
│ Values → Goals                               │
├──────────────────────────────────────────────┤
│                                               │
│ Your value: 💛 Kind                          │
│                                               │
│ What's one thing you could do THIS WEEK      │
│ to be more kind?                             │
│                                               │
│ Goal: [Text input]                           │
│ Example: "Help someone with homework"        │
│                                               │
│ How will you know you did it?                │
│ [Text input]                                 │
│                                               │
│ [Add Goal] → [Next Value]                    │
│                                               │
└──────────────────────────────────────────────┘
```

**Connects to IEP Goal Writer:**
- If student picks "Focused" as value →
- Suggest IEP goal: "Increase on-task behavior to align with value of being focused"

---

## 🗄️ Data Model

### Metaphors Collection (Firestore)

```javascript
metaphors: {
  id: "leaves-on-stream",
  title: "Leaves on a Stream",
  actProcess: "defusion",
  gradeLevel: ["3-5", "6-8"],
  framework: "AIM",
  setup: "...",
  instructions: [...],
  reflection: [...],
  adaptations: {...},
  keywords: [...],
  source: "ACT Made Simple",
  trustScore: 1.0,
  usageCount: 0, // Track popularity
  rating: 4.8 // Average user rating
}
```

### Values Collection

```javascript
values: {
  id: 1,
  value: "Kind",
  definition: "Caring about others and their feelings",
  category: "relationships",
  emoji: "💛",
  ageAppropriate: ["K-2", "3-5", "6-8", "9-12"],
  examples: [
    "Helping a friend who is sad",
    "Sharing with others",
    "Using kind words"
  ],
  relatedGoals: [
    "Increase prosocial behavior",
    "Reduce aggressive language"
  ]
}
```

### User Sessions (Student Results)

```javascript
valueSortSessions: {
  id: "session-123",
  studentId: "student-456",
  bcbaId: "bcba-789",
  date: "2026-01-30",
  topValues: [
    { id: 1, value: "Kind", rank: 1, reflection: "..." },
    { id: 2, value: "Brave", rank: 2, reflection: "..." }
  ],
  goals: [
    { value: "Kind", goal: "Help someone with homework", measure: "At least once this week" }
  ],
  exportedPDF: "url-to-pdf"
}
```

---

## 🎨 Design Mockups

### Metaphor Creator - Mobile First

**Home Screen:**
- Large, friendly icons for each ACT process
- Simple language ("Help with Negative Thoughts")
- Bright, calming colors (blues/greens)

**Metaphor View:**
- Full-screen interactive experience
- Animations (leaves floating, clouds moving)
- Minimal text, maximum visual engagement

### Values Card Sort - Gamified

**Card Design:**
- Large emoji + value word
- Flip card to see definition
- Color-coded by category

**Sorting Animation:**
- Smooth drag-and-drop
- Celebrate when top 5 selected (confetti!)
- Progress bar (Step 1 of 3)

---

## 🚀 Development Phases

### Phase 1: Metaphor Creator MVP (3-4 weeks)

**Features:**
1. Metaphor library (10-15 metaphors)
2. Basic filter (age, ACT process)
3. Static metaphor display (text only)
4. Print/save functionality

**Tech Stack:**
- Next.js (frontend)
- Firestore (metaphor storage)
- Tailwind CSS (UI)
- Vercel (hosting)

**Deliverable:** Functional metaphor library + generator

---

### Phase 2: Interactive Metaphors (2-3 weeks)

**Features:**
1. Animated metaphor experiences
2. Student input fields (add thoughts to leaves)
3. Save/track used metaphors
4. Simple analytics (usage tracking)

**Libraries:**
- Framer Motion (animations)
- React DnD (drag & drop)

**Deliverable:** Engaging interactive metaphors

---

### Phase 3: Values Card Sort (3-4 weeks)

**Features:**
1. Full values library (40-50 values)
2. Drag-and-drop sorting
3. Top 5 selection
4. Reflection prompts
5. PDF export

**Deliverable:** Complete values card sort tool

---

### Phase 4: Advanced Features (2-3 weeks)

**Features:**
1. User accounts (save results)
2. Progress tracking (values over time)
3. Values-to-goals connector
4. Integration with IEP Goal Writer
5. Sharing with parents/teachers

**Deliverable:** Premium features for BCBAs

---

## 💰 Monetization Strategy

### Free Tier (Lead Generation)
- Access to basic metaphor library
- 1 values card sort session (no save)
- Limited to 3 metaphor views/month
- Watermarked PDFs

**Goal:** Capture emails, demonstrate value

### Premium Tier ($19/month)
- Unlimited metaphor access
- Unlimited values card sorts
- Save/track student progress
- No watermarks
- Advanced analytics
- Print-friendly exports

**Target:** Individual BCBAs/teachers

### School/District License ($299/year)
- Unlimited users
- Shared metaphor library (custom uploads)
- Aggregate analytics across students
- Training materials
- Priority support

**Target:** School districts, universities

---

## 📊 Success Metrics

### User Engagement:
- Metaphors generated per week
- Values card sorts completed
- Return usage rate
- Time spent in tools

### Conversion:
- Email capture rate (free → lead)
- Free → Premium conversion
- Premium → School license upsells

### Quality:
- Metaphor ratings (user feedback)
- Values sort completion rate
- PDF downloads

---

## 🛠️ Technical Stack

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- React DnD (drag & drop)

**Backend:**
- Firestore (data storage)
- Supabase Auth (user accounts)
- Vercel (hosting - free tier)

**Integrations:**
- jsPDF (PDF generation)
- Kit.com (email capture)
- IEP Goal Writer (values → goals)

---

## 📅 Timeline

**Total Development Time:** 10-14 weeks (2.5-3.5 months)

| Phase | Duration | Deliverable |
|-------|----------|-------------|
| Phase 1: Metaphor Creator MVP | 3-4 weeks | Basic library + generator |
| Phase 2: Interactive Metaphors | 2-3 weeks | Animated experiences |
| Phase 3: Values Card Sort | 3-4 weeks | Complete sorting tool |
| Phase 4: Advanced Features | 2-3 weeks | Premium functionality |

**Launch Target:** Q2 2026 (April-May)

---

## 🎯 Next Steps

1. **Review PRD** with Rob
2. **Design mockups** (Figma)
3. **Extract metaphor content** from KCUSD Google Docs
4. **Set up Firestore collections**
5. **Build Phase 1** (Metaphor Creator MVP)
6. **Beta test** with 5-10 BCBAs
7. **Iterate** based on feedback
8. **Launch publicly**

---

## ❓ Questions for Rob

1. Should we start with Metaphor Creator or Values Card Sort first?
2. Do you have PDFs/docs with more metaphors to extract?
3. Pricing: $19/month sound right for individual BCBAs?
4. Should KCUSD version be identical or simplified?
5. Do you want students to have accounts, or anonymous use?

---

**Created:** January 30, 2026  
**Last Updated:** January 30, 2026  
**Owner:** Rob Spain, Neo (AI Assistant)
