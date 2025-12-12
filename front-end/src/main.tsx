import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";

import "@/styles/globals.css";
import { HostsProvider } from "@/hooks/hosts/hosts-provider.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider>
        <HostsProvider>
          <App />
        </HostsProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
