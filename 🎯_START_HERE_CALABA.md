# 🎯 CALABA 2026 Symposium — START HERE

**Presentation:** Beyond Observable Behavior: Measuring and Modifying the Function of Thought  
**Event:** Saturday, March 7, 2026, 2:55-3:55 PM, Sacramento  
**Slides:** 47 complete slides, ready to import  

---

## ✅ What's Done

Your **CALABA symposium presentation is complete** with all 4 papers:

1. **Paper 1 (Rob):** The Assessment Phase — Latency-based FA
2. **Paper 2 (Cristal):** The Intervention Phase — ACT-informed BIPs  
3. **Paper 3 (Megan):** Implementation & Fidelity — Staff training
4. **Paper 4 (Rob):** Outcomes & Social Validity — Data results

All 47 slides are written and ready to load into your Presenton system.

---

## 🚀 Import in 2 Minutes

### Step 1: Get Supabase Credentials

1. Go to: https://supabase.com/dashboard
2. Open your **behaviorschool** project
3. Click **Settings** (gear icon) → **API**
4. Copy these two values:
   - **Project URL** (starts with `https://`)
   - **service_role** key (click "Reveal", then copy)

### Step 2: Create .env.local File

Open Terminal and run:

```bash
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing

cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=PASTE_YOUR_PROJECT_URL_HERE
SUPABASE_SERVICE_ROLE_KEY=PASTE_YOUR_SERVICE_KEY_HERE
EOF
```

**Replace** the placeholder text with your actual Supabase values.

### Step 3: Run Import

```bash
./scripts/import-calaba-only.sh
```

Wait ~30 seconds. You'll see a success message with URLs.

### Step 4: Access Presentation

1. Go to: https://behaviorschool.com/admin/presentations
2. Click the **Library** tab
3. Find **"Beyond Observable Behavior"**
4. Click **Present** to enter fullscreen mode

---

## 🎨 What You're Getting

**47 slides** organized as:
- **Intro** (3 slides): Title, overview, structure
- **Paper 1** (8 slides): Assessment methods and FA
- **Paper 2** (9 slides): ACT intervention strategies
- **Paper 3** (10 slides): Implementation & fidelity
- **Paper 4** (10 slides): Outcome data & ROI
- **Closing** (4 slides): Takeaways, Q&A, resources, thanks

**Template:** Corporate (deep blue/navy, professional academic)

**Key Data Included:**
- ✅ 77% reduction in office referrals
- ✅ 76% reduction in disruptions
- ✅ 34% → 71% academic engagement
- ✅ 4:1 return on investment
- ✅ Replicated across 6 settings

---

## 🎯 Presenting at CALABA

### Before March 7
- [x] Presentation built (done!)
- [ ] Run import script (you do this)
- [ ] Test in Present mode
- [ ] Export PPTX backup to USB
- [ ] Coordinate with Cristal & Megan on timing

### Day of Symposium
1. Log in to **behaviorschool.com/admin/presentations**
2. Click **Library** → **"Beyond Observable Behavior"**
3. Click **Present**
4. Press **F** for fullscreen
5. Use **arrow keys** to navigate

### Keyboard Shortcuts
- `→` Next slide
- `←` Previous slide
- `F` Fullscreen
- `Esc` Exit

---

## 📥 Backup Options

### PowerPoint Export
1. In Library, click **Download** → **PPTX**
2. Save to USB drive
3. Test on presentation laptop before event

### PDF Export
1. Click **Download** → **PDF**
2. Good for handouts or sharing

---

## ⏱️ Suggested Timing (60 min)

- **0:00-0:05** — Introduction & overview (5 min)
- **0:05-0:17** — Paper 1: Assessment (Rob, 12 min)
- **0:17-0:29** — Paper 2: Intervention (Cristal, 12 min)
- **0:29-0:41** — Paper 3: Implementation (Megan, 12 min)
- **0:41-0:53** — Paper 4: Outcomes (Rob, 12 min)
- **0:53-1:00** — Discussion & Q&A (7 min)

---

## 📞 Need Help?

**Documentation:**
- Quick guide: `CALABA_2026_IMPORT.md`
- Full details: `PRESENTATION_IMPORT_README.md`

**Scripts:**
- Import: `scripts/import-calaba-presentation.ts`
- Automation: `scripts/import-calaba-only.sh`

**Admin Panel:**
- https://behaviorschool.com/admin/presentations

---

## ✅ You're Ready!

The presentation is complete. Just run the import script and you'll have a professional 47-slide symposium deck ready for CALABA 2026.

**Good luck! 🎉**
