import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { quizQuestions } from '../data/electionData';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, ...rest }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Firebase db
vi.mock('../firebase/db', () => ({
  saveScore: vi.fn().mockResolvedValue({ id: 'mock-doc-id' }),
  trackPersonaSelected: vi.fn(),
  trackJourneyStarted: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock Leaderboard to avoid Firestore calls in unit tests
vi.mock('../components/Leaderboard', () => ({
  default: () => <div data-testid="leaderboard">Leaderboard</div>,
}));

import Quiz from '../pages/Quiz';

const renderQuiz = () =>
  render(
    <MemoryRouter>
      <Quiz />
    </MemoryRouter>
  );

const answerAllQuestions = async () => {
  for (let i = 0; i < quizQuestions.length; i++) {
    const buttons = screen.getAllByRole('button').filter(btn =>
      quizQuestions[i].options.includes(btn.textContent)
    );
    await act(async () => {
      fireEvent.click(buttons[0]);
      await new Promise(resolve => setTimeout(resolve, 1300));
    });
  }
};

describe('Quiz component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('selectedPersona', 'voter');
  });

  it('renders the first question on mount', () => {
    renderQuiz();
    expect(screen.getByText(quizQuestions[0].question)).toBeInTheDocument();
  });

  it('shows correct question counter', () => {
    renderQuiz();
    expect(screen.getByText(`Question 1 of ${quizQuestions.length}`)).toBeInTheDocument();
  });

  it('renders all 4 answer options for the first question', () => {
    renderQuiz();
    quizQuestions[0].options.forEach(opt => {
      expect(screen.getByText(opt)).toBeInTheDocument();
    });
  });

  it('disables all answer buttons after selection', async () => {
    renderQuiz();
    const answerButtons = screen.getAllByRole('button').filter(btn =>
      quizQuestions[0].options.includes(btn.textContent)
    );
    await act(async () => {
      fireEvent.click(answerButtons[0]);
    });
    answerButtons.forEach(btn => expect(btn).toBeDisabled());
  });

  it('answer buttons have aria-pressed=false initially', () => {
    renderQuiz();
    const buttons = screen.getAllByRole('button').filter(btn =>
      quizQuestions[0].options.includes(btn.textContent)
    );
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('has an aria-live region for screen reader feedback', () => {
    renderQuiz();
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).toBeInTheDocument();
  });

  it('shows score screen after all questions are answered', async () => {
    renderQuiz();
    await answerAllQuestions();
    await waitFor(() => {
      expect(screen.getByText('Assessment Complete')).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 30000);

  it('saves score to localStorage after completion', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    renderQuiz();
    await answerAllQuestions();
    await waitFor(() => {
      expect(setItemSpy).toHaveBeenCalledWith('voterIQ', expect.any(String));
    }, { timeout: 5000 });
  }, 30000);

  it('renders Retake and Return Home buttons on score screen', async () => {
    renderQuiz();
    await answerAllQuestions();
    await waitFor(() => {
      expect(screen.getByText(/Retake/i)).toBeInTheDocument();
      expect(screen.getByText(/Return Home/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  }, 30000);
});
