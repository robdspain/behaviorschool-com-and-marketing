'use client';

import React, { useEffect, useRef, useState } from 'react';

export function IEPGoalWriter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // State for form data
  const [formData, setFormData] = useState({
    studentName: '',
    dueDate: '',
    direction: 'decrease',
    behaviorTitle: '',
    behaviorDefinition: '',
    context: '',
    supports: '',
    dataMethod: '',
    accuracy: '',
    consistency: '',
    baselineFrequency: '',
    baselineUnit: 'times per day',
    baselineMaxConsec: '',
    baselineMethods: '',
    baselineAvg: '',
    latencySeconds: '',
    fluencyNotes: '',
    settingsCount: '',
    maintenance: '',
    baselineLatency: '',
    baselineGeneralization: ''
  });

  const [qualityLevel, setQualityLevel] = useState(0);
  const [generatedGoal, setGeneratedGoal] = useState('');

  // Calculate quality level based on filled fields
  useEffect(() => {
    let level = 0;
    if (formData.behaviorTitle && formData.behaviorDefinition) level = 1;
    if (level === 1 && (formData.baselineFrequency || formData.baselineAvg)) level = 2;
    if (level === 2 && formData.latencySeconds) level = 3;
    if (level === 3 && formData.settingsCount) level = 4;
    if (level === 4 && formData.maintenance) level = 5;
    setQualityLevel(level);
  }, [formData]);

  const updateFormData = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const generateGoal = () => {
    // Basic goal generation logic
    const { studentName, behaviorTitle, behaviorDefinition, accuracy, consistency, context, supports, dataMethod } = formData;

    const student = studentName || '[Student]';
    const date = formData.dueDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: '2-digit', day: '2-digit', year: '2-digit'
    });

    const goal = `By ${date}, when ${context || 'in structured classroom settings'} and given ${supports || 'appropriate supports'}, ${student} will ${formData.direction === 'increase' ? 'increase' : 'decrease'} ${behaviorTitle || 'target behavior'} (${behaviorDefinition || 'specifically defined behavior'}) ${accuracy || 'to appropriate levels'} ${consistency || 'consistently'}, as measured by ${dataMethod || 'teacher observation'}.`;

    setGeneratedGoal(goal);
    setCurrentStep(6);
  };

  return (
    <div ref={containerRef} className="iep-goal-writer-container">
      <style jsx>{`
        .iep-goal-writer-container {
          max-width: 100%;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10);
          overflow: hidden;
        }

        .wizard-header {
          background: #047857;
          padding: 16px 20px;
          color: white;
          border-bottom: 1px solid #059669;
        }

        .wizard-header h2 {
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .wizard-header .subtitle {
          margin: 4px 0 0 0;
          font-size: 13px;
          opacity: 0.9;
        }

        .wizard-progress {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 12px 16px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .wizard-step {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 500;
          background: #e2e8f0;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wizard-step.active {
          background: #d1fae5;
          color: #047857;
        }

        .step-content {
          padding: 16px 20px;
        }

        .step-content h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 600;
          color: #0f172a;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 16px;
        }

        .form-grid.single {
          grid-template-columns: 1fr;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 500;
          color: #374151;
        }

        .form-field input,
        .form-field textarea,
        .form-field select {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 13px;
          background: white;
          transition: border-color 0.2s;
        }

        .form-field input:focus,
        .form-field textarea:focus,
        .form-field select:focus {
          outline: none;
          border-color: #047857;
          box-shadow: 0 0 0 1px #047857;
        }

        .form-field textarea {
          resize: none;
          height: 60px;
        }

        .direction-buttons {
          display: flex;
          gap: 8px;
        }

        .direction-button {
          flex: 1;
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #6b7280;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .direction-button.active {
          background: #d1fae5;
          border-color: #047857;
          color: #047857;
        }

        .quality-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }

        .quality-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .quality-left strong {
          font-size: 12px;
          color: #0f172a;
        }

        .quality-level {
          font-size: 11px;
          color: #64748b;
        }

        .quality-meter {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quality-track {
          width: 120px;
          height: 6px;
          background: #e2e8f0;
          border-radius: 3px;
          overflow: hidden;
        }

        .quality-fill {
          height: 100%;
          background: #047857;
          transition: width 0.3s ease;
        }

        .quality-steps {
          display: flex;
          gap: 4px;
        }

        .quality-steps span {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          font-size: 10px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .quality-steps span.active {
          background: #047857;
          color: white;
        }

        .wizard-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: white;
        }

        .wizard-button {
          padding: 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .wizard-button:hover {
          background: #f9fafb;
        }

        .wizard-button.primary {
          background: #047857;
          border-color: #047857;
          color: white;
        }

        .wizard-button.primary:hover {
          background: #059669;
        }

        .wizard-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .output-area {
          padding: 16px 20px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 8px;
          margin: 16px 20px;
        }

        .output-text {
          font-size: 13px;
          line-height: 1.5;
          color: #047857;
          margin-bottom: 12px;
        }

        .output-actions {
          display: flex;
          gap: 8px;
        }

        .embed-info {
          margin-top: 16px;
          padding: 12px;
          background: #1f2937;
          border-radius: 6px;
          text-align: center;
        }

        .embed-info .label {
          font-size: 11px;
          color: #9ca3af;
          margin-bottom: 6px;
        }

        .embed-code {
          font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
          font-size: 11px;
          color: #10b981;
          background: transparent;
          word-break: break-all;
        }
      `}</style>

      <div className="wizard-header">
        <h2>IEP Goal Writer</h2>
        <div className="subtitle">Generate high-quality behavior goals with built-in baseline data</div>
      </div>

      <div className="wizard-progress">
        {[
          '1. Student & Behavior',
          '2. Baseline',
          '3. Context & Supports',
          '4. Goal and Measurement',
          '5. Advanced (Optional)',
          '6. Review & Generate'
        ].map((step, index) => (
          <span
            key={index}
            className={`wizard-step ${currentStep === index + 1 ? 'active' : ''}`}
            onClick={() => setCurrentStep(index + 1)}
          >
            {step}
          </span>
        ))}
      </div>

      {/* Step 1: Student & Behavior */}
      {currentStep === 1 && (
        <div className="step-content">
          <h3>Student & Behavior</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Student Name</label>
              <input
                type="text"
                placeholder="e.g., Student name (optional)"
                value={formData.studentName}
                onChange={(e) => updateFormData('studentName', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Annual Goal Date (mm/dd/yy)</label>
              <input
                type="text"
                placeholder="09/15/26"
                value={formData.dueDate}
                onChange={(e) => updateFormData('dueDate', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Behavior Direction</label>
              <div className="direction-buttons">
                <button
                  type="button"
                  className={`direction-button ${formData.direction === 'increase' ? 'active' : ''}`}
                  onClick={() => updateFormData('direction', 'increase')}
                >
                  Increase
                </button>
                <button
                  type="button"
                  className={`direction-button ${formData.direction === 'decrease' ? 'active' : ''}`}
                  onClick={() => updateFormData('direction', 'decrease')}
                >
                  Decrease
                </button>
              </div>
            </div>
            <div className="form-field">
              <label>Title of Behavior</label>
              <input
                type="text"
                placeholder={formData.direction === 'increase'
                  ? "e.g., on-task behavior, following directions"
                  : "e.g., aggressive behavior, calling out"
                }
                value={formData.behaviorTitle}
                onChange={(e) => updateFormData('behaviorTitle', e.target.value)}
              />
            </div>
          </div>
          <div className="form-grid single">
            <div className="form-field">
              <label>Measurable and Observable Behavior</label>
              <textarea
                placeholder={formData.direction === 'increase'
                  ? "e.g., remaining seated and completing assignments independently"
                  : "e.g., hitting, yelling, or leaving assigned area without permission"
                }
                value={formData.behaviorDefinition}
                onChange={(e) => updateFormData('behaviorDefinition', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Baseline */}
      {currentStep === 2 && (
        <div className="step-content">
          <h3>Baseline (required)</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Current Performance Level</label>
              <input
                type="text"
                placeholder={formData.direction === 'increase'
                  ? "e.g., 40% of opportunities"
                  : "e.g., 5 times per day"
                }
                value={formData.baselineAvg}
                onChange={(e) => updateFormData('baselineAvg', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Baseline Data Methods</label>
              <input
                type="text"
                placeholder="e.g., teacher observation and behavior tracking sheets"
                value={formData.baselineMethods}
                onChange={(e) => updateFormData('baselineMethods', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Context & Supports */}
      {currentStep === 3 && (
        <div className="step-content">
          <h3>Context & Supports</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Specific Context (when)</label>
              <input
                type="text"
                placeholder="e.g., in a structured classroom setting"
                value={formData.context}
                onChange={(e) => updateFormData('context', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Specific Supports (given)</label>
              <input
                type="text"
                placeholder="e.g., verbal prompts and a visual checklist"
                value={formData.supports}
                onChange={(e) => updateFormData('supports', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Goal and Measurement */}
      {currentStep === 4 && (
        <div className="step-content">
          <h3>Goal and Measurement</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Data Collection Method</label>
              <input
                type="text"
                placeholder="e.g., teacher observation and behavior tracking sheets"
                value={formData.dataMethod}
                onChange={(e) => updateFormData('dataMethod', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Accuracy</label>
              <input
                type="text"
                placeholder={formData.direction === 'increase' ? "in 90% of opportunities" : "0 instances per day"}
                value={formData.accuracy}
                onChange={(e) => updateFormData('accuracy', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Advanced (Optional) */}
      {currentStep === 5 && (
        <div className="step-content">
          <h3>Advanced: Latency, Fluency, Generalization, Maintenance</h3>
          <div className="form-grid">
            <div className="form-field">
              <label>Latency to Initiate (seconds)</label>
              <input
                type="number"
                placeholder="e.g., 10"
                value={formData.latencySeconds}
                onChange={(e) => updateFormData('latencySeconds', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Generalization Settings Count</label>
              <input
                type="number"
                placeholder="e.g., 3"
                value={formData.settingsCount}
                onChange={(e) => updateFormData('settingsCount', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Maintenance Expectation</label>
              <input
                type="text"
                placeholder="e.g., then maintain for 2 weeks in 2 settings"
                value={formData.maintenance}
                onChange={(e) => updateFormData('maintenance', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step 6: Output */}
      {currentStep === 6 && (
        <div className="step-content">
          <h3>Generated IEP Goal</h3>
          {generatedGoal && (
            <div className="output-area">
              <div className="output-text">{generatedGoal}</div>
              <div className="output-actions">
                <button
                  className="wizard-button"
                  onClick={() => navigator.clipboard.writeText(generatedGoal)}
                >
                  Copy Goal
                </button>
                <button
                  className="wizard-button"
                  onClick={() => {
                    const blob = new Blob([generatedGoal], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'iep-goal.txt';
                    a.click();
                  }}
                >
                  Download .txt
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quality Bar */}
      <div className="quality-bar">
        <div className="quality-left">
          <strong>Goal Level</strong>
          <span className="quality-level">
            {qualityLevel === 0 && "Fill fields to assess quality"}
            {qualityLevel === 1 && "Basic Goal"}
            {qualityLevel === 2 && "Basic + Baseline"}
            {qualityLevel === 3 && "+ Latency & Fluency"}
            {qualityLevel === 4 && "+ Generalization"}
            {qualityLevel === 5 && "Complete (Most Effective)"}
          </span>
        </div>
        <div className="quality-meter">
          <div className="quality-track">
            <div
              className="quality-fill"
              style={{ width: `${(qualityLevel / 5) * 100}%` }}
            />
          </div>
          <div className="quality-steps">
            {[1, 2, 3, 4, 5].map(level => (
              <span
                key={level}
                className={qualityLevel >= level ? 'active' : ''}
              >
                {level}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="wizard-controls">
        <button
          className="wizard-button"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Back
        </button>

        <div style={{ flex: 1 }} />

        {currentStep < 6 ? (
          <button
            className="wizard-button primary"
            onClick={nextStep}
          >
            Next
          </button>
        ) : (
          <button
            className="wizard-button primary"
            onClick={generateGoal}
          >
            Generate Goal
          </button>
        )}
      </div>

      
    </div>
  );
}