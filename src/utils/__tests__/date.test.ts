import { formatDate, formatDateRange, daysBetween, isDateInRange } from '../date';

describe('formatDate', () => {
  it('formate une date en français', () => {
    const date = new Date(2025, 5, 15);
    expect(formatDate(date)).toBe('15/06/2025');
  });
});

describe('formatDateRange', () => {
  it('formate un intervalle de dates', () => {
    const start = new Date(2025, 5, 15);
    const end = new Date(2025, 5, 25);
    const result = formatDateRange(start, end);
    expect(result).toContain('15/06/2025');
    expect(result).toContain('25/06/2025');
  });
});

describe('daysBetween', () => {
  it('calcule le nombre de jours entre deux dates', () => {
    const start = new Date(2025, 5, 15);
    const end = new Date(2025, 5, 20);
    expect(daysBetween(start, end)).toBe(5);
  });

  it('retourne 0 pour la même date', () => {
    const date = new Date(2025, 5, 15);
    expect(daysBetween(date, date)).toBe(0);
  });

  it('retourne 1 pour un jour de différence', () => {
    const start = new Date(2025, 5, 15);
    const end = new Date(2025, 5, 16);
    expect(daysBetween(start, end)).toBe(1);
  });
});

describe('isDateInRange', () => {
  it('retourne true pour une date dans la plage', () => {
    const start = new Date(2025, 5, 10);
    const end = new Date(2025, 5, 20);
    const date = new Date(2025, 5, 15);
    expect(isDateInRange(date, start, end)).toBe(true);
  });

  it('retourne true pour une date égale au début', () => {
    const start = new Date(2025, 5, 10);
    const end = new Date(2025, 5, 20);
    expect(isDateInRange(start, start, end)).toBe(true);
  });

  it('retourne true pour une date égale à la fin', () => {
    const start = new Date(2025, 5, 10);
    const end = new Date(2025, 5, 20);
    expect(isDateInRange(end, start, end)).toBe(true);
  });

  it('retourne false pour une date hors plage', () => {
    const start = new Date(2025, 5, 10);
    const end = new Date(2025, 5, 20);
    const date = new Date(2025, 5, 25);
    expect(isDateInRange(date, start, end)).toBe(false);
  });
});
