export interface CountryConfig {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
  placeholder: string;
  expectedDigits: number;
  secondaryDigits?: number;
  patternMessage: string;
  validateDigits: (digits: string) => string | null;
}

export const COUNTRIES: CountryConfig[] = [
  {
    code: 'AE',
    name: 'UAE / Dubai (+971)',
    dialCode: '+971',
    flag: '🇦🇪',
    placeholder: '50 123 4567',
    expectedDigits: 9,
    secondaryDigits: 8,
    patternMessage: '9 digits for mobile (starts with 5) or 8 for landline (starts with 4 for Dubai)',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (!/^\d+$/.test(digits)) return 'Digits only';
      if (digits.length === 9) {
        if (!digits.startsWith('5')) {
          return 'UAE mobile number must start with 5 (e.g. 50, 52, 54, 55, 56, 58)';
        }
        return null;
      }
      if (digits.length === 8) {
        if (!/^[234679]/.test(digits)) {
          return 'UAE landline must start with area code (e.g. 4 for Dubai, 2 for Abu Dhabi)';
        }
        return null;
      }
      if (digits.length < 9) {
        return `UAE number requires 9 digits for mobile (entered ${digits.length}/9 digits)`;
      }
      return 'UAE number cannot exceed 9 digits';
    },
  },
  {
    code: 'IN',
    name: 'India (+91)',
    dialCode: '+91',
    flag: '🇮🇳',
    placeholder: '98765 43210',
    expectedDigits: 10,
    patternMessage: '10 digits starting with 6, 7, 8, or 9',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (!/^\d+$/.test(digits)) return 'Digits only';
      if (digits.length < 10) {
        return `Indian phone number requires 10 digits (entered ${digits.length}/10 digits)`;
      }
      if (digits.length > 10) {
        return 'Indian phone number cannot exceed 10 digits';
      }
      if (!/^[6-9]/.test(digits)) {
        return 'Indian mobile numbers must start with 6, 7, 8, or 9';
      }
      return null;
    },
  },
  {
    code: 'SA',
    name: 'Saudi Arabia (+966)',
    dialCode: '+966',
    flag: '🇸🇦',
    placeholder: '50 123 4567',
    expectedDigits: 9,
    patternMessage: '9 digits starting with 5',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 9) return `Saudi phone number requires 9 digits (entered ${digits.length}/9)`;
      if (!digits.startsWith('5')) return 'Saudi mobile numbers must start with 5';
      return null;
    },
  },
  {
    code: 'QA',
    name: 'Qatar (+974)',
    dialCode: '+974',
    flag: '🇶🇦',
    placeholder: '3312 3456',
    expectedDigits: 8,
    patternMessage: '8 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 8) return `Qatar phone number requires 8 digits (entered ${digits.length}/8)`;
      return null;
    },
  },
  {
    code: 'OM',
    name: 'Oman (+968)',
    dialCode: '+968',
    flag: '🇴🇲',
    placeholder: '9123 4567',
    expectedDigits: 8,
    patternMessage: '8 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 8) return `Oman phone number requires 8 digits (entered ${digits.length}/8)`;
      return null;
    },
  },
  {
    code: 'KW',
    name: 'Kuwait (+965)',
    dialCode: '+965',
    flag: '🇰🇼',
    placeholder: '5123 4567',
    expectedDigits: 8,
    patternMessage: '8 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 8) return `Kuwait phone number requires 8 digits (entered ${digits.length}/8)`;
      return null;
    },
  },
  {
    code: 'BH',
    name: 'Bahrain (+973)',
    dialCode: '+973',
    flag: '🇧🇭',
    placeholder: '3612 3456',
    expectedDigits: 8,
    patternMessage: '8 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 8) return `Bahrain phone number requires 8 digits (entered ${digits.length}/8)`;
      return null;
    },
  },
  {
    code: 'GB',
    name: 'United Kingdom (+44)',
    dialCode: '+44',
    flag: '🇬🇧',
    placeholder: '7911 123456',
    expectedDigits: 10,
    secondaryDigits: 11,
    patternMessage: '10 or 11 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length < 10 || digits.length > 11) {
        return `UK phone number requires 10 or 11 digits (entered ${digits.length})`;
      }
      return null;
    },
  },
  {
    code: 'US',
    name: 'USA / Canada (+1)',
    dialCode: '+1',
    flag: '🇺🇸',
    placeholder: '202 555 0123',
    expectedDigits: 10,
    patternMessage: '10 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 10) return `US/Canada phone number requires 10 digits (entered ${digits.length}/10)`;
      return null;
    },
  },
  {
    code: 'AU',
    name: 'Australia (+61)',
    dialCode: '+61',
    flag: '🇦🇺',
    placeholder: '412 345 678',
    expectedDigits: 9,
    patternMessage: '9 digits starting with 4',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length !== 9) return `Australian phone number requires 9 digits (entered ${digits.length}/9)`;
      return null;
    },
  },
  {
    code: 'OTHER',
    name: 'Other Country (+)',
    dialCode: '+',
    flag: '🌐',
    placeholder: 'Enter country code & number',
    expectedDigits: 12,
    patternMessage: '7 to 15 digits',
    validateDigits: (digits: string) => {
      if (!digits) return 'Phone number is required';
      if (digits.length < 7 || digits.length > 15) {
        return 'Please enter 7 to 15 digits';
      }
      return null;
    },
  },
];

export function findCountryByDialCode(value: string): CountryConfig {
  const clean = (value || '').trim();
  for (const c of COUNTRIES) {
    if (c.code !== 'OTHER' && clean.startsWith(c.dialCode)) {
      return c;
    }
  }
  return COUNTRIES[0];
}

export function formatLocalDigits(digits: string, countryCode: string): string {
  if (!digits) return '';
  if (countryCode === 'AE' || countryCode === 'SA') {
    if (digits.length <= 2) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 9)}`;
  }
  if (countryCode === 'IN') {
    if (digits.length <= 5) return digits;
    return `${digits.slice(0, 5)} ${digits.slice(5, 10)}`;
  }
  if (countryCode === 'QA' || countryCode === 'OM' || countryCode === 'KW' || countryCode === 'BH') {
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)}`;
  }
  if (countryCode === 'US') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }
  return digits;
}

