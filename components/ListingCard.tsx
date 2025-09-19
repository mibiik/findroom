
import React, { useState } from 'react';
import type { Listing } from '../types';
import { SwapIcon } from './icons';
import { DormInfoCard } from './DormInfoCard';

interface ListingCardProps {
  listing: Listing;
  emphasizeDescription?: boolean;
  isOwnListing?: boolean;
  onDeleteListing?: (listingId: string) => void;
}

// Pastel renk paleti - her ilan için farklı renk
const getPastelColor = (id: string) => {
  const colors = [
    'bg-pink-50 border-pink-200', // Pembe
    'bg-blue-50 border-blue-200', // Mavi
    'bg-green-50 border-green-200', // Yeşil
    'bg-purple-50 border-purple-200', // Mor
    'bg-yellow-50 border-yellow-200', // Sarı
    'bg-indigo-50 border-indigo-200', // İndigo
    'bg-rose-50 border-rose-200', // Gül
    'bg-teal-50 border-teal-200', // Teal
    'bg-orange-50 border-orange-200', // Turuncu
    'bg-cyan-50 border-cyan-200', // Cyan
  ];
  
  // İlan ID'sinden hash oluştur ve renk seç
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash + id.charCodeAt(i)) & 0xffffffff;
  }
  return colors[Math.abs(hash) % colors.length];
};

export const ListingCard: React.FC<ListingCardProps> = ({ listing, emphasizeDescription = false, isOwnListing = false, onDeleteListing }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const pastelColor = getPastelColor(listing.id);

  return (
    <div className={`${pastelColor} rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${isOwnListing ? 'ring-2 ring-indigo-300' : ''}`}>
      {isOwnListing && (
        <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between">
          <span className="font-semibold text-sm">Sizin talebiniz</span>
          {onDeleteListing && (
            <button
              onClick={() => {
                if (window.confirm('Talebinizi silmek istediğinizden emin misiniz?')) {
                  onDeleteListing(listing.id);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded transition-colors duration-200"
            >
              Talebi Sil
            </button>
          )}
        </div>
      )}
      <div className="p-4 sm:p-6">
        {/* Oda Detayları - Üstte */}
        {listing.optionalRoomDetails && (listing.optionalRoomDetails.roomNumber || listing.optionalRoomDetails.building || listing.optionalRoomDetails.hasBathroom) && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-800 text-sm mb-2">Oda Detayları</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              {listing.optionalRoomDetails.building && (
                <span className="bg-white px-2 py-1 rounded border border-green-300 text-green-700">
                  Bina: {listing.optionalRoomDetails.building}
                </span>
              )}
              {listing.optionalRoomDetails.roomNumber && (
                <span className="bg-white px-2 py-1 rounded border border-green-300 text-green-700">
                  Oda: {listing.optionalRoomDetails.roomNumber}
                </span>
              )}
              {listing.optionalRoomDetails.hasBathroom && (
                <span className="bg-white px-2 py-1 rounded border border-green-300 text-green-700 font-medium">
                  ✓ Banyolu
                </span>
              )}
            </div>
          </div>
        )}

        {!!listing.currentDormDetails && (
          <div className="mb-3 sm:mb-4">
            <p className={`${emphasizeDescription ? 'text-black font-bold text-base sm:text-lg' : 'text-gray-700 text-sm sm:text-base'} break-words`}>
              {listing.currentDormDetails}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-6 items-center">
            <DormInfoCard info={listing.currentDorm} title="Mevcut Yurt" />
            <div className="hidden lg:flex justify-center items-center h-full px-4">
                <SwapIcon className="w-8 h-8 text-gray-400" />
            </div>
            <DormInfoCard info={listing.desiredDorm} title="İstenilen Yurt" />
        </div>
      </div>

      <div className="px-4 sm:px-6 pb-2">
         <div className="border-t border-gray-200">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full text-left px-0 py-3 sm:py-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 focus:outline-none transition-colors"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm">{isExpanded ? 'Detayları Gizle' : 'Detayları Göster ve İletişime Geç'}</span>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>
         </div>
      </div>

      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 bg-gray-50/70 border-t border-gray-200">
          <div className="pt-3 sm:pt-4 space-y-3 sm:space-y-4">
            <div>
                <h4 className="font-semibold text-gray-700 text-sm sm:text-base">İletişim Bilgisi</h4>
                <p className="mt-1 text-indigo-700 font-semibold text-xs sm:text-sm bg-indigo-100 inline-block px-2 sm:px-3 py-1 rounded-full break-all">
                    {listing.contactInfo}
                </p>
            </div>
            <p className="text-xs text-gray-400 text-right pt-2">
                İlan Tarihi: {new Date(listing.createdAt).toLocaleDateString('tr-TR')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};