/**
 * AI 모델 설정. 프로바이더를 갈아끼울 때는 여기만 수정.
 *
 * Google Gemini 2.5 Flash · 무료 티어 넉넉 (분당 15회, 일일 1,500회)
 * 데모/시연용으로 충분.
 */

import { google } from "@ai-sdk/google";

export const COACH_MODEL = google("gemini-2.5-flash");
export const STRUCTURED_MODEL = google("gemini-2.5-flash");
export const EXPLAIN_MODEL = google("gemini-2.5-flash");

export const SUBJECT_LIST = ["전기이론", "전기기기", "전기설비"] as const;

export const SITE_NAME = "독끝 전기기능사 필기";
