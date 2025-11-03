"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  FileText, 
  Users, 
  BookOpen,
  Target,
  Settings,
  BarChart3,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';

interface PageInfo {
  path: string;
  title: string;
  description: string;
  status: 'live' | 'planned' | 'draft';
  cluster: string;
  priority: 'high' | 'medium' | 'low';
  lastUpdated?: string;
  seoScore?: number;
}

interface ClusterInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  pages: PageInfo[];
}

export default function SiteMapViewer() {
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const clusters: ClusterInfo[] = [
    {
      name: "BCBA Exam Preparation",
      description: "Study tools, practice tests, and exam prep resources",
      icon: <BookOpen className="w-5 h-5" />,
      color: "bg-blue-100 text-blue-800",
      pages: [
        { path: "/behavior-study-tools", title: "BCBA Study Tools", description: "Main hub for BCBA exam preparation", status: "live", cluster: "BCBA Exam Prep", priority: "high" },
        { path: "/bcba-exam-prep", title: "BCBA Exam Prep", description: "Alternative entry point for exam preparation", status: "live", cluster: "BCBA Exam Prep", priority: "high" },
        { path: "/bcba-study-fluency", title: "BCBA Study Fluency", description: "Fluency training tool", status: "live", cluster: "BCBA Exam Prep", priority: "medium" },
        { path: "/bcba-mock-practice-test", title: "BCBA Mock Practice Test", description: "Practice testing platform", status: "live", cluster: "BCBA Exam Prep", priority: "medium" },
        { path: "/bcba-exam-study-guide", title: "BCBA Exam Study Guide", description: "Comprehensive study guide", status: "planned", cluster: "BCBA Exam Prep", priority: "high" },
        { path: "/bcba-pass-rate-statistics", title: "BCBA Pass Rate Statistics", description: "Pass rate data and tips", status: "planned", cluster: "BCBA Exam Prep", priority: "medium" },
        { path: "/bcba-exam-difficulty", title: "BCBA Exam Difficulty", description: "What makes the exam challenging", status: "planned", cluster: "BCBA Exam Prep", priority: "medium" },
        { path: "/bcba-study-schedule", title: "BCBA Study Schedule", description: "Study timeline and planning", status: "planned", cluster: "BCBA Exam Prep", priority: "medium" },
      ]
    },
    {
      name: "School-Based BCBA Practice",
      description: "Resources for BCBAs working in school settings",
      icon: <Users className="w-5 h-5" />,
      color: "bg-green-100 text-green-800",
      pages: [
        { path: "/school-based-bcba", title: "School-Based BCBA", description: "Main hub for school-based practice", status: "live", cluster: "School-Based BCBA", priority: "high" },
        { path: "/school-based-behavior-support", title: "School-Based Behavior Support", description: "Systems and support strategies", status: "live", cluster: "School-Based BCBA", priority: "high" },
        { path: "/transformation-program", title: "Transformation Program", description: "8-week professional development program", status: "live", cluster: "School-Based BCBA", priority: "high" },
        { path: "/school-bcba-salary", title: "School BCBA Salary", description: "Salary information and negotiations", status: "planned", cluster: "School-Based BCBA", priority: "high" },
        { path: "/school-bcba-job-description", title: "School BCBA Job Description", description: "Role responsibilities and expectations", status: "planned", cluster: "School-Based BCBA", priority: "medium" },
        { path: "/school-bcba-vs-clinical-bcba", title: "School BCBA vs Clinical BCBA", description: "Practice setting differences", status: "planned", cluster: "School-Based BCBA", priority: "medium" },
        { path: "/school-bcba-interview-questions", title: "School BCBA Interview Questions", description: "Job interview preparation", status: "planned", cluster: "School-Based BCBA", priority: "medium" },
        { path: "/school-bcba-burnout", title: "School BCBA Burnout", description: "Preventing and managing burnout", status: "planned", cluster: "School-Based BCBA", priority: "high" },
      ]
    },
    {
      name: "IEP Goals & Documentation",
      description: "IEP goal writing tools and templates",
      icon: <Target className="w-5 h-5" />,
      color: "bg-purple-100 text-purple-800",
      pages: [
        { path: "/iep-goals", title: "IEP Goals Generator", description: "AI-powered goal generator", status: "live", cluster: "IEP Goals", priority: "high" },
        { path: "/iep-behavior-goals", title: "IEP Behavior Goals", description: "Templates and examples", status: "live", cluster: "IEP Goals", priority: "high" },
        { path: "/iep-goals-examples", title: "IEP Goals Examples", description: "Comprehensive goal examples by domain", status: "planned", cluster: "IEP Goals", priority: "high" },
        { path: "/iep-goal-bank", title: "IEP Goal Bank", description: "Searchable database of goals", status: "planned", cluster: "IEP Goals", priority: "medium" },
        { path: "/measurable-iep-goals-checklist", title: "Measurable IEP Goals Checklist", description: "Quality assurance guide", status: "planned", cluster: "IEP Goals", priority: "medium" },
        { path: "/iep-goals-for-autism", title: "IEP Goals for Autism", description: "Autism-specific goals", status: "planned", cluster: "IEP Goals", priority: "high" },
        { path: "/iep-goals-for-adhd", title: "IEP Goals for ADHD", description: "ADHD-focused objectives", status: "planned", cluster: "IEP Goals", priority: "medium" },
        { path: "/iep-transition-goals", title: "IEP Transition Goals", description: "Post-secondary planning", status: "planned", cluster: "IEP Goals", priority: "medium" },
      ]
    },
    {
      name: "Behavior Intervention Plans",
      description: "BIP writing tools and implementation guides",
      icon: <FileText className="w-5 h-5" />,
      color: "bg-orange-100 text-orange-800",
      pages: [
        { path: "/behavior-plans", title: "Behavior Plans", description: "BIP writing tool", status: "live", cluster: "Behavior Plans", priority: "high" },
        { path: "/functional-behavior-assessment-guide", title: "Functional Behavior Assessment Guide", description: "FBA process walkthrough", status: "planned", cluster: "Behavior Plans", priority: "high" },
        { path: "/behavior-intervention-plan-examples", title: "Behavior Intervention Plan Examples", description: "Sample BIPs", status: "planned", cluster: "Behavior Plans", priority: "medium" },
        { path: "/crisis-management-in-schools", title: "Crisis Management in Schools", description: "Emergency procedures", status: "planned", cluster: "Behavior Plans", priority: "high" },
        { path: "/positive-behavior-support", title: "Positive Behavior Support", description: "Proactive strategies", status: "planned", cluster: "Behavior Plans", priority: "medium" },
        { path: "/behavior-data-collection", title: "Behavior Data Collection", description: "Data systems and tracking", status: "planned", cluster: "Behavior Plans", priority: "medium" },
        { path: "/antecedent-strategies", title: "Antecedent Strategies", description: "Prevention techniques", status: "planned", cluster: "Behavior Plans", priority: "medium" },
        { path: "/replacement-behaviors", title: "Replacement Behaviors", description: "Teaching alternatives", status: "planned", cluster: "Behavior Plans", priority: "medium" },
      ]
    },
    {
      name: "BCBA Supervision & Professional Development",
      description: "Supervision tools and career development resources",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-indigo-100 text-indigo-800",
      pages: [
        { path: "/supervisors", title: "Supervisors", description: "Supervision tools and resources", status: "live", cluster: "Supervision", priority: "high" },
        { path: "/rbt-supervision-requirements", title: "RBT Supervision Requirements", description: "BACB requirements guide", status: "planned", cluster: "Supervision", priority: "high" },
        { path: "/bcba-fieldwork-tracking", title: "BCBA Fieldwork Tracking", description: "Hours documentation", status: "planned", cluster: "Supervision", priority: "medium" },
        { path: "/supervision-documentation", title: "Supervision Documentation", description: "Record keeping", status: "planned", cluster: "Supervision", priority: "medium" },
        { path: "/bcba-supervisor-training", title: "BCBA Supervisor Training", description: "How to become a supervisor", status: "planned", cluster: "Supervision", priority: "medium" },
        { path: "/supervision-models", title: "Supervision Models", description: "Different approaches", status: "planned", cluster: "Supervision", priority: "low" },
        { path: "/remote-supervision-tools", title: "Remote Supervision Tools", description: "Virtual supervision", status: "planned", cluster: "Supervision", priority: "medium" },
        { path: "/supervision-challenges", title: "Supervision Challenges", description: "Common problems/solutions", status: "planned", cluster: "Supervision", priority: "medium" },
      ]
    },
    {
      name: "Applied Behavior Analysis in Education",
      description: "ABA strategies and educational applications",
      icon: <Globe className="w-5 h-5" />,
      color: "bg-teal-100 text-teal-800",
      pages: [
        { path: "/community", title: "Community", description: "Professional community hub", status: "live", cluster: "ABA Education", priority: "high" },
        { path: "/about", title: "About", description: "Company information", status: "live", cluster: "ABA Education", priority: "medium" },
        { path: "/blog", title: "Blog", description: "Educational content and articles", status: "live", cluster: "ABA Education", priority: "high" },
        { path: "/resources", title: "Resources", description: "Resource library", status: "live", cluster: "ABA Education", priority: "medium" },
        { path: "/pbis-implementation-guide", title: "PBIS Implementation Guide", description: "School-wide PBIS", status: "planned", cluster: "ABA Education", priority: "high" },
        { path: "/mtss-behavior-tier-interventions", title: "MTSS Behavior Tier Interventions", description: "Multi-tiered supports", status: "planned", cluster: "ABA Education", priority: "high" },
        { path: "/classroom-behavior-management", title: "Classroom Behavior Management", description: "Teacher strategies", status: "planned", cluster: "ABA Education", priority: "medium" },
        { path: "/aba-teaching-strategies", title: "ABA Teaching Strategies", description: "Educational applications", status: "planned", cluster: "ABA Education", priority: "medium" },
        { path: "/social-skills-instruction", title: "Social Skills Instruction", description: "Social learning strategies", status: "planned", cluster: "ABA Education", priority: "medium" },
        { path: "/autism-support-in-schools", title: "Autism Support in Schools", description: "Autism-specific strategies", status: "planned", cluster: "ABA Education", priority: "high" },
      ]
    },
    {
      name: "Core Pages & Navigation",
      description: "Main site pages and user flows",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "bg-gray-100 text-gray-800",
      pages: [
        { path: "/", title: "Homepage", description: "Main landing page", status: "live", cluster: "Core Pages", priority: "high" },
        { path: "/products", title: "Products", description: "Product overview page", status: "live", cluster: "Core Pages", priority: "medium" },
        { path: "/act-matrix", title: "ACT Matrix", description: "ACT Matrix tool and resources", status: "live", cluster: "Core Pages", priority: "medium" },
        { path: "/study", title: "Study", description: "Study resources page", status: "live", cluster: "Core Pages", priority: "medium" },
        { path: "/not-found", title: "404 Page", description: "Page not found error page", status: "live", cluster: "Core Pages", priority: "low" },
      ]
    },
    {
      name: "Admin & Management",
      description: "Administrative tools and management interfaces",
      icon: <Settings className="w-5 h-5" />,
      color: "bg-red-100 text-red-800",
      pages: [
        { path: "/admin", title: "Admin Dashboard", description: "Main admin dashboard", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/analytics", title: "Analytics Dashboard", description: "Site analytics and metrics", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/signups", title: "Signups Management", description: "Manage user signups", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/leads", title: "Leads", description: "Lead magnets & email captures", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/users", title: "User Management", description: "Manage user accounts", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/blog", title: "Blog Management", description: "Manage blog posts", status: "live", cluster: "Admin", priority: "medium" },
        { path: "/admin/blog/editor", title: "Blog Editor", description: "Create and edit blog posts", status: "live", cluster: "Admin", priority: "medium" },
        { path: "/admin/listmonk", title: "Newsletter (Listmonk)", description: "Manage lists and campaigns", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/login", title: "Admin Login", description: "Admin authentication", status: "live", cluster: "Admin", priority: "high" },
        { path: "/admin/simple-login", title: "Simple Admin Login", description: "Simplified admin login", status: "live", cluster: "Admin", priority: "medium" },
        { path: "/admin/indexnow", title: "IndexNow", description: "Search engine indexing tool", status: "live", cluster: "Admin", priority: "low" },
      ]
    }
  ];

  const toggleCluster = (clusterName: string) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(clusterName)) {
      newExpanded.delete(clusterName);
    } else {
      newExpanded.add(clusterName);
    }
    setExpandedClusters(newExpanded);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'planned':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'draft':
        return <AlertCircle className="w-4 h-4 text-orange-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePageClick = (page: PageInfo) => {
    // Open in new tab
    window.open(page.path, '_blank');
  };

  const livePages = clusters.reduce((acc, cluster) => acc + cluster.pages.filter(p => p.status === 'live').length, 0);
  const plannedPages = clusters.reduce((acc, cluster) => acc + cluster.pages.filter(p => p.status === 'planned').length, 0);
  const totalPages = clusters.reduce((acc, cluster) => acc + cluster.pages.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Site Map & Page Overview</h2>
          <p className="text-slate-600 mt-1">
            Comprehensive view of all pages organized by topic clusters
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-600">
            <span className="font-medium">{livePages}</span> live • <span className="font-medium">{plannedPages}</span> planned • <span className="font-medium">{totalPages}</span> total
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Live Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{livePages}</div>
            <p className="text-xs text-slate-600">Pages currently live and accessible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-600">Planned Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{plannedPages}</div>
            <p className="text-xs text-slate-600">Pages planned for future development</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-600">{totalPages}</div>
            <p className="text-xs text-slate-600">All pages across all clusters</p>
          </CardContent>
        </Card>
      </div>

      {/* Manual GSC Submission */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900">Manual GSC Submission</CardTitle>
          <CardDescription>
            Quick links to copy URLs and open Google Search Console&apos;s URL Inspection for manual indexing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { path: '/iep-goal-qualitychecker', label: 'IEP Goal Quality Checker', domain: 'behaviorschool.com' },
            { path: '/school-bcba', label: 'School BCBA Hub', domain: 'behaviorschool.com' },
            { path: '/school-bcba/vs-school-based-bcba', label: 'VS: School vs School-Based BCBA', domain: 'behaviorschool.com' },
            { path: '/school-bcba/job-guide', label: 'School BCBA Job Guide', domain: 'behaviorschool.com' },
            { path: '/school-bcba/salary-by-state', label: 'Salary by State', domain: 'behaviorschool.com' },
            { path: '/school-bcba/how-to-become', label: 'How to Become a School BCBA', domain: 'behaviorschool.com' },
            { path: '/', label: 'Study Platform Homepage', domain: 'study.behaviorschool.com' },
            { path: '/quiz', label: 'Study Quiz', domain: 'study.behaviorschool.com' },
            { path: '/flashcards', label: 'Study Flashcards', domain: 'study.behaviorschool.com' },
            { path: '/practice-test', label: 'Study Practice Test', domain: 'study.behaviorschool.com' },
          ].map(({ path, label, domain }) => {
            const full = `https://${domain}${path}`;
            const gsc = `https://search.google.com/search-console/inspect?resource_id=${encodeURIComponent(`https://${domain}`)}&url=${encodeURIComponent(full)}`;
            const copied = copiedPath === `${domain}${path}`;
            return (
              <div key={`${domain}${path}`} className="flex items-center justify-between gap-3 border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{label}</div>
                  <div className="text-xs text-slate-600 truncate">{full}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(full).then(() => setCopiedPath(`${domain}${path}`));
                      setTimeout(() => setCopiedPath(null), 1500);
                    }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {copied ? 'Copied' : 'Copy URL'}
                  </Button>
                  <a href={full} target="_blank" rel="noopener" className="text-xs px-3 py-2 border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50 transition-colors font-medium">Open</a>
                  <a href={gsc} target="_blank" rel="noopener" className="text-xs px-3 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-semibold">Open in GSC</a>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Topic Clusters */}
      <div className="space-y-4">
        {clusters.map((cluster) => (
          <Card key={cluster.name} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleCluster(cluster.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${cluster.color}`}>
                    {cluster.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{cluster.name}</CardTitle>
                    <CardDescription>{cluster.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className={cluster.color}>
                    {cluster.pages.length} pages
                  </Badge>
                  {expandedClusters.has(cluster.name) ? (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedClusters.has(cluster.name) && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cluster.pages.map((page) => (
                    <div
                      key={page.path}
                      className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => handlePageClick(page)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(page.status)}
                          <h4 className="font-medium text-slate-900 text-sm">{page.title}</h4>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400" />
                      </div>
                      
                      <p className="text-xs text-slate-600 mb-3 line-clamp-2">{page.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {page.path}
                        </Badge>
                        <Badge className={`text-xs ${getPriorityColor(page.priority)}`}>
                          {page.priority}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            How to Use This Site Map
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">1</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Click on any cluster to expand and see all pages</p>
              <p className="text-xs text-slate-600">Each cluster represents a topic area with related pages</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">2</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Click on any page card to open it in a new tab</p>
              <p className="text-xs text-slate-600">This allows you to view and test each page</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">3</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Use the status indicators to understand page state</p>
              <p className="text-xs text-slate-600">
                <span className="inline-flex items-center gap-1"><CheckCircle className="w-3 h-3 text-green-600" /> Live</span> • 
                <span className="inline-flex items-center gap-1 ml-2"><Clock className="w-3 h-3 text-yellow-600" /> Planned</span> • 
                <span className="inline-flex items-center gap-1 ml-2"><AlertCircle className="w-3 h-3 text-orange-600" /> Draft</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-medium text-blue-600">4</span>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Priority levels help focus development efforts</p>
              <p className="text-xs text-slate-600">
                <span className="inline-flex items-center gap-1"><Badge className="bg-red-100 text-red-800 text-xs">High</Badge></span> • 
                <span className="inline-flex items-center gap-1 ml-2"><Badge className="bg-yellow-100 text-yellow-800 text-xs">Medium</Badge></span> • 
                <span className="inline-flex items-center gap-1 ml-2"><Badge className="bg-green-100 text-green-800 text-xs">Low</Badge></span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
