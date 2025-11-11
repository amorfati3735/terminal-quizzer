import { WrongAnswer } from '../types';

export const exportWrongAnswersToMarkdown = (wrongAnswers: WrongAnswer[]) => {
  if (wrongAnswers.length === 0) return;

  const markdownContent = wrongAnswers.map((item, index) => {
    const optionsString = item.options.map(opt => `- ${opt.key}) ${opt.text}`).join('\n');
    const correctOption = item.options.find(opt => opt.key === item.correct);
    const userAnswerOption = item.options.find(opt => opt.key === item.userAnswer);
    
    return `
## Question: ${item.question}

${optionsString}

**Your Answer:** ${item.userAnswer.toUpperCase()}) ${userAnswerOption?.text || ''} (Incorrect)
**Correct Answer:** ${item.correct.toUpperCase()}) ${correctOption?.text || ''}
    `.trim();
  }).join('\n\n---\n\n');

  const blob = new Blob([`# TermQuiz Review\n\n${markdownContent}`], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'termquiz-review.md';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
