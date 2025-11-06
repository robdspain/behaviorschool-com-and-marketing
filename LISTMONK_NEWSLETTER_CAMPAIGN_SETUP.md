# Listmonk Newsletter Campaign Setup Guide

**Goal:** Set up the Behavior School Weekly newsletter template and launch Newsletter #001 promoting the Domain A blog post.

**Time Required:** 15-20 minutes

---

## Prerequisites

Before starting, ensure you have:
- ✅ Access to Listmonk admin panel (typically at `https://your-domain.com/admin` or similar)
- ✅ At least one subscriber list created
- ✅ SMTP settings configured for sending emails
- ✅ Your own email address on a test list for preview

---

## Part 1: Upload Newsletter Template (One-Time Setup)

### Step 1: Access Templates Section
1. Log into your Listmonk admin panel
2. Navigate to **Campaigns** in the left sidebar
3. Click **Templates** in the sub-menu
4. Click the **+ New** button (top right)

### Step 2: Create Template
Fill in the template form:

**Template Name:**
```
Behavior School Weekly Newsletter
```

**Template Type:**
- Select `Campaign` (default)

**Template Body:**
- Open the file `NEWSLETTER_TEMPLATE.html` in your code editor
- Copy **ALL** contents (lines 1-332)
- Paste into the **Body** field in Listmonk

### Step 3: Save Template
1. Click **Save** button
2. You should see "Template created" confirmation
3. Note: The template will now appear in your templates list

**✅ CHECKPOINT:** You should see "Behavior School Weekly Newsletter" in your templates list.

---

## Part 2: Create Newsletter Campaign #001

### Step 1: Start New Campaign
1. Navigate to **Campaigns** in the left sidebar
2. Click **All Campaigns**
3. Click the **+ New campaign** button (top right)

### Step 2: Configure Campaign Settings

#### Basic Information Tab

**Campaign name (internal):**
```
Newsletter #001 - Domain A Launch
```

**Subject:**
```
📚 New: 25 Free BCBA Domain A Practice Questions + Study Tips
```

**From email:**
```
team@behaviorschool.com
```
*Note: Use whatever sender email you've configured in SMTP settings*

**From name (optional):**
```
Behavior School
```

**Tags (optional):**
```
newsletter, domain-a, week-2
```

#### Content Tab

**Template:**
- Select `Behavior School Weekly Newsletter` from dropdown

**Content type:**
- Select `Richtext` (default)

**Body:**
- Leave empty (template handles all content)

### Step 3: Add Template Variables

In the **Template** or **Content** tab, look for a section labeled "Template data" or "Template variables". Click to expand it.

**Copy and paste this entire JSON block:**

```json
{
  "FeaturedPostTitle": "BCBA Domain A: 25 Practice Questions with Detailed Explanations",
  "FeaturedPostDescription": "Master the philosophical underpinnings of behavior analysis with 25 comprehensive practice questions covering determinism, empiricism, radical behaviorism, and the 7 dimensions of ABA. Each question includes detailed explanations of correct answers AND why other options are incorrect—helping you build the discrimination skills you need for exam day.",
  "FeaturedPostURL": "https://behaviorschool.com/blog/bcba-domain-a-practice-questions",
  "ProductTitle": "Free BCBA Mock Exam: 185 Questions, All 9 Domains",
  "ProductDescription": "Ready to test your knowledge across all domains? Our full-length practice exam mirrors the actual BCBA exam format with 185 questions, instant feedback, and detailed explanations for every answer. Practice under realistic conditions without spending $100+ on prep courses. Completely free, no signup required.",
  "ProductURL": "https://behaviorschool.com/free-bcba-practice-exam",
  "QuickTip": "Struggling to remember the 7 dimensions of ABA? Use this mnemonic: \"All Behavior Analysts Can Talk, E.G., Generally\" — Applied, Behavioral, Analytic, Conceptually systematic, Technological, Effective, Generality. Write it out by hand 3 times before your exam to cement it in long-term memory.",
  "SecondaryCTAText": "Want unlimited practice questions that adapt to your weak areas?",
  "SecondaryCTAButton": "Try AI Study System →",
  "SecondaryCTAURL": "https://behaviorschool.com/study"
}
```

**Note:** Listmonk automatically makes these variables available in the template as `{{ .FeaturedPostTitle }}`, `{{ .ProductTitle }}`, etc.

### Step 4: Select Recipients

Navigate to the **Recipients** or **Lists** tab:

**For Testing (First Time):**
1. Select your **test list** (or create one with just your email)
2. Check the box next to the test list name
3. You should see "1 subscriber" (or however many test emails you have)

**For Production Send (After Testing):**
1. Select your main subscriber list(s)
2. Optionally segment by tags if you have BCBAs vs general audience

### Step 5: Save as Draft
1. Click **Save as draft** button
2. You should see "Campaign created" confirmation

**✅ CHECKPOINT:** Campaign should appear in your campaigns list with status "Draft".

---

## Part 3: Test the Newsletter

### Step 1: Preview the Email
1. Open your draft campaign (Newsletter #001)
2. Click the **Preview** button (usually at top right)
3. You should see a rendered version of the email

**Check for:**
- ✅ Logo and header display correctly
- ✅ Featured post title and description are visible
- ✅ All buttons are green and properly styled
- ✅ Links are working (hover to verify URLs)
- ✅ Footer links and social icons are present
- ✅ No `{{ .VariableName }}` placeholders visible (means variables loaded correctly)

### Step 2: Send Test Email
1. In the campaign editor, look for **Send test** button
2. Enter your email address
3. Click **Send**
4. Check your inbox (may take 1-2 minutes)

### Step 3: Review Test Email

**Desktop Check:**
- Open in your email client (Gmail, Outlook, etc.)
- Verify all formatting looks correct
- Click all links to ensure they work
- Check that images load (if any)

**Mobile Check:**
- Forward to your phone or check on mobile email app
- Verify responsive design works
- Text should be readable without zooming
- Buttons should be easy to tap

### Step 4: Make Adjustments (if needed)
If you notice any issues:
1. Go back to campaign editor
2. Update template variables or template itself
3. Save changes
4. Send another test email
5. Repeat until satisfied

**Common Issues:**
- **Broken links:** Check URLs don't have typos
- **Missing content:** Verify JSON variables are correctly formatted
- **Styling issues:** Check that NEWSLETTER_TEMPLATE.html was fully copied
- **Unsubscribe link not working:** Make sure `{{ .UnsubscribeURL }}` is in template

**✅ CHECKPOINT:** Test email looks perfect on both desktop and mobile.

---

## Part 4: Schedule for Production

### Option A: Schedule for Specific Time (Recommended)

1. In campaign editor, navigate to **Schedule** or **Send** section
2. Select **Schedule** option
3. Choose date and time:
   - **Date:** Next Monday (Week 2, Day 1)
   - **Time:** 9:00 AM (in your timezone)
4. Update recipients list from test list to **production list**
5. Review summary:
   - Recipients: [Number] subscribers
   - Schedule: Monday, [Date] at 9:00 AM
6. Click **Schedule campaign**
7. Confirm scheduling

**✅ Campaign will automatically send at scheduled time.**

### Option B: Send Immediately

⚠️ **Only use this if:**
- It's currently Monday 9:00 AM (or your desired send time)
- You've thoroughly tested the email
- You've updated recipients to production list

**Steps:**
1. In campaign editor, verify recipients list is set to production
2. Click **Send campaign** button
3. Confirm "Are you sure?" prompt
4. Campaign will immediately start sending

**✅ Monitor the campaign dashboard to see delivery progress.**

---

## Part 5: Monitor Performance

### Immediately After Sending

**Within First Hour:**
1. Navigate to **Campaigns** → **All campaigns**
2. Click on "Newsletter #001 - Domain A Launch"
3. View the **Analytics** or **Stats** tab

**Initial Metrics to Check:**
- Total sent: Should match your subscriber count
- Bounces: Should be <2%
- Complaints: Should be 0

### First 24 Hours

**Key Metrics:**
- **Opens:** Target 25%+ (industry average for educational newsletters)
- **Clicks:** Target 5%+ (clicks to blog post or other CTAs)
- **Unsubscribes:** Keep below 0.5%

**Link Performance:**
Look for "Link clicks" or "Click map" section to see which links got most engagement:
1. Featured post (Domain A) - Primary goal
2. Free mock exam CTA - Secondary conversion
3. AI study system CTA - Tertiary conversion
4. Community link - Engagement metric

### Week 1 Report

After 7 days, compile these metrics:

**Delivery Metrics:**
- Total sent: [X]
- Delivered successfully: [X] (X%)
- Bounced: [X] (X%)
- Opened: [X] (X%)
- Clicked: [X] (X%)
- Unsubscribed: [X] (X%)

**Top Links:**
1. [Link name] - [X] clicks
2. [Link name] - [X] clicks
3. [Link name] - [X] clicks

**Save this data** for comparison with Newsletter #002 to track improvement.

---

## Part 6: Set Up Next Newsletters

### Newsletter #002 (Week 3, Monday 9am)

**Featured Post:** Domain G Practice Questions
- FeaturedPostTitle: "BCBA Domain G: 30 Behavior-Change Practice Questions"
- FeaturedPostURL: `https://behaviorschool.com/blog/bcba-domain-g-practice-questions`

**Product Spotlight:** IEP Behavior Goal Writer
- ProductTitle: "Free IEP Behavior Goal Generator"
- ProductURL: `https://behaviorschool.com/iep-behavior-goals`

**Quick Tip:** "DRA vs. DRI vs. DRO: All three are differential reinforcement, but here's the distinction—DRA provides alternative behavior with same function, DRI uses incompatible behavior (can't do both), DRO reinforces absence of problem behavior."

### Newsletter #003 (Week 4, Monday 9am)

**Featured Post:** BCBA Exam Timing Strategy
- FeaturedPostTitle: "Master BCBA Exam Timing: 3-Pass System for 185 Questions in 4 Hours"
- FeaturedPostURL: `https://behaviorschool.com/blog/bcba-exam-timing-strategy`

**Product Spotlight:** AI Study System
- ProductTitle: "Adaptive Study Platform: Questions That Target Your Weak Areas"
- ProductURL: `https://behaviorschool.com/study`

**Quick Tip:** "Use the 3-Pass System: Pass 1 (easy questions), Pass 2 (flagged questions), Pass 3 (final review). Never spend more than 1.3 minutes per question on first pass."

---

## Troubleshooting

### Issue: Template variables not showing up
**Solution:**
- Check that JSON is valid (no trailing commas, quotes properly closed)
- Ensure template body has `{{ .VariableName }}` syntax (note the leading dot)
- Try clicking "Load default template data" and re-entering

### Issue: Newsletter looks broken in Gmail
**Solution:**
- Gmail strips some CSS. Our template is designed for this.
- Test with actual Gmail account, not preview
- Inline styles (which we use) work best

### Issue: High bounce rate (>5%)
**Solution:**
- Clean your list: Remove emails that bounced
- Use double opt-in for new subscribers
- Check SMTP sending reputation

### Issue: Low open rate (<15%)
**Solution:**
- Test different subject lines (A/B test)
- Send at different times (9am vs 6pm)
- Verify "From name" is recognizable
- Check spam folder - may be deliverability issue

### Issue: Unsubscribe link not working
**Solution:**
- Verify `{{ .UnsubscribeURL }}` is in template footer
- Check Listmonk settings for unsubscribe page configuration
- Test with actual subscriber (not admin email)

### Issue: Can't schedule campaign
**Solution:**
- Verify campaign is in "Draft" status
- Check that at least one list is selected
- Ensure scheduled time is in the future
- May need to save draft first, then schedule

---

## Quick Reference: Listmonk Navigation

```
Admin Panel
├── Dashboard (overview metrics)
├── Lists (subscriber lists)
│   └── Manage subscribers
├── Campaigns
│   ├── All campaigns (create/view)
│   ├── Templates (manage templates)
│   └── Media (upload images)
├── Subscribers (view/import/export)
└── Settings
    ├── SMTP (email sending config)
    ├── Appearance (admin UI)
    └── Bounces (manage bounce handling)
```

---

## Success Checklist

Before considering Newsletter #001 complete:

- [ ] Newsletter template uploaded to Listmonk
- [ ] Campaign created with Newsletter #001 content
- [ ] Template variables JSON loaded correctly
- [ ] Test email sent and reviewed on desktop
- [ ] Test email reviewed on mobile device
- [ ] All links verified working
- [ ] Production subscriber list selected
- [ ] Campaign scheduled for Monday 9:00 AM (or sent)
- [ ] Monitoring dashboard bookmarked
- [ ] Calendar reminder set to check metrics in 24 hours

---

## Next Steps After Newsletter #001

1. **Post to social media** using templates in `SOCIAL_MEDIA_TEMPLATES.md`
   - LinkedIn: Monday 10:00 AM
   - Twitter: Monday 2:00 PM

2. **Monitor metrics** for 7 days
   - Track which links perform best
   - Note open rate for subject line optimization
   - Document insights in `NEWSLETTER_001_Week_1_Launch.md`

3. **Prepare Newsletter #002** (due in 1 week)
   - Publish Domain G blog post first
   - Update JSON template variables
   - Schedule for next Monday 9:00 AM

4. **Iterate based on data**
   - If open rate low, test new subject line format
   - If click rate low, adjust CTA placement or copy
   - If unsubscribe high, check content relevance

---

*Created as part of SEO Action Plan 2025 - Week 2-3 Distribution Strategy*
