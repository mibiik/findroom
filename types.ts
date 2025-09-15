
export enum Gender {
  Male = 'Erkek',
  Female = 'Kız',
}

export enum Campus {
  Main = 'Ana Kampüs',
  West = 'Batı Kampüsü',
}

export enum Capacity {
  One = '1 Kişilik',
  Two = '2 Kişilik',
  Three = '3 Kişilik',
  Four = '4 Kişilik',
  Five = '5 Kişilik',
}

// Represents a specific, existing dorm room
export interface SpecificDormInfo {
  gender: Gender;
  campus: Campus;
  capacity: Capacity;
  bunkBed: boolean;
}

// Represents desired dorm criteria, allowing for flexible 'any' options
export interface DesiredDormInfo {
  gender: Gender | 'any';
  campus: Campus | 'any';
  capacity: Capacity | 'any';
  bunkBed: boolean | 'any';
}

// The main data structure for a swap listing
export interface Listing {
  id: string;
  contactInfo: string;
  currentDorm: SpecificDormInfo;
  currentDormDetails: string;
  desiredDorm: DesiredDormInfo;
  createdAt: string; // ISO string for localStorage compatibility
}

export type FilterCriteria = DesiredDormInfo;

// Roommate search specific types
export interface RoommateSearch {
  id: string;
  contactInfo: string;
  campus: Campus;
  building: string;
  roomNumber: string;
  createdAt: string;
}

export interface RoommateSearchForm {
  campus: Campus | '';
  building: string;
  roomNumber: string;
  contactInfo: string;
}
