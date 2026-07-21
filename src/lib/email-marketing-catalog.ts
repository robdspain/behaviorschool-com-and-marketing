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
    subject: 'Your setup is done. Take the short diagnostic next.',
    audience: 'Setup completed, no diagnostic or practice attempt',
    objective: 'Create a personalized weak-area result and next study block.',
  },
  {
    timing: 'Day 1',
    title: 'Use the diagnostic result',
    subject: 'Your diagnostic gave you a place to start',
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
    subject: 'Your missed questions are telling you what to study',
    audience: 'One practice action, no purchase',
    objective: 'Show how missed questions guide the next study block.',
  },
  {
    timing: 'Day 7',
    title: 'Offer more practice',
    subject: 'Do you need more practice than the free plan gives you?',
    audience: 'Engaged free users with repeated product actions',
    objective: 'Present paid access only after free practice is helping.',
  },
  {
    timing: 'Behavior',
    title: 'Recover checkout intent',
    subject: 'Did you have a question about the paid plan?',
    audience: 'Recent checkout or pricing intent, free plan',
    objective: 'Answer the final purchase question without adding pressure.',
  },
  {
    timing: 'Behavior',
    title: 'Unlock a mock exam',
    subject: 'You have enough practice for a mock exam',
    audience: '20+ questions answered and no mock exam recorded',
    objective: 'Move an engaged learner into an exam-readiness checkpoint.',
  },
  {
    timing: 'Behavior',
    title: 'Respond to exam urgency',
    subject: 'Your exam date is getting close',
    audience: 'Projected exam date within 21 days',
    objective: 'Turn urgency into a focused plan and clear premium decision.',
  },
  {
    timing: 'Behavior',
    title: 'Win back an inactive learner',
    subject: 'Pick up with 5 questions where you left off',
    audience: 'Practiced before, inactive 7+ days, free plan',
    objective: 'Restart practice before asking for a purchase.',
  },
  {
    timing: 'Feedback',
    title: 'Address a price concern',
    subject: 'A straightforward answer about the price',
    audience: 'User selected price hesitation feedback',
    objective: 'Answer the objection plainly and offer the useful next step.',
  },
];

export const transformationSequence: EmailSequenceStep[] = [
  {
    timing: 'Day 0',
    title: 'District packet and fit call',
    subject: 'Here is the district packet you asked for',
    audience: 'New Transformation Program inquiry',
    objective: 'Deliver the approval packet and make the fit call the next step.',
  },
  {
    timing: 'Day 1',
    title: 'Name the workload problem',
    subject: 'The part of school BCBA work nobody owns',
    audience: 'Active lead who has not booked or enrolled',
    objective: 'Connect the program to the systems problem behind the workload.',
  },
  {
    timing: 'Day 3',
    title: 'Show the six-week change',
    subject: 'What we actually work on for six weeks',
    audience: 'Active lead who still needs program clarity',
    objective: 'Explain the concrete workflow and practice changes.',
  },
  {
    timing: 'Day 5',
    title: 'Support district approval',
    subject: 'Need help getting district approval?',
    audience: 'Lead considering district funding',
    objective: 'Remove the approval, W-9, invoice, and purchase-order friction.',
  },
  {
    timing: 'Day 7',
    title: 'Close with a personal choice',
    subject: 'Should we talk about the August cohort?',
    audience: 'Active lead who has not converted',
    objective: 'Invite a real conversation and stop the automated sequence.',
  },
];

export const supervisionSequence: EmailSequenceStep[] = [
  {
    timing: 'Immediate',
    title: 'Supervisor application received',
    subject: 'We received your BehaviorSchool supervisor application',
    audience: 'BCBA who submitted a Supervisor Marketplace application',
    objective: 'Confirm receipt and set a clear expectation for review.',
  },
  {
    timing: 'Immediate',
    title: 'Supervisor application review',
    subject: 'Supervisor application from {Applicant}',
    audience: 'Behavior School administrator',
    objective: 'Make sure every marketplace application receives a human review.',
  },
  {
    timing: 'Immediate',
    title: 'Supervisor application approved',
    subject: 'Your BehaviorSchool supervisor application was approved',
    audience: 'Approved Supervisor Marketplace applicant',
    objective: 'Move the approved applicant into creating a public listing with the verified email address.',
  },
  {
    timing: 'Immediate',
    title: 'Supervisor application rejected',
    subject: 'Update on your BehaviorSchool supervisor application',
    audience: 'Supervisor Marketplace applicant who was not approved',
    objective: 'Communicate the decision clearly and provide the human review note.',
  },
  {
    timing: 'Immediate',
    title: 'New supervision request',
    subject: '{Supervisee} requested supervision',
    audience: 'Supervisor receiving a marketplace request',
    objective: 'Prompt a clear accept or decline decision.',
  },
  {
    timing: 'Immediate',
    title: 'Request sent',
    subject: 'Your supervision request was sent to {Supervisor}',
    audience: 'Supervisee who sent a marketplace request',
    objective: 'Confirm delivery and explain that the next email will contain the decision.',
  },
  {
    timing: 'Immediate',
    title: 'Request accepted',
    subject: '{Supervisor} accepted your supervision request',
    audience: 'Supervisee whose request was accepted',
    objective: 'Confirm the connection and move the supervisee into setup and hour tracking.',
  },
  {
    timing: 'Immediate',
    title: 'Request declined',
    subject: 'Update on your request to {Supervisor}',
    audience: 'Supervisee whose request was declined',
    objective: 'Close the request respectfully and return the user to the directory.',
  },
  {
    timing: 'Immediate',
    title: 'Connection code created',
    subject: 'Your supervision connection code is {Code}',
    audience: 'Supervisee who generated an invite code',
    objective: 'Give the supervisee a durable copy of the code and explain exactly how to connect.',
  },
  {
    timing: 'Immediate',
    title: 'Connection confirmed',
    subject: 'You are now connected with {Name}',
    audience: 'Both people after an invite-code connection',
    objective: 'Confirm shared access and direct each role to the correct workspace.',
  },
  {
    timing: 'Immediate',
    title: 'Connection removed',
    subject: 'Supervision connection with {Name} ended',
    audience: 'Both people after a supervision connection is removed',
    objective: 'Confirm access removal and preserve clarity about personal records.',
  },
  {
    timing: 'Immediate',
    title: 'Monthly form submitted',
    subject: '{Supervisee} submitted {Month} for review',
    audience: 'Connected supervisor',
    objective: 'Move a submitted monthly form into review.',
  },
  {
    timing: 'Immediate',
    title: 'Monthly form approved',
    subject: '{Month} was approved',
    audience: 'Supervisee after supervisor signature',
    objective: 'Confirm approval and point to the permanent record.',
  },
  {
    timing: 'Immediate',
    title: 'Monthly form correction',
    subject: '{Month} needs a correction',
    audience: 'Supervisee after a form is returned',
    objective: 'Prompt the user to review the supervisor note, correct, and resubmit.',
  },
  {
    timing: 'Immediate',
    title: 'Reading assigned',
    subject: '{Supervisor} assigned a reading: {Title}',
    audience: 'Supervisee receiving a reading assignment',
    objective: 'Move the assignment from the supervisor dashboard into the supervisee workflow.',
  },
  {
    timing: 'Immediate',
    title: 'Reading completed',
    subject: '{Supervisee} completed {Title}',
    audience: 'Supervisor after a reflection is submitted',
    objective: 'Prompt review, revision, or next-session discussion.',
  },
  {
    timing: 'Immediate',
    title: 'Reading reviewed',
    subject: '{Supervisor} reviewed {Title}',
    audience: 'Supervisee after supervisor review',
    objective: 'Communicate revision or next-session action without exposing notes in email.',
  },
  {
    timing: 'Immediate',
    title: 'Training assigned',
    subject: '{Supervisor} assigned {Title}',
    audience: 'Supervisee receiving a training module',
    objective: 'Move the user directly into the assigned training.',
  },
  {
    timing: 'Immediate',
    title: 'Training completed',
    subject: '{Supervisee} completed {Title}',
    audience: 'Supervisor after module completion',
    objective: 'Prompt review and a clear next supervision decision.',
  },
  {
    timing: 'Immediate',
    title: 'Session note saved',
    subject: '{Supervisor} saved a supervision note',
    audience: 'Supervisee after a session record is saved',
    objective: 'Make the shared session record visible while keeping note content inside the app.',
  },
  {
    timing: 'Immediate',
    title: 'Study practice assigned',
    subject: '{Supervisor} assigned a Study practice set',
    audience: 'Supervisee receiving focused Study practice',
    objective: 'Move a supervision assignment into the Study app with a direct action.',
  },
  {
    timing: 'Immediate',
    title: 'Study practice completed',
    subject: '{Supervisee} completed a Study practice assignment',
    audience: 'Supervisor after the assigned question target is completed',
    objective: 'Prompt review of accuracy and the next supervision decision.',
  },
  {
    timing: 'Immediate',
    title: 'Study practice reviewed',
    subject: '{Supervisor} reviewed your Study assignment',
    audience: 'Supervisee after the supervisor closes the review',
    objective: 'Confirm review and return the learner to the next study action.',
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
    id: 'supervision-workspace',
    name: 'BehaviorSchool Supervision',
    audience: 'Supervisors and supervisees',
    description: 'Transactional connection, monthly-form, assignment, review, and session-record emails. Delivery remains gated until copy approval.',
    status: 'manual',
    provider: 'Convex lifecycle events + Resend',
    managementHref: 'https://supervision.behaviorschool.com/dashboard/supervisor',
    managementLabel: 'Open supervision workspace',
    sequence: supervisionSequence,
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
    audience: 'BehaviorSchool Pro and Learning Library leads',
    description: 'Launch and waitlist messaging needs a defined sequence before these products are promoted.',
    status: 'planned',
    provider: 'Resend (planned)',
    managementHref: '/admin/email-templates',
    managementLabel: 'Create launch templates',
    sequence: [],
  },
];
