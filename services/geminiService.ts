
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType } from "../types";

// Always initialize GoogleGenAI with a named apiKey parameter
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialAdvice = async (transactions: Transaction[]) => {
  const transactionSummary = transactions.map(t => 
    `${t.date}: ${t.description} (${t.type === TransactionType.INCOME ? 'دخل' : 'مصروف'}) - ${t.amount} ريال`
  ).join('\n');

  const prompt = `
    أنت مستشار مالي خبير. بناءً على قائمة المعاملات المالية التالية، قم بتحليل الوضع المالي وتقديم نصائح ذكية:
    
    ${transactionSummary}
    
    يرجى تقديم التحليل في شكل JSON يحتوي على مصفوفة من الأفكار (insights) مع الحقول التالية:
    - title: عنوان قصير للفكرة
    - content: تفاصيل النصيحة أو الملاحظة
    - type: نوع الملاحظة (tip, warning, info)
  `;

  try {
    // Use gemini-3-pro-preview for complex reasoning and financial analysis
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['tip', 'warning', 'info'] }
                },
                required: ["title", "content", "type"]
              }
            }
          },
          required: ["insights"]
        }
      }
    });

    // Access text as a property, not a method
    const result = JSON.parse(response.text || '{"insights": []}');
    return result.insights;
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
