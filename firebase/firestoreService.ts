import { collection, doc, getDocs, setDoc, deleteDoc, query, orderBy, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './config';
import type { Listing, RoommateSearch, RoomStats, RoommateStats, User } from '../types';
import { Gender, Campus, Capacity } from '../types';

const listingsCollectionRef = collection(db, 'listings');
const roommateCollectionRef = collection(db, 'roommate_searches');
const usersCollectionRef = collection(db, 'users');

// Firebase bağlantısını test et
export const testFirebaseConnection = async (): Promise<boolean> => {
    try {
        console.log('Testing Firebase connection...');
        const testQuery = query(listingsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(testQuery);
        console.log('Firebase connection successful. Found', querySnapshot.docs.length, 'listings');
        return true;
    } catch (error) {
        console.error('Firebase connection failed:', error);
        console.error('Connection error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: (error as any)?.code,
            details: (error as any)?.details
        });
        return false;
    }
};

export const getListings = async (): Promise<Listing[]> => {
    try {
        const q = query(listingsCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const listings = querySnapshot.docs.map(doc => ({
            ...(doc.data() as Listing),
            id: doc.id,
        }));
        return listings;
    } catch (error) {
        console.error("Error fetching listings: ", error);
        return [];
    }
};

export const saveListing = async (listing: Listing): Promise<void> => {
    try {
        console.log('Saving listing to Firestore:', listing);
        
        // Firestore için veriyi temizle - undefined değerleri kaldır
        const cleanedListing = {
            id: listing.id,
            contactInfo: listing.contactInfo,
            currentDorm: listing.currentDorm,
            currentDormDetails: listing.currentDormDetails,
            desiredDorm: listing.desiredDorm,
            createdAt: listing.createdAt,
            // optionalRoomDetails sadece varsa ekle
            ...(listing.optionalRoomDetails && {
                optionalRoomDetails: {
                    roomNumber: listing.optionalRoomDetails.roomNumber || '',
                    building: listing.optionalRoomDetails.building || '',
                    hasBathroom: listing.optionalRoomDetails.hasBathroom || false
                }
            })
        };
        
        // Boş string'leri ve undefined değerleri temizle
        const finalListing = Object.fromEntries(
            Object.entries(cleanedListing).filter(([_, value]) => value !== undefined && value !== '')
        );
        
        console.log('Cleaned listing for Firestore:', finalListing);
        
        const listingDocRef = doc(db, 'listings', listing.id);
        await setDoc(listingDocRef, finalListing);
        console.log('Listing saved successfully to Firestore');
    } catch (error) {
        console.error("Error saving listing: ", error);
        console.error("Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: (error as any)?.code,
            details: (error as any)?.details,
            listing: listing
        });
        throw error; // Re-throw the error to be handled by the caller
    }
};

// Roommate Searches (independent from listings)
export const getRoommateSearches = async (): Promise<RoommateSearch[]> => {
    try {
        const q = query(roommateCollectionRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(d => ({ ...(d.data() as RoommateSearch), id: d.id }));
    } catch (error) {
        console.error('Error fetching roommate searches:', error);
        return [];
    }
};

export const saveRoommateSearch = async (search: RoommateSearch): Promise<void> => {
    try {
        console.log('Saving roommate search to Firestore:', search);
        
        // Firestore için veriyi temizle
        const cleanedSearch = {
            id: search.id,
            name: search.name,
            contactInfo: search.contactInfo,
            campus: search.campus,
            building: search.building,
            roomNumber: search.roomNumber,
            createdAt: search.createdAt
        };
        
        // Boş string'leri ve undefined değerleri temizle
        const finalSearch = Object.fromEntries(
            Object.entries(cleanedSearch).filter(([_, value]) => value !== undefined && value !== '')
        );
        
        console.log('Cleaned roommate search for Firestore:', finalSearch);
        
        const docRef = doc(db, 'roommate_searches', search.id);
        await setDoc(docRef, finalSearch);
        console.log('Roommate search saved successfully to Firestore');
    } catch (error) {
        console.error('Error saving roommate search:', error);
        console.error('Roommate search error details:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: (error as any)?.code,
            details: (error as any)?.details,
            search: search
        });
        throw error;
    }
};

export const deleteListing = async (listingId: string): Promise<void> => {
    try {
        const listingDocRef = doc(db, 'listings', listingId);
        await deleteDoc(listingDocRef);
    } catch (error) {
        console.error("Error deleting listing: ", error);
        throw error;
    }
};

// Oda istatistiklerini hesapla
export const getRoomStats = async (): Promise<RoomStats> => {
    try {
        console.log('Fetching listings for room stats...');
        const listings = await getListings();
        console.log('Listings fetched:', listings.length);
        
        // Tüm odaları topla (mevcut odalar)
        const rooms = listings.map(listing => listing.currentDorm);
        console.log('Rooms extracted:', rooms.length);
        
        // Cinsiyet bazında grupla
        const genderCounts = new Map<Gender, number>();
        Object.values(Gender).forEach(gender => {
            genderCounts.set(gender, rooms.filter(room => room.gender === gender).length);
        });
        
        // Kampüs bazında grupla
        const campusCounts = new Map<Campus, number>();
        Object.values(Campus).forEach(campus => {
            campusCounts.set(campus, rooms.filter(room => room.campus === campus).length);
        });
        
        // Kapasite bazında grupla
        const capacityCounts = new Map<Capacity, number>();
        Object.values(Capacity).forEach(capacity => {
            capacityCounts.set(capacity, rooms.filter(room => room.capacity === capacity).length);
        });
        
        // Ranza durumu
        const roomsWithBunkBed = rooms.filter(room => room.bunkBed).length;
        const roomsWithoutBunkBed = rooms.filter(room => !room.bunkBed).length;
        
        const result = {
            totalRooms: rooms.length,
            roomsByGender: Array.from(genderCounts.entries()).map(([gender, count]) => ({ gender, count })),
            roomsByCampus: Array.from(campusCounts.entries()).map(([campus, count]) => ({ campus, count })),
            roomsByCapacity: Array.from(capacityCounts.entries()).map(([capacity, count]) => ({ capacity, count })),
            roomsWithBunkBed,
            roomsWithoutBunkBed
        };
        
        console.log('Room stats calculated:', result);
        return result;
    } catch (error) {
        console.error("Error calculating room stats: ", error);
        return {
            totalRooms: 0,
            roomsByGender: [],
            roomsByCampus: [],
            roomsByCapacity: [],
            roomsWithBunkBed: 0,
            roomsWithoutBunkBed: 0
        };
    }
};

// Oda arkadaşı istatistiklerini hesapla
export const getRoommateStats = async (): Promise<RoommateStats> => {
    try {
        console.log('Fetching roommate searches for stats...');
        const searches = await getRoommateSearches();
        console.log('Roommate searches fetched:', searches.length);
        
        // Kampüs bazında grupla
        const campusCounts = new Map<Campus, number>();
        Object.values(Campus).forEach(campus => {
            campusCounts.set(campus, searches.filter(search => search.campus === campus).length);
        });
        
        // Bina bazında grupla
        const buildingCounts = new Map<string, number>();
        searches.forEach(search => {
            const count = buildingCounts.get(search.building) || 0;
            buildingCounts.set(search.building, count + 1);
        });
        
        // Tüm aramaları al (limit kaldırıldı)
        const recentSearches = searches;
        
        const result = {
            totalRoommateSearches: searches.length,
            searchesByCampus: Array.from(campusCounts.entries()).map(([campus, count]) => ({ campus, count })),
            searchesByBuilding: Array.from(buildingCounts.entries()).map(([building, count]) => ({ building, count })),
            recentSearches
        };
        
        console.log('Roommate stats calculated:', result);
        return result;
    } catch (error) {
        console.error("Error calculating roommate stats: ", error);
        return {
            totalRoommateSearches: 0,
            searchesByCampus: [],
            searchesByBuilding: [],
            recentSearches: []
        };
    }
};

// Yurt değişim eşleşmelerini hesapla
export const getDormSwapMatches = async (): Promise<{ totalMatches: number; matchedPairs: any[] }> => {
    try {
        console.log('Calculating dorm swap matches...');
        const listings = await getListings();
        
        // Eşleşen çiftleri bul
        const matchedPairs = [];
        const processed = new Set<string>();
        
        for (let i = 0; i < listings.length; i++) {
            if (processed.has(listings[i].id)) continue;
            
            for (let j = i + 1; j < listings.length; j++) {
                if (processed.has(listings[j].id)) continue;
                
                const listing1 = listings[i];
                const listing2 = listings[j];
                
                // Eşleşme kontrolü: birinin istediği diğerinin mevcut yurdu, diğerinin istediği birincinin mevcut yurdu
                const isMatch = (
                    listing1.desiredDorm.campus === listing2.currentDorm.campus &&
                    listing1.desiredDorm.building === listing2.currentDorm.building &&
                    listing1.desiredDorm.roomNumber === listing2.currentDorm.roomNumber &&
                    listing2.desiredDorm.campus === listing1.currentDorm.campus &&
                    listing2.desiredDorm.building === listing1.currentDorm.building &&
                    listing2.desiredDorm.roomNumber === listing1.currentDorm.roomNumber
                );
                
                if (isMatch) {
                    matchedPairs.push({
                        user1: {
                            id: listing1.id,
                            currentDorm: listing1.currentDorm,
                            desiredDorm: listing1.desiredDorm,
                            contactInfo: listing1.contactInfo
                        },
                        user2: {
                            id: listing2.id,
                            currentDorm: listing2.currentDorm,
                            desiredDorm: listing2.desiredDorm,
                            contactInfo: listing2.contactInfo
                        },
                        matchDate: new Date()
                    });
                    
                    processed.add(listing1.id);
                    processed.add(listing2.id);
                    break;
                }
            }
        }
        
        const result = {
            totalMatches: matchedPairs.length,
            matchedPairs
        };
        
        console.log('Dorm swap matches calculated:', result);
        return result;
    } catch (error) {
        console.error("Error calculating dorm swap matches: ", error);
        return {
            totalMatches: 0,
            matchedPairs: []
        };
    }
};

// Tüm odaların detaylı listesini getir
export const getAllRoomsDetailed = async (): Promise<any[]> => {
    try {
        console.log('Fetching detailed room information...');
        const listings = await getListings();
        
        // Her oda için detaylı bilgi oluştur
        const detailedRooms = listings.map((listing, index) => ({
            id: listing.id,
            roomNumber: index + 1,
            gender: listing.currentDorm.gender,
            campus: listing.currentDorm.campus,
            capacity: listing.currentDorm.capacity,
            bunkBed: listing.currentDorm.bunkBed,
            contactInfo: listing.contactInfo,
            createdAt: listing.createdAt,
            currentDormDetails: listing.currentDormDetails,
            desiredDorm: listing.desiredDorm
        }));
        
        console.log('Detailed rooms fetched:', detailedRooms.length);
        return detailedRooms;
    } catch (error) {
        console.error("Error fetching detailed rooms: ", error);
        return [];
    }
};

// Oda arkadaşı eşleşmelerini hesapla
export const getRoommateMatches = async (): Promise<any> => {
    try {
        console.log('Calculating roommate matches...');
        const searches = await getRoommateSearches();
        
        // Aynı odaya kayıt yapan kişileri grupla
        const roomGroups = searches.reduce((groups, search) => {
            const roomKey = `${search.campus}-${search.building}-${search.roomNumber}`;
            if (!groups[roomKey]) {
                groups[roomKey] = {
                    campus: search.campus,
                    building: search.building,
                    roomNumber: search.roomNumber,
                    people: []
                };
            }
            groups[roomKey].people.push(search);
            return groups;
        }, {} as any);
        
        // Eşleşen odaları filtrele (2 veya daha fazla kişi olan odalar)
        const matchedRooms = Object.values(roomGroups).filter((room: any) => room.people.length >= 2);
        
        const result = {
            totalMatches: matchedRooms.length,
            totalPeopleMatched: matchedRooms.reduce((sum: number, room: any) => sum + room.people.length, 0),
            matchedRooms: matchedRooms.map((room: any) => ({
                ...room,
                peopleCount: room.people.length
            }))
        };
        
        console.log('Roommate matches calculated:', result);
        return result;
    } catch (error) {
        console.error("Error calculating roommate matches: ", error);
        return {
            totalMatches: 0,
            totalPeopleMatched: 0,
            matchedRooms: []
        };
    }
};

// Kullanıcı işlemleri
export const createOrUpdateUser = async (user: User): Promise<void> => {
    try {
        console.log('Saving user to Firestore:', user);
        
        // Firestore için veriyi temizle
        const cleanedUser = {
            id: user.id,
            name: user.name,
            createdAt: user.createdAt,
            lastActive: new Date().toISOString(),
            preferences: {
                notifications: user.preferences?.notifications || true,
                theme: user.preferences?.theme || 'light'
            }
        };
        
        // Email ve phone varsa ekle
        if (user.email) {
            cleanedUser.email = user.email;
        }
        if (user.phone) {
            cleanedUser.phone = user.phone;
        }
        
        console.log('Cleaned user for Firestore:', cleanedUser);
        
        const userDocRef = doc(db, 'users', user.id);
        await setDoc(userDocRef, cleanedUser, { merge: true });
        console.log('User saved to Firebase:', user.id);
    } catch (error) {
        console.error("Error saving user: ", error);
        console.error("User error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            code: (error as any)?.code,
            details: (error as any)?.details,
            user: user
        });
        throw error;
    }
};

export const getUser = async (userId: string): Promise<User | null> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
            return userDoc.data() as User;
        }
        return null;
    } catch (error) {
        console.error("Error fetching user: ", error);
        return null;
    }
};

export const updateUserLastActive = async (userId: string): Promise<void> => {
    try {
        const userDocRef = doc(db, 'users', userId);
        await updateDoc(userDocRef, {
            lastActive: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error updating user last active: ", error);
    }
};
