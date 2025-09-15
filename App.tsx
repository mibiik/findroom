import React, { useState, useEffect, useCallback } from 'react';
import { type Listing, type RoommateSearch } from './types';
import { MyListingPage } from './components/MyListingPage';
import { ExplorePage } from './components/ExplorePage';
import { RoommatePage } from './components/RoommatePage';
import { SwapIcon, PlusCircleIcon, SearchIcon, UserGroupIcon } from './components/icons';
import { getListings, saveListing, getRoommateSearches, saveRoommateSearch } from './firebase/firestoreService';

type View = 'my-listing' | 'explore' | 'roommate';

const NavButton = ({ isActive, onClick, icon, label }: { isActive: boolean, onClick: () => void, icon: React.ReactNode, label: string }) => (
    <button
        aria-label={label}
        onClick={onClick}
        className={`flex items-center justify-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 text-sm sm:text-base font-semibold rounded-lg transition-colors duration-200 flex-1 sm:flex-none ${
            isActive
                ? 'bg-indigo-600 text-white shadow-inner'
                : 'text-black hover:bg-gray-200'
        }`}
    >
        {icon}
        <span className="inline">{label}</span>
    </button>
);


export default function App() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [myListingId, setMyListingId] = useState<string | null>(null);
    const [roommateSearches, setRoommateSearches] = useState<RoommateSearch[]>([]);
    const [myRoommateSearchId, setMyRoommateSearchId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<View>('explore');
    const [isInitialized, setIsInitialized] = useState(false);
    
    useEffect(() => {
        const initializeApp = async () => {
            const listingsFromDb = await getListings();
            // Merge my local listing (if any) so it appears immediately after refresh
            let mergedListings = listingsFromDb;
            try {
                const rawMyListing = localStorage.getItem('my-listing');
                if (rawMyListing) {
                    const localListing = JSON.parse(rawMyListing) as Listing;
                    if (!listingsFromDb.find(l => l.id === localListing.id)) {
                        mergedListings = [localListing, ...listingsFromDb];
                    }
                }
            } catch {}
            setListings(mergedListings);
            const roommateFromDb = await getRoommateSearches();
            // Load my roommate search from localStorage and merge for immediate UX
            let localMySearch: RoommateSearch | null = null;
            try {
                const raw = localStorage.getItem('my-roommate-search');
                localMySearch = raw ? (JSON.parse(raw) as RoommateSearch) : null;
            } catch {}
            const merged = localMySearch && !roommateFromDb.find(s => s.id === localMySearch!.id)
                ? [localMySearch, ...roommateFromDb]
                : roommateFromDb;
            setRoommateSearches(merged);
            const savedMyId = localStorage.getItem('dorm-swap-my-id');
            if (savedMyId) {
                setMyListingId(savedMyId);
            }
            const savedRoommateId = localStorage.getItem('dorm-swap-roommate-id');
            if (savedRoommateId) {
                setMyRoommateSearchId(savedRoommateId);
            } else if (localMySearch) {
                setMyRoommateSearchId(localMySearch.id);
            }
            // Load roommate searches from localStorage
            try {
                const savedSearches = JSON.parse(localStorage.getItem('roommate-searches') || '[]');
                setRoommateSearches(savedSearches);
            } catch (error) {
                console.error("Failed to load roommate searches:", error);
            }
            // Always start on Keşfet
            setCurrentView('explore');
            setIsInitialized(true);
        };
        initializeApp();
    }, []);

    useEffect(() => {
        if (isInitialized) {
            if (myListingId) {
                localStorage.setItem('dorm-swap-my-id', myListingId);
            } else {
                localStorage.removeItem('dorm-swap-my-id');
            }
            if (myRoommateSearchId) {
                localStorage.setItem('dorm-swap-roommate-id', myRoommateSearchId);
            } else {
                localStorage.removeItem('dorm-swap-roommate-id');
            }
        }
        // We intentionally do not persist view to always open Keşfet on reload
    }, [myListingId, myRoommateSearchId, currentView, isInitialized]);

    const addOrUpdateListing = useCallback(async (newListing: Listing) => {
        // Optimistic UI update for a responsive feel
        setListings(prev => {
            const existingIndex = prev.findIndex(l => l.id === newListing.id);
            if (existingIndex > -1) {
                const updatedListings = [...prev];
                updatedListings[existingIndex] = newListing;
                return updatedListings;
            }
            return [newListing, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
        setMyListingId(newListing.id);
        // Persist my listing locally so it survives refresh
        try { localStorage.setItem('my-listing', JSON.stringify(newListing)); } catch {}

        // Save to Firestore
        try {
            await saveListing(newListing);
        } catch (error) {
            console.error("Failed to save listing to Firestore:", error);
            alert("İlan kaydedilemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
            // Revert optimistic update on failure by refetching from DB
            const listingsFromDb = await getListings();
            setListings(listingsFromDb);
        }
    }, []);

    const addOrUpdateRoommateSearch = useCallback(async (newSearch: RoommateSearch) => {
        const normalized: RoommateSearch = {
            ...newSearch,
            building: newSearch.building.trim().toUpperCase(),
            roomNumber: newSearch.roomNumber.trim(),
            contactInfo: newSearch.contactInfo.trim(),
        };
        // Optimistic UI update for a responsive feel
        setRoommateSearches(prev => {
            const existingIndex = prev.findIndex(s => s.id === normalized.id);
            if (existingIndex > -1) {
                const updatedSearches = [...prev];
                updatedSearches[existingIndex] = normalized;
                return updatedSearches;
            }
            return [normalized, ...prev].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        });
        setMyRoommateSearchId(normalized.id);
        // Persist my latest roommate search locally for quick restore
        try { localStorage.setItem('my-roommate-search', JSON.stringify(normalized)); } catch {}

        try {
            await saveRoommateSearch(normalized);
        } catch (error) {
            console.error("Failed to save roommate search:", error);
            alert("Arama kaydedilemedi. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.");
        }
    }, []);

    // Periodically refresh roommate searches while on roommate view to reflect others' submissions
    useEffect(() => {
        if (currentView !== 'roommate') return;
        let isCancelled = false;
        const fetchNow = async () => {
            try {
                const fresh = await getRoommateSearches();
                if (!isCancelled) setRoommateSearches(fresh);
            } catch (e) {
                console.error('Failed to refresh roommate searches', e);
            }
        };
        fetchNow();
        const id = setInterval(fetchNow, 5000);
        return () => { isCancelled = true; clearInterval(id); };
    }, [currentView]);

    // Periodically refresh listings while on my-listing view to keep matches current
    useEffect(() => {
        if (currentView !== 'my-listing') return;
        let isCancelled = false;
        const fetchNow = async () => {
            try {
                const fresh = await getListings();
                if (!isCancelled) setListings(fresh);
            } catch (e) {
                console.error('Failed to refresh listings', e);
            }
        };
        fetchNow();
        const id = setInterval(fetchNow, 5000);
        return () => { isCancelled = true; clearInterval(id); };
    }, [currentView]);
    
    const myListing = listings.find(l => l.id === myListingId) || null;

    const renderView = () => {
        switch (currentView) {
            case 'my-listing':
                return <MyListingPage onAddListing={addOrUpdateListing} myListing={myListing} allListings={listings} myListingId={myListingId} />;
            case 'explore':
                return <ExplorePage listings={listings} myListingId={myListingId} />;
            case 'roommate':
                return <RoommatePage roommateSearches={roommateSearches} onAddRoommateSearch={addOrUpdateRoommateSearch} myRoommateSearchId={myRoommateSearchId} />;
            default:
                return <MyListingPage onAddListing={addOrUpdateListing} myListing={myListing} allListings={listings} myListingId={myListingId} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-gray-200">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-center w-full">
                        <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto justify-center">
                           <NavButton
                               isActive={currentView === 'my-listing'}
                               onClick={() => setCurrentView('my-listing')}
                               icon={<SwapIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                               label="Eşleşmelerim"
                           />
                           <NavButton
                               isActive={currentView === 'explore'}
                               onClick={() => setCurrentView('explore')}
                               icon={<SearchIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                               label="Keşfet"
                           />
                           <NavButton
                               isActive={currentView === 'roommate'}
                               onClick={() => setCurrentView('roommate')}
                               icon={<UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                               label="Oda Arkadaşını Bul"
                           />
                        </div>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="max-w-4xl mx-auto">
                   {isInitialized ? renderView() : <div className="text-center p-10">Yükleniyor...</div>}
                </div>
            </main>
        </div>
    );
}