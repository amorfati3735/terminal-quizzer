import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import { useQuiz } from './hooks/useQuiz';
import ParserPanel from './components/ParserPanel';
import QuizTerminal from './components/QuizTerminal';
import ThemeToggle from './components/ThemeToggle';
import { HistoryIcon, ShuffleIcon, GithubIcon, WebsiteIcon } from './components/icons';
import HistoryModal from './components/HistoryModal';
import { exportWrongAnswersToMarkdown } from './utils/export';

export default function App() {
  const { cycleTheme } = useTheme();
  const quiz = useQuiz();
  const [showHistory, setShowHistory] = useState(false);
  const [shuffledMessageVisible, setShuffledMessageVisible] = useState(false);

  const handleShuffle = () => {
    quiz.randomizeQuestions();
    setShuffledMessageVisible(true);
    setTimeout(() => setShuffledMessageVisible(false), 2000);
  };

  const renderContent = () => {
    switch (quiz.status) {
      case 'PARSING':
      case 'READY':
        return <ParserPanel quiz={quiz} />;
      case 'ACTIVE':
      case 'FINISHED':
        return <QuizTerminal quiz={quiz} />;
      default:
        return <ParserPanel quiz={quiz} />;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 selection:text-black accent-text" style={{'--selection-bg': 'var(--accent-color)'} as React.CSSProperties}>
      <header className="fixed top-4 w-full max-w-5xl z-10 px-4">
        <div className="w-full backdrop-blur-md rounded-full border border-white/10 flex justify-between items-center p-2 accent-shadow">
          <div className="flex items-center gap-4">
            <div 
              className="flex items-center gap-2 text-lg font-mono cursor-pointer pl-2"
              onClick={quiz.resetQuiz}
              aria-label="Go to homepage"
            >
              <h1 className="font-bold">
                <span className="accent-text">&gt;_</span>terminal quiz
              </h1>
            </div>
            <div className="flex items-center gap-1 border-l border-white/20 pl-3">
              {quiz.status === 'FINISHED' && quiz.wrongAnswers.length > 0 && (
                <button onClick={() => setShowHistory(true)} className="p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Show wrong answers">
                  <HistoryIcon className="w-5 h-5" />
                </button>
              )}
              {quiz.status === 'READY' && (
                <button onClick={handleShuffle} className="p-1.5 rounded-full hover:bg-white/10 transition-colors" aria-label="Shuffle questions">
                  <ShuffleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
             <a href="https://github.com/amorfati3735" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="GitHub Profile">
                <GithubIcon className="w-5 h-5" />
             </a>
             <a href="https://pratikv3.vercel.app/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Portfolio Website">
                <WebsiteIcon className="w-5 h-5" />
             </a>
            <ThemeToggle cycleTheme={cycleTheme} />
          </div>
        </div>
      </header>
      
      {shuffledMessageVisible && (
        <div className="absolute top-24 bg-green-500/20 border border-green-500 text-green-300 text-xs px-3 py-1 rounded-full z-20">
          Questions shuffled
        </div>
      )}

      <main className="w-full max-w-5xl mt-20">
        <div className="backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 min-h-[70vh] flex flex-col accent-shadow transition-shadow duration-500">
          {renderContent()}
        </div>
      </main>
      
      {showHistory && quiz.wrongAnswers.length > 0 && (
        <HistoryModal
          wrongAnswers={quiz.wrongAnswers}
          onClose={() => setShowHistory(false)}
          onExport={() => exportWrongAnswersToMarkdown(quiz.wrongAnswers)}
        />
      )}

      <footer className="w-full max-w-4xl p-4 absolute bottom-0 flex justify-between items-center text-xs text-gray-500">
        <p>Created for a fast af quiz experience. Employs active recall.</p>
        <p className="font-spectral">@2025 pratik.</p>
      </footer>
    </div>
  );
}