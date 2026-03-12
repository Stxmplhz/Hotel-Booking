import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { SearchContextProvider } from './context/SearchContext.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MINUTE } from './utils/time.ts'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * MINUTE,
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthContextProvider>
      <SearchContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </SearchContextProvider>
    </AuthContextProvider>  
  </StrictMode>,
)
