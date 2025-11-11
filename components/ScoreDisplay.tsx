
import React, { useState, useEffect } from 'react';
import { Score } from '../types';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from './icons';

interface ScoreDisplayProps {
  score: Score;
  currentIndex: number;
  total: number;
  startTime: number | null;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, currentIndex, total, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) return;
    
    const timer = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div className="flex justify-between items-center text-sm uppercase tracking-widest border-b border-white/10 pb-2">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 text-green-400 font-bold">
          <CheckCircleIcon className="w-4 h-4" /> {score.correct}
        </span>
        <span className="flex items-center gap-1 text-red-400 font-bold">
          <XCircleIcon className="w-4 h-4" /> {score.wrong}
        </span>
        <span>
          {currentIndex + 1} / {total}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className="w-4 h-4" />
        <span>{formatTime(elapsedTime)}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;
