import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/index.sass";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
