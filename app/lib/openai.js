import { OpenAI } from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export async function getCryptoAnalysis(crypto) {
  const prompt = `
    Analyze the cryptocurrency ${crypto.name} (${crypto.symbol.toUpperCase()}) 
    based on the following data:
    Current Price: $${crypto.current_price}
    24h Change: ${crypto.price_change_percentage_24h}%
    Market Cap: $${crypto.market_cap}
    24h Volume: $${crypto.total_volume}
    All Time High: $${crypto.ath}
    
    Provide a detailed technical and fundamental analysis. Include:
    1. Short-term outlook
    2. Key support/resistance levels
    3. Major indicators
    4. Risk assessment
    5. Recommendation (Buy/Hold/Sell)
    
    Format the response with clear section headings.
  `

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert cryptocurrency analyst with 10+ years of experience in technical analysis and blockchain fundamentals."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  })

  return response.choices[0].message.content
}

export async function getChatResponse(message, crypto) {
  const messages = [
    {
      role: "system",
      content: "You are an expert cryptocurrency analyst. Provide detailed, accurate information about cryptocurrencies, blockchain technology, and market trends."
    }
  ]

  if (crypto) {
    messages.push({
      role: "user",
      content: `Tell me about ${crypto.name} (${crypto.symbol.toUpperCase()})`
    })
  } else {
    messages.push({
      role: "user",
      content: message
    })
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    temperature: 0.7,
    max_tokens: 1000
  })

  return response.choices[0].message.content
}