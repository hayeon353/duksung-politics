async function analyze() {
  const q1 = document.querySelector('input[name="q1"]:checked');
  const q2 = document.querySelector('input[name="q2"]:checked');
  const q3 = document.querySelector('input[name="q3"]:checked');
  const resultDiv = document.getElementById("result");

  if (!q1 || !q2 || !q3) {
    resultDiv.textContent = "모든 문항에 응답해주세요.";
    return;
  }

  const combinedAnswer = `
1번 질문: 정부의 복지 확대는 바람직하다 → ${q1.value}
2번 질문: 시장 경제는 정부 개입 없이 운영되어야 한다 → ${q2.value}
3번 질문: 남북 대화는 지속되어야 한다 → ${q3.value}
`;

  resultDiv.textContent = "분석 중...";

  try {
    const response = await fetch("https://assign2-g053k8hpm-hayeonkims-projects-f0ed7bbb.vercel.app/api/duksungAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userText: combinedAnswer })
    });

    const data = await response.json();

    if (data.answer) {
      resultDiv.textContent = data.answer;
    } else {
      resultDiv.textContent = "오류: " + (data.error || "알 수 없는 에러");
    }
  } catch (err) {
    resultDiv.textContent = "요청 실패: " + err.message;
  }
}
