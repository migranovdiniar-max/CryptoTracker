import { useState } from "react";
import axios from "axios";

const CG_PRICE_URL = "/api/cg/simple/price?ids=bitcoin&vs_currencies=usd";

function App() {
  const [price, setPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [source, setSource] = useState("");

  const extractUsdPrice = (payload) => {
    const usdPrice = payload?.bitcoin?.usd;
    if (typeof usdPrice !== "number") {
      throw new Error("Unexpected API response format");
    }
    return Math.round(usdPrice);
  };

  const handleFetchClick = async () => {
    setIsLoading(true);
    setError(null);
    setSource("Fetch 🌐");

    try {
      const response = await fetch(CG_PRICE_URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPrice(extractUsdPrice(data));
    } catch (err) {
      console.log("Fetch Error:", err);
      setError(`Не удалось получить цену BTC: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAxiosClick = async () => {
    setIsLoading(true);
    setError(null);
    setSource("Axios 🌐");

    try {
      const response = await axios.get(CG_PRICE_URL);
      setPrice(extractUsdPrice(response.data));
    } catch (err) {
      console.log("Axios Error:", err);
      setError(`Не удалось получить цену BTC: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Сравнение Запросов: Fetch vs Axios 🥊</h1>

      <div style={{ margin: "20px 0", fontSize: "24px", minHeight: "80px" }}>
        {isLoading && <p>⏳ Запрашиваем данные...</p>}
        {error && !isLoading && <p style={{ color: "red" }}>{error}</p>}

        {!isLoading && !error && price && (
          <div>
            <p>
              Текущая цена BTC: <strong>${price}</strong>
            </p>
            <p style={{ fontSize: "16px", color: "gray" }}>
              Данные получены через: {source}
            </p>
          </div>
        )}

        {!isLoading && !error && !price && <p>Нажми на любую кнопку</p>}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleFetchClick}
          disabled={isLoading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Fetch
        </button>

        <button
          onClick={handleAxiosClick}
          disabled={isLoading}
          style={{ padding: "10px 20px", cursor: "pointer" }}
        >
          Axios
        </button>
      </div>
    </div>
  );
}

export default App;
