import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient.ts';
import { ModalContextProvider } from './contexts/ModalContext.tsx';
import App from './App.tsx'
import "./index.css";

const root = document.getElementById('root')!;

createRoot(root).render(
    <QueryClientProvider client={queryClient}>
        <BrowserRouter>
            <ModalContextProvider>
                <App />
            </ModalContextProvider>
            <ReactQueryDevtools />
        </BrowserRouter>
    </QueryClientProvider>
)
