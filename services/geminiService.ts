import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiResponse, AnonymizedCustomerAnalytics } from '../types';

// Use the environment variable with VITE_ prefix
const API_KEY = process.env.GEMINI_API_KEY || "";

if (!API_KEY) {
  console.warn("Gemini API Key is not set. Gemini features will not work. Set VITE_GEMINI_API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const textModel = 'gemini-2.5-flash-preview-04-17';
// const imageModel = 'imagen-3.0-generate-002'; // If image generation is needed

const parseJsonFromText = (text: string): any => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini:", e, "Original text:", text);
    return { error: "Failed to parse JSON", originalText: text.substring(0, 500) };
  }
};


/**
 * Generates a product description using Gemini AI.
 * @param productName - Name of the product.
 * @param category - Product category.
 * @param keywords - Relevant keywords.
 * @returns GeminiResponse<string>
 */
export const generateProductDescription = async (productName: string, category: string, keywords: string): Promise<GeminiResponse<string>> => {
  if (!API_KEY) return { data: null, error: "API Key not configured. Please set the VITE_GEMINI_API_KEY environment variable." };
  const prompt = `Anda adalah pembantu AI untuk sistem POS. Jana deskripsi produk yang menarik dan ringkas (sekitar 2-3 ayat) untuk produk berikut:\nNama Produk: ${productName}\nKategori: ${category || 'Tidak dinyatakan'}\nKata Kunci: ${keywords || 'Tiada'}\n\nFormatkan deskripsi dengan baik. Berikan hanya deskripsi produk, tanpa pengenalan tambahan.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
    if (textResponse && textResponse.trim() !== "") {
        return { data: textResponse.trim(), error: null };
    } else {
        return { data: null, error: "Gemini returned an empty description." };
    }
  } catch (error) {
    console.error("Error generating product description:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while generating description.";
    return { data: null, error: errorMessage };
  }
};


/**
 * Gets related product suggestions using Gemini AI.
 * @param cartItemNames - Names of items in the cart.
 * @param productCatalogNames - Names of products in the catalog.
 * @returns GeminiResponse<string[]>
 */
export const getRelatedProductSuggestions = async (cartItemNames: string, productCatalogNames: string): Promise<GeminiResponse<string[]>> => {
  if (!API_KEY) return { data: null, error: "API Key not configured. Please set the VITE_GEMINI_API_KEY environment variable." };
  const prompt = `Pelanggan ini mempunyai item berikut dalam troli: ${cartItemNames}. Cadangkan 2-3 produk tambahan yang mungkin diminati pelanggan ini dari senarai produk katalog berikut: ${productCatalogNames}. Berikan cadangan sebagai senarai ringkas, setiap cadangan pada baris baru, dimulai dengan tanda sempang (-). Contoh: - Produk X. Berikan hanya senarai produk, tanpa pengenalan tambahan.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
    if (textResponse) {
      const suggestions = textResponse.split('\n').map(s => s.replace(/^- /,'').trim()).filter(s => s);
      if (suggestions.length > 0) {
        return { data: suggestions, error: null };
      } else {
        return { data: null, error: "Gemini returned no suggestions or an empty list." };
      }
    }
    return { data: null, error: "Gemini returned no text response for suggestions." };
  } catch (error) {
    console.error("Error getting product suggestions:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while getting suggestions.";
    return { data: null, error: errorMessage };
  }
};


/**
 * Summarizes report data using Gemini AI.
 * @param reportData - The report data to summarize.
 * @returns GeminiResponse<string>
 */
export const summarizeReportData = async (reportData: string): Promise<GeminiResponse<string>> => {
  if (!API_KEY) return { data: null, error: "API Key not configured. Please set the VITE_GEMINI_API_KEY environment variable." };
  const prompt = `Anda adalah penganalisis data AI. Berdasarkan data laporan berikut, berikan ringkasan eksekutif (2-3 ayat utama) mengenai tren jualan dan pemerhatian penting:\n${reportData}\n\nFokus pada tren utama dan sebarang anomali jika ada. Berikan hanya ringkasan, tanpa pengenalan tambahan.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
     if (textResponse && textResponse.trim() !== "") {
        return { data: textResponse.trim(), error: null };
    } else {
        return { data: null, error: "Gemini returned an empty summary." };
    }
  } catch (error) {
    console.error("Error summarizing report data:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while summarizing data.";
    return { data: null, error: errorMessage };
  }
};


/**
 * Generates a demographic insight summary using Gemini AI.
 * @param analytics - The customer analytics data.
 * @param currentLang - The current language ('ms' or 'en').
 * @returns GeminiResponse<string>
 */
export const getDemographicInsightSummary = async (analytics: AnonymizedCustomerAnalytics, currentLang: 'ms' | 'en'): Promise<GeminiResponse<string>> => {
  if (!API_KEY) return { data: null, error: "API Key not configured. Please set the VITE_GEMINI_API_KEY environment variable." };
  
  let demographicDetails = [];
  if (analytics.ageGroup) demographicDetails.push(`Age Group: ${analytics.ageGroup}`);
  if (analytics.gender) demographicDetails.push(`Gender: ${analytics.gender}`);
  if (analytics.sentiment) demographicDetails.push(`Sentiment: ${analytics.sentiment}`);
  
  const detailsString = demographicDetails.join(', ');
  const langInstruction = currentLang === 'ms' ? "Berikan cerapan dalam Bahasa Malaysia." : "Provide the insight in English.";

  const prompt = `Anda adalah penganalisis perniagaan AI. Untuk pelanggan dengan profil berikut: ${detailsString}, berikan satu cerapan perniagaan generik atau cadangan pemasaran yang mungkin relevan (1-2 ayat). ${langInstruction} Contoh: "Pelanggan dalam segmen ini mungkin menghargai promosi kesetiaan." atau "Pertimbangkan untuk menonjolkan produk mesra keluarga." Berikan hanya cerapan, tanpa pengenalan tambahan.`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
    if (textResponse && textResponse.trim() !== "") {
        return { data: textResponse.trim(), error: null };
    } else {
        return { data: null, error: "Gemini returned an empty insight summary." };
    }
  } catch (error) {
    console.error("Error generating demographic insight summary:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while generating insight.";
    return { data: null, error: errorMessage };
  }
};


/**
 * Gets structured data example from Gemini AI.
 * @param promptText - The prompt text to send to Gemini.
 * @returns GeminiResponse<any>
 */
export const getStructuredDataExample = async (promptText: string): Promise<GeminiResponse<any>> => {
  if (!API_KEY) return { data: null, error: "API Key not configured. Please set the VITE_GEMINI_API_KEY environment variable." };
  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      }
    });
    const parsedJson = parseJsonFromText(response.text);
    if (parsedJson.error) { // Check if parseJsonFromText itself returned an error object
        return { data: null, error: `JSON parsing failed: ${parsedJson.error}. Original text: ${parsedJson.originalText}` };
    }
    return { data: parsedJson, error: null };
  } catch (error) {
    console.error("Error getting structured data from Gemini:", error);
    const errorMessage = (error instanceof Error) ? error.message : "API call failed for structured data.";
    return { data: null, error: errorMessage };
  }
};