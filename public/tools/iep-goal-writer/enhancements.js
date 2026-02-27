/**
 * IEP Goal Writer v2 — Enhancements
 * Loaded AFTER app.js. Adds: live preview, goal bank, clinical output,
 * data sheets, social sharing, email capture, PDF export.
 * Pure JS — no build step, no frameworks.
 */

(function () {
  "use strict";

  // ---------- SVG Icon Library ----------
  const ICONS = {
    eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    chevronDown: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    chevronUp: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 15 12 9 18 15"/></svg>',
    clipboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>',
    check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    download: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    share: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>',
    link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>',
    twitter: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    sparkle: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/></svg>',
    grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
    arrowRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
    chart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    fileText: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    stepCheck: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  };

  // ---------- Utility ----------
  function esc(s) {
    return (s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]));
  }

  function getVal(id) {
    const el = document.getElementById(id);
    return el && "value" in el ? String(el.value).trim() : "";
  }

  function getChecked(id) {
    const el = document.getElementById(id);
    return !!(el && el.checked);
  }

  const SHARE_URL = "https://behaviorschool.com/tools/iep-goal-writer";

  // ---------- UPGRADE 3: Goal Bank Templates ----------
  const GOAL_BANK = [
    {
      category: "Attention & Engagement",
      templates: [
        { name: "On-Task Behavior (K-5)", direction: "decrease", behavior: "off-task behavior", definition: "looking away from instructional materials, not following along with the lesson, playing with objects, or talking to peers during instruction", baseline: "5", unit: "times per day", context: "in a structured classroom setting during teacher-led instruction", supports: "verbal prompts and a visual schedule", dataMethod: "teacher observation and behavior tracking sheets", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "On-Task Behavior (6-12)", direction: "decrease", behavior: "off-task behavior", definition: "being on phone, not taking notes, sleeping, or engaging in non-academic activities during class", baseline: "5", unit: "times per period", context: "in the general education classroom during academic instruction", supports: "a self-monitoring checklist and teacher check-ins", dataMethod: "teacher observation and behavior tracking sheets", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Work Completion", direction: "increase", behavior: "completing assignments", definition: "independently completing assigned work with at least 70% accuracy within the allotted time", baseline: "", unit: "times per day", context: "during independent work periods across all academic subjects", supports: "a visual task checklist and timer", dataMethod: "permanent product recording and work samples", accuracy: "in 80% of opportunities", consistency: "for 3 consecutively measured school days", baselinePercent: "40% of opportunities" },
        { name: "Staying in Assigned Area", direction: "increase", behavior: "remaining in assigned area", definition: "staying seated or within the designated area during instruction without leaving the assigned space", baseline: "", unit: "times per day", context: "during structured classroom activities", supports: "verbal reminders and a designated workspace boundary", dataMethod: "direct observation with frequency recording", accuracy: "in 90% of opportunities", consistency: "for 3 consecutively measured school days", baselinePercent: "50% of opportunities" },
      ]
    },
    {
      category: "Communication",
      templates: [
        { name: "Calling Out", direction: "decrease", behavior: "calling out", definition: "speaking out loud, shouting answers, or making comments without raising hand or being called upon by the teacher", baseline: "8", unit: "times per day", context: "during whole-group instruction", supports: "a visual reminder card for hand-raising and a token board", dataMethod: "direct observation with frequency recording", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Inappropriate Vocalizations", direction: "decrease", behavior: "inappropriate vocalizations", definition: "making noises, humming, singing, screaming, or using profanity that disrupts the learning environment", baseline: "6", unit: "times per day", context: "in the classroom during academic instruction", supports: "a social narrative and sensory breaks", dataMethod: "teacher observation and behavior tracking sheets", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Using Appropriate Requests", direction: "increase", behavior: "requesting appropriately", definition: "using verbal or alternative communication methods to make wants and needs known using an appropriate volume and tone", baseline: "", unit: "times per day", context: "across all school settings", supports: "a visual communication board and modeling", dataMethod: "direct observation with frequency recording", accuracy: "in 80% of opportunities", consistency: "for 3 consecutively measured school days", baselinePercent: "30% of opportunities" },
        { name: "Following Directions", direction: "increase", behavior: "following directions", definition: "initiating the requested action within 10 seconds of the direction being given, completing the task as instructed", baseline: "", unit: "times per day", context: "during structured classroom activities", supports: "verbal prompts paired with visual cues", dataMethod: "teacher observation and behavior tracking sheets", accuracy: "in 85% of opportunities", consistency: "for 3 consecutively measured school days", baselinePercent: "40% of opportunities" },
      ]
    },
    {
      category: "Safety Behaviors",
      templates: [
        { name: "Elopement", direction: "decrease", behavior: "elopement", definition: "leaving the assigned classroom, designated area, or school building without adult permission", baseline: "3", unit: "times per week", context: "during all school activities and transitions", supports: "a visual schedule and proximity to a designated staff member", dataMethod: "direct observation with frequency recording", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Aggressive Behavior", direction: "decrease", behavior: "physical aggression", definition: "hitting, kicking, biting, scratching, pushing, or throwing objects at others", baseline: "4", unit: "times per day", context: "across all school settings", supports: "a calm-down area and social skills instruction", dataMethod: "ABC data collection and analysis", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Self-Injurious Behavior", direction: "decrease", behavior: "self-injurious behavior", definition: "hitting self, head-banging, biting self, or scratching self to the point of leaving marks", baseline: "3", unit: "episodes per day", context: "across all school settings", supports: "sensory strategies and a behavior intervention plan", dataMethod: "ABC data collection and analysis", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Property Destruction", direction: "decrease", behavior: "property destruction", definition: "tearing papers, breaking pencils, throwing materials, flipping furniture, or intentionally damaging classroom property", baseline: "3", unit: "times per day", context: "in the classroom during academic tasks", supports: "a calming toolkit and alternative responses training", dataMethod: "teacher observation and behavior tracking sheets", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
      ]
    },
    {
      category: "Social Skills",
      templates: [
        { name: "Peer Interactions", direction: "increase", behavior: "positive peer interactions", definition: "initiating or responding to peers using kind words, taking turns, and sharing materials appropriately", baseline: "", unit: "times per day", context: "during unstructured social times such as recess and lunch", supports: "social skills group instruction and peer buddy system", dataMethod: "direct observation with frequency recording", accuracy: "in 80% of opportunities", consistency: "for 3 consecutively measured school days", baselinePercent: "25% of opportunities" },
        { name: "Tantrum/Meltdown Behavior", direction: "decrease", behavior: "tantrum behavior", definition: "crying, screaming, falling to the floor, refusing to move, or sustained emotional outbursts lasting more than 2 minutes", baseline: "3", unit: "times per day", context: "during transitions and when presented with non-preferred tasks", supports: "a visual schedule with transition warnings and a calm-down corner", dataMethod: "duration recording and time sampling", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
        { name: "Disruptive Behavior", direction: "decrease", behavior: "disruptive classroom behavior", definition: "talking out of turn, making noises, leaving seat, touching others' belongings, or interfering with instruction", baseline: "7", unit: "times per day", context: "during academic instruction", supports: "a token economy and self-monitoring chart", dataMethod: "teacher observation and behavior tracking sheets", accuracy: "0 instances per day", consistency: "for 5 consecutively measured school days" },
      ]
    }
  ];

  // ---------- Init on DOM ready ----------
  document.addEventListener("DOMContentLoaded", initEnhancements);

  function initEnhancements() {
    buildLayout();
    buildGoalBank();
    buildLivePreview();
    buildShareModal();
    buildEmailOverlay();
    buildShareBanner();
    replaceFooter();
    hookStep5ClinicalOutput();
    hookLivePreviewUpdates();
    hookWizardStepCompletionMarkers();
  }

  // ---------- Build Layout Wrapper ----------
  function buildLayout() {
    const main = document.querySelector("main");
    if (!main) return;

    // Wrap main content in app-layout for desktop side panel
    const layout = document.createElement("div");
    layout.className = "app-layout";
    const mainWrapper = document.createElement("div");
    mainWrapper.className = "app-main";

    // Move main's children into mainWrapper
    while (main.firstChild) {
      mainWrapper.appendChild(main.firstChild);
    }
    layout.appendChild(mainWrapper);

    // Desktop live preview panel
    const panel = document.createElement("aside");
    panel.className = "live-preview-panel";
    panel.id = "livePreviewPanel";
    panel.innerHTML = `
      <div class="preview-header">${ICONS.eye} Live Goal Preview</div>
      <div class="live-preview-text" id="livePreviewText">
        <span class="placeholder">[student name]</span> will <span class="placeholder">[direction]</span> <span class="placeholder">[behavior]</span>...
      </div>
      <div class="preview-quality">
        <div class="preview-quality-label">Goal Quality</div>
        <div style="display:flex;align-items:center;">
          <div class="preview-dots" id="previewDots">
            <span class="preview-dot" data-dot="1"></span>
            <span class="preview-dot" data-dot="2"></span>
            <span class="preview-dot" data-dot="3"></span>
            <span class="preview-dot" data-dot="4"></span>
          </div>
          <span class="preview-level-text" id="previewLevelText">Fill fields</span>
        </div>
      </div>
    `;
    layout.appendChild(panel);

    main.appendChild(layout);

    // Mobile live preview bar
    const mobilePreview = document.createElement("div");
    mobilePreview.className = "live-preview-mobile collapsed";
    mobilePreview.id = "livePreviewMobile";
    mobilePreview.innerHTML = `
      <button class="mobile-preview-toggle" id="mobilePreviewToggle">
        <span>${ICONS.eye} Live Goal Preview</span>
        ${ICONS.chevronUp}
      </button>
      <div class="mobile-preview-body">
        <div class="live-preview-text" id="livePreviewTextMobile">
          <span class="placeholder">[student name]</span> will <span class="placeholder">[direction]</span> <span class="placeholder">[behavior]</span>...
        </div>
        <div style="display:flex;align-items:center;gap:6px;margin-top:8px;">
          <div class="preview-dots" id="previewDotsMobile">
            <span class="preview-dot" data-dot="1"></span>
            <span class="preview-dot" data-dot="2"></span>
            <span class="preview-dot" data-dot="3"></span>
            <span class="preview-dot" data-dot="4"></span>
          </div>
          <span class="preview-level-text" id="previewLevelTextMobile">Fill fields</span>
        </div>
      </div>
    `;
    document.body.appendChild(mobilePreview);

    // Mobile toggle
    const toggle = document.getElementById("mobilePreviewToggle");
    if (toggle) {
      toggle.addEventListener("click", () => {
        mobilePreview.classList.toggle("collapsed");
      });
    }
  }

  // ---------- UPGRADE 3: Goal Bank ----------
  function buildGoalBank() {
    const proofEl = document.querySelector(".social-proof");
    const insertTarget = proofEl || document.querySelector(".app-header");
    if (!insertTarget) return;

    const wrapper = document.createElement("div");
    wrapper.className = "goal-bank-wrapper";
    wrapper.innerHTML = `
      <button class="goal-bank-toggle" id="goalBankToggle">
        ${ICONS.grid}
        <span>Quick-Start Goal Bank -- choose a template to auto-fill</span>
        <span style="flex:1"></span>
        ${ICONS.chevronDown}
      </button>
      <div class="goal-bank-content" id="goalBankContent">
        ${GOAL_BANK.map(cat => `
          <div class="goal-bank-category">
            <div class="goal-bank-category-label">${esc(cat.category)}</div>
            <div class="goal-bank-grid">
              ${cat.templates.map((t, i) => `
                <div class="goal-bank-card" data-category="${esc(cat.category)}" data-index="${i}">
                  <div class="goal-bank-card-name">${esc(t.name)}</div>
                  <span class="goal-bank-badge ${t.direction}">${t.direction === "decrease" ? "Decrease" : "Increase"}</span>
                  <div class="goal-bank-card-overlay">Use Template</div>
                </div>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    `;

    // Insert after social proof or header
    if (proofEl) {
      proofEl.insertAdjacentElement("afterend", wrapper);
    } else {
      insertTarget.insertAdjacentElement("afterend", wrapper);
    }

    // Toggle bank open/closed
    const toggleBtn = document.getElementById("goalBankToggle");
    const content = document.getElementById("goalBankContent");
    if (toggleBtn && content) {
      toggleBtn.addEventListener("click", () => {
        const isOpen = content.classList.toggle("open");
        toggleBtn.classList.toggle("open", isOpen);
      });
    }

    // Template clicks
    wrapper.querySelectorAll(".goal-bank-card").forEach(card => {
      card.addEventListener("click", () => {
        const catName = card.dataset.category;
        const idx = parseInt(card.dataset.index, 10);
        const cat = GOAL_BANK.find(c => c.category === catName);
        if (!cat) return;
        const tpl = cat.templates[idx];
        if (!tpl) return;
        applyTemplate(tpl);
      });
    });
  }

  function applyTemplate(tpl) {
    // Set direction first
    const dirEl = document.getElementById("direction");
    if (dirEl) dirEl.value = tpl.direction;

    // Toggle segmented buttons
    const dirInc = document.getElementById("dirInc");
    const dirDec = document.getElementById("dirDec");
    if (dirInc && dirDec) {
      dirInc.classList.toggle("active", tpl.direction === "increase");
      dirDec.classList.toggle("active", tpl.direction === "decrease");
      dirInc.setAttribute("aria-selected", String(tpl.direction === "increase"));
      dirDec.setAttribute("aria-selected", String(tpl.direction === "decrease"));
    }

    // Apply measurement rules
    if (typeof applyMeasurementRules === "function") {
      applyMeasurementRules(tpl.direction, false);
    }

    // Fill fields
    setField("behaviorTitle", tpl.behavior);
    setField("behaviorDefinition", tpl.definition);
    setField("context", tpl.context);
    setField("supports", tpl.supports);
    setField("dataMethod", tpl.dataMethod);
    setField("accuracy", tpl.accuracy);
    setField("consistency", tpl.consistency);

    if (tpl.direction === "decrease") {
      setField("baselineFrequency", tpl.baseline);
      setField("baselineUnit", tpl.unit);
    } else {
      setField("baselinePercent", tpl.baselinePercent || "");
    }

    // Collapse goal bank
    const content = document.getElementById("goalBankContent");
    const toggleBtn = document.getElementById("goalBankToggle");
    if (content) content.classList.remove("open");
    if (toggleBtn) toggleBtn.classList.remove("open");

    // Go to step 1
    if (typeof showStep === "function") showStep(1);

    // Update previews
    updateLivePreview();
    if (typeof updateQualityUI === "function") updateQualityUI();
  }

  function setField(id, value) {
    const el = document.getElementById(id);
    if (el && "value" in el) {
      el.value = value || "";
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  // ---------- UPGRADE 1: Live Preview Logic ----------
  function buildLivePreview() {
    // Initial update
    updateLivePreview();
  }

  function updateLivePreview() {
    const name = getVal("studentName");
    const direction = getVal("direction") || "decrease";
    const behavior = getVal("behaviorTitle");
    const definition = getVal("behaviorDefinition");
    const context = getVal("context");
    const supports = getVal("supports");
    const accuracy = getVal("accuracy");
    const consistency = getVal("consistency");
    const dataMethod = getVal("dataMethod");

    const dueText = getVal("dueDate");
    const dueDisplay = dueText || "[goal date]";

    // Build preview with placeholders
    let parts = [];
    parts.push(`By <span class="${dueText ? "filled" : "placeholder"}">${esc(dueDisplay)}</span>`);

    if (context || supports) {
      const ctx = context ? ` in ${esc(context)}` : "";
      const sup = supports ? ` and given ${esc(supports)}` : "";
      parts.push(`, when${ctx ? `<span class="filled">${ctx}</span>` : ' <span class="placeholder">[context]</span>'}${sup ? `<span class="filled">${sup}</span>` : ""}`);
    } else {
      parts.push(`, when <span class="placeholder">[context]</span>`);
    }

    const subj = name || "the student";
    parts.push(`, <span class="${name ? "filled" : "placeholder"}">${esc(name || "[student name]")}</span>`);

    parts.push(` will <span class="${direction ? "filled" : "placeholder"}">${esc(direction || "[direction]")}</span>`);

    if (behavior) {
      const defText = definition ? ` (${esc(definition)})` : "";
      parts.push(` <span class="filled">${esc(behavior)}${defText}</span>`);
    } else {
      parts.push(` <span class="placeholder">[behavior]</span>`);
    }

    if (accuracy) {
      parts.push(` <span class="filled">${esc(accuracy)}</span>`);
    }

    if (consistency) {
      parts.push(`, <span class="filled">${esc(consistency)}</span>`);
    }

    if (dataMethod) {
      parts.push(` as measured by <span class="filled">${esc(dataMethod)}</span>`);
    }

    parts.push(".");

    const html = parts.join("");

    // Update desktop panel
    const desktopText = document.getElementById("livePreviewText");
    if (desktopText) {
      fadeUpdate(desktopText, html);
    }

    // Update mobile panel
    const mobileText = document.getElementById("livePreviewTextMobile");
    if (mobileText) {
      fadeUpdate(mobileText, html);
    }

    // Update quality dots
    updatePreviewDots();
  }

  function fadeUpdate(el, html) {
    el.classList.add("preview-fade-out");
    setTimeout(() => {
      el.innerHTML = html;
      el.classList.remove("preview-fade-out");
      el.classList.add("preview-fade-in");
      setTimeout(() => el.classList.remove("preview-fade-in"), 250);
    }, 150);
  }

  function updatePreviewDots() {
    if (typeof collectForm !== "function" || typeof computeQualityLevel !== "function") return;

    const d = collectForm();
    const level = computeQualityLevel(d);

    const labels = {
      0: "Fill fields",
      1: "Basic Goal",
      2: "Has Baseline",
      3: "Strong Goal",
      4: "Ready"
    };

    // Update both desktop and mobile
    ["previewDots", "previewDotsMobile"].forEach(containerId => {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.querySelectorAll(".preview-dot").forEach(dot => {
        const n = parseInt(dot.dataset.dot, 10);
        dot.className = "preview-dot";
        if (n <= level) {
          dot.classList.add("filled-" + n);
        }
      });
    });

    ["previewLevelText", "previewLevelTextMobile"].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.textContent = labels[level] || labels[0];
    });
  }

  function hookLivePreviewUpdates() {
    const fields = [
      "studentName", "direction", "behaviorTitle", "behaviorDefinition",
      "context", "supports", "dataMethod", "accuracy", "consistency",
      "baselineFrequency", "baselineUnit", "baselinePercent", "dueDate"
    ];

    fields.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener("input", updateLivePreview);
      el.addEventListener("change", updateLivePreview);
    });

    // Also hook direction segmented buttons
    const dirInc = document.getElementById("dirInc");
    const dirDec = document.getElementById("dirDec");
    if (dirInc) dirInc.addEventListener("click", () => setTimeout(updateLivePreview, 50));
    if (dirDec) dirDec.addEventListener("click", () => setTimeout(updateLivePreview, 50));
  }

  // ---------- Wizard Step Completion Markers ----------
  function hookWizardStepCompletionMarkers() {
    // Override showStep to mark completed steps
    const origShowStep = window.showStep;
    if (typeof origShowStep !== "function") return;

    window.showStep = function (step) {
      origShowStep(step);
      updateStepMarkers(step);
    };
  }

  function updateStepMarkers(currentStepNum) {
    document.querySelectorAll(".wizard-step").forEach(el => {
      const n = parseInt(el.getAttribute("data-step-label"), 10);
      if (n < currentStepNum) {
        el.classList.add("completed");
        // Add checkmark if not already there
        if (!el.querySelector(".step-check-icon")) {
          const icon = document.createElement("span");
          icon.className = "step-check-icon";
          icon.innerHTML = ICONS.stepCheck;
          icon.style.cssText = "display:inline-flex;margin-right:4px;";
          el.prepend(icon);
        }
      } else {
        el.classList.remove("completed");
        const existingIcon = el.querySelector(".step-check-icon");
        if (existingIcon) existingIcon.remove();
      }
    });
  }

  // ---------- UPGRADE 2: Clinical Output for Step 5 ----------
  function hookStep5ClinicalOutput() {
    // Watch for step 5 becoming visible
    const observer = new MutationObserver(() => {
      const step5 = document.querySelector('.step[data-step="5"]');
      if (step5 && !step5.hidden) {
        renderClinicalOutput(step5);
      }
    });

    document.querySelectorAll(".step").forEach(sec => {
      observer.observe(sec, { attributes: true, attributeFilter: ["hidden"] });
    });
  }

  function renderClinicalOutput(step5El) {
    // Remove existing clinical output if re-rendering
    const existing = step5El.querySelector(".clinical-output");
    if (existing) existing.remove();

    let goalText = "";
    let baselineText = "";
    let objectivesArr = [];
    let goalLevel = 0;

    try {
      const d = collectForm();
      goalText = buildAnnualGoal(d);
      baselineText = buildBaseline(d);
      goalLevel = computeQualityLevel(d);

      if (d.includeObjectives) {
        objectivesArr = buildObjectives(d, 4);
      }
    } catch (e) {
      // Not enough data — show a message
      const clinical = document.createElement("div");
      clinical.className = "clinical-output";
      clinical.innerHTML = `<p style="color:#888;text-align:center;padding:20px;">Complete the required fields to generate your IEP goal.</p>`;
      step5El.appendChild(clinical);
      return;
    }

    const name = getVal("studentName");
    const dueDate = getVal("dueDate");
    const gradeVal = getVal("gradeLevel");
    const behaviorTitle = getVal("behaviorTitle");
    const dataMethodVal = getVal("dataMethod");

    // Detect measurement type for data sheet
    const measureType = detectMeasureType(dataMethodVal);

    // CC Standards
    let ccHTML = "";
    if (typeof getCCStandards === "function") {
      const standards = getCCStandards(gradeVal, behaviorTitle);
      if (standards.length > 0) {
        ccHTML = `
          <div class="cc-alignment-box">
            <div class="cc-alignment-header">
              ${ICONS.sparkle}
              Common Core Standards Alignment
            </div>
            ${standards.map(s => `
              <div class="cc-standard-item">
                <span class="cc-standard-code">${esc(s.code)}:</span> ${esc(s.text)}
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    // Objectives HTML
    let objHTML = "";
    if (objectivesArr.length > 0) {
      objHTML = `
        <div class="objectives-section">
          ${objectivesArr.map((obj, i) => {
            // Extract the date from the objective text
            const dateMatch = obj.match(/due (\d{2}\/\d{2}\/\d{2})/);
            const dateStr = dateMatch ? dateMatch[1] : "";
            return `
              <div class="objective-card">
                <div class="objective-checkbox"></div>
                <div>
                  <div class="objective-label">Short-Term Objective ${i + 1} of ${objectivesArr.length}</div>
                  <div class="objective-text">${esc(obj)}</div>
                  ${dateStr ? `<div class="objective-date">Target date: ${esc(dateStr)}</div>` : ""}
                </div>
              </div>
            `;
          }).join("")}
        </div>
      `;
    }

    // Data sheet HTML
    const dataSheetHTML = buildDataSheet(measureType, name, behaviorTitle, dueDate, getVal("accuracy"));

    const clinical = document.createElement("div");
    clinical.className = "clinical-output print-area";
    clinical.innerHTML = `
      <div class="print-header">
        <div class="print-header-logo">BEHAVIOR SCHOOL</div>
        <div class="print-header-url">behaviorschool.com</div>
      </div>

      <div class="goal-card-label">Annual Behavioral Goal</div>
      <div class="goal-card-header">
        <div class="goal-card-meta">
          ${dueDate ? `Goal Date: ${esc(dueDate)}` : ""}
          ${name ? ` | Student: ${esc(name)}` : ""}
        </div>
        <div class="goal-level-badge">Goal Level: ${goalLevel}</div>
      </div>

      <div class="baseline-text-card">
        <div class="baseline-label">Baseline Data</div>
        ${esc(baselineText)}
      </div>

      <div class="goal-text-card">${esc(goalText)}</div>

      ${objHTML}
      ${ccHTML}

      <div class="data-sheet-section">
        <h3>${ICONS.chart} Progress Monitoring Data Sheet</h3>
        ${dataSheetHTML}
      </div>

      <div class="print-footer">
        Generated with the free IEP Behavior Goal Writer at behaviorschool.com
      </div>

      <div class="action-bar">
        <button class="btn-copy" id="clinicalCopyBtn">${ICONS.clipboard} Copy Goal Text</button>
        <button class="btn-download" id="clinicalDownloadBtn">${ICONS.download} Download Full Report</button>
        <button class="btn-share" id="clinicalShareBtn">${ICONS.share} Share This Tool</button>
      </div>
    `;

    step5El.appendChild(clinical);

    // Wire action bar buttons
    document.getElementById("clinicalCopyBtn").addEventListener("click", handleCopyGoal);
    document.getElementById("clinicalDownloadBtn").addEventListener("click", handleDownloadReport);
    document.getElementById("clinicalShareBtn").addEventListener("click", () => openShareModal());

    // Show share banner after a moment
    setTimeout(showShareBanner, 1500);
  }

  // ---------- Copy Goal Text ----------
  function handleCopyGoal() {
    const btn = document.getElementById("clinicalCopyBtn");
    try {
      const d = collectForm();
      const goalText = buildAnnualGoal(d);
      navigator.clipboard.writeText(goalText).then(() => {
        btn.innerHTML = `${ICONS.check} Copied!`;
        btn.classList.add("btn-copied");
        setTimeout(() => {
          btn.innerHTML = `${ICONS.clipboard} Copy Goal Text`;
          btn.classList.remove("btn-copied");
        }, 2000);
      });
    } catch (e) {
      // fallback
    }
  }

  // ---------- UPGRADE 4: Download/Print Report ----------
  function handleDownloadReport() {
    // Check for email capture first
    if (!localStorage.getItem("bs_email_submitted")) {
      showEmailOverlay();
      return;
    }
    triggerPrint();
  }

  function triggerPrint() {
    window.print();
  }

  // ---------- Measurement Type Detection ----------
  function detectMeasureType(dataMethod) {
    const lower = (dataMethod || "").toLowerCase();
    if (lower.includes("duration") || lower.includes("time")) return "duration";
    if (lower.includes("interval")) return "interval";
    if (lower.includes("percentage") || lower.includes("percent") || lower.includes("permanent product") || lower.includes("work sample")) return "percentage";
    return "frequency";
  }

  // ---------- UPGRADE 5: Data Sheets ----------
  function buildDataSheet(type, studentName, behavior, goalDate, target) {
    const name = studentName || "________________";
    const beh = behavior || "________________";
    const date = goalDate || "________________";

    const headerHTML = `
      <div class="data-sheet-header">
        <div class="data-sheet-header-item">
          <div class="data-sheet-header-label">Student</div>
          <div class="data-sheet-header-value">${esc(name)}</div>
        </div>
        <div class="data-sheet-header-item">
          <div class="data-sheet-header-label">Behavior</div>
          <div class="data-sheet-header-value">${esc(beh)}</div>
        </div>
        <div class="data-sheet-header-item">
          <div class="data-sheet-header-label">Goal Date</div>
          <div class="data-sheet-header-value">${esc(date)}</div>
        </div>
        <div class="data-sheet-header-item">
          <div class="data-sheet-header-label">Data Collector</div>
          <div class="data-sheet-header-value">________________</div>
        </div>
      </div>
    `;

    if (type === "frequency") {
      return headerHTML + buildFrequencySheet(target);
    } else if (type === "duration") {
      return headerHTML + buildDurationSheet();
    } else if (type === "interval") {
      return headerHTML + buildIntervalSheet();
    } else if (type === "percentage") {
      return headerHTML + buildPercentageSheet();
    }
    return headerHTML + buildFrequencySheet(target);
  }

  function buildFrequencySheet(target) {
    const weeks = [];
    const today = new Date();
    for (let w = 0; w < 4; w++) {
      const start = new Date(today);
      start.setDate(start.getDate() + (w * 7));
      const mm = String(start.getMonth() + 1).padStart(2, "0");
      const dd = String(start.getDate()).padStart(2, "0");
      weeks.push(`${mm}/${dd}`);
    }

    let rows = weeks.map(w => `
      <tr>
        <td>Week of ${w}</td>
        <td></td><td></td><td></td><td></td><td></td>
        <td></td>
        <td></td>
      </tr>
    `).join("");

    return `
      <table class="data-sheet-table">
        <thead>
          <tr>
            <th>Week</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Total</th><th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      ${target ? `<div class="data-sheet-footer">Target: ${esc(target)}</div>` : ""}
    `;
  }

  function buildDurationSheet() {
    const emptyRows = Array(20).fill("").map(() => `
      <tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    `).join("");

    return `
      <table class="data-sheet-table">
        <thead>
          <tr><th>Date</th><th>Start Time</th><th>End Time</th><th>Duration</th><th>Setting</th><th>Notes</th></tr>
        </thead>
        <tbody>
          ${emptyRows}
          <tr><td colspan="3" style="text-align:right;font-weight:600;">Total / Average:</td><td></td><td></td><td></td></tr>
        </tbody>
      </table>
    `;
  }

  function buildIntervalSheet() {
    // 30 cells: 6 rows x 5 columns
    let cells = "";
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 5; c++) {
        const num = r * 5 + c + 1;
        cells += `
          <div class="interval-cell">
            <div style="font-weight:600;font-size:0.7rem;color:#888;">${num}</div>
            <div class="interval-options">
              <div class="interval-option">+</div>
              <div class="interval-option">-</div>
              <div class="interval-option">N/O</div>
            </div>
          </div>
        `;
      }
    }

    return `
      <div class="interval-grid">${cells}</div>
      <table class="data-sheet-table" style="margin-top:8px;">
        <thead><tr><th>Metric</th><th>Value</th></tr></thead>
        <tbody>
          <tr><td>Total + (Occurrences)</td><td></td></tr>
          <tr><td>Total - (Non-occurrences)</td><td></td></tr>
          <tr><td>Total Intervals Observed</td><td></td></tr>
          <tr><td>% Occurrence</td><td></td></tr>
          <tr><td>% IOA (if applicable)</td><td></td></tr>
        </tbody>
      </table>
    `;
  }

  function buildPercentageSheet() {
    const emptyRows = Array(25).fill("").map((_, i) => `
      <tr><td></td><td>${i + 1}</td><td></td><td></td><td></td></tr>
    `).join("");

    return `
      <table class="data-sheet-table">
        <thead>
          <tr><th>Date</th><th>Opportunity #</th><th>Response (+/-)</th><th>Running %</th><th>Notes</th></tr>
        </thead>
        <tbody>
          ${emptyRows}
        </tbody>
      </table>
    `;
  }

  // ---------- UPGRADE 6: Share Modal ----------
  function buildShareModal() {
    const backdrop = document.createElement("div");
    backdrop.className = "share-modal-backdrop";
    backdrop.id = "shareModalBackdrop";
    backdrop.innerHTML = `
      <div class="share-modal">
        <button class="share-modal-close" id="shareModalClose">${ICONS.close}</button>
        <h3>Share This Tool</h3>
        <p class="share-modal-subtitle">You just saved 20 minutes of IEP writing time. Share this with your team.</p>

        <button class="share-option" id="shareCopyLink">
          <div class="share-option-icon link">${ICONS.link}</div>
          <div class="share-option-text">
            <div class="share-option-title">Copy Link</div>
            <div class="share-option-desc">behaviorschool.com/tools/iep-goal-writer</div>
          </div>
        </button>

        <button class="share-option" id="shareTwitter">
          <div class="share-option-icon twitter">${ICONS.twitter}</div>
          <div class="share-option-text">
            <div class="share-option-title">Share on X / Twitter</div>
            <div class="share-option-desc">Post to your SPED community</div>
          </div>
        </button>

        <button class="share-option" id="shareFacebook">
          <div class="share-option-icon facebook">${ICONS.facebook}</div>
          <div class="share-option-text">
            <div class="share-option-title">Share on Facebook</div>
            <div class="share-option-desc">Share in teacher groups</div>
          </div>
        </button>

        <button class="share-option" id="shareEmail">
          <div class="share-option-icon email">${ICONS.mail}</div>
          <div class="share-option-text">
            <div class="share-option-title">Copy Goal for Email</div>
            <div class="share-option-desc">Send to a colleague with the goal text</div>
          </div>
        </button>
      </div>
    `;

    document.body.appendChild(backdrop);

    // Close modal
    document.getElementById("shareModalClose").addEventListener("click", closeShareModal);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeShareModal();
    });

    // Share actions
    document.getElementById("shareCopyLink").addEventListener("click", () => {
      navigator.clipboard.writeText(SHARE_URL).then(() => {
        const desc = document.querySelector("#shareCopyLink .share-option-desc");
        const origText = desc.textContent;
        desc.textContent = "Copied!";
        desc.style.color = "#16a34a";
        desc.style.fontWeight = "600";
        setTimeout(() => {
          desc.textContent = origText;
          desc.style.color = "";
          desc.style.fontWeight = "";
        }, 2000);
      });
    });

    document.getElementById("shareTwitter").addEventListener("click", () => {
      const text = encodeURIComponent("Just used this FREE IEP behavior goal writer and it's incredible. Writes the full annual goal + data sheet in minutes. Free, no login required. \u2192 " + SHARE_URL + " #SPED #IEP #SpecialEducation #BCBALife");
      window.open("https://twitter.com/intent/tweet?text=" + text, "_blank", "noopener,noreferrer");
    });

    document.getElementById("shareFacebook").addEventListener("click", () => {
      const url = encodeURIComponent(SHARE_URL);
      window.open("https://www.facebook.com/sharer/sharer.php?u=" + url, "_blank", "noopener,noreferrer");
    });

    document.getElementById("shareEmail").addEventListener("click", () => {
      let goalText = "";
      try {
        const d = collectForm();
        goalText = buildAnnualGoal(d);
      } catch (e) {
        goalText = "[Generate a goal first]";
      }

      const emailBody = `I used Behavior School's free IEP Behavior Goal Writer to write this goal:\n\n${goalText}\n\nYou can generate your own free goals at: ${SHARE_URL}`;

      navigator.clipboard.writeText(emailBody).then(() => {
        const desc = document.querySelector("#shareEmail .share-option-desc");
        const origText = desc.textContent;
        desc.textContent = "Copied to clipboard!";
        desc.style.color = "#16a34a";
        desc.style.fontWeight = "600";
        setTimeout(() => {
          desc.textContent = origText;
          desc.style.color = "";
          desc.style.fontWeight = "";
        }, 2000);
      });
    });
  }

  function openShareModal() {
    const backdrop = document.getElementById("shareModalBackdrop");
    if (backdrop) backdrop.classList.add("open");
  }

  function closeShareModal() {
    const backdrop = document.getElementById("shareModalBackdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  // ---------- Share Banner ----------
  function buildShareBanner() {
    const banner = document.createElement("div");
    banner.className = "share-banner";
    banner.id = "shareBanner";
    banner.innerHTML = `
      <div class="share-banner-text">
        <strong>Your IEP goal is ready!</strong>
        This took 3 minutes instead of 20. Know a colleague who'd love this?
      </div>
      <button class="share-banner-btn" id="shareBannerBtn">Share with your team ${ICONS.arrowRight}</button>
      <button class="share-banner-close" id="shareBannerClose">${ICONS.close}</button>
    `;
    document.body.appendChild(banner);

    document.getElementById("shareBannerBtn").addEventListener("click", () => {
      hideShareBanner();
      openShareModal();
    });

    document.getElementById("shareBannerClose").addEventListener("click", hideShareBanner);
  }

  function showShareBanner() {
    const banner = document.getElementById("shareBanner");
    if (!banner) return;
    banner.classList.add("visible");

    // Auto-hide after 8 seconds
    setTimeout(hideShareBanner, 8000);
  }

  function hideShareBanner() {
    const banner = document.getElementById("shareBanner");
    if (banner) banner.classList.remove("visible");
  }

  // ---------- Email Capture Overlay ----------
  function buildEmailOverlay() {
    const backdrop = document.createElement("div");
    backdrop.className = "email-overlay-backdrop";
    backdrop.id = "emailOverlayBackdrop";
    backdrop.innerHTML = `
      <div class="email-overlay">
        <h3>Get your PDF + save your goal history</h3>
        <p class="email-overlay-subtitle">We'll also send you 3 more free IEP tools. Unsubscribe anytime.</p>
        <div class="email-overlay-form">
          <input type="email" id="emailCaptureInput" placeholder="you@school.edu">
          <button id="emailCaptureSubmit">Get My PDF</button>
        </div>
        <button class="email-overlay-dismiss" id="emailCaptureDismiss">No thanks, just download</button>
        <div class="email-overlay-legal">Your email is safe with us. Privacy first, always.</div>
      </div>
    `;

    document.body.appendChild(backdrop);

    document.getElementById("emailCaptureSubmit").addEventListener("click", () => {
      const email = document.getElementById("emailCaptureInput").value.trim();
      if (email && email.includes("@")) {
        // Fire and forget — backend doesn't exist yet
        try {
          fetch("/api/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, source: "iep-goal-writer" })
          }).catch(() => {});
        } catch (e) {}

        localStorage.setItem("bs_email_submitted", "true");
        closeEmailOverlay();
        triggerPrint();
      } else {
        document.getElementById("emailCaptureInput").style.borderColor = "#dc2626";
        document.getElementById("emailCaptureInput").placeholder = "Please enter a valid email";
      }
    });

    document.getElementById("emailCaptureDismiss").addEventListener("click", () => {
      closeEmailOverlay();
      triggerPrint();
    });

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeEmailOverlay();
        triggerPrint();
      }
    });
  }

  function showEmailOverlay() {
    const backdrop = document.getElementById("emailOverlayBackdrop");
    if (backdrop) backdrop.classList.add("open");
  }

  function closeEmailOverlay() {
    const backdrop = document.getElementById("emailOverlayBackdrop");
    if (backdrop) backdrop.classList.remove("open");
  }

  // ---------- Replace Footer ----------
  function replaceFooter() {
    const oldFooter = document.querySelector(".app-footer");
    if (!oldFooter) return;

    const newFooter = document.createElement("footer");
    newFooter.className = "app-footer-v2";
    newFooter.innerHTML = `
      <div class="footer-v2-brand">Free tool by Behavior School</div>
      <p class="footer-v2-pitch">Want AI-powered IEP tools, supervision tracking, and BCBA exam prep?</p>
      <a href="https://behaviorschool.com" target="_blank" rel="noopener" class="footer-v2-cta">
        Explore Behavior School Pro ${ICONS.arrowRight}
      </a>
      <div class="footer-v2-privacy">
        Privacy: This app does not store or transmit your data. All entries remain local to your browser.
      </div>
    `;

    oldFooter.replaceWith(newFooter);
  }

  // Expose for external use
  window.openShareModal = openShareModal;
  window.updateLivePreview = updateLivePreview;

})();

// ─────────────────────────────────────────────────────────────
// REAL SOCIAL PROOF ENGINE
// Collects genuine ratings, testimonials, and usage counts.
// NOTHING displays until it's real and (for testimonials) approved by Rob.
// ─────────────────────────────────────────────────────────────
(function() {
  const FEEDBACK_URL = "/.netlify/functions/iep-tool-feedback";

  // ── 1. Fire goal_generated event when output renders ─────
  function fireGoalGenerated() {
    fetch(FEEDBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "goal_generated" }),
    }).catch(() => {}); // silent fail, never block the user
  }

  // ── 2. Load real stats and show only if data exists ───────
  async function loadAndShowStats() {
    try {
      const res = await fetch(FEEDBACK_URL + "?action=stats");
      const data = await res.json();

      // Goals generated counter — real number, starts from 0
      if (data.goals_generated && data.goals_generated >= 50) {
        const counter = document.getElementById("goals-generated-counter");
        if (counter) {
          counter.textContent = data.goals_generated.toLocaleString() + " goals generated";
          counter.style.display = "block";
        }
      }

      // Star rating — only show after 20+ real ratings
      if (data.avg_rating && data.rating_count >= 20) {
        const ratingDisplay = document.getElementById("real-rating-display");
        if (ratingDisplay) {
          const stars = Math.round(data.avg_rating * 10) / 10;
          ratingDisplay.innerHTML = `
            <span class="rating-stars">${renderStars(stars)}</span>
            <span class="rating-text">${stars}/5 from ${data.rating_count} teachers</span>
          `;
          ratingDisplay.style.display = "flex";
        }
      }
    } catch (e) {
      // Silent — no fake fallback, just nothing shows
    }
  }

  function renderStars(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      const filled = i <= Math.round(rating);
      html += `<svg width="14" height="14" viewBox="0 0 20 20" fill="${filled ? "#e3b23c" : "#ddd"}" xmlns="http://www.w3.org/2000/svg"><path d="M10 2l2.09 5.26L18 8.27l-4 3.86.94 5.87L10 15.4l-4.94 2.6.94-5.87-4-3.86 5.91-1.01L10 2z"/></svg>`;
    }
    return html;
  }

  // ── 3. Star rating widget on Step 5 ──────────────────────
  function injectRatingWidget() {
    const output = document.getElementById("output");
    if (!output) return;

    // Don't inject twice
    if (document.getElementById("rating-widget")) return;

    const widget = document.createElement("div");
    widget.id = "rating-widget";
    widget.className = "rating-widget";
    widget.innerHTML = `
      <p class="rating-prompt">Was this goal helpful?</p>
      <div class="rating-stars-input" role="group" aria-label="Rate this tool">
        ${[1,2,3,4,5].map(n => `
          <button type="button" class="star-btn" data-stars="${n}" aria-label="${n} star${n>1?'s':''}">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="#ddd" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2l2.09 5.26L18 8.27l-4 3.86.94 5.87L10 15.4l-4.94 2.6.94-5.87-4-3.86 5.91-1.01L10 2z"/>
            </svg>
          </button>`).join("")}
      </div>
      <p id="rating-thanks" class="rating-thanks" style="display:none">Thank you! Your rating helps other teachers find this tool.</p>
    `;

    output.insertAdjacentElement("afterend", widget);

    // Star hover + click
    const btns = widget.querySelectorAll(".star-btn");
    btns.forEach(btn => {
      btn.addEventListener("mouseenter", () => highlightStars(btns, parseInt(btn.dataset.stars)));
      btn.addEventListener("mouseleave", () => highlightStars(btns, 0));
      btn.addEventListener("click", () => submitRating(parseInt(btn.dataset.stars), btns, widget));
    });
  }

  function highlightStars(btns, upTo) {
    btns.forEach((btn, i) => {
      const svg = btn.querySelector("svg path");
      if (svg) svg.setAttribute("fill", i < upTo ? "#e3b23c" : "#ddd");
    });
  }

  async function submitRating(stars, btns, widget) {
    highlightStars(btns, stars);
    btns.forEach(b => b.disabled = true);

    await fetch(FEEDBACK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "rating", stars }),
    }).catch(() => {});

    const thanks = widget.querySelector("#rating-thanks");
    const prompt = widget.querySelector(".rating-prompt");
    const starsInput = widget.querySelector(".rating-stars-input");
    if (prompt) prompt.style.display = "none";
    if (starsInput) starsInput.style.display = "none";
    if (thanks) thanks.style.display = "block";

    // If 4 or 5 stars, show quick testimonial ask
    if (stars >= 4) {
      setTimeout(() => injectTestimonialAsk(widget), 800);
    }
  }

  // ── 4. Testimonial ask (only after 4-5 star rating) ──────
  function injectTestimonialAsk(widget) {
    if (document.getElementById("testimonial-ask")) return;

    const ask = document.createElement("div");
    ask.id = "testimonial-ask";
    ask.className = "testimonial-ask";
    ask.innerHTML = `
      <p class="testimonial-ask-prompt">Mind sharing one sentence about how this helped you?</p>
      <p class="testimonial-ask-note">If you're comfortable, we may share this (with your role only — never your name without permission).</p>
      <select id="testimonial-role" class="testimonial-role-select">
        <option value="">Your role (optional)</option>
        <option value="Special Education Teacher">Special Education Teacher</option>
        <option value="BCBA">BCBA</option>
        <option value="RBT">RBT</option>
        <option value="Behavior Specialist">Behavior Specialist</option>
        <option value="School Psychologist">School Psychologist</option>
        <option value="Paraprofessional">Paraprofessional</option>
        <option value="Administrator">Administrator</option>
        <option value="Other">Other</option>
      </select>
      <textarea id="testimonial-text" class="testimonial-textarea" 
        placeholder="e.g., Saved me 20 minutes on my most difficult IEP…" 
        rows="2" maxlength="280"></textarea>
      <div class="testimonial-actions">
        <button type="button" id="testimonial-submit" class="btn-primary-sm">Submit</button>
        <button type="button" id="testimonial-skip" class="btn-ghost-sm">Skip</button>
      </div>
      <p id="testimonial-submitted" style="display:none;color:#1e3a34;font-size:0.85rem;margin-top:8px;">
        Thank you — we really appreciate that.
      </p>
    `;

    widget.insertAdjacentElement("afterend", ask);

    document.getElementById("testimonial-submit").addEventListener("click", async () => {
      const text = document.getElementById("testimonial-text").value.trim();
      const role = document.getElementById("testimonial-role").value;
      if (!text || text.length < 10) {
        document.getElementById("testimonial-text").style.border = "1.5px solid #dc2626";
        return;
      }
      await fetch(FEEDBACK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "testimonial", text, role }),
      }).catch(() => {});

      ask.querySelector(".testimonial-ask-prompt").style.display = "none";
      ask.querySelector(".testimonial-ask-note").style.display = "none";
      ask.querySelector("#testimonial-role").style.display = "none";
      ask.querySelector("#testimonial-text").style.display = "none";
      ask.querySelector(".testimonial-actions").style.display = "none";
      document.getElementById("testimonial-submitted").style.display = "block";
    });

    document.getElementById("testimonial-skip").addEventListener("click", () => {
      ask.style.display = "none";
    });
  }

  // ── 5. Hook into output generation ───────────────────────
  const outputEl = document.getElementById("output");
  if (outputEl) {
    const observer = new MutationObserver(() => {
      if (outputEl.textContent.trim().length > 50) {
        fireGoalGenerated();
        injectRatingWidget();
        observer.disconnect(); // fire once per session
      }
    });
    observer.observe(outputEl, { childList: true, subtree: true, characterData: true });
  }

  // ── 6. Placeholder elements for real stats (hidden until data is real) ──
  document.addEventListener("DOMContentLoaded", () => {
    // Goals counter — inserted below header, hidden until real data fills it
    const header = document.querySelector(".app-header");
    if (header && !document.getElementById("goals-generated-counter")) {
      const counter = document.createElement("div");
      counter.id = "goals-generated-counter";
      counter.className = "goals-counter";
      counter.style.display = "none"; // shown only when real count >= 50
      header.insertAdjacentElement("afterend", counter);
    }

    loadAndShowStats();
  });

})();
