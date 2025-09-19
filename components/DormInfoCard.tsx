
import React from 'react';
import type { SpecificDormInfo, DesiredDormInfo } from '../types';
import { HomeIcon, BuildingIcon, UserGroupIcon, BedIcon } from './icons';

interface DormInfoCardProps {
    info: SpecificDormInfo | DesiredDormInfo;
    title: string;
}

const isSpecificDormInfo = (info: any): info is SpecificDormInfo => {
    return info.bunkBed !== 'any';
};


const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | React.ReactNode }) => (
    <div className="flex items-center space-x-2 sm:space-x-3">
        <div className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-indigo-500">{icon}</div>
        <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-500">{label}</p>
            <p className="text-sm sm:text-base font-semibold text-gray-800 truncate">{value}</p>
        </div>
    </div>
);

export const DormInfoCard: React.FC<DormInfoCardProps> = ({ info, title }) => {
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 h-full">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-5">{title}</h3>
            <div className="space-y-3 sm:space-y-4">
                <DetailItem
                    icon={<UserGroupIcon />}
                    label="Yurt Tipi"
                    value={info.gender === 'any' ? 'Farketmez' : info.gender}
                />
                <DetailItem
                    icon={<BuildingIcon />}
                    label="Kampüs"
                    value={info.campus === 'any' ? 'Farketmez' : info.campus}
                />
                <DetailItem
                    icon={<HomeIcon />}
                    label="Oda Kapasitesi"
                    value={
                        info.capacity === 'any' 
                            ? 'Farketmez' 
                            : info.capacity === 'multiple' 
                                ? (info as DesiredDormInfo).preferredCapacities && (info as DesiredDormInfo).preferredCapacities!.length > 0
                                    ? (info as DesiredDormInfo).preferredCapacities!.join(', ')
                                    : 'Birden fazla seçenek uygun'
                                : info.capacity
                    }
                />
                <DetailItem
                    icon={<BedIcon />}
                    label="Ranzalı mı?"
                    value={
                        info.bunkBed === 'any'
                            ? 'Farketmez'
                            : isSpecificDormInfo(info)
                                ? (info.bunkBed ? 'Evet' : 'Hayır')
                                : (info.bunkBed ? 'Evet' : 'Hayır')
                    }
                />
            </div>
        </div>
    );
};