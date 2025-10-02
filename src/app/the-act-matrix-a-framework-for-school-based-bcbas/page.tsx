import { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Target, Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SimpleDownloadButton from "@/components/SimpleDownloadButton";

export const metadata: Metadata = {
  title: "The ACT Matrix: A Framework for School-Based BCBAs | Complete Guide",
  description: "Learn how the ACT Matrix framework transforms school-based BCBA practice. Complete guide with examples, implementation strategies, and free PDF resources for behavior analysts in schools.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  keywords: [
    "act matrix framework",
    "school based bcba", 
    "act matrix bcba",
    "acceptance commitment therapy schools",
    "school bcba framework",
    "act matrix behavior analyst",
    "school based behavior analysis",
    "bcba act matrix training",
    "psychological flexibility schools",
    "values based behavior support",
    "act matrix implementation",
    "school bcba practice",
    "behavior analyst framework",
    "act matrix guide"
  ],
  openGraph: {
    title: "The ACT Matrix: A Framework for School-Based BCBAs | Complete Guide",
    description: "Comprehensive guide to using the ACT Matrix framework in school-based BCBA practice. Learn implementation strategies, see real examples, and download free resources.",
    type: "article", 
    url: "https://behaviorschool.com/the-act-matrix-a-framework-for-school-based-bcbas",
    images: [
      {
        url: "https://behaviorschool.com/thumbnails/act-matrix-thumb.webp",
        width: 1200,
        height: 630,
        alt: "The ACT Matrix Framework for School-Based BCBAs"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The ACT Matrix: A Framework for School-Based BCBAs | Complete Guide",
    description: "Comprehensive guide to using the ACT Matrix framework in school-based BCBA practice. Learn implementation strategies, see real examples, and download free resources.",
    images: ["https://behaviorschool.com/thumbnails/act-matrix-thumb.webp"]
  },
  alternates: {
    canonical: "https://behaviorschool.com/the-act-matrix-a-framework-for-school-based-bcbas"
  }
};

// Article structured data optimized for best performing URL
const articleStructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The ACT Matrix: A Framework for School-Based BCBAs",
  "description": "Comprehensive guide to implementing the ACT Matrix framework in school-based behavior analysis practice, with real-world examples and practical strategies.",
  "image": "https://behaviorschool.com/thumbnails/act-matrix-thumb.webp",
  "author": {
    "@type": "Person",
    "name": "Rob Spain",
    "jobTitle": "Board Certified Behavior Analyst (BCBA)",
    "url": "https://robspain.com",
    "sameAs": ["https://www.linkedin.com/in/robspain/", "https://behaviorschool.com/about"]
  },
  "publisher": {
    "@type": "Organization", 
    "name": "Behavior School",
    "logo": {
      "@type": "ImageObject",
      "url": "https://behaviorschool.com/Logos/logo-gold-transparent.webp"
    }
  },
  "datePublished": "2024-08-15",
  "dateModified": "2025-01-05",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://behaviorschool.com/the-act-matrix-a-framework-for-school-based-bcbas"
  },
  "about": [
    {
      "@type": "Thing",
      "name": "ACT Matrix"
    },
    {
      "@type": "Thing",
      "name": "School-based BCBA"
    },
    {
      "@type": "Thing",
      "name": "Behavior Analysis"
    }
  ],
  "wordCount": 2500,
  "articleSection": "School-Based Practice"
};

// FAQ Schema for this specific URL
const faqSchema = {
  "@context": "https://schema.org", 
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the ACT Matrix framework for school-based BCBAs?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The ACT Matrix is a visual framework from Acceptance and Commitment Therapy that helps school-based BCBAs guide students in making values-based behavioral choices. It organizes experiences into four quadrants: toward moves, away moves, helpful internal experiences, and unhelpful internal experiences, all centered around student values."
      }
    },
    {
      "@type": "Question",
      "name": "How do school-based BCBAs implement the ACT Matrix?",
      "acceptedAnswer": {
        "@type": "Answer", 
        "text": "School-based BCBAs implement the ACT Matrix by first helping students identify their core values, then mapping behaviors that move toward or away from those values, and finally exploring the internal experiences that influence these choices. This creates a comprehensive framework for values-based behavior intervention."
      }
    },
    {
      "@type": "Question",
      "name": "What makes the ACT Matrix different from traditional BCBA interventions?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Unlike traditional behavior interventions that focus primarily on consequence-based strategies, the ACT Matrix framework emphasizes building psychological flexibility and intrinsic motivation. It helps students make choices based on personal values rather than just avoiding consequences or seeking rewards."
      }
    }
  ]
};

export default function ACTMatrixFrameworkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumbs 
            items={[
              { label: "Blog", href: "/blog" },
              { label: "The ACT Matrix Framework for School-Based BCBAs" }
            ]}
          />
        </nav>
        
        {/* Article Header */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <header className="mb-12">
            <div className="text-center">
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                  School-Based Practice
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                The ACT Matrix: A Framework for School-Based BCBAs
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed">
                How the Acceptance and Commitment Therapy Matrix transforms behavior analysis practice in educational settings
              </p>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                <span>Published August 15, 2024</span>
                <span>•</span>
                <span>Updated January 5, 2025</span>
                <span>•</span>
                <span>12 min read</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          <div className="mb-12">
            <div className="aspect-video bg-gradient-to-br from-emerald-100 to-blue-100 rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/thumbnails/act-matrix-thumb.webp"
                alt="The ACT Matrix Framework for School-Based BCBAs"
                className="w-full h-full object-cover"
                width={800}
                height={450}
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-12">
              <p className="text-xl text-slate-700 leading-relaxed mb-6">
                As a school-based BCBA, you&apos;ve likely encountered students whose behavior challenges seem to resist traditional interventions. You implement function-based interventions, modify antecedents, and adjust consequences, yet some students continue to struggle with motivation, emotional regulation, and behavioral flexibility.
              </p>
              
              <p className="text-lg text-slate-600 mb-6">
                This is where the ACT Matrix framework becomes invaluable. Unlike traditional behavior analytic approaches that focus primarily on external contingencies, the ACT Matrix helps students develop <strong>psychological flexibility</strong> - the ability to stay present with difficult experiences while choosing actions based on what truly matters to them.
              </p>
              
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 my-8">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Key Takeaway</h3>
                <p className="text-emerald-700">
                  The ACT Matrix provides school-based BCBAs with a values-centered framework that complements traditional behavior analysis by building intrinsic motivation and emotional resilience in students.
                </p>
              </div>
            </div>

            {/* What is the ACT Matrix */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">What is the ACT Matrix Framework?</h2>
              
              <p className="text-lg text-slate-600 mb-6">
                The ACT Matrix is a visual tool from Acceptance and Commitment Therapy (ACT) that organizes human experience into four quadrants, all centered around personal values. For school-based BCBAs, it serves as a comprehensive framework for understanding and intervening with complex behavioral presentations.
              </p>

              {/* Visual Matrix */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-8 my-8 shadow-lg">
                <div className="grid grid-cols-2 gap-8 text-center relative">
                  {/* Horizontal and vertical lines */}
                  <div className="absolute inset-x-0 top-1/2 border-t-2 border-slate-400"></div>
                  <div className="absolute inset-y-0 left-1/2 border-l-2 border-slate-400"></div>
                  
                  {/* Quadrants */}
                  <div className="pb-8 pr-4">
                    <h4 className="text-lg font-bold text-red-600 mb-4">Away Moves</h4>
                    <div className="text-sm text-slate-600">
                      • Avoiding difficult tasks<br/>
                      • Acting out behaviors<br/>
                      • Escaping social situations
                    </div>
                  </div>
                  
                  <div className="pb-8 pl-4">
                    <h4 className="text-lg font-bold text-emerald-600 mb-4">Toward Moves</h4>
                    <div className="text-sm text-slate-600">
                      • Asking for help<br/>
                      • Trying new challenges<br/>
                      • Being kind to peers
                    </div>
                  </div>
                  
                  <div className="pt-8 pr-4">
                    <h4 className="text-lg font-bold text-red-600 mb-4">Unhelpful Internal</h4>
                    <div className="text-sm text-slate-600">
                      • &ldquo;I can&apos;t do this&rdquo;<br/>
                      • Feeling anxious<br/>
                      • Fear of failure
                    </div>
                  </div>
                  
                  <div className="pt-8 pl-4">
                    <h4 className="text-lg font-bold text-emerald-600 mb-4">Helpful Internal</h4>
                    <div className="text-sm text-slate-600">
                      • &ldquo;I can learn from mistakes&rdquo;<br/>
                      • Feeling motivated<br/>
                      • Curiosity about learning
                    </div>
                  </div>
                  
                  {/* Center circle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-yellow-100 border-2 border-yellow-500 rounded-full w-24 h-24 flex items-center justify-center">
                      <div className="text-yellow-800 font-bold text-sm text-center">Student Values</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-slate-600 mb-6">
                This framework recognizes that all behavior occurs in a context of internal experiences (thoughts, feelings, sensations) and that sustainable behavior change happens when students connect with their deeper values and purposes.
              </p>
            </section>

            {/* Why School-Based BCBAs Need This */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Why School-Based BCBAs Need the ACT Matrix</h2>
              
              <p className="text-lg text-slate-600 mb-6">
                Traditional behavior analytic interventions excel at addressing function-based behaviors through environmental modifications and contingency management. However, school-based BCBAs often encounter situations where:
              </p>
              
              <div className="grid md:grid-cols-2 gap-8 my-8">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-red-800 mb-4">Traditional Challenges</h4>
                  <ul className="text-red-700 space-y-2">
                    <li>• Students comply but lack intrinsic motivation</li>
                    <li>• Behaviors return when external supports are removed</li>
                    <li>• Emotional regulation difficulties persist</li>
                    <li>• Students struggle with novel situations</li>
                    <li>• Limited generalization across settings</li>
                  </ul>
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-emerald-800 mb-4">ACT Matrix Solutions</h4>
                  <ul className="text-emerald-700 space-y-2">
                    <li>• Builds psychological flexibility and resilience</li>
                    <li>• Develops values-based decision making</li>
                    <li>• Improves emotional acceptance and regulation</li>
                    <li>• Enhances self-directed behavior change</li>
                    <li>• Promotes generalization through values</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Implementation for BCBAs */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Implementing the ACT Matrix in Your BCBA Practice</h2>
              
              <p className="text-lg text-slate-600 mb-8">
                Here&apos;s a step-by-step approach to integrating the ACT Matrix framework into your school-based behavior analysis practice:
              </p>
              
              <div className="space-y-8">
                <div className="bg-slate-50 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">1</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-slate-900 mb-3">Values Assessment and Exploration</h4>
                      <p className="text-slate-600 mb-4">
                        Begin by helping the student identify what truly matters to them. Use age-appropriate language and activities to explore values across domains like relationships, learning, personal growth, and contribution to others.
                      </p>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-medium text-slate-900 mb-2">BCBA Tip:</p>
                        <p className="text-sm text-slate-600">
                          For younger students, use concrete examples: &ldquo;What kind of friend do you want to be?&rdquo; For older students, explore abstract concepts like integrity, growth, and purpose.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">2</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-slate-900 mb-3">Behavioral Analysis Through the Matrix</h4>
                      <p className="text-slate-600 mb-4">
                        Map current behaviors into &ldquo;toward moves&rdquo; (behaviors that move the student toward their values) and &ldquo;away moves&rdquo; (behaviors that move them away from their values). This reframes problem behaviors as ineffective attempts to cope rather than just &ldquo;bad&rdquo; behaviors.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">3</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-slate-900 mb-3">Internal Experience Mapping</h4>
                      <p className="text-slate-600 mb-4">
                        Help students identify the thoughts, feelings, and physical sensations that show up when they engage in toward or away moves. Normalize all internal experiences while focusing on behavioral choice.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">4</div>
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-slate-900 mb-3">Integration with Traditional BA Interventions</h4>
                      <p className="text-slate-600 mb-4">
                        Use the ACT Matrix to inform your traditional behavior analytic interventions. Design reinforcement systems that support values-based behaviors and help students understand how environmental supports can facilitate toward moves.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Case Examples */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Real-World Case Examples</h2>
              
              <div className="space-y-8">
                <div className="border border-slate-200 rounded-xl p-8">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Case 1: Middle School Student with Task Avoidance</h4>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <p className="text-slate-600 mb-4">
                        <strong>Traditional Approach:</strong> Implemented escape extinction and positive reinforcement for task completion.
                      </p>
                      <p className="text-red-600 font-medium">
                        Result: Compliance during intervention but return to avoidance when supports removed.
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-slate-600 mb-4">
                        <strong>ACT Matrix Integration:</strong> Discovered student valued &ldquo;being smart and helpful to others.&rdquo;
                      </p>
                      <p className="text-emerald-600 font-medium">
                        Result: Student began viewing challenging tasks as opportunities to grow and help classmates.
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 p-6 rounded-lg">
                    <p className="text-emerald-800">
                      <strong>Key Learning:</strong> By connecting task engagement to the student&apos;s values of learning and helping others, intrinsic motivation increased and behavior generalized across settings.
                    </p>
                  </div>
                </div>
                
                <div className="border border-slate-200 rounded-xl p-8">
                  <h4 className="text-xl font-semibold text-slate-900 mb-4">Case 2: High School Student with Social Anxiety</h4>
                  
                  <p className="text-slate-600 mb-6">
                    Student valued friendship and belonging but engaged in social avoidance due to anxiety. The ACT Matrix helped differentiate between helpful anxiety (alerting to social cues) and unhelpful anxiety (leading to avoidance).
                  </p>
                  
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Intervention Integration:</strong> Combined systematic desensitization with values-based exposure. Student practiced &ldquo;brave moves toward friendship&rdquo; rather than just &ldquo;exposure trials.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Training and Implementation */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Building Your ACT Matrix Skills</h2>
              
              <p className="text-lg text-slate-600 mb-6">
                Implementing the ACT Matrix effectively requires specific training and practice. Here&apos;s how to develop competency in this framework:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Foundational Training</h4>
                  <p className="text-slate-600">
                    Study ACT principles, attend workshops, and practice personal matrix work to understand the framework deeply.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Supervised Practice</h4>
                  <p className="text-slate-600">
                    Start with simple cases under supervision, gradually building complexity as competency develops.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Peer Consultation</h4>
                  <p className="text-slate-600">
                    Join consultation groups with other BCBAs using ACT-informed approaches to share cases and strategies.
                  </p>
                </div>
              </div>
            </section>

            {/* Conclusion and CTA */}
            <section className="mb-12">
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Transform Your School-Based Practice</h2>
                
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                  The ACT Matrix framework represents a powerful evolution in school-based behavior analysis, combining the precision of behavior science with the depth of values-based intervention.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <SimpleDownloadButton 
                    resource="act-matrix"
                    fileName="ACT-Matrix-for-Schools-Guide.pdf"
                    title="ACT Matrix for Schools Guide"
                    buttonText="Download Free ACT Matrix Guide"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-xl"
                  />
                  
                  <Button asChild variant="outline" size="lg" className="px-8 py-3 rounded-xl">
                    <Link href="/transformation-program">
                      Get Complete BCBA Training
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className="text-sm text-slate-500">
                  Join 1,000+ school-based BCBAs already using these evidence-based approaches
                </div>
              </div>
            </section>

            {/* ACT Matrix Resource Collection */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Complete ACT Matrix Resource Collection</h2>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-8 mb-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-emerald-800 mb-4">ACT Matrix Main Resource Hub</h3>
                  <p className="text-emerald-700 mb-6">
                    Access our comprehensive ACT Matrix guide with free PDF downloads, examples, and step-by-step implementation instructions.
                  </p>
                  <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    <Link href="/act-matrix">
                      View Main ACT Matrix Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">ACT Implementation Hub</h4>
                  <p className="text-slate-600 mb-4">
                    Central resource hub with implementation guides, research, and practical tools for schools.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/act-matrix-schools-hub">Visit Hub</Link>
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">K-12 ACT Activities</h4>
                  <p className="text-slate-600 mb-4">
                    Classroom-ready ACT activities organized by grade level with implementation guides.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/act-activities-k12-students">View Activities</Link>
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Age-Appropriate ACT Metaphors</h4>
                  <p className="text-slate-600 mb-4">
                    Developmental guide to using ACT metaphors effectively with children and adolescents.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/age-appropriate-act-metaphors">Explore Metaphors</Link>
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Implementation Challenges & Solutions</h4>
                  <p className="text-slate-600 mb-4">
                    Evidence-based solutions to common ACT implementation challenges in school settings.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/act-implementation-challenges-solutions">Find Solutions</Link>
                  </Button>
                </div>
              </div>
            </section>

            {/* Related Articles */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-8">Related School-Based Resources</h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Values-Based IEP Goals</h4>
                  <p className="text-slate-600 mb-4">
                    Learn how to integrate student values into IEP goal development for better outcomes.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/iep-goals">Read More</Link>
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">School BCBA Supervision</h4>
                  <p className="text-slate-600 mb-4">
                    Essential tools and strategies for effective BCBA supervision in school settings.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/supervisors">Read More</Link>
                  </Button>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Behavior Support Systems</h4>
                  <p className="text-slate-600 mb-4">
                    Comprehensive guide to implementing school-wide positive behavior supports.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/school-based-behavior-support">Read More</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </article>
      </div>
    </>
  );
}
