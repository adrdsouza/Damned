import React from "react"
import ReactDOM from "react-dom/client"
import { Skeleton, HydrateFallback } from "@medusajs/ui"
import App from "./app.js"

// React 19's simplified hydration
const root = ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <HydrateFallback>
      <App />
    </HydrateFallback>
  </React.StrictMode>
)
