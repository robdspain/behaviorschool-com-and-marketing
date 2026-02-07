# Conference Presentations Import Guide

This guide explains how to import and use Rob's two conference presentations in the Presenton system.

## 📊 What's Being Imported

### 1. PBIS Conference Presentation
**Title:** BCBAs in PBIS: Maximizing Behavioral Expertise in School Systems  
**Event:** CA-PBIS Conference 2025  
**Slides:** 32  
**Template:** Modern (emerald/teal matching Behavior School branding)  
**Presenters:** Megan Caluza, Rob Spain, Holly Northcross, Katie Turner

**Content:**
- CEC compliance notice
- Presenter introductions and learning objectives
- Evolution of BCBAs in schools
- Three models of BCBA integration (Tier 3, Multi-Tier, Systems Leadership)
- BAESIG research insights
- How BCBAs enhance PBIS across all tiers
- Case examples and audience interaction prompts
- Implementation strategies and resources
- 90-day action plan

### 2. CALABA 2026 Symposium
**Title:** Beyond Observable Behavior: Measuring and Modifying the Function of Thought  
**Event:** CALABA 2026, Sacramento  
**Date:** Saturday, March 7, 2:55-3:55 PM  
**Slides:** 47  
**Template:** Corporate (deep blue/navy, professional academic style)  
**Presenters:** Rob Spain, Cristal Lopez, Megan Caluza

**Content:**
- **Paper 1 (Rob):** The Assessment Phase - Clinical Application of Precursor FA
  - Latency-based functional analysis methodology
  - Identifying internal drivers of behavior
  - Measuring private events through observable precursors
  - Case examples and assessment protocols

- **Paper 2 (Cristal):** The Intervention Phase - Values-Based Programming
  - ACT-informed BIP components
  - Integrating ACT into IEP goals
  - Psychological flexibility as target behavior
  - Practical implementation strategies

- **Paper 3 (Megan):** Implementation & Fidelity - Systems of Support
  - Multi-tiered training model
  - Behavioral Skills Training (BST) approach
  - Fidelity measurement and scaling strategies
  - Staff buy-in and coaching structure

- **Paper 4 (Rob):** Outcomes & Social Validity
  - Student outcome data (77% reduction in ODRs, 76% in disruptions)
  - Academic engagement improvements
  - Social-emotional growth measures
  - Cost-effectiveness analysis (4:1 ROI)
  - Replication across diverse settings

## 🚀 How to Import

### Step 1: Set Up Environment

Create a `.env.local` file in the repo root with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "service_role key" (secret)

### Step 2: Run the Import Script

```bash
cd /Users/Neo/Desktop/Neo\ Code/behaviorschool-com-and-marketing
chmod +x scripts/import-all-presentations.sh
./scripts/import-all-presentations.sh
```

The script will:
1. Check for required environment variables
2. Install necessary dependencies (@supabase/supabase-js, tsx)
3. Import PBIS presentation
4. Import CALABA symposium
5. Display access URLs and next steps

### Alternative: Manual Import

If the shell script doesn't work, run each import individually:

```bash
# Install dependencies first
npm install @supabase/supabase-js tsx dotenv

# Import PBIS
npx tsx scripts/import-pbis-presentation-full.ts

# Import CALABA
npx tsx scripts/import-calaba-presentation.ts
```

## 📱 How to Access & Present

### In the Admin Panel

1. Navigate to: https://behaviorschool.com/admin/presentations
2. Click the **Library** tab
3. You'll see both presentations listed with:
   - Title and topic
   - Slide count
   - Template used
   - Creation date
4. Click the **Present** button to enter fullscreen mode

### Presentation Mode Controls

**Keyboard shortcuts:**
- `←` / `→` Arrow keys: Navigate slides
- `F` or `F11`: Toggle fullscreen
- `Esc`: Exit fullscreen
- Click arrows on screen for navigation

**Features available:**
- Fullscreen presentation view
- Slide thumbnails/outline (if enabled)
- Progress indicator
- Clean, professional display

### Sharing & Viewing

Each presentation has three access modes:

1. **Edit Mode** (`/admin/presentations`)
   - Full editing capabilities
   - Drag-and-drop slide reordering
   - Rich text editor
   - Add images, charts, layouts
   - Requires admin login

2. **Present Mode** (`/presentations/present/[id]`)
   - Fullscreen presentation
   - Keyboard navigation
   - Professional display
   - Requires authentication

3. **Public View** (`/presentations/view/[id]?token=TOKEN`)
   - Scrollable view for sharing
   - No editing
   - Shareable link (check import output for token)

## 💾 Export Options

### PowerPoint (PPTX)

From the Library or Editor:
1. Click **Download** → **PPTX**
2. PptxGenJS generates a .pptx file
3. Layouts are preserved
4. Colors match the selected template
5. Open in PowerPoint/Keynote/Google Slides for backup or offline use

### PDF

From the Library or Editor:
1. Click **Download** → **PDF**
2. Basic PDF export via pdf-lib
3. Good for handouts or sharing

**Note:** For highest-quality PDF, export PPTX first, then "Save as PDF" from PowerPoint/Keynote.

## 🎨 Customizing After Import

Both presentations can be edited after import:

### Changing Templates

1. Open presentation in admin
2. Click **Settings** or **Template** button
3. Choose from 26 available templates:
   - Modern, Corporate, Minimal, Creative, Bold, etc.
4. Colors and fonts update automatically

### Editing Slides

1. Click on any slide to edit
2. Rich text editor supports:
   - Bold, italic, lists
   - Headers and formatting
   - Links
3. Change layouts:
   - Text only, Title only
   - Image left/right
   - Two column
   - Quote, Metrics, Chart, Table
   - Image full, etc.
4. Add visual elements:
   - Upload images
   - Generate AI images (DALL-E, Gemini)
   - Create charts (bar, line, pie, doughnut)
   - Search icons

### Reordering

- Drag and drop slides in the editor
- Changes save automatically to Supabase

### Adding Slides

- Click **+ Add Slide**
- Choose layout
- Enter content
- Position in deck

## 🗄️ Database Structure

Presentations are stored in Supabase:

**Table:** `presentations_ai`
- `id` (UUID): Unique presentation ID
- `topic`: Presentation title/description
- `slide_count`: Number of slides
- `template`: Template name (modern, corporate, etc.)
- `storage_path`: Path to JSON file in Storage
- `created_at`, `updated_at`: Timestamps

**Storage Bucket:** `presentations`
- Path: `conference/[id].json` or `symposium/[id].json`
- Contains: Full slide data + metadata
- Format: JSON with slides array, template theme, share token

## 🛠️ Troubleshooting

### Import fails with "Missing Supabase credentials"

**Solution:** Check `.env.local` exists and has both:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

### Import succeeds but presentations don't appear in Library

**Possible causes:**
1. **Wrong Supabase project:** Check URL matches production
2. **Storage bucket doesn't exist:** Script tries to create it, but verify `presentations` bucket exists in Supabase Storage
3. **Table doesn't exist:** Check `presentations_ai` table exists

**Fix:** Run this SQL in Supabase SQL Editor if table is missing:

```sql
CREATE TABLE IF NOT EXISTS presentations_ai (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic TEXT NOT NULL,
  slide_count INTEGER DEFAULT 0,
  template TEXT DEFAULT 'modern',
  tone TEXT DEFAULT 'professional',
  language TEXT DEFAULT 'English',
  provider TEXT,
  model TEXT,
  export_format TEXT DEFAULT 'pptx',
  storage_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS if needed
ALTER TABLE presentations_ai ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Enable all for authenticated users" ON presentations_ai
  FOR ALL USING (auth.role() = 'authenticated');
```

### Presentation loads but slides are empty

**Cause:** Storage file might not have uploaded correctly

**Fix:** Re-run the import script, or check Storage bucket for the JSON file

### Can't access /admin/presentations

**Cause:** Not logged in or insufficient permissions

**Fix:** 
1. Log in to behaviorschool.com/admin
2. Ensure your account has admin privileges

### Export to PPTX fails

**Possible causes:**
- Browser compatibility (try Chrome/Edge)
- Large images slowing generation
- Template colors not loading

**Fix:**
- Wait longer (can take 10-30 seconds for large decks)
- Try PDF export instead
- Check browser console for errors

## 📋 Presentation Checklist for Rob

### Before the Conference

- [ ] Import both presentations (run the script)
- [ ] Verify they appear in Library tab
- [ ] Test Present mode for both
- [ ] Export PPTX backups to USB drive
- [ ] Test on presentation laptop/device
- [ ] Verify all slides display correctly
- [ ] Practice keyboard navigation
- [ ] Check that images/charts load properly

### PBIS Conference Specific

- [ ] Review presenter introductions (Megan, Rob, Holly, Katie)
- [ ] Prepare for audience interaction slides (polls, shares)
- [ ] Have examples ready for Tier 1/2/3 discussions
- [ ] Ensure CEC compliance slides are visible
- [ ] Double-check BAESIG contact info is current

### CALABA Symposium Specific

- [ ] Coordinate with Cristal and Megan on timing (15 min each paper + Q&A)
- [ ] Review data slides for accuracy (outcome numbers, effect sizes)
- [ ] Prepare answers for methodology questions
- [ ] Have case examples ready for discussion
- [ ] Verify contact info and resource links

### Day-of Presentation

- [ ] Arrive early to test tech setup
- [ ] Open present mode 10 min before start
- [ ] Confirm fullscreen works (press F)
- [ ] Have backup PPTX on USB if needed
- [ ] Test arrow key navigation
- [ ] Have water/notes nearby

## 🎓 Tips for Great Presentations

### Using the Present Mode

1. **Start in fullscreen immediately** - Press F as soon as you begin
2. **Use arrow keys** - More reliable than clicking
3. **Pause for discussion** - Especially on "Audience Share" slides
4. **Show data slowly** - Give audience time to absorb numbers
5. **Engage with polls** - PBIS deck has interactive elements

### Visual Appeal

- Both templates are professionally designed
- PBIS "modern" template: Warm, inviting (good for educators)
- CALABA "corporate" template: Serious, academic (good for research)
- Minimal animations - keep focus on content
- High contrast for readability in conference rooms

### Backup Plan

- Always export PPTX before event
- Save to USB drive AND cloud (Google Drive, Dropbox)
- Have PDF version for handouts
- Take screenshots of key data slides

## 📞 Support

**If you have issues:**

1. Check this README first
2. Verify Supabase connection (check .env.local)
3. Look at browser console (F12) for errors
4. Check Supabase Dashboard for storage/table issues
5. Re-run import script if needed

**Script locations:**
- Main import: `scripts/import-all-presentations.sh`
- PBIS import: `scripts/import-pbis-presentation-full.ts`
- CALABA import: `scripts/import-calaba-presentation.ts`

**Admin panel:** https://behaviorschool.com/admin/presentations

---

## ✅ Summary

You now have two professional, conference-ready presentations:

1. **PBIS Conference** (32 slides) - Ready for CA-PBIS Conference 2025
2. **CALABA Symposium** (47 slides) - Ready for March 7, 2026, 2:55-3:55 PM

Both are:
- ✅ Loaded into the Presenton system
- ✅ Accessible at /admin/presentations
- ✅ Presentable in fullscreen mode
- ✅ Exportable as PPTX or PDF
- ✅ Editable if you need to make changes
- ✅ Using professional templates (modern/corporate)

**Good luck with the presentations, Rob! 🎉**
