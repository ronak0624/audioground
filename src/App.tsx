import usePythonVenv from "./lib/shell/python";
import Interface from "./Interface";

function App() {
  const [done, loading, error] = usePythonVenv();

  return (
    <>
      {loading && <p>Loading dependencies...</p>}
      {error && <p>Error: {error}</p>}
      {done && <p>Dependencies installed!</p>}
      <Interface />
    </>
  );
}

export default App;
