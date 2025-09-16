import React from 'react';
import type { FilterCriteria } from '../types';
import { GENDER_OPTIONS, CAMPUS_OPTIONS, CAPACITY_OPTIONS } from '../constants';
import { SearchIcon } from './icons';

interface FilterPanelProps {
  filters: FilterCriteria;
  onFilterChange: <K extends keyof FilterCriteria>(key: K, value: FilterCriteria[K]) => void;
  onReset: () => void;
}

const SelectInput = ({ label, value, onChange, options, placeholder }: { label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, options: {value: string, label: string}[], placeholder: string }) => (
    <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="block w-full h-9 sm:h-11 px-2 sm:px-4 bg-white border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200">
            <option value="any">{placeholder}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    </div>
);

const RadioGroup = ({ label, value, onChange, options }: { label: string, value: string, onChange: (val: string) => void, options: {value: string, label: string}[] }) => (
    <div>
        <label className="block text-xs sm:text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1 sm:mt-2 flex flex-wrap items-center gap-1 sm:gap-2">
             <button onClick={() => onChange('any')} className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${value === 'any' ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>Farketmez</button>
            {options.map(opt => (
                <button key={opt.value} onClick={() => onChange(opt.value)} className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${value === opt.value ? 'bg-indigo-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}>{opt.label}</button>
            ))}
        </div>
    </div>
);


export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFilterChange, onReset }) => {
  return (
    <div className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-gray-200 mb-4 sm:mb-8">
      <div className="flex items-center mb-3 sm:mb-5">
        <SearchIcon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 mr-2 sm:mr-3"/>
        <h2 className="text-base sm:text-xl font-bold text-gray-900">Filtrele</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <SelectInput 
            label="Yurt Tipi" 
            value={filters.gender}
            onChange={(e) => onFilterChange('gender', e.target.value as FilterCriteria['gender'])}
            options={GENDER_OPTIONS}
            placeholder="Tümü"
        />
        <SelectInput 
            label="Kampüs" 
            value={filters.campus}
            onChange={(e) => onFilterChange('campus', e.target.value as FilterCriteria['campus'])}
            options={CAMPUS_OPTIONS}
            placeholder="Tümü"
        />
        <SelectInput 
            label="Oda Kapasitesi"
            value={filters.capacity}
            onChange={(e) => onFilterChange('capacity', e.target.value as FilterCriteria['capacity'])}
            options={CAPACITY_OPTIONS}
            placeholder="Tümü"
        />
        <RadioGroup
            label="Ranzalı mı?"
            value={String(filters.bunkBed)}
            onChange={(val) => onFilterChange('bunkBed', val === 'any' ? 'any' : val === 'true')}
            options={[{value: 'true', label: 'Evet'}, {value: 'false', label: 'Hayır'}]}
        />
      </div>
       <div className="mt-3 sm:mt-6 flex justify-end pt-2 sm:pt-4 border-t border-gray-200">
         <button 
           onClick={onReset}
           className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
         >
           Sıfırla
         </button>
       </div>
    </div>
  );
};