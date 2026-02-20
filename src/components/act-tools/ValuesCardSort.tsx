"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DraggableAttributes,
  type DraggableSyntheticListeners,
} from "@dnd-kit/core";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ClipboardCopy,
  Download,
  Printer,
  Sparkles,
  Target,
} from "lucide-react";

const steps = ["Sort Cards", "Pick Top Values", "Reflect", "Summary"];

type PileId = "unassigned" | "very" | "some" | "not";

type ValueCard = {
  id: string;
  label: string;
  definition: string;
  emoji: string;
  category: "relationships" | "growth" | "school" | "character" | "wellbeing";
};

const valueCards: ValueCard[] = [
  // Relationships
  {
    id: "kind",
    label: "Kind",
    definition: "Caring about others and their feelings.",
    emoji: "💛",
    category: "relationships",
  },
  {
    id: "helpful",
    label: "Helpful",
    definition: "Supporting people when they need a hand.",
    emoji: "🤗",
    category: "relationships",
  },
  {
    id: "caring",
    label: "Caring",
    definition: "Showing warmth and looking out for others.",
    emoji: "🫶",
    category: "relationships",
  },
  {
    id: "loyal",
    label: "Loyal",
    definition: "Sticking by friends and family through good and bad.",
    emoji: "🤞",
    category: "relationships",
  },
  {
    id: "friendly",
    label: "Friendly",
    definition: "Being warm and welcoming to others.",
    emoji: "👋",
    category: "relationships",
  },
  {
    id: "loving",
    label: "Loving",
    definition: "Showing love and affection to people you care about.",
    emoji: "❤️",
    category: "relationships",
  },
  {
    id: "teamwork",
    label: "Teamwork",
    definition: "Working well with others to reach a shared goal.",
    emoji: "🤝",
    category: "relationships",
  },
  {
    id: "forgiving",
    label: "Forgiving",
    definition: "Letting go of hurt and giving second chances.",
    emoji: "🕊️",
    category: "relationships",
  },
  // Personal Growth
  {
    id: "brave",
    label: "Brave",
    definition: "Trying new things even when you feel nervous.",
    emoji: "🦁",
    category: "growth",
  },
  {
    id: "creative",
    label: "Creative",
    definition: "Using imagination to make or solve something.",
    emoji: "🎨",
    category: "growth",
  },
  {
    id: "adventurous",
    label: "Adventurous",
    definition: "Exploring, trying, and being curious.",
    emoji: "🧗",
    category: "growth",
  },
  {
    id: "independent",
    label: "Independent",
    definition: "Doing things on your own when you can.",
    emoji: "🌟",
    category: "growth",
  },
  {
    id: "curious",
    label: "Curious",
    definition: "Wanting to learn and discover new things.",
    emoji: "🔍",
    category: "growth",
  },
  {
    id: "confident",
    label: "Confident",
    definition: "Believing in yourself and your abilities.",
    emoji: "💪",
    category: "growth",
  },
  {
    id: "open-minded",
    label: "Open-Minded",
    definition: "Being willing to consider new ideas and viewpoints.",
    emoji: "🧠",
    category: "growth",
  },
  {
    id: "resilient",
    label: "Resilient",
    definition: "Bouncing back after setbacks or challenges.",
    emoji: "🌱",
    category: "growth",
  },
  {
    id: "determined",
    label: "Determined",
    definition: "Keeping going even when things get tough.",
    emoji: "🎯",
    category: "growth",
  },
  {
    id: "flexible",
    label: "Flexible",
    definition: "Adapting when plans change unexpectedly.",
    emoji: "🌊",
    category: "growth",
  },
  // School/Learning
  {
    id: "responsible",
    label: "Responsible",
    definition: "Taking care of tasks and doing your part.",
    emoji: "🧭",
    category: "school",
  },
  {
    id: "focused",
    label: "Focused",
    definition: "Paying attention to what matters most.",
    emoji: "🎯",
    category: "school",
  },
  {
    id: "hardworking",
    label: "Hardworking",
    definition: "Putting in effort and not giving up easily.",
    emoji: "⚡",
    category: "school",
  },
  {
    id: "organized",
    label: "Organized",
    definition: "Keeping track of things and planning ahead.",
    emoji: "📋",
    category: "school",
  },
  {
    id: "motivated",
    label: "Motivated",
    definition: "Feeling driven to reach your goals.",
    emoji: "🚀",
    category: "school",
  },
  {
    id: "achievement",
    label: "Achievement",
    definition: "Working hard to accomplish important goals.",
    emoji: "🏆",
    category: "school",
  },
  {
    id: "learning",
    label: "Learning",
    definition: "Enjoying gaining new knowledge and skills.",
    emoji: "📚",
    category: "school",
  },
  {
    id: "excellence",
    label: "Excellence",
    definition: "Striving to do your best work.",
    emoji: "⭐",
    category: "school",
  },
  // Character
  {
    id: "honest",
    label: "Honest",
    definition: "Telling the truth and being trustworthy.",
    emoji: "💎",
    category: "character",
  },
  {
    id: "respectful",
    label: "Respectful",
    definition: "Using kind words and honoring boundaries.",
    emoji: "🙏",
    category: "character",
  },
  {
    id: "fair",
    label: "Fair",
    definition: "Treating everyone equally and playing by the rules.",
    emoji: "⚖️",
    category: "character",
  },
  {
    id: "patient",
    label: "Patient",
    definition: "Waiting calmly without getting frustrated.",
    emoji: "🐢",
    category: "character",
  },
  {
    id: "grateful",
    label: "Grateful",
    definition: "Appreciating what you have and saying thank you.",
    emoji: "🙌",
    category: "character",
  },
  {
    id: "humble",
    label: "Humble",
    definition: "Not bragging and being modest about success.",
    emoji: "🌾",
    category: "character",
  },
  {
    id: "integrity",
    label: "Integrity",
    definition: "Doing the right thing even when no one is watching.",
    emoji: "🛡️",
    category: "character",
  },
  {
    id: "courageous",
    label: "Courageous",
    definition: "Standing up for what's right even when it's hard.",
    emoji: "🦸",
    category: "character",
  },
  {
    id: "self-control",
    label: "Self-Control",
    definition: "Managing your impulses and thinking before acting.",
    emoji: "🧘",
    category: "character",
  },
  {
    id: "generous",
    label: "Generous",
    definition: "Sharing with others freely and willingly.",
    emoji: "🎁",
    category: "character",
  },
  // Wellbeing
  {
    id: "fun-loving",
    label: "Fun-Loving",
    definition: "Finding joy and play in the day.",
    emoji: "🎉",
    category: "wellbeing",
  },
  {
    id: "healthy",
    label: "Healthy",
    definition: "Taking care of your body and mind.",
    emoji: "🏃",
    category: "wellbeing",
  },
  {
    id: "calm",
    label: "Calm",
    definition: "Staying peaceful even in stressful moments.",
    emoji: "😌",
    category: "wellbeing",
  },
  {
    id: "happy",
    label: "Happy",
    definition: "Finding joy and contentment in everyday life.",
    emoji: "😊",
    category: "wellbeing",
  },
  {
    id: "safe",
    label: "Safe",
    definition: "Feeling secure and protected.",
    emoji: "🏠",
    category: "wellbeing",
  },
  {
    id: "balance",
    label: "Balance",
    definition: "Making time for work, play, and rest.",
    emoji: "☯️",
    category: "wellbeing",
  },
  {
    id: "mindful",
    label: "Mindful",
    definition: "Paying attention to the present moment.",
    emoji: "🧘‍♀️",
    category: "wellbeing",
  },
  {
    id: "optimistic",
    label: "Optimistic",
    definition: "Looking on the bright side and expecting good things.",
    emoji: "☀️",
    category: "wellbeing",
  },
];

const categoryStyles: Record<ValueCard["category"], string> = {
  relationships: "bg-rose-50 text-rose-700 border-rose-200",
  growth: "bg-amber-50 text-amber-700 border-amber-200",
  school: "bg-sky-50 text-sky-700 border-sky-200",
  character: "bg-emerald-50 text-emerald-700 border-emerald-200",
  wellbeing: "bg-violet-50 text-violet-700 border-violet-200",
};

const pileConfig: Record<PileId, { title: string; hint: string; tone: string }> = {
  unassigned: {
    title: "Value Deck",
    hint: "Drag or tap a card to sort it into a pile.",
    tone: "bg-white border-slate-200",
  },
  very: {
    title: "Very Important",
    hint: "Feels like a top priority right now.",
    tone: "bg-emerald-50 border-emerald-200",
  },
  some: {
    title: "Somewhat Important",
    hint: "Matters, but not the biggest right now.",
    tone: "bg-sky-50 border-sky-200",
  },
  not: {
    title: "Not Important",
    hint: "Not a focus for me right now.",
    tone: "bg-slate-100 border-slate-200",
  },
};

const initialPileMap = Object.fromEntries(
  valueCards.map((card) => [card.id, "unassigned"])
) as Record<string, PileId>;

function buildSummaryText(topValues: ValueCard[], reflections: Record<string, { why: string; when: string; hard: string }>) {
  const lines = [
    "Values Card Sort Summary",
    "",
    "Top Values:",
  ];

  topValues.forEach((value, index) => {
    lines.push(`${index + 1}. ${value.emoji} ${value.label}`);
    lines.push(`   Definition: ${value.definition}`);
    const ref = reflections[value.id];
    if (ref) {
      if (ref.why) lines.push(`   Why it matters: ${ref.why}`);
      if (ref.when) lines.push(`   When I show it: ${ref.when}`);
      if (ref.hard) lines.push(`   When it's hard: ${ref.hard}`);
    }
    lines.push("");
  });

  lines.push("Created with BehaviorSchool ACT Tools");

  return lines.join("\n");
}

function ValuesCard({
  card,
  pile,
  isActive,
  onMove,
  onToggle,
}: {
  card: ValueCard;
  pile: PileId;
  isActive: boolean;
  onMove: (target: PileId) => void;
  onToggle: () => void;
}) {
  return (
    <motion.div
      layout
      className={`relative rounded-2xl border p-3 sm:p-4 shadow-sm transition-all ${categoryStyles[card.category]} ${
        isActive ? "ring-2 ring-emerald-400" : "hover:-translate-y-0.5"
      }`}
    >
      <button
        type="button"
        className="w-full text-left focus:outline-none"
        onClick={onToggle}
        aria-pressed={isActive}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" aria-hidden>
              {card.emoji}
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">{card.label}</p>
              <p className="text-xs text-slate-600">{card.definition}</p>
            </div>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {pile === "unassigned" ? "Deck" : pileConfig[pile].title}
          </span>
        </div>
      </button>

      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 flex flex-wrap gap-2"
          >
            {(["very", "some", "not", "unassigned"] as PileId[])
              .filter((target) => target !== pile)
              .map((target) => (
                <button
                  key={target}
                  type="button"
                  onClick={() => onMove(target)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-slate-600 hover:border-emerald-300"
                >
                  Move to {pileConfig[target].title}
                </button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function DraggableCard({
  card,
  pile,
  isActive,
  onMove,
  onToggle,
  listeners,
  attributes,
  setNodeRef,
  isDragging,
}: {
  card: ValueCard;
  pile: PileId;
  isActive: boolean;
  onMove: (target: PileId) => void;
  onToggle: () => void;
  listeners: DraggableSyntheticListeners;
  attributes: DraggableAttributes;
  setNodeRef: (node: HTMLElement | null) => void;
  isDragging: boolean;
}) {
  return (
    <motion.div
      layout
      ref={setNodeRef}
      style={{ opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
      className="touch-none"
    >
      <ValuesCard card={card} pile={pile} isActive={isActive} onMove={onMove} onToggle={onToggle} />
    </motion.div>
  );
}

function DroppablePile({
  pileId,
  children,
  onClick,
  isActive,
  isOver,
}: {
  pileId: PileId;
  children: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
  isOver?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border-2 border-dashed p-4 sm:p-5 transition-all ${pileConfig[pileId].tone} ${
        isOver ? "ring-2 ring-emerald-400 border-emerald-300" : ""
      } ${isActive ? "shadow-lg" : "shadow-sm"}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

export default function ValuesCardSort() {
  const [stepIndex, setStepIndex] = useState(0);
  const [pileMap, setPileMap] = useState<Record<string, PileId>>(initialPileMap);
  const [selectedTopIds, setSelectedTopIds] = useState<string[]>([]);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");
  const [draggingCard, setDraggingCard] = useState<ValueCard | null>(null);
  const [reflections, setReflections] = useState<Record<string, { why: string; when: string; hard: string }>>({});

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 8 } })
  );

  const piles = useMemo(() => {
    const grouped: Record<PileId, ValueCard[]> = {
      unassigned: [],
      very: [],
      some: [],
      not: [],
    };

    valueCards.forEach((card) => {
      grouped[pileMap[card.id] || "unassigned"].push(card);
    });

    return grouped;
  }, [pileMap]);

  const progressPercent = useMemo(() => {
    const total = valueCards.length;
    const sorted = total - piles.unassigned.length;
    return Math.round((sorted / total) * 100);
  }, [piles.unassigned.length]);

  const topValueCards = useMemo(
    () => selectedTopIds.map((id) => valueCards.find((card) => card.id === id)).filter(Boolean) as ValueCard[],
    [selectedTopIds]
  );

  const canContinue = useMemo(() => {
    if (stepIndex === 0) return piles.very.length >= 3;
    if (stepIndex === 1) return selectedTopIds.length >= 3 && selectedTopIds.length <= 5;
    if (stepIndex === 2) return true; // Reflections are optional
    return true;
  }, [stepIndex, piles.very.length, selectedTopIds.length]);

  useEffect(() => {
    const validTop = selectedTopIds.filter((id) => pileMap[id] === "very");
    if (validTop.length !== selectedTopIds.length) {
      setSelectedTopIds(validTop);
    }
  }, [pileMap, selectedTopIds]);

  const handleMoveCard = (cardId: string, target: PileId) => {
    setPileMap((prev) => ({ ...prev, [cardId]: target }));
    if (target !== "very") {
      setSelectedTopIds((prev) => prev.filter((id) => id !== cardId));
    }
    setActiveCardId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const targetPile: PileId | null = overId.startsWith("pile-")
      ? (overId.replace("pile-", "") as PileId)
      : pileMap[overId] || null;

    if (targetPile) {
      handleMoveCard(activeId, targetPile);
    }

    setDraggingCard(null);
  };

  const handleCopy = async () => {
    if (topValueCards.length === 0) return;
    try {
      await navigator.clipboard.writeText(buildSummaryText(topValueCards, reflections));
      setCopyStatus("copied");
      window.setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("idle");
    }
  };

  const handleDownload = () => {
    if (topValueCards.length === 0) return;
    const blob = new Blob([buildSummaryText(topValueCards, reflections)], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "values-card-sort-summary.txt";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleReflectionChange = (valueId: string, field: "why" | "when" | "hard", text: string) => {
    setReflections((prev) => ({
      ...prev,
      [valueId]: {
        ...prev[valueId],
        [field]: text,
      },
    }));
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-emerald-50" />
      <div className="absolute -top-24 left-10 h-72 w-72 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -bottom-20 right-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="text-center space-y-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-emerald-600 uppercase">ACT Tools</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900">Values Card Sort</h1>
          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            Sort values into piles, pick your top 3-5, and celebrate what matters most right now.
          </p>
        </div>

        <div className="mt-10 bg-white/80 backdrop-blur rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="flex flex-col gap-6 p-6 sm:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Step {stepIndex + 1} of {steps.length}</span>
                <span className="font-medium text-slate-700">{steps[stepIndex]}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all ${
                      index <= stepIndex ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {stepIndex === 0 && (
              <section className="space-y-6">
                <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">Sorting progress</p>
                        <p className="text-xs text-slate-500">{progressPercent}% sorted</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-600">
                        <Target className="h-4 w-4" />
                        {piles.very.length} in Very Important
                      </div>
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">Tap + drag help</p>
                        <p className="text-xs text-emerald-700">
                          Drag cards into piles or tap a card to choose where it goes.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <DndContext
                  sensors={sensors}
                  onDragStart={({ active }) => {
                    const card = valueCards.find((item) => item.id === active.id) || null;
                    setDraggingCard(card);
                  }}
                  onDragEnd={handleDragEnd}
                  onDragCancel={() => setDraggingCard(null)}
                >
                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <DroppableZone
                      pileId="unassigned"
                      cards={piles.unassigned}
                      title={pileConfig.unassigned.title}
                      hint={pileConfig.unassigned.hint}
                      activeCardId={activeCardId}
                      onCardToggle={(id) => setActiveCardId((prev) => (prev === id ? null : id))}
                      onMoveCard={handleMoveCard}
                      onDropClick={() => {
                        if (activeCardId) handleMoveCard(activeCardId, "unassigned");
                      }}
                    />

                    <div className="grid gap-4">
                      <DroppableZone
                        pileId="very"
                        cards={piles.very}
                        title={pileConfig.very.title}
                        hint={pileConfig.very.hint}
                        activeCardId={activeCardId}
                        onCardToggle={(id) => setActiveCardId((prev) => (prev === id ? null : id))}
                        onMoveCard={handleMoveCard}
                        onDropClick={() => {
                          if (activeCardId) handleMoveCard(activeCardId, "very");
                        }}
                      />
                      <DroppableZone
                        pileId="some"
                        cards={piles.some}
                        title={pileConfig.some.title}
                        hint={pileConfig.some.hint}
                        activeCardId={activeCardId}
                        onCardToggle={(id) => setActiveCardId((prev) => (prev === id ? null : id))}
                        onMoveCard={handleMoveCard}
                        onDropClick={() => {
                          if (activeCardId) handleMoveCard(activeCardId, "some");
                        }}
                      />
                      <DroppableZone
                        pileId="not"
                        cards={piles.not}
                        title={pileConfig.not.title}
                        hint={pileConfig.not.hint}
                        activeCardId={activeCardId}
                        onCardToggle={(id) => setActiveCardId((prev) => (prev === id ? null : id))}
                        onMoveCard={handleMoveCard}
                        onDropClick={() => {
                          if (activeCardId) handleMoveCard(activeCardId, "not");
                        }}
                      />
                    </div>
                  </div>

                  <DragOverlay>
                    {draggingCard ? (
                      <div className="rounded-2xl border bg-white px-4 py-3 shadow-xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{draggingCard.emoji}</span>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{draggingCard.label}</p>
                            <p className="text-xs text-slate-500">{draggingCard.definition}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </DragOverlay>
                </DndContext>
              </section>
            )}

            {stepIndex === 1 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Pick your top 3-5 values</h2>
                  <p className="text-sm text-slate-600">Choose the values that matter most right now.</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
                  <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-semibold text-slate-900">Very Important pile</p>
                    <p className="text-xs text-slate-500">Tap cards to add them to your top list.</p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {piles.very.length === 0 ? (
                        <div className="col-span-full rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
                          No cards in the Very Important pile yet. Head back and sort more values.
                        </div>
                      ) : (
                        piles.very.map((card) => {
                          const selected = selectedTopIds.includes(card.id);
                          return (
                            <button
                              key={card.id}
                              type="button"
                              onClick={() => {
                                setSelectedTopIds((prev) => {
                                  if (prev.includes(card.id)) {
                                    return prev.filter((id) => id !== card.id);
                                  }
                                  if (prev.length >= 5) return prev;
                                  return [...prev, card.id];
                                });
                              }}
                              className={`rounded-2xl border p-4 text-left transition-all ${
                                selected
                                  ? "border-emerald-400 bg-emerald-50"
                                  : "border-slate-200 bg-white hover:border-emerald-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{card.emoji}</span>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{card.label}</p>
                                  <p className="text-xs text-slate-500">{card.definition}</p>
                                </div>
                              </div>
                              {selected && (
                                <p className="mt-2 text-xs font-semibold text-emerald-600">Selected</p>
                              )}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                    <p className="text-sm font-semibold text-emerald-900">Your top values</p>
                    <p className="text-xs text-emerald-700">Pick at least 3 and up to 5.</p>

                    <div className="mt-4 space-y-2">
                      {selectedTopIds.length === 0 && (
                        <div className="rounded-xl border border-dashed border-emerald-200 bg-white/70 p-4 text-center text-xs text-emerald-700">
                          Tap values to add them here.
                        </div>
                      )}
                      {topValueCards.map((card, index) => (
                        <div
                          key={card.id}
                          className="flex items-center justify-between rounded-xl border border-emerald-200 bg-white px-4 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{card.emoji}</span>
                            <span className="text-sm font-semibold text-slate-900">{index + 1}. {card.label}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedTopIds((prev) => prev.filter((id) => id !== card.id))}
                            className="text-xs font-semibold text-emerald-600"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {stepIndex === 2 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Reflect on your values</h2>
                  <p className="text-sm text-slate-600">Answer a few questions about each value (optional but helpful!).</p>
                </div>

                <div className="space-y-6">
                  {topValueCards.map((card) => (
                    <div key={card.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-2xl">{card.emoji}</span>
                        <div>
                          <p className="text-lg font-semibold text-slate-900">{card.label}</p>
                          <p className="text-sm text-slate-500">{card.definition}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            Why is being {card.label.toLowerCase()} important to you?
                          </label>
                          <textarea
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            placeholder="This matters to me because..."
                            value={reflections[card.id]?.why || ""}
                            onChange={(e) => handleReflectionChange(card.id, "why", e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            When do you act {card.label.toLowerCase()}?
                          </label>
                          <textarea
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            placeholder="I show this value when..."
                            value={reflections[card.id]?.when || ""}
                            onChange={(e) => handleReflectionChange(card.id, "when", e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-slate-700 block mb-1">
                            When is it hard to be {card.label.toLowerCase()}?
                          </label>
                          <textarea
                            rows={2}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            placeholder="It's hard when..."
                            value={reflections[card.id]?.hard || ""}
                            onChange={(e) => handleReflectionChange(card.id, "hard", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                  <p className="text-sm text-amber-800">
                    <strong>Tip:</strong> These reflections are optional. Fill out as much as you&apos;d like — they&apos;ll be included in your summary.
                  </p>
                </div>
              </section>
            )}

            {stepIndex === 3 && (
              <section className="space-y-6">
                <div className="print:hidden">
                  <h2 className="text-xl font-semibold text-slate-900">Summary</h2>
                  <p className="text-sm text-slate-600">Your values snapshot is ready to print or share.</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg print:shadow-none print:border-none print:bg-white">
                  <div className="hidden print:block text-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Values Card Sort</h2>
                    <p className="text-sm text-slate-600">Top values summary</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Top Values</p>
                      <p className="text-xs text-slate-500">{topValueCards.length} selected</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {topValueCards.map((card, index) => {
                      const ref = reflections[card.id];
                      const hasReflections = ref && (ref.why || ref.when || ref.hard);
                      return (
                        <div key={card.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{card.emoji}</span>
                            <div>
                              <p className="text-base font-semibold text-slate-900">
                                {index + 1}. {card.label}
                              </p>
                              <p className="text-sm text-slate-600">{card.definition}</p>
                            </div>
                          </div>
                          {hasReflections && (
                            <div className="mt-3 space-y-2 text-sm text-slate-700 border-t border-slate-200 pt-3">
                              {ref.why && (
                                <p><strong>Why it matters:</strong> {ref.why}</p>
                              )}
                              {ref.when && (
                                <p><strong>When I show it:</strong> {ref.when}</p>
                              )}
                              {ref.hard && (
                                <p><strong>When it&apos;s hard:</strong> {ref.hard}</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {topValueCards.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                        No values selected yet. Go back to choose 3-5 top values.
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 print:hidden">
                  <Button type="button" className="h-11 px-6" onClick={handleCopy} disabled={topValueCards.length === 0}>
                    <ClipboardCopy className="mr-2 h-4 w-4" />
                    {copyStatus === "copied" ? "Copied" : "Copy results"}
                  </Button>
                  <Button type="button" variant="outline" className="h-11 px-6" onClick={handleDownload} disabled={topValueCards.length === 0}>
                    <Download className="mr-2 h-4 w-4" />
                    Save text file
                  </Button>
                  <Button type="button" variant="outline" className="h-11 px-6" onClick={() => window.print()}>
                    <Printer className="mr-2 h-4 w-4" />
                    Print
                  </Button>
                </div>
              </section>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 print:hidden">
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                disabled={stepIndex === 0}
              >
                Back
              </Button>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setStepIndex(0);
                    setPileMap(initialPileMap);
                    setSelectedTopIds([]);
                    setReflections({});
                  }}
                >
                  Start over
                </Button>
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
                  disabled={!canContinue || stepIndex === steps.length - 1}
                >
                  {stepIndex === steps.length - 1 ? "Done" : "Next"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DroppableZone({
  pileId,
  cards,
  title,
  hint,
  activeCardId,
  onCardToggle,
  onMoveCard,
  onDropClick,
}: {
  pileId: PileId;
  cards: ValueCard[];
  title: string;
  hint: string;
  activeCardId: string | null;
  onCardToggle: (id: string) => void;
  onMoveCard: (id: string, target: PileId) => void;
  onDropClick: () => void;
}) {
  const { setNodeRef, isOver } = useDroppablePile(pileId);

  return (
    <DroppablePile
      pileId={pileId}
      isOver={isOver}
      isActive={Boolean(activeCardId)}
      onClick={onDropClick}
    >
      <div ref={setNodeRef} className="space-y-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>

        {cards.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4 text-center text-xs text-slate-500">
            Drop cards here
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence initial={false}>
              {cards.map((card) => (
                <DraggableCardWrapper
                  key={card.id}
                  card={card}
                  pile={pileId}
                  isActive={activeCardId === card.id}
                  onToggle={() => onCardToggle(card.id)}
                  onMove={(target) => onMoveCard(card.id, target)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DroppablePile>
  );
}

function useDroppablePile(pileId: PileId) {
  const { setNodeRef, isOver } = useDroppable({ id: `pile-${pileId}` });
  return { setNodeRef, isOver };
}

function DraggableCardWrapper({
  card,
  pile,
  isActive,
  onMove,
  onToggle,
}: {
  card: ValueCard;
  pile: PileId;
  isActive: boolean;
  onMove: (target: PileId) => void;
  onToggle: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggableCard(card.id);

  return (
    <DraggableCard
      card={card}
      pile={pile}
      isActive={isActive}
      onMove={onMove}
      onToggle={onToggle}
      listeners={listeners}
      attributes={attributes}
      setNodeRef={setNodeRef}
      isDragging={Boolean(isDragging)}
    />
  );
}

function useDraggableCard(cardId: string) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: cardId });

  return {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
  };
}
