export interface TripFormValues {
  title: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
}

export interface TripFormErrors {
  title?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

export function validateTripForm(values: TripFormValues): TripFormErrors {
  const errors: TripFormErrors = {};

  if (!values.title.trim()) {
    errors.title = 'Le titre est requis.';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Le titre ne peut pas dépasser 100 caractères.';
  }

  if (!values.startDate) {
    errors.startDate = 'La date de début est requise.';
  }

  if (!values.endDate) {
    errors.endDate = 'La date de fin est requise.';
  } else if (values.startDate && values.endDate < values.startDate) {
    errors.endDate = 'La date de fin doit être après la date de début.';
  }

  if (values.description.length > 500) {
    errors.description = 'La description ne peut pas dépasser 500 caractères.';
  }

  return errors;
}

export function isTripFormValid(values: TripFormValues): boolean {
  return Object.keys(validateTripForm(values)).length === 0;
}
