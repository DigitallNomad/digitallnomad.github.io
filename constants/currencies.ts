export interface Currency {
  code: string;
  symbol: string;
  country: string;
}

export const currencies: Currency[] = [
  { code: "USD", symbol: "$", country: "United States" },
  { code: "EUR", symbol: "€", country: "European Union" },
  { code: "GBP", symbol: "£", country: "United Kingdom" },
  { code: "JPY", symbol: "¥", country: "Japan" },
  { code: "CNY", symbol: "¥", country: "China" },
  { code: "INR", symbol: "₹", country: "India" },
  { code: "AUD", symbol: "A$", country: "Australia" },
  { code: "CAD", symbol: "C$", country: "Canada" },
  { code: "CHF", symbol: "Fr", country: "Switzerland" },
  { code: "HKD", symbol: "HK$", country: "Hong Kong" },
  { code: "SGD", symbol: "S$", country: "Singapore" },
  { code: "KRW", symbol: "₩", country: "South Korea" },
  { code: "MXN", symbol: "Mex$", country: "Mexico" },
  { code: "BRL", symbol: "R$", country: "Brazil" },
  { code: "ZAR", symbol: "R", country: "South Africa" },
  { code: "RUB", symbol: "₽", country: "Russia" },
  { code: "SEK", symbol: "kr", country: "Sweden" },
  { code: "NOK", symbol: "kr", country: "Norway" },
  { code: "DKK", symbol: "kr", country: "Denmark" },
  { code: "PLN", symbol: "zł", country: "Poland" },
  { code: "THB", symbol: "฿", country: "Thailand" },
  { code: "IDR", symbol: "Rp", country: "Indonesia" },
  { code: "MYR", symbol: "RM", country: "Malaysia" },
  { code: "PHP", symbol: "₱", country: "Philippines" },
  { code: "NZD", symbol: "NZ$", country: "New Zealand" },
  { code: "AED", symbol: "د.إ", country: "UAE" },
  { code: "SAR", symbol: "﷼", country: "Saudi Arabia" },
  { code: "TRY", symbol: "₺", country: "Turkey" },
  { code: "ARS", symbol: "$", country: "Argentina" },
  { code: "CLP", symbol: "$", country: "Chile" },
];
