import { renderHook, act } from '@testing-library/react-native';
import { useLoginForm, useRegisterForm } from '../useAuthForm';

describe('useLoginForm', () => {
  it('initialise avec des champs vides', () => {
    const { result } = renderHook(() => useLoginForm());
    expect(result.current.form.email).toBe('');
    expect(result.current.form.password).toBe('');
    expect(result.current.errors).toEqual({});
  });

  it('met à jour un champ', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => result.current.setField('email', 'test@test.com'));
    expect(result.current.form.email).toBe('test@test.com');
  });

  it('invalide un email incorrect', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setField('email', 'bademail');
      result.current.setField('password', 'pass');
    });
    let valid: boolean;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid!).toBe(false);
    expect(result.current.errors.email).toBeTruthy();
  });

  it('valide un formulaire correct', () => {
    const { result } = renderHook(() => useLoginForm());
    act(() => {
      result.current.setField('email', 'user@example.com');
      result.current.setField('password', 'password123');
    });
    let valid: boolean;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid!).toBe(true);
    expect(result.current.errors).toEqual({});
  });
});

describe('useRegisterForm', () => {
  it('rejette des mots de passe non correspondants', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => {
      result.current.setField('displayName', 'Test User');
      result.current.setField('email', 'user@example.com');
      result.current.setField('password', 'Password1');
      result.current.setField('confirmPassword', 'Password2');
    });
    let valid: boolean;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid!).toBe(false);
    expect(result.current.errors.confirmPassword).toContain('correspondent');
  });

  it('valide un formulaire complet et correct', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => {
      result.current.setField('displayName', 'Marie Dupont');
      result.current.setField('email', 'marie@example.com');
      result.current.setField('password', 'Secure1Pass');
      result.current.setField('confirmPassword', 'Secure1Pass');
    });
    let valid: boolean;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid!).toBe(true);
  });

  it('rejette un nom vide', () => {
    const { result } = renderHook(() => useRegisterForm());
    act(() => {
      result.current.setField('displayName', '');
      result.current.setField('email', 'user@example.com');
      result.current.setField('password', 'Password1');
      result.current.setField('confirmPassword', 'Password1');
    });
    let valid: boolean;
    act(() => {
      valid = result.current.validate();
    });
    expect(valid!).toBe(false);
    expect(result.current.errors.displayName).toBeTruthy();
  });
});
