import { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/validators';

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

export function useLoginForm() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  const setField = (field: keyof LoginForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<LoginForm> = {};
    if (!validateEmail(form.email)) newErrors.email = 'Adresse email invalide.';
    if (!form.password) newErrors.password = 'Le mot de passe est requis.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, setField, validate };
}

export function useRegisterForm() {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [errors, setErrors] = useState<Partial<RegisterForm>>({});

  const setField = (field: keyof RegisterForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};
    if (!form.displayName.trim()) newErrors.displayName = 'Le nom est requis.';
    if (!validateEmail(form.email)) newErrors.email = 'Adresse email invalide.';
    const pwdError = validatePassword(form.password);
    if (pwdError) newErrors.password = pwdError;
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { form, errors, setField, validate };
}
