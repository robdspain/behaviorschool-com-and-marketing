/**
 * Seed Content Calendar with Initial Draft Posts
 * 
 * This script populates the content_calendar table with:
 * - 5 video script drafts
 * - 5 "BCBA Question of the Day" posts
 * - 3 blog post ideas
 * 
 * Run with: node scripts/seed-content-calendar.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const draftPosts = [
  // Video Scripts (from video-scripts task)
  {
    title: 'BCBA Exam Question: Reinforcement Schedules',
    caption: `Can you answer this BCBA exam question? 🎓

A teacher provides a sticker after every 5 correct answers. What schedule of reinforcement is this?

A) Fixed Ratio 5 (FR5)
B) Variable Ratio 5 (VR5)
C) Fixed Interval 5 (FI5)
D) Continuous Reinforcement (CRF)

Drop your answer below! 👇

#BCBA #BCBAExam #ABA #BehaviorAnalysis #ExamPrep`,
    platforms: ['Instagram', 'YouTube'],
    content_type: 'Video Clip',
    media_url: null,
    scheduled_date: getNextDayAtTime(2, 9), // Tuesday 9 AM
    status: 'draft',
    tags: ['Exam Prep', 'BCBA Tips'],
    notes: 'Short quiz format - 15-30 seconds. Use text overlay with countdown timer. Answer: A'
  },
  {
    title: 'Functional Analysis Quick Explainer',
    caption: `What is Functional Analysis? 🔍

3 key things BCBAs need to know:

1️⃣ Tests WHY a behavior occurs
2️⃣ Uses controlled conditions to isolate functions
3️⃣ Guides treatment selection

It's the gold standard for identifying behavior function!

Want to learn more? Link in bio 🎯

#BCBA #FunctionalAnalysis #ABA #BehaviorAnalysis`,
    platforms: ['Instagram', 'YouTube'],
    content_type: 'Video Clip',
    media_url: null,
    scheduled_date: getNextDayAtTime(4, 9), // Thursday 9 AM
    status: 'draft',
    tags: ['BCBA Tips', 'Clinical Skills'],
    notes: '30-45 second explainer. Use visual graphics for the 3 points. Upbeat background music.'
  },
  {
    title: 'IEP Goals Writing Mistakes',
    caption: `Top 3 IEP Goal Mistakes (and how to fix them!) ✅

❌ Mistake 1: Not measurable
✅ Fix: Include specific criteria

❌ Mistake 2: Too broad
✅ Fix: Break into smaller objectives

❌ Mistake 3: Missing baseline
✅ Fix: Always document current level

Save this for next IEP season! 📋

#IEP #SpecialEducation #BCBA #BehaviorAnalyst #IEPGoals`,
    platforms: ['Instagram', 'LinkedIn'],
    content_type: 'Carousel',
    media_url: null,
    scheduled_date: getNextDayAtTime(4, 17), // Thursday 5 PM
    status: 'draft',
    tags: ['IEP Tools', 'BCBA Tips'],
    notes: 'LinkedIn carousel - 5 slides. Professional design. Include examples on each slide.'
  },
  {
    title: 'Day in the Life of a BCBA',
    caption: `POV: You're a school-based BCBA 🏫

6:30 AM - Review data before school
8:00 AM - Morning observations
10:00 AM - IEP meeting
12:00 PM - Staff training (while eating lunch 😅)
2:00 PM - More observations
4:00 PM - Write behavior plans
6:00 PM - Finally done!

Who else relates? 🙋‍♀️

#BCBA #DayInTheLife #BehaviorAnalyst #SchoolPsychology`,
    platforms: ['Instagram'],
    content_type: 'Video Clip',
    media_url: null,
    scheduled_date: getNextDayAtTime(5, 14), // Friday 2 PM
    status: 'draft',
    tags: ['Community/Fun', 'Career Advice'],
    notes: 'Relatable content - use trending "day in my life" format. Quick cuts between activities. Light-hearted tone.'
  },
  {
    title: 'Preference Assessment Types',
    caption: `Which preference assessment should you use? 🤔

🔹 Paired Stimulus: Best for limited choices
🔹 Multiple Stimulus: Great for variety
🔹 Free Operant: Most naturalistic
🔹 Interview: Quick but subjective

Each has a time and place!

Comment which one you use most 👇

#BCBA #PreferenceAssessment #ABA #Reinforcement`,
    platforms: ['Instagram', 'YouTube'],
    content_type: 'Video Clip',
    media_url: null,
    scheduled_date: getNextDayAtTime(6, 10), // Saturday 10 AM
    status: 'draft',
    tags: ['BCBA Tips', 'Clinical Skills'],
    notes: '45-60 second explainer. Visual comparison chart. Engaging music.'
  },

  // BCBA Question of the Day Posts
  {
    title: 'QOTD: Extinction Burst',
    caption: `📚 BCBA Question of the Day

What is an extinction burst?

A) Immediate decrease in behavior
B) Temporary increase in behavior when reinforcement is stopped
C) Gradual decrease over time
D) Behavior changing to a different form

Think you know? Reply with your answer! ⬇️

#BCBAExam #StudyTip #ABA`,
    platforms: ['LinkedIn', 'Twitter'],
    content_type: 'Text Post',
    media_url: null,
    scheduled_date: getNextDayAtTime(1, 9), // Monday 9 AM
    status: 'draft',
    tags: ['Exam Prep'],
    notes: 'Short, engaging poll format. Answer: B'
  },
  {
    title: 'QOTD: Differential Reinforcement',
    caption: `🧠 Pop quiz for BCBAs!

Which differential reinforcement procedure involves reinforcing ANY behavior except the target?

A) DRA (Differential Reinforcement of Alternative behavior)
B) DRO (Differential Reinforcement of Other behavior)
C) DRI (Differential Reinforcement of Incompatible behavior)
D) DRL (Differential Reinforcement of Low rates)

#BCBA #BehaviorAnalysis #StudyDaily`,
    platforms: ['Facebook', 'LinkedIn'],
    content_type: 'Text Post',
    media_url: null,
    scheduled_date: getNextDayAtTime(3, 10), // Wednesday 10 AM
    status: 'draft',
    tags: ['Exam Prep'],
    notes: 'Answer: B. Can turn into a discussion thread.'
  },
  {
    title: 'QOTD: IOA Definition',
    caption: `✏️ Quick BCBA exam question:

What does IOA stand for and why do we calculate it?

Bonus: What's the minimum acceptable IOA percentage?

Drop your answers below! 👇

#BCBAExam #DataCollection #BCBA`,
    platforms: ['Instagram', 'Facebook'],
    content_type: 'Text Post',
    media_url: null,
    scheduled_date: getNextDayAtTime(2, 9), // Tuesday 9 AM
    status: 'draft',
    tags: ['Exam Prep', 'Clinical Skills'],
    notes: 'Answer: Interobserver Agreement, to ensure data reliability, 80% minimum. Good engagement driver.'
  },
  {
    title: 'QOTD: Task Analysis',
    caption: `🎯 BCBA Concept Check

You're teaching a student to wash their hands. You break it down into 8 steps and teach them one at a time, starting with turning on the water.

What teaching procedure is this?

A) Forward Chaining
B) Backward Chaining
C) Total Task Presentation
D) Graduated Guidance

#BCBA #Teaching #TaskAnalysis`,
    platforms: ['LinkedIn', 'Facebook'],
    content_type: 'Text Post',
    media_url: null,
    scheduled_date: getNextDayAtTime(3, 10), // Wednesday 10 AM
    status: 'draft',
    tags: ['Exam Prep', 'BCBA Tips'],
    notes: 'Answer: A. Professional discussion starter for LinkedIn.'
  },
  {
    title: 'QOTD: Ethics Scenario',
    caption: `⚖️ BCBA Ethics Question

A parent asks you to implement a punishment procedure you're uncomfortable with. What should you do?

A) Implement it since the parent requested it
B) Discuss alternative approaches and ethical considerations
C) Refuse and terminate services
D) Ask a colleague to do it instead

What's the ethical response?

#BCBAEthics #ProfessionalConduct #BACB`,
    platforms: ['LinkedIn', 'Facebook'],
    content_type: 'Text Post',
    media_url: null,
    scheduled_date: getNextDayAtTime(5, 10), // Friday 10 AM
    status: 'draft',
    tags: ['Exam Prep', 'BCBA Tips'],
    notes: 'Answer: B. Great discussion driver on LinkedIn. Ethics is always engaging.'
  },

  // Blog Post Ideas
  {
    title: 'Blog: Complete BCBA Exam Study Guide 2026',
    caption: `New blog post! 📖

Your complete guide to passing the BCBA exam in 2026:

✅ Study timeline breakdown
✅ Best resources for each content area
✅ Practice question strategies
✅ Test day tips
✅ What to do if you don't pass

Read the full guide → [link]

#BCBA #ExamPrep #StudyGuide`,
    platforms: ['Facebook', 'LinkedIn', 'Twitter', 'Email'],
    content_type: 'Blog Post',
    media_url: 'https://behaviorschool.com/blog/bcba-exam-study-guide-2026',
    scheduled_date: getNextDayAtTime(3, 10), // Wednesday 10 AM
    status: 'draft',
    tags: ['Exam Prep', 'Product Updates'],
    notes: 'Comprehensive blog post. Should be 2000+ words with embedded study tools. High SEO value.'
  },
  {
    title: 'Blog: Writing Better IEP Behavior Goals',
    caption: `New resource for school-based BCBAs! 🏫

How to write IEP behavior goals that actually work:

• SMART goal framework for behavior
• Common mistakes to avoid
• 10 example goals you can adapt
• Data collection made simple
• Parent-friendly language tips

Full article + free template → [link]

#IEP #BCBA #SpecialEducation #BehaviorGoals`,
    platforms: ['Facebook', 'LinkedIn', 'Twitter', 'Email'],
    content_type: 'Blog Post',
    media_url: 'https://behaviorschool.com/blog/writing-iep-behavior-goals',
    scheduled_date: getNextDayAtTime(2, 9), // Tuesday 9 AM
    status: 'draft',
    tags: ['IEP Tools', 'Clinical Skills'],
    notes: 'Target: special education teachers + BCBAs. Include downloadable goal bank.'
  },
  {
    title: 'Blog: BCBA Career Path Guide',
    caption: `Thinking about becoming a BCBA? Here's what you need to know 💼

📍 Education requirements
📍 Supervision hours breakdown
📍 Certification process
📍 Salary expectations by setting
📍 Pros and cons of different work environments
📍 Day-to-day responsibilities

Your roadmap to a BCBA career → [link]

#BCBA #CareerPath #BehaviorAnalysis #Psychology`,
    platforms: ['LinkedIn', 'Facebook', 'Twitter', 'Email'],
    content_type: 'Blog Post',
    media_url: 'https://behaviorschool.com/blog/bcba-career-path-guide',
    scheduled_date: getNextDayAtTime(4, 9), // Thursday 9 AM
    status: 'draft',
    tags: ['Career Advice'],
    notes: 'Target: psychology students, RBTs considering certification. Good for recruiting future customers.'
  }
]

async function seedContentCalendar() {
  console.log('🌱 Seeding content calendar with draft posts...\n')

  let successCount = 0
  let errorCount = 0

  for (const post of draftPosts) {
    try {
      const { data, error } = await supabase
        .from('content_calendar')
        .insert(post)
        .select()

      if (error) {
        console.error(`❌ Error creating "${post.title}":`, error.message)
        errorCount++
      } else {
        console.log(`✅ Created: ${post.title}`)
        console.log(`   📅 Scheduled: ${post.scheduled_date}`)
        console.log(`   📱 Platforms: ${post.platforms.join(', ')}`)
        console.log(`   🏷️  Tags: ${post.tags.join(', ')}\n`)
        successCount++
      }
    } catch (err) {
      console.error(`❌ Unexpected error creating "${post.title}":`, err)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Successfully created: ${successCount} posts`)
  console.log(`❌ Errors: ${errorCount} posts`)
  console.log('='.repeat(50))
}

// Helper function to get next occurrence of a day at a specific hour
function getNextDayAtTime(dayOfWeek, hour) {
  // dayOfWeek: 0 = Sunday, 1 = Monday, etc.
  // hour: 0-23 (PST)
  
  const now = new Date()
  const targetDate = new Date(now)
  
  // Set to next week to avoid past dates
  targetDate.setDate(now.getDate() + 7)
  
  // Find next occurrence of the target day
  const currentDay = targetDate.getDay()
  const daysToAdd = (dayOfWeek - currentDay + 7) % 7
  targetDate.setDate(targetDate.getDate() + daysToAdd)
  
  // Set time (PST is UTC-8)
  targetDate.setHours(hour, 0, 0, 0)
  
  // Convert to ISO string for PST timezone
  // Note: This is simplified - in production you'd use a proper timezone library
  const pstOffset = -8 * 60 // PST is UTC-8
  const localOffset = targetDate.getTimezoneOffset()
  const totalOffset = pstOffset - localOffset
  const pstDate = new Date(targetDate.getTime() + totalOffset * 60 * 1000)
  
  return pstDate.toISOString()
}

// Run the seed
seedContentCalendar()
  .then(() => {
    console.log('\n✨ Seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  })
