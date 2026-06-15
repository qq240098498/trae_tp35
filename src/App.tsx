import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ArchivePage from '@/pages/ArchivePage';
import SummaryPage from '@/pages/SummaryPage';

export default function App() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar onAdd={() => setFormOpen(true)} />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ArchivePage formOpen={formOpen} setFormOpen={setFormOpen} />} />
            <Route path="/summary" element={<SummaryPage />} />
          </Routes>
        </main>
        <footer className="relative z-10 py-6 text-center text-gray-500 text-sm border-t border-primary-800/30">
          <p>书影音存档 · 记录你的文化生活</p>
        </footer>
      </div>
    </Router>
  );
}
