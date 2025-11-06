# Newsletter #001 Setup Checklist

Quick reference checklist for setting up your first Behavior School newsletter in Listmonk.

**Campaign:** Newsletter #001 - Domain A Launch
**Send Date:** Week 2, Monday 9:00 AM
**Subject:** 📚 New: 25 Free BCBA Domain A Practice Questions + Study Tips

---

## Part 1: Template Setup (One-Time)

- [ ] Log into Listmonk admin panel
- [ ] Navigate to **Campaigns** → **Templates**
- [ ] Click **+ New**
- [ ] Name: `Behavior School Weekly Newsletter`
- [ ] Copy contents from `NEWSLETTER_TEMPLATE.html` (lines 1-332)
- [ ] Paste into **Body** field
- [ ] Click **Save**
- [ ] ✅ Verify template appears in templates list

---

## Part 2: Create Campaign

- [ ] Navigate to **Campaigns** → **All Campaigns**
- [ ] Click **+ New campaign**

### Basic Info
- [ ] Campaign name: `Newsletter #001 - Domain A Launch`
- [ ] Subject: `📚 New: 25 Free BCBA Domain A Practice Questions + Study Tips`
- [ ] From email: `team@behaviorschool.com` (or your configured sender)
- [ ] From name: `Behavior School`
- [ ] Tags: `newsletter, domain-a, week-2`

### Template & Content
- [ ] Select template: `Behavior School Weekly Newsletter`
- [ ] Content type: `Richtext`
- [ ] Open **Template data** section
- [ ] Copy JSON from `newsletter_001_template_data.json`
- [ ] Paste into Template data field
- [ ] ✅ Verify no `{{ .Variable }}` placeholders visible in preview

---

## Part 3: Testing

### Preview
- [ ] Click **Preview** button
- [ ] Check logo and header
- [ ] Verify featured post title displays
- [ ] Check all buttons are green
- [ ] Hover over links to verify URLs
- [ ] ✅ No placeholder text visible

### Test Email - Desktop
- [ ] Select **test list** in Recipients
- [ ] Click **Send test**
- [ ] Enter your email
- [ ] Check inbox (wait 1-2 minutes)
- [ ] Open email in Gmail/Outlook
- [ ] Verify formatting
- [ ] Click all links to test
- [ ] ✅ Everything works correctly

### Test Email - Mobile
- [ ] Forward to phone OR check mobile email app
- [ ] Verify text is readable (no zoom needed)
- [ ] Check buttons are tappable
- [ ] Test responsive design
- [ ] ✅ Mobile experience is good

---

## Part 4: Production Setup

- [ ] Go back to campaign editor
- [ ] Update Recipients from **test list** to **production list**
- [ ] Navigate to **Schedule** section
- [ ] Select **Schedule** option
- [ ] Choose date: Next Monday
- [ ] Choose time: 9:00 AM (your timezone)
- [ ] Review summary:
  - [ ] Correct subscriber count
  - [ ] Correct schedule time
  - [ ] Correct template
- [ ] Click **Schedule campaign**
- [ ] ✅ Campaign scheduled successfully

---

## Part 5: Post-Send

### Day 1 (Immediately after send)
- [ ] Check campaign dashboard
- [ ] Verify total sent matches subscriber count
- [ ] Check bounce rate (<2% is good)
- [ ] Check complaints (should be 0)

### Day 1 (Within 24 hours)
- [ ] Check open rate (target: 25%+)
- [ ] Check click rate (target: 5%+)
- [ ] Check unsubscribe rate (<0.5%)
- [ ] Identify top clicked link
- [ ] Note which CTAs performed best

### Day 7 (One week after)
- [ ] Compile full metrics report
- [ ] Document what worked
- [ ] Document what to test next time
- [ ] Update `NEWSLETTER_001_Week_1_Launch.md` with results

---

## Part 6: Social Media Distribution

- [ ] Open `SOCIAL_MEDIA_TEMPLATES.md`
- [ ] Copy LinkedIn post for Domain A
- [ ] Post to LinkedIn (Monday 10:00 AM)
- [ ] Copy Twitter/X post for Domain A
- [ ] Post to Twitter (Monday 2:00 PM)
- [ ] Monitor engagement on both platforms

---

## Next Newsletter Prep

- [ ] Review Newsletter #001 performance
- [ ] Identify improvement opportunities
- [ ] Prepare Newsletter #002 content (Domain G post)
- [ ] Update template variables JSON for Newsletter #002
- [ ] Schedule Newsletter #002 for next Monday 9:00 AM

---

## Files Reference

**For Template Setup:**
- `NEWSLETTER_TEMPLATE.html` - HTML email template

**For Campaign Setup:**
- `newsletter_001_template_data.json` - Template variables (copy/paste)
- `NEWSLETTER_001_Week_1_Launch.md` - Full content reference

**For Social Media:**
- `SOCIAL_MEDIA_TEMPLATES.md` - LinkedIn & Twitter templates

**For Instructions:**
- `LISTMONK_NEWSLETTER_CAMPAIGN_SETUP.md` - Detailed step-by-step guide

---

## Quick Troubleshooting

**❌ Template variables not showing**
→ Check JSON formatting (no trailing commas)

**❌ Newsletter looks broken**
→ Verify entire HTML template was copied

**❌ Links not working**
→ Check URLs in JSON have `https://`

**❌ Can't schedule campaign**
→ Save as draft first, then schedule

**❌ Test email not received**
→ Check spam folder, verify SMTP config

---

**✅ Campaign Complete When:**
- Newsletter sent/scheduled successfully
- Social media posts published
- Monitoring dashboard bookmarked
- Calendar reminder set for metrics check

---

*Part of SEO Action Plan 2025 - Week 2-3 Distribution Strategy*
