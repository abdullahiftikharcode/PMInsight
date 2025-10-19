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

// Phase 2B: Enhanced Process Components
import ProcessDesignerPage from './components/ProcessDesignerPage';
import ProcessDemoPage from './components/ProcessDemoPage';
import PhaseTimeline from './components/process/PhaseTimeline';
import RoleResponsibilityMatrix from './components/process/RoleResponsibilityMatrix';
import DecisionGateFramework from './components/process/DecisionGateFramework';
import ProcessComparisonView from './components/process/ProcessComparisonView';
import ScenarioSelector from './components/ScenarioSelector';

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
          <Route path="/comparison/custom" element={<ComparisonView />} />
          <Route path="/comparison/:topicId" element={<ComparisonView />} />
          <Route path="/search" element={<SearchResults query="" onBack={() => window.history.back()} />} />
          
          {/* Phase 2B: Enhanced Process Routes */}
          <Route path="/process-designer" element={<ProcessDesignerPage />} />
          <Route path="/process-designer/:scenario" element={<ProcessDesignerPage />} />
          <Route path="/process-demo" element={<ProcessDemoPage />} />
          <Route path="/process-flow" element={<div>Process Flow Component - Demo data needed</div>} />
          <Route path="/process-timeline" element={<PhaseTimeline phases={[]} />} />
          <Route path="/process-matrix" element={<RoleResponsibilityMatrix phases={[]} />} />
          <Route path="/process-gates" element={<DecisionGateFramework phases={[]} />} />
          <Route path="/process-comparison" element={<ProcessComparisonView processes={[]} />} />
          <Route path="/scenario-selector" element={<ScenarioSelector onScenarioSelect={() => {}} />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;