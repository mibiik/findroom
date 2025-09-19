import React from 'react';
import type { SpecificDormInfo, DesiredDormInfo } from '../types';
import { GENDER_OPTIONS, CAMPUS_OPTIONS, CAPACITY_OPTIONS, DESIRED_CAPACITY_OPTIONS, BUNKBED_OPTIONS } from '../constants';

type DormInfo = SpecificDormInfo | DesiredDormInfo;

interface DormFieldSetProps<T extends DormInfo> {
  title: string;
  isDesired: boolean;
  values: T;
  onChange: (field: keyof T, value: any) => void;
}

const SelectInput = <T,>({
  label,
  name,
  value,
  onChange,
  options,
  allowAny = false,
}: {
  label: string;
  name: keyof T;
  value: T[keyof T];
  onChange: (field: keyof T, value: any) => void;
  options: { value: string; label: string }[];
  allowAny?: boolean;
}) => (
  <div>
    <label htmlFor={String(name)} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <select
      id={String(name)}
      name={String(name)}
      value={value as string}
      onChange={(e) => onChange(name, e.target.value)}
      className="mt-1 block w-full h-11 px-4 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
    >
      {allowAny && <option value="any">Farketmez</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export const DormFieldSet = <T extends DormInfo>({ title, isDesired, values, onChange }: DormFieldSetProps<T>) => {
  // Mevcut yurt için mavi pastel, istenilen yurt için pembe pastel
  const bgColor = isDesired ? 'bg-pink-50' : 'bg-blue-50';
  const borderColor = isDesired ? 'border-pink-200' : 'border-blue-200';
  const titleColor = isDesired ? 'text-pink-800' : 'text-blue-800';
  
  return (
    <fieldset className={`${bgColor} p-4 sm:p-6 rounded-xl shadow-sm border ${borderColor}`}>
      <legend className={`text-base sm:text-lg font-bold ${titleColor} mb-4 sm:mb-5`}>{title}</legend>
      
      {isDesired && (
        <div className="mb-4 p-3 bg-pink-100 border border-pink-300 rounded-lg">
          <p className="text-xs text-pink-700">
            Birden fazla oda tipi istiyorsanız "Birden fazla seçenek uygun" seçeneğini kullanabilir ve detayları aşağıda belirtebilirsiniz.
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <SelectInput
          label="Yurt Tipi"
          name="gender"
          value={values.gender}
          onChange={onChange}
          options={GENDER_OPTIONS}
          allowAny={isDesired}
        />
        <SelectInput
          label="Kampüs"
          name="campus"
          value={values.campus}
          onChange={onChange}
          options={CAMPUS_OPTIONS}
          allowAny={isDesired}
        />
        <SelectInput
          label="Oda Kapasitesi"
          name="capacity"
          value={values.capacity}
          onChange={onChange}
          options={isDesired ? DESIRED_CAPACITY_OPTIONS : CAPACITY_OPTIONS}
          allowAny={isDesired}
        />
        <SelectInput
          label="Ranzalı mı?"
          name="bunkBed"
          value={String(values.bunkBed)}
          onChange={(field, value) => onChange(field, value === 'true' ? true : value === 'false' ? false : 'any')}
          options={BUNKBED_OPTIONS}
          allowAny={isDesired}
        />
      </div>
      
      {/* Multiple room type preferences */}
      {isDesired && values.capacity === 'multiple' && (
        <div className="mt-4">
          <label className="block text-sm font-medium text-pink-800 mb-3">
            Hangi oda tipleri uygun? (Birden fazla seçebilirsiniz)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CAPACITY_OPTIONS.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(values as DesiredDormInfo).preferredCapacities?.includes(option.value as Capacity) || false}
                  onChange={(e) => {
                    const currentPrefs = (values as DesiredDormInfo).preferredCapacities || [];
                    const newPrefs = e.target.checked
                      ? [...currentPrefs, option.value as Capacity]
                      : currentPrefs.filter(cap => cap !== option.value);
                    onChange('preferredCapacities' as keyof T, newPrefs);
                  }}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-pink-300 rounded"
                />
                <span className="text-sm text-pink-700">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
};