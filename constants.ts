
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

export const BUNKBED_OPTIONS = [
    { value: 'true', label: 'Evet' },
    { value: 'false', label: 'Hayır' },
];
