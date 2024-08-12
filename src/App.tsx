import usePythonVenv from "./lib/shell/python";
import Interface from "./Interface";

function App() {
  const [done, loading, error] = usePythonVenv();

  return (
    <div>
      {loading && <p>Loading dependencies...</p>}
      {error && <p>Error: {error}</p>}
      {done && <p>Dependencies installed!</p>}
      <Interface />
    </div>
  );
}

export default App;
