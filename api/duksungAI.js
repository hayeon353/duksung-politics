import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const { userText } = req.body;

  if (!userText) {
    return res.status(400).json({ error: "입력된 텍스트가 없습니다." });
  }

  const prompt = `
다음은 사용자가 정치적 질문에 응답한 내용입니다:

${userText}

이 응답을 바탕으로, 이 사용자의 정치 성향이 진보와 보수 중 어느 쪽에 가까운지 판단해줘.
진보와 보수 각각 몇 %의 성향을 가지는지 추정해서 알려줘.
형식은 다음처럼 해줘:

진보: xx%, 보수: yy%

중립적이거나 판단이 어려운 응답은 50:50에 가깝게 추정해줘.
`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response.text(); 
    res.status(200).json({ answer: response });
  } catch (err) {
    console.error("Gemini API 오류:", err);
    res.status(500).json({ error: "Gemini API 오류 발생" });
  }
}