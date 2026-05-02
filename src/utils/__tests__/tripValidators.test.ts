import { validateTripForm, isTripFormValid } from '../tripValidators';

const base = {
  title: 'Vacances à Paris',
  description: '',
  startDate: new Date('2025-06-01'),
  endDate: new Date('2025-06-10'),
};

describe('validateTripForm', () => {
  it('retourne aucune erreur pour des valeurs valides', () => {
    expect(validateTripForm(base)).toEqual({});
  });

  it('exige un titre non vide', () => {
    const errors = validateTripForm({ ...base, title: '   ' });
    expect(errors.title).toBeTruthy();
  });

  it('limite le titre à 100 caractères', () => {
    const errors = validateTripForm({ ...base, title: 'a'.repeat(101) });
    expect(errors.title).toContain('100');
  });

  it('exige une date de début', () => {
    const errors = validateTripForm({ ...base, startDate: null });
    expect(errors.startDate).toBeTruthy();
  });

  it('exige une date de fin', () => {
    const errors = validateTripForm({ ...base, endDate: null });
    expect(errors.endDate).toBeTruthy();
  });

  it('rejette une date de fin antérieure à la date de début', () => {
    const errors = validateTripForm({
      ...base,
      startDate: new Date('2025-06-10'),
      endDate: new Date('2025-06-01'),
    });
    expect(errors.endDate).toContain('après');
  });

  it("accepte dates identiques (voyage d'un jour)", () => {
    const same = new Date('2025-06-15');
    const errors = validateTripForm({ ...base, startDate: same, endDate: same });
    expect(errors.endDate).toBeUndefined();
  });

  it('limite la description à 500 caractères', () => {
    const errors = validateTripForm({ ...base, description: 'x'.repeat(501) });
    expect(errors.description).toContain('500');
  });

  it('accepte une description vide', () => {
    const errors = validateTripForm({ ...base, description: '' });
    expect(errors.description).toBeUndefined();
  });
});

describe('isTripFormValid', () => {
  it('retourne true pour un formulaire valide', () => {
    expect(isTripFormValid(base)).toBe(true);
  });

  it('retourne false si le titre est manquant', () => {
    expect(isTripFormValid({ ...base, title: '' })).toBe(false);
  });

  it('retourne false si les dates sont invalides', () => {
    expect(
      isTripFormValid({
        ...base,
        startDate: new Date('2025-06-10'),
        endDate: new Date('2025-06-01'),
      })
    ).toBe(false);
  });
});
