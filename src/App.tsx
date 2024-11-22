import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Browse } from './pages/Browse';
import { Lists } from './pages/Lists';
import { AnimeDetails } from './pages/AnimeDetails';
import { Watch } from './pages/Watch';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/lists" element={<Lists />} />
              <Route path="/anime/:id" element={<AnimeDetails />} />
              <Route path="/watch/:id/:episode" element={<Watch />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;