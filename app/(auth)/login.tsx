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
import { useLoginForm } from '../../src/hooks/useAuthForm';
import { signIn } from '../../src/services/authService';

export default function LoginScreen() {
  const { form, errors, setField, validate } = useLoginForm();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signIn(form.email, form.password);
      router.replace('/(app)/trips');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Connexion impossible.');
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
        <Text style={styles.title}>Connexion</Text>

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
          placeholder="••••••••"
        />

        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
          <Text style={styles.link}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Se connecter" onPress={handleLogin} loading={loading} />

        <TouchableOpacity
          style={styles.registerRow}
          onPress={() => router.push('/(auth)/register')}
        >
          <Text style={styles.registerText}>
            Pas encore de compte ? <Text style={styles.link}>S&apos;inscrire</Text>
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
  registerRow: { marginTop: 24, alignItems: 'center' },
  registerText: { fontSize: 14, color: '#555' },
});
