import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient.ts';
import App from './App.tsx'
import "./index.css";
import { ModalSettingsProvider } from './contexts/PreferencesSettingsContext.tsx';

const root = document.getElementById('root')!;

createRoot(root).render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <ModalSettingsProvider>
                <App />
            </ModalSettingsProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    </BrowserRouter>
)
