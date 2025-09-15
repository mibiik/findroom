import React, { useState, useEffect, useCallback } from 'react';
import { type Listing } from './types';
import { MyListingPage } from './components/MyListingPage';
import { ExplorePage } from './components/ExplorePage';
import { SwapIcon, PlusCircleIcon, SearchIcon } from './components/icons';
import { getListings, saveListing } from './firebase/firestoreService';

type View = 'my-listing' | 'explore';

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
    const [currentView, setCurrentView] = useState<View>('my-listing');
    const [isInitialized, setIsInitialized] = useState(false);
    
    useEffect(() => {
        const initializeApp = async () => {
            const listingsFromDb = await getListings();
            setListings(listingsFromDb);
            const savedMyId = localStorage.getItem('dorm-swap-my-id');
            if (savedMyId) {
                setMyListingId(savedMyId);
            }
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
        }
    }, [myListingId, isInitialized]);

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
    
    const myListing = listings.find(l => l.id === myListingId) || null;

    const renderView = () => {
        switch (currentView) {
            case 'my-listing':
                return <MyListingPage onAddListing={addOrUpdateListing} myListing={myListing} allListings={listings} myListingId={myListingId} />;
            case 'explore':
                return <ExplorePage listings={listings} myListingId={myListingId} />;
            default:
                return <MyListingPage onAddListing={addOrUpdateListing} myListing={myListing} allListings={listings} myListingId={myListingId} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-10 border-b border-gray-200">
                <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-center">
                        <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg">
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