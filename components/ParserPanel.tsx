import React, { useState, useEffect } from 'react';
import { useQuiz } from '../hooks/useQuiz';
import { CheckCircleIcon, ChevronDownIcon, CopyIcon, ClipboardListIcon } from './icons';

interface ParserPanelProps {
  quiz: ReturnType<typeof useQuiz>;
}

const LLM_PROMPT = `I'm studying a document and need some multiple-choice questions. Please generate [X] questions based on the text in the following format. It's crucial that each question block is separated by a single blank line.

1. What is the capital of France?
a) Berlin
b) Madrid
c) Paris
d) Rome
Answer: c

2. Which keyword is used to define a constant in JavaScript?
a) let
b) var
c) const
d) static
Answer: c`;

const LlmPromptHelper: React.FC = () => {
    const [promptCopied, setPromptCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(LLM_PROMPT);
        setPromptCopied(true);
        setTimeout(() => setPromptCopied(false), 2000);
    };

    return (
        <details className="group text-sm">
            <summary className="list-none flex items-center justify-center gap-1 cursor-pointer text-gray-500 hover:text-white transition-colors">
                <span>Need formatting help? Get an LLM prompt</span>
                <ChevronDownIcon className="w-4 h-4 transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 max-w-lg mx-auto bg-black/30 border border-white/10 p-4 rounded-lg text-left relative">
                <h4 className="font-bold mb-2 text-gray-200">AI Prompt</h4>
                <p className="text-xs text-gray-400 mb-3">Use this prompt with your favorite AI to generate compatible quizzes.</p>
                <div className="bg-black/50 p-3 rounded-md">
                    <pre className="text-xs whitespace-pre-wrap font-mono text-gray-300">{LLM_PROMPT}</pre>
                </div>
                <button onClick={handleCopy} className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 rounded-md text-gray-400 hover:text-white transition-colors">
                    {promptCopied ? <CheckCircleIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                </button>
            </div>
        </details>
    )
}

const ParserPanel: React.FC<ParserPanelProps> = ({ quiz }) => {
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (quiz.status === 'READY') {
      setFeedback(`Parsed ${quiz.questions.length} questions.`);
      setError('');
    } else {
      setFeedback('');
    }
  }, [quiz.status, quiz.questions.length]);

  useEffect(() => {
    if (quiz.status === 'READY') {
      const handleStart = (e: KeyboardEvent) => {
        // Prevent starting if user is typing in an input/textarea somewhere else
        if ((e.target as HTMLElement).tagName.toLowerCase().match(/input|textarea/)) {
          return;
        }
        quiz.startQuiz();
      };

      document.addEventListener('keydown', handleStart);
      return () => document.removeEventListener('keydown', handleStart);
    }
  }, [quiz.status, quiz.startQuiz]);

  const onParseClick = () => {
    const count = quiz.handleParse(text);
    if (count === 0) {
      setError('Could not parse. Please check format.');
      setFeedback('');
    } else {
      setError('');
    }
  };
  
  if (quiz.status === 'READY') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
        <p className="text-xl accent-text font-bold mb-6">{feedback}</p>
        <p className="text-lg text-gray-400 animate-pulse">Press any key to start</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="text-center mb-8 animate-slide-in-up" style={{ animationFillMode: 'backwards' }}>
        <ClipboardListIcon className="w-12 h-12 text-gray-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold accent-text font-mono mb-4">mcq quiz</h2>
        <LlmPromptHelper />
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Dump your mcqs here"
        className="bg-black/30 p-4 rounded-lg focus:outline-none focus:ring-2 accent-border transition-all w-full text-sm leading-relaxed resize-none min-h-[200px] font-mono animate-slide-in-up animation-delay-100"
        style={{ animationFillMode: 'backwards' }}
      />
      {error && <p className="mt-4 text-sm text-center text-red-400 animate-fade-in">{error}</p>}
      <button
        onClick={onParseClick}
        disabled={!text.trim()}
        className="w-full mt-4 accent-bg text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed animate-slide-in-up animation-delay-200"
        style={{ animationFillMode: 'backwards' }}
      >
        Parse Questions
      </button>
    </div>
  );
};

export default ParserPanel;