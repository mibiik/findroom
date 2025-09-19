
import { Gender, Campus, Capacity } from './types';

export const GENDER_OPTIONS = [
  { value: Gender.Female, label: 'Kız' },
  { value: Gender.Male, label: 'Erkek' },
];

export const CAMPUS_OPTIONS = [
  { value: Campus.Main, label: 'Ana Kampüs' },
  { value: Campus.West, label: 'Batı Kampüsü' },
];

export const CAPACITY_OPTIONS = [
  { value: Capacity.One, label: '1 Kişilik' },
  { value: Capacity.Two, label: '2 Kişilik' },
  { value: Capacity.Three, label: '3 Kişilik' },
  { value: Capacity.Four, label: '4 Kişilik' },
  { value: Capacity.Five, label: '5 Kişilik' },
];

export const DESIRED_CAPACITY_OPTIONS = [
  { value: Capacity.One, label: '1 Kişilik' },
  { value: Capacity.Two, label: '2 Kişilik' },
  { value: Capacity.Three, label: '3 Kişilik' },
  { value: Capacity.Four, label: '4 Kişilik' },
  { value: Capacity.Five, label: '5 Kişilik' },
  { value: 'multiple', label: 'Birden fazla seçenek uygun' },
];

export const BUNKBED_OPTIONS = [
    { value: 'true', label: 'Evet' },
    { value: 'false', label: 'Hayır' },
];

// Room number options for different buildings
export const ROOM_NUMBER_OPTIONS = {
  // Ana Kampüs - Henry Ford A/B
  'Henry Ford A': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'Henry Ford B': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  // Ana Kampüs - A-Z binaları
  ...Object.fromEntries(
    Array.from({ length: 26 }, (_, i) => {
      const building = String.fromCharCode(65 + i);
      return [building, Array.from({ length: 20 }, (_, j) => ({ value: `${j + 1}`, label: `${j + 1}` }))];
    })
  ),
  // Batı Kampüsü - A1-A6, B
  'A1': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'A2': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'A3': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'A4': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'A5': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'A6': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
  'B': Array.from({ length: 20 }, (_, i) => ({ value: `${i + 1}`, label: `${i + 1}` })),
};
