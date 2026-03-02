import { useState } from "react";

function App() {
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRealCryptoPrice = async () => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const usdPrice = data?.bitcoin?.usd;
    if (typeof usdPrice !== "number") {
      throw new Error("Unexpected API response format");
    }

    return Math.round(usdPrice);
  };

  const handleUpdateClick = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newPrice = await fetchRealCryptoPrice();
      setPrice(newPrice);
    } catch (err) {
      console.log("Error:", err);
      setError("Не удалось получить цену BTC. Попробуй снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{padding: "40px", fontFamily: "Arial"}}>
      <h1>Симулятор Крипто-Трекера 🚀</h1>

      <div style={{ margin: '20px 0', fontSize: '24px', minHeight: '40px'}}>
        {isLoading ? (
          <span>Обновление...</span>
        ) : error ? (
          <span style={{ color: 'red' }}>{error}</span>
        ) : (
          <span>Текущая цена BTC: {price ? `$${price}` : 'Нажми кнопку'}</span>
        )}
      </div>

      <button
        onClick={handleUpdateClick}
        disabled={isLoading}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
        {isLoading ? 'Обновление...' : 'Обновить'}
      </button>
    </div>
  )
}

export default App;
