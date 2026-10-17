
  import { useState } from "react";

  function App() {

    const [count, setCount] = useState(0);

    function increaseCount() {
      setCount(count + 1);
    }

    return (
      <div>
        <h1>Counter App</h1>

        <h2>Count: {count}</h2>

        <button onClick={increaseCount}>
          Increase
        </button>
      </div>
    );
  }

  export default App;