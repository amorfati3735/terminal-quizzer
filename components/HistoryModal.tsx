import React from 'react';
import { WrongAnswer } from '../types';
import { XCircleIcon } from './icons';

interface HistoryModalProps {
  wrongAnswers: WrongAnswer[];
  onClose: () => void;
  onExport: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ wrongAnswers, onClose, onExport }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#111]/80 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col p-6 accent-shadow" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold accent-text">Review Incorrect Answers</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
            <XCircleIcon className="w-6 h-6 text-gray-400" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
          {wrongAnswers.map((item, index) => {
            const userAnswerText = item.options.find(opt => opt.key === item.userAnswer)?.text;
            const correctText = item.options.find(opt => opt.key === item.correct)?.text;
            return (
              <div key={index} className="bg-black/30 p-4 rounded-lg border border-white/5">
                <p className="font-bold">{index + 1}. {item.question}</p>
                <div className="pl-4 mt-2 space-y-1 text-sm">
                  {item.options.map(opt => (
                     <p key={opt.key} className={
                       opt.key === item.correct 
                         ? 'text-green-400' 
                         : opt.key === item.userAnswer 
                         ? 'text-red-400 line-through' 
                         : 'text-gray-400'
                     }>
                       <span className="font-mono font-bold">{opt.key})</span> {opt.text}
                     </p>
                  ))}
                </div>
                <div className="mt-3 text-xs border-t border-white/10 pt-3 flex flex-col gap-1">
                   <p><span className="font-bold text-red-400 w-24 inline-block">Your answer:</span> {item.userAnswer.toUpperCase()}) {userAnswerText}</p>
                   <p><span className="font-bold text-green-400 w-24 inline-block">Correct answer:</span> {item.correct.toUpperCase()}) {correctText}</p>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-6 pt-6 border-t border-white/10">
          <button onClick={onExport} className="w-full accent-bg text-black font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
            Export to Markdown
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
