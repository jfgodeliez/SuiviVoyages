import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { FormField } from '../../src/components/FormField';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { resetPassword } from '../../src/services/authService';
import { validateEmail } from '../../src/services/authService';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!validateEmail(email)) {
      setEmailError('Adresse email invalide.');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      await resetPassword(email);
      Alert.alert(
        'Email envoyé',
        'Vérifiez votre boîte mail pour réinitialiser votre mot de passe.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : "Impossible d'envoyer l'email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Mot de passe oublié</Text>
        <Text style={styles.subtitle}>
          Entrez votre email et nous vous enverrons un lien de réinitialisation.
        </Text>

        <FormField
          label="Email"
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            setEmailError('');
          }}
          error={emailError}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="votre@email.com"
        />

        <PrimaryButton title="Envoyer le lien" onPress={handleReset} loading={loading} />

        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <Text style={styles.link}>← Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 28, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 28, lineHeight: 20 },
  link: { color: '#1a73e8', fontWeight: '600', fontSize: 14 },
  backRow: { marginTop: 24, alignItems: 'center' },
});
