import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import TutorialPage from './components/TutorialPage';
import Dashboard from './components/Dashboard';
import StandardReaderView from './components/StandardReaderView';
import ProcessGenerator from './components/ProcessGenerator';
import SectionDetail from './components/SectionDetail';
import InsightsDashboard from './components/InsightsDashboard';
import SearchResults from './components/SearchResults';
import TopicSelector from './components/TopicSelector';
import ComparisonView from './components/ComparisonView';
import TopicMap from './components/TopicMap';
import NotFound from './components/NotFound';

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
          <Route path="/map" element={<TopicMap />} />
          <Route path="/process-generator" element={<ProcessGenerator />} />
          <Route path="/comparison/:topicId" element={<ComparisonView />} />
          <Route path="/search" element={<SearchResults query="" onBack={() => window.history.back()} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;