import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { personas } from '../data/electionData';
import Home from '../pages/Home';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders the main heading', () => {
    renderHome();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders all 3 persona cards', () => {
    renderHome();
    personas.forEach(p => {
      expect(screen.getByText(p.title)).toBeInTheDocument();
    });
  });

  it('renders persona descriptions', () => {
    renderHome();
    personas.forEach(p => {
      expect(screen.getByText(p.description)).toBeInTheDocument();
    });
  });

  it('persona cards are keyboard-accessible buttons', () => {
    renderHome();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(personas.length);
  });

  it('clicking a persona card saves to localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    renderHome();
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstButton);
    expect(setItemSpy).toHaveBeenCalledWith('selectedPersona', personas[0].id);
  });

  it('clicking a persona card navigates to /journey', () => {
    renderHome();
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.click(firstButton);
    expect(mockNavigate).toHaveBeenCalledWith('/journey');
  });

  it('pressing Enter on a persona card triggers selection', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    renderHome();
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.keyDown(firstButton, { key: 'Enter', code: 'Enter' });
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('pressing Space on a persona card triggers selection', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    renderHome();
    const firstButton = screen.getAllByRole('button')[0];
    fireEvent.keyDown(firstButton, { key: ' ', code: 'Space' });
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('each persona card has an accessible label', () => {
    renderHome();
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toHaveAttribute('aria-label');
    });
  });
});
