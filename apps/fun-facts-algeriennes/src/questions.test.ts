import { describe, expect, it } from 'vitest';
import questions from '../public/questions.json';

describe('FUN FACTS Algériennes question bank', () => {
  it('contains questions and game meta', () => {
    expect(Array.isArray(questions.questions)).toBe(true);
    expect(questions.questions.length).toBeGreaterThan(0);
    expect(questions.meta.questionsPerGame).toBeGreaterThan(0);
    expect(questions.meta.passThreshold).toBeGreaterThan(0);
  });

  it('gives every question a statement and a boolean answer', () => {
    for (const question of questions.questions) {
      expect(typeof question.statement).toBe('string');
      expect(question.statement.length).toBeGreaterThan(0);
      expect(typeof question.isTrue).toBe('boolean');
    }
  });
});
