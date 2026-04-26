import { describe, it, expect } from 'vitest';
import { personas, timelineData, quizQuestions } from '../data/electionData';

describe('personas data', () => {
  it('should have exactly 3 personas', () => {
    expect(personas).toHaveLength(3);
  });

  it('each persona should have all required fields', () => {
    personas.forEach(p => {
      expect(p).toHaveProperty('id');
      expect(p).toHaveProperty('title');
      expect(p).toHaveProperty('description');
      expect(p).toHaveProperty('icon');
    });
  });

  it('persona IDs should be unique', () => {
    const ids = personas.map(p => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('persona descriptions should be non-empty strings', () => {
    personas.forEach(p => {
      expect(typeof p.description).toBe('string');
      expect(p.description.length).toBeGreaterThan(0);
    });
  });

  it('should include voter, candidate, and officer personas', () => {
    const ids = personas.map(p => p.id);
    expect(ids).toContain('voter');
    expect(ids).toContain('candidate');
    expect(ids).toContain('officer');
  });
});

describe('timelineData', () => {
  it('should have data for all personas', () => {
    personas.forEach(p => {
      expect(timelineData).toHaveProperty(p.id);
      expect(Array.isArray(timelineData[p.id])).toBe(true);
    });
  });

  it('each persona should have exactly 4 timeline steps', () => {
    personas.forEach(p => {
      expect(timelineData[p.id]).toHaveLength(4);
    });
  });

  it('each step should have all required fields', () => {
    Object.values(timelineData).forEach(steps => {
      steps.forEach(step => {
        expect(step).toHaveProperty('step');
        expect(step).toHaveProperty('title');
        expect(step).toHaveProperty('description');
        expect(step).toHaveProperty('icon');
      });
    });
  });

  it('steps should be numbered sequentially starting from 1', () => {
    Object.values(timelineData).forEach(steps => {
      steps.forEach((step, index) => {
        expect(step.step).toBe(index + 1);
      });
    });
  });

  it('step titles and descriptions should be non-empty', () => {
    Object.values(timelineData).forEach(steps => {
      steps.forEach(step => {
        expect(step.title.length).toBeGreaterThan(0);
        expect(step.description.length).toBeGreaterThan(0);
      });
    });
  });
});

describe('quizQuestions', () => {
  it('should have at least 3 questions', () => {
    expect(quizQuestions.length).toBeGreaterThanOrEqual(3);
  });

  it('each question should have all required fields', () => {
    quizQuestions.forEach(q => {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('question');
      expect(q).toHaveProperty('options');
      expect(q).toHaveProperty('correctAnswer');
    });
  });

  it('each question should have exactly 4 options', () => {
    quizQuestions.forEach(q => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('correctAnswer index should be valid (0–3)', () => {
    quizQuestions.forEach(q => {
      expect(q.correctAnswer).toBeGreaterThanOrEqual(0);
      expect(q.correctAnswer).toBeLessThan(q.options.length);
    });
  });

  it('question IDs should be unique', () => {
    const ids = quizQuestions.map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('options should all be non-empty strings', () => {
    quizQuestions.forEach(q => {
      q.options.forEach(opt => {
        expect(typeof opt).toBe('string');
        expect(opt.length).toBeGreaterThan(0);
      });
    });
  });

  it('question text should be a non-empty string', () => {
    quizQuestions.forEach(q => {
      expect(typeof q.question).toBe('string');
      expect(q.question.length).toBeGreaterThan(0);
    });
  });
});
