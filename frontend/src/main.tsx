import { QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import queryClient from "./config/queryClient.ts";
import { ModalSettingsProvider } from "./contexts/ModalSettingsContext.tsx";
import "./index.css";

const root = document.getElementById("root")!;

createRoot(root).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ModalSettingsProvider>
                <NuqsAdapter>
                    <App />
                </NuqsAdapter>
            </ModalSettingsProvider>
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        </QueryClientProvider>
    </BrowserRouter>
);
