import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./config/queryClient.ts";
import { ModalSettingsProvider } from "./contexts/ModalSettingsContext.tsx";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ModalSettingsProvider>
                <App />
            </ModalSettingsProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    </BrowserRouter>
);
