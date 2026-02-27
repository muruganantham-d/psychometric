const { TRAIT_KEYS_BY_PILLAR, TRAIT_LABELS } = require("../utils/traits");

const WEIGHTS = {
  interest: 0.4,
  personality: 0.25,
  strengths: 0.2,
  values: 0.15,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

function computeNormalizedProfile(questions, answersByQuestionId, pillar) {
  const traitKeys = TRAIT_KEYS_BY_PILLAR[pillar];
  const totals = Object.fromEntries(traitKeys.map((key) => [key, 0]));
  const maximums = Object.fromEntries(traitKeys.map((key) => [key, 0]));

  for (const question of questions) {
    if (question.pillar !== pillar) {
      continue;
    }

    const answerValue = answersByQuestionId.get(question._id.toString());
    if (!answerValue) {
      continue;
    }

    totals[question.traitKey] += answerValue;
    maximums[question.traitKey] += 5;
  }

  return traitKeys.reduce((profile, traitKey) => {
    const max = maximums[traitKey];
    profile[traitKey] = max === 0 ? 0 : Math.round((totals[traitKey] / max) * 100);
    return profile;
  }, {});
}

function toChartData(pillar, profile) {
  return TRAIT_KEYS_BY_PILLAR[pillar].map((traitKey) => ({
    traitKey,
    trait: TRAIT_LABELS[traitKey],
    score: profile[traitKey],
  }));
}

function rankTraits(profile, pillar, count) {
  return TRAIT_KEYS_BY_PILLAR[pillar]
    .map((traitKey) => ({
      traitKey,
      trait: TRAIT_LABELS[traitKey],
      score: profile[traitKey] ?? 0,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

function computeSimilarity(userProfile, targetProfile, traitKeys) {
  const averageDifference =
    traitKeys.reduce(
      (sum, traitKey) => sum + Math.abs((userProfile[traitKey] ?? 0) - (targetProfile[traitKey] ?? 0)),
      0
    ) / traitKeys.length;

  return clamp(100 - averageDifference, 0, 100);
}

function buildWhyItFitsTags(userProfiles, careerProfile) {
  const traitSignals = Object.entries(TRAIT_KEYS_BY_PILLAR).flatMap(([pillar, keys]) =>
    keys.map((traitKey) => {
      const userScore = userProfiles[pillar][traitKey] ?? 0;
      const targetScore = careerProfile[pillar][traitKey] ?? 0;
      const overlap = Math.min(userScore, targetScore);
      const gap = Math.abs(userScore - targetScore);
      return {
        traitKey,
        overlap,
        gap,
      };
    })
  );

  return traitSignals
    .filter((signal) => signal.overlap >= 55)
    .sort((a, b) => {
      if (b.overlap === a.overlap) {
        return a.gap - b.gap;
      }
      return b.overlap - a.overlap;
    })
    .slice(0, 3)
    .map((signal) => `Aligned on ${TRAIT_LABELS[signal.traitKey]}`);
}

/**
 * Converts raw Likert answers into normalized trait profiles (0..100),
 * then compares those profiles to seeded career target profiles.
 */
function computeAssessmentResults({ questions, answersByQuestionId, careers }) {
  const interestProfile = computeNormalizedProfile(questions, answersByQuestionId, "interest");
  const personalityProfile = computeNormalizedProfile(questions, answersByQuestionId, "personality");
  const strengthsProfile = computeNormalizedProfile(questions, answersByQuestionId, "strengths");
  const valuesProfile = computeNormalizedProfile(questions, answersByQuestionId, "values");

  const userProfiles = {
    interest: interestProfile,
    personality: personalityProfile,
    strengths: strengthsProfile,
    values: valuesProfile,
  };

  const topCareerMatches = careers
    .map((career) => {
      const interestSimilarity = computeSimilarity(
        interestProfile,
        career.traitProfile.interest,
        TRAIT_KEYS_BY_PILLAR.interest
      );
      const personalitySimilarity = computeSimilarity(
        personalityProfile,
        career.traitProfile.personality,
        TRAIT_KEYS_BY_PILLAR.personality
      );
      const strengthsSimilarity = computeSimilarity(
        strengthsProfile,
        career.traitProfile.strengths,
        TRAIT_KEYS_BY_PILLAR.strengths
      );
      const valuesSimilarity = computeSimilarity(
        valuesProfile,
        career.traitProfile.values,
        TRAIT_KEYS_BY_PILLAR.values
      );

      const matchScore = Math.round(
        interestSimilarity * WEIGHTS.interest +
          personalitySimilarity * WEIGHTS.personality +
          strengthsSimilarity * WEIGHTS.strengths +
          valuesSimilarity * WEIGHTS.values
      );

      const whyItFits = buildWhyItFitsTags(userProfiles, career.traitProfile);

      return {
        title: career.title,
        category: career.category,
        description: career.description,
        salaryRange: career.salaryRange,
        education: career.education,
        growthOutlook: career.growthOutlook,
        tags: career.tags,
        matchScore,
        whyItFits: whyItFits.length > 0 ? whyItFits : ["Overall profile alignment"],
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10);

  return {
    generatedAt: new Date().toISOString(),
    profiles: userProfiles,
    charts: {
      interestRadar: toChartData("interest", interestProfile),
      personalityBars: toChartData("personality", personalityProfile),
    },
    topStrengths: rankTraits(strengthsProfile, "strengths", 5),
    coreValues: rankTraits(valuesProfile, "values", 5),
    topCareerMatches,
  };
}

module.exports = {
  computeAssessmentResults,
};
