import { useState, useEffect, useCallback } from 'react';
import { Question, QuizStatus, Score, WrongAnswer } from '../types';
import { parseMCQs } from '../utils/parseMCQs';

export const useQuiz = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<QuizStatus>('PARSING');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState<Score>({ correct: 0, wrong: 0 });
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  useEffect(() => {
    try {
      const savedQuestions = localStorage.getItem('termquiz-questions');
      if (savedQuestions) {
        const parsed = JSON.parse(savedQuestions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed);
          setStatus('READY');
        }
      }
    } catch (error) {
      console.error("Failed to load questions from localStorage", error);
      localStorage.removeItem('termquiz-questions');
    }
  }, []);

  const handleParse = useCallback((text: string) => {
    const parsedQuestions = parseMCQs(text);
    if (parsedQuestions.length > 0) {
      setQuestions(parsedQuestions);
      localStorage.setItem('termquiz-questions', JSON.stringify(parsedQuestions));
      setStatus('READY');
      return parsedQuestions.length;
    }
    return 0;
  }, []);
  
  const startQuiz = useCallback(() => {
    if (questions.length > 0) {
      setCurrentQuestionIndex(0);
      setScore({ correct: 0, wrong: 0 });
      setUserAnswers([]);
      setWrongAnswers([]);
      setStartTime(Date.now());
      setEndTime(null);
      setStatus('ACTIVE');
    }
  }, [questions.length]);

  const submitAnswer = useCallback((answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correct === answer;
    
    setUserAnswers(prev => [...prev, answer]);
    
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      wrong: !isCorrect ? prev.wrong + 1 : prev.wrong,
    }));

    if (!isCorrect) {
      setWrongAnswers(prev => [...prev, { ...currentQuestion, userAnswer: answer }]);
    }
  }, [currentQuestionIndex, questions]);
  
  const nextQuestion = useCallback(() => {
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
      } else {
          setEndTime(Date.now());
          setStatus('FINISHED');
      }
  }, [currentQuestionIndex, questions.length]);

  const resetQuiz = useCallback(() => {
    setQuestions([]);
    localStorage.removeItem('termquiz-questions');
    setStatus('PARSING');
    setCurrentQuestionIndex(0);
    setScore({ correct: 0, wrong: 0 });
    setUserAnswers([]);
    setWrongAnswers([]);
    setStartTime(null);
    setEndTime(null);
  }, []);

  const randomizeQuestions = useCallback(() => {
    setQuestions(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      localStorage.setItem('termquiz-questions', JSON.stringify(shuffled));
      return shuffled;
    });
  }, []);

  return {
    questions,
    status,
    currentQuestionIndex,
    score,
    userAnswers,
    wrongAnswers,
    startTime,
    endTime,
    handleParse,
    startQuiz,
    submitAnswer,
    nextQuestion,
    resetQuiz,
    randomizeQuestions,
  };
};
