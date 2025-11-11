import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import ScoreDisplay from './ScoreDisplay';
import QuestionCard from './QuestionCard';

interface QuizTerminalProps {
  quiz: ReturnType<typeof useQuiz>;
}

const QuizTerminal: React.FC<QuizTerminalProps> = ({ quiz }) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const currentQuestion = quiz.questions[quiz.currentQuestionIndex];

  const proceedToNext = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    quiz.nextQuestion();
  }, [quiz]);
  
  const handleSelectAnswer = useCallback((answer: string) => {
      if (showAnswer || isTransitioning || !currentQuestion) return;

      const validOptions = currentQuestion.options.map(opt => opt.key);
      if (validOptions.includes(answer)) {
        setIsTransitioning(true);
        const isCorrect = currentQuestion.correct === answer;
        quiz.submitAnswer(answer);
        setShowAnswer(true);
        
        const delay = isCorrect ? 1500 : 5000;
        timeoutRef.current = setTimeout(proceedToNext, delay);
      }
  }, [showAnswer, isTransitioning, currentQuestion, quiz, proceedToNext]);


  // Reset state for each new question
  useEffect(() => {
    if (quiz.status === 'ACTIVE') {
      setShowAnswer(false);
      setIsTransitioning(false);
    }
    return () => {
      if(timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [quiz.currentQuestionIndex, quiz.status]);

  // Handle answering question with keyboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      handleSelectAnswer(e.key.toLowerCase());
    };
    
    if (quiz.status === 'ACTIVE' && !showAnswer) {
      document.addEventListener('keydown', handleKeyPress);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleSelectAnswer, quiz.status, showAnswer]);

  // Handle skipping the answer view delay
  useEffect(() => {
    const handleSkip = () => {
        proceedToNext();
    };

    if (showAnswer) {
      document.addEventListener('keydown', handleSkip);
    }

    return () => {
      document.removeEventListener('keydown', handleSkip);
    }
  }, [showAnswer, proceedToNext]);
  
  if (quiz.status === 'FINISHED') {
    const timeTaken = quiz.endTime && quiz.startTime ? Math.round((quiz.endTime - quiz.startTime) / 1000) : 0;
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    
    return (
      <div className="flex flex-col items-center justify-center h-full text-center font-mono">
        <h2 className="text-3xl font-bold accent-text mb-4">Quiz Complete</h2>
        <p className="text-xl mb-2">Final Score: {quiz.score.correct} / {quiz.questions.length}</p>
        <p className="text-lg text-gray-400 mb-8">Time Taken: {minutes}m {seconds}s</p>
        <button onClick={quiz.resetQuiz} className="accent-bg text-black font-bold py-3 px-8 rounded-lg hover:opacity-90 transition-opacity">
          Restart
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-mono">
      <ScoreDisplay score={quiz.score} currentIndex={quiz.currentQuestionIndex} total={quiz.questions.length} startTime={quiz.startTime} />
      <div className="flex-grow mt-6">
        {currentQuestion && (
            <QuestionCard 
                question={currentQuestion}
                questionNumber={quiz.currentQuestionIndex + 1}
                showAnswer={showAnswer}
                userAnswer={quiz.userAnswers[quiz.currentQuestionIndex]}
                onSelectAnswer={handleSelectAnswer}
            />
        )}
      </div>
      <div className="mt-auto pt-4 h-6">
        {!showAnswer && (
          <div className="flex items-center gap-2">
            <span className="accent-text font-bold">&gt;</span>
            <span className="text-gray-500 animate-pulse">
              Type or click your answer...
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTerminal;