import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Layout from './components/Layout';
import Home from './pages/Home';
import Download from './pages/Download';
import Changelog from './pages/Changelog';
import Requirements from './pages/Requirements';
import ExecutorPreview from './pages/ExecutorPreview';
import Scripts from './pages/Scripts';

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/download" element={<Download />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/requirements" element={<Requirements />} />
              <Route path="/preview" element={<ExecutorPreview />} />
              <Route path="/scripts" element={<Scripts />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;