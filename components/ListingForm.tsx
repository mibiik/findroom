import React, { useState } from 'react';
import type { Listing, SpecificDormInfo, DesiredDormInfo, OptionalRoomDetails } from '../types';
import { Gender, Campus, Capacity } from '../types';
import { DormFieldSet } from './DormFieldSet';

interface ListingFormProps {
  onAddListing: (listing: Listing) => Promise<void>;
  myListing: Listing | null;
}

const initialCurrentDorm: SpecificDormInfo = {
  gender: Gender.Female,
  campus: Campus.Main,
  capacity: Capacity.Four,
  bunkBed: true,
};

const initialDesiredDorm: DesiredDormInfo = {
  gender: 'any',
  campus: 'any',
  capacity: 'any',
  bunkBed: 'any',
};

const initialOptionalRoomDetails: OptionalRoomDetails = {
  roomNumber: '',
  building: '',
  hasBathroom: false,
};

// Building options for different campuses
const WEST_BUILDINGS = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'B'];
const MAIN_BUILDINGS = ['Henry Ford A', 'Henry Ford B', ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i))];

const getBuildingOptions = (campus: Campus) => {
  return campus === Campus.West ? WEST_BUILDINGS : MAIN_BUILDINGS;
};


export const ListingForm: React.FC<ListingFormProps> = ({ onAddListing, myListing }) => {
  const [currentDorm, setCurrentDorm] = useState<SpecificDormInfo>(myListing?.currentDorm ?? initialCurrentDorm);
  const [desiredDorm, setDesiredDorm] = useState<DesiredDormInfo>(myListing?.desiredDorm ?? initialDesiredDorm);
  const [currentDormDetails, setCurrentDormDetails] = useState(myListing?.currentDormDetails ?? '');
  const [optionalRoomDetails, setOptionalRoomDetails] = useState<OptionalRoomDetails>(myListing?.optionalRoomDetails ?? initialOptionalRoomDetails);
  const [contactInfo, setContactInfo] = useState(myListing?.contactInfo ?? '');
  const [showForm, setShowForm] = useState(!myListing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRoomDetails, setShowRoomDetails] = useState(false);

  const handleCurrentDormChange = <K extends keyof SpecificDormInfo>(field: K, value: SpecificDormInfo[K]) => {
    setCurrentDorm(prev => ({ ...prev, [field]: value }));
    
    // Eğer cinsiyet değişiyorsa, istenilen yurt tipini de aynı yap
    if (field === 'gender') {
      setDesiredDorm(prev => ({ ...prev, gender: value }));
    }
  };

  const handleDesiredDormChange = <K extends keyof DesiredDormInfo>(field: K, value: DesiredDormInfo[K]) => {
    setDesiredDorm(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionalRoomDetailsChange = <K extends keyof OptionalRoomDetails>(field: K, value: OptionalRoomDetails[K]) => {
    setOptionalRoomDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInfo.trim()) {
      alert('Lütfen iletişim bilgisi girin.');
      return;
    }

    setIsSubmitting(true);
    const newListing: Listing = {
      id: myListing?.id || `listing-${Date.now()}`,
      contactInfo,
      currentDorm,
      currentDormDetails,
      desiredDorm,
      optionalRoomDetails: optionalRoomDetails.roomNumber || optionalRoomDetails.building || optionalRoomDetails.hasBathroom ? optionalRoomDetails : undefined,
      createdAt: myListing?.createdAt || new Date().toISOString(),
    };
    
    try {
        await onAddListing(newListing);
        setShowForm(false);
    } catch (error) {
        console.error("Submission failed:", error);
        alert("İlan gönderilemedi. Lütfen daha sonra tekrar deneyin.");
    } finally {
        setIsSubmitting(false);
    }
  };
  
  const FormSuccess = () => (
      <div className="text-center p-6 sm:p-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl sm:text-2xl font-bold text-green-600 mb-3 sm:mb-4">Talebiniz {myListing ? 'Güncellendi' : 'Oluşturuldu'}!</h2>
        <p className="text-sm sm:text-base text-gray-600 px-2">Artık "Keşfet" sayfasından diğer ilanlara göz atabilir veya "Eşleşmelerim" sayfasından size uygun kişileri görebilirsiniz.</p>
        <button onClick={() => setShowForm(true)} className="mt-4 sm:mt-6 px-4 sm:px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm sm:text-base">
          Talebi Düzenle
        </button>
      </div>
  )

  if (!showForm) {
      return <FormSuccess />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <DormFieldSet title="Mevcut Yurt Bilgilerim" isDesired={false} values={currentDorm} onChange={handleCurrentDormChange} />
      <DormFieldSet title="İstediğim Yurt Bilgileri" isDesired={true} values={desiredDorm} onChange={handleDesiredDormChange} />
      
      <div className="bg-purple-50 border border-purple-200 p-4 sm:p-6 rounded-xl shadow-sm space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="currentDormDetails" className="block text-sm font-medium text-purple-800">Odanız Hakkında Ek Detaylar (İsteğe bağlı)</label>
          <textarea
            id="currentDormDetails"
            value={currentDormDetails}
            onChange={(e) => setCurrentDormDetails(e.target.value)}
            rows={3}
            className="mt-1 block w-full p-3 sm:p-4 bg-white border border-purple-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="Örn: Odam güney cepheli ve aydınlık."
          />
        </div>
        
        {/* Optional Room Details Section */}
        <div className="border-t border-gray-200 pt-4 sm:pt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <button
              type="button"
              onClick={() => setShowRoomDetails(!showRoomDetails)}
              className="flex items-center justify-between w-full text-left mb-4"
            >
              <div>
                <h3 className="text-sm font-medium text-green-800">Oda Detayları (İsteğe Bağlı)</h3>
                <p className="text-xs text-green-600 mt-1">İstersen oda detaylarını da girebilirsin</p>
              </div>
              <svg
                className={`w-5 h-5 text-green-500 transition-transform duration-200 ${showRoomDetails ? 'transform rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showRoomDetails && (
              <div className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="building" className="block text-sm font-medium text-gray-700">Bina</label>
                <select
                  id="building"
                  value={optionalRoomDetails.building || ''}
                  onChange={(e) => handleOptionalRoomDetailsChange('building', e.target.value)}
                  className="mt-1 block w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                >
                  <option value="">Bina seçin</option>
                  {getBuildingOptions(currentDorm.campus).map(building => (
                    <option key={building} value={building}>{building}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">Oda Numarası</label>
                <input
                  type="text"
                  id="roomNumber"
                  value={optionalRoomDetails.roomNumber || ''}
                  onChange={(e) => handleOptionalRoomDetailsChange('roomNumber', e.target.value)}
                  className="mt-1 block w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                  placeholder="Örn: 205, A-12"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={optionalRoomDetails.hasBathroom || false}
                    onChange={(e) => handleOptionalRoomDetailsChange('hasBathroom', e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Banyolu oda</span>
                </label>
              </div>
            </div>
          )}
          </div>
        </div>
        
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-purple-800">İletişim Bilgisi (Zorunlu)</label>
          <input
            type="text"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="mt-1 block w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-purple-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200"
            placeholder="Örn: Telegram: @kullaniciadi veya email@adresim.com"
            required
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {isSubmitting ? 'Kaydediliyor...' : (myListing ? 'İlanı Güncelle' : 'Talep Oluştur')}
        </button>
      </div>
    </form>
  );
};