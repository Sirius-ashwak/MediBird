import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Create root for React rendering
const container = document.getElementById("root");

if (!container) {
  throw new Error("Root element not found in the DOM");
}

const root = createRoot(container);

// Render the main App component
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
