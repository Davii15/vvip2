import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const exchangeRates = {
  USD: { name: "U.S. Dollar", buyingTT: 126.65, buyingCash: 126.65, selling: 131.65 },
  EUR: { name: "Euro", buyingTT: 130.32, buyingCash: 130.32, selling: 141.06 },
  GBP: { name: "Sterling Pound", buyingTT: 156.98, buyingCash: 156.98, selling: 168.59 },
  JPY: { name: "Japanese Yen", buyingTT: 0.8213, buyingCash: null, selling: 0.8713 },
  ZAR: { name: "South African Rand", buyingTT: 6.64, buyingCash: 6.64, selling: 7.37 },
  CHF: { name: "Swiss Franc", buyingTT: 138.02, buyingCash: null, selling: 148.93 },
  AUD: { name: "Australian Dollar", buyingTT: 77.04, buyingCash: null, selling: 86.23 },
  INR: { name: "Indian Rupee", buyingTT: 1.4574, buyingCash: null, selling: 1.5167 },
  CAD: { name: "Canadian Dollar", buyingTT: 85.34, buyingCash: null, selling: 95.54 },
  SEK: { name: "Swedish Krona", buyingTT: 11.49, buyingCash: null, selling: 13.73 },
  UGX: { name: "Uganda Shilling", buyingTT: 0.0318, buyingCash: null, selling: 0.039 },
  DKK: { name: "Danish Krone", buyingTT: 17.25, buyingCash: null, selling: 19.76 },
  TZS: { name: "Tanzania Shilling", buyingTT: 0.0434, buyingCash: null, selling: 0.0577 },
  AED: { name: "UAE Dirham", buyingTT: 33.98, buyingCash: null, selling: 36.85 },
  RWF: { name: "Rwandese Francs", buyingTT: 0.075, buyingCash: null, selling: 0.0975 },
  SSP: { name: "South Sudanese Pound", buyingTT: 0.0291, buyingCash: null, selling: 0.031 },
  CNY: { name: "Chinese Yuan", buyingTT: 15.82, buyingCash: 15.52, selling: 20.63 },
  KES: { name: "Kenyan Shilling", buyingTT: 1, buyingCash: 1, selling: 1 },
}

const currencyPairs = {
  "EUR/USD": { buying: 1.0492, selling: 1.0493 },
  "USD/JPY": { buying: 151.7, selling: 151.71 },
  "GBP/USD": { buying: 1.2592, selling: 1.2594 },
  "USD/CHF": { buying: 0.9002, selling: 0.9004 },
  "USD/CAD": { buying: 1.417, selling: 1.4172 },
  "AUD/USD": { buying: 0.6364, selling: 0.6365 },
  "NZD/USD": { buying: 0.5735, selling: 0.5737 },
}

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>("")
  const [fromCurrency, setFromCurrency] = useState<string>("USD")
  const [toCurrency, setToCurrency] = useState<string>("KES")
  const [result, setResult] = useState<string>("")

  const handleConvert = () => {
    if (!amount || isNaN(Number(amount))) {
      setResult("Invalid amount")
      return
    }

    const numericAmount = Number(amount)

    if (fromCurrency === toCurrency) {
      setResult(amount)
      return
    }

    if (fromCurrency === "KES" || toCurrency === "KES") {
      // Handle conversions involving KES
      if (fromCurrency === "KES") {
        const rate = exchangeRates[toCurrency as keyof typeof exchangeRates].buyingTT
        setResult((numericAmount / rate).toFixed(4))
      } else {
        const rate = exchangeRates[fromCurrency as keyof typeof exchangeRates].selling
        setResult((numericAmount * rate).toFixed(4))
      }
    } else {
      // Convert both currencies to KES first, then to the target currency
      const fromRate = exchangeRates[fromCurrency as keyof typeof exchangeRates].selling
      const toRate = exchangeRates[toCurrency as keyof typeof exchangeRates].buyingTT
      const kesAmount = numericAmount * fromRate
      const convertedAmount = kesAmount / toRate
      setResult(convertedAmount.toFixed(4))
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Currency Converter</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="fromCurrency" className="block text-sm font-medium text-gray-700">
              From
            </label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger id="fromCurrency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(exchangeRates).map(([code, { name }]) => (
                  <SelectItem key={code} value={code}>{`${code} - ${name}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="toCurrency" className="block text-sm font-medium text-gray-700">
              To
            </label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger id="toCurrency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(exchangeRates).map(([code, { name }]) => (
                  <SelectItem key={code} value={code}>{`${code} - ${name}`}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleConvert} className="w-full">
          Convert
        </Button>
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <p className="text-lg font-semibold">{`${amount} ${fromCurrency} = ${result} ${toCurrency}`}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CurrencyConverter

