import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import KYCPage from './pages/KYCPage';
import RiskPage from './pages/RiskPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Navigate to="/kyc" replace />} />
            <Route path="/kyc" element={<KYCPage />} />
            <Route path="/risk" element={<RiskPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
