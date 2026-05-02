import { validateEmail, validatePassword } from '../../utils/validators';

describe('validateEmail', () => {
  it('accepte une adresse email valide', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@domain.co')).toBe(true);
  });

  it('rejette une adresse email invalide', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@nodomain.com')).toBe(false);
    expect(validateEmail('missing@')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('retourne null pour un mot de passe valide', () => {
    expect(validatePassword('Secure1!')).toBeNull();
    expect(validatePassword('MonMotDePasse1')).toBeNull();
  });

  it('rejette un mot de passe trop court', () => {
    const msg = validatePassword('Ab1');
    expect(msg).toContain('8 caractères');
  });

  it('rejette un mot de passe sans majuscule', () => {
    const msg = validatePassword('password1');
    expect(msg).toContain('majuscule');
  });

  it('rejette un mot de passe sans chiffre', () => {
    const msg = validatePassword('PasswordOnly');
    expect(msg).toContain('chiffre');
  });
});
