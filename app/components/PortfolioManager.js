'use client'
import { useState } from 'react'

export default function PortfolioManager({ portfolio, setPortfolio, cryptoData, savePortfolio, loading }) {
  const [showPortfolioInput, setShowPortfolioInput] = useState(false)
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    amount: 0,
    buyPrice: 0
  })

  const addToPortfolio = () => {
    if (!newHolding.symbol || !newHolding.amount || !newHolding.buyPrice) return
    
    // Find the crypto in our data to get current price
    const crypto = cryptoData.find(c => 
      c.symbol.toLowerCase() === newHolding.symbol.toLowerCase() ||
      c.name.toLowerCase().includes(newHolding.symbol.toLowerCase())
    )
    
    if (!crypto) {
      alert('Cryptocurrency not found in our data')
      return
    }
    
    const holding = {
      id: crypto.id,
      symbol: crypto.symbol.toUpperCase(),
      name: crypto.name,
      amount: parseFloat(newHolding.amount),
      buyPrice: parseFloat(newHolding.buyPrice),
      currentPrice: crypto.current_price,
      image: crypto.image
    }
    
    const newPortfolio = [...portfolio, holding]
    setPortfolio(newPortfolio)
    savePortfolio(newPortfolio)
    setNewHolding({ symbol: '', amount: 0, buyPrice: 0 })
    setShowPortfolioInput(false)
  }

  const removeFromPortfolio = (index) => {
    const newPortfolio = [...portfolio]
    newPortfolio.splice(index, 1)
    setPortfolio(newPortfolio)
    savePortfolio(newPortfolio)
  }

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, holding) => {
      const crypto = cryptoData.find(c => c.id === holding.id)
      const currentPrice = crypto ? crypto.current_price : holding.currentPrice
      return total + (holding.amount * currentPrice)
    }, 0).toFixed(2)
  }

  const calculatePortfolioChange = () => {
    const totalInvested = portfolio.reduce((total, holding) => {
      return total + (holding.amount * holding.buyPrice)
    }, 0)
    
    const currentValue = parseFloat(calculatePortfolioValue())
    const change = ((currentValue - totalInvested) / totalInvested) * 100
    
    return isNaN(change) ? 0 : change.toFixed(2)
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Your Portfolio</h2>
        <button 
          onClick={() => setShowPortfolioInput(!showPortfolioInput)}
          className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
        >
          {showPortfolioInput ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showPortfolioInput && (
        <div className="mb-6 bg-gray-700 p-4 rounded-lg">
          <h3 className="font-medium mb-3">Add Cryptocurrency</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Symbol (e.g. BTC)</label>
              <input
                type="text"
                value={newHolding.symbol}
                onChange={(e) => setNewHolding({...newHolding, symbol: e.target.value})}
                className="w-full bg-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="BTC, ETH, etc."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Amount</label>
                <input
                  type="number"
                  value={newHolding.amount}
                  onChange={(e) => setNewHolding({...newHolding, amount: e.target.value})}
                  className="w-full bg-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  step="0.00000001"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Buy Price ($)</label>
                <input
                  type="number"
                  value={newHolding.buyPrice}
                  onChange={(e) => setNewHolding({...newHolding, buyPrice: e.target.value})}
                  className="w-full bg-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  step="0.01"
                />
              </div>
            </div>
            <button
              onClick={addToPortfolio}
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium"
              disabled={loading}
            >
              Add to Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Summary */}
      <div className="bg-gray-700 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-gray-300">Total Value</p>
          <p className="text-xl font-semibold">${calculatePortfolioValue()}</p>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-gray-300">24h Change</p>
          <p className={`text-lg font-medium ${calculatePortfolioChange() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {calculatePortfolioChange()}%
          </p>
        </div>
      </div>

      {/* Portfolio Holdings */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {portfolio.length > 0 ? (
          portfolio.map((holding, index) => {
            const crypto = cryptoData.find(c => c.id === holding.id)
            const currentPrice = crypto ? crypto.current_price : holding.currentPrice
            const value = holding.amount * currentPrice
            const change = ((currentPrice - holding.buyPrice) / holding.buyPrice) * 100
            
            return (
              <div key={index} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center space-x-2">
                    {holding.image && (
                      <img src={holding.image} alt={holding.name} className="w-6 h-6" />
                    )}
                    <p className="font-medium">{holding.symbol}</p>
                  </div>
                  <p className="font-semibold">${value.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <p>{holding.amount} {holding.symbol}</p>
                  <p className={change >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {isNaN(change) ? '0.00' : change.toFixed(2)}%
                  </p>
                </div>
                <button
                  onClick={() => removeFromPortfolio(index)}
                  className="mt-2 text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>No cryptocurrencies in your portfolio</p>
            <button 
              onClick={() => setShowPortfolioInput(true)}
              className="mt-2 text-blue-400 hover:text-blue-300"
            >
              Add your first holding
            </button>
          </div>
        )}
      </div>
    </>
  )
}