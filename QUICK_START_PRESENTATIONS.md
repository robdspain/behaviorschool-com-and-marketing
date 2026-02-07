# Quick Start: Import Conference Presentations

## 🎯 Goal
Get Rob's two conference presentations loaded into the Presenton system in 5 minutes.

## ⚡ Super Quick Version

```bash
# 1. Create .env.local with your Supabase credentials (see below)
# 2. Run this:
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing
./scripts/import-all-presentations.sh
```

Done! Both presentations will be at https://behaviorschool.com/admin/presentations

---

## 📝 Step-by-Step (First Time)

### Step 1: Get Supabase Credentials (2 min)

1. Open: https://supabase.com/dashboard
2. Click on your **behaviorschool** project
3. Go to **Settings** (gear icon) → **API**
4. Copy two things:
   - **Project URL** (looks like: `https://abcdefg.supabase.co`)
   - **service_role** secret key (click "Reveal" then copy the long key)

### Step 2: Create Environment File (1 min)

Create a file called `.env.local` in the repo root:

```bash
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-paste-here
EOF
```

Replace with your actual values from Step 1.

### Step 3: Run Import (2 min)

```bash
./scripts/import-all-presentations.sh
```

Watch for success messages and presentation IDs.

### Step 4: Access Presentations

Go to: https://behaviorschool.com/admin/presentations

Click the **Library** tab - both presentations should be there!

---

## 🎬 Using the Presentations

### To Present

1. Click **Present** button on any presentation
2. Press **F** for fullscreen
3. Use **arrow keys** to navigate
4. Press **Esc** to exit

### To Edit

1. Click the presentation name to open editor
2. Edit any slide content
3. Drag to reorder slides
4. Changes auto-save

### To Download

1. Click **Download** → **PPTX** for PowerPoint backup
2. Or **PDF** for handouts

---

## 📋 What You're Getting

### PBIS Conference (32 slides)
- Template: Modern (emerald/teal)
- Presenters: Megan, Rob, Holly, Katie
- Interactive polls and discussion prompts
- Ready for CA-PBIS Conference 2025

### CALABA Symposium (47 slides)
- Template: Corporate (deep blue/navy)
- 4 research papers with data
- Presenters: Rob, Cristal, Megan
- March 7, 2026, 2:55-3:55 PM

---

## ❓ Troubleshooting

**"Missing Supabase credentials"**
→ Double-check .env.local has both URL and service key

**"Presentations don't appear in Library"**
→ Make sure you're logged in as admin at behaviorschool.com/admin

**"Import script won't run"**
→ Make it executable: `chmod +x scripts/import-all-presentations.sh`

---

## 🆘 Need Help?

See the full guide: `PRESENTATION_IMPORT_README.md`

Or just ask Rob to ping the team - we've got this documented!
