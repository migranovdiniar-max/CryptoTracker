import { useState, useEffect } from "react";
import axios from "axios";

const CG_PRICE_URL = "/api/cg/simple/price?ids=bitcoin&vs_currencies=usd";

function App() {
  const [pricePerBtc, setPricePerBtc] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currency, setCurrency] = useState("USD");
  const [amountBtc, setAmountBtc] = useState(1);

  useEffect(() => {
    let ignore = false;

    const fetchPriceForCurrency = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${CG_PRICE_URL}&vs_currencies=${currency}`);
        const currentRate = response.data.bitcoin[currency].rate_float;

        if (!ignore) {
          setPricePerBtc(currentRate);
        } else {
          console.log("error");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchPriceForCurrency();

    return () => {
      ignore = true;
    };
  }, [currency])

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  }

  const handleAmiountChange = (event) => {
    const inputValue = event.target.value;

    const numericValue = Number(inputValue) || 0;

    setAmountBtc(numericValue);
  };

  const totalValue = pricePerBtc ? pricePerBtc * amountBtc : 0;

return (
    <div style={{ padding: "40px", fontFamily: "Arial", maxWidth: "450px" }}>
      <h2>🧮 Крипто-Калькулятор</h2>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            Количество BTC:
          </label>
          <input 
            type="number" 
            value={amountBtc}
            onChange={handleAmountChange}
            min="0"
            step="0.01"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ flex: 1 }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            Валюта:
          </label>
          <select 
            value={currency} 
            onChange={handleCurrencyChange}
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          >
            <option value="USD">Доллары (USD)</option>
            <option value="EUR">Евро (EUR)</option>
            <option value="GBP">Фунты (GBP)</option>
          </select>
        </div>
      </div>

      <div style={{ 
        padding: "20px", 
        border: "1px solid #ccc", 
        borderRadius: "8px",
        backgroundColor: "#f0f8ff",
        textAlign: "center"
      }}>
        {isLoading ? (
          <span style={{ color: "#666" }}>Обновляем курс...</span>
        ) : error ? (
          <span style={{ color: "red" }}>{error}</span>
        ) : (
          <div>
            <div style={{ fontSize: "14px", color: "#666", marginBottom: "5px" }}>
              Итоговая стоимость:
            </div>
            <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2c3e50" }}>
              {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {currency}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
