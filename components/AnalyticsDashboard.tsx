import React, { useState, useEffect } from 'react';
import type { Analytics, UserStats, RoomStats, RoommateStats } from '../types';
import { ChartBarIcon, UsersIcon, HomeIcon, ClockIcon, UserIcon } from './icons';
import { getRoomStats, getRoommateStats, getRoommateMatches, getDormSwapMatches } from '../firebase/firestoreService';

interface AnalyticsDashboardProps {
  analytics: Analytics;
  userStats: UserStats;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  analytics,
  userStats
}) => {
  const [roomStats, setRoomStats] = useState<RoomStats | null>(null);
  const [roommateStats, setRoommateStats] = useState<RoommateStats | null>(null);
  const [roommateMatches, setRoommateMatches] = useState<any>(null);
  const [dormSwapMatches, setDormSwapMatches] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        console.log('Loading room and roommate stats...');
        const [roomData, roommateData, matchesData, swapMatchesData] = await Promise.all([
          getRoomStats(),
          getRoommateStats(),
          getRoommateMatches(),
          getDormSwapMatches()
        ]);
        console.log('Room stats loaded:', roomData);
        console.log('Roommate stats loaded:', roommateData);
        console.log('Roommate matches loaded:', matchesData);
        console.log('Dorm swap matches loaded:', swapMatchesData);
        setRoomStats(roomData);
        setRoommateStats(roommateData);
        setRoommateMatches(matchesData);
        setDormSwapMatches(swapMatchesData);
      } catch (error) {
        console.error('Error loading stats:', error);
        // Hata durumunda boş veriler set et
        setRoomStats({
          totalRooms: 0,
          roomsByGender: [],
          roomsByCampus: [],
          roomsByCapacity: [],
          roomsWithBunkBed: 0,
          roomsWithoutBunkBed: 0
        });
        setRoommateStats({
          totalRoommateSearches: 0,
          searchesByCampus: [],
          searchesByBuilding: [],
          recentSearches: []
        });
        setRoommateMatches({
          totalMatches: 0,
          totalPeopleMatched: 0,
          matchedRooms: []
        });
        setDormSwapMatches({
          totalMatches: 0,
          matchedPairs: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };


  return (
    <div className="space-y-6">
      {/* Sizin İstatistikleriniz - Daire Grafiği */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-sm border border-indigo-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <div className="w-6 h-6 bg-indigo-500 rounded-full mr-3 flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
          Sizin İstatistikleriniz
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Oluşturduğunuz İlanlar */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(userStats.listingsCreated / Math.max(userStats.listingsCreated, 1)) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">{userStats.listingsCreated}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-700 text-center">Oluşturduğunuz İlanlar</h4>
          </div>

          {/* Bulunan Eşleşmeler */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(userStats.matchesFound / Math.max(userStats.matchesFound, 1)) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">{userStats.matchesFound}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-700 text-center">Bulunan Eşleşmeler</h4>
          </div>

          {/* Başarılı Değişimler */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#8b5cf6"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(userStats.successfulSwaps / Math.max(userStats.successfulSwaps, 1)) * 251.2} 251.2`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">{userStats.successfulSwaps}</span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-700 text-center">Başarılı Değişimler</h4>
          </div>
        </div>
      </div>

      {/* Genel İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HomeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam İlan</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(analytics.totalListings)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcı</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(roommateStats?.totalRoommateSearches || 0)}
              </p>
            </div>
          </div>
        </div>


        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UsersIcon className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Yurt Değişim Eşleşmeleri</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(dormSwapMatches?.totalMatches || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popüler Yurtlar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">En Popüler Yurtlar</h3>
        <div className="space-y-3">
          {analytics.popularDorms.slice(0, 5).map((dorm, index) => (
            <div key={dorm.dorm} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">{index + 1}</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{dorm.dorm}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-500 h-2 rounded-full"
                    style={{
                      width: `${(dorm.count / analytics.popularDorms[0].count) * 100}%`
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">{dorm.count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>



      {/* Oda Arkadaşı Arama İstatistikleri */}
      {roommateStats && roommateMatches && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Oda Arkadaşı Arama İstatistikleri</h3>
          
          {/* Eşleşme İstatistikleri */}
          <div className="mb-6">
            <h4 className="text-md font-medium text-gray-700 mb-4">Eşleşme Durumu</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <HomeIcon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-600">Eşleşen Oda Sayısı</p>
                    <p className="text-xl font-bold text-green-900">{roommateMatches.totalMatches}</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <UsersIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-blue-600">Eşleşen Kişi Sayısı</p>
                    <p className="text-xl font-bold text-blue-900">{roommateMatches.totalPeopleMatched}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <ChartBarIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-purple-600">Ortalama Oda Başına</p>
                    <p className="text-xl font-bold text-purple-900">
                      {roommateMatches.totalMatches > 0 ? 
                        Math.round(roommateMatches.totalPeopleMatched / roommateMatches.totalMatches * 10) / 10 : 0
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arama Dağılımları */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Kampüse Göre Arama</h4>
              {roommateStats.searchesByCampus.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.campus}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700">Binaya Göre Arama</h4>
              {roommateStats.searchesByBuilding.slice(0, 5).map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.building}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Günlük Aktivite Grafiği */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Son 7 Gün Aktivite</h3>
        <div className="space-y-2">
          {analytics.dailyActivity.slice(-7).map((day, index) => (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="w-16 text-sm text-gray-600">
                {new Date(day.date).toLocaleDateString('tr-TR', { weekday: 'short' })}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-12">İlanlar:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${(day.listings / Math.max(...analytics.dailyActivity.map(d => d.listings))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{day.listings}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 w-12">Eşleşme:</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{
                        width: `${(day.matches / Math.max(...analytics.dailyActivity.map(d => d.matches))) * 100}%`
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-8">{day.matches}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Oda İstatistikleri */}
      {loading ? (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : roomStats && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Oda İstatistikleri</h3>
          
          {/* Toplam Oda Sayısı */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Toplam Oda Sayısı</span>
              <span className="text-2xl font-bold text-indigo-600">{roomStats.totalRooms}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cinsiyet Dağılımı */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Cinsiyet Dağılımı</h4>
              <div className="space-y-2">
                {roomStats.roomsByGender.map((item) => (
                  <div key={item.gender} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.gender}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-pink-500 h-2 rounded-full"
                          style={{
                            width: `${roomStats.totalRooms > 0 ? (item.count / roomStats.totalRooms) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kampüs Dağılımı */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Kampüs Dağılımı</h4>
              <div className="space-y-2">
                {roomStats.roomsByCampus.map((item) => (
                  <div key={item.campus} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.campus}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${roomStats.totalRooms > 0 ? (item.count / roomStats.totalRooms) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kapasite Dağılımı */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Kapasite Dağılımı</h4>
              <div className="space-y-2">
                {roomStats.roomsByCapacity.map((item) => (
                  <div key={item.capacity} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.capacity}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${roomStats.totalRooms > 0 ? (item.count / roomStats.totalRooms) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-500 w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ranza Durumu */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Ranza Durumu</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ranzalı Odalar</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{
                          width: `${roomStats.totalRooms > 0 ? (roomStats.roomsWithBunkBed / roomStats.totalRooms) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{roomStats.roomsWithBunkBed}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Ranzasız Odalar</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{
                          width: `${roomStats.totalRooms > 0 ? (roomStats.roomsWithoutBunkBed / roomStats.totalRooms) * 100 : 0}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">{roomStats.roomsWithoutBunkBed}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
