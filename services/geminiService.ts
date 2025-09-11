
import { GoogleGenAI } from "@google/genai";
import { Phrase } from '../types';

function cleanJsonString(str: string): string {
  // Remove markdown backticks and 'json' language identifier
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
}

const languageMap: Record<string, string> = {
    JP: 'Japanese',
    US: 'English',
    GB: 'English',
    CA: 'English',
    AU: 'English',
    FR: 'French',
    CN: 'Chinese',
    ES: 'Spanish',
    DE: 'German',
    IT: 'Italian',
    VN: 'Vietnamese',
    TH: 'Thai',
};

export const generateTravelPhrases = async (placeName: string, countryCode: string, apiKey: string): Promise<Phrase[]> => {
  if (!apiKey) {
    throw new Error("Gemini API Key is required.");
  }
  const ai = new GoogleGenAI({ apiKey });

  let prompt: string;
  const upperCaseCountryCode = countryCode.toUpperCase();

  if (upperCaseCountryCode === 'KR') {
    prompt = `
      You are an AI assistant for a Korean traveler visiting "${placeName}" in South Korea.
      Your task is to generate 5 useful Korean phrases for this specific location. For example, phrases for ordering unique menu items at a famous cafe.
      You must respond ONLY with a JSON object in the following format, with no other text or explanations before or after the JSON:
      {"phrases": [{"korean": "..."}]}
    `;
  } else {
    const language = languageMap[upperCaseCountryCode] || 'English';
    prompt = `
      You are an AI assistant for a Korean traveler visiting "${placeName}". The local language is ${language}.
      Your task is to generate 5 useful ${language} phrases for this specific location.
      Use your search tool to find information about this place, such as popular menu items, products, or activities.
      For each phrase, provide:
      1. The original sentence in ${language} (key: "original").
      2. Its pronunciation written in Korean Hangul (key: "pronunciation").
      3. The Korean translation (key: "korean").
      You must respond ONLY with a JSON object in the following format, with no other text or explanations before or after the JSON:
      {"phrases": [{"original": "...", "pronunciation": "...", "korean": "..."}]}
    `;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const jsonString = cleanJsonString(response.text);

    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.phrases && Array.isArray(parsed.phrases)) {
        return parsed.phrases;
      } else {
        throw new Error('AI 응답의 JSON 구조가 올바르지 않습니다.');
      }
    } catch (e) {
      console.error("Failed to parse JSON response:", jsonString);
      throw new Error("AI가 유효하지 않은 형식의 응답을 반환했습니다. 다시 시도해 주세요.");
    }
  } catch (error) {
    console.error("Error generating phrases with Gemini:", error);
    if (error instanceof Error && (error.message.includes('API key not valid') || error.message.includes('permission'))) {
       throw new Error("제공된 Gemini API 키가 유효하지 않습니다. 키를 확인하고 다시 시도해 주세요.");
    }
    throw new Error("회화 생성에 실패했습니다. API 키와 네트워크 연결을 확인해주세요.");
  }
};
