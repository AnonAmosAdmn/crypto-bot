'use client'
import { useState } from 'react'
import { getChatResponse } from '../lib/openai'

export default function ChatInterface({ cryptoData, selectedCrypto, setSelectedCrypto, loading, setLoading }) {
  const [userInput, setUserInput] = useState('')
  const [conversation, setConversation] = useState([])

  const handleUserInput = async (e) => {
    e.preventDefault()
    if (!userInput.trim()) return

    // Add user message to conversation
    const userMessage = { role: 'user', content: userInput }
    setConversation([...conversation, userMessage])
    setUserInput('')
    setLoading(true)

    try {
      // Check if it's a specific crypto query
      const cryptoQuery = cryptoData.find(crypto => 
        userInput.toLowerCase().includes(crypto.name.toLowerCase()) || 
        userInput.toLowerCase().includes(crypto.symbol.toLowerCase())
      )

      if (cryptoQuery) {
        setSelectedCrypto(cryptoQuery)
      }

      const response = await getChatResponse(userInput, cryptoQuery)
      setConversation(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error getting AI response:', error)
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="bg-gray-700 rounded-lg p-4 mb-4 max-h-60 overflow-y-auto">
        {conversation.length > 0 ? (
          conversation.map((msg, index) => (
            <div 
              key={index} 
              className={`mb-3 p-3 rounded-lg ${msg.role === 'user' ? 'bg-purple-900 ml-8' : 'bg-gray-600 mr-8'}`}
            >
              <p className="font-medium">{msg.role === 'user' ? 'You' : 'AI Analyst'}</p>
              <p className="mt-1 whitespace-pre-wrap">{msg.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center py-4">Ask any cryptocurrency question</p>
        )}
      </div>

      <form onSubmit={handleUserInput} className="flex space-x-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask about any cryptocurrency..."
          className="flex-1 bg-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          disabled={loading || !userInput.trim()}
        >
          {loading ? '...' : 'Ask'}
        </button>
      </form>
    </div>
  )
}