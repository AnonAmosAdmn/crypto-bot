'use client'
import { useState, useEffect } from 'react'
import CryptoList from './components/CryptoList'
import PortfolioManager from './components/PortfolioManager'
import ChatInterface from './components/ChatInterface'
import AnalysisPanel from './components/AnalysisPanel'
import { fetchCryptoData } from './lib/api'
import { Cryptocurrency, CryptoHolding } from './types'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Welcome to Crypto AI Analyst')
  const [cryptoData, setCryptoData] = useState<Cryptocurrency[]>([])
  const [selectedCrypto, setSelectedCrypto] = useState<Cryptocurrency | null>(null)
  const [portfolio, setPortfolio] = useState<CryptoHolding[]>([])
  const [activeTab, setActiveTab] = useState<'analysis' | 'chat'>('analysis')

  // Fetch crypto data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const data = await fetchCryptoData()
        setCryptoData(data)
        setMessage('Loaded top cryptocurrencies')
      } catch (error) {
        setMessage('Failed to fetch crypto data')
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
    loadPortfolio()
  }, [])

  const loadPortfolio = () => {
    if (typeof window !== 'undefined') {
      const savedPortfolio = localStorage.getItem('cryptoPortfolio')
      if (savedPortfolio) {
        try {
          const parsed = JSON.parse(savedPortfolio) as CryptoHolding[]
          setPortfolio(parsed)
        } catch (error) {
          console.error('Error parsing portfolio:', error)
        }
      }
    }
  }

  const savePortfolio = (newPortfolio: CryptoHolding[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cryptoPortfolio', JSON.stringify(newPortfolio))
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
          Crypto AI Analyst
        </h1>
        <p className="text-lg text-gray-300">{message}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Crypto List */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6">
          <CryptoList 
            cryptoData={cryptoData} 
            selectedCrypto={selectedCrypto}
            setSelectedCrypto={setSelectedCrypto}
            loading={loading}
          />
        </div>

        {/* Middle Column - Tabs for Analysis/Chat */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6">
          <div className="flex border-b border-gray-700 mb-4">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'analysis' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
              onClick={() => setActiveTab('analysis')}
            >
              Analysis
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'chat' ? 'text-purple-400 border-b-2 border-purple-400' : 'text-gray-400'}`}
              onClick={() => setActiveTab('chat')}
            >
              Chat
            </button>
          </div>

          {activeTab === 'analysis' ? (
            <AnalysisPanel 
              selectedCrypto={selectedCrypto} 
              loading={loading}
            />
          ) : (
            <ChatInterface 
              cryptoData={cryptoData}
              selectedCrypto={selectedCrypto}
              setSelectedCrypto={setSelectedCrypto}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>

        {/* Right Column - Portfolio */}
        <div className="lg:col-span-1 bg-gray-800 rounded-lg p-6">
          <PortfolioManager 
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            cryptoData={cryptoData}
            savePortfolio={savePortfolio}
            loading={loading}
          />
        </div>
      </div>
    </main>
  )
}