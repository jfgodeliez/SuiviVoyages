import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';
import { ACTIVITY_TYPES, validateActivityForm } from '../utils/activityValidators';
import type { ActivityFormValues, ActivityFormErrors } from '../utils/activityValidators';
import { formatDate } from '../utils/date';
import { TYPE_CONFIG } from './TypeBadge';
import type { ActivityType } from '../types/activity';

interface Props {
  initialValues?: Partial<ActivityFormValues>;
  tripStart: Date;
  tripEnd: Date;
  onSubmit: (values: ActivityFormValues) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

export function ActivityForm({
  initialValues,
  tripStart,
  tripEnd,
  onSubmit,
  submitLabel = 'Enregistrer',
  loading,
}: Props) {
  const [values, setValues] = useState<ActivityFormValues>({
    title: initialValues?.title ?? '',
    type: initialValues?.type ?? null,
    date: initialValues?.date ?? null,
    time: initialValues?.time ?? '',
    location: initialValues?.location ?? '',
    notes: initialValues?.notes ?? '',
  });
  const [errors, setErrors] = useState<ActivityFormErrors>({});
  const [showDatePicker, setShowDatePicker] = useState(false);

  const set = <K extends keyof ActivityFormValues>(key: K, value: ActivityFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async () => {
    const errs = validateActivityForm(values, tripStart, tripEnd);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    await onSubmit(values);
  };

  const shiftDate = (base: Date | null, days: number): Date => {
    const d = base ? new Date(base) : new Date(tripStart);
    d.setDate(d.getDate() + days);
    if (d < tripStart) return new Date(tripStart);
    if (d > tripEnd) return new Date(tripEnd);
    return d;
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <FormField
        label="Titre de l'activité *"
        value={values.title}
        onChangeText={(v) => set('title', v)}
        error={errors.title}
        placeholder="Ex : Visite du Colisée"
        maxLength={100}
      />

      <Text style={styles.label}>Type *</Text>
      <View style={styles.typeGrid}>
        {ACTIVITY_TYPES.map((t) => {
          const cfg = TYPE_CONFIG[t.value];
          const selected = values.type === t.value;
          return (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.typeBtn,
                { borderColor: cfg.color },
                selected && { backgroundColor: cfg.bg },
              ]}
              onPress={() => set('type', t.value as ActivityType)}
            >
              <Text style={[styles.typeBtnText, { color: cfg.color }]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {errors.type ? <Text style={styles.error}>{errors.type}</Text> : null}

      <Text style={styles.label}>Date *</Text>
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
          <Text style={[styles.dateText, !values.date && styles.placeholder]}>
            {values.date ? formatDate(values.date) : 'Choisir une date'}
          </Text>
        </TouchableOpacity>
        <View style={styles.dateShortcuts}>
          {[0, 1, 2].map((n) => (
            <TouchableOpacity
              key={n}
              style={styles.shortcut}
              onPress={() => set('date', shiftDate(values.date, n === 0 ? 0 : n))}
            >
              <Text style={styles.shortcutText}>{n === 0 ? 'Auj.' : `+${n}j`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {errors.date ? <Text style={styles.error}>{errors.date}</Text> : null}

      {showDatePicker && (
        <DatePicker
          value={values.date ?? new Date(tripStart)}
          minDate={tripStart}
          maxDate={tripEnd}
          onConfirm={(d) => {
            set('date', d);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}

      <Text style={styles.label}>Heure (optionnel)</Text>
      <View style={styles.timeRow}>
        <TextInput
          style={styles.timeInput}
          value={values.time}
          onChangeText={(v) => set('time', v)}
          placeholder="09:30"
          keyboardType="numbers-and-punctuation"
          maxLength={5}
        />
        <Text style={styles.timeHint}>format HH:MM</Text>
      </View>
      {errors.time ? <Text style={styles.error}>{errors.time}</Text> : null}

      <FormField
        label="Lieu (optionnel)"
        value={values.location}
        onChangeText={(v) => set('location', v)}
        error={errors.location}
        placeholder="Ex : Piazza del Colosseo, Rome"
        maxLength={200}
      />

      <FormField
        label="Notes (optionnel)"
        value={values.notes}
        onChangeText={(v) => set('notes', v)}
        error={errors.notes}
        placeholder="Infos pratiques, réservation..."
        multiline
        numberOfLines={4}
        maxLength={1000}
        style={styles.textarea}
      />
      <Text style={styles.charCount}>{values.notes.length}/1000</Text>

      <PrimaryButton title={submitLabel} onPress={handleSubmit} loading={loading} />
    </ScrollView>
  );
}

function DatePicker({
  value,
  minDate,
  maxDate,
  onConfirm,
  onCancel,
}: {
  value: Date;
  minDate: Date;
  maxDate: Date;
  onConfirm: (d: Date) => void;
  onCancel: () => void;
}) {
  const [current, setCurrent] = useState(new Date(value));

  const shift = (days: number) => {
    const next = new Date(current);
    next.setDate(next.getDate() + days);
    if (next < minDate || next > maxDate) return;
    setCurrent(next);
  };

  return (
    <View style={picker.overlay}>
      <View style={picker.sheet}>
        <Text style={picker.title}>Sélectionner une date</Text>
        <View style={picker.nav}>
          <TouchableOpacity style={picker.btn} onPress={() => shift(-7)}>
            <Text style={picker.btnText}>{'<<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={picker.btn} onPress={() => shift(-1)}>
            <Text style={picker.btnText}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={picker.dateDisplay}>{formatDate(current)}</Text>
          <TouchableOpacity style={picker.btn} onPress={() => shift(1)}>
            <Text style={picker.btnText}>{'>'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={picker.btn} onPress={() => shift(7)}>
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  typeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: '#fff',
  },
  typeBtnText: { fontSize: 13, fontWeight: '600' },
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
  placeholder: { color: '#999' },
  dateShortcuts: { flexDirection: 'row', gap: 4 },
  shortcut: {
    backgroundColor: '#e8f0fe',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  shortcutText: { fontSize: 12, color: '#1a73e8', fontWeight: '600' },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  timeInput: {
    width: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fafafa',
    textAlign: 'center',
  },
  timeHint: { fontSize: 13, color: '#999' },
  error: { fontSize: 12, color: '#e53e3e', marginBottom: 12 },
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
