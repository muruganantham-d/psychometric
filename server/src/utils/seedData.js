const {
  INTEREST_TRAITS,
  PERSONALITY_TRAITS,
  STRENGTH_TRAITS,
  VALUE_TRAITS,
} = require("./traits");

const CATEGORY_MAP = {
  interest: "interest",
  personality: "personality",
  strength: "strengths",
  value: "values",
};

const TRAIT_MAP = {
  Realistic: "realistic",
  Investigative: "investigative",
  Artistic: "artistic",
  Social: "social",
  Enterprising: "enterprising",
  Conventional: "conventional",
  Openness: "openness",
  Conscientiousness: "conscientiousness",
  Extraversion: "extraversion",
  Agreeableness: "agreeableness",
  Stability: "stability",
  Analytical: "analytical",
  Communication: "communication",
  Numerical: "numerical",
  Spatial: "spatial",
  Interpersonal: "interpersonal",
  Technical: "technical",
  Creative: "creative",
  Organizational: "organizational",
  Leadership: "leadership",
  "Attention to Detail": "attentionToDetail",
  Achievement: "achievement",
  Independence: "independence",
  Recognition: "recognition",
  Relationships: "relationships",
  Comfort: "comfort",
  Altruism: "altruism",
  Security: "security",
  Variety: "variety",
};

const sourceQuestions = [
  {
    id: 1,
    category: "interest",
    text: "I enjoy working with tools, machines, or equipment to build or fix things.",
    trait: "Realistic",
  },
  {
    id: 2,
    category: "interest",
    text: "I prefer hands-on work over working at a desk with paperwork.",
    trait: "Realistic",
  },
  {
    id: 3,
    category: "interest",
    text: "I like activities that involve physical coordination and working with my hands.",
    trait: "Realistic",
  },
  {
    id: 4,
    category: "interest",
    text: "I enjoy solving complex scientific or mathematical problems that require deep thinking.",
    trait: "Investigative",
  },
  {
    id: 5,
    category: "interest",
    text: "I like conducting research or experiments to discover how things work.",
    trait: "Investigative",
  },
  {
    id: 6,
    category: "interest",
    text: "I am naturally curious and enjoy analyzing data to find patterns and insights.",
    trait: "Investigative",
  },
  {
    id: 7,
    category: "interest",
    text: "I enjoy creating art, music, writing, or other forms of creative expression.",
    trait: "Artistic",
  },
  {
    id: 8,
    category: "interest",
    text: "I like working on projects where I can use my imagination and originality.",
    trait: "Artistic",
  },
  {
    id: 9,
    category: "interest",
    text: "I prefer unstructured, creative work over routine tasks with clear procedures.",
    trait: "Artistic",
  },
  {
    id: 10,
    category: "interest",
    text: "I enjoy helping people solve their problems or overcome challenges.",
    trait: "Social",
  },
  {
    id: 11,
    category: "interest",
    text: "I like teaching, training, or mentoring others to help them grow.",
    trait: "Social",
  },
  {
    id: 12,
    category: "interest",
    text: "I feel fulfilled when I can make a positive difference in someone's life.",
    trait: "Social",
  },
  {
    id: 13,
    category: "interest",
    text: "I enjoy leading teams and taking charge of projects to achieve goals.",
    trait: "Enterprising",
  },
  {
    id: 14,
    category: "interest",
    text: "I like persuading others and influencing decisions or outcomes.",
    trait: "Enterprising",
  },
  {
    id: 15,
    category: "interest",
    text: "I am motivated by competition, achievement, and taking on new challenges.",
    trait: "Enterprising",
  },
  {
    id: 16,
    category: "interest",
    text: "I prefer working with clear procedures, guidelines, and established systems.",
    trait: "Conventional",
  },
  {
    id: 17,
    category: "interest",
    text: "I enjoy organizing data, maintaining accurate records, and managing details.",
    trait: "Conventional",
  },
  {
    id: 18,
    category: "interest",
    text: "I like working with numbers, spreadsheets, and detailed information.",
    trait: "Conventional",
  },
  {
    id: 19,
    category: "personality",
    text: "I actively seek out new experiences and enjoy learning about unfamiliar topics.",
    trait: "Openness",
  },
  {
    id: 20,
    category: "personality",
    text: "I have a vivid imagination and like to think creatively about possibilities.",
    trait: "Openness",
  },
  {
    id: 21,
    category: "personality",
    text: "I am curious about many different subjects and enjoy intellectual discussions.",
    trait: "Openness",
  },
  {
    id: 22,
    category: "personality",
    text: "I am highly organized and like to plan ahead to ensure everything is done properly.",
    trait: "Conscientiousness",
  },
  {
    id: 23,
    category: "personality",
    text: "I pay close attention to details and take pride in producing high-quality work.",
    trait: "Conscientiousness",
  },
  {
    id: 24,
    category: "personality",
    text: "I am disciplined and complete tasks promptly without procrastinating.",
    trait: "Conscientiousness",
  },
  {
    id: 25,
    category: "personality",
    text: "I feel energized when I'm around other people and enjoy social interactions.",
    trait: "Extraversion",
  },
  {
    id: 26,
    category: "personality",
    text: "I am comfortable starting conversations and meeting new people.",
    trait: "Extraversion",
  },
  {
    id: 27,
    category: "personality",
    text: "I don't mind being the center of attention and enjoy leading group discussions.",
    trait: "Extraversion",
  },
  {
    id: 28,
    category: "personality",
    text: "I am naturally sympathetic and can easily understand others' feelings and perspectives.",
    trait: "Agreeableness",
  },
  {
    id: 29,
    category: "personality",
    text: "I am cooperative and prefer harmony over conflict in relationships.",
    trait: "Agreeableness",
  },
  {
    id: 30,
    category: "personality",
    text: "I often put others' needs before my own and genuinely care about their well-being.",
    trait: "Agreeableness",
  },
  {
    id: 31,
    category: "personality",
    text: "I remain calm and composed even in stressful or challenging situations.",
    trait: "Stability",
  },
  {
    id: 32,
    category: "personality",
    text: "I don't get easily stressed or anxious about problems or uncertainties.",
    trait: "Stability",
  },
  {
    id: 33,
    category: "personality",
    text: "I can handle pressure well and maintain my emotional balance during difficult times.",
    trait: "Stability",
  },
  {
    id: 34,
    category: "strength",
    text: "I am skilled at breaking down complex problems into smaller parts and finding logical solutions.",
    trait: "Analytical",
  },
  {
    id: 35,
    category: "strength",
    text: "I can explain difficult concepts clearly and adapt my communication style to different audiences.",
    trait: "Communication",
  },
  {
    id: 36,
    category: "strength",
    text: "I am comfortable working with numbers, statistics, and mathematical calculations.",
    trait: "Numerical",
  },
  {
    id: 37,
    category: "strength",
    text: "I can easily visualize three-dimensional objects and understand spatial relationships.",
    trait: "Spatial",
  },
  {
    id: 38,
    category: "strength",
    text: "People find it easy to talk to me, and I build rapport quickly with others.",
    trait: "Interpersonal",
  },
  {
    id: 39,
    category: "strength",
    text: "I pick up new software, tools, and technologies quickly and enjoy learning technical skills.",
    trait: "Technical",
  },
  {
    id: 40,
    category: "strength",
    text: "I frequently come up with original ideas and innovative solutions to problems.",
    trait: "Creative",
  },
  {
    id: 41,
    category: "strength",
    text: "I excel at organizing my workspace, managing my time, and keeping systems running smoothly.",
    trait: "Organizational",
  },
  {
    id: 42,
    category: "strength",
    text: "People naturally look to me for guidance and direction when working in groups.",
    trait: "Leadership",
  },
  {
    id: 43,
    category: "strength",
    text: "I notice small errors and inconsistencies that others often overlook.",
    trait: "Attention to Detail",
  },
  {
    id: 44,
    category: "value",
    text: "It is important to me to accomplish challenging goals and see tangible results from my work.",
    trait: "Achievement",
  },
  {
    id: 45,
    category: "value",
    text: "I prefer having the freedom to make my own decisions without constant supervision.",
    trait: "Independence",
  },
  {
    id: 46,
    category: "value",
    text: "Being recognized and respected for my expertise and accomplishments matters to me.",
    trait: "Recognition",
  },
  {
    id: 47,
    category: "value",
    text: "Building strong, positive relationships with colleagues is essential to my job satisfaction.",
    trait: "Relationships",
  },
  {
    id: 48,
    category: "value",
    text: "I value a low-stress work environment with good work-life balance.",
    trait: "Comfort",
  },
  {
    id: 49,
    category: "value",
    text: "I want my work to contribute to making the world a better place and helping others.",
    trait: "Altruism",
  },
  {
    id: 50,
    category: "value",
    text: "Job stability, steady income, and long-term security are top priorities for me.",
    trait: "Security",
  },
  {
    id: 51,
    category: "value",
    text: "I need variety and new challenges in my daily tasks to stay engaged and motivated.",
    trait: "Variety",
  },
];

const questionsSeed = sourceQuestions.map((question) => ({
  text: question.text,
  pillar: CATEGORY_MAP[question.category],
  traitKey: TRAIT_MAP[question.trait],
  stepNumber: Math.ceil(question.id / 5),
  orderInStep: ((question.id - 1) % 5) + 1,
}));

const withDefaults = (partial, keys) =>
  keys.reduce((acc, key) => {
    acc[key] = partial[key] ?? 50;
    return acc;
  }, {});

const buildTraitProfile = (profile) => ({
  interest: withDefaults(profile.interest || {}, INTEREST_TRAITS),
  personality: withDefaults(profile.personality || {}, PERSONALITY_TRAITS),
  strengths: withDefaults(profile.strengths || {}, STRENGTH_TRAITS),
  values: withDefaults(profile.values || {}, VALUE_TRAITS),
});

const careersSeed = [
  {
    title: "Software Engineer",
    category: "Technology",
    description:
      "Designs and builds software systems, from web apps to backend services.",
    salaryRange: "$85,000 - $165,000",
    education: "Bachelor's in CS/IT or equivalent portfolio",
    growthOutlook: "Strong growth with AI and cloud demand",
    tags: ["Problem Solving", "Systems Thinking", "Continuous Learning"],
    traitProfile: buildTraitProfile({
      interest: {
        investigative: 88,
        realistic: 72,
        conventional: 70,
      },
      personality: {
        openness: 74,
        conscientiousness: 82,
        stability: 72,
      },
      strengths: {
        analytical: 92,
        organizational: 82,
        creative: 68,
      },
      values: {
        achievement: 84,
        independence: 75,
        variety: 66,
      },
    }),
  },
  {
    title: "Data Analyst",
    category: "Analytics",
    description:
      "Turns raw data into insights that support decisions and strategy.",
    salaryRange: "$70,000 - $125,000",
    education: "Bachelor's in Analytics, Stats, Math, or related field",
    growthOutlook: "High demand across all industries",
    tags: ["Data Storytelling", "Business Insight", "Critical Thinking"],
    traitProfile: buildTraitProfile({
      interest: {
        investigative: 90,
        conventional: 78,
        realistic: 64,
      },
      personality: {
        conscientiousness: 84,
        openness: 70,
        stability: 74,
      },
      strengths: {
        analytical: 95,
        communication: 78,
        organizational: 80,
      },
      values: {
        achievement: 80,
        recognition: 62,
        independence: 68,
      },
    }),
  },
  {
    title: "UX Designer",
    category: "Design",
    description:
      "Creates intuitive digital experiences by combining user research and design.",
    salaryRange: "$75,000 - $140,000",
    education: "Bachelor's or portfolio from UX/design programs",
    growthOutlook: "Steady growth in product-focused teams",
    tags: ["Human-Centered", "Visual Thinking", "Product Collaboration"],
    traitProfile: buildTraitProfile({
      interest: {
        artistic: 88,
        social: 78,
        investigative: 72,
      },
      personality: {
        openness: 88,
        agreeableness: 74,
        conscientiousness: 70,
      },
      strengths: {
        creative: 90,
        communication: 82,
        analytical: 70,
      },
      values: {
        altruism: 80,
        variety: 84,
        independence: 72,
      },
    }),
  },
  {
    title: "Clinical Psychologist",
    category: "Healthcare",
    description:
      "Assesses and supports mental health through therapy and evidence-based care.",
    salaryRange: "$78,000 - $135,000",
    education: "Master's/Doctoral degree + licensure",
    growthOutlook: "Strong growth due to increased mental health focus",
    tags: ["Empathy", "Listening", "Behavioral Science"],
    traitProfile: buildTraitProfile({
      interest: {
        social: 92,
        investigative: 78,
        artistic: 62,
      },
      personality: {
        agreeableness: 86,
        stability: 84,
        openness: 76,
      },
      strengths: {
        communication: 90,
        analytical: 72,
        leadership: 62,
      },
      values: {
        altruism: 94,
        achievement: 72,
        recognition: 55,
      },
    }),
  },
  {
    title: "Marketing Strategist",
    category: "Business",
    description:
      "Builds campaigns and go-to-market strategies using audience and market insights.",
    salaryRange: "$68,000 - $130,000",
    education: "Bachelor's in Marketing, Business, or Communications",
    growthOutlook: "High demand for digital-first marketing talent",
    tags: ["Brand Thinking", "Communication", "Market Awareness"],
    traitProfile: buildTraitProfile({
      interest: {
        enterprising: 88,
        artistic: 78,
        social: 70,
      },
      personality: {
        extraversion: 80,
        openness: 82,
        conscientiousness: 68,
      },
      strengths: {
        communication: 92,
        creative: 84,
        organizational: 74,
      },
      values: {
        recognition: 82,
        variety: 86,
        achievement: 76,
      },
    }),
  },
  {
    title: "Civil Engineer",
    category: "Engineering",
    description:
      "Designs and manages infrastructure projects like roads, bridges, and buildings.",
    salaryRange: "$72,000 - $128,000",
    education: "Bachelor's in Civil Engineering + licensure path",
    growthOutlook: "Stable demand with public infrastructure investments",
    tags: ["Infrastructure", "Planning", "Technical Precision"],
    traitProfile: buildTraitProfile({
      interest: {
        realistic: 86,
        investigative: 80,
        conventional: 74,
      },
      personality: {
        conscientiousness: 86,
        stability: 76,
        openness: 62,
      },
      strengths: {
        analytical: 84,
        organizational: 88,
        leadership: 70,
      },
      values: {
        achievement: 78,
        altruism: 72,
        independence: 60,
      },
    }),
  },
  {
    title: "Financial Analyst",
    category: "Finance",
    description:
      "Evaluates financial performance, forecasts trends, and supports investment decisions.",
    salaryRange: "$72,000 - $145,000",
    education: "Bachelor's in Finance/Economics; CFA optional",
    growthOutlook: "Strong outlook in corporate finance and investment",
    tags: ["Forecasting", "Decision Support", "Risk Evaluation"],
    traitProfile: buildTraitProfile({
      interest: {
        conventional: 86,
        investigative: 84,
        enterprising: 68,
      },
      personality: {
        conscientiousness: 88,
        stability: 78,
        openness: 66,
      },
      strengths: {
        analytical: 92,
        organizational: 80,
        communication: 70,
      },
      values: {
        achievement: 82,
        recognition: 74,
        independence: 64,
      },
    }),
  },
  {
    title: "Teacher",
    category: "Education",
    description:
      "Facilitates learning, mentors students, and builds supportive classroom environments.",
    salaryRange: "$48,000 - $92,000",
    education: "Bachelor's in Education + certification",
    growthOutlook: "Consistent demand with regional variability",
    tags: ["Mentoring", "Communication", "Learner Development"],
    traitProfile: buildTraitProfile({
      interest: {
        social: 92,
        artistic: 68,
        conventional: 60,
      },
      personality: {
        agreeableness: 90,
        extraversion: 76,
        stability: 80,
      },
      strengths: {
        communication: 92,
        leadership: 72,
        creative: 70,
      },
      values: {
        altruism: 92,
        achievement: 68,
        variety: 72,
      },
    }),
  },
  {
    title: "Product Manager",
    category: "Technology",
    description:
      "Aligns customer needs, business goals, and engineering execution to ship products.",
    salaryRange: "$95,000 - $180,000",
    education: "Bachelor's; product experience highly valued",
    growthOutlook: "Very strong in software and AI companies",
    tags: ["Strategy", "Cross-Functional Leadership", "Execution"],
    traitProfile: buildTraitProfile({
      interest: {
        enterprising: 86,
        investigative: 76,
        social: 70,
      },
      personality: {
        conscientiousness: 82,
        openness: 80,
        extraversion: 72,
      },
      strengths: {
        leadership: 90,
        communication: 88,
        organizational: 84,
      },
      values: {
        achievement: 84,
        altruism: 80,
        variety: 78,
      },
    }),
  },
  {
    title: "Biomedical Research Scientist",
    category: "Research",
    description:
      "Investigates biological systems to advance diagnostics, treatments, and therapies.",
    salaryRange: "$82,000 - $160,000",
    education: "Master's/PhD in biomedical sciences",
    growthOutlook: "Strong growth with biotech and precision medicine",
    tags: ["Research", "Scientific Inquiry", "Healthcare Innovation"],
    traitProfile: buildTraitProfile({
      interest: {
        investigative: 94,
        realistic: 66,
        conventional: 70,
      },
      personality: {
        openness: 84,
        conscientiousness: 82,
        stability: 72,
      },
      strengths: {
        analytical: 94,
        organizational: 74,
        communication: 64,
      },
      values: {
        altruism: 86,
        achievement: 80,
        independence: 70,
      },
    }),
  },
  {
    title: "HR Specialist",
    category: "People Operations",
    description:
      "Supports talent programs, employee relations, and healthy workplace culture.",
    salaryRange: "$58,000 - $105,000",
    education: "Bachelor's in HR, Business, or Psychology",
    growthOutlook: "Stable growth with people analytics trends",
    tags: ["People Support", "Communication", "Policy and Process"],
    traitProfile: buildTraitProfile({
      interest: {
        social: 84,
        conventional: 74,
        enterprising: 66,
      },
      personality: {
        agreeableness: 88,
        extraversion: 68,
        conscientiousness: 74,
      },
      strengths: {
        communication: 88,
        leadership: 66,
        organizational: 72,
      },
      values: {
        altruism: 78,
        recognition: 64,
        variety: 68,
      },
    }),
  },
  {
    title: "Startup Founder",
    category: "Entrepreneurship",
    description:
      "Builds a new venture by identifying opportunities and leading rapid execution.",
    salaryRange: "Highly variable ($0 - $300,000+)",
    education: "No fixed path; domain and execution experience matter",
    growthOutlook: "High upside with high uncertainty",
    tags: ["Ownership", "Risk Taking", "Vision and Drive"],
    traitProfile: buildTraitProfile({
      interest: {
        enterprising: 94,
        investigative: 72,
        artistic: 70,
      },
      personality: {
        openness: 88,
        extraversion: 76,
        stability: 66,
      },
      strengths: {
        leadership: 92,
        organizational: 88,
        creative: 84,
      },
      values: {
        independence: 94,
        achievement: 90,
        recognition: 80,
        variety: 88,
      },
    }),
  },
];

module.exports = {
  questionsSeed,
  careersSeed,
};
