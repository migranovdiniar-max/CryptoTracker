import { useState, useEffect } from "react";
import axios from "axios";

const CG_PRICE_URL = "/api/cg/simple/price?ids=bitcoin&vs_currencies=usd";

function App() {
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("");
  const [currency, setCurrency] = useState("USD");

  const fetchPriceForCurrency = async () => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`📡 Отправляем запрос для валюты: ${currency}`);
      const response = await axios.get("https://api.coindesk.com/v1/bpi/currentprice.json")

      const currentRate = response.data.bpi[currency].rate_float; 

      setPrice(Math.round(currentRate));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchPriceForCurrency();
  }, [currency])

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  }

return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "400px" }}>
      <h2>📈 Умный Крипто-Трекер</h2>

      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Выберите валюту:
        </label>
        <select 
          value={currency} 
          onChange={handleCurrencyChange}
          style={{ padding: "5px 10px", fontSize: "16px" }}
        >
          <option value="USD">Доллары (USD)</option>
          <option value="EUR">Евро (EUR)</option>
          <option value="GBP">Фунты (GBP)</option>
        </select>
      </div>

      <div style={{ 
        padding: "20px", 
        border: "1px solid #ccc", 
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        minHeight: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {isLoading ? (
          <span style={{ color: "#666" }}>⏳ Запрашиваем курс...</span>
        ) : error ? (
          <span style={{ color: "red" }}>{error}</span>
        ) : (
          <span style={{ fontSize: "24px" }}>
            1 BTC = <strong>{price ? price.toLocaleString() : '---'} {currency}</strong>
          </span>
        )}
      </div>
    </div>
  );
}

export default App;
