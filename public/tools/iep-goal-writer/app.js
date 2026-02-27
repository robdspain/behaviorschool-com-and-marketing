// IEP Goal Writer — client-only app with local RAG (no external imports for file:// support)

// ---------- Utilities ----------
const $ = (id) => document.getElementById(id);

function pad2(n) { return n.toString().padStart(2, "0"); }

function formatDateMMDDYY(date) {
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const yy = date.getFullYear().toString().slice(-2);
  return `${mm}/${dd}/${yy}`;
}

function oneYearMinusOneDay(from = new Date()) {
  const d = new Date(from.getTime());
  d.setFullYear(d.getFullYear() + 1);
  d.setDate(d.getDate() - 1);
  return d;
}

function clean(text) {
  return (text || "").toString().trim();
}

function parseYYYYMMDD(s) {
  const parts = s.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!parts) return null;
  return new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
}

// ---- Minimal vector helpers (embedded to support file:// usage) ----
const VEC_DIM = 512;
const VEC_STOP = new Set(['the','a','an','and','or','of','to','in','on','for','with','by','at','as','is','are','was','were','be','been','being','that','this','it','from','into','over','under','while','during','their','his','her','its','they','them','he','she','we','you','your','our']);
function vecTokenize(text) { return (text || '').toLowerCase().split(/[^a-z0-9]+/).filter(t => t && t.length > 1 && !VEC_STOP.has(t)); }
function fnv1a32(str) { let h = 0x811c9dc5; for (let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 0x01000193);} return h>>>0; }
function signHash(str) { return (fnv1a32(str+'#') & 1) ? 1 : -1; }
function vecEmbed(text, dim = VEC_DIM) { const v = new Float32Array(dim); const toks = vecTokenize(text); for (const t of toks){ const h = fnv1a32(t)%dim; v[h] += signHash(t);} let n=0; for (let i=0;i<dim;i++) n += v[i]*v[i]; n = Math.sqrt(n)||1; for (let i=0;i<dim;i++) v[i] /= n; return Array.from(v); }
function vecSplit(text) { return (text||'').split(/(?<=[.!?])\s+/).map(s=>s.trim()).filter(Boolean); }

// ---------- Auto measurement rules ----------
function applyMeasurementRules(direction, setDefaults = false) {
  const baselineFrequency = $("baselineFrequency");
  const baselineUnit = $("baselineUnit");
  const baselineMaxConsec = $("baselineMaxConsec");
  const baselinePercentWrapper = $("baselinePercentWrapper");
  const behaviorTitle = $("behaviorTitle");
  const behaviorDefinition = $("behaviorDefinition");

  // Update behavior title dropdown options based on direction
  updateBehaviorTitleOptions(direction);

  if (direction === "decrease") {
    // Only set defaults when specifically requested (e.g., when user reaches step 4)
    if (setDefaults) {
      $("accuracy").value = "0 instances per day";
      $("consistency").value = "for 5 consecutively measured school days";
    }

    // Show frequency/rate fields, hide percentage and days measured fields for decrease
    if (baselineFrequency) baselineFrequency.style.display = "block";
    if (baselineUnit) baselineUnit.style.display = "block";
    if (baselineMaxConsec) baselineMaxConsec.parentElement.style.display = "none";
    if (baselinePercentWrapper) baselinePercentWrapper.style.display = "none";

    if (behaviorDefinition) {
      behaviorDefinition.placeholder = "e.g., hitting, yelling, or leaving assigned area without permission";
    }
  } else {
    // Only set defaults when specifically requested (e.g., when user reaches step 4)
    if (setDefaults) {
      $("accuracy").value = "in 90% of opportunities";
      $("consistency").value = "for 3 consecutively measured school days";
    }

    // Hide frequency/rate fields, show percentage and days measured fields for increase
    if (baselineFrequency) baselineFrequency.parentElement.style.display = "none";
    if (baselineUnit) baselineUnit.parentElement.style.display = "none";
    if (baselineMaxConsec) baselineMaxConsec.parentElement.style.display = "block";
    if (baselinePercentWrapper) baselinePercentWrapper.style.display = "block";

    if (behaviorDefinition) {
      behaviorDefinition.placeholder = "e.g., remaining seated and completing assignments independently";
    }
  }
}

function updateBehaviorTitleOptions(direction) {
  // Use the standard examples system with direction-specific behavior titles
  const ex = loadExamples();
  const fieldKey = direction === "increase" ? "behaviorTitleIncrease" : "behaviorTitleDecrease";
  const arr = ex[fieldKey] || [];

  // Update datalist
  renderDatalist("behaviorTitle", arr);

  // Update example chips
  const container = document.getElementById("behaviorTitleExamples");
  if (!container) return;

  container.innerHTML = arr
    .slice(0, 10)
    .map((v) => `<button type="button" class="example-chip" data-behaviorTitle-pick="${escapeHtml(v)}">${escapeHtml(v)}</button>`)
    .join('');

  // Add event listeners to chips
  container.querySelectorAll('.example-chip[data-behaviorTitle-pick]').forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute('data-behaviorTitle-pick') || '';
      const input = document.getElementById('behaviorTitle');
      if (input && 'value' in input) {
        input.value = val;
        input.dispatchEvent(new Event('input')); // Trigger live preview update
      }
    });
  });
}

// ---------- Baseline builder ----------
function buildBaseline(d) {
  // Strengths-based baseline text per instructions
  const frequency = clean(d.baselineFrequency);
  const unit = clean(d.baselineUnit);
  const percent = clean(d.baselinePercent);
  const maxConsec = clean(d.baselineMaxConsec);
  const lat = clean(d.baselineLatency);
  const gen = clean(d.baselineGeneralization);
  const methods = clean(d.baselineMethods || d.dataMethod);
  const title = clean(d.behaviorTitle);
  const name = clean(d.studentName);
  const subjStart = name || "The student";
  const subj = name || "the student";
  const direction = clean(d.direction) || 'decrease';

  const parts = [];

  // For decrease behaviors, use frequency/rate fields
  if (direction === 'decrease' && frequency && unit) {
    parts.push(`${subjStart} currently engages in ${title} ${frequency} ${unit}.`);
  }
  // For increase behaviors, use percentage field
  else if (direction === 'increase' && percent) {
    parts.push(`${subjStart} currently engages in ${title} ${percent}.`);
  }

  if (maxConsec)
    parts.push(`${subjStart} has demonstrated up to ${maxConsec} with the desired behavior observed during the baseline phase.`);
  if (lat)
    parts.push(`Baseline latency to onset of the behavior is ${lat} seconds.`);
  if (gen)
    parts.push(`Generalization is ${gen} and will continue to be monitored.`);
  if (methods)
    parts.push(`Baseline data measured via ${methods}.`);

  return parts.join(" ");
}

// ---------- Annual goal builder ----------
function buildAnnualGoal(d) {
  const dueText = clean((document.getElementById('dueDate')||{}).value);
  const nativeVal = clean((document.getElementById('dueDateNative')||{}).value);
  const nativeDate = parseYYYYMMDD(nativeVal);
  const dueDate = dueText || (nativeDate ? formatDateMMDDYY(nativeDate) : formatDateMMDDYY(oneYearMinusOneDay(new Date())));
  const name = clean(d.studentName);
  const subj = name || "the student";
  const context = clean(d.context);
  const supports = clean(d.supports);
  const direction = clean(d.direction);
  const title = clean(d.behaviorTitle);
  const definition = clean(d.behaviorDefinition);
  const accuracy = clean($("accuracy").value);
  const consistency = clean($("consistency").value);
  const dataMethod = clean(d.dataMethod);
  const lat = clean(d.latencySeconds);
  const fluency = clean(d.fluencyNotes);
  const settings = clean(d.settingsCount);
  const maint = clean(d.maintenance);

  // Build criteria parts (excluding accuracy since it will be part of the "to" clause)
  const criteriaParts = [];
  if (consistency) criteriaParts.push(consistency);
  if (lat) criteriaParts.push(`initiating within ${lat} seconds`);
  if (fluency) criteriaParts.push(fluency);
  if (settings) criteriaParts.push(`across ${settings} settings`);
  const additionalCriteria = criteriaParts.length > 0 ? `, ${criteriaParts.join(', ')}` : '';

  // Build the goal sentence with embedded baseline
  const contextText = context ? ` in ${context}` : '';
  const supportsText = supports ? ` and given ${supports}` : '';
  const definitionText = definition ? ` (${definition})` : '';
  const targetText = accuracy || '90% of opportunities';
  const maintenanceText = maint ? ` Additionally, ${subj} will ${maint}.` : '';

  // Do NOT embed baseline in the goal sentence; baseline appears separately in Review output
  const goalSentence = `By ${dueDate}, when${contextText}${supportsText}, ${subj} will ${direction} ${title}${definitionText} ${targetText}${additionalCriteria} as measured by ${dataMethod}.${maintenanceText}`;

  return goalSentence;
}

// ---------- Objectives builder (optional) ----------
function evenSpacedDates(n) {
  // Default: about 3 months apart (quarterly cadence)
  const today = new Date();
  const addMonths = (d, m) => { const nd = new Date(d.getTime()); nd.setMonth(nd.getMonth() + m); return nd; };
  const stepMonths = 3; // ~3 months apart
  const dates = [];
  for (let i = 1; i <= n; i++) {
    const due = addMonths(today, i * stepMonths);
    dates.push(formatDateMMDDYY(due));
  }
  return dates;
}

function buildObjectives(d, count) {
  const direction = d.direction;
  const name = clean(d.studentName);
  const subjStart = name || "The student";
  const subj = name || "the student";
  const context = clean(d.context);
  const supports = clean(d.supports);
  const title = clean(d.behaviorTitle);
  const definition = clean(d.behaviorDefinition);
  const dataMethod = clean(d.dataMethod);
  // Advanced criteria omitted for objectives to ensure only one measurement varies per objective

  const dueDates = evenSpacedDates(count);
  const objs = [];

  if (direction === "increase") {
    // Vary only one measurement: accuracy target; keep consistency fixed (3 days)
    const targets = ["60% of opportunities","70% of opportunities","80% of opportunities","85% of opportunities","90% of opportunities"];
    const steps = targets.slice(0, count);
    steps.forEach((t, idx) => {
      const due = dueDates[idx];
      const contextText = context ? ` in ${context}` : '';
      const supportsText = supports ? ` and given ${supports}` : '';
      const definitionText = definition ? ` (${definition})` : '';

      objs.push(`Objective ${idx + 1} (due ${due}): By ${due}, when${contextText}${supportsText}, ${subj} will ${direction} ${title}${definitionText} ${t}, for 3 consecutively measured school days as measured by ${dataMethod}.`);
    });
  } else {
    // Vary only one measurement: frequency/threshold per day; keep consistency fixed (3 days)
    const stepsPool = [
      "≤5 instances per day for 3 consecutively measured school days",
      "≤3 instances per day for 3 consecutively measured school days",
      "≤1 instance per day for 3 consecutively measured school days",
      "0 instances per day for 5 consecutively measured school days",
      "0 instances per day for 5 consecutively measured school days"
    ];
    const steps = stepsPool.slice(0, count);
    steps.forEach((criteria, idx) => {
      const due = dueDates[idx];
      const contextText = context ? ` in ${context}` : '';
      const supportsText = supports ? ` and given ${supports}` : '';
      const definitionText = definition ? ` (${definition})` : '';

      objs.push(`Objective ${idx + 1} (due ${due}): By ${due}, when${contextText}${supportsText}, ${subj} will ${direction} ${title}${definitionText} to ${criteria} as measured by ${dataMethod}.`);
    });
  }

  return objs;
}

// ---------- RAG: Local document store ----------
const KB_KEY = "iep_goal_writer_kb_v1";
const KB_VEC_KEY = "iep_goal_writer_kb_vec_v1";
const KB_USE_VEC_KEY = "iep_goal_writer_kb_use_vec_v1";
const KB_USE_HYBRID_KEY = "iep_goal_writer_kb_use_hybrid_v1";

// ---- In-field examples (with add/remove) ----
const EX_DEFAULTS = {
  context: [
    'in the classroom sitting at his desk',
    'during math class',
    'during reading class',
    'during writing class',
    'during science class',
    'during social studies class',
    'in the hallway',
    'in the cafeteria',
    'on the bus',
    'at recess'
  ],
  supports: [
    'a visual schedule',
    'a token board',
    'a social narrative',
    'a choice board',
    'a fidget toy',
    'a weighted vest',
    'a quiet corner',
    'a peer tutor',
    'a check-in/check-out system',
    'a behavior contract'
  ],
  dataMethod: [
    'teacher observation and behavior tracking sheets',
    'direct observation with frequency recording',
    'ABC data collection and analysis',
    'duration recording and time sampling',
    'interval recording with data sheets',
    'scatterplot analysis and incident reports',
    'video recording and behavioral coding',
    'peer observation and staff documentation',
    'electronic data collection system',
    'permanent product recording and work samples'
  ],
  behaviorTitleIncrease: [
    'on-task behavior',
    'following directions',
    'completing assignments',
    'social skills',
    'communication skills',
    'compliance',
    'participation',
    'attention to task',
    'work completion',
    'appropriate interactions'
  ],
  behaviorTitleDecrease: [
    'aggressive behavior',
    'calling out',
    'off-task behavior',
    'disruptive behavior',
    'inappropriate vocalizations',
    'tantrum behavior',
    'elopement',
    'self-injurious behavior',
    'property destruction'
  ]
};
const EX_KEY = 'iep_examples_v1';
function loadExamples() { try { return JSON.parse(localStorage.getItem(EX_KEY) || 'null') || EX_DEFAULTS; } catch { return EX_DEFAULTS; } }
function saveExamples(ex) { try { localStorage.setItem(EX_KEY, JSON.stringify(ex)); } catch {} }
function renderDatalist(field, arr) {
  const listId = field + 'List';
  const dl = document.getElementById(listId); if (!dl) return;
  dl.innerHTML = arr.map(v => `<option value="${escapeHtml(v)}"></option>`).join('');
}
function renderExamplesUI(field) {
  const ex = loadExamples();
  const arr = ex[field] || [];
  renderDatalist(field, arr);
  const container = document.getElementById(field + 'Examples'); if (!container) return;
  container.innerHTML = arr
    .slice(0, 10)
    .map((v) => `<button type="button" class="example-chip" data-${field}-pick="${escapeHtml(v)}">${escapeHtml(v)}</button>`)
    .join('');
  container.querySelectorAll(`.example-chip[data-${field}-pick]`).forEach(chip => {
    chip.addEventListener('click', () => {
      const val = chip.getAttribute(`data-${field}-pick`) || '';
      const input = document.getElementById(field);
      if (input && 'value' in input) input.value = val;
      const box = document.getElementById(field + 'Manage');
      if (box) box.hidden = true;
      updateInlinePreview();
      updateQualityUI();
    });
  });
}

// Knowledge list removed

function escapeHtml(s) {
  return (s || "").replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
}

// handleUpload removed

// kbSearch removed

// renderKBResults removed

// ---- Vector KB ---
function loadKBVec() {
  try { return JSON.parse(localStorage.getItem(KB_VEC_KEY) || '{}'); } catch { return {}; }
}
function saveKBVec(data) { localStorage.setItem(KB_VEC_KEY, JSON.stringify(data)); }
function buildVectorIndex(dim = VEC_DIM) {
  const docs = loadKB();
  if (!docs.length) return 0;
  const entries = [];
  for (const d of docs) {
    const sents = (vecSplit(d.text) || []);
    for (const s of sents) {
      if (!s) continue;
      const v = vecEmbed(s, dim);
      entries.push({ sentence: s, source: d.name, vector: v });
    }
  }
  saveKBVec({ dim, entriesCount: entries.length, entries });
  return entries.length;
}
function kbVectorSearch(query, topK = 5) {
  const store = loadKBVec();
  const entries = store.entries || [];
  if (!entries.length || !query) return [];
  const qv = vecEmbed(query, store.dim || VEC_DIM);
  const scored = entries.map(e => ({ sentence: e.sentence, source: e.source, score: dot(qv, e.vector) }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
function dot(a, b) {
  let s = 0; const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) s += a[i] * b[i];
  return s;
}
function getKBUseVec() { const el = $("kbUseVec"); return !!(el && el.checked); }
function getKBUseHybrid() { const el = $("kbUseHybrid"); return !!(el && el.checked); }

function chooseKBSearch(query, topK = 5) {
  if (!query) return [];
  if (getKBUseHybrid() && (loadKBVec().entriesCount || 0) > 0) return kbHybridSearch(query, topK, getKBAlpha());
  if (getKBUseVec() && (loadKBVec().entriesCount || 0) > 0) return kbVectorSearch(query, topK);
  return kbSearch(query, topK);
}
function renderKBVecStatus() {
  const s = loadKBVec();
  const count = s.entriesCount || 0;
  const useHybrid = getKBUseHybrid();
  const useVec = getKBUseVec();
  const el = $("kbVecStatus");
  if (!el) return;
  const mode = useHybrid && count > 0 ? `Hybrid (${Math.round(getKBAlpha()*100)}% vec)` : (useVec && count > 0 ? 'Vector' : 'Keyword');
  el.innerHTML = `<div class="kb-result">Vector index: ${count} sentences indexed. Mode: ${mode} search.</div>`;
}

// Hybrid search: blend vector and keyword scores
function kbHybridSearch(query, topK = 5, alpha = 0.6) {
  const s = loadKBVec();
  const hasVec = (s.entriesCount || 0) > 0;
  if (!hasVec) return kbSearch(query, topK);

  const kwTop = kbSearch(query, Math.max(10, topK * 3));
  const vecTop = kbVectorSearch(query, Math.max(10, topK * 3));

  const key = (it) => `${it.source}::${it.sentence}`;
  const map = new Map();

  let kwMax = 0; let vecMax = 0;
  for (const it of kwTop) {
    kwMax = Math.max(kwMax, it.score || 0);
    const k = key(it);
    map.set(k, { source: it.source, sentence: it.sentence, kw: it.score || 0, vec: 0 });
  }
  for (const it of vecTop) {
    vecMax = Math.max(vecMax, it.score || 0);
    const k = key(it);
    const prev = map.get(k) || { source: it.source, sentence: it.sentence, kw: 0, vec: 0 };
    map.set(k, { ...prev, vec: it.score || 0 });
  }

  const items = Array.from(map.values()).map(it => {
    const kwNorm = kwMax > 0 ? (it.kw / kwMax) : 0;
    // vec score is cosine, typically [-1,1]; rescale to [0,1], then normalize within candidates
    const vecRescaled = (it.vec + 1) / 2;
    // normalize by vecMax (rescaled)
    const vecMaxRescaled = (vecMax + 1) / 2 || 1;
    const vecNorm = vecMaxRescaled > 0 ? (vecRescaled / vecMaxRescaled) : 0;
    const score = alpha * vecNorm + (1 - alpha) * kwNorm;
    return { ...it, score };
  });

  items.sort((a, b) => b.score - a.score);
  return items.slice(0, topK);
}

// Alpha persistence + UI labels
const KB_ALPHA_KEY = 'iep_goal_writer_kb_alpha_v1';
function getKBAlpha() {
  const el = $("kbHybridAlpha");
  if (!el) return loadKBAlpha() ?? 0.6;
  const v = Number(el.value);
  return isFinite(v) ? Math.min(1, Math.max(0, v/100)) : (loadKBAlpha() ?? 0.6);
}
function loadKBAlpha() { try { const s = localStorage.getItem(KB_ALPHA_KEY); return s == null ? null : Number(s); } catch { return null; } }
function saveKBAlpha(a) { try { localStorage.setItem(KB_ALPHA_KEY, String(a)); } catch {} }
function updateAlphaLabels() {
  const a = getKBAlpha();
  const vec = Math.round(a*100);
  const kw = 100 - vec;
  const vEl = document.getElementById('kbHybridAlphaText');
  const kEl = document.getElementById('kbHybridAlphaTextKw');
  if (vEl) vEl.textContent = `${vec}%`;
  if (kEl) kEl.textContent = `${kw}%`;
  renderKBVecStatus();
}

function clearKBVec() { try { localStorage.removeItem(KB_VEC_KEY); } catch {} }

// Manage examples for a field
function initExamplesManage(field) {
  const manageBtn = document.getElementById(field + 'ManageBtn');
  const manageBox = document.getElementById(field + 'Manage');
  if (!manageBtn || !manageBox) return;

  // Initial render (10 examples)
  renderExamplesUI(field);
  manageBtn.addEventListener('click', () => {
    // Refresh examples and toggle visibility
    renderExamplesUI(field);
    manageBox.hidden = !manageBox.hidden;
  });
}
// Small helpers for persisted toggles
function loadBool(key) { try { const v = localStorage.getItem(key); return v == null ? null : v === 'true'; } catch { return null; } }
function saveBool(key, val) { try { localStorage.setItem(key, String(!!val)); } catch {} }

function suggestFromKB(d) {
  // Use behavior terms + title as query
  const q = [d.behaviorTitle, d.behaviorDefinition].filter(Boolean).join(" ");
  const hits = getKBUseVec() ? kbVectorSearch(q, 3) : kbSearch(q, 3);
  const snippets = hits.map(h => `${h.sentence} (source: ${h.source})`);
  if (!snippets.length) return "";
  return `Standards Alignment / Notes: ${snippets.join(" | ")}`;
}

// ---------- Generation orchestration ----------
function getVal(id) {
  const el = document.getElementById(id);
  return el && 'value' in el ? String(el.value) : '';
}
function getChecked(id) {
  const el = document.getElementById(id);
  return !!(el && 'checked' in el && el.checked);
}
function collectForm() {
  return {
    studentName: getVal("studentName"),
    direction: getVal("direction") || 'decrease',
    behaviorTitle: getVal("behaviorTitle"),
    behaviorDefinition: getVal("behaviorDefinition"),
    context: getVal("context"),
    supports: getVal("supports"),
    dataMethod: getVal("dataMethod"),
    goalLevel: getVal("goalLevel"),
    latencySeconds: getVal("latencySeconds"),
    fluencyNotes: getVal("fluencyNotes"),
    settingsCount: getVal("settingsCount"),
    maintenance: getVal("maintenance"),
    baselineFrequency: getVal("baselineFrequency"),
    baselineUnit: getVal("baselineUnit"),
    baselinePercent: getVal("baselinePercent"),
    baselineMaxConsec: getVal("baselineMaxConsec"),
    baselineLatency: getVal("baselineLatency"),
    baselineGeneralization: getVal("baselineGeneralization"),
    baselineMethods: getVal("baselineMethods"),
    includeObjectives: getChecked("includeObjectives"),
    objectivesCount: parseInt(getVal("objectivesCount") || "3", 10),
    embedBaseline: getChecked("embedBaseline"),
  };
}

function validateCore(d) {
  const required = [
    [d.behaviorTitle, "Title of Behavior"],
    [d.behaviorDefinition, "Definition of Behavior"],
    [d.context, "Specific Context"],
    [d.supports, "Specific Supports"],
    [d.dataMethod, "Data Collection Method"]
  ];

  // Validate baseline data based on direction
  const direction = clean(d.direction) || 'decrease';
  if (direction === 'decrease') {
    if (!clean(d.baselineFrequency) || !clean(d.baselineUnit)) {
      required.push([false, "Baseline Frequency and Unit"]);
    }
  } else {
    if (!clean(d.baselinePercent)) {
      required.push([false, "Baseline Percentage Correct"]);
    }
  }

  const missing = required.filter(([v]) => !clean(v)).map(([,label]) => label);
  if (missing.length) throw new Error("Missing: " + missing.join(", "));
}

function generateAll() {
  const d = collectForm();
  validateCore(d);
  const goal = buildAnnualGoal(d);
  const baselineText = buildBaseline(d);
  let output = `Baseline:\n${baselineText}\n\nGoal:\n${goal}`;

  if (d.includeObjectives) {
    // Default to quarterly objectives (4) when included
    const count = 4;
    const objs = buildObjectives(d, count);
    output += `\n\nShort-Term Objectives:\n` + objs.join("\n\n");
  }

  // Knowledge suggestions removed

  return output;
}

// ---------- Wizard helpers ----------
let currentStep = 1;
const totalSteps = 5;

function showStep(step) {
  currentStep = Math.max(1, Math.min(totalSteps, step));
  document.querySelectorAll('.step').forEach(sec => {
    const s = Number(sec.getAttribute('data-step'));
    const wasHidden = sec.hidden;
    sec.hidden = s !== currentStep;
    if (!sec.hidden && wasHidden) {
      sec.classList.remove('step-enter');
      void sec.offsetWidth;
      sec.classList.add('step-enter');
    }
  });

  // Set measurement defaults when user reaches step 4
  if (currentStep === 4) {
    const direction = $("direction").value || 'decrease';
    applyMeasurementRules(direction, true); // true = set defaults
  }

  updateProgress();
  if (currentStep === 5) {
    // Auto-generate preview in review step
    try { const out = generateAll(); $("output").textContent = out; $("copyBtn").disabled = false; $("downloadBtn").disabled = false; $("validationMsg").textContent = ""; } catch (e) { $("validationMsg").textContent = "Fill required fields before generating."; }
  }
}

function updateProgress() {
  document.querySelectorAll('.wizard-step').forEach(el => {
    const n = Number(el.getAttribute('data-step-label'));
    el.classList.toggle('active', n === currentStep);
  });
  updateInlinePreview();
}

// ---------- Event wiring ----------
document.addEventListener("DOMContentLoaded", () => {
  // Embed mode for iframe lead magnet
  const params = new URLSearchParams(window.location.search);
  const isEmbed = params.get('embed') === '1' || params.get('embed') === 'true';
  const isOutline = params.get('outline') === '1' || params.get('outline') === 'true';
  const brand = (params.get('brand') || '').toLowerCase();
  if (isEmbed) {
    document.body.classList.add('embed');
    // Add CTA bar
    const cta = document.createElement('div');
    cta.className = 'embed-cta';
    const href = params.get('cta') || 'https://behaviorschool.com/iep-behavior-goals';
    cta.innerHTML = `<span>Love this behavior goal writer? Get the full AI version.</span><a href="${href}" target="_blank" rel="noopener">Try Full App</a>`;
    document.querySelector('main')?.appendChild(cta);
  }
  if (isOutline) {
    document.body.classList.add('outline');
  }
  if (brand === 'behaviorschool') {
    document.body.classList.add('brand-bs');
  }

  // Optional brand overrides via URL params (hex-encoded), e.g., &primary=%23047857
  const rootStyle = document.documentElement.style;
  const setVar = (name, val) => { if (val) rootStyle.setProperty(name, val); };
  setVar('--bs-color-primary', params.get('primary'));
  setVar('--bs-color-primary-hover', params.get('primaryHover'));
  setVar('--bs-color-text', params.get('text'));
  setVar('--bs-color-heading', params.get('heading'));
  setVar('--bs-color-background', params.get('background'));
  setVar('--bs-color-surface', params.get('surface'));
  setVar('--bs-color-border', params.get('border'));
  setVar('--bs-link', params.get('link'));
  setVar('--bs-radius', params.get('radius'));
  setVar('--bs-shadow', params.get('shadow'));
  const fontParam = params.get('font');
  if (fontParam) {
    // Expect URI-encoded font stack, e.g., ui-sans-serif,system-ui,-apple-system,Segoe UI
    rootStyle.setProperty('--bs-font', decodeURIComponent(fontParam));
  }
  // Set baseline field visibility only, no defaults
  applyMeasurementRules($("direction").value, false);
  $("direction").addEventListener("change", (e) => {
    const shouldSetDefaults = currentStep >= 4; // Only set defaults if on step 4+
    applyMeasurementRules(e.target.value, shouldSetDefaults);
  });

  // Initialize examples for data method field
  renderExamplesUI('dataMethod');

  // Generate button removed; output is auto-generated on Review step

  $("copyBtn").addEventListener("click", async () => {
    const txt = $("output").textContent || "";
    await navigator.clipboard.writeText(txt);
  });

  $("downloadBtn").addEventListener("click", () => {
    const blob = new Blob([$("output").textContent || ""], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "iep_goal.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  // Examples and Knowledge features removed per user request
  initUIEnhancements();
  initExamplesManage('context');
  initExamplesManage('supports');
  initExamplesManage('dataMethod');
  // Wizard controls
  $("prevStep").addEventListener('click', () => showStep(currentStep - 1));
  $("nextStep").addEventListener('click', () => showStep(currentStep + 1));
  // Outline mode starts on Review step (5)
  showStep(isOutline ? 5 : 1);
  updateInlinePreview();
  // Fallback: always refresh preview on any input/change anywhere
  if (isEmbed || isOutline) scheduleResizeToParent();

  // Initialize vanilla-datepicker
  const elem = document.getElementById('dueDate');
  if (elem) {
    const datepicker = new Datepicker(elem, {
      format: 'mm/dd/yy',
      autohide: true
    });

    // Add event listener for datepicker changes to update preview
    elem.addEventListener('changeDate', () => {
      updateInlinePreview();
      updateQualityUI();
    });
  }

  const autoPreviewCheckbox = $("autoPreview");

  const updatePreview = () => {
    if (autoPreviewCheckbox.checked) {
      updateInlinePreview();
      updateQualityUI();
    }
  };

  autoPreviewCheckbox.addEventListener("change", updatePreview);

  const watchedSelectors = [
    "studentName",
    "direction",
    "behaviorTitle",
    "behaviorDefinition",
    "context",
    "supports",
    "dataMethod",
    "latencySeconds",
    "fluencyNotes",
    "settingsCount",
    "maintenance",
    "baselineFrequency",
    "baselineUnit",
    "baselinePercent",
    "baselineMaxConsec",
    "baselineLatency",
    "baselineGeneralization",
    "baselineMethods",
    "embedBaseline",
    "includeObjectives",
    "accuracy",
    "consistency",
    "dueDate",
  ];

  watchedSelectors.forEach((id) => {
    const el = $(id);
    if (el) {
      el.addEventListener("input", updatePreview);
      el.addEventListener("change", updatePreview);
    }
  });

  // Initialize Motion animations for premium UI effects
  initMotionAnimations();

  // Share button functionality
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      const title = 'IEP Behavior Goal Writer';
      const text = 'Check out this free IEP Behavior Goal Writer tool - create standards-compliant behavior goals in minutes!';

      // Check if Web Share API is supported
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            text: text,
            url: url
          });
        } catch (err) {
          // User cancelled or error occurred
          if (err.name !== 'AbortError') {
            fallbackCopyToClipboard(url, shareBtn);
          }
        }
      } else {
        // Fallback to clipboard copy
        fallbackCopyToClipboard(url, shareBtn);
      }
    });
  }

  function fallbackCopyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
      // Visual feedback
      const originalHTML = button.innerHTML;
      button.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Link Copied!</span>
      `;
      button.style.background = 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';

      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
      }, 2000);
    }).catch(() => {
      alert('Unable to copy link. Please copy manually: ' + text);
    });
  }
});

// Examples and CCSS stub removed per user request

// ---------- UI Enhancements ----------
function initUIEnhancements() {
  // Due date default (do not override user edits)
  const dd = $("dueDate");
  const native = document.getElementById('dueDateNative');
  const def = oneYearMinusOneDay(new Date());
  if (dd && !dd.value) dd.value = formatDateMMDDYY(def);
  if (native && !native.value) {
    const yyyy = def.getFullYear();
    const mm = String(def.getMonth()+1).padStart(2,'0');
    const ddm = String(def.getDate()).padStart(2,'0');
    native.value = `${yyyy}-${mm}-${ddm}`;
  }

  // Direction segmented
  const dirInc = $("dirInc");
  const dirDec = $("dirDec");
  const setDir = (val) => {
    $("direction").value = val;
    dirInc.setAttribute("aria-selected", String(val === "increase"));
    dirDec.setAttribute("aria-selected", String(val === "decrease"));
    dirInc.classList.toggle('active', val === 'increase');
    dirDec.classList.toggle('active', val === 'decrease');
    applyMeasurementRules(val);
    tryAutoPreview();
    updateInlinePreview();
  };
  if (dirInc) dirInc.addEventListener("click", (e) => { e.preventDefault(); setDir("increase"); });
  if (dirDec) dirDec.addEventListener("click", (e) => { e.preventDefault(); setDir("decrease"); });
  // Ensure initial visual state
  setDir($("direction").value || 'decrease');

  // Button ripple + press micro-interactions
  document.addEventListener('click', (ev) => {
    const target = ev.target.closest('button');
    if (!target) return;
    const rect = target.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${ev.clientX - rect.left - size/2}px`;
    ripple.style.top = `${ev.clientY - rect.top - size/2}px`;
    target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  }, { passive: true });

  // Quality meter initial update
  updateQualityUI();

  // Show/hide advanced (only if toggle exists)
  const advToggle = $("showAdvanced");
  const adv = $("advancedSection");
  const opts = $("optionsSection");
  if (advToggle) {
    const syncAdv = () => {
      const shown = !!advToggle.checked;
      if (adv) adv.hidden = !shown;
      if (opts) opts.hidden = !shown;
    };
    advToggle.addEventListener("change", syncAdv);
    syncAdv();
  }

  // Light live preview on changes only in review step
  const reviewStepWatchedSelectors = ["studentName","direction","behaviorTitle","behaviorDefinition","context","supports","dataMethod","latencySeconds","fluencyNotes","settingsCount","maintenance","baselineFrequency","baselineUnit","baselinePercent","baselineMaxConsec","baselineLatency","baselineGeneralization","baselineMethods","embedBaseline","includeObjectives","objectivesCount","accuracy","consistency","dueDate"];
  reviewStepWatchedSelectors.forEach(id => {
    const el = $(id);
    if (!el) return;
    const eventType = el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(eventType, () => { if (currentStep === 5) try { $("output").textContent = generateAll(); } catch {} });
  });

  // Reset
  const resetBtn = $("resetBtn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      document.querySelectorAll("input[type=text], input[type=number]").forEach(i => i.value = "");
      const incObj = $("includeObjectives"); if (incObj) incObj.checked = false;
      const objCount = $("objectivesCount"); if (objCount) objCount.value = 4;
      setDir("decrease");
      updateQualityUI();
      $("dueDate").value = formatDateMMDDYY(oneYearMinusOneDay(new Date()));
      $("output").textContent = "";
      $("copyBtn").disabled = true;
      $("downloadBtn").disabled = true;
      $("validationMsg").textContent = "";
    });
  }
}

function tryAutoPreview() { /* no-op in simplified wizard; handled in showStep and change listeners */ }

// ---------- Motion animations for premium UI effects ----------
function initMotionAnimations() {
  if (typeof Motion === 'undefined') return; // Exit if Motion library not loaded

  const { animate, spring, stagger } = Motion;

  // Animate header elements on page load
  const appHeader = document.querySelector('.app-header');
  const appTitle = document.querySelector('.app-title');
  const appSubtitle = document.querySelector('.app-subtitle');
  const shareBtn = document.querySelector('.share-btn');

  if (appHeader) {
    // Header slide down
    animate(
      appHeader,
      {
        opacity: [0, 1],
        transform: ['translateY(-20px)', 'translateY(0)']
      },
      { duration: 0.6, easing: spring({ stiffness: 150, damping: 20 }) }
    );
  }

  if (appTitle) {
    animate(
      appTitle,
      {
        opacity: [0, 1],
        transform: ['translateX(-20px)', 'translateX(0)']
      },
      { duration: 0.7, delay: 0.1, easing: spring({ stiffness: 200, damping: 20 }) }
    );
  }

  if (appSubtitle) {
    animate(
      appSubtitle,
      {
        opacity: [0, 1],
        transform: ['translateX(-15px)', 'translateX(0)']
      },
      { duration: 0.6, delay: 0.25, easing: 'ease-out' }
    );
  }

  if (shareBtn) {
    animate(
      shareBtn,
      {
        opacity: [0, 1],
        transform: ['scale(0.8)', 'scale(1)']
      },
      { duration: 0.5, delay: 0.35, easing: spring({ stiffness: 300, damping: 15 }) }
    );

    // Add hover animation enhancement
    shareBtn.addEventListener('mouseenter', () => {
      animate(
        shareBtn,
        { scale: 1.05 },
        { duration: 0.2, easing: 'ease-out' }
      );
    });

    shareBtn.addEventListener('mouseleave', () => {
      animate(
        shareBtn,
        { scale: 1 },
        { duration: 0.2, easing: 'ease-out' }
      );
    });
  }

  // Footer animation on scroll into view
  const appFooter = document.querySelector('.app-footer');
  if (appFooter) {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const footerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(
            appFooter,
            {
              opacity: [0, 1],
              transform: ['translateY(30px)', 'translateY(0)']
            },
            { duration: 0.8, easing: spring({ stiffness: 150, damping: 20 }) }
          );
          footerObserver.disconnect();
        }
      });
    }, observerOptions);

    appFooter.style.opacity = '0';
    footerObserver.observe(appFooter);
  }

  // Animate the highlight-box on page load with sophisticated entrance
  const highlightBox = document.querySelector('.toggle.highlight-box');
  if (highlightBox) {
    // Initial state
    highlightBox.style.opacity = '0';
    highlightBox.style.transform = 'translateY(20px) scale(0.95)';

    // Entrance animation with spring physics
    setTimeout(() => {
      animate(
        highlightBox,
        {
          opacity: [0, 1],
          transform: ['translateY(20px) scale(0.95)', 'translateY(0px) scale(1)']
        },
        {
          duration: 0.8,
          easing: spring({ stiffness: 200, damping: 20, mass: 1 })
        }
      );
    }, 300);

    // Add shimmer effect on load
    setTimeout(() => {
      animate(
        highlightBox,
        {
          boxShadow: [
            '0 1px 3px rgba(4, 120, 87, 0.08), 0 4px 12px rgba(4, 120, 87, 0.12), 0 8px 32px rgba(4, 120, 87, 0.08)',
            '0 2px 6px rgba(4, 120, 87, 0.15), 0 8px 20px rgba(4, 120, 87, 0.2), 0 16px 40px rgba(4, 120, 87, 0.15)',
            '0 1px 3px rgba(4, 120, 87, 0.08), 0 4px 12px rgba(4, 120, 87, 0.12), 0 8px 32px rgba(4, 120, 87, 0.08)'
          ]
        },
        { duration: 2, easing: 'ease-in-out' }
      );
    }, 1100);
  }

  // Checkbox toggle animations with confetti-like effect
  const checkbox = document.querySelector('#includeObjectives');
  if (checkbox) {
    checkbox.addEventListener('change', (e) => {
      const label = e.target.closest('.toggle.highlight-box');

      if (e.target.checked) {
        // Checked animation - celebration effect
        animate(
          label,
          {
            scale: [1, 1.05, 1],
            rotate: [0, -2, 2, 0]
          },
          {
            duration: 0.5,
            easing: spring({ stiffness: 300, damping: 15 })
          }
        );

        // Glow pulse effect
        animate(
          label,
          {
            boxShadow: [
              '0 1px 3px rgba(4, 120, 87, 0.08), 0 4px 12px rgba(4, 120, 87, 0.12), 0 8px 32px rgba(4, 120, 87, 0.08)',
              '0 4px 12px rgba(4, 120, 87, 0.3), 0 8px 24px rgba(16, 185, 129, 0.4), 0 16px 48px rgba(4, 120, 87, 0.2)',
              '0 2px 4px rgba(4, 120, 87, 0.1), 0 8px 16px rgba(4, 120, 87, 0.15), 0 16px 48px rgba(4, 120, 87, 0.12)'
            ]
          },
          { duration: 0.8, easing: 'ease-out' }
        );

        // Checkbox bounce
        animate(
          checkbox,
          { scale: [1, 1.3, 1] },
          { duration: 0.4, easing: spring({ stiffness: 500, damping: 10 }) }
        );

      } else {
        // Unchecked animation - subtle shrink
        animate(
          label,
          { scale: [1, 0.98, 1] },
          { duration: 0.3, easing: 'ease-out' }
        );

        animate(
          checkbox,
          { scale: [1, 0.9, 1] },
          { duration: 0.3 }
        );
      }
    });

    // Add ripple effect on click
    highlightBox?.addEventListener('click', (e) => {
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, transparent 70%);
        pointer-events: none;
        width: 20px;
        height: 20px;
        left: ${e.offsetX - 10}px;
        top: ${e.offsetY - 10}px;
      `;
      highlightBox.appendChild(ripple);

      animate(
        ripple,
        {
          width: ['20px', '300px'],
          height: ['20px', '300px'],
          left: [e.offsetX - 10, e.offsetX - 150],
          top: [e.offsetY - 10, e.offsetY - 150],
          opacity: [0.6, 0]
        },
        {
          duration: 0.8,
          easing: 'ease-out'
        }
      ).finished.then(() => ripple.remove());
    });
  }

  // Animate text span on hover with micro-movements
  const textSpan = highlightBox?.querySelector('span');
  if (textSpan && highlightBox) {
    highlightBox.addEventListener('mouseenter', () => {
      animate(
        textSpan,
        {
          letterSpacing: ['-0.01em', '0.005em'],
          x: [0, 2, 0]
        },
        { duration: 0.4, easing: spring({ stiffness: 300, damping: 20 }) }
      );
    });
  }

  // Animate star icon on load to draw attention
  const starIcon = highlightBox?.querySelector('svg');
  if (starIcon) {
    setTimeout(() => {
      animate(
        starIcon,
        {
          scale: [1, 1.2, 1, 1.1, 1],
          rotate: [0, -10, 10, -5, 0],
          filter: [
            'drop-shadow(0 0 0 rgba(4, 120, 87, 0))',
            'drop-shadow(0 0 12px rgba(4, 120, 87, 0.6))',
            'drop-shadow(0 0 8px rgba(4, 120, 87, 0.4))',
            'drop-shadow(0 0 0 rgba(4, 120, 87, 0))'
          ]
        },
        {
          duration: 1.2,
          easing: spring({ stiffness: 200, damping: 12 })
        }
      );
    }, 1500);

    // Subtle continuous pulse every 8 seconds to maintain attention
    setInterval(() => {
      if (!checkbox?.checked) { // Only pulse if not checked
        animate(
          starIcon,
          {
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          },
          { duration: 0.8, easing: 'ease-in-out' }
        );
      }
    }, 8000);
  }
}

// Live inline preview (partial goal)
function updateInlinePreview() {
  const el = document.getElementById('inlinePreview');
  if (!el) return;
  try {
    const d = collectForm();
    el.textContent = buildPartialGoal(d, currentStep);
    scheduleResizeToParent();
  } catch (e) { console.error("updateInlinePreview error:", e); /* ignore */ }
}

function buildPartialGoal(d, step) {
  const dueText = clean((document.getElementById('dueDate')||{}).value);
  const nativeVal = clean((document.getElementById('dueDateNative')||{}).value);
  const nativeDate = parseYYYYMMDD(nativeVal);
  const due = dueText || (nativeDate ? formatDateMMDDYY(nativeDate) : formatDateMMDDYY(oneYearMinusOneDay(new Date())));
  const name = clean(d.studentName);
  const subj = name || 'the student';
  const direction = clean(d.direction) || 'decrease';
  const title = clean(d.behaviorTitle);
  const definition = clean(d.behaviorDefinition);
  const context = clean(d.context);
  const supports = clean(d.supports);

  // Only show measurements if we're on step 4 or later AND user has entered them
  const acc = step >= 4 ? clean($("accuracy").value) : '';
  const cons = step >= 4 ? clean($("consistency").value) : '';
  const dataMethod = step >= 4 ? clean(d.dataMethod) : '';

  // Progressive inline preview based on current step:
  if (!(context || supports || title || definition || name)) return '';

  let out = `By ${due}`;

  // Step 3: Only add "when" clause after Context & Supports step
  if (step >= 3 && context) {
    const contextText = context ? ` in ${context}` : '';
    const supportsText = supports ? ` and given ${supports}` : '';
    out += `, when${contextText}${supportsText}`;
  }

  if (name) out += `, ${name}`; else out += `, ${subj}`;

  // Step 1: Only show behavior info from step 1
  if (title || definition) {
    const definitionText = definition ? ` (${definition})` : '';
    out += ` will ${direction} ${title}${definitionText}`;

    // Step 4: Only show measurements from step 4 onwards
    if (step >= 4) {
      if (acc) out += ` ${acc}`;
      if (cons) out += `, ${cons}`;
      if (dataMethod) out += ` as measured by ${dataMethod}`;
    }
    out += `.`;
  }

  return out;
}

// Compute quality level (1–5) based on filled fields
function computeQualityLevel(d) {
  // 4-step quality meter aligned to simplified flow
  const hasName = !!clean(d.studentName);
  const hasDate = !!clean((document.getElementById('dueDate')||{}).value);
  const hasDirection = !!clean(d.direction);
  const hasBehavior = !!clean(d.behaviorTitle) && !!clean(d.behaviorDefinition);
  const hasContext = !!clean(d.context);
  const hasSupports = !!clean(d.supports);
  const hasAcc = !!clean($("accuracy").value);
  const hasCons = !!clean($("consistency").value);
  const hasDataMethod = !!clean(d.dataMethod);

  const dir = clean(d.direction) || 'increase';
  const hasBaseline = dir === 'decrease'
    ? (!!clean(d.baselineFrequency) && !!clean(d.baselineUnit))
    : !!clean(d.baselinePercent); // Check baseline percentage for increase behaviors

  let level = 0;
  // 1 — Basic Goal
  if (hasName && hasDate && hasDirection && hasBehavior) level = 1;
  // 2 — Baseline
  if (hasBaseline) level = Math.max(level, 2);
  // 3 — Context & Measurement
  if (hasContext && hasSupports && hasAcc && hasCons && hasDataMethod) level = Math.max(level, 3);
  // 4 — Ready to Generate (all core fields present)
  const hasCore = hasBehavior && hasBaseline && hasContext && hasSupports && hasDataMethod;
  if (hasCore) level = Math.max(level, 4);

  return Math.max(0, Math.min(4, level));
}

function updateQualityUI() {
  const d = collectForm();
  const level = computeQualityLevel(d);
  const levelText = $("levelText");
  const fill = document.getElementById('qualityFill');
  const labels = {
    0: 'Fill fields to assess quality',
    1: '1 — Basic Goal • Low 🔴',
    2: '2 — Baseline • Moderate 🟡',
    3: '3 — Context & Measures • Strong 🟢',
    4: '4 — Ready to Generate ✅'
  };
  if (levelText) {
    levelText.textContent = labels[level] || labels[0];
  }
  if (fill) {
    const pct = (level / 4) * 100;
    fill.style.width = `${pct}%`;
  }
  scheduleResizeToParent();
}

// Auto-resize iframe: postMessage height to parent when embedded
let resizeTimer = null;
function scheduleResizeToParent() {
  if (!document.body.classList.contains('embed')) return;
  if (resizeTimer) cancelAnimationFrame(resizeTimer);
  resizeTimer = requestAnimationFrame(() => {
    const h = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    try { window.parent.postMessage({ type: 'iep-embed-height', height: h }, '*'); } catch {}
  });
}
