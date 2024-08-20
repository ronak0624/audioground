import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ThemeProvider } from "@lib/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AudioProvider } from "@lib/providers/AudioProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={100}>
        <AudioProvider>
          <App />
        </AudioProvider>
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
