export type EmailSequenceStep = {
  timing: string;
  title: string;
  subject: string;
  audience: string;
  objective: string;
};

export type EmailProductDefinition = {
  id: string;
  name: string;
  audience: string;
  description: string;
  status: 'live' | 'shared' | 'manual' | 'planned';
  provider: string;
  managementHref: string;
  managementLabel: string;
  sequence: EmailSequenceStep[];
};

export const behaviorStudyToolsSequence: EmailSequenceStep[] = [
  {
    timing: 'Day 0',
    title: 'Finish setup',
    subject: 'Finish your 2-minute setup so we can build your BCBA study path',
    audience: 'New signup, free plan, onboarding incomplete',
    objective: 'Move the user from signup into a usable study setup.',
  },
  {
    timing: 'Day 1',
    title: 'Baseline diagnostic',
    subject: 'Take the 2-minute diagnostic so we can build your BCBA study path',
    audience: 'Setup completed, no diagnostic or practice attempt',
    objective: 'Create a personalized weak-area result and next study block.',
  },
  {
    timing: 'Day 1',
    title: 'Use the diagnostic result',
    subject: 'Use your BCBA diagnostic result for today’s study block',
    audience: 'Diagnostic completed, no first practice session',
    objective: 'Turn the result into one short practice block.',
  },
  {
    timing: 'Day 3',
    title: 'Build a study rhythm',
    subject: 'Can you do 10 BCBA questions today?',
    audience: 'Free users with low question activity',
    objective: 'Restart the habit with a small practice session.',
  },
  {
    timing: 'Day 5',
    title: 'Show the product value',
    subject: 'Use your missed questions to choose the next study block',
    audience: 'One practice action, no purchase',
    objective: 'Show how missed questions guide the next study block.',
  },
  {
    timing: 'Day 7',
    title: 'Offer more practice',
    subject: 'Want more room to practice?',
    audience: 'Engaged free users with repeated product actions',
    objective: 'Present paid access only after free practice is helping.',
  },
  {
    timing: 'Behavior',
    title: 'Recover checkout intent',
    subject: 'Any questions before you upgrade?',
    audience: 'Recent checkout or pricing intent, free plan',
    objective: 'Answer the final purchase question without adding pressure.',
  },
  {
    timing: 'Behavior',
    title: 'Unlock a mock exam',
    subject: 'Ready to use a mock exam as a checkpoint?',
    audience: '20+ questions answered and no mock exam recorded',
    objective: 'Move an engaged learner into an exam-readiness checkpoint.',
  },
  {
    timing: 'Behavior',
    title: 'Respond to exam urgency',
    subject: 'Your exam date is close. Let the app narrow the plan.',
    audience: 'Projected exam date within 21 days',
    objective: 'Turn urgency into a focused plan and clear premium decision.',
  },
  {
    timing: 'Behavior',
    title: 'Win back an inactive learner',
    subject: 'Want to restart with one short BCBA practice set?',
    audience: 'Practiced before, inactive 7+ days, free plan',
    objective: 'Restart practice before asking for a purchase.',
  },
  {
    timing: 'Feedback',
    title: 'Address a price concern',
    subject: 'If price is the question, start with the decision point',
    audience: 'User selected price hesitation feedback',
    objective: 'Answer the objection plainly and offer the useful next step.',
  },
];

export const transformationSequence: EmailSequenceStep[] = [
  {
    timing: 'Day 0',
    title: 'District packet and fit call',
    subject: 'Your district packet and next step',
    audience: 'New Transformation Program inquiry',
    objective: 'Deliver the approval packet and make the fit call the next step.',
  },
  {
    timing: 'Day 1',
    title: 'Name the workload problem',
    subject: 'The school BCBA workload problem is not a personal failure',
    audience: 'Active lead who has not booked or enrolled',
    objective: 'Connect the program to the systems problem behind the workload.',
  },
  {
    timing: 'Day 3',
    title: 'Show the six-week change',
    subject: 'What changes during the 6-week Transformation Program',
    audience: 'Active lead who still needs program clarity',
    objective: 'Explain the concrete workflow and practice changes.',
  },
  {
    timing: 'Day 5',
    title: 'Support district approval',
    subject: 'A quick district approval reminder',
    audience: 'Lead considering district funding',
    objective: 'Remove the approval, W-9, invoice, and purchase-order friction.',
  },
  {
    timing: 'Day 7',
    title: 'Close with a personal choice',
    subject: 'Want to talk through the August cohort?',
    audience: 'Active lead who has not converted',
    objective: 'Invite a real conversation and stop the automated sequence.',
  },
];

export const emailProducts: EmailProductDefinition[] = [
  {
    id: 'behavior-study-tools',
    name: 'Behavior Study Tools',
    audience: 'BCBA candidates',
    description: 'Activation, practice, upgrade, and win-back messages tied to study behavior.',
    status: 'live',
    provider: 'Study app nurture + Resend',
    managementHref: '/admin/behavior-study-tools',
    managementLabel: 'Open live nurture operator',
    sequence: behaviorStudyToolsSequence,
  },
  {
    id: 'school-rbt',
    name: 'SchoolRBT',
    audience: 'RBT candidates and school teams',
    description: 'Shares the study lifecycle engine; dedicated RBT wording still needs to be confirmed for every step.',
    status: 'shared',
    provider: 'Study app nurture + Resend',
    managementHref: '/admin/behavior-study-tools',
    managementLabel: 'Review shared nurture operator',
    sequence: [],
  },
  {
    id: 'transformation-program',
    name: 'Transformation Program',
    audience: 'School-based BCBAs and district buyers',
    description: 'Inquiry-to-fit-call sequence with district approval and cohort enrollment support.',
    status: 'live',
    provider: 'Resend',
    managementHref: '/admin/crm',
    managementLabel: 'Open CRM leads',
    sequence: transformationSequence,
  },
  {
    id: 'behavior-school-core',
    name: 'Behavior School core',
    audience: 'Form leads, buyers, and resource users',
    description: 'Reusable signup, payment-link, lead-magnet, and transactional templates.',
    status: 'manual',
    provider: 'Convex templates + Resend',
    managementHref: '/admin/email-templates',
    managementLabel: 'Edit product templates',
    sequence: [],
  },
  {
    id: 'newsletter',
    name: 'Behavior School newsletter',
    audience: 'Cross-product subscribers',
    description: 'Broadcasts, announcements, product education, and audience-wide campaigns.',
    status: 'manual',
    provider: 'Listmonk broadcasts',
    managementHref: '/admin/listmonk',
    managementLabel: 'Manage broadcasts',
    sequence: [],
  },
  {
    id: 'upcoming-products',
    name: 'Upcoming products',
    audience: 'BehaviorSchool Pro, Supervision Workspace, and Learning Library leads',
    description: 'Launch and waitlist messaging needs a defined sequence before these products are promoted.',
    status: 'planned',
    provider: 'Resend (planned)',
    managementHref: '/admin/email-templates',
    managementLabel: 'Create launch templates',
    sequence: [],
  },
];
