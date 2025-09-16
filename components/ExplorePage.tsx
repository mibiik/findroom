
import React, { useState, useMemo } from 'react';
import type { Listing, FilterCriteria } from '../types';
import { ListingCard } from './ListingCard';
import { FilterPanel } from './FilterPanel';
import { SearchIcon, PlusCircleIcon } from './icons';

interface ExplorePageProps {
  listings: Listing[];
  myListingId: string | null;
  onDeleteListing?: (listingId: string) => void;
  onCreateRequest?: () => void;
}

const initialFilters: FilterCriteria = {
  gender: 'any',
  campus: 'any',
  capacity: 'any',
  bunkBed: 'any',
};

const dormMatchesFilter = (listing: Listing, filters: FilterCriteria): boolean => {
    const { currentDorm } = listing;
    if (filters.gender !== 'any' && currentDorm.gender !== filters.gender) return false;
    if (filters.campus !== 'any' && currentDorm.campus !== filters.campus) return false;
    if (filters.capacity !== 'any' && currentDorm.capacity !== filters.capacity) return false;
    if (filters.bunkBed !== 'any' && currentDorm.bunkBed !== filters.bunkBed) return false;
    return true;
};

export const ExplorePage: React.FC<ExplorePageProps> = ({ listings, myListingId, onDeleteListing, onCreateRequest }) => {
  const [filters, setFilters] = useState<FilterCriteria>(initialFilters);

  const handleFilterChange = <K extends keyof FilterCriteria>(key: K, value: FilterCriteria[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const filteredListings = useMemo(() => {
    return listings
      .filter(l => dormMatchesFilter(l, filters));
  }, [listings, filters]);

  return (
    <div className="space-y-8">
      {/* Talep Oluştur Butonu - En Üstte */}
      <div className="flex justify-start">
        <button
          onClick={onCreateRequest}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-sm"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Talep Oluştur
        </button>
      </div>

      <FilterPanel filters={filters} onFilterChange={handleFilterChange} onReset={resetFilters}/>

      {filteredListings.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {filteredListings.map(listing => (
            <ListingCard 
              key={listing.id} 
              listing={listing} 
              emphasizeDescription={true}
              isOwnListing={listing.id === myListingId}
              onDeleteListing={onDeleteListing}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-center items-center mx-auto w-16 h-16 bg-indigo-100 rounded-full">
              <SearchIcon className="w-8 h-8 text-indigo-600"/>
          </div>
          <h3 className="mt-4 text-xl font-bold text-gray-800">Sonuç Bulunamadı</h3>
          <p className="mt-2 text-gray-500">Filtre kriterlerinizi değiştirmeyi veya daha sonra tekrar kontrol etmeyi deneyin.</p>
        </div>
      )}
    </div>
  );
};