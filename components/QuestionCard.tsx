import React from 'react';
import { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  showAnswer: boolean;
  userAnswer?: string;
  onSelectAnswer: (answer: string) => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, questionNumber, showAnswer, userAnswer, onSelectAnswer }) => {

  const getOptionClassName = (optionKey: string) => {
    if (!showAnswer) {
      return 'text-gray-300 hover:bg-white/5';
    }
    const isCorrect = optionKey === question.correct;
    const isUserChoice = optionKey === userAnswer;

    if (isCorrect) {
      return 'text-green-400 font-bold bg-green-500/10';
    }
    if (isUserChoice && !isCorrect) {
      return 'text-red-400 line-through bg-red-500/10';
    }
    return 'text-gray-500';
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-xl">
        <span className="accent-text mr-2">Q{questionNumber}:</span>
        {question.question}
      </h3>
      <div className="space-y-2 pl-4 text-base">
        {question.options.map(option => (
          <div 
            key={option.key} 
            onClick={() => !showAnswer && onSelectAnswer(option.key)}
            className={`transition-all duration-300 p-2 rounded-md ${getOptionClassName(option.key)} ${!showAnswer ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <span className="font-bold mr-2">{option.key})</span>
            {option.text}
          </div>
        ))}
      </div>
      {showAnswer && (
        <div className="pt-2 mt-4 border-t border-white/10">
            <p className="text-sm font-bold">Correct Answer: <span className="text-green-400">{question.correct.toUpperCase()}) {question.options.find(o => o.key === question.correct)?.text}</span></p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;