import { useState } from "react";
import "./App.css";

const simbolos = ["🍒", "🍋", "🍇", "🔔", "⭐", "💎"];

function App() {
  const [resultado, setResultado] = useState(["❓", "❓", "❓"]);
  const [mensagem, setMensagem] = useState("");
  const [girando, setGirando] = useState(false);

  const girar = async () => {
    if (girando) return;

    setGirando(true);
    setMensagem("");

    // Animação
    const intervalo = setInterval(() => {
      setResultado([
        simbolos[Math.floor(Math.random() * simbolos.length)],
        simbolos[Math.floor(Math.random() * simbolos.length)],
        simbolos[Math.floor(Math.random() * simbolos.length)],
      ]);
    }, 100);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/jogar`, {
        method: "POST",
      });
  
      const data = await response.json();

      setTimeout(() => {
        clearInterval(intervalo);
        setResultado(data.resultado);

        if (data.status === "WIN") {
          setMensagem("🎉 WIN!");
        } else if (data.status === "QUASE") {
          setMensagem("🔥 QUASE!");
        } else {
          setMensagem("😢 Não foi dessa vez");
        }

        setGirando(false);
      }, 1500);
    } catch (error) {
      clearInterval(intervalo);
      setMensagem("Erro ao conectar com o servidor");
      setGirando(false);
    }
  };

  return (
    <div className="container">
      <h1>🎰 Caça-Níquel</h1>

      <div className="slot">
        {resultado.map((item, index) => (
          <div key={index} className="rolo">
            <div className={`simbolo ${girando ? "girando" : ""}`}>
              {item}
            </div>
          </div>

        ))}
      </div>

      <button onClick={girar} disabled={girando}>
        {girando ? "Girando..." : "Girar"}
      </button>

      <p className="mensagem">{mensagem}</p>
    </div>
  );
}

export default App;