'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { RegistrationForm } from '@/components/masterclass/RegistrationForm';
import { Award, Video, FileCheck, Download, Clock, Users } from 'lucide-react';

export default function MasterclassPage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(true);

  const handleEnrollmentSuccess = (enrollmentId: string, email: string) => {
    // Store enrollment info in localStorage for persistence
    localStorage.setItem('masterclass_enrollment', JSON.stringify({
      enrollmentId,
      email,
      timestamp: new Date().toISOString(),
    }));

    // Redirect to course interface
    router.push('/masterclass/course');
  };

  const handleExistingUser = (email: string) => {
    // Redirect existing users to course
    router.push('/masterclass/course');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/20 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/20 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full mb-6"
            >
              <Award className="w-5 h-5" />
              <span className="text-sm font-bold">FREE MASTERCLASS • 1 BACB CEU</span>
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
              School BCBA Mastery<br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Fundamentals
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-8">
              Master the essential skills every school-based BCBA needs to lead with confidence, build collaborative teams, and create sustainable systems.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">1 Hour Total</span>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">4 Video Sections</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">1.0 CEU Credits</span>
              </div>
            </div>
          </motion.div>

          {/* Registration Form */}
          {showForm && (
            <RegistrationForm
              onSuccess={handleEnrollmentSuccess}
              onExistingUser={handleExistingUser}
            />
          )}
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              What You&apos;ll Learn
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Four comprehensive sections covering the most critical skills for school-based BCBAs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                number: 1,
                title: 'Ethics in School-Based Practice',
                duration: '15 min',
                description: 'Navigate the complex ethical landscape of school settings while maintaining BACB compliance and building strong relationships with administrators.',
                icon: FileCheck,
                color: 'red',
              },
              {
                number: 2,
                title: 'Building Teacher Buy-In',
                duration: '15 min',
                description: 'Master proven strategies to gain teacher collaboration, overcome resistance, and create a culture of shared ownership in behavior support.',
                icon: Users,
                color: 'blue',
              },
              {
                number: 3,
                title: 'Data-Driven Decision Making',
                duration: '15 min',
                description: 'Implement simple, sustainable data systems that inform instruction and demonstrate student progress without overwhelming staff.',
                icon: Award,
                color: 'purple',
              },
              {
                number: 4,
                title: 'Crisis Management Protocols',
                duration: '15 min',
                description: 'Develop clear, trauma-informed crisis response protocols that keep students and staff safe while maintaining dignity and learning opportunities.',
                icon: FileCheck,
                color: 'emerald',
              },
            ].map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`bg-${section.color}-50 border-2 border-${section.color}-200 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br from-${section.color}-500 to-${section.color}-600 rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0`}>
                    {section.number}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-900">
                        {section.title}
                      </h3>
                      <span className="text-sm text-slate-500 font-medium">
                        {section.duration}
                      </span>
                    </div>
                    <p className="text-slate-700">
                      {section.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Simple 3-step process to earn your CEU certificate
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: 'Watch & Learn',
                description: 'Watch each video section at your own pace. Mark as complete when finished.',
                icon: Video,
              },
              {
                step: 2,
                title: 'Pass the Quiz',
                description: 'Answer quiz questions after each section. Get 100% to unlock the next section.',
                icon: FileCheck,
              },
              {
                step: 3,
                title: 'Get Your Certificate',
                description: 'Complete all 4 sections to instantly download your BACB CEU certificate.',
                icon: Download,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                  {item.step}
                </div>
                <item.icon className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-slate-600">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-emerald-600 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-emerald-100 mb-8">
              Join hundreds of school BCBAs who have completed this masterclass
            </p>
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-colors duration-300 shadow-xl"
            >
              Start Your Free Masterclass
              <Award className="ml-2 w-6 h-6" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
