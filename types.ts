
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
  name: string;
  contactInfo: string;
  campus: Campus;
  building: string;
  roomNumber: string;
  createdAt: string;
}

export interface RoommateSearchForm {
  name: string;
  campus: Campus | '';
  building: string;
  roomNumber: string;
  contactInfo: string;
}

// Bildirim sistemi için types
export type NotificationType = 'match' | 'message' | 'new_listing' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  listingId?: string; // İlgili ilan ID'si
  actionUrl?: string; // Tıklanabilir URL
}

// İstatistik ve analitik için types
export interface Analytics {
  totalListings: number;
  totalUsers: number;
  successfulSwaps: number;
  averageMatchTime: number; // dakika cinsinden
  popularDorms: { dorm: string; count: number }[];
  dailyActivity: { date: string; listings: number; matches: number }[];
  userActivity: {
    userId: string;
    listingsCreated: number;
    matchesFound: number;
    lastActive: string;
  }[];
}

export interface UserStats {
  listingsCreated: number;
  matchesFound: number;
  successfulSwaps: number;
  averageResponseTime: number;
  lastActive: string;
}

// Oda ve oda arkadaşı istatistikleri için
export interface RoomStats {
  totalRooms: number;
  roomsByGender: { gender: Gender; count: number }[];
  roomsByCampus: { campus: Campus; count: number }[];
  roomsByCapacity: { capacity: Capacity; count: number }[];
  roomsWithBunkBed: number;
  roomsWithoutBunkBed: number;
}

export interface RoommateStats {
  totalRoommateSearches: number;
  searchesByCampus: { campus: Campus; count: number }[];
  searchesByBuilding: { building: string; count: number }[];
  recentSearches: RoommateSearch[];
}
