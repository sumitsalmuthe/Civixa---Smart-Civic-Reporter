import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Toaster } from "react-hot-toast";
const globalStyle = document.createElement("style");
globalStyle.innerHTML = `
  * {
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    color: #111827;
    background: #f4f6f8;
  }

  button, input, select {
    transition: all 0.2s ease;
  }
`;

document.head.appendChild(globalStyle);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    
  </>
);
