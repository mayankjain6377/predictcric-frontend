import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PlayerProvider } from "./context/PlayerContext";
import { Toaster } from "react-hot-toast";
import "./styles/index.css";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PlayerProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#13131a",
            color: "#fff",
            border: "1px solid #00ff87",
          },
        }}
      />
    </PlayerProvider>
  </React.StrictMode>
);