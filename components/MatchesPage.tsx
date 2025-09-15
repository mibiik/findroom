
import React, { useMemo } from 'react';
import type { Listing, SpecificDormInfo, DesiredDormInfo } from '../types';
import { ListingCard } from './ListingCard';
import { HeartIcon, PlusCircleIcon } from './icons';

interface MatchesPageProps {
  listings: Listing[];
  myListingId: string | null;
}

// Checks if a specific dorm (someone's current) satisfies a desired dorm's criteria
const specificSatisfiesDesired = (specific: SpecificDormInfo, desired: DesiredDormInfo): boolean => {
  return (
    (desired.gender === 'any' || desired.gender === specific.gender) &&
    (desired.campus === 'any' || desired.campus === specific.campus) &&
    (desired.capacity === 'any' || desired.capacity === specific.capacity) &&
    (desired.bunkBed === 'any' || desired.bunkBed === specific.bunkBed)
  );
};

export const MatchesPage: React.FC<MatchesPageProps> = ({ listings, myListingId }) => {
  const myListing = useMemo(() => listings.find(l => l.id === myListingId), [listings, myListingId]);

  const matches = useMemo(() => {
    if (!myListing) return [];

    return listings.filter(otherListing => {
      if (otherListing.id === myListing.id) return false;

      // Check if my current dorm satisfies their desired criteria
      const theyWantMyDorm = specificSatisfiesDesired(myListing.currentDorm, otherListing.desiredDorm);
      // Check if their current dorm satisfies my desired criteria
      const iWantTheirDorm = specificSatisfiesDesired(otherListing.currentDorm, myListing.desiredDorm);

      return theyWantMyDorm && iWantTheirDorm;
    });
  }, [listings, myListing]);

  if (!myListing) {
    return (
      <div className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="flex justify-center items-center mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-indigo-100 rounded-full">
            <PlusCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600"/>
        </div>
        <h2 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-800">Eşleşmeleri Görmek İçin İlan Oluşturun</h2>
        <p className="mt-2 text-sm sm:text-base text-gray-500 px-2">
          Size uygun takasları bulabilmemiz için lütfen "İlan Oluştur" sekmesinden kendi yurt bilgilerinizi girin.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center mb-2">
                <HeartIcon className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500 mr-2 sm:mr-3"/>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Sizin İçin Mükemmel Eşleşmeler</h2>
            </div>
            <p className="text-sm sm:text-base text-gray-600">Aşağıda hem sizin istediğiniz yurda sahip olan hem de sizin yurdunuzu isteyen kişilerin ilanları listelenmiştir.</p>
        </div>
      {matches.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:gap-8">
          {matches.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16 px-4 sm:px-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-center items-center mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-pink-100 rounded-full">
              <HeartIcon className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600"/>
            </div>
            <h3 className="mt-3 sm:mt-4 text-lg sm:text-xl font-bold text-gray-800">Henüz Eşleşme Bulunamadı</h3>
            <p className="mt-2 text-sm sm:text-base text-gray-500 px-2">
            Endişelenmeyin! Yeni ilanlar eklendikçe burada eşleşmeleriniz görünecektir. Ara sıra kontrol etmeyi unutmayın.
            </p>
        </div>
      )}
    </div>
  );
};