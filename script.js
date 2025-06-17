async function analyze() {
  const userText = document.getElementById("userText").value.trim();
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "분석 중...";

  try {
    const response = await fetch("/api/duksungAI", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ userText })
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