import React from 'react';
import type { SpecificDormInfo, DesiredDormInfo } from '../types';
import { GENDER_OPTIONS, CAMPUS_OPTIONS, CAPACITY_OPTIONS, BUNKBED_OPTIONS } from '../constants';

type DormInfo = SpecificDormInfo | DesiredDormInfo;

interface DormFieldSetProps<T extends DormInfo> {
  title: string;
  isDesired: boolean;
  values: T;
  onChange: <K extends keyof T>(field: K, value: T[K]) => void;
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
  onChange: (field: keyof T, value: T[keyof T]) => void;
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
      onChange={(e) => onChange(name, e.target.value as T[keyof T])}
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
  return (
    <fieldset className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200">
      <legend className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-5">{title}</legend>
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
          options={CAPACITY_OPTIONS}
          allowAny={isDesired}
        />
        <SelectInput
          label="Ranzalı mı?"
          name="bunkBed"
          value={String(values.bunkBed)}
          onChange={(field, value) => onChange(field, (value === 'true' ? true : value === 'false' ? false : 'any') as T[keyof T])}
          options={BUNKBED_OPTIONS}
          allowAny={isDesired}
        />
      </div>
    </fieldset>
  );
};