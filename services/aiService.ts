import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY environment variable not set.");
  // In a real app, you might want to show a more user-friendly error
}

const ai = new GoogleGenAI({ apiKey: apiKey! });

const handleError = (error: unknown): string => {
    console.error("Error calling AI service:", error);
    if (error instanceof Error) {
        return `Error: ${error.message}`;
    }
    return "An unknown error occurred.";
}

export const runTextGeneration = async (prompt: string): Promise<{ text: string; tokenCount: number }> => {
  if (!apiKey) throw new Error("API Key is not configured.");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { thinkingConfig: { thinkingBudget: 0 } },
    });
    const tokenCount = Math.round(response.text.length / 4); // Simulate token count
    return { text: response.text, tokenCount };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const runWebSearch = async (prompt: string): Promise<{ text: string, sources: {uri: string, title: string}[], tokenCount: number }> => {
  if (!apiKey) throw new Error("API Key is not configured.");
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{googleSearch: {}}],
      },
    });
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    const sources = groundingMetadata?.groundingChunks
        ?.map(c => c.web)
        .filter(web => web?.uri && web?.title) as {uri: string, title: string}[] || [];
    const tokenCount = Math.round(text.length / 4); // Simulate token count

    return { text, sources, tokenCount };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const runImageGeneration = async (prompt: string): Promise<string> => {
    if (!apiKey) throw new Error("API Key is not configured.");
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });

        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        throw new Error(handleError(error));
    }
}