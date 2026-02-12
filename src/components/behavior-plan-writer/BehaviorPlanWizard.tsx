"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CheckCircle2, Copy, Printer } from "lucide-react";

// Step names
const steps = [
  "Student Info",
  "Target Behavior",
  "Function",
  "Prevention",
  "Teaching",
  "Reinforcement",
  "Data Collection",
  "Review"
];

// Function of behavior options with examples
const functionOptions = [
  {
    value: "escape",
    label: "Escape/Avoidance",
    description: "To avoid or escape a task, person, or situation",
    examples: ["Escaping difficult work", "Avoiding social interaction", "Removing from unpleasant situation"]
  },
  {
    value: "attention",
    label: "Attention/Social",
    description: "To gain attention from adults or peers",
    examples: ["Getting teacher attention", "Peer reaction", "Adult interaction"]
  },
  {
    value: "tangible",
    label: "Tangible/Access",
    description: "To gain access to preferred items or activities",
    examples: ["Access to preferred toys", "Access to technology", "Preferred activities"]
  },
  {
    value: "automatic",
    label: "Automatic/Sensory",
    description: "Sensory stimulation or automatic reinforcement",
    examples: ["Sensory input", "Self-stimulation", "Automatic consequences"]
  }
];

// Antecedent/prevention strategies by function
const preventionStrategies = {
  escape: [
    "Break tasks into smaller chunks",
    "Provide choice of task order",
    "Offer breaks before behavior occurs",
    "Use visual schedule to preview tasks",
    "Reduce task difficulty initially",
    "Provide preferred seating or location"
  ],
  attention: [
    "Pre-correct and provide attention before behavior",
    "Increase positive adult attention proactively",
    "Use noncontingent attention (attention on schedule)",
    "Provide opportunities for positive peer interaction",
    "Use proximity and visual check-ins",
    "Establish predictable attention schedule"
  ],
  tangible: [
    "Provide access to preferred items proactively",
    "Use a visual schedule showing when items are available",
    "Teach waiting with visual timer",
    "Offer choice of activities",
    "Allow brief access to preferred item before demands",
    "Use token economy to earn access"
  ],
  automatic: [
    "Provide sensory alternatives that meet the same need",
    "Increase sensory breaks throughout the day",
    "Use sensory tools proactively",
    "Reduce environmental triggers (noise, lights, etc.)",
    "Provide access to calming activities",
    "Create sensory-friendly spaces"
  ]
};

// Replacement behavior teaching strategies
const teachingStrategies = {
  escape: [
    "Teach to request a break using communication system",
    "Teach to ask for help when work is difficult",
    "Teach to request a different task",
    "Teach self-advocacy for accommodations",
    "Teach relaxation or coping strategies"
  ],
  attention: [
    "Teach appropriate ways to gain attention",
    "Teach to raise hand or use call bell",
    "Teach conversation skills and greetings",
    "Teach to wait for attention",
    "Teach peer interaction skills"
  ],
  tangible: [
    "Teach to request item using communication system",
    "Teach to wait or use a waiting strategy",
    "Teach to negotiate or trade for items",
    "Teach to ask when item will be available",
    "Teach acceptance of no or wait"
  ],
  automatic: [
    "Teach functional communication to request sensory input",
    "Teach self-regulation strategies",
    "Teach use of sensory tools appropriately",
    "Teach to request sensory break",
    "Teach replacement sensory behaviors"
  ]
};

// Reinforcement/consequence strategies
const reinforcementStrategies = {
  escape: [
    "Provide break contingent on appropriate behavior",
    "Allow task modification after using replacement behavior",
    "Reduce work demand when replacement behavior used",
    "Provide choice after completing portion of task",
    "Praise and acknowledge appropriate requests"
  ],
  attention: [
    "Provide immediate attention for replacement behavior",
    "Use specific praise and acknowledgment",
    "Provide preferred adult or peer interaction",
    "Allow special time with preferred adult",
    "Use attention as reinforcer on a schedule"
  ],
  tangible: [
    "Provide immediate access when appropriate request made",
    "Use token economy to earn preferred items",
    "Allow brief access as reinforcer",
    "Provide choice of reinforcer",
    "Use high-value items as reinforcers"
  ],
  automatic: [
    "Provide access to sensory input/activities",
    "Allow sensory break when requested appropriately",
    "Provide preferred sensory tools",
    "Reinforce use of appropriate sensory behaviors",
    "Use sensory activities as reinforcer"
  ]
};

// Data collection methods
const dataCollectionMethods = [
  {
    value: "frequency",
    label: "Frequency Count",
    description: "Count each occurrence of the behavior"
  },
  {
    value: "duration",
    label: "Duration Recording",
    description: "Measure how long the behavior lasts"
  },
  {
    value: "interval",
    label: "Interval Recording",
    description: "Record whether behavior occurs in each interval"
  },
  {
    value: "time-sampling",
    label: "Momentary Time Sampling",
    description: "Record if behavior is occurring at specific moments"
  },
  {
    value: "abc",
    label: "ABC Recording",
    description: "Record antecedent, behavior, and consequence"
  }
];

export function BehaviorPlanWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Step 1: Student Info
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [school, setSchool] = useState("");
  const [planDate, setPlanDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Step 2: Target Behavior
  const [targetBehavior, setTargetBehavior] = useState("");
  const [behaviorDefinition, setBehaviorDefinition] = useState("");
  const [behaviorBaseline, setBehaviorBaseline] = useState("");
  
  // Step 3: Function
  const [selectedFunction, setSelectedFunction] = useState<string>("");
  
  // Step 4: Prevention
  const [selectedPrevention, setSelectedPrevention] = useState<string[]>([]);
  const [customPrevention, setCustomPrevention] = useState("");
  
  // Step 5: Teaching
  const [selectedTeaching, setSelectedTeaching] = useState<string[]>([]);
  const [replacementBehavior, setReplacementBehavior] = useState("");
  const [customTeaching, setCustomTeaching] = useState("");
  
  // Step 6: Reinforcement
  const [selectedReinforcement, setSelectedReinforcement] = useState<string[]>([]);
  const [customReinforcement, setCustomReinforcement] = useState("");
  
  // Step 7: Data Collection
  const [dataMethod, setDataMethod] = useState<string>("frequency");
  const [dataFrequency, setDataFrequency] = useState("daily");
  const [reviewSchedule, setReviewSchedule] = useState("weekly");
  
  const [copied, setCopied] = useState(false);

  // Validation
  const isStepValid = useMemo(() => {
    return [
      // Step 1: Student Info
      studentName.trim().length > 0 && grade.trim().length > 0,
      // Step 2: Target Behavior
      targetBehavior.trim().length > 5 && behaviorDefinition.trim().length > 10,
      // Step 3: Function
      selectedFunction.length > 0,
      // Step 4: Prevention
      selectedPrevention.length > 0 || customPrevention.trim().length > 10,
      // Step 5: Teaching
      selectedTeaching.length > 0 && replacementBehavior.trim().length > 5,
      // Step 6: Reinforcement
      selectedReinforcement.length > 0 || customReinforcement.trim().length > 10,
      // Step 7: Data Collection
      dataMethod.length > 0,
      // Step 8: Review (always valid)
      true
    ];
  }, [
    studentName, grade, targetBehavior, behaviorDefinition, selectedFunction,
    selectedPrevention, customPrevention, selectedTeaching, replacementBehavior,
    selectedReinforcement, customReinforcement, dataMethod
  ]);

  const onNext = () => {
    if (currentStep < steps.length - 1 && isStepValid[currentStep]) {
      setCurrentStep(prev => prev + 1);
      setCopied(false);
    }
  };

  const onBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setCopied(false);
    }
  };

  const toggleSelection = (arr: string[], setArr: (val: string[]) => void, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter(i => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const buildPlan = () => {
    const sections = [];
    
    sections.push("BEHAVIOR INTERVENTION PLAN\n");
    sections.push(`Student: ${studentName || "[Student Name]"}`);
    sections.push(`Grade: ${grade || "[Grade]"}`);
    sections.push(`School: ${school || "[School Name]"}`);
    sections.push(`Plan Date: ${planDate}`);
    sections.push("\n");
    
    sections.push("TARGET BEHAVIOR FOR REDUCTION");
    sections.push(`Behavior: ${targetBehavior}`);
    sections.push(`\nOperational Definition: ${behaviorDefinition}`);
    if (behaviorBaseline) {
      sections.push(`\nBaseline: ${behaviorBaseline}`);
    }
    sections.push("\n");
    
    const funcObj = functionOptions.find(f => f.value === selectedFunction);
    if (funcObj) {
      sections.push("FUNCTION OF BEHAVIOR");
      sections.push(`Function: ${funcObj.label}`);
      sections.push(`Description: ${funcObj.description}`);
      sections.push("\n");
    }
    
    sections.push("ANTECEDENT/PREVENTION STRATEGIES");
    sections.push("(Strategies to prevent the behavior before it occurs)\n");
    selectedPrevention.forEach(strategy => {
      sections.push(`- ${strategy}`);
    });
    if (customPrevention.trim()) {
      sections.push(`- ${customPrevention}`);
    }
    sections.push("\n");
    
    sections.push("REPLACEMENT BEHAVIOR");
    sections.push(`Target: ${replacementBehavior}`);
    sections.push("\nTeaching Strategies:");
    selectedTeaching.forEach(strategy => {
      sections.push(`- ${strategy}`);
    });
    if (customTeaching.trim()) {
      sections.push(`- ${customTeaching}`);
    }
    sections.push("\n");
    
    sections.push("REINFORCEMENT/CONSEQUENCE STRATEGIES");
    sections.push("(How we respond to appropriate and problem behavior)\n");
    selectedReinforcement.forEach(strategy => {
      sections.push(`- ${strategy}`);
    });
    if (customReinforcement.trim()) {
      sections.push(`- ${customReinforcement}`);
    }
    sections.push("\n");
    
    const methodObj = dataCollectionMethods.find(m => m.value === dataMethod);
    sections.push("DATA COLLECTION PLAN");
    sections.push(`Method: ${methodObj?.label || dataMethod}`);
    sections.push(`Description: ${methodObj?.description || ""}`);
    sections.push(`Data Collection Frequency: ${dataFrequency}`);
    sections.push(`Progress Review Schedule: ${reviewSchedule}`);
    sections.push("\n");
    
    sections.push("STAFF TRAINING");
    sections.push("All staff implementing this plan should receive training on:");
    sections.push("- Operational definition of target behavior");
    sections.push("- Function of behavior and why strategies are chosen");
    sections.push("- How to implement prevention strategies");
    sections.push("- How to teach and prompt replacement behavior");
    sections.push("- How to deliver reinforcement consistently");
    sections.push("- How to collect data using the chosen method");
    sections.push("- How to respond to problem behavior (extinction, redirection)");
    sections.push("\n");
    
    sections.push("PROGRESS MONITORING");
    sections.push(`Team will review data ${reviewSchedule} to assess:`);
    sections.push("- Is the target behavior decreasing?");
    sections.push("- Is the replacement behavior increasing?");
    sections.push("- Are strategies being implemented with fidelity?");
    sections.push("- Do any strategies need adjustment?");
    
    return sections.join("\n");
  };

  const handleCopy = () => {
    const plan = buildPlan();
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const plan = buildPlan();
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Behavior Intervention Plan - ${studentName}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              pre { white-space: pre-wrap; font-family: Arial, sans-serif; }
            </style>
          </head>
          <body>
            <pre>${plan}</pre>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep]}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Student Info */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Student Information</h3>
              <p className="text-sm text-slate-600 mb-6">
                Enter basic student information to begin the behavior plan.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="studentName">Student Name*</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="grade">Grade*</Label>
                  <Input
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g., 3rd"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="planDate">Plan Date</Label>
                  <Input
                    id="planDate"
                    type="date"
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  placeholder="School name (optional)"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Behavior */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Target Behavior Definition</h3>
              <p className="text-sm text-slate-600 mb-6">
                Define the behavior you want to reduce. Be specific, observable, and measurable.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetBehavior">Target Behavior Name*</Label>
                <Input
                  id="targetBehavior"
                  value={targetBehavior}
                  onChange={(e) => setTargetBehavior(e.target.value)}
                  placeholder="e.g., Physical aggression, Elopement, Task refusal"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="behaviorDefinition">Operational Definition*</Label>
                <Textarea
                  id="behaviorDefinition"
                  value={behaviorDefinition}
                  onChange={(e) => setBehaviorDefinition(e.target.value)}
                  placeholder="Describe the behavior in observable, measurable terms. What does it look like? Include examples and non-examples."
                  rows={4}
                  className="mt-1"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Good example: Hitting, kicking, or pushing others with enough force to cause pain or leave a mark.
                </p>
              </div>
              
              <div>
                <Label htmlFor="behaviorBaseline">Current Baseline (Optional)</Label>
                <Textarea
                  id="behaviorBaseline"
                  value={behaviorBaseline}
                  onChange={(e) => setBehaviorBaseline(e.target.value)}
                  placeholder="e.g., Currently occurs 5-7 times per day across all settings"
                  rows={2}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Function */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Function of Behavior</h3>
              <p className="text-sm text-slate-600 mb-6">
                Select the primary function of the behavior. This determines which strategies will be most effective.
              </p>
            </div>
            
            <div className="space-y-3">
              {functionOptions.map((func) => (
                <button
                  key={func.value}
                  onClick={() => setSelectedFunction(func.value)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    selectedFunction === func.value
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-emerald-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="font-semibold text-slate-900">{func.label}</div>
                    {selectedFunction === func.value && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{func.description}</p>
                  <div className="text-xs text-slate-500">
                    Examples: {func.examples.join(", ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Prevention */}
        {currentStep === 3 && selectedFunction && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Antecedent/Prevention Strategies</h3>
              <p className="text-sm text-slate-600 mb-6">
                Select strategies to prevent the behavior before it occurs. Choose at least one.
              </p>
            </div>
            
            <div className="space-y-2">
              {preventionStrategies[selectedFunction as keyof typeof preventionStrategies]?.map((strategy) => (
                <label
                  key={strategy}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedPrevention.includes(strategy)
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-emerald-200"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedPrevention.includes(strategy)}
                    onChange={() => toggleSelection(selectedPrevention, setSelectedPrevention, strategy)}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-slate-700">{strategy}</span>
                </label>
              ))}
            </div>
            
            <div>
              <Label htmlFor="customPrevention">Custom Prevention Strategy</Label>
              <Textarea
                id="customPrevention"
                value={customPrevention}
                onChange={(e) => setCustomPrevention(e.target.value)}
                placeholder="Add your own prevention strategy here..."
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 5: Teaching */}
        {currentStep === 4 && selectedFunction && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Replacement Behavior Teaching</h3>
              <p className="text-sm text-slate-600 mb-6">
                Define what you want the student to do instead, and how you will teach it.
              </p>
            </div>
            
            <div>
              <Label htmlFor="replacementBehavior">Replacement Behavior*</Label>
              <Input
                id="replacementBehavior"
                value={replacementBehavior}
                onChange={(e) => setReplacementBehavior(e.target.value)}
                placeholder="e.g., Request a break using communication card"
                className="mt-1 mb-4"
              />
            </div>
            
            <div>
              <Label className="mb-3 block">Teaching Strategies (select at least one)*</Label>
              <div className="space-y-2">
                {teachingStrategies[selectedFunction as keyof typeof teachingStrategies]?.map((strategy) => (
                  <label
                    key={strategy}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      selectedTeaching.includes(strategy)
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-200"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTeaching.includes(strategy)}
                      onChange={() => toggleSelection(selectedTeaching, setSelectedTeaching, strategy)}
                      className="mt-1 w-4 h-4 text-emerald-600 rounded"
                    />
                    <span className="text-sm text-slate-700">{strategy}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <Label htmlFor="customTeaching">Custom Teaching Strategy</Label>
              <Textarea
                id="customTeaching"
                value={customTeaching}
                onChange={(e) => setCustomTeaching(e.target.value)}
                placeholder="Add your own teaching strategy here..."
                rows={2}
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Step 6: Reinforcement */}
        {currentStep === 5 && selectedFunction && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Reinforcement & Consequence Strategies</h3>
              <p className="text-sm text-slate-600 mb-6">
                Select how you will reinforce the replacement behavior and respond to problem behavior.
              </p>
            </div>
            
            <div className="space-y-2">
              {reinforcementStrategies[selectedFunction as keyof typeof reinforcementStrategies]?.map((strategy) => (
                <label
                  key={strategy}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                    selectedReinforcement.includes(strategy)
                      ? "border-emerald-600 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-emerald-200"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={selectedReinforcement.includes(strategy)}
                    onChange={() => toggleSelection(selectedReinforcement, setSelectedReinforcement, strategy)}
                    className="mt-1 w-4 h-4 text-emerald-600 rounded"
                  />
                  <span className="text-sm text-slate-700">{strategy}</span>
                </label>
              ))}
            </div>
            
            <div>
              <Label htmlFor="customReinforcement">Custom Reinforcement Strategy</Label>
              <Textarea
                id="customReinforcement"
                value={customReinforcement}
                onChange={(e) => setCustomReinforcement(e.target.value)}
                placeholder="Add your own reinforcement strategy here..."
                rows={2}
                className="mt-1"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Remember:</strong> For problem behavior, use planned ignoring or redirection when safe. Never provide the functional reinforcer (escape, attention, tangible, or sensory) immediately following problem behavior.
            </div>
          </div>
        )}

        {/* Step 7: Data Collection */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Data Collection Plan</h3>
              <p className="text-sm text-slate-600 mb-6">
                Choose how you will measure the behavior and track progress.
              </p>
            </div>
            
            <div>
              <Label className="mb-3 block">Data Collection Method*</Label>
              <div className="space-y-2">
                {dataCollectionMethods.map((method) => (
                  <label
                    key={method.value}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all",
                      dataMethod === method.value
                        ? "border-emerald-600 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="dataMethod"
                      checked={dataMethod === method.value}
                      onChange={() => setDataMethod(method.value)}
                      className="mt-1 w-4 h-4 text-emerald-600"
                    />
                    <div>
                      <div className="font-medium text-slate-900">{method.label}</div>
                      <div className="text-sm text-slate-600">{method.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataFrequency">Data Collection Frequency</Label>
                <select
                  id="dataFrequency"
                  value={dataFrequency}
                  onChange={(e) => setDataFrequency(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="continuous">Continuous (all day)</option>
                  <option value="daily">Daily</option>
                  <option value="3x-week">3 times per week</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="reviewSchedule">Progress Review Schedule</Label>
                <select
                  id="reviewSchedule"
                  value={reviewSchedule}
                  onChange={(e) => setReviewSchedule(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 8: Review & Export */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Review & Export</h3>
              <p className="text-sm text-slate-600 mb-6">
                Review your completed behavior intervention plan. You can copy it to your clipboard or print it.
              </p>
            </div>
            
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                {buildPlan()}
              </pre>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleCopy}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button
                onClick={handlePrint}
                variant="outline"
                className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Plan
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <strong>Next Steps:</strong> Review this plan with your team, train all staff on implementation, and begin data collection. Schedule your first progress review meeting for {reviewSchedule === 'daily' ? 'tomorrow' : `next ${reviewSchedule.replace('-', ' ')}`}.
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-200">
          <Button
            onClick={onBack}
            disabled={currentStep === 0}
            variant="outline"
            className="px-6"
          >
            Back
          </Button>
          
          <div className="flex gap-2">
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={onNext}
                disabled={!isStepValid[currentStep]}
                className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Next Step
              </Button>
            ) : (
              <Button
                onClick={() => setCurrentStep(0)}
                variant="outline"
                className="px-6"
              >
                Start Over
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
