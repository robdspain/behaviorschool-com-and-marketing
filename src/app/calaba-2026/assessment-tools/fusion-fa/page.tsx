"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Play, Pause, RotateCcw, Plus, Trash2, BarChart3, Target, Clock, AlertTriangle } from "lucide-react";

interface Statement {
  id: string;
  text: string;
  validatingLatency: number | null;
  challengingLatency: number | null;
}

interface Trial {
  statementId: string;
  condition: "validating" | "challenging";
  latency: number;
}

export default function FusionFAPage() {
  const [statements, setStatements] = useState<Statement[]>([
    { id: "1", text: "I'm going to fail no matter what", validatingLatency: null, challengingLatency: null },
    { id: "2", text: "I'm stupid", validatingLatency: null, challengingLatency: null },
    { id: "3", text: "Nobody wants to work with me", validatingLatency: null, challengingLatency: null },
  ]);
  const [newStatement, setNewStatement] = useState("");
  const [activeTimer, setActiveTimer] = useState<{ statementId: string; condition: "validating" | "challenging" } | null>(null);
  const [timerValue, setTimerValue] = useState(0);
  const [timerInterval, setTimerIntervalState] = useState<NodeJS.Timeout | null>(null);
  const [showResults, setShowResults] = useState(false);

  const addStatement = () => {
    if (newStatement.trim()) {
      setStatements([...statements, {
        id: Date.now().toString(),
        text: newStatement.trim(),
        validatingLatency: null,
        challengingLatency: null,
      }]);
      setNewStatement("");
    }
  };

  const removeStatement = (id: string) => {
    setStatements(statements.filter(s => s.id !== id));
  };

  const startTimer = (statementId: string, condition: "validating" | "challenging") => {
    if (timerInterval) clearInterval(timerInterval);
    setActiveTimer({ statementId, condition });
    setTimerValue(0);
    const interval = setInterval(() => {
      setTimerValue(v => v + 0.1);
    }, 100);
    setTimerIntervalState(interval);
  };

  const stopTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    if (activeTimer) {
      setStatements(statements.map(s => {
        if (s.id === activeTimer.statementId) {
          return {
            ...s,
            [activeTimer.condition === "validating" ? "validatingLatency" : "challengingLatency"]: Math.round(timerValue * 10) / 10
          };
        }
        return s;
      }));
    }
    setActiveTimer(null);
    setTimerIntervalState(null);
  };

  const resetAll = () => {
    if (timerInterval) clearInterval(timerInterval);
    setStatements(statements.map(s => ({ ...s, validatingLatency: null, challengingLatency: null })));
    setActiveTimer(null);
    setTimerValue(0);
    setShowResults(false);
  };

  const getResults = () => {
    return statements
      .filter(s => s.validatingLatency !== null && s.challengingLatency !== null)
      .map(s => ({
        ...s,
        delta: (s.validatingLatency || 0) - (s.challengingLatency || 0),
      }))
      .sort((a, b) => b.delta - a.delta);
  };

  const getFusionLevel = (delta: number) => {
    if (delta >= 30) return { level: "High", color: "text-red-400", bg: "bg-red-500/20" };
    if (delta >= 15) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-500/20" };
    return { level: "Low", color: "text-green-400", bg: "bg-green-500/20" };
  };

  const allComplete = statements.every(s => s.validatingLatency !== null && s.challengingLatency !== null);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/calaba-2026/assessment-tools"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Assessment Tools
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-cyan-300">
            Fusion Hierarchy Assessment
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Measure differential latency to precursor behaviors across validating vs. challenging conditions. 
            Identify which verbal statements show the least psychological flexibility.
          </p>
        </div>
      </section>

      {/* Protocol Info */}
      <section className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400" /> Protocol Instructions
          </h3>
          <div className="text-sm text-slate-300 space-y-2">
            <p><strong>Validating Condition:</strong> "I hear you saying [statement]. That makes sense given what you've experienced."</p>
            <p><strong>Challenging Condition:</strong> "I'm not sure that's true. What if [statement] isn't accurate?"</p>
            <p><strong>Measure:</strong> Time from statement delivery to first observable precursor (posture shift, facial tension, self-talk, fidgeting).</p>
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        
        {/* Add Statement */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newStatement}
            onChange={(e) => setNewStatement(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addStatement()}
            placeholder="Add verbal statement (e.g., Everyone thinks I am weird)"
            className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:outline-none"
          />
          <button
            onClick={addStatement}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>

        {/* Statements List */}
        <div className="space-y-4 mb-8">
          {statements.map((statement, idx) => (
            <div key={statement.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <span className="text-xs text-slate-500 mb-1 block">Statement {idx + 1}</span>
                  <p className="text-white font-medium">"{statement.text}"</p>
                </div>
                <button
                  onClick={() => removeStatement(statement.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Validating */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <div className="text-xs text-green-400 font-medium mb-2">VALIDATING</div>
                  {statement.validatingLatency !== null ? (
                    <div className="text-2xl font-bold text-green-300">{statement.validatingLatency}s</div>
                  ) : activeTimer?.statementId === statement.id && activeTimer.condition === "validating" ? (
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-green-300">{timerValue.toFixed(1)}s</div>
                      <button
                        onClick={stopTimer}
                        className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Pause className="w-3 h-3" /> Stop
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTimer(statement.id, "validating")}
                      disabled={activeTimer !== null}
                      className="bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Start Timer
                    </button>
                  )}
                </div>

                {/* Challenging */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="text-xs text-red-400 font-medium mb-2">CHALLENGING</div>
                  {statement.challengingLatency !== null ? (
                    <div className="text-2xl font-bold text-red-300">{statement.challengingLatency}s</div>
                  ) : activeTimer?.statementId === statement.id && activeTimer.condition === "challenging" ? (
                    <div className="flex items-center gap-2">
                      <div className="text-2xl font-bold text-red-300">{timerValue.toFixed(1)}s</div>
                      <button
                        onClick={stopTimer}
                        className="bg-red-600 hover:bg-red-500 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Pause className="w-3 h-3" /> Stop
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startTimer(statement.id, "challenging")}
                      disabled={activeTimer !== null}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" /> Start Timer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={resetAll}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset All
          </button>
          {allComplete && (
            <button
              onClick={() => setShowResults(true)}
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" /> View Fusion Hierarchy
            </button>
          )}
        </div>

        {/* Results */}
        {showResults && (
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-xl p-6">
            <h3 className="text-xl font-bold text-cyan-300 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" /> Fusion Hierarchy Results
            </h3>
            
            <p className="text-slate-300 text-sm mb-4">
              Statements ranked by latency differential (Δ). Higher Δ = faster precursor onset when challenged = greater fusion.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="pb-3 text-slate-400 text-sm font-medium">Rank</th>
                    <th className="pb-3 text-slate-400 text-sm font-medium">Statement</th>
                    <th className="pb-3 text-slate-400 text-sm font-medium text-center">Validating</th>
                    <th className="pb-3 text-slate-400 text-sm font-medium text-center">Challenging</th>
                    <th className="pb-3 text-slate-400 text-sm font-medium text-center">Δ Latency</th>
                    <th className="pb-3 text-slate-400 text-sm font-medium text-center">Fusion</th>
                  </tr>
                </thead>
                <tbody>
                  {getResults().map((result, idx) => {
                    const fusion = getFusionLevel(result.delta);
                    return (
                      <tr key={result.id} className="border-b border-slate-700">
                        <td className="py-3 text-white font-bold">{idx + 1}</td>
                        <td className="py-3 text-white">"{result.text}"</td>
                        <td className="py-3 text-green-300 text-center">{result.validatingLatency}s</td>
                        <td className="py-3 text-red-300 text-center">{result.challengingLatency}s</td>
                        <td className="py-3 text-cyan-300 text-center font-bold">{result.delta.toFixed(1)}s</td>
                        <td className="py-3 text-center">
                          <span className={`${fusion.bg} ${fusion.color} px-2 py-1 rounded text-xs font-medium`}>
                            {fusion.level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Intervention Targets</h4>
              <p className="text-slate-300 text-sm">
                Statements with <span className="text-red-400 font-medium">High Fusion</span> (Δ ≥ 30s) should be prioritized 
                for defusion interventions. These verbal relations are functionally controlling behavior and show 
                the least psychological flexibility when challenged.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-500 text-sm">
        <p>CalABA 2026 Symposium Demo Tool</p>
        <p className="mt-1">Based on KCUSD Latency-Based FA Methodology</p>
      </footer>
    </div>
  );
}
