
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from './App.tsx'
import "./index.css";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient.ts';


createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
          <BrowserRouter>
    <App />
    <ReactQueryDevtools DevtoolsPosition="bottom-right" initialIsOpen={false} />
    </BrowserRouter>
    </QueryClientProvider>

)
