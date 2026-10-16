import { useState } from "react";

function App() {
  const [input, setInput] = useState("");

  function press(value) {
    setInput(input + value);
  }

  function clear() {
    setInput("");
  }

  function calculate() {
    try {
      setInput(String(eval(input)));
    } catch (error) {
      setInput("Error");
    }
  }

  return (
    <div style={{ width: "220px", margin: "40px" }}>
      <h2>Calculator</h2>
      <input
        type="text"
        value={input}
        readOnly
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <div>
        <button onClick={() => press("7")}>7</button>
        <button onClick={() => press("8")}>8</button>
        <button onClick={() => press("9")}>9</button>
        <button onClick={() => press("/")}>/</button>
      </div>
      <div>
        <button onClick={() => press("4")}>4</button>
        <button onClick={() => press("5")}>5</button>
        <button onClick={() => press("6")}>6</button>
        <button onClick={() => press("*")}>*</button>
      </div>
      <div>
        <button onClick={() => press("1")}>1</button>
        <button onClick={() => press("2")}>2</button>
        <button onClick={() => press("3")}>3</button>
        <button onClick={() => press("-")}>-</button>
      </div>
      <div>
        <button onClick={() => press("0")}>0</button>
        <button onClick={() => press(".")}>.</button>
        <button onClick={calculate}>=</button>
        <button onClick={() => press("+")}>+</button>
      </div>
      <button onClick={clear}>Clear</button>
    </div>
  );
}

export default App;