import httpClient, { unwrapResponse } from "./httpClient";

export async function createSession() {
  return unwrapResponse(await httpClient.post("/sessions"));
}

export async function getSession(sessionId) {
  return unwrapResponse(await httpClient.get(`/sessions/${sessionId}`));
}

export async function updateSessionStep(sessionId, payload) {
  return unwrapResponse(await httpClient.patch(`/sessions/${sessionId}/step`, payload));
}

export async function getQuestions(step) {
  return unwrapResponse(await httpClient.get(`/questions`, { params: { step } }));
}

export async function submitStepAnswers(sessionId, payload) {
  return unwrapResponse(await httpClient.post(`/sessions/${sessionId}/answers`, payload));
}

export async function completeAssessment(sessionId) {
  return unwrapResponse(await httpClient.post(`/sessions/${sessionId}/complete`));
}

export async function getAssessmentResults(sessionId) {
  return unwrapResponse(await httpClient.get(`/sessions/${sessionId}/results`));
}
