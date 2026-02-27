const INTEREST_TRAITS = [
  "realistic",
  "investigative",
  "artistic",
  "social",
  "enterprising",
  "conventional",
];

const PERSONALITY_TRAITS = [
  "openness",
  "conscientiousness",
  "extraversion",
  "agreeableness",
  "stability",
];

const STRENGTH_TRAITS = [
  "analytical",
  "communication",
  "numerical",
  "spatial",
  "interpersonal",
  "technical",
  "creative",
  "organizational",
  "leadership",
  "attentionToDetail",
];

const VALUE_TRAITS = [
  "achievement",
  "independence",
  "recognition",
  "relationships",
  "comfort",
  "altruism",
  "security",
  "variety",
];

const TRAIT_KEYS_BY_PILLAR = {
  interest: INTEREST_TRAITS,
  personality: PERSONALITY_TRAITS,
  strengths: STRENGTH_TRAITS,
  values: VALUE_TRAITS,
};

const ALL_TRAIT_KEYS = [
  ...INTEREST_TRAITS,
  ...PERSONALITY_TRAITS,
  ...STRENGTH_TRAITS,
  ...VALUE_TRAITS,
];

const TRAIT_LABELS = {
  realistic: "Realistic",
  investigative: "Investigative",
  artistic: "Artistic",
  social: "Social",
  enterprising: "Enterprising",
  conventional: "Conventional",
  openness: "Openness",
  conscientiousness: "Conscientiousness",
  extraversion: "Extraversion",
  agreeableness: "Agreeableness",
  stability: "Emotional Stability",
  analytical: "Analytical Thinking",
  communication: "Communication",
  numerical: "Numerical",
  spatial: "Spatial",
  interpersonal: "Interpersonal",
  technical: "Technical",
  creative: "Creative",
  organizational: "Organizational",
  leadership: "Leadership",
  attentionToDetail: "Attention to Detail",
  achievement: "Achievement",
  independence: "Independence",
  recognition: "Recognition",
  relationships: "Relationships",
  comfort: "Comfort",
  altruism: "Altruism",
  security: "Security",
  variety: "Variety",
};

module.exports = {
  INTEREST_TRAITS,
  PERSONALITY_TRAITS,
  STRENGTH_TRAITS,
  VALUE_TRAITS,
  TRAIT_KEYS_BY_PILLAR,
  ALL_TRAIT_KEYS,
  TRAIT_LABELS,
};
