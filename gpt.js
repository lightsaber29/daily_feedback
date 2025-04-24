const axios = require('axios');
require('dotenv').config();

async function askGpt(entry) {
  const prompt = `
다음은 나의 오늘 학습 및 감정 일지입니다. 아래 내용을 기반으로 피드백과 내일을 위한 조언을 부탁드립니다.

- 감정 상태: ${entry.mood}
- 신체 상태: ${entry.body}
- 방해 요인: ${entry.distraction}
- 대처 방법: ${entry.coping}
- 오늘의 목표: ${entry.goal}
- 루틴 성공 여부: ${entry.routineSuccess}
- 잘한 점: ${entry.highlight}
- 아쉬운 점: ${entry.regret}
- 배운 핵심: ${entry.takeaway}
- 내일 계획: ${entry.tomorrowPlan}

당신은 나의 습관 코치이자 감정 분석가입니다.
1. 오늘 행동에 대해 칭찬할 점, 아쉬운 점을 구체적으로 평가해주세요.
2. 내일 더 나아지기 위해 바꿀 수 있는 루틴 또는 전략을 제안해주세요.
3. 말투는 따뜻하지만 회피하지 말고 직설적으로 해주세요.
`;

  const res = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }]
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return res.data.choices[0].message.content;
}

module.exports = { askGpt };
