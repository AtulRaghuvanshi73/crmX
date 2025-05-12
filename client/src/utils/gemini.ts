import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const getGeminiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API key not found in environment variables. This may cause issues with natural language segment rules.");
    // For deployment debugging
    console.log("Available env vars:", Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
    throw new Error("Gemini API key not found. Please add NEXT_PUBLIC_GEMINI_API_KEY to your environment variables.");
  }
  
  return new GoogleGenerativeAI(apiKey);
};

export const queryGemini = async (prompt: string): Promise<string> => {
  try {
    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Convert natural language query to segment rules
    const result = await model.generateContent(`
      Convert the following natural language segment description to JSON format segment rules:
      
      "${prompt}"
      
      Return only the JSON format with fields:
      {
        "description": "(original query)",
        "rules": [
          {
            "field": "lastVisits",
            "operator": "<",
            "value": "(time in milliseconds)",
            "humanReadable": "(human-readable description)"
          },
          {
            "field": "spends",
            "operator": ">",
            "value": 5000,
            "humanReadable": "spent over ₹5,000"
          }
        ]
      }
      
      Only return valid JSON that can be parsed with JSON.parse(). No introductory text or explanations.
    `);

    const response = result.response;
    const text = response.text();
    
    return text;
  } catch (error) {
    console.error("Error querying Gemini:", error);
    throw error;
  }
};
