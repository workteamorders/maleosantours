'use client';

/**
 * Currency Context & Components
 * - Default currency: IDR (Rupiah)
 * - Supports conversion to USD, EUR, CNY
 * - Prices in database are stored in IDR
 */

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// Approximate exchange rates (IDR base)
// These are static fallback rates. For production, use a live API.
const EXCHANGE_RATES: Record<string, number> = {
  IDR: 1,
  USD: 0.0000625,  // 1 IDR = ~0.0000625 USD (1 USD = ~16,000 IDR)
  EUR: 0.0000575,  // 1 IDR = ~0.0000575 EUR (1 EUR = ~17,400 IDR)
  CNY: 0.000455,   // 1 IDR = ~0.000455 CNY (1 CNY = ~2,200 IDR)
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  IDR: 'Rp',
  USD: '$',
  EUR: '€',
  CNY: '¥',
};

const CURRENCY_LABELS: Record<string, string> = {
  IDR: 'IDR - Rupiah',
  USD: 'USD - US Dollar',
  EUR: 'EUR - Euro',
  CNY: 'CNY - Yuan',
};

export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'CNY';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceInIDR: number) => string;
  symbol: string;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: 'IDR',
  setCurrency: () => {},
  formatPrice: (p) => `Rp ${p.toLocaleString('id-ID')}`,
  symbol: 'Rp',
});

export function useCurrency() {
  return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<CurrencyCode>('IDR');

  const formatPrice = useCallback(
    (priceInIDR: number) => {
      const rate = EXCHANGE_RATES[currency] || 1;
      const converted = priceInIDR * rate;
      const sym = CURRENCY_SYMBOLS[currency] || currency;

      if (currency === 'IDR') {
        return `${sym} ${Math.round(converted).toLocaleString('id-ID')}`;
      }
      // For foreign currencies, show 2 decimal places
      return `${sym} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    },
    [currency]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        symbol: CURRENCY_SYMBOLS[currency] || currency,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

/**
 * CurrencySelector - Dropdown to switch currency
 * Place this in the Navbar or anywhere visible
 */
export function CurrencySelector({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      className={`bg-transparent border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${className || ''}`}
      aria-label="Select currency"
    >
      {Object.entries(CURRENCY_LABELS).map(([code, label]) => (
        <option key={code} value={code}>
          {CURRENCY_SYMBOLS[code]} {code}
        </option>
      ))}
    </select>
  );
}

/**
 * PriceDisplay - Client component that shows price in selected currency
 * Takes price in IDR (database value) and converts to selected currency
 */
export function PriceDisplay({
  priceIDR,
  priceUnit,
  className,
}: {
  priceIDR: number;
  priceUnit?: string | null;
  className?: string;
}) {
  const { formatPrice } = useCurrency();

  return (
    <span className={className || 'text-lg font-semibold text-blue-600'}>
      {formatPrice(priceIDR)}
      {priceUnit && (
        <span className="text-sm text-gray-500 ml-1">/ {priceUnit}</span>
      )}
    </span>
  );
}
