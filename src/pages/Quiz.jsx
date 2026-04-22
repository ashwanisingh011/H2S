import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { quizQuestions } from '../data/electionData';

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerClick = (index) => {
    setSelectedAnswer(index);
    
    if (index === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
        localStorage.setItem('voterIQ', score + (index === quizQuestions[currentQuestion].correctAnswer ? 1 : 0));
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl classic-card p-10 md:p-14 rounded-lg">
        
        <AnimatePresence mode="wait">
          {showScore ? (
            <motion.div 
              key="score"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <CheckCircle2 size={48} className="mx-auto text-white mb-6" strokeWidth={1} />
              <h2 className="text-3xl font-medium mb-4 text-white">Assessment Complete</h2>
              <p className="text-xl text-[#a3a3a3] mb-10">
                Final Score: <span className="text-white font-medium">{score}</span> / {quizQuestions.length}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={resetQuiz}
                  className="classic-button-secondary px-6 py-3 rounded text-sm font-medium flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> Retake
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="classic-button px-6 py-3 rounded text-sm font-medium flex items-center justify-center gap-2"
                >
                  Return Home <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={currentQuestion}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-8 border-b border-[#262626] pb-4 flex justify-between items-end">
                <span className="text-sm font-medium text-[#a3a3a3]">Question {currentQuestion + 1} of {quizQuestions.length}</span>
              </div>
              <h3 className="text-xl md:text-2xl font-medium mb-10 text-white leading-relaxed">
                {quizQuestions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {quizQuestions[currentQuestion].options.map((option, index) => {
                  let buttonClass = "w-full text-left p-4 rounded border transition-all text-sm font-medium ";
                  
                  if (selectedAnswer === null) {
                    buttonClass += "border-[#262626] bg-[#171717] hover:border-[#404040] text-[#f5f5f5]";
                  } else if (index === quizQuestions[currentQuestion].correctAnswer) {
                    buttonClass += "border-white bg-white text-black";
                  } else if (index === selectedAnswer) {
                    buttonClass += "border-[#404040] bg-[#262626] text-[#a3a3a3]";
                  } else {
                    buttonClass += "border-[#262626] bg-[#171717] opacity-40";
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => selectedAnswer === null && handleAnswerClick(index)}
                      disabled={selectedAnswer !== null}
                      className={buttonClass}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
