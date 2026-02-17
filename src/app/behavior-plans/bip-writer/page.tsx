"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileDown } from "lucide-react";
import {
  WizardLayout,
  WizardStepContainer,
  WizardNavigation,
} from "@/components/wizards/WizardLayout";

const DRAFT_KEY = "behaviorschool_fba_bip_builder_v1";

type StudentInfo = {
  studentName: string;
  grade: string;
  school: string;
  caseManager: string;
  date: string;
};

type FBAData = {
  indirectAssessment: {
    interviews: string;
    recordsReview: string;
    rating: string;
  };
  directObservation: {
    settings: string[];
    abcData: string;
    scatterPlot: string;
  };
  hypothesis: {
    antecedents: string;
    behavior: string;
    consequences: string;
    function: string;
    summary: string;
  };
};

type BIPData = {
  prevention: {
    strategies: string[];
    environmentalModifications: string;
  };
  teaching: {
    replacementBehaviors: string[];
    skillsToTeach: string;
    teachingProcedures: string;
  };
  response: {
    reinforcement: string[];
    responseToTarget: string;
    responseToCrisis: string;
  };
  crisisPlan: {
    triggers: string[];
    warningSign: string[];
    interventionSteps: string[];
    deescalation: string;
  };
};

type ImplementationData = {
  dataCollection: {
    targetMeasures: string[];
    method: string;
    frequency: string;
  };
  staffTraining: {
    whoNeedsTrained: string[];
    trainingTopics: string[];
    trainingDate: string;
  };
  review: {
    reviewSchedule: string;
    reviewCriteria: string;
    nextReviewDate: string;
  };
};

type FBABIPFormData = {
  fba: FBAData;
  bip: BIPData;
  implementation: ImplementationData;
};

const defaultStudentInfo: StudentInfo = {
  studentName: "",
  grade: "",
  school: "",
  caseManager: "",
  date: "",
};

const defaultFormData: FBABIPFormData = {
  fba: {
    indirectAssessment: { interviews: "", recordsReview: "", rating: "" },
    directObservation: { settings: [], abcData: "", scatterPlot: "" },
    hypothesis: {
      antecedents: "",
      behavior: "",
      consequences: "",
      function: "escape",
      summary: "",
    },
  },
  bip: {
    prevention: { strategies: [], environmentalModifications: "" },
    teaching: { replacementBehaviors: [], skillsToTeach: "", teachingProcedures: "" },
    response: { reinforcement: [], responseToTarget: "", responseToCrisis: "" },
    crisisPlan: {
      triggers: [],
      warningSign: [],
      interventionSteps: [],
      deescalation: "",
    },
  },
  implementation: {
    dataCollection: { targetMeasures: [], method: "", frequency: "" },
    staffTraining: { whoNeedsTrained: [], trainingTopics: [], trainingDate: "" },
    review: { reviewSchedule: "", reviewCriteria: "", nextReviewDate: "" },
  },
};

function toList(items: string[]) {
  if (!items.length) return "<em>Not specified</em>";
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderField(label: string, value?: string) {
  return `
    <div class="field">
      <div class="label">${label}</div>
      <div class="value">${value && value.trim() ? value.replace(/\n/g, "<br/>") : "<em>Not specified</em>"}</div>
    </div>
  `;
}

function renderSection(title: string, body: string) {
  return `
    <section>
      <h2>${title}</h2>
      ${body}
    </section>
  `;
}

function buildReportHTML(title: string, studentInfo: StudentInfo, content: string) {
  return `
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: 'Inter', 'Segoe UI', sans-serif; margin: 32px; color: #0f172a; }
          h1 { font-size: 28px; margin-bottom: 6px; }
          h2 { font-size: 18px; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
          .meta { color: #475569; font-size: 14px; margin-bottom: 20px; }
          .field { margin: 10px 0; }
          .label { font-weight: 600; margin-bottom: 4px; }
          ul { padding-left: 18px; }
          li { margin-bottom: 4px; }
          em { color: #64748b; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        <div class="meta">
          ${studentInfo.studentName ? `Student: <strong>${studentInfo.studentName}</strong>` : "Student: <em>Not specified</em>"}
          ${studentInfo.grade ? ` • Grade: ${studentInfo.grade}` : ""}
          ${studentInfo.school ? ` • School: ${studentInfo.school}` : ""}
          ${studentInfo.caseManager ? ` • Case Manager: ${studentInfo.caseManager}` : ""}
          ${studentInfo.date ? ` • Date: ${studentInfo.date}` : ""}
        </div>
        ${content}
      </body>
    </html>
  `;
}

export default function BIPWriterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(defaultStudentInfo);
  const [formData, setFormData] = useState<FBABIPFormData>(defaultFormData);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.studentInfo) setStudentInfo(parsed.studentInfo);
      if (parsed?.formData) setFormData(parsed.formData);
    } catch (error) {
      console.warn("Unable to load BIP writer draft", error);
    }
  }, []);

  const steps = [
    { id: "fba-indirect", label: "FBA: Indirect" },
    { id: "fba-direct", label: "FBA: Direct" },
    { id: "fba-hypothesis", label: "Hypothesis" },
    { id: "bip-prevention", label: "BIP: Prevention" },
    { id: "bip-teaching", label: "BIP: Teaching" },
    { id: "bip-response", label: "BIP: Response" },
    { id: "crisis", label: "Crisis Plan" },
    { id: "implementation", label: "Implementation" },
  ];

  function handleNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function handleSaveDraft() {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ studentInfo, formData, updatedAt: new Date().toISOString() })
    );
    alert("Draft saved locally in your browser.");
  }

  function openReport(title: string, html: string) {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) return;
    reportWindow.document.write(html);
    reportWindow.document.close();
    reportWindow.focus();
  }

  function handleExport(type: "fba" | "bip") {
    if (!studentInfo.studentName) {
      alert("Please add the student name before exporting.");
      return;
    }

    handleSaveDraft();

    if (type === "fba") {
      const content = [
        renderSection(
          "Indirect Assessment",
          renderField("Interview Results", formData.fba.indirectAssessment.interviews) +
            renderField("Records Review", formData.fba.indirectAssessment.recordsReview) +
            renderField("Rating Scale Results", formData.fba.indirectAssessment.rating)
        ),
        renderSection(
          "Direct Observation",
          renderField("Observation Settings", formData.fba.directObservation.settings.join(", ")) +
            renderField("ABC Data Summary", formData.fba.directObservation.abcData) +
            renderField("Scatter Plot Findings", formData.fba.directObservation.scatterPlot)
        ),
        renderSection(
          "Hypothesis Statement",
          renderField("Antecedent Pattern", formData.fba.hypothesis.antecedents) +
            renderField("Behavior Description", formData.fba.hypothesis.behavior) +
            renderField("Consequence Pattern", formData.fba.hypothesis.consequences) +
            renderField("Hypothesized Function", formData.fba.hypothesis.function) +
            renderField("Hypothesis Summary", formData.fba.hypothesis.summary)
        ),
      ].join("");
      openReport(
        "Functional Behavior Assessment (FBA)",
        buildReportHTML("Functional Behavior Assessment (FBA)", studentInfo, content)
      );
      return;
    }

    const content = [
      renderSection(
        "Prevention Strategies",
        renderField("Environmental Modifications", formData.bip.prevention.environmentalModifications) +
          renderField("Selected Strategies", formData.bip.prevention.strategies.join(", "))
      ),
      renderSection(
        "Teaching Strategies",
        renderField("Skills to Teach", formData.bip.teaching.skillsToTeach) +
          renderField("Teaching Procedures", formData.bip.teaching.teachingProcedures) +
          renderField("Replacement Behaviors", formData.bip.teaching.replacementBehaviors.join(", "))
      ),
      renderSection(
        "Response Strategies",
        renderField("Response to Target Behavior", formData.bip.response.responseToTarget) +
          renderField("Reinforcement", formData.bip.response.reinforcement.join(", ")) +
          renderField("Crisis Response Procedures", formData.bip.response.responseToCrisis)
      ),
      renderSection(
        "Crisis Plan",
        renderField("Crisis Triggers", formData.bip.crisisPlan.triggers.join(", ")) +
          renderField("Warning Signs", formData.bip.crisisPlan.warningSign.join(", ")) +
          renderField("De-escalation Protocol", formData.bip.crisisPlan.deescalation) +
          renderField("Intervention Steps", toList(formData.bip.crisisPlan.interventionSteps))
      ),
      renderSection(
        "Implementation & Review",
        renderField("Data Collection Method", formData.implementation.dataCollection.method) +
          renderField("Data Collection Frequency", formData.implementation.dataCollection.frequency) +
          renderField("Target Measures", toList(formData.implementation.dataCollection.targetMeasures)) +
          renderField("Staff Requiring Training", toList(formData.implementation.staffTraining.whoNeedsTrained)) +
          renderField("Training Topics", toList(formData.implementation.staffTraining.trainingTopics)) +
          renderField("Training Date", formData.implementation.staffTraining.trainingDate) +
          renderField("Review Schedule", formData.implementation.review.reviewSchedule) +
          renderField("Next Review Date", formData.implementation.review.nextReviewDate) +
          renderField("Review Criteria", formData.implementation.review.reviewCriteria)
      ),
    ].join("");

    openReport(
      "Behavior Intervention Plan (BIP)",
      buildReportHTML("Behavior Intervention Plan (BIP)", studentInfo, content)
    );
  }

  return (
    <WizardLayout steps={steps} currentStep={currentStep}>
      <div className="mb-6">
        <Link
          href="/behavior-plans"
          className="flex items-center gap-2 text-slate-600 hover:text-emerald-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Behavior Plans
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">BIP Writer: FBA → BIP Builder</h1>
        <p className="text-slate-600 mt-2">
          Build a functional behavior assessment and behavior intervention plan in one structured workflow.
        </p>
      </div>

      <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 mb-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Student & Case Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Student Name *</label>
            <input
              value={studentInfo.studentName}
              onChange={(e) => setStudentInfo({ ...studentInfo, studentName: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Student name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Grade</label>
            <input
              value={studentInfo.grade}
              onChange={(e) => setStudentInfo({ ...studentInfo, grade: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Grade level"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">School</label>
            <input
              value={studentInfo.school}
              onChange={(e) => setStudentInfo({ ...studentInfo, school: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="School name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Case Manager</label>
            <input
              value={studentInfo.caseManager}
              onChange={(e) => setStudentInfo({ ...studentInfo, caseManager: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="BCBA / School Psych"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
            <input
              type="date"
              value={studentInfo.date}
              onChange={(e) => setStudentInfo({ ...studentInfo, date: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {currentStep === 0 && (
        <WizardStepContainer
          title="FBA: Indirect Assessment"
          description="Gather information through interviews and records review"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Interview Results *
              </label>
              <textarea
                value={formData.fba.indirectAssessment.interviews}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      indirectAssessment: {
                        ...formData.fba.indirectAssessment,
                        interviews: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={4}
                placeholder="Summarize key findings from teacher/parent/student interviews..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Records Review *
              </label>
              <textarea
                value={formData.fba.indirectAssessment.recordsReview}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      indirectAssessment: {
                        ...formData.fba.indirectAssessment,
                        recordsReview: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="Academic records, attendance, discipline history..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rating Scale Results
              </label>
              <textarea
                value={formData.fba.indirectAssessment.rating}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      indirectAssessment: {
                        ...formData.fba.indirectAssessment,
                        rating: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="Results from FACTS, MAS, or other rating scales..."
              />
            </div>
          </div>

          <WizardNavigation
            onNext={handleNext}
            showBack={false}
            onSaveDraft={handleSaveDraft}
            nextDisabled={
              !formData.fba.indirectAssessment.interviews ||
              !formData.fba.indirectAssessment.recordsReview
            }
          />
        </WizardStepContainer>
      )}

      {currentStep === 1 && (
        <WizardStepContainer
          title="FBA: Direct Observation"
          description="Document observations across settings"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observation Settings
              </label>
              <p className="text-sm text-slate-600 mb-2">
                Select all settings where observations were conducted.
              </p>
              <div className="space-y-2">
                {[
                  "Classroom",
                  "Cafeteria",
                  "Playground",
                  "Hallway",
                  "Specialist class",
                ].map((setting) => (
                  <label key={setting} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.fba.directObservation.settings.includes(setting)}
                      onChange={(e) => {
                        const current = formData.fba.directObservation.settings;
                        const updated = e.target.checked
                          ? [...current, setting]
                          : current.filter((s) => s !== setting);
                        setFormData({
                          ...formData,
                          fba: {
                            ...formData.fba,
                            directObservation: {
                              ...formData.fba.directObservation,
                              settings: updated,
                            },
                          },
                        });
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{setting}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                ABC Data Summary *
              </label>
              <textarea
                value={formData.fba.directObservation.abcData}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      directObservation: {
                        ...formData.fba.directObservation,
                        abcData: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={4}
                placeholder="Patterns observed in antecedents, behaviors, and consequences..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Scatter Plot Findings
              </label>
              <textarea
                value={formData.fba.directObservation.scatterPlot}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      directObservation: {
                        ...formData.fba.directObservation,
                        scatterPlot: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="Time/activity patterns when behavior is most/least likely..."
              />
            </div>
          </div>

          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            nextDisabled={!formData.fba.directObservation.abcData}
          />
        </WizardStepContainer>
      )}

      {currentStep === 2 && (
        <WizardStepContainer
          title="Hypothesis Statement"
          description="Synthesize findings into a clear hypothesis about the function of behavior"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Antecedent Pattern *
              </label>
              <textarea
                value={formData.fba.hypothesis.antecedents}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      hypothesis: {
                        ...formData.fba.hypothesis,
                        antecedents: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={2}
                placeholder="When does the behavior typically occur?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Behavior Description *
              </label>
              <textarea
                value={formData.fba.hypothesis.behavior}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      hypothesis: {
                        ...formData.fba.hypothesis,
                        behavior: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={2}
                placeholder="What does the student do?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Consequence Pattern *
              </label>
              <textarea
                value={formData.fba.hypothesis.consequences}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      hypothesis: {
                        ...formData.fba.hypothesis,
                        consequences: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={2}
                placeholder="What typically happens after the behavior?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hypothesized Function *
              </label>
              <select
                value={formData.fba.hypothesis.function}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      hypothesis: {
                        ...formData.fba.hypothesis,
                        function: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="escape">Escape/Avoidance</option>
                <option value="attention">Attention</option>
                <option value="tangible">Tangible/Access</option>
                <option value="sensory">Sensory/Automatic</option>
                <option value="multiple">Multiple Functions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Hypothesis Summary *
              </label>
              <textarea
                value={formData.fba.hypothesis.summary}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    fba: {
                      ...formData.fba,
                      hypothesis: {
                        ...formData.fba.hypothesis,
                        summary: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="Write a clear hypothesis statement tying together the antecedent, behavior, consequence, and function..."
              />
            </div>
          </div>

          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            nextDisabled={
              !formData.fba.hypothesis.antecedents ||
              !formData.fba.hypothesis.behavior ||
              !formData.fba.hypothesis.consequences ||
              !formData.fba.hypothesis.summary
            }
          />
        </WizardStepContainer>
      )}

      {currentStep === 3 && (
        <WizardStepContainer
          title="BIP: Prevention Strategies"
          description="Modify antecedents to reduce the likelihood of problem behavior"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Environmental Modifications *
              </label>
              <textarea
                value={formData.bip.prevention.environmentalModifications}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      prevention: {
                        ...formData.bip.prevention,
                        environmentalModifications: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={4}
                placeholder="Seating changes, visual supports, schedule modifications, sensory accommodations..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Prevention Strategies (select all that apply)
              </label>
              <div className="space-y-2">
                {[
                  "Preferred seating",
                  "Visual schedule",
                  "Choice-making opportunities",
                  "Pre-correction before transitions",
                  "Modify task difficulty",
                  "Provide breaks",
                  "Reduce distractions",
                  "Sensory supports",
                ].map((strategy) => (
                  <label key={strategy} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bip.prevention.strategies.includes(strategy)}
                      onChange={(e) => {
                        const current = formData.bip.prevention.strategies;
                        const updated = e.target.checked
                          ? [...current, strategy]
                          : current.filter((s) => s !== strategy);
                        setFormData({
                          ...formData,
                          bip: {
                            ...formData.bip,
                            prevention: {
                              ...formData.bip.prevention,
                              strategies: updated,
                            },
                          },
                        });
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            nextDisabled={!formData.bip.prevention.environmentalModifications}
          />
        </WizardStepContainer>
      )}

      {currentStep === 4 && (
        <WizardStepContainer
          title="BIP: Teaching Strategies"
          description="Teach replacement behaviors and skills"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Skills to Teach *
              </label>
              <textarea
                value={formData.bip.teaching.skillsToTeach}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      teaching: {
                        ...formData.bip.teaching,
                        skillsToTeach: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="List specific skills the student needs to learn (functional communication, self-regulation, social skills, etc.)..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Teaching Procedures *
              </label>
              <textarea
                value={formData.bip.teaching.teachingProcedures}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      teaching: {
                        ...formData.bip.teaching,
                        teachingProcedures: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={5}
                placeholder="Step-by-step procedures for teaching the replacement behavior: modeling, role-play, prompting, practice opportunities, generalization plan..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Replacement Behaviors (select all that apply)
              </label>
              <div className="space-y-2">
                {[
                  "Request a break appropriately",
                  "Ask for help",
                  "Use self-calming strategies",
                  "Communicate needs verbally",
                  "Use visual communication system",
                  "Problem-solving skills",
                  "Conflict resolution",
                  "Self-monitoring",
                ].map((behavior) => (
                  <label key={behavior} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bip.teaching.replacementBehaviors.includes(behavior)}
                      onChange={(e) => {
                        const current = formData.bip.teaching.replacementBehaviors;
                        const updated = e.target.checked
                          ? [...current, behavior]
                          : current.filter((b) => b !== behavior);
                        setFormData({
                          ...formData,
                          bip: {
                            ...formData.bip,
                            teaching: {
                              ...formData.bip.teaching,
                              replacementBehaviors: updated,
                            },
                          },
                        });
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{behavior}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            nextDisabled={
              !formData.bip.teaching.skillsToTeach || !formData.bip.teaching.teachingProcedures
            }
          />
        </WizardStepContainer>
      )}

      {currentStep === 5 && (
        <WizardStepContainer
          title="BIP: Response Strategies"
          description="How to respond to both replacement behavior and problem behavior"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Response to Target Behavior *
              </label>
              <textarea
                value={formData.bip.response.responseToTarget}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      response: {
                        ...formData.bip.response,
                        responseToTarget: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="How will staff respond when the problem behavior occurs? (planned ignoring, redirection, logical consequences, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Reinforcement for Replacement Behavior *
              </label>
              <div className="space-y-2 mb-3">
                {[
                  "Verbal praise",
                  "Token economy",
                  "Preferred activities",
                  "Social recognition",
                  "Tangible rewards",
                  "Choice time",
                  "Break passes",
                ].map((reinforcer) => (
                  <label key={reinforcer} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bip.response.reinforcement.includes(reinforcer)}
                      onChange={(e) => {
                        const current = formData.bip.response.reinforcement;
                        const updated = e.target.checked
                          ? [...current, reinforcer]
                          : current.filter((r) => r !== reinforcer);
                        setFormData({
                          ...formData,
                          bip: {
                            ...formData.bip,
                            response: {
                              ...formData.bip.response,
                              reinforcement: updated,
                            },
                          },
                        });
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{reinforcer}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Crisis Response Procedures
              </label>
              <textarea
                value={formData.bip.response.responseToCrisis}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      response: {
                        ...formData.bip.response,
                        responseToCrisis: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="If behavior escalates to crisis level, what are the safety procedures?"
              />
            </div>
          </div>

          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            nextDisabled={!formData.bip.response.responseToTarget}
          />
        </WizardStepContainer>
      )}

      {currentStep === 6 && (
        <WizardStepContainer
          title="Crisis Plan"
          description="Detailed safety plan for high-intensity situations"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Crisis Triggers
              </label>
              <p className="text-sm text-slate-600 mb-2">What situations typically lead to escalation?</p>
              <div className="space-y-2 mb-3">
                {[
                  "Denied preferred item/activity",
                  "Difficult academic task",
                  "Peer conflict",
                  "Transition between activities",
                  "Overstimulation",
                  "Unexpected changes",
                ].map((trigger) => (
                  <label key={trigger} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bip.crisisPlan.triggers.includes(trigger)}
                      onChange={(e) => {
                        const current = formData.bip.crisisPlan.triggers;
                        const updated = e.target.checked
                          ? [...current, trigger]
                          : current.filter((t) => t !== trigger);
                        setFormData({
                          ...formData,
                          bip: {
                            ...formData.bip,
                            crisisPlan: {
                              ...formData.bip.crisisPlan,
                              triggers: updated,
                            },
                          },
                        });
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{trigger}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Warning Signs *
              </label>
              <p className="text-sm text-slate-600 mb-2">Early indicators that the student is escalating.</p>
              <div className="space-y-2 mb-3">
                {[
                  "Increased fidgeting",
                  "Verbal protests",
                  "Negative self-talk",
                  "Withdrawal",
                  "Pacing",
                  "Raised voice",
                ].map((sign) => (
                  <label key={sign} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.bip.crisisPlan.warningSign.includes(sign)}
                      onChange={(e) => {
                        const current = formData.bip.crisisPlan.warningSign;
                        const updated = e.target.checked
                          ? [...current, sign]
                          : current.filter((s) => s !== sign);
                        setFormData({
                          ...formData,
                          bip: {
                            ...formData.bip,
                            crisisPlan: {
                              ...formData.bip.crisisPlan,
                              warningSign: updated,
                            },
                          },
                        });
                      }}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-slate-700">{sign}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                De-escalation Protocol *
              </label>
              <textarea
                value={formData.bip.crisisPlan.deescalation}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      crisisPlan: {
                        ...formData.bip.crisisPlan,
                        deescalation: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={5}
                placeholder="Step-by-step procedures for de-escalation: calm voice, space, choice, redirect to safe area, call for support, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Intervention Steps (when in crisis)
              </label>
              <textarea
                value={formData.bip.crisisPlan.interventionSteps.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bip: {
                      ...formData.bip,
                      crisisPlan: {
                        ...formData.bip.crisisPlan,
                        interventionSteps: e.target.value.split("\n").filter((s) => s.trim()),
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={4}
                placeholder="One intervention step per line (e.g., 'Ensure safety of student and others', 'Call admin/counselor', 'Remove other students if needed')..."
              />
            </div>
          </div>

          <WizardNavigation
            onBack={handleBack}
            onNext={handleNext}
            onSaveDraft={handleSaveDraft}
            nextDisabled={!formData.bip.crisisPlan.deescalation}
          />
        </WizardStepContainer>
      )}

      {currentStep === 7 && (
        <WizardStepContainer
          title="Implementation & Review"
          description="Staff training, data collection, and review schedule"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data Collection Method *
              </label>
              <select
                value={formData.implementation.dataCollection.method}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      dataCollection: {
                        ...formData.implementation.dataCollection,
                        method: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Select method...</option>
                <option value="Frequency count">Frequency count</option>
                <option value="Duration recording">Duration recording</option>
                <option value="Interval recording">Interval recording</option>
                <option value="ABC data">ABC data</option>
                <option value="Scatterplot">Scatterplot</option>
                <option value="Rating scale">Rating scale</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Data Collection Frequency *
              </label>
              <input
                type="text"
                value={formData.implementation.dataCollection.frequency}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      dataCollection: {
                        ...formData.implementation.dataCollection,
                        frequency: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., Daily, 3x per week, During specific periods"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Measures</label>
              <p className="text-sm text-slate-600 mb-2">
                What specific behaviors/outcomes will be measured?
              </p>
              <textarea
                value={formData.implementation.dataCollection.targetMeasures.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      dataCollection: {
                        ...formData.implementation.dataCollection,
                        targetMeasures: e.target.value.split("\n").filter((m) => m.trim()),
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="One measure per line (e.g., 'Frequency of outbursts', 'Use of replacement behavior', 'Academic engagement')..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Staff Requiring Training *
              </label>
              <textarea
                value={formData.implementation.staffTraining.whoNeedsTrained.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      staffTraining: {
                        ...formData.implementation.staffTraining,
                        whoNeedsTrained: e.target.value.split("\n").filter((s) => s.trim()),
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="One staff member/role per line (e.g., 'Ms. Johnson - Classroom teacher', 'All instructional aides')..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Training Topics *
              </label>
              <textarea
                value={formData.implementation.staffTraining.trainingTopics.join("\n")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      staffTraining: {
                        ...formData.implementation.staffTraining,
                        trainingTopics: e.target.value.split("\n").filter((t) => t.trim()),
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="One topic per line (e.g., 'Prevention strategies', 'Teaching replacement behavior', 'Crisis procedures', 'Data collection')..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Staff Training Date *
              </label>
              <input
                type="date"
                value={formData.implementation.staffTraining.trainingDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      staffTraining: {
                        ...formData.implementation.staffTraining,
                        trainingDate: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Review Schedule *
              </label>
              <input
                type="text"
                value={formData.implementation.review.reviewSchedule}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      review: {
                        ...formData.implementation.review,
                        reviewSchedule: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="e.g., Every 2 weeks, Monthly, Quarterly"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Next Review Date *
              </label>
              <input
                type="date"
                value={formData.implementation.review.nextReviewDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      review: {
                        ...formData.implementation.review,
                        nextReviewDate: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Review Criteria *
              </label>
              <textarea
                value={formData.implementation.review.reviewCriteria}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    implementation: {
                      ...formData.implementation,
                      review: {
                        ...formData.implementation.review,
                        reviewCriteria: e.target.value,
                      },
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                rows={3}
                placeholder="What criteria determine success? (e.g., 80% reduction in target behavior, consistent use of replacement behavior for 3 consecutive weeks)..."
              />
            </div>
          </div>

          <div className="mt-8 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
            <h3 className="text-lg font-bold text-emerald-900 mb-4">FBA & BIP Complete!</h3>
            <p className="text-emerald-700 mb-4">
              You&apos;ve completed the structured workflow. Export a printable report below.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => handleExport("fba")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <FileDown className="w-4 h-4" />
                Export FBA
              </button>
              <button
                onClick={() => handleExport("bip")}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                <FileDown className="w-4 h-4" />
                Export BIP
              </button>
            </div>
            <p className="text-sm text-emerald-700 mt-3">
              Exports open in a new tab so you can print or save as PDF.
            </p>
          </div>

          <WizardNavigation onBack={handleBack} showNext={false} onSaveDraft={handleSaveDraft} />
        </WizardStepContainer>
      )}
    </WizardLayout>
  );
}
