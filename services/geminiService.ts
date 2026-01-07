
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  // Ưu tiên lấy key từ cài đặt ứng dụng, nếu không có mới dùng env
  const savedKey = localStorage.getItem('smart_pocket_api_key');
  const apiKey = savedKey || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key chưa được cấu hình. Vui lòng vào mục Admin để thiết lập.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export interface ScanAIResult {
  barcode?: string;
  productName?: string;
  brand?: string;
  type: 'barcode' | 'qr' | 'visual' | 'unknown';
  confidence: number;
}

export async function analyzeProductImage(base64Image: string): Promise<ScanAIResult> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `Bạn là hệ thống nhận diện sản phẩm siêu thị. Hãy phân tích ảnh và trích xuất:
1. Mã vạch (số) hoặc nội dung mã QR.
2. Nếu không có mã, hãy nhận diện tên sản phẩm và thương hiệu.
3. Đánh giá độ tin cậy (0.0 - 1.0).

Trả về JSON: {"barcode": "string", "productName": "string", "brand": "string", "type": "barcode|qr|visual|unknown", "confidence": number}.`,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            barcode: { type: Type.STRING },
            productName: { type: Type.STRING },
            brand: { type: Type.STRING },
            type: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
          },
          required: ["type", "confidence"]
        },
      }
    });

    const text = response.text || '{}';
    return JSON.parse(text);
  } catch (e: any) {
    console.error("AI Analysis Error:", e);
    // Thông báo cho UI nếu thiếu API Key
    if (e.message.includes("API Key")) {
        alert(e.message);
    }
    return { type: 'unknown', confidence: 0 };
  }
}

export async function generateProductDescription(productName: string): Promise<string> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Mô tả ngắn gọn, hấp dẫn về sản phẩm: ${productName}. Tối đa 30 từ.`,
  });
  return response.text || "";
}
