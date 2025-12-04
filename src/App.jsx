import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

// 1. Register Chart.js components (Required for React)
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function App() {
  const [coins, setCoins] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        // CHANGED" sparkline = true (This asks for the 7-day history)
        const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=9&page=1&sparkline=true'
        const response = await axios.get(url)
        setCoins(response.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching coin data:", error)
        setLoading(false)
      }
    }
    fetchCoins()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
          Crypto Analytics 🚀
        </h1>

        {loading ? (
          <p className="text-center animate-pulse">Fetching market trends...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coins.map((coin) => (
              <div key={coin.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">

                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                  <img src={coin.image} alt={coin.name} className="w-8 h-8" />
                  <div>
                    <h2 className="text-lg font-bold">{coin.name}</h2>
                    <span className="text-xs text-gray-400 uppercase">{coin.symbol}</span>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-lg font-mono font-bold">${coin.current_price.toLocaleString()}</p>
                    <p className={`text-xs ${coin.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </p>
                  </div>
                </div>

                {/* THE CHART */}
                <div className="h-16">
                  <Line
                    data={{
                      labels: coin.sparkline_in_7d.price.map((_, i) => i), // Fake labels (1, 2, 3...)
                      datasets: [{
                        data: coin.sparkline_in_7d.price,
                        borderColor: coin.price_change_percentage_24h > 0 ? '#4ade80' : '#f87171', // Green or Red line
                        borderWidth: 2,
                        tension: 0.4, // Smooth curves
                        pointRadius: 0 // Hide dots
                      }]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false }, tooltip: { enabled: false } },
                      scales: { x: { display: false }, y: { display: false } } // Hide grid lines
                    }}
                  />
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default App