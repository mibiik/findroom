import React, { useState } from 'react';
import type { Listing, SpecificDormInfo, DesiredDormInfo } from '../types';
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

export const ListingForm: React.FC<ListingFormProps> = ({ onAddListing, myListing }) => {
  const [currentDorm, setCurrentDorm] = useState<SpecificDormInfo>(myListing?.currentDorm ?? initialCurrentDorm);
  const [desiredDorm, setDesiredDorm] = useState<DesiredDormInfo>(myListing?.desiredDorm ?? initialDesiredDorm);
  const [currentDormDetails, setCurrentDormDetails] = useState(myListing?.currentDormDetails ?? '');
  const [contactInfo, setContactInfo] = useState(myListing?.contactInfo ?? '');
  const [showForm, setShowForm] = useState(!myListing);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCurrentDormChange = <K extends keyof SpecificDormInfo>(field: K, value: SpecificDormInfo[K]) => {
    setCurrentDorm(prev => ({ ...prev, [field]: value }));
  };

  const handleDesiredDormChange = <K extends keyof DesiredDormInfo>(field: K, value: DesiredDormInfo[K]) => {
    setDesiredDorm(prev => ({ ...prev, [field]: value }));
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
      
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200 space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="currentDormDetails" className="block text-sm font-medium text-gray-700">Odanız Hakkında Ek Detaylar (İsteğe bağlı)</label>
          <textarea
            id="currentDormDetails"
            value={currentDormDetails}
            onChange={(e) => setCurrentDormDetails(e.target.value)}
            rows={3}
            className="mt-1 block w-full p-3 sm:p-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
            placeholder="Örn: Odam güney cepheli ve aydınlık."
          />
        </div>
        <div>
          <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700">İletişim Bilgisi (Zorunlu)</label>
          <input
            type="text"
            id="contactInfo"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            className="mt-1 block w-full h-10 sm:h-11 px-3 sm:px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
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