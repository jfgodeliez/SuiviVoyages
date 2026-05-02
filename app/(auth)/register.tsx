import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { FormField } from '../../src/components/FormField';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useRegisterForm } from '../../src/hooks/useAuthForm';
import { signUp } from '../../src/services/authService';

export default function RegisterScreen() {
  const { form, errors, setField, validate } = useRegisterForm();
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp(form.email, form.password, form.displayName);
      Alert.alert('Inscription réussie', 'Vérifiez votre email pour confirmer votre compte.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Inscription impossible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>✈️ SuiviVoyages</Text>
        <Text style={styles.title}>Créer un compte</Text>

        <FormField
          label="Nom affiché"
          value={form.displayName}
          onChangeText={(v) => setField('displayName', v)}
          error={errors.displayName}
          placeholder="Marie Dupont"
          autoCapitalize="words"
        />
        <FormField
          label="Email"
          value={form.email}
          onChangeText={(v) => setField('email', v)}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="votre@email.com"
        />
        <FormField
          label="Mot de passe"
          value={form.password}
          onChangeText={(v) => setField('password', v)}
          error={errors.password}
          secureTextEntry
          placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre"
        />
        <FormField
          label="Confirmer le mot de passe"
          value={form.confirmPassword}
          onChangeText={(v) => setField('confirmPassword', v)}
          error={errors.confirmPassword}
          secureTextEntry
          placeholder="••••••••"
        />

        <PrimaryButton title="S'inscrire" onPress={handleRegister} loading={loading} />

        <TouchableOpacity style={styles.loginRow} onPress={() => router.back()}>
          <Text style={styles.loginText}>
            Déjà un compte ? <Text style={styles.link}>Se connecter</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { flexGrow: 1, padding: 28, justifyContent: 'center' },
  logo: { fontSize: 28, fontWeight: '800', color: '#1a73e8', textAlign: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', textAlign: 'center', marginBottom: 28 },
  link: { color: '#1a73e8', fontWeight: '600', fontSize: 14 },
  loginRow: { marginTop: 24, alignItems: 'center' },
  loginText: { fontSize: 14, color: '#555' },
});
