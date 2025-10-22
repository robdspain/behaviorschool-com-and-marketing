/**
 * Masterclass Course Configuration
 *
 * Defines the course structure, content, and quiz questions
 */

import type { MasterclassCourse, QuizQuestion } from './types';

// Course metadata
export const COURSE_METADATA = {
  title: 'School BCBA Mastery Fundamentals',
  description: 'Essential skills for school-based behavior analysts',
  duration: '1 hour',
  ceuCredits: 1.0,
  bacbProvider: 'OP-25-11420',
  totalSections: 4,
};

// Quiz questions for each section
const section1Quiz: QuizQuestion[] = [
  {
    id: 's1-q1',
    question: 'What is the primary ethical consideration when working as a BCBA in a school setting?',
    options: [
      'Following district policies above all else',
      'Balancing BACB ethics with school regulations',
      'Avoiding conflict with administrators',
      'Prioritizing parent preferences over evidence',
    ],
    correctAnswer: 1,
    explanation: 'BCBAs must balance BACB ethical guidelines with school regulations, maintaining professional standards while working within the educational system.',
  },
  {
    id: 's1-q2',
    question: 'When facing pressure to compromise ethical standards, the best first step is to:',
    options: [
      'Immediately refuse and escalate',
      'Document and seek guidance from BACB',
      'Comply to maintain relationships',
      'Ignore the request',
    ],
    correctAnswer: 1,
    explanation: 'Documenting the situation and seeking guidance from the BACB ensures proper ethical decision-making while maintaining professional relationships.',
  },
  {
    id: 's1-q3',
    question: 'Which scenario represents an ethical boundary violation in schools?',
    options: [
      'Collaborating with special education teachers',
      'Using RBTs outside their scope of practice',
      'Attending IEP meetings',
      'Collecting data on student behavior',
    ],
    correctAnswer: 1,
    explanation: 'Using RBTs outside their defined scope of practice violates BACB ethics and puts students at risk.',
  },
];

const section2Quiz: QuizQuestion[] = [
  {
    id: 's2-q1',
    question: 'The most effective strategy for gaining teacher buy-in is:',
    options: [
      'Mandating compliance through administration',
      'Demonstrating quick wins and celebrating small successes',
      'Providing extensive written documentation',
      'Conducting formal training sessions',
    ],
    correctAnswer: 1,
    explanation: 'Quick wins and celebrating small successes build trust and demonstrate value, leading to authentic buy-in from teachers.',
  },
  {
    id: 's2-q2',
    question: 'When a teacher resists implementing a behavior plan, you should first:',
    options: [
      'Report to administration',
      'Listen to their concerns and collaborate on solutions',
      'Simplify the plan without their input',
      'Find a different teacher',
    ],
    correctAnswer: 1,
    explanation: 'Listening to concerns and collaborating builds relationships and often reveals practical barriers that can be addressed together.',
  },
  {
    id: 's2-q3',
    question: 'Micro-coaching refers to:',
    options: [
      'Short, frequent feedback moments during natural interactions',
      'Formal coaching sessions after school',
      'Written feedback via email',
      'Annual performance reviews',
    ],
    correctAnswer: 0,
    explanation: 'Micro-coaching involves brief, in-the-moment feedback that helps teachers improve without feeling overwhelmed or criticized.',
  },
];

const section3Quiz: QuizQuestion[] = [
  {
    id: 's3-q1',
    question: 'Data-driven decision making in schools is most effective when data is:',
    options: [
      'Comprehensive and detailed',
      'Simple, visual, and actionable',
      'Collected daily by all staff',
      'Stored in complex databases',
    ],
    correctAnswer: 1,
    explanation: 'Simple, visual, and actionable data is more likely to be used by busy school staff to inform instruction and intervention.',
  },
  {
    id: 's3-q2',
    question: 'The primary purpose of progress monitoring data in schools is to:',
    options: [
      'Comply with special education regulations',
      'Prove student progress for administrators',
      'Inform instructional decisions and intervention adjustments',
      'Create reports for parents',
    ],
    correctAnswer: 2,
    explanation: 'While compliance is important, the primary purpose of data is to inform real-time instructional decisions and adjust interventions based on student response.',
  },
  {
    id: 's3-q3',
    question: 'When staff report that data collection is too time-consuming, you should:',
    options: [
      'Insist on current procedures',
      'Eliminate data collection',
      'Simplify data collection methods and identify most critical measures',
      'Hire additional staff',
    ],
    correctAnswer: 2,
    explanation: 'Simplifying methods and focusing on critical measures ensures data collection is sustainable while still providing needed information.',
  },
];

const section4Quiz: QuizQuestion[] = [
  {
    id: 's4-q1',
    question: 'A trauma-informed approach to crisis management prioritizes:',
    options: [
      'Immediate compliance and control',
      'Safety, connection, and learning from the incident',
      'Consequences and discipline',
      'Removing the student from class',
    ],
    correctAnswer: 1,
    explanation: 'Trauma-informed approaches prioritize safety for all, maintaining connection with the student, and using incidents as learning opportunities.',
  },
  {
    id: 's4-q2',
    question: 'The most important element of a crisis response protocol is:',
    options: [
      'Having detailed written procedures',
      'Staff knowing their roles and practicing responses',
      'Having security present',
      'Documenting every incident',
    ],
    correctAnswer: 1,
    explanation: 'Staff need to know their roles and practice responses regularly. Written procedures are useless if staff don\'t know how to implement them.',
  },
  {
    id: 's4-q3',
    question: 'After a crisis incident, the priority should be:',
    options: [
      'Disciplinary action',
      'Debriefing with staff and supporting the student\'s re-entry',
      'Parent notification',
      'Incident report completion',
    ],
    correctAnswer: 1,
    explanation: 'Debriefing helps staff process the incident and ensures the student can successfully re-enter the learning environment with dignity intact.',
  },
];

// Course sections configuration
export const MASTERCLASS_COURSE: MasterclassCourse = {
  title: COURSE_METADATA.title,
  description: COURSE_METADATA.description,
  duration: COURSE_METADATA.duration,
  ceuCredits: COURSE_METADATA.ceuCredits,
  bacbProvider: COURSE_METADATA.bacbProvider,
  sections: [
    {
      id: 1,
      title: 'Ethics in School-Based Practice',
      description: 'Navigate ethical challenges while maintaining BACB compliance and building strong relationships with school administrators and staff.',
      videoUrl: 'https://vimeo.com/1050191710', // Replace with your actual video URL
      duration: '15 min',
      quiz: section1Quiz,
    },
    {
      id: 2,
      title: 'Building Teacher Buy-In',
      description: 'Master proven strategies to gain teacher collaboration, overcome resistance, and create a culture of shared ownership in behavior support.',
      videoUrl: 'https://vimeo.com/1050191710', // Replace with your actual video URL
      duration: '15 min',
      quiz: section2Quiz,
    },
    {
      id: 3,
      title: 'Data-Driven Decision Making',
      description: 'Implement simple, sustainable data systems that inform instruction and demonstrate student progress without overwhelming staff.',
      videoUrl: 'https://vimeo.com/1050191710', // Replace with your actual video URL
      duration: '15 min',
      quiz: section3Quiz,
    },
    {
      id: 4,
      title: 'Crisis Management Protocols',
      description: 'Develop clear, trauma-informed crisis response protocols that keep students and staff safe while maintaining dignity and learning opportunities.',
      videoUrl: 'https://vimeo.com/1050191710', // Replace with your actual video URL
      duration: '15 min',
      quiz: section4Quiz,
    },
  ],
};

// Helper function to get section by ID
export function getSectionById(sectionId: number) {
  return MASTERCLASS_COURSE.sections.find(s => s.id === sectionId);
}

// Helper function to get quiz for a section
export function getQuizForSection(sectionId: number): QuizQuestion[] {
  const section = getSectionById(sectionId);
  return section?.quiz || [];
}

// Calculate total quiz questions
export const TOTAL_QUIZ_QUESTIONS = MASTERCLASS_COURSE.sections.reduce(
  (total, section) => total + section.quiz.length,
  0
);
