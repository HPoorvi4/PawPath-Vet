import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from "./App";
import { VetAuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <VetAuthProvider>
    <App />
  </VetAuthProvider>
);