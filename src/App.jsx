import { useState, useEffect } from "react";
import axios from "axios";

const CG_PRICE_URL = "/api/cg/simple/price?ids=bitcoin&vs_currencies=usd";

function App() {
  const [pricePerBtc, setPricePerBtc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [amountBtc, setAmountBtc] = useState(1);
  const [priceHistory, setPriceHistory] = useState([]);

  const fetchPriceForCurrency = async (ignoreFlag) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${CG_PRICE_URL}&vs_currencies=${currency}`);
      const currentRate = response.data.bpi[currency].rate_float;

      if (ignoreFlag) return;

      setPricePerBtc(currentRate);

      const newLogEntry = {
        id: Date.now(),
        time: new Date().toLocaleString(),
        price: currentRate,
        currencyCode: currency,
      };

      setPriceHistory((prevHistory) => {
        const updateHistory = [newLogEntry, ...prevHistory];
        return updateHistory.slice(0, 5);
      });
    } catch (err) {
      if (!ignoreFlag) setError(err.message);
    } finally {
      if (!ignoreFlag) setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchPriceForCurrency(ignore);

    return () => {
      ignore = true;
    };
  }, [currency]);

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmountBtc(Number(e.target.value) || 0);
  };

  const handleManualUpdate = () => {
    fetchPriceForCurrency(false);
  };

  const totalValue = pricePerBtc ? amountBtc * pricePerBtc : 0;

return (
    <div style={{ padding: "30px", fontFamily: "Arial", maxWidth: "500px", margin: "0 auto" }}>
      <h2>📊 Крипто-Терминал</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input 
          type="number" value={amountBtc} onChange={handleAmountChange} 
          min="0" step="0.01" style={{ flex: 1, padding: "8px" }}
        />
        <select value={currency} onChange={handleCurrencyChange} style={{ flex: 1, padding: "8px" }}>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </select>
        <button onClick={handleManualUpdate} disabled={isLoading} style={{ padding: "8px 15px" }}>
          🔄
        </button>
      </div>

      <div style={{ padding: "20px", background: "#f0f8ff", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
        {isLoading ? (
           <span style={{ color: "#666" }}>Загрузка...</span>
        ) : error ? (
           <span style={{ color: "red" }}>{error}</span>
        ) : (
          <>
            <div style={{ fontSize: "14px", color: "#666" }}>Итого:</div>
            <div style={{ fontSize: "32px", fontWeight: "bold" }}>
              {totalValue.toLocaleString()} {currency}
            </div>
            <div style={{ fontSize: "12px", color: "#999", marginTop: "5px" }}>
              1 BTC = {pricePerBtc?.toLocaleString()} {currency}
            </div>
          </>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: "16px", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
          Журнал котировок (последние 5)
        </h3>
        
        {priceHistory.length === 0 ? (
          <p style={{ color: "#999", fontSize: "14px" }}>История пуста</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {priceHistory.map((entry) => (
              <li key={entry.id} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                padding: "8px 0",
                borderBottom: "1px dashed #eee",
                fontSize: "14px"
              }}>
                <span style={{ color: "#888" }}>{entry.time}</span>
                <strong>{entry.price.toLocaleString()} {entry.currencyCode}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
