'use client'

export default function CryptoList({ cryptoData, selectedCrypto, setSelectedCrypto, loading }) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Top Cryptocurrencies</h2>
      <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2">
        {cryptoData.map((crypto) => (
          <div 
            key={crypto.id}
            className={`p-4 rounded-lg cursor-pointer transition-all ${selectedCrypto?.id === crypto.id ? 'bg-purple-900' : 'bg-gray-700 hover:bg-gray-600'}`}
            onClick={() => setSelectedCrypto(crypto)}
          >
            <div className="flex items-center space-x-3">
              <img src={crypto.image} alt={crypto.name} className="w-8 h-8" />
              <div className="flex-1">
                <h3 className="font-medium">{crypto.name}</h3>
                <p className="text-sm text-gray-400">{crypto.symbol.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${crypto.current_price.toLocaleString()}</p>
                <p className={`text-sm ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {crypto.price_change_percentage_24h?.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}