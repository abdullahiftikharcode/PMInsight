import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TutorialPage from './components/TutorialPage';
import Dashboard from './components/Dashboard';
import StandardReaderView from './components/StandardReaderView';
import SectionDetail from './components/SectionDetail';
import InsightsDashboard from './components/InsightsDashboard';
import SearchResults from './components/SearchResults';
import TopicSelector from './components/TopicSelector';
import ComparisonView from './components/ComparisonView';

import './App.css';

function App() {
  return (
    
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/tutorial" element={<TutorialPage />} />
          <Route path="/standards" element={<Dashboard />} />
          <Route path="/standard/:id" element={<StandardReaderView />} />
          <Route path="/section/:id" element={<SectionDetail />} />
          <Route path="/insights" element={<InsightsDashboard />} />
          <Route path="/comparison" element={<TopicSelector />} />
          <Route path="/comparison/:topicId" element={<ComparisonView />} />
          <Route path="/search" element={<SearchResults query="" onBack={() => window.history.back()} />} />
          <Route path="*" element={
            <div className="reddit-layout">
              <div className="reddit-sidebar">
                <div className="reddit-sidebar-section">
                  <div className="reddit-nav-brand">
                    PMInsight
                  </div>
                </div>
              </div>
              <div className="reddit-main">
                <div className="reddit-content">
                  <div className="reddit-error">
                    <h2 className="h3 fw-bold reddit-text-primary mb-3">Page Not Found</h2>
                    <p className="reddit-text-secondary mb-4">The page you are looking for does not exist.</p>
                    <a href="/" className="btn-reddit">
                      Go Home
                    </a>
                  </div>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;