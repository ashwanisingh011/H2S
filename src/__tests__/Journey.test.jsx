import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { timelineData } from '../data/electionData';

// Mock framer-motion so whileInView elements render immediately in jsdom
vi.mock('framer-motion', () => ({
  motion: {
    li: ({ children, className, ...rest }) => <li className={className}>{children}</li>,
    div: ({ children, className, ...rest }) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock Firebase
vi.mock('../firebase/db', () => ({
  trackJourneyStarted: vi.fn(),
  saveScore: vi.fn(),
  trackPersonaSelected: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import Journey from '../pages/Journey';

const renderJourney = (persona = 'voter') => {
  localStorage.setItem('selectedPersona', persona);
  return render(
    <MemoryRouter>
      <Journey />
    </MemoryRouter>
  );
};

describe('Journey page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('redirects to / if no persona is in localStorage', () => {
    localStorage.removeItem('selectedPersona');
    render(<MemoryRouter><Journey /></MemoryRouter>);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('renders the voter journey steps correctly', () => {
    renderJourney('voter');
    timelineData.voter.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('renders the candidate journey steps correctly', () => {
    renderJourney('candidate');
    timelineData.candidate.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('renders the officer journey steps correctly', () => {
    renderJourney('officer');
    timelineData.officer.forEach(step => {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    });
  });

  it('renders a back button with accessible label', () => {
    renderJourney('voter');
    const backBtn = screen.getByRole('button', { name: /back to personas/i });
    expect(backBtn).toBeInTheDocument();
  });

  it('renders "Proceed to Quiz" button', () => {
    renderJourney('voter');
    expect(screen.getByRole('button', { name: /proceed to quiz/i })).toBeInTheDocument();
  });

  it('has a main landmark region', () => {
    renderJourney('voter');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders step descriptions for voter journey', () => {
    renderJourney('voter');
    timelineData.voter.forEach(step => {
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });
});
