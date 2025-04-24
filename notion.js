const axios = require('axios');
require('dotenv').config();

const notion = axios.create({
  baseURL: 'https://api.notion.com/v1/',
  headers: {
    'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
  }
});

async function fetchTodayEntry() {
  const today = new Date().toISOString().split('T')[0];
  const dbId = process.env.NOTION_DB_ID;

  const response = await notion.post(`/databases/${dbId}/query`, {
    filter: {
      property: '날짜',
      date: {
        equals: '2025-04-24'
      }
    }
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.NOTION_SECRET}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json'
    }
  })
  .catch(e => e.response.data);

  const page = response.data.results[0];
  if (!page) throw new Error('오늘 기록이 없습니다');

  const props = page.properties;
  return {
    pageId: page.id,
    mood: props['감정 상태']?.multi_select?.map(v => v.name).join(', ') || '',
    body: props['신체 상태']?.multi_select?.map(v => v.name).join(', ') || '',
    distraction: props['방해 요인']?.rich_text?.[0]?.plain_text || '',
    coping: props['대처 방법']?.rich_text?.[0]?.plain_text || '',
    goal: props['오늘의 목표']?.rich_text?.[0]?.plain_text || '',
    routineSuccess: props['실행 루틴 성공 여부']?.select?.name || '',
    highlight: props['잘한 점']?.rich_text?.[0]?.plain_text || '',
    regret: props['아쉬운 점']?.rich_text?.[0]?.plain_text || '',
    takeaway: props['배운 점']?.rich_text?.[0]?.plain_text || '',
    tomorrowPlan: props['내일 계획']?.rich_text?.[0]?.plain_text || ''
  };
}

async function updateFeedback(pageId, feedbackText) {
  return await notion.patch(`/pages/${pageId}`, {
    properties: {
      'GPT 피드백': {
        rich_text: [{
          text: { content: feedbackText }
        }]
      }
    }
  });
}

async function appendGptFeedbackToPage(pageId, feedbackText) {
  return await notion.patch(`/blocks/${pageId}/children`, {
    children: [
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `📌 GPT 피드백\n${feedbackText}`
              }
            }
          ]
        }
      }
    ]
  })
  .catch(e => console.error('appendGptFeedbackToPage error: ', e.response?.data || e.message));
}


module.exports = { fetchTodayEntry, updateFeedback, appendGptFeedbackToPage };