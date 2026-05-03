import { validateActivityForm, isActivityFormValid, ACTIVITY_TYPES } from '../activityValidators';
import type { ActivityFormValues } from '../activityValidators';

const tripStart = new Date('2025-06-01T00:00:00');
const tripEnd = new Date('2025-06-10T00:00:00');

function makeValues(overrides: Partial<ActivityFormValues> = {}): ActivityFormValues {
  return {
    title: 'Visite du Louvre',
    type: 'visite',
    date: new Date('2025-06-03T00:00:00'),
    time: '',
    location: '',
    notes: '',
    ...overrides,
  };
}

describe('validateActivityForm', () => {
  it('returns no errors for valid input', () => {
    expect(validateActivityForm(makeValues(), tripStart, tripEnd)).toEqual({});
  });

  it('requires title', () => {
    const errs = validateActivityForm(makeValues({ title: '' }), tripStart, tripEnd);
    expect(errs.title).toBeDefined();
  });

  it('rejects title > 100 chars', () => {
    const errs = validateActivityForm(makeValues({ title: 'A'.repeat(101) }), tripStart, tripEnd);
    expect(errs.title).toBeDefined();
  });

  it('requires type', () => {
    const errs = validateActivityForm(makeValues({ type: null }), tripStart, tripEnd);
    expect(errs.type).toBeDefined();
  });

  it('requires date', () => {
    const errs = validateActivityForm(makeValues({ date: null }), tripStart, tripEnd);
    expect(errs.date).toBeDefined();
  });

  it('rejects date before trip start', () => {
    const errs = validateActivityForm(
      makeValues({ date: new Date('2025-05-31T00:00:00') }),
      tripStart,
      tripEnd
    );
    expect(errs.date).toBeDefined();
  });

  it('rejects date after trip end', () => {
    const errs = validateActivityForm(
      makeValues({ date: new Date('2025-06-11T00:00:00') }),
      tripStart,
      tripEnd
    );
    expect(errs.date).toBeDefined();
  });

  it('accepts date on trip start', () => {
    const errs = validateActivityForm(makeValues({ date: tripStart }), tripStart, tripEnd);
    expect(errs.date).toBeUndefined();
  });

  it('accepts date on trip end', () => {
    const errs = validateActivityForm(makeValues({ date: tripEnd }), tripStart, tripEnd);
    expect(errs.date).toBeUndefined();
  });

  it('rejects invalid time format', () => {
    const errs = validateActivityForm(makeValues({ time: '9:3' }), tripStart, tripEnd);
    expect(errs.time).toBeDefined();
  });

  it('accepts valid time format', () => {
    const errs = validateActivityForm(makeValues({ time: '09:30' }), tripStart, tripEnd);
    expect(errs.time).toBeUndefined();
  });

  it('rejects location > 200 chars', () => {
    const errs = validateActivityForm(
      makeValues({ location: 'A'.repeat(201) }),
      tripStart,
      tripEnd
    );
    expect(errs.location).toBeDefined();
  });

  it('rejects notes > 1000 chars', () => {
    const errs = validateActivityForm(makeValues({ notes: 'A'.repeat(1001) }), tripStart, tripEnd);
    expect(errs.notes).toBeDefined();
  });

  it('works without trip bounds', () => {
    const errs = validateActivityForm(makeValues({ date: new Date('2020-01-01') }));
    expect(errs.date).toBeUndefined();
  });
});

describe('isActivityFormValid', () => {
  it('returns true for valid values', () => {
    expect(isActivityFormValid(makeValues(), tripStart, tripEnd)).toBe(true);
  });

  it('returns false when title is missing', () => {
    expect(isActivityFormValid(makeValues({ title: '' }), tripStart, tripEnd)).toBe(false);
  });
});

describe('ACTIVITY_TYPES', () => {
  it('has 5 entries', () => {
    expect(ACTIVITY_TYPES).toHaveLength(5);
  });

  it('includes all expected types', () => {
    const values = ACTIVITY_TYPES.map((t) => t.value);
    expect(values).toContain('visite');
    expect(values).toContain('repas');
    expect(values).toContain('rendez_vous');
  });
});
