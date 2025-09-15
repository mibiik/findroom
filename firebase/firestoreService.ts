import { collection, doc, getDocs, setDoc, query, orderBy } from 'firebase/firestore';
import { db } from './config';
import type { Listing } from '../types';

const listingsCollectionRef = collection(db, 'listings');

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
