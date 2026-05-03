import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';
import { validateTripForm } from '../utils/tripValidators';
import type { TripFormValues, TripFormErrors } from '../utils/tripValidators';
import { formatDate } from '../utils/date';

interface Props {
  initialValues?: Partial<TripFormValues>;
  onSubmit: (values: TripFormValues) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

function defaultStart(): Date {
  return new Date();
}

function defaultEnd(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d;
}

export function TripForm({ initialValues, onSubmit, submitLabel = 'Enregistrer', loading }: Props) {
  const [values, setValues] = useState<TripFormValues>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    startDate: initialValues?.startDate ?? defaultStart(),
    endDate: initialValues?.endDate ?? defaultEnd(),
  });
  const [errors, setErrors] = useState<TripFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const set = (field: keyof TripFormValues, value: TripFormValues[keyof TripFormValues]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    const errs = validateTripForm(values);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    try {
      await onSubmit(values);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : err && typeof err === 'object' && 'message' in err
            ? String((err as Record<string, unknown>).message)
            : JSON.stringify(err);
      setSubmitError(msg || 'Erreur inconnue');
    }
  };

  const adjustDate = (base: Date | null, days: number): Date => {
    const d = base ? new Date(base) : new Date();
    d.setDate(d.getDate() + days);
    return d;
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <View>
      <FormField
        label="Titre du voyage *"
        value={values.title}
        onChangeText={(v) => set('title', v)}
        error={errors.title}
        placeholder="Ex : Vacances en Italie"
        maxLength={100}
      />

      <Text style={styles.label}>Date de début *</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartPicker(true)}>
          <Text style={styles.dateText}>
            {values.startDate ? formatDate(values.startDate) : 'Choisir une date'}
          </Text>
        </TouchableOpacity>
        <View style={styles.dateShortcuts}>
          {[0, 1, 7].map((n) => (
            <TouchableOpacity
              key={n}
              style={styles.shortcut}
              onPress={() => set('startDate', adjustDate(null, n))}
            >
              <Text style={styles.shortcutText}>{n === 0 ? 'Auj.' : n === 1 ? 'Dem.' : '+7j'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {errors.startDate ? <Text style={styles.error}>{errors.startDate}</Text> : null}

      <Text style={styles.label}>Date de fin *</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndPicker(true)}>
          <Text style={styles.dateText}>
            {values.endDate ? formatDate(values.endDate) : 'Choisir une date'}
          </Text>
        </TouchableOpacity>
        <View style={styles.dateShortcuts}>
          {[3, 7, 14].map((n) => (
            <TouchableOpacity
              key={n}
              style={styles.shortcut}
              onPress={() => set('endDate', adjustDate(values.startDate, n))}
            >
              <Text style={styles.shortcutText}>{`+${n}j`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {errors.endDate ? <Text style={styles.error}>{errors.endDate}</Text> : null}

      {(showStartPicker || showEndPicker) && (
        <NativeDatePicker
          value={
            showStartPicker ? (values.startDate ?? new Date()) : (values.endDate ?? new Date())
          }
          minimumDate={showEndPicker ? (values.startDate ?? undefined) : undefined}
          onConfirm={(date) => {
            if (showStartPicker) set('startDate', date);
            else set('endDate', date);
            setShowStartPicker(false);
            setShowEndPicker(false);
          }}
          onCancel={() => {
            setShowStartPicker(false);
            setShowEndPicker(false);
          }}
        />
      )}

      <FormField
        label="Description"
        value={values.description}
        onChangeText={(v) => set('description', v)}
        error={errors.description}
        placeholder="Notes, infos pratiques..."
        multiline
        numberOfLines={4}
        maxLength={500}
        style={styles.textarea}
      />
      <Text style={styles.charCount}>{values.description.length}/500</Text>

      {hasErrors && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>
            Corrigez les champs en rouge avant de continuer.
          </Text>
        </View>
      )}

      {submitError && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorBannerText}>{submitError}</Text>
        </View>
      )}

      <PrimaryButton title={submitLabel} onPress={handleSubmit} loading={loading} />
    </View>
  );
}

function NativeDatePicker({
  value,
  minimumDate,
  onConfirm,
  onCancel,
}: {
  value: Date;
  minimumDate?: Date;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}) {
  const [current, setCurrent] = useState(new Date(value));

  const shift = (days: number) => {
    const next = new Date(current);
    next.setDate(next.getDate() + days);
    if (minimumDate && next < minimumDate) return;
    setCurrent(next);
  };

  return (
    <View style={picker.overlay}>
      <View style={picker.sheet}>
        <Text style={picker.title}>Sélectionner une date</Text>
        <View style={picker.nav}>
          <TouchableOpacity style={picker.btn} onPress={() => shift(-30)}>
            <Text style={picker.btnText}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={picker.btn} onPress={() => shift(-1)}>
            <Text style={picker.btnText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={picker.dateDisplay}>{formatDate(current)}</Text>
          <TouchableOpacity style={picker.btn} onPress={() => shift(1)}>
            <Text style={picker.btnText}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={picker.btn} onPress={() => shift(30)}>
            <Text style={picker.btnText}>{'>>'}</Text>
          </TouchableOpacity>
        </View>
        <View style={picker.actions}>
          <TouchableOpacity style={picker.cancelBtn} onPress={onCancel}>
            <Text style={picker.cancelText}>Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity style={picker.confirmBtn} onPress={() => onConfirm(current)}>
            <Text style={picker.confirmText}>Confirmer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#fafafa',
    marginRight: 8,
  },
  dateText: { fontSize: 16, color: '#111' },
  dateShortcuts: { flexDirection: 'row', gap: 4 },
  shortcut: {
    backgroundColor: '#e8f0fe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  shortcutText: { fontSize: 12, color: '#1a73e8', fontWeight: '600' },
  error: { fontSize: 12, color: '#e53e3e', marginBottom: 12 },
  errorBanner: {
    backgroundColor: '#fff5f5',
    borderWidth: 1,
    borderColor: '#feb2b2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  errorBannerText: { color: '#c53030', fontSize: 14, fontWeight: '600' },
  textarea: { height: 100, textAlignVertical: 'top' },
  charCount: { fontSize: 11, color: '#999', textAlign: 'right', marginTop: -12, marginBottom: 16 },
});

const picker = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  sheet: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    alignItems: 'center',
  },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 20 },
  nav: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  btn: { padding: 8, backgroundColor: '#e8f0fe', borderRadius: 8 },
  btnText: { color: '#1a73e8', fontWeight: '700' },
  dateDisplay: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    minWidth: 100,
    textAlign: 'center',
  },
  actions: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  cancelText: { color: '#666', fontWeight: '600' },
  confirmBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#1a73e8',
    alignItems: 'center',
  },
  confirmText: { color: '#fff', fontWeight: '700' },
});
