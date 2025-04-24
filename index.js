const { fetchTodayEntry, updateFeedback, appendGptFeedbackToPage } = require('./notion');
const { askGpt } = require('./gpt');

(async () => {
  try {
    console.log('start')
    const entry = await fetchTodayEntry();
    console.log('오늘 일지:', entry);

    const feedback = 
      await askGpt(entry);
      // 'GPT sample result';
    console.log('GPT 피드백:', feedback);

    // await updateFeedback(entry.pageId, feedback);
    await appendGptFeedbackToPage(entry.pageId, feedback);
    console.log('📌 Notion에 피드백 저장 완료!');
  } catch (err) {
    console.error('에러:', err.message);
  }
})();
