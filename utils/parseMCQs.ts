import { Question } from '../types';

export const parseMCQs = (text: string): Question[] => {
  const questions: Question[] = [];
  // Split by one or more empty lines, robustly handling different line endings
  const questionBlocks = text.trim().split(/(?:\r\n|\r|\n){2,}/);

  questionBlocks.forEach(block => {
    const lines = block.trim().split(/\r\n|\r|\n/).filter(line => line.trim() !== '');
    if (lines.length < 3) return; // Need at least question, one option, and an answer

    const questionLines: string[] = [];
    const options: { key: string; text: string }[] = [];
    let correctAnswer: string | null = null;
    let answerLineIndex = -1;

    // First pass: find the answer to exclude it from question/option parsing
    const answerRegex = /\b(?:answer|ans|correct|solution)\b[\s:is]*\(?([a-zA-Z])\)?/i;
    
    lines.forEach((line, index) => {
        if (correctAnswer) return; // Find only the first answer line
        const answerMatch = line.match(answerRegex);
        if (answerMatch && answerMatch[1]) {
            correctAnswer = answerMatch[1].toLowerCase();
            answerLineIndex = index;
        }
    });

    // Second pass: parse questions and options
    const optionRegex = /^\s*[(]?([a-zA-Z])[.)-]\s+(.*)/;

    lines.forEach((line, index) => {
        if (index === answerLineIndex) return;

        const optionMatch = line.trim().match(optionRegex);
        if (optionMatch) {
            options.push({ key: optionMatch[1].toLowerCase(), text: optionMatch[2].trim() });
        } else {
            questionLines.push(line.trim());
        }
    });

    // Join with newline for multi-line questions and clean up leading question numbers
    const questionText = questionLines.join('\n').trim().replace(/^\d+[.)-]?\s*/, '');

    if (
        questionText && 
        options.length > 0 && 
        correctAnswer &&
        options.some(opt => opt.key === correctAnswer) // Validate that the answer key is one of the options
    ) {
      questions.push({
        question: questionText,
        options,
        correct: correctAnswer,
      });
    }
  });

  return questions;
};
