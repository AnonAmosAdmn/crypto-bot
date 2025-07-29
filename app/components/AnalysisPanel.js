'use client'
import { useState, useEffect } from 'react'
import { getCryptoAnalysis } from '../lib/openai'

export default function AnalysisPanel({ selectedCrypto, loading }) {
  const [aiResponse, setAiResponse] = useState('')
  const [localLoading, setLocalLoading] = useState(false)

  useEffect(() => {
    if (selectedCrypto) {
      fetchAnalysis()
    }
  }, [selectedCrypto])

  const fetchAnalysis = async () => {
    setLocalLoading(true)
    try {
      const response = await getCryptoAnalysis(selectedCrypto)
      setAiResponse(response)
    } catch (error) {
      console.error('Error fetching analysis:', error)
      setAiResponse('Failed to get analysis. Please try again.')
    } finally {
      setLocalLoading(false)
    }
  }

  if (!selectedCrypto) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>Select a cryptocurrency to analyze</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center space-x-3 mb-4 p-4 bg-gray-700 rounded-lg">
        <img src={selectedCrypto.image} alt={selectedCrypto.name} className="w-12 h-12" />
        <div>
          <h3 className="text-xl font-semibold">{selectedCrypto.name}</h3>
          <div className="flex space-x-4 text-sm">
            <p>Price: <span className="font-medium">${selectedCrypto.current_price.toLocaleString()}</span></p>
            <p className={selectedCrypto.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'}>
              {selectedCrypto.price_change_percentage_24h?.toFixed(2)}% (24h)
            </p>
          </div>
        </div>
      </div>

      {localLoading || loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : aiResponse ? (
        <div className="bg-gray-700 p-4 rounded-lg whitespace-pre-wrap">
          {aiResponse}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p>Loading analysis for {selectedCrypto.name}...</p>
        </div>
      )}
    </div>
  )
}