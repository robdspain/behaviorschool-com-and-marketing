"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { goals, categories, gradeLevels, IEPGoal } from "./goalData";
import { Search, Copy, Check, Filter, ChevronDown, ChevronUp, Lock, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { ProTrialCTA } from "@/components/ui/ProTrialCTA";

const FREE_GOAL_LIMIT = 10;

function GoalCard({ goal, index, isLocked, onCopy, copiedId }: {
  goal: IEPGoal;
  index: number;
  isLocked: boolean;
  onCopy: (id: number, text: string) => void;
  copiedId: number | null;
}) {
  return (
    <div className={`relative bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow ${isLocked ? "select-none" : ""}`}>
      {isLocked && (
        <div className="absolute inset-0 backdrop-blur-[6px] bg-white/60 rounded-xl z-10 flex items-center justify-center">
          <Lock className="w-6 h-6 text-slate-400" />
        </div>
      )}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bs-primary/10 text-bs-primary">
          {goal.category}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-bs-accent/20 text-bs-accent">
          {goal.subcategory}
        </span>
        {goal.gradeLevel.map(gl => (
          <span key={gl} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {gl}
          </span>
        ))}
      </div>

      <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
        <p><span className="font-semibold text-bs-primary">Condition:</span> {goal.condition}</p>
        <p><span className="font-semibold text-bs-primary">Behavior:</span> {goal.behavior}</p>
        <p><span className="font-semibold text-bs-primary">Criteria:</span> {goal.criteria}</p>
      </div>

      {!isLocked && (
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => onCopy(goal.id, goal.goal)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-600"
          >
            {copiedId === goal.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedId === goal.id ? "Copied!" : "Copy Goal"}
          </button>
          <Link
            href="/iep-goals"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-bs-primary text-white hover:bg-bs-primary-dark transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Customize This Goal
          </Link>
        </div>
      )}
    </div>
  );
}

export default function IEPGoalBankClient() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedGrade, setSelectedGrade] = useState<string>("All");
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("iep-goal-bank-unlocked");
    if (stored === "true") setIsUnlocked(true);
  }, []);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => {
      if (selectedCategory !== "All" && g.category !== selectedCategory) return false;
      if (selectedGrade !== "All" && !g.gradeLevel.includes(selectedGrade)) return false;
      if (search) {
        const s = search.toLowerCase();
        return g.goal.toLowerCase().includes(s) || g.subcategory.toLowerCase().includes(s) || g.category.toLowerCase().includes(s);
      }
      return true;
    });
  }, [search, selectedCategory, selectedGrade]);

  const handleCopy = useCallback((id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleUnlock = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    localStorage.setItem("iep-goal-bank-unlocked", "true");
    localStorage.setItem("iep-goal-bank-email", email);
    setIsUnlocked(true);
    setShowEmailGate(false);
  }, [email]);

  const visibleCount = isUnlocked ? filteredGoals.length : Math.min(FREE_GOAL_LIMIT, filteredGoals.length);
  const lockedCount = isUnlocked ? 0 : Math.max(0, filteredGoals.length - FREE_GOAL_LIMIT);

  return (
    <div className="min-h-screen bg-bs-background">
      {/* Hero */}
      <section className="bg-bs-primary text-white py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            IEP Goal Bank
          </h1>
          <p className="text-lg sm:text-xl text-white/80 max-w-3xl mx-auto mb-8">
            120+ pre-written, measurable IEP behavior goals in proper condition/behavior/criteria format. Search, filter, copy, and customize.
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search goals (e.g., aggression, coping, on-task...)"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl text-slate-900 bg-white shadow-lg border-0 focus:ring-2 focus:ring-bs-accent outline-none text-base"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Filters + Results */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Filter Toggle (mobile) */}
        <button
          className="sm:hidden flex items-center gap-2 mb-4 text-sm font-medium text-bs-primary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="w-4 h-4" />
          Filters
          {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Filters */}
        <div className={`${showFilters ? "block" : "hidden"} sm:flex flex-wrap gap-3 mb-8`}>
          {/* Category */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-accent outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* Grade */}
          <select
            value={selectedGrade}
            onChange={e => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:ring-2 focus:ring-bs-accent outline-none"
          >
            <option value="All">All Grade Levels</option>
            {gradeLevels.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <span className="flex items-center text-sm text-slate-500 ml-auto">
            {filteredGoals.length} goal{filteredGoals.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Results */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">No goals match your search. Try adjusting your filters.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6">
              {filteredGoals.slice(0, visibleCount).map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={i}
                  isLocked={false}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
              {/* Show a few locked cards as preview */}
              {!isUnlocked && filteredGoals.slice(FREE_GOAL_LIMIT, FREE_GOAL_LIMIT + 3).map((goal, i) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={FREE_GOAL_LIMIT + i}
                  isLocked={true}
                  onCopy={handleCopy}
                  copiedId={copiedId}
                />
              ))}
            </div>

            {/* Email Gate */}
            {!isUnlocked && lockedCount > 0 && (
              <div className="mt-8 bg-gradient-to-br from-bs-primary to-bs-primary-dark rounded-2xl p-8 sm:p-10 text-center text-white">
                <Lock className="w-10 h-10 mx-auto mb-4 text-bs-accent" />
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Unlock All {filteredGoals.length} Goals
                </h2>
                <p className="text-white/80 mb-6 max-w-lg mx-auto">
                  Enter your email to get free access to our complete IEP goal bank with 120+ professionally written goals.
                </p>
                {!showEmailGate ? (
                  <button
                    onClick={() => setShowEmailGate(true)}
                    className="px-6 py-3 bg-bs-accent text-bs-primary font-semibold rounded-xl hover:bg-bs-accent/90 transition-colors text-base"
                  >
                    Unlock All Goals — Free
                  </button>
                ) : (
                  <form onSubmit={handleUnlock} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="you@school.edu"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl text-slate-900 bg-white border-0 focus:ring-2 focus:ring-bs-accent outline-none text-base"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-bs-accent text-bs-primary font-semibold rounded-xl hover:bg-bs-accent/90 transition-colors text-base whitespace-nowrap"
                    >
                      Unlock Goals
                    </button>
                  </form>
                )}
                {emailError && <p className="text-red-300 text-sm mt-2">{emailError}</p>}
                <p className="text-white/50 text-xs mt-4">No spam. Unsubscribe anytime.</p>
              </div>
            )}
          </>
        )}

        {/* Pro Trial CTA */}
        <ProTrialCTA source="iep-goal-bank" className="mt-12" />

        {/* CTA */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-bs-primary mb-3">Need a Custom Goal?</h2>
          <p className="text-slate-600 mb-6 max-w-lg mx-auto">
            Use our free IEP Goal Generator to create personalized, measurable behavior goals tailored to your student&apos;s unique needs.
          </p>
          <Link
            href="/iep-goals"
            className="inline-flex items-center gap-2 px-6 py-3 bg-bs-primary text-white font-semibold rounded-xl hover:bg-bs-primary-dark transition-colors text-base"
          >
            <Sparkles className="w-5 h-5" />
            Open IEP Goal Generator
          </Link>
        </div>
      </section>
    </div>
  );
}
