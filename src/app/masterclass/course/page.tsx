'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarNavigation } from '@/components/masterclass/SidebarNavigation';
import { ProgressBar } from '@/components/masterclass/ProgressBar';
import { VideoSection } from '@/components/masterclass/VideoSection';
import { QuizSection } from '@/components/masterclass/QuizSection';
import { Loader2, AlertCircle, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MasterclassProgress, CourseSection } from '@/lib/masterclass/types';

export default function CoursePage() {
  const router = useRouter();
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentSection, setCurrentSection] = useState(1);
  const [progress, setProgress] = useState<MasterclassProgress[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [canGenerateCertificate, setCanGenerateCertificate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseSections, setCourseSections] = useState<CourseSection[]>([]);

  // Check access (admin or enrolled user)
  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/masterclass/check-access');
        const data = await response.json();

        if (!response.ok || !data.hasAccess) {
          // No access, redirect to masterclass landing
          router.push('/masterclass');
          return;
        }

        setIsAdmin(data.isAdmin);
        if (!data.isAdmin && data.enrollmentId) {
          setEnrollmentId(data.enrollmentId);
        }
      } catch (err) {
        console.error('Failed to check access:', err);
        router.push('/masterclass');
      }
    };

    checkAccess();
  }, [router]);

  // Fetch course content and progress when access is confirmed
  useEffect(() => {
    // Skip if still checking access
    if (!isAdmin && !enrollmentId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Always fetch course content
        const courseResponse = await fetch('/api/masterclass/course');
        const courseData = await courseResponse.json();

        if (courseData.success) {
          setCourseSections(courseData.data.sections);
        }

        // Only fetch progress if user is enrolled (not admin)
        if (!isAdmin && enrollmentId) {
          const progressResponse = await fetch(`/api/masterclass/progress?enrollmentId=${enrollmentId}`);
          const progressData = await progressResponse.json();

          if (progressData.success) {
            setProgress(progressData.data.sections);
            setOverallProgress(progressData.data.overallProgress);
            setCanGenerateCertificate(progressData.data.canGenerateCertificate);
          } else {
            setError('Failed to load progress');
          }
        } else if (isAdmin) {
          // Admin viewing mode - no progress tracking
          // Initialize empty progress for all sections
          setProgress([]);
          setOverallProgress(0);
          setCanGenerateCertificate(false);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load course data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [enrollmentId, isAdmin]);

  // Mark video as complete
  const handleMarkVideoComplete = async () => {
    if (!enrollmentId) return;

    try {
      const response = await fetch('/api/masterclass/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          sectionNumber: currentSection,
          type: 'video',
        }),
      });

      if (response.ok) {
        // Refresh progress
        const progressResponse = await fetch(`/api/masterclass/progress?enrollmentId=${enrollmentId}`);
        const progressData = await progressResponse.json();
        setProgress(progressData.data.sections);
        setOverallProgress(progressData.data.overallProgress);
      }
    } catch (err) {
      console.error('Failed to mark video complete:', err);
    }
  };

  // Submit quiz
  const handleQuizSubmit = async (answers: number[]) => {
    // Admin preview: simulate quiz submission without persistence
    if (isAdmin) {
      const section = courseSections.find((s) => s.id === currentSection);
      const total = section?.quiz.length || 0;
      let score = 0;
      const results = (section?.quiz || []).map((q, idx) => {
        const isCorrect = answers[idx] === q.correctAnswer;
        if (isCorrect) score += 1;
        return {
          questionId: q.id,
          questionNumber: idx + 1,
          isCorrect,
          correctAnswer: q.correctAnswer,
          selectedAnswer: answers[idx],
          explanation: q.explanation,
        };
      });

      return {
        score,
        total,
        passed: true,
        results,
      };
    }

    if (!enrollmentId) throw new Error('No enrollment found');

    const response = await fetch('/api/masterclass/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enrollmentId,
        sectionNumber: currentSection,
        type: 'quiz',
        data: { answers },
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to submit quiz');
    }

    // Refresh progress
    const progressResponse = await fetch(`/api/masterclass/progress?enrollmentId=${enrollmentId}`);
    const progressData = await progressResponse.json();
    setProgress(progressData.data.sections);
    setOverallProgress(progressData.data.overallProgress);
    setCanGenerateCertificate(progressData.data.canGenerateCertificate);

    return {
      score: data.data.score,
      total: data.data.total,
      passed: data.data.passed,
      results: data.data.results,
    };
  };

  // Navigate to section
  const handleSectionClick = (sectionId: number) => {
    setCurrentSection(sectionId);
    setSidebarOpen(false); // Close sidebar on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Go to next section
  const handleNextSection = () => {
    if (currentSection < courseSections.length) {
      setCurrentSection(currentSection + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All sections complete, go to certificate
      router.push('/masterclass/certificate');
    }
  };

  // Build section status for sidebar
  const sectionStatuses = courseSections.map((section, index) => {
    const sectionProgress = progress.find(p => p.section_number === section.id);
    const prevSectionProgress = index > 0 ? progress.find(p => p.section_number === index) : null;

    // Section is locked if previous section quiz hasn't been passed
    // Admins can access all sections (no locking)
    const isLocked = isAdmin ? false : index > 0 && (!prevSectionProgress || !prevSectionProgress.quiz_passed);

    return {
      id: section.id,
      title: section.title,
      videoCompleted: sectionProgress?.video_completed || false,
      quizPassed: sectionProgress?.quiz_passed || false,
      isLocked,
      isCurrent: currentSection === section.id,
    };
  });

  const currentSectionConfig = courseSections.find(s => s.id === currentSection);
  const currentSectionProgress = progress.find(p => p.section_number === currentSection);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your course...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Something Went Wrong</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={() => router.push('/masterclass')}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!currentSectionConfig) {
    return null;
  }

  const sectionsCompleted = progress.filter(p => p.video_completed && p.quiz_passed).length;

  return (
    <div className="h-screen flex flex-col bg-slate-50">
      {/* Progress Bar */}
      <ProgressBar
        progress={overallProgress}
        sectionsCompleted={sectionsCompleted}
        totalSections={courseSections.length}
        canGenerateCertificate={canGenerateCertificate}
      />

      {/* Admin Preview Banner */}
      {isAdmin && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-800">
              Admin Preview Mode - Progress is not being tracked
            </p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0 overflow-y-auto">
          <SidebarNavigation
            currentSection={currentSection}
            sections={sectionStatuses}
            progress={overallProgress}
            onSectionClick={handleSectionClick}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[90vw]">
              <SidebarNavigation
                currentSection={currentSection}
                sections={sectionStatuses}
                progress={overallProgress}
                onSectionClick={handleSectionClick}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mobile Menu Button */}
          <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-slate-200 px-4 py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="gap-2"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              Course Sections
            </Button>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 sm:space-y-12">
            {/* Video Section */}
            <VideoSection
              sectionNumber={currentSection}
              title={currentSectionConfig.title}
              description={currentSectionConfig.description}
              videoUrl={currentSectionConfig.videoUrl}
              isCompleted={currentSectionProgress?.video_completed || false}
              onMarkComplete={handleMarkVideoComplete}
            />

            {/* Quiz Section */}
            <QuizSection
              sectionNumber={currentSection}
              questions={currentSectionConfig.quiz}
              isLocked={isAdmin ? false : !currentSectionProgress?.video_completed}
              isPassed={currentSectionProgress?.quiz_passed || false}
              attemptNumber={currentSectionProgress?.quiz_attempts || 0}
              onSubmit={handleQuizSubmit}
              onNextSection={currentSection < courseSections.length ? handleNextSection : undefined}
            />

            {/* Admin Preview Navigation */}
            {isAdmin && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                <Button
                  variant="outline"
                  disabled={currentSection <= 1}
                  onClick={() => handleSectionClick(Math.max(1, currentSection - 1))}
                >
                  Previous Section
                </Button>
                <div className="flex items-center gap-3">
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/admin/masterclass/design')}
                  >
                    Back to Design
                  </Button>
                  <Button
                    onClick={handleNextSection}
                    disabled={currentSection >= courseSections.length}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {currentSection < courseSections.length ? 'Next Section' : 'All Sections Complete'}
                  </Button>
                </div>
              </div>
            )}

            {/* Certificate CTA */}
            {canGenerateCertificate && (
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center text-white">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                  🎉 Congratulations!
                </h2>
                <p className="text-lg sm:text-xl mb-4 sm:mb-6">
                  You&apos;ve completed all sections. Download your CEU certificate now!
                </p>
                <Button
                  onClick={() => router.push('/masterclass/certificate')}
                  className="bg-white text-emerald-600 hover:bg-emerald-50"
                  size="lg"
                >
                  Download Certificate
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
