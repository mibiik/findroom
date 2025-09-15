import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import type { Listing, RoommateSearch } from '../types';

const listingsCollectionRef = collection(db, 'listings');
const roommateCollectionRef = collection(db, 'roommate_searches');

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
        const listingDocRef = doc(db, 'listings', listing.id);
        await setDoc(listingDocRef, listing);
    } catch (error) {
        console.error("Error saving listing: ", error);
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
        const docRef = doc(db, 'roommate_searches', search.id);
        await setDoc(docRef, search);
    } catch (error) {
        console.error('Error saving roommate search:', error);
        throw error;
    }
};
