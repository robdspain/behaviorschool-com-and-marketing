"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { 
  Brain, Heart, ArrowRight, ArrowLeft, ChevronRight,
  AlertCircle, CheckCircle, Plus, Trash2, Copy, Download,
  User, MapPin, Clock, Sparkles, HelpCircle
} from "lucide-react";

// Types
interface ThoughtFeeling {
  id: string;
  text: string;
  context: {
    who: string;
    where: string;
    when: string;
  };
}

interface MatrixData {
  targetBehavior: string;
  values: string[];
  thoughtsFeelings: ThoughtFeeling[];
  awayMoves: string[];
  towardMoves: string[];
}

// Initial state
const initialMatrix: MatrixData = {
  targetBehavior: "",
  values: [],
  thoughtsFeelings: [],
  awayMoves: [],
  towardMoves: [],
};

// Question sections
const sections = [
  { id: "intro", title: "Introduction", description: "Set the context" },
  { id: "values", title: "Values", description: "What matters most" },
  { id: "thoughts", title: "Thoughts & Feelings", description: "What gets in the way" },
  { id: "away", title: "Away Moves", description: "Challenging behaviors" },
  { id: "toward", title: "Toward Moves", description: "Goals & actions" },
  { id: "review", title: "Review Matrix", description: "Complete picture" },
];

export default function ACTMatrixQuestionnaire() {
  const [currentSection, setCurrentSection] = useState(0);
  const [matrix, setMatrix] = useState<MatrixData>(initialMatrix);
  const [currentInput, setCurrentInput] = useState("");
  const [currentThought, setCurrentThought] = useState({ text: "", who: "", where: "", when: "" });
  const [showMatrix, setShowMatrix] = useState(true);
  const [copied, setCopied] = useState(false);
  const matrixRef = useRef<HTMLDivElement>(null);

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setCurrentSection(index);
      setCurrentInput("");
    }
  };

  const addValue = () => {
    if (currentInput.trim()) {
      setMatrix(prev => ({
        ...prev,
        values: [...prev.values, currentInput.trim()]
      }));
      setCurrentInput("");
    }
  };

  const addThought = () => {
    if (currentThought.text.trim()) {
      const newThought: ThoughtFeeling = {
        id: crypto.randomUUID(),
        text: currentThought.text.trim(),
        context: {
          who: currentThought.who.trim(),
          where: currentThought.where.trim(),
          when: currentThought.when.trim(),
        }
      };
      setMatrix(prev => ({
        ...prev,
        thoughtsFeelings: [...prev.thoughtsFeelings, newThought]
      }));
      setCurrentThought({ text: "", who: "", where: "", when: "" });
    }
  };

  const addAwayMove = () => {
    if (currentInput.trim()) {
      setMatrix(prev => ({
        ...prev,
        awayMoves: [...prev.awayMoves, currentInput.trim()]
      }));
      setCurrentInput("");
    }
  };

  const addTowardMove = () => {
    if (currentInput.trim()) {
      setMatrix(prev => ({
        ...prev,
        towardMoves: [...prev.towardMoves, currentInput.trim()]
      }));
      setCurrentInput("");
    }
  };

  const removeItem = (category: keyof MatrixData, index: number | string) => {
    setMatrix(prev => {
      if (category === "thoughtsFeelings") {
        return {
          ...prev,
          thoughtsFeelings: prev.thoughtsFeelings.filter(t => t.id !== index)
        };
      }
      const arr = prev[category] as string[];
      return {
        ...prev,
        [category]: arr.filter((_, i) => i !== index)
      };
    });
  };

  const copyToClipboard = () => {
    const text = generateMatrixText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateMatrixText = () => {
    return `ACT MATRIX - Student Interview Results
======================================
Target Behavior: ${matrix.targetBehavior || "[Not specified]"}

VALUES (Why does this matter?)
${matrix.values.length > 0 ? matrix.values.map(v => `• ${v}`).join("\n") : "• [None recorded]"}

THOUGHTS/FEELINGS THAT GET IN THE WAY
${matrix.thoughtsFeelings.length > 0 
  ? matrix.thoughtsFeelings.map(t => `• "${t.text}"\n  Context: ${[t.context.who, t.context.where, t.context.when].filter(Boolean).join(", ") || "Not specified"}`).join("\n\n")
  : "• [None recorded]"}

AWAY MOVES (Challenging Behaviors)
${matrix.awayMoves.length > 0 ? matrix.awayMoves.map(a => `• ${a}`).join("\n") : "• [None recorded]"}

TOWARD MOVES (Goals/Actions)
${matrix.towardMoves.length > 0 ? matrix.towardMoves.map(t => `• ${t}`).join("\n") : "• [None recorded]"}
`;
  };

  // Render different sections
  const renderSection = () => {
    switch (sections[currentSection].id) {
      case "intro":
        return (
          <div className="space-y-6">
            <div className="bg-slate-700/50 rounded-xl p-6 border border-slate-600">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3">Opening Script</h3>
              <p className="text-slate-200 italic leading-relaxed">
                "I want to ask you some questions that are going to help us zoom out and then get a closer look 
                at the issues and some things getting in the way. Is it okay to use a form I developed to help me do this?"
              </p>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="text-slate-300 text-sm font-medium">Target Behavior / Observable Issue</span>
                <p className="text-slate-400 text-xs mt-1 mb-2">
                  "I'm being asked to do this because ______________ has been a difficulty for you."
                </p>
                <textarea
                  value={matrix.targetBehavior}
                  onChange={(e) => setMatrix(prev => ({ ...prev, targetBehavior: e.target.value }))}
                  placeholder="e.g., lying about assignments and their completeness"
                  className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  rows={3}
                />
              </label>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <p className="text-emerald-300 text-sm">
                <strong>Follow-up prompt:</strong> "Can you talk to me a little bit about what you do and what goes on for you? 
                When you're in a situation that you have to [target behavior]?"
              </p>
            </div>
          </div>
        );

      case "values":
        return (
          <div className="space-y-6">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Interview Questions
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• <em>"Why does this matter to you?"</em></li>
                <li>• <em>"What do you want your life to be about?"</em></li>
                <li>• <em>"What matters to you?"</em></li>
                <li>• <em>"What is important to you?"</em></li>
                <li>• <em>"Let's zoom out for a second. What is the big picture for you?"</em></li>
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-slate-300 text-sm font-medium">Add a value</span>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addValue()}
                    placeholder="e.g., Being honest with my parents"
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                  />
                  <button
                    onClick={addValue}
                    className="bg-rose-500 hover:bg-rose-400 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </label>
            </div>

            {matrix.values.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 text-xs uppercase tracking-wide">Recorded Values ({matrix.values.length})</span>
                <div className="space-y-2">
                  {matrix.values.map((v, i) => (
                    <div key={i} className="flex items-center justify-between bg-rose-500/10 border border-rose-500/30 rounded-lg px-4 py-2">
                      <span className="text-rose-200">{v}</span>
                      <button onClick={() => removeItem("values", i)} className="text-rose-400 hover:text-rose-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "thoughts":
        return (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <p className="text-amber-300 text-sm font-medium mb-1">Goal: Record at least 10 thoughts/feelings</p>
              <p className="text-amber-200/70 text-xs">For each one, capture the specific context: Who was around? Where? When?</p>
            </div>

            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Interview Questions
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• <em>"What shows up for you when you are doing [X]?"</em></li>
                <li>• <em>"You say you want to [X] but instead, you're doing [Y]. Why is that?"</em></li>
                <li>• <em>"Put yourself in that moment. Tell me what you're seeing, feeling, and hearing yourself say."</em></li>
                <li>• <em>"What is that like for you?"</em></li>
                <li>• <em>"Tell me about your experience with [X]."</em></li>
              </ul>
              <p className="text-slate-400 text-xs mt-3 italic">For each response, follow up with: "Who is around? What else is happening? When?"</p>
            </div>

            <div className="space-y-3 bg-slate-800 rounded-xl p-4 border border-slate-600">
              <label className="block">
                <span className="text-slate-300 text-sm font-medium">Thought or Feeling</span>
                <textarea
                  value={currentThought.text}
                  onChange={(e) => setCurrentThought(prev => ({ ...prev, text: e.target.value }))}
                  placeholder='e.g., "I think I\'m going to get in trouble anyway"'
                  className="w-full mt-2 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
                  rows={2}
                />
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label className="block">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <User className="w-3 h-3" /> Who was around?
                  </span>
                  <input
                    type="text"
                    value={currentThought.who}
                    onChange={(e) => setCurrentThought(prev => ({ ...prev, who: e.target.value }))}
                    placeholder="Teacher, peers..."
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-purple-500 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> Where?
                  </span>
                  <input
                    type="text"
                    value={currentThought.where}
                    onChange={(e) => setCurrentThought(prev => ({ ...prev, where: e.target.value }))}
                    placeholder="Classroom, hallway..."
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-purple-500 outline-none"
                  />
                </label>
                <label className="block">
                  <span className="text-slate-400 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" /> When?
                  </span>
                  <input
                    type="text"
                    value={currentThought.when}
                    onChange={(e) => setCurrentThought(prev => ({ ...prev, when: e.target.value }))}
                    placeholder="Morning, after lunch..."
                    className="w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-purple-500 outline-none"
                  />
                </label>
              </div>

              <button
                onClick={addThought}
                disabled={!currentThought.text.trim()}
                className="w-full bg-purple-500 hover:bg-purple-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" /> Add Thought/Feeling
              </button>
            </div>

            {matrix.thoughtsFeelings.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 text-xs uppercase tracking-wide flex items-center gap-2">
                  Recorded Thoughts ({matrix.thoughtsFeelings.length}/10)
                  {matrix.thoughtsFeelings.length >= 10 && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </span>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {matrix.thoughtsFeelings.map((t) => (
                    <div key={t.id} className="bg-purple-500/10 border border-purple-500/30 rounded-lg px-4 py-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-purple-200">"{t.text}"</p>
                          {(t.context.who || t.context.where || t.context.when) && (
                            <p className="text-purple-300/60 text-xs mt-1">
                              {[t.context.who && `Who: ${t.context.who}`, t.context.where && `Where: ${t.context.where}`, t.context.when && `When: ${t.context.when}`].filter(Boolean).join(" • ")}
                            </p>
                          )}
                        </div>
                        <button onClick={() => removeItem("thoughtsFeelings", t.id)} className="text-purple-400 hover:text-purple-300 flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "away":
        return (
          <div className="space-y-6">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Interview Questions
              </h3>
              <p className="text-slate-400 text-xs mb-3 italic">Note: These are likely challenging behaviors you have already identified</p>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• <em>"What do you find yourself doing instead?"</em></li>
                <li>• <em>"What do you do in those moments when you're feeling/thinking [X]?"</em></li>
                <li>• <em>"When you should be/want to [X] what do you do instead?"</em></li>
                <li>• <em>"What might I see you doing instead of [X]?"</em></li>
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-slate-300 text-sm font-medium">Add an Away Move (Challenging Behavior)</span>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addAwayMove()}
                    placeholder="e.g., Shutting down, avoiding eye contact, lying"
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <button
                    onClick={addAwayMove}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-4 py-3 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </label>
            </div>

            {matrix.awayMoves.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 text-xs uppercase tracking-wide">Away Moves ({matrix.awayMoves.length})</span>
                <div className="space-y-2">
                  {matrix.awayMoves.map((a, i) => (
                    <div key={i} className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2">
                      <span className="text-amber-200">{a}</span>
                      <button onClick={() => removeItem("awayMoves", i)} className="text-amber-400 hover:text-amber-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "toward":
        return (
          <div className="space-y-6">
            <div className="bg-slate-700/50 rounded-xl p-4 border border-slate-600">
              <h3 className="text-sm font-semibold text-cyan-300 mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> Interview Questions
              </h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>• <em>"If I could wave a magic wand and make all of those difficult things go away, what would I see you do?"</em></li>
                <li>• <em>"If I were a fly on the wall on a perfect day where you are living your values, what would I see?"</em></li>
                <li>• <em>"What do you want to be doing?"</em></li>
                <li>• <em>"What do you want [X] to look like?"</em></li>
                <li>• <em>"If you were living in line with your bigger values, what would I see you doing?"</em></li>
              </ul>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="text-slate-300 text-sm font-medium">Add a Toward Move (Goal/Action)</span>
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTowardMove()}
                    placeholder="e.g., Asking for help, turning in work on time"
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                  />
                  <button
                    onClick={addTowardMove}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-4 py-3 rounded-lg transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </label>
            </div>

            {matrix.towardMoves.length > 0 && (
              <div className="space-y-2">
                <span className="text-slate-400 text-xs uppercase tracking-wide">Toward Moves ({matrix.towardMoves.length})</span>
                <div className="space-y-2">
                  {matrix.towardMoves.map((t, i) => (
                    <div key={i} className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-2">
                      <span className="text-emerald-200">{t}</span>
                      <button onClick={() => removeItem("towardMoves", i)} className="text-emerald-400 hover:text-emerald-300">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "review":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Complete ACT Matrix</h3>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>
            </div>

            {/* Visual Matrix */}
            <div ref={matrixRef} className="bg-slate-800 rounded-xl p-6 border border-slate-600">
              {/* Target Behavior Header */}
              <div className="text-center mb-6 pb-4 border-b border-slate-600">
                <span className="text-slate-400 text-xs uppercase tracking-wide">Target Behavior</span>
                <p className="text-white font-medium mt-1">{matrix.targetBehavior || "[Not specified]"}</p>
              </div>

              {/* Matrix Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Top Left - INNER + AWAY */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                  <h4 className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Difficult thoughts & feelings</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {matrix.thoughtsFeelings.length > 0 ? (
                      matrix.thoughtsFeelings.map((t) => (
                        <div key={t.id} className="text-sm text-red-200">
                          • "{t.text}"
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">No thoughts recorded</p>
                    )}
                  </div>
                </div>

                {/* Top Right - INNER + TOWARD */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Inner + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values & what matters</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {matrix.values.length > 0 ? (
                      matrix.values.map((v, i) => (
                        <div key={i} className="text-sm text-cyan-200">
                          • {v}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">No values recorded</p>
                    )}
                  </div>
                </div>

                {/* Bottom Left - OUTER + AWAY */}
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                  <h4 className="text-purple-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Away</h4>
                  <p className="text-slate-400 text-xs mb-3">Avoidance behaviors</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {matrix.awayMoves.length > 0 ? (
                      matrix.awayMoves.map((a, i) => (
                        <div key={i} className="text-sm text-purple-200">
                          • {a}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">No behaviors recorded</p>
                    )}
                  </div>
                </div>

                {/* Bottom Right - OUTER + TOWARD */}
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                  <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wide mb-1">Outer + Toward</h4>
                  <p className="text-slate-400 text-xs mb-3">Values-consistent actions</p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {matrix.towardMoves.length > 0 ? (
                      matrix.towardMoves.map((t, i) => (
                        <div key={i} className="text-sm text-cyan-200">
                          • {t}
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500 text-sm italic">(Intervention targets — what we want to increase)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Context Details */}
            {matrix.thoughtsFeelings.length > 0 && (
              <div className="bg-slate-800 rounded-xl p-4 border border-slate-600">
                <h4 className="text-sm font-semibold text-cyan-300 mb-3">Thought/Feeling Context Details</h4>
                <div className="space-y-3">
                  {matrix.thoughtsFeelings.map((t, i) => (
                    <div key={t.id} className="bg-slate-700/50 rounded-lg p-3">
                      <p className="text-white font-medium text-sm">"{t.text}"</p>
                      <div className="flex gap-4 mt-2 text-xs text-slate-400">
                        {t.context.who && <span><User className="w-3 h-3 inline mr-1" />{t.context.who}</span>}
                        {t.context.where && <span><MapPin className="w-3 h-3 inline mr-1" />{t.context.where}</span>}
                        {t.context.when && <span><Clock className="w-3 h-3 inline mr-1" />{t.context.when}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Functional Analysis Note */}
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
              <p className="text-cyan-300 text-sm">
                <strong>For Functional Analysis:</strong> If conducting a latency-based FA after this interview, 
                ensure you have at least two statements/thoughts with specific context (Who? Where? When?). 
                Enter these into the functional analysis spreadsheet.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white pt-24 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Link 
            href="/calaba-2026/assessment-tools"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm mb-6"
          >
            ← Back to Assessment Tools
          </Link>
          
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-cyan-300">
            ACT Matrix Student Questionnaire
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Interview protocol for filling out the ACT Matrix. Walk through open-ended questions 
            and watch the matrix populate in real-time.
          </p>
        </div>
      </section>

      {/* Progress Steps */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between overflow-x-auto gap-2">
            {sections.map((section, i) => (
              <button
                key={section.id}
                onClick={() => goToSection(i)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  i === currentSection 
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50" 
                    : i < currentSection
                    ? "bg-emerald-500/10 text-emerald-300"
                    : "bg-slate-700/50 text-slate-400 hover:text-slate-300"
                }`}
              >
                {i < currentSection ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs">
                    {i + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Questions */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  currentSection === 0 ? "bg-cyan-500/20" :
                  currentSection === 1 ? "bg-rose-500/20" :
                  currentSection === 2 ? "bg-purple-500/20" :
                  currentSection === 3 ? "bg-amber-500/20" :
                  currentSection === 4 ? "bg-emerald-500/20" :
                  "bg-cyan-500/20"
                }`}>
                  {currentSection === 0 && <Sparkles className="w-5 h-5 text-cyan-400" />}
                  {currentSection === 1 && <Heart className="w-5 h-5 text-rose-400" />}
                  {currentSection === 2 && <Brain className="w-5 h-5 text-purple-400" />}
                  {currentSection === 3 && <ArrowLeft className="w-5 h-5 text-amber-400" />}
                  {currentSection === 4 && <ArrowRight className="w-5 h-5 text-emerald-400" />}
                  {currentSection === 5 && <CheckCircle className="w-5 h-5 text-cyan-400" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{sections[currentSection].title}</h2>
                  <p className="text-slate-400 text-sm">{sections[currentSection].description}</p>
                </div>
              </div>

              {renderSection()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={() => goToSection(currentSection - 1)}
                disabled={currentSection === 0}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
              <button
                onClick={() => goToSection(currentSection + 1)}
                disabled={currentSection === sections.length - 1}
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right: Live Matrix Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-slate-300">Live Matrix Preview</h3>
                  <button
                    onClick={() => setShowMatrix(!showMatrix)}
                    className="text-xs text-cyan-400 hover:text-cyan-300"
                  >
                    {showMatrix ? "Hide" : "Show"}
                  </button>
                </div>

                {showMatrix && (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {/* Inner + Away */}
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2">
                      <div className="text-red-400 font-medium mb-1 text-[10px] uppercase tracking-wide">
                        Inner+Away
                      </div>
                      <div className="text-red-300/70">
                        {matrix.thoughtsFeelings.length} recorded
                      </div>
                    </div>

                    {/* Inner + Toward */}
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
                      <div className="text-cyan-400 font-medium mb-1 text-[10px] uppercase tracking-wide">
                        Inner+Toward
                      </div>
                      <div className="text-cyan-300/70">
                        {matrix.values.length} recorded
                      </div>
                    </div>

                    {/* Outer + Away */}
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-2">
                      <div className="text-purple-400 font-medium mb-1 text-[10px] uppercase tracking-wide">
                        Outer+Away
                      </div>
                      <div className="text-purple-300/70">
                        {matrix.awayMoves.length} recorded
                      </div>
                    </div>

                    {/* Outer + Toward */}
                    <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-2">
                      <div className="text-cyan-400 font-medium mb-1 text-[10px] uppercase tracking-wide">
                        Outer+Toward
                      </div>
                      <div className="text-cyan-300/70">
                        {matrix.towardMoves.length} recorded
                      </div>
                    </div>
                  </div>
                )}

                {/* Progress indicator */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>Interview Progress</span>
                    <span>{Math.round((currentSection / (sections.length - 1)) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300"
                      style={{ width: `${(currentSection / (sections.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Thoughts goal */}
                {currentSection === 2 && (
                  <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-red-300 text-xs">Inner+Away Goal</span>
                      <span className={`text-xs font-medium ${matrix.thoughtsFeelings.length >= 10 ? "text-emerald-400" : "text-red-400"}`}>
                        {matrix.thoughtsFeelings.length}/10
                      </span>
                    </div>
                    <div className="h-1.5 bg-red-500/20 rounded-full mt-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-300 ${matrix.thoughtsFeelings.length >= 10 ? "bg-emerald-500" : "bg-red-500"}`}
                        style={{ width: `${Math.min(100, (matrix.thoughtsFeelings.length / 10) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
