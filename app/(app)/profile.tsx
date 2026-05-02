import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';
import { signOut, updateProfile } from '../../src/services/authService';
import { FormField } from '../../src/components/FormField';
import { PrimaryButton } from '../../src/components/PrimaryButton';

export default function ProfileScreen() {
  const { user, profile, isLoading, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSave = async () => {
    if (!user || !displayName.trim()) return;
    setSaving(true);
    try {
      await updateProfile(user.id, { displayName: displayName.trim() });
      await refreshProfile();
      Alert.alert('Succès', 'Profil mis à jour.');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Mise à jour impossible.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnecter',
        style: 'destructive',
        onPress: async () => {
          setSigningOut(true);
          try {
            await signOut();
            router.replace('/(auth)/login');
          } catch (err: unknown) {
            Alert.alert('Erreur', err instanceof Error ? err.message : 'Déconnexion impossible.');
            setSigningOut(false);
          }
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(profile?.displayName ?? user?.email ?? '?')[0].toUpperCase()}
        </Text>
      </View>

      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>
          {profile?.role === 'admin' ? 'Administrateur' : 'Membre'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations</Text>
        <FormField
          label="Nom affiché"
          value={displayName}
          onChangeText={setDisplayName}
          autoCapitalize="words"
          placeholder="Votre nom"
        />
        <PrimaryButton title="Enregistrer" onPress={handleSave} loading={saving} />
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut} disabled={signingOut}>
        {signingOut ? (
          <ActivityIndicator color="#e53e3e" />
        ) : (
          <Text style={styles.signOutText}>Se déconnecter</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 24, alignItems: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: '#fff' },
  email: { fontSize: 15, color: '#555', marginBottom: 8 },
  roleBadge: {
    backgroundColor: '#e8f0fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 28,
  },
  roleText: { fontSize: 13, color: '#1a73e8', fontWeight: '600' },
  section: { width: '100%', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: 16 },
  signOutButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e53e3e',
  },
  signOutText: { color: '#e53e3e', fontWeight: '700', fontSize: 15 },
});
