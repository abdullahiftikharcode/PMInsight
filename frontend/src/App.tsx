import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import StandardReaderView from './components/StandardReaderView';
import SectionDetail from './components/SectionDetail';
import InsightsDashboard from './components/InsightsDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/standard/:id" element={<StandardReaderView />} />
          <Route path="/section/:id" element={<SectionDetail />} />
          <Route path="/insights" element={<InsightsDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;