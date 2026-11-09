import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ChevronDown, CheckCircle2, AlertCircle, Phone } from 'lucide-react';
import { COUNTRIES, type CountryConfig, findCountryByDialCode, formatLocalDigits } from './countries';
import './InternationalPhoneInput.css';

export interface InternationalPhoneInputProps {
  id?: string;
  value?: string;
  onChange: (fullPhoneNumber: string, isValid: boolean) => void;
  error?: string;
  defaultCountryCode?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const InternationalPhoneInput: React.FC<InternationalPhoneInputProps> = React.memo(({
  id = 'phone-input',
  value = '',
  onChange,
  error,
  defaultCountryCode = 'IN',
  disabled = false,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(() => {
    if (value) {
      return findCountryByDialCode(value);
    }
    const found = COUNTRIES.find((c) => c.code === defaultCountryCode);
    return found || COUNTRIES[0];
  });

  const [localDigits, setLocalDigits] = useState<string>(() => {
    if (!value) return '';
    const clean = value.replace(/\s+/g, '');
    if (clean.startsWith(selectedCountry.dialCode)) {
      return clean.slice(selectedCountry.dialCode.length).replace(/\D/g, '');
    }
    return clean.replace(/\D/g, '');
  });

  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [isTouched, setIsTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const menuEl = menuRef.current;
    if (!menuEl || !isOpenDropdown) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const listEl = listRef.current;
      if (listEl) {
        listEl.scrollTop += e.deltaY;
      }
    };

    menuEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      menuEl.removeEventListener('wheel', handleWheel);
    };
  }, [isOpenDropdown]);

  useEffect(() => {
    if (value) {
      const detected = findCountryByDialCode(value);
      setSelectedCountry(detected);
      const clean = value.replace(/\s+/g, '');
      if (clean.startsWith(detected.dialCode)) {
        setLocalDigits(clean.slice(detected.dialCode.length).replace(/\D/g, ''));
      }
    }
  }, [value]);

  const validationError = useMemo(() => {
    if (!localDigits && !isTouched) return null;
    return selectedCountry.validateDigits(localDigits);
  }, [localDigits, selectedCountry, isTouched]);

  const isValid = useMemo(() => {
    return !selectedCountry.validateDigits(localDigits);
  }, [localDigits, selectedCountry]);

  const formattedDigits = useMemo(() => {
    return formatLocalDigits(localDigits, selectedCountry.code);
  }, [localDigits, selectedCountry.code]);

  const maxAllowedDigits = useMemo(() => {
    return selectedCountry.secondaryDigits && selectedCountry.secondaryDigits > selectedCountry.expectedDigits
      ? selectedCountry.secondaryDigits
      : selectedCountry.expectedDigits;
  }, [selectedCountry]);

  const handleCountryChange = useCallback((country: CountryConfig) => {
    setSelectedCountry(country);
    setIsOpenDropdown(false);
    setCountrySearch('');
    setIsTouched(true);

    const fullVal = `${country.dialCode} ${formatLocalDigits(localDigits, country.code)}`.trim();
    const valid = !country.validateDigits(localDigits);
    onChange(fullVal, valid);
  }, [localDigits, onChange]);

  const handleDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setIsTouched(true);

    if (raw.includes('+')) {
      const detected = findCountryByDialCode(raw);
      setSelectedCountry(detected);
      const digitsOnly = raw.replace(/\D/g, '');
      const dialCodeDigits = detected.dialCode.replace(/\D/g, '');
      const rest = digitsOnly.startsWith(dialCodeDigits) ? digitsOnly.slice(dialCodeDigits.length) : digitsOnly;
      const capped = rest.slice(0, maxAllowedDigits);
      setLocalDigits(capped);
      const full = `${detected.dialCode} ${formatLocalDigits(capped, detected.code)}`.trim();
      onChange(full, !detected.validateDigits(capped));
      return;
    }

    const digitsOnly = raw.replace(/\D/g, '').slice(0, maxAllowedDigits);
    setLocalDigits(digitsOnly);
    const full = `${selectedCountry.dialCode} ${formatLocalDigits(digitsOnly, selectedCountry.code)}`.trim();
    onChange(full, !selectedCountry.validateDigits(digitsOnly));
  };

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(ev.target as Node)) {
        setIsOpenDropdown(false);
      }
    };
    if (isOpenDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpenDropdown]);

  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return COUNTRIES;
    const q = countrySearch.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [countrySearch]);

  const currentCount = localDigits.length;
  const targetCount = selectedCountry.expectedDigits;

  return (
    <div className="intl-phone-container">
      <div
        className={`intl-phone-box ${error || (isTouched && validationError) ? 'has-error' : ''} ${
          isValid && localDigits ? 'is-valid' : ''
        } ${disabled ? 'is-disabled' : ''}`}
      >
        <div className="intl-country-picker" ref={dropdownRef}>
          <button
            type="button"
            className="intl-country-btn"
            onClick={() => !disabled && setIsOpenDropdown((prev) => !prev)}
            disabled={disabled}
            aria-label="Select country code"
            aria-expanded={isOpenDropdown}
          >
            <span className="intl-flag">{selectedCountry.flag}</span>
            <span className="intl-dialcode">{selectedCountry.dialCode}</span>
            <ChevronDown size={14} className={`intl-chevron ${isOpenDropdown ? 'open' : ''}`} />
          </button>

          {isOpenDropdown && (
            <div
              ref={menuRef}
              className="intl-dropdown-menu"
              data-lenis-prevent="true"
              data-lenis-prevent-wheel="true"
              data-lenis-prevent-touch="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="intl-dropdown-search">
                <input
                  type="text"
                  placeholder="Search country or code..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  autoFocus
                />
              </div>
              <div
                ref={listRef}
                className="intl-dropdown-list"
                data-lenis-prevent="true"
                data-lenis-prevent-wheel="true"
                data-lenis-prevent-touch="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                {filteredCountries.map((c) => {
                  const isCurrent = c.code === selectedCountry.code;
                  return (
                    <button
                      key={c.code}
                      type="button"
                      className={`intl-dropdown-item ${isCurrent ? 'selected' : ''}`}
                      onClick={() => handleCountryChange(c)}
                    >
                      <span className="item-flag">{c.flag}</span>
                      <span className="item-name">{c.name}</span>
                      <span className="item-code">{c.dialCode}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="intl-input-divider" />

        <div className="intl-input-field-wrap">
          <input
            id={id}
            type="tel"
            inputMode="numeric"
            value={formattedDigits}
            onChange={handleDigitsChange}
            onBlur={() => setIsTouched(true)}
            placeholder={selectedCountry.placeholder}
            disabled={disabled}
            className="intl-native-input"
            autoComplete="tel"
          />
        </div>

        <div className="intl-status-indicator">
          {isValid && localDigits ? (
            <CheckCircle2 size={16} className="status-icon status-icon--success" />
          ) : (
            <Phone size={15} className="status-icon status-icon--neutral" />
          )}
        </div>
      </div>

      <div className="intl-phone-footer">
        <div className="intl-phone-feedback">
          {error || (isTouched && validationError) ? (
            <div className="feedback-error">
              <AlertCircle size={13} />
              <span>{error || validationError}</span>
            </div>
          ) : isValid && localDigits ? (
            <div className="feedback-success">
              <CheckCircle2 size={13} />
              <span>Verified format for {selectedCountry.name}</span>
            </div>
          ) : (
            <span className="feedback-hint">
              {selectedCountry.code === 'IN'
                ? 'India: Enter 10-digit mobile number starting with 6, 7, 8, or 9'
                : selectedCountry.code === 'AE'
                ? 'Dubai/UAE: Enter 9-digit mobile (starts with 5) or 8-digit landline'
                : selectedCountry.patternMessage}
            </span>
          )}
        </div>

        <div className="intl-digit-counter">
          <span className={`counter-badge ${isValid ? 'counter-badge--full' : ''}`}>
            {currentCount}/{targetCount} digits
          </span>
        </div>
      </div>
    </div>
  );
});

InternationalPhoneInput.displayName = 'InternationalPhoneInput';
