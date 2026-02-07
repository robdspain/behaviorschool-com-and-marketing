# CALABA 2026 Symposium - Import Guide

**Presentation:** Beyond Observable Behavior: Measuring and Modifying the Function of Thought  
**Event:** CALABA 2026, Saturday March 7, 2:55-3:55 PM, Sacramento  
**Slides:** 47  
**Template:** Corporate (deep blue/navy, professional academic)  

---

## 🚀 Quick Import (2 minutes)

### Step 1: Set Supabase Credentials

Create `.env.local` in repo root:

```bash
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing

# Create .env.local file
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
EOF
```

**Get these from:** https://supabase.com/dashboard → Your Project → Settings → API

### Step 2: Run Import

```bash
npx tsx scripts/import-calaba-presentation.ts
```

### Step 3: Access

Go to: **https://behaviorschool.com/admin/presentations** → Library tab

---

## 📊 Presentation Content (47 Slides)

### Introduction (Slides 1-3)
1. Title slide with CALABA branding
2. Session overview and abstract
3. Symposium structure (4 papers)

### Paper 1: The Assessment Phase — Rob Spain (Slides 4-11)
**Topic:** Clinical Application of Precursor FA

- Traditional FBA limitations
- Latency-based functional analysis methodology
- Measuring private events through observable precursors
- Case example: Middle school student (internal dialogue)
- Assessment protocol (4-step process)
- Data collection (quantitative + qualitative)
- Key findings: 67% of severe cases show internal mediation
- Implications for practice

### Paper 2: The Intervention Phase — Cristal Lopez (Slides 12-20)
**Topic:** Values-Based Programming & ACT Integration

- From assessment to intervention
- What is ACT? (6 core processes)
- ACT-informed BIP components
- Integrating ACT into IEP goals
- Values-based goal setting process
- Case example: Elementary student with work refusal
- Psychological flexibility as target behavior
- Practical BIP strategies (acceptance, defusion, committed action)
- Integration with PBIS/MTSS

### Paper 3: Implementation & Fidelity — Megan Caluza (Slides 21-30)
**Topic:** Systems of Support for Staff Training

- Implementation challenges and barriers
- Multi-tiered implementation system
- Behavioral Skills Training (BST) model
- Initial training content (4 modules)
- Ongoing coaching structure (weekly cycle)
- Implementation fidelity measures
- Scaling across classrooms (3-phase approach)
- Supporting staff buy-in
- Case example: 4th grade team (45% → 88% fidelity)
- Lessons learned

### Paper 4: Outcomes & Social Validity — Rob Spain (Slides 31-40)
**Topic:** Evaluating the Model

- Research questions (4: effectiveness, efficiency, validity, scalability)
- Student outcome data (42 students, 16 weeks)
- **Behavioral outcomes:**
  - ODRs: 77% reduction
  - Disruptions: 76% reduction
  - Crisis: 83% reduction
  - Effect size: d = 1.24 (large)
- **Academic engagement:** 34% → 71% (vs. control 38% → 56%)
- Social-emotional growth (self-regulation, psychological flexibility)
- **Staff social validity:** 4.5/5 overall satisfaction
- **Student/family perspectives:** 89% say strategies help
- **Cost-effectiveness:** 4:1 ROI ($4.30 saved per $1 invested)
- Replication across 6 diverse settings (urban, rural, alternative ed, etc.)
- Limitations and future research directions

### Closing (Slides 41-43)
- Key takeaways (6 major points)
- Discussion questions
- Resources and contact info
- Thank you slide

---

## 🎨 Visual Design

**Template:** Corporate
- Deep blue/navy color scheme
- Professional academic styling
- High contrast for conference room readability
- Clean metrics displays
- Data-heavy slides well formatted

**Layouts used:**
- `title-only`: Opening slides, section breaks
- `text`: Most content slides
- `two-column`: Complex comparisons
- `metrics-3`: Data outcome slides (3-column stats)

---

## 🎯 How to Present

### Before the Symposium
1. Import the presentation (run script above)
2. Test at behaviorschool.com/admin/presentations
3. Export PPTX backup to USB drive
4. Coordinate timing with Cristal and Megan

### Day of Presentation
1. Log in to admin panel
2. Click "Library" → "Beyond Observable Behavior"
3. Click "Present" button
4. Press `F` for fullscreen
5. Navigate with arrow keys (← →)

### Timing (60 minutes total)
- Introduction: 5 min
- Paper 1 (Rob): 12 min
- Paper 2 (Cristal): 12 min
- Paper 3 (Megan): 12 min
- Paper 4 (Rob): 12 min
- Discussion/Q&A: 7 min

---

## 📥 Export Options

### PowerPoint Backup
1. Click "Download" → "PPTX"
2. Save to USB drive
3. Test on presentation laptop

### PDF for Handouts
1. Click "Download" → "PDF"
2. Or export PPTX then "Save as PDF" from PowerPoint

---

## 🔧 After Import

Once imported, you can:
- **Edit slides** - Click slide to open rich text editor
- **Reorder** - Drag & drop in editor
- **Add slides** - Click "+ Add Slide"
- **Change colors** - Settings → Template → Choose new template
- **Add images** - Upload or AI generate
- **Create charts** - Bar, line, pie, doughnut

All changes auto-save to Supabase.

---

## 📞 Troubleshooting

**"Missing Supabase credentials"**  
→ Check .env.local has both URL and SERVICE_ROLE_KEY

**"Presentation doesn't appear in Library"**  
→ Verify you're logged in as admin  
→ Check Supabase Storage has `presentations` bucket  
→ Check `presentations_ai` table exists

**"Permission denied" on import**  
→ Run: `chmod +x scripts/import-calaba-presentation.ts`

---

## ✅ Success Criteria

After import, you should have:
- ✅ "Beyond Observable Behavior" in Library tab
- ✅ 47 slides loaded
- ✅ Corporate template applied
- ✅ Presentation mode works (fullscreen, navigation)
- ✅ Can export as PPTX/PDF
- ✅ Ready for March 7, 2026 symposium

---

**Script:** `scripts/import-calaba-presentation.ts`  
**Admin Panel:** https://behaviorschool.com/admin/presentations  
**Presenters:** Rob Spain, Cristal Lopez, Megan Caluza
