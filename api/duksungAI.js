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
아래는 어떤 사람의 정치적 입장에 대한 3가지 질문과 응답입니다:

${userText}

응답을 바탕으로 이 사람의 정치 성향이 진보와 보수 중 어느 쪽에 가까운지 판단해줘.
진보와 보수 각각 몇 %인지 추정해서 알려줘. 형식은 다음처럼 해줘:

진보: xx%, 보수: yy%

단, 중립은 50:50으로 반영해. 판단이 어려운 경우에도 둘 다 0%는 피하고 균형 있게 보여줘.
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