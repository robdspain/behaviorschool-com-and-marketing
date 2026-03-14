// 120+ values organized by category with emoji support for younger students

export interface Value {
  id: string;
  name: string;
  emoji: string;
  category: ValueCategory;
  description: string;
  kidFriendly: string; // simplified language for elementary
}

export type ValueCategory =
  | "relationships"
  | "learning"
  | "creativity"
  | "independence"
  | "health"
  | "community"
  | "fun"
  | "courage"
  | "kindness"
  | "responsibility"
  | "spirituality"
  | "nature";

export const CATEGORY_META: Record<ValueCategory, { label: string; emoji: string; color: string }> = {
  relationships: { label: "Relationships", emoji: "❤️", color: "#e74c3c" },
  learning: { label: "Learning", emoji: "📚", color: "#3498db" },
  creativity: { label: "Creativity", emoji: "🎨", color: "#9b59b6" },
  independence: { label: "Independence", emoji: "🦅", color: "#e67e22" },
  health: { label: "Health", emoji: "💪", color: "#27ae60" },
  community: { label: "Community", emoji: "🏘️", color: "#f39c12" },
  fun: { label: "Fun & Play", emoji: "🎮", color: "#1abc9c" },
  courage: { label: "Courage", emoji: "🦁", color: "#e74c3c" },
  kindness: { label: "Kindness", emoji: "🌟", color: "#f1c40f" },
  responsibility: { label: "Responsibility", emoji: "✅", color: "#2c3e50" },
  spirituality: { label: "Spirituality", emoji: "🕊️", color: "#8e44ad" },
  nature: { label: "Nature", emoji: "🌿", color: "#16a085" },
};

export const VALUES: Value[] = [
  // RELATIONSHIPS (15)
  { id: "family", name: "Family", emoji: "👨‍👩‍👧‍👦", category: "relationships", description: "Being close to and caring for family members", kidFriendly: "Being with my family" },
  { id: "friendship", name: "Friendship", emoji: "🤝", category: "relationships", description: "Building and maintaining meaningful friendships", kidFriendly: "Having good friends" },
  { id: "love", name: "Love", emoji: "💕", category: "relationships", description: "Giving and receiving love and affection", kidFriendly: "Loving and being loved" },
  { id: "trust", name: "Trust", emoji: "🤞", category: "relationships", description: "Being someone others can rely on", kidFriendly: "Being someone people can count on" },
  { id: "loyalty", name: "Loyalty", emoji: "🛡️", category: "relationships", description: "Standing by the people important to me", kidFriendly: "Sticking by my friends" },
  { id: "belonging", name: "Belonging", emoji: "🏠", category: "relationships", description: "Feeling like I'm part of a group", kidFriendly: "Fitting in and being included" },
  { id: "teamwork", name: "Teamwork", emoji: "⚽", category: "relationships", description: "Working well with others toward shared goals", kidFriendly: "Working together with others" },
  { id: "forgiveness", name: "Forgiveness", emoji: "🕊️", category: "relationships", description: "Letting go of anger and giving second chances", kidFriendly: "Letting go when someone says sorry" },
  { id: "communication", name: "Communication", emoji: "💬", category: "relationships", description: "Expressing myself clearly and listening to others", kidFriendly: "Talking and listening" },
  { id: "respect", name: "Respect", emoji: "🙏", category: "relationships", description: "Treating others with dignity and being treated well", kidFriendly: "Being nice to others and them being nice to me" },
  { id: "connection", name: "Connection", emoji: "🔗", category: "relationships", description: "Feeling close and understood by others", kidFriendly: "Feeling close to people" },
  { id: "empathy", name: "Empathy", emoji: "🫂", category: "relationships", description: "Understanding how others feel", kidFriendly: "Understanding how others feel" },
  { id: "cooperation", name: "Cooperation", emoji: "🤜🤛", category: "relationships", description: "Working together to solve problems", kidFriendly: "Helping each other out" },
  { id: "romance", name: "Romance", emoji: "💑", category: "relationships", description: "Having a caring romantic relationship", kidFriendly: "Caring about someone special" },
  { id: "parenting", name: "Being a Good Parent/Caregiver", emoji: "🍼", category: "relationships", description: "Caring for and nurturing children", kidFriendly: "Taking care of others" },

  // LEARNING (12)
  { id: "curiosity", name: "Curiosity", emoji: "🔍", category: "learning", description: "Wanting to explore and understand new things", kidFriendly: "Wanting to know more about stuff" },
  { id: "knowledge", name: "Knowledge", emoji: "🧠", category: "learning", description: "Learning and understanding the world", kidFriendly: "Knowing lots of things" },
  { id: "growth", name: "Growth", emoji: "🌱", category: "learning", description: "Always improving and getting better", kidFriendly: "Getting better at things" },
  { id: "education", name: "Education", emoji: "🎓", category: "learning", description: "Valuing school and learning opportunities", kidFriendly: "Doing well in school" },
  { id: "wisdom", name: "Wisdom", emoji: "🦉", category: "learning", description: "Using what I know to make good choices", kidFriendly: "Making smart choices" },
  { id: "skill", name: "Skill Building", emoji: "🏆", category: "learning", description: "Developing talents and abilities", kidFriendly: "Getting really good at something" },
  { id: "reading", name: "Reading", emoji: "📖", category: "learning", description: "Enjoying books and reading", kidFriendly: "Reading cool books" },
  { id: "problemsolving", name: "Problem Solving", emoji: "🧩", category: "learning", description: "Figuring out solutions to challenges", kidFriendly: "Figuring things out" },
  { id: "openmindedness", name: "Open-Mindedness", emoji: "🌍", category: "learning", description: "Being willing to consider new ideas", kidFriendly: "Trying new ideas" },
  { id: "achievement", name: "Achievement", emoji: "🥇", category: "learning", description: "Accomplishing important things", kidFriendly: "Finishing things I start" },
  { id: "effort", name: "Hard Work", emoji: "💪", category: "learning", description: "Putting in effort even when it's difficult", kidFriendly: "Trying hard even when it's tough" },
  { id: "technology", name: "Technology", emoji: "💻", category: "learning", description: "Understanding and using technology", kidFriendly: "Being good with computers" },

  // CREATIVITY (10)
  { id: "art", name: "Art", emoji: "🎨", category: "creativity", description: "Creating visual art, drawing, painting", kidFriendly: "Drawing and making art" },
  { id: "music", name: "Music", emoji: "🎵", category: "creativity", description: "Playing, creating, or enjoying music", kidFriendly: "Playing or listening to music" },
  { id: "imagination", name: "Imagination", emoji: "💭", category: "creativity", description: "Using my imagination freely", kidFriendly: "Using my imagination" },
  { id: "selfexpression", name: "Self-Expression", emoji: "🗣️", category: "creativity", description: "Expressing who I am authentically", kidFriendly: "Showing who I really am" },
  { id: "writing", name: "Writing", emoji: "✍️", category: "creativity", description: "Writing stories, poems, or ideas", kidFriendly: "Writing stories" },
  { id: "innovation", name: "Innovation", emoji: "💡", category: "creativity", description: "Coming up with new and original ideas", kidFriendly: "Coming up with new ideas" },
  { id: "beauty", name: "Beauty", emoji: "🌸", category: "creativity", description: "Appreciating and creating beautiful things", kidFriendly: "Making things pretty" },
  { id: "dance", name: "Dance", emoji: "💃", category: "creativity", description: "Moving my body expressively", kidFriendly: "Dancing" },
  { id: "crafts", name: "Crafts & Making", emoji: "🔨", category: "creativity", description: "Building and creating with my hands", kidFriendly: "Building and making things" },
  { id: "performance", name: "Performance", emoji: "🎭", category: "creativity", description: "Acting, presenting, or performing", kidFriendly: "Performing for others" },

  // INDEPENDENCE (10)
  { id: "freedom", name: "Freedom", emoji: "🗽", category: "independence", description: "Having the freedom to make my own choices", kidFriendly: "Getting to choose things" },
  { id: "autonomy", name: "Autonomy", emoji: "🧭", category: "independence", description: "Being able to do things on my own", kidFriendly: "Doing things by myself" },
  { id: "privacy", name: "Privacy", emoji: "🔒", category: "independence", description: "Having my own space and time", kidFriendly: "Having my own space" },
  { id: "selfreliance", name: "Self-Reliance", emoji: "🏔️", category: "independence", description: "Taking care of myself and my needs", kidFriendly: "Taking care of myself" },
  { id: "confidence", name: "Confidence", emoji: "😎", category: "independence", description: "Believing in myself and my abilities", kidFriendly: "Believing in myself" },
  { id: "leadership", name: "Leadership", emoji: "👑", category: "independence", description: "Guiding and inspiring others", kidFriendly: "Being a leader" },
  { id: "determination", name: "Determination", emoji: "🎯", category: "independence", description: "Not giving up when things are hard", kidFriendly: "Not giving up" },
  { id: "individuality", name: "Individuality", emoji: "⭐", category: "independence", description: "Being unique and true to myself", kidFriendly: "Being me" },
  { id: "power", name: "Personal Power", emoji: "⚡", category: "independence", description: "Feeling strong and capable", kidFriendly: "Feeling strong" },
  { id: "choice", name: "Choice", emoji: "🔀", category: "independence", description: "Having options and getting to decide", kidFriendly: "Getting to pick" },

  // HEALTH (10)
  { id: "fitness", name: "Fitness", emoji: "🏃", category: "health", description: "Keeping my body active and strong", kidFriendly: "Running and being active" },
  { id: "mentalhealth", name: "Mental Health", emoji: "🧘", category: "health", description: "Taking care of my mind and feelings", kidFriendly: "Feeling good inside" },
  { id: "sleep", name: "Rest & Sleep", emoji: "😴", category: "health", description: "Getting enough rest and sleep", kidFriendly: "Getting good sleep" },
  { id: "nutrition", name: "Healthy Eating", emoji: "🥗", category: "health", description: "Eating foods that fuel my body", kidFriendly: "Eating healthy food" },
  { id: "safety", name: "Safety", emoji: "🦺", category: "health", description: "Feeling safe and protected", kidFriendly: "Feeling safe" },
  { id: "calm", name: "Calmness", emoji: "😌", category: "health", description: "Finding peace and reducing stress", kidFriendly: "Feeling calm and peaceful" },
  { id: "balance", name: "Balance", emoji: "⚖️", category: "health", description: "Having a balanced life with time for everything", kidFriendly: "Having time for everything" },
  { id: "sports", name: "Sports", emoji: "🏀", category: "health", description: "Playing and competing in sports", kidFriendly: "Playing sports" },
  { id: "selfcare", name: "Self-Care", emoji: "🛁", category: "health", description: "Taking time to care for myself", kidFriendly: "Taking care of myself" },
  { id: "outdoors", name: "Being Outdoors", emoji: "☀️", category: "health", description: "Spending time outside in fresh air", kidFriendly: "Playing outside" },

  // COMMUNITY (10)
  { id: "helping", name: "Helping Others", emoji: "🤲", category: "community", description: "Making a difference in others' lives", kidFriendly: "Helping people" },
  { id: "fairness", name: "Fairness", emoji: "⚖️", category: "community", description: "Making sure everyone is treated fairly", kidFriendly: "Making things fair" },
  { id: "justice", name: "Justice", emoji: "🏛️", category: "community", description: "Standing up for what's right", kidFriendly: "Standing up for what's right" },
  { id: "volunteering", name: "Volunteering", emoji: "🙋", category: "community", description: "Giving my time to help others", kidFriendly: "Helping out for free" },
  { id: "environment", name: "Environment", emoji: "🌎", category: "community", description: "Taking care of the earth and nature", kidFriendly: "Taking care of the earth" },
  { id: "equality", name: "Equality", emoji: "🤝", category: "community", description: "Everyone deserving equal treatment", kidFriendly: "Everyone being treated the same" },
  { id: "citizenship", name: "Good Citizenship", emoji: "🏫", category: "community", description: "Being a good member of my community", kidFriendly: "Being a good citizen" },
  { id: "culture", name: "Culture & Heritage", emoji: "🌐", category: "community", description: "Honoring my culture and learning about others", kidFriendly: "Learning about different people" },
  { id: "inclusion", name: "Inclusion", emoji: "🫶", category: "community", description: "Making sure everyone feels welcome", kidFriendly: "Including everyone" },
  { id: "generosity", name: "Generosity", emoji: "🎁", category: "community", description: "Sharing what I have with others", kidFriendly: "Sharing with others" },

  // FUN (10)
  { id: "humor", name: "Humor", emoji: "😂", category: "fun", description: "Laughing and finding things funny", kidFriendly: "Laughing and being silly" },
  { id: "adventure", name: "Adventure", emoji: "🗺️", category: "fun", description: "Seeking new and exciting experiences", kidFriendly: "Going on adventures" },
  { id: "play", name: "Play", emoji: "🎲", category: "fun", description: "Having fun and playing games", kidFriendly: "Playing games" },
  { id: "excitement", name: "Excitement", emoji: "🎢", category: "fun", description: "Doing thrilling and exciting things", kidFriendly: "Doing exciting things" },
  { id: "gaming", name: "Gaming", emoji: "🎮", category: "fun", description: "Playing video games and having fun", kidFriendly: "Playing video games" },
  { id: "travel", name: "Travel", emoji: "✈️", category: "fun", description: "Visiting new places", kidFriendly: "Going to new places" },
  { id: "celebration", name: "Celebration", emoji: "🎉", category: "fun", description: "Celebrating special moments", kidFriendly: "Celebrating and parties" },
  { id: "spontaneity", name: "Spontaneity", emoji: "🎈", category: "fun", description: "Being flexible and going with the flow", kidFriendly: "Doing fun things without planning" },
  { id: "hobbies", name: "Hobbies", emoji: "🎣", category: "fun", description: "Spending time on things I love", kidFriendly: "Doing my favorite things" },
  { id: "relaxation", name: "Relaxation", emoji: "🏖️", category: "fun", description: "Taking it easy and unwinding", kidFriendly: "Chilling out" },

  // COURAGE (10)
  { id: "bravery", name: "Bravery", emoji: "🦸", category: "courage", description: "Facing my fears and doing hard things", kidFriendly: "Being brave" },
  { id: "honesty", name: "Honesty", emoji: "💎", category: "courage", description: "Telling the truth even when it's hard", kidFriendly: "Telling the truth" },
  { id: "integrity", name: "Integrity", emoji: "🏅", category: "courage", description: "Doing the right thing even when no one is watching", kidFriendly: "Doing the right thing" },
  { id: "resilience", name: "Resilience", emoji: "🌈", category: "courage", description: "Bouncing back from tough times", kidFriendly: "Bouncing back when things go wrong" },
  { id: "perseverance", name: "Perseverance", emoji: "🐢", category: "courage", description: "Keeping going even when it's tough", kidFriendly: "Keeping going" },
  { id: "authenticity", name: "Authenticity", emoji: "🎭", category: "courage", description: "Being real and genuine", kidFriendly: "Being the real me" },
  { id: "vulnerability", name: "Vulnerability", emoji: "💗", category: "courage", description: "Being okay with showing my feelings", kidFriendly: "Showing my feelings" },
  { id: "risktaking", name: "Healthy Risk-Taking", emoji: "🧗", category: "courage", description: "Trying new things even if they're scary", kidFriendly: "Trying scary new things" },
  { id: "advocacy", name: "Speaking Up", emoji: "📢", category: "courage", description: "Using my voice to stand up for myself and others", kidFriendly: "Speaking up for myself" },
  { id: "acceptance", name: "Acceptance", emoji: "🤗", category: "courage", description: "Accepting myself and others as they are", kidFriendly: "Being okay with who I am" },

  // KINDNESS (10)
  { id: "compassion", name: "Compassion", emoji: "💛", category: "kindness", description: "Caring about others who are suffering", kidFriendly: "Caring about others when they're sad" },
  { id: "gentleness", name: "Gentleness", emoji: "🕊️", category: "kindness", description: "Being gentle and soft in how I treat others", kidFriendly: "Being gentle" },
  { id: "patience", name: "Patience", emoji: "⏳", category: "kindness", description: "Being willing to wait without getting upset", kidFriendly: "Waiting nicely" },
  { id: "gratitude", name: "Gratitude", emoji: "🙏", category: "kindness", description: "Being thankful for what I have", kidFriendly: "Being thankful" },
  { id: "service", name: "Service", emoji: "🤲", category: "kindness", description: "Helping others without expecting anything back", kidFriendly: "Helping without being asked" },
  { id: "encouragement", name: "Encouragement", emoji: "📣", category: "kindness", description: "Building others up with my words", kidFriendly: "Cheering people on" },
  { id: "manners", name: "Good Manners", emoji: "🎩", category: "kindness", description: "Being polite and considerate", kidFriendly: "Being polite" },
  { id: "caring", name: "Caring", emoji: "🧸", category: "kindness", description: "Showing others that I care about them", kidFriendly: "Showing I care" },
  { id: "peacemaking", name: "Peacemaking", emoji: "☮️", category: "kindness", description: "Helping resolve conflicts peacefully", kidFriendly: "Helping people get along" },
  { id: "animals", name: "Animal Care", emoji: "🐾", category: "kindness", description: "Being kind to animals", kidFriendly: "Being nice to animals" },

  // RESPONSIBILITY (10)
  { id: "reliability", name: "Reliability", emoji: "⏰", category: "responsibility", description: "Following through on my commitments", kidFriendly: "Doing what I said I'd do" },
  { id: "organization", name: "Organization", emoji: "📋", category: "responsibility", description: "Keeping things neat and planned", kidFriendly: "Keeping things organized" },
  { id: "accountability", name: "Accountability", emoji: "✋", category: "responsibility", description: "Owning my mistakes and learning from them", kidFriendly: "Admitting when I mess up" },
  { id: "discipline", name: "Self-Discipline", emoji: "🎯", category: "responsibility", description: "Controlling my impulses and staying focused", kidFriendly: "Staying focused" },
  { id: "cleanliness", name: "Cleanliness", emoji: "🧹", category: "responsibility", description: "Keeping myself and my space clean", kidFriendly: "Keeping things clean" },
  { id: "money", name: "Financial Responsibility", emoji: "💰", category: "responsibility", description: "Being smart with money", kidFriendly: "Saving my money" },
  { id: "timeliness", name: "Being On Time", emoji: "⏱️", category: "responsibility", description: "Showing up when I'm supposed to", kidFriendly: "Being on time" },
  { id: "followthrough", name: "Follow-Through", emoji: "✅", category: "responsibility", description: "Finishing what I start", kidFriendly: "Finishing what I start" },
  { id: "contribution", name: "Contribution", emoji: "🧱", category: "responsibility", description: "Doing my part to help", kidFriendly: "Doing my part" },
  { id: "planning", name: "Planning Ahead", emoji: "🗓️", category: "responsibility", description: "Thinking about the future and being prepared", kidFriendly: "Being ready for things" },

  // SPIRITUALITY (8)
  { id: "faith", name: "Faith", emoji: "✝️", category: "spirituality", description: "Having faith in something bigger than myself", kidFriendly: "Believing in something bigger" },
  { id: "purpose", name: "Purpose", emoji: "🧭", category: "spirituality", description: "Feeling like my life has meaning", kidFriendly: "Feeling like I matter" },
  { id: "mindfulness", name: "Mindfulness", emoji: "🧘", category: "spirituality", description: "Being present in the moment", kidFriendly: "Paying attention to right now" },
  { id: "hope", name: "Hope", emoji: "🌅", category: "spirituality", description: "Believing things can get better", kidFriendly: "Believing things will get better" },
  { id: "innerpeace", name: "Inner Peace", emoji: "☮️", category: "spirituality", description: "Feeling calm and at peace inside", kidFriendly: "Feeling peaceful inside" },
  { id: "meaning", name: "Meaning", emoji: "🔮", category: "spirituality", description: "Finding meaning in experiences", kidFriendly: "Things making sense" },
  { id: "tradition", name: "Tradition", emoji: "🕯️", category: "spirituality", description: "Honoring traditions and customs", kidFriendly: "Doing family traditions" },
  { id: "wonder", name: "Wonder", emoji: "✨", category: "spirituality", description: "Being amazed by the world", kidFriendly: "Being amazed by things" },

  // NATURE (5)
  { id: "animals_nature", name: "Animals & Wildlife", emoji: "🦋", category: "nature", description: "Caring about and connecting with animals", kidFriendly: "Loving animals" },
  { id: "gardening", name: "Gardening", emoji: "🌻", category: "nature", description: "Growing plants and being in the garden", kidFriendly: "Growing plants" },
  { id: "exploring", name: "Exploring Nature", emoji: "🏕️", category: "nature", description: "Hiking, camping, and exploring the outdoors", kidFriendly: "Exploring outside" },
  { id: "sustainability", name: "Sustainability", emoji: "♻️", category: "nature", description: "Protecting resources for the future", kidFriendly: "Recycling and saving the earth" },
  { id: "weather", name: "Weather & Seasons", emoji: "🌤️", category: "nature", description: "Appreciating different weather and seasons", kidFriendly: "Enjoying different seasons" },
];

// Elementary subset (40 most concrete/relatable values)
export const ELEMENTARY_VALUE_IDS = [
  "family", "friendship", "trust", "teamwork", "respect",
  "curiosity", "growth", "education", "reading", "effort",
  "art", "music", "imagination", "dance", "crafts",
  "freedom", "confidence", "determination",
  "fitness", "safety", "sports", "outdoors",
  "helping", "fairness", "inclusion", "generosity",
  "humor", "adventure", "play", "gaming",
  "bravery", "honesty", "resilience", "acceptance",
  "patience", "gratitude", "caring", "animals",
  "hope", "exploring",
];

export type SortCategory = "very" | "somewhat" | "not";

export interface ValueSortResult {
  valueId: string;
  category: SortCategory;
  rank?: number; // within "very important" pile
}
