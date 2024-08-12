import { useState } from "react";
import reactLogo from "./assets/react.svg";
import useTagRunner from "./lib/hooks/useTagRunner";
import { Button } from "./components/ui/button";

export default function Interface() {
  const [name, setName] = useState("");

  const { start, status, stdout } = useTagRunner();

  async function greet() {
    start([name]);
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri!</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <p>{status}</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a filepath..."
        />
        <Button type="submit">Start</Button>
      </form>

      <p>{stdout}</p>
    </main>
  );
}
