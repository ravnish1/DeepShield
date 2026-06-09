import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import KYCPage from './pages/KYCPage';
import RiskPage from './pages/RiskPage';
import ReportsPage from './pages/ReportsPage';
import RulesEnginePage from './pages/RulesEnginePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/kyc" replace />} />
              <Route path="/kyc" element={<KYCPage />} />
              <Route path="/risk" element={<RiskPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/rules" element={<RulesEnginePage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
