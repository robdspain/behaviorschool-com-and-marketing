# App Store Screenshots - Behavior Study Tools

**Date Created:** 2026-01-28
**Apple Requirements (2024/2025):** Only 2 sizes needed, Apple auto-scales the rest

---

## 📱 Required Screenshot Sizes

### iPhone (REQUIRED)
- **Dimensions:** 1290 x 2796 pixels (portrait)
- **Display:** 6.9" (iPhone 17 Pro Max, 16 Pro Max, 16 Plus, etc.)
- **Format:** PNG or JPEG
- **Max file size:** 8 MB per image
- **Quantity:** 1-10 screenshots

Apple will automatically scale these for:
- 6.5" displays (iPhone 14 Plus, 13 Pro Max, etc.)
- 6.3" displays (iPhone 17 Pro, 16 Pro, 16, 15 Pro, etc.)
- 6.1" displays (iPhone 16e, 14, 13, 12, etc.)
- All smaller iPhones

### iPad (REQUIRED)
- **Dimensions:** 2064 x 2752 pixels (portrait)
- **Display:** 13" (iPad Pro M5/M4)
- **Format:** PNG or JPEG
- **Max file size:** 8 MB per image
- **Quantity:** 1-10 screenshots

Apple will automatically scale these for:
- 12.9" iPad Pro
- 11" iPad Pro and iPad Air
- 10.5" iPad
- 9.7" iPad and iPad mini

---

## 🎨 Recommended Screenshot Sequence

### Screenshot 1: Dashboard/Home Screen
**What to show:**
- Main study dashboard
- Progress tracking graphs (7-day, 30-day performance)
- Domain breakdown (Sections A-E)
- Study streak counter
- Clean, professional UI

**Text overlay (optional):**
- "Track Your BCBA Exam Progress"
- "Real-time analytics across all domains"

### Screenshot 2: Practice Question Interface
**What to show:**
- Sample BCBA practice question
- Multiple choice options
- Task list tag (e.g., "Section B: Measurement")
- Question counter (e.g., "Question 47 of 185")
- Timer/progress bar

**Text overlay:**
- "1,400+ Practice Questions"
- "Aligned with BACB 6th Edition Task List"

### Screenshot 3: Answer Explanation
**What to show:**
- Correct answer highlighted
- Detailed explanation/rationale
- Related Task List items
- "Why other answers are incorrect" section

**Text overlay:**
- "Learn Why, Not Just What"
- "Detailed explanations for every question"

### Screenshot 4: Performance Analytics
**What to show:**
- Domain-by-domain accuracy breakdown
- Weak areas highlighted
- Improvement trends over time
- Recommended study focus areas

**Text overlay:**
- "Adaptive Learning System"
- "Focus on your weak areas automatically"

### Screenshot 5: Free Mock Exam
**What to show:**
- Full 185-question mock exam interface
- Domain distribution pie chart
- Exam timer (4 hours)
- Results summary screen

**Text overlay:**
- "Free Full-Length Mock Exams"
- "185 questions • Mirrors real BCBA exam"

---

## 🎯 Design Guidelines

### Colors
Use BehaviorSchool.com brand colors:
- **Primary:** Emerald green (#10B981, #059669)
- **Secondary:** Slate/Gray (#1E293B, #475569)
- **Accent:** Blue (#3B82F6)
- **Success:** Green (#22C55E)

### Text
- **Font:** Inter, SF Pro, or system default
- **Titles:** Bold, 32-40pt
- **Body:** Regular, 16-20pt
- **Keep text readable** - avoid tiny fonts

### Status Bar
- Show time as 9:41 AM (Apple standard)
- Full battery, full signal
- Clean, minimal status bar

### Mockup Device Frames (Optional)
- Can show in iPhone/iPad frames OR
- Full bleed (no device frame)
- Apple accepts both

---

## 📋 Checklist Before Submission

- [ ] iPhone screenshots: 1290 x 2796 pixels (portrait)
- [ ] iPad screenshots: 2064 x 2752 pixels (portrait)
- [ ] All images under 8 MB each
- [ ] PNG or JPEG format
- [ ] No personal/confidential info visible
- [ ] No Lorem Ipsum placeholder text
- [ ] Real data or realistic example data (NOT fake stats)
- [ ] Consistent design across all screenshots
- [ ] Text is legible on all device sizes
- [ ] 1-10 screenshots per device type

---

## 🚀 How to Generate

### Option 1: Screenshot from Live Platform
1. Deploy platform to staging/production
2. Set browser window to exact dimensions:
   - iPhone: 430px wide x 932px tall (scale up 3x to 1290x2796)
   - iPad: 1032px wide x 1376px tall (scale up 2x to 2064x2752)
3. Use browser dev tools device emulation
4. Capture screenshots
5. Export at 3x (iPhone) or 2x (iPad) resolution

### Option 2: Figma/Design Tool
1. Create artboards at exact dimensions
2. Import platform screens
3. Add text overlays, annotations
4. Export as PNG @1x

### Option 3: Automated (Browser Tool)
```bash
# When platform is live, I can generate these automatically
# using browser automation at exact dimensions
```

---

## 📁 Where to Save

Save generated screenshots to:
```
/home/rob/clawd/app-store-assets/screenshots/
├── iphone/
│   ├── 01-dashboard.png
│   ├── 02-question.png
│   ├── 03-explanation.png
│   ├── 04-analytics.png
│   └── 05-mock-exam.png
└── ipad/
    ├── 01-dashboard.png
    ├── 02-question.png
    ├── 03-explanation.png
    ├── 04-analytics.png
    └── 05-mock-exam.png
```

---

## ✅ Next Steps

1. **Deploy platform** (or use staging URL)
2. **Generate screenshots** at exact dimensions
3. **Review for accuracy** - no fake data
4. **Upload to App Store Connect**
5. Submit for review

**Questions?** Check Apple's official guide:
https://developer.apple.com/help/app-store-connect/reference/screenshot-specifications/
