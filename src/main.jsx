import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SchemaProvider } from "./context/SchemaContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SchemaProvider>
    <App />
  </SchemaProvider>
);
