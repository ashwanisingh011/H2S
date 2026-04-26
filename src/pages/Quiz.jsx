import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ArrowRight, RotateCcw } from 'lucide-react';
import { quizQuestions } from '../data/electionData';
import { saveScore } from '../firebase/db';
import Leaderboard from '../components/Leaderboard';

/**
 * Quiz component handling user assessment and score submission.
 * Wrapped in React.memo to prevent unnecessary re-renders.
 */
const Quiz = memo(function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const questionRef = useRef(null);
  const liveRegionRef = useRef(null);

  // Focus question heading when question changes for screen readers
  useEffect(() => {
    if (!showScore && questionRef.current) {
      questionRef.current.focus();
    }
  }, [currentQuestion, showScore]);

  /** Memoized handler for answer selection */
  const handleAnswerClick = useCallback((index) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);

    const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    // Announce result to screen readers
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = isCorrect ? 'Correct answer!' : 'Incorrect. The correct answer is highlighted.';
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        if (liveRegionRef.current) liveRegionRef.current.textContent = '';
      } else {
        setShowScore(true);
        localStorage.setItem('voterIQ', String(newScore));
      }
    }, 1200);
  }, [currentQuestion, score, selectedAnswer]);

  /** Memoized handler for saving score to global leaderboard */
  const handleSaveScore = useCallback(async () => {
    if (saving || scoreSaved) return;
    setSaving(true);
    try {
      const persona = localStorage.getItem('selectedPersona') || 'voter';
      await saveScore(playerName || 'Anonymous', score, persona);
      setScoreSaved(true);
    } catch (e) {
      console.error('Failed to save score', e);
    } finally {
      setSaving(false);
    }
  }, [playerName, score, saving, scoreSaved]);

  /** Memoized handler to reset the quiz state */
  const resetQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setPlayerName('');
    setScoreSaved(false);
  }, []);

  /** Memoized handler to return to home */
  const goHome = useCallback(() => navigate('/'), [navigate]);

  return (
    <main id="main-content" className="min-h-screen flex items-center justify-center p-6">
      {/* ARIA live region for screen reader announcements */}
      <div
        ref={liveRegionRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="w-full max-w-2xl">
        <div className="classic-card p-10 md:p-14 rounded-lg">
          <AnimatePresence mode="wait">
            {showScore ? (
              <motion.div
                key="score"
                role="alert"
                aria-live="assertive"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <CheckCircle2 size={48} className="mx-auto text-white mb-6" strokeWidth={1} aria-hidden="true" />
                <h2 className="text-3xl font-medium mb-4 text-white">Assessment Complete</h2>
                <p className="text-xl text-[#a3a3a3] mb-8">
                  Final Score:{' '}
                  <span className="text-white font-medium" aria-label={`${score} out of ${quizQuestions.length}`}>
                    {score}/{quizQuestions.length}
                  </span>
                </p>

                {/* Save to leaderboard section */}
                {!scoreSaved ? (
                  <div className="mb-8 text-left">
                    <label htmlFor="player-name" className="block text-sm text-[#a3a3a3] mb-2">
                      Enter your name for the leaderboard (optional)
                    </label>
                    <div className="flex gap-3">
                      <input
                        id="player-name"
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Your name"
                        maxLength={30}
                        className="flex-1 bg-[#0a0a0a] border border-[#262626] text-white text-sm px-4 py-3 rounded focus:outline-none focus:border-[#404040]"
                        aria-label="Enter your name for the global leaderboard"
                      />
                      <button
                        onClick={handleSaveScore}
                        disabled={saving || scoreSaved}
                        aria-label="Submit your score to the global leaderboard"
                        className="classic-button px-4 py-3 rounded text-sm font-medium disabled:opacity-50"
                      >
                        {saving ? 'Saving…' : 'Submit'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-[#a3a3a3] mb-8" aria-live="polite">
                    ✓ Score saved to the global leaderboard!
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetQuiz}
                    aria-label="Retake the quiz from the beginning"
                    className="classic-button-secondary px-6 py-3 rounded text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={16} aria-hidden="true" /> Retake
                  </button>
                  <button
                    onClick={goHome}
                    aria-label="Return to the home page"
                    className="classic-button px-6 py-3 rounded text-sm font-medium flex items-center justify-center gap-2"
                  >
                    Return Home <ArrowRight size={16} aria-hidden="true" />
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
                  <span className="text-sm font-medium text-[#a3a3a3]">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                  </span>
                </div>

                <h2
                  ref={questionRef}
                  tabIndex={-1}
                  className="text-xl md:text-2xl font-medium mb-10 text-white leading-relaxed focus:outline-none"
                >
                  {quizQuestions[currentQuestion].question}
                </h2>

                <div role="group" aria-label="Answer options" className="space-y-3">
                  {quizQuestions[currentQuestion].options.map((option, index) => {
                    const isCorrect = index === quizQuestions[currentQuestion].correctAnswer;
                    const isSelected = index === selectedAnswer;
                    const answered = selectedAnswer !== null;

                    let buttonClass = "w-full text-left p-4 rounded border transition-all text-sm font-medium ";
                    if (!answered) {
                      buttonClass += "border-[#262626] bg-[#171717] hover:border-[#404040] text-[#f5f5f5]";
                    } else if (isCorrect) {
                      buttonClass += "border-white bg-white text-black";
                    } else if (isSelected) {
                      buttonClass += "border-[#404040] bg-[#262626] text-[#a3a3a3]";
                    } else {
                      buttonClass += "border-[#262626] bg-[#171717] opacity-40";
                    }

                    return (
                      <button
                        key={index}
                        id={`answer-${currentQuestion}-${index}`}
                        onClick={() => handleAnswerClick(index)}
                        disabled={answered}
                        aria-pressed={isSelected}
                        aria-label={`Option ${index + 1}: ${option}${answered && isCorrect ? ' — Correct answer' : answered && isSelected && !isCorrect ? ' — Incorrect' : ''}`}
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

        {/* Live leaderboard shown after score */}
        {showScore && <Leaderboard />}
      </div>
    </main>
  );
});

export default Quiz;
