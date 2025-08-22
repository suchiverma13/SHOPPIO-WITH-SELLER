// index.jsx ya main.jsx (jahaan ReactDOM.render ya createRoot use ho raha hai)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"
import { BrowserRouter } from "react-router-dom";
import { SellerProvider } from "./context/SellerContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SellerProvider>
        <App />
      </SellerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
