import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaAngleDoubleLeft, FaAngleDoubleRight, FaHome, FaBook, FaChartBar, FaCogs, FaProjectDiagram, FaEye } from 'react-icons/fa';
import ProcessFlowDiagram from './process/ProcessFlowDiagram';
import PhaseTimeline from './process/PhaseTimeline';
import RoleResponsibilityMatrix from './process/RoleResponsibilityMatrix';
import DecisionGateFramework from './process/DecisionGateFramework';
import ProcessComparisonView from './process/ProcessComparisonView';
import ScenarioSelector from './ScenarioSelector';

// Demo data for showcasing components
const demoProcess = {
  name: 'ERP System Development',
  projectName: 'ERP System Development',
  scenario: 'custom-software',
  summary: 'Tailored process for ERP System Development using custom software development approach. This agile lifecycle process is designed for Well-defined requirements, <6 months, <7 team members.',
  phases: [
    {
      name: 'Envision',
      description: 'Define product vision and initial requirements',
      duration: '1-2 weeks',
      activities: [
        {
          name: 'Define Product Vision',
          description: 'Create a clear product vision statement',
          deliverables: ['Product Vision Statement', 'User Stories', 'Product Roadmap'],
          duration: '2-3 days',
          roles: ['Product Owner', 'Stakeholders'],
          citations: [
            {
              standard: 'PMBOK',
              section: '4.1.1',
              title: 'Project Charter',
              justification: 'PMBOK emphasizes the importance of a clear project charter and vision statement for project success',
              confidence: 0.9
            }
          ]
        }
      ]
    },
    {
      name: 'Backlog & Planning',
      description: 'Create and prioritize product backlog',
      duration: '1-2 weeks',
      activities: [
        {
          name: 'Create Product Backlog',
          description: 'Develop prioritized list of features and requirements',
          deliverables: ['Product Backlog', 'User Stories', 'Acceptance Criteria'],
          duration: '3-5 days',
          roles: ['Product Owner', 'Development Team'],
          citations: [
            {
              standard: 'PMBOK',
              section: '5.1',
              title: 'Plan Scope Management',
              justification: 'PMBOK scope management provides structure for backlog creation and management',
              confidence: 0.8
            }
          ]
        }
      ]
    }
  ],
  evidence: {
    totalCitations: 15,
    standardsCoverage: {
      PMBOK: 8,
      PRINCE2: 4,
      ISO21500: 2,
      ISO21502: 1
    },
    confidenceScore: 0.85,
    qualityMetrics: {
      completeness: 0.9,
      accuracy: 0.85,
      relevance: 0.8
    }
  }
};

const ProcessDemoPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [activeView, setActiveView] = useState<'flow' | 'timeline' | 'matrix' | 'gates' | 'comparison' | 'scenario'>('flow');

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'flow':
        return <ProcessFlowDiagram process={demoProcess} />;
      case 'timeline':
        return <PhaseTimeline phases={demoProcess.phases} orientation="horizontal" />;
      case 'matrix':
        return <RoleResponsibilityMatrix phases={demoProcess.phases} />;
      case 'gates':
        return <DecisionGateFramework phases={demoProcess.phases} />;
      case 'comparison':
        return <ProcessComparisonView processes={[demoProcess]} />;
      case 'scenario':
        return <ScenarioSelector onScenarioSelect={() => {}} />;
      default:
        return <ProcessFlowDiagram process={demoProcess} />;
    }
  };

  return (
    <div className="min-vh-100 bg-animated position-relative">
      <div className={`reddit-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <div className="reddit-nav-brand">
            <FaRocket className="me-2" />
            <span className="label">PM Standards</span>
          </div>
          <button className="sidebar-toggle" onClick={toggleSidebar} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
          </button>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Navigation</div>
          <Link to="/" className="reddit-sidebar-link"><FaHome className="me-2" /><span className="label">Dashboard</span></Link>
          <Link to="/standards" className="reddit-sidebar-link"><FaBook className="me-2" /><span className="label">Standards</span></Link>
          <Link to="/comparison" className="reddit-sidebar-link"><FaBook className="me-2" /><span className="label">Comparison</span></Link>
          <Link to="/insights" className="reddit-sidebar-link"><FaChartBar className="me-2" /><span className="label">Insights</span></Link>
          <Link to="/process-generator" className="reddit-sidebar-link"><FaCogs className="me-2" /><span className="label">Process Generator</span></Link>
          <Link to="/process-designer" className="reddit-sidebar-link active"><FaProjectDiagram className="me-2" /><span className="label">Process Designer</span></Link>
          <Link to="/map" className="reddit-sidebar-link"><FaProjectDiagram className="me-2" /><span className="label">Topic Map</span></Link>
        </div>

        <div className="reddit-sidebar-section">
          <div className="reddit-sidebar-title">Demo Views</div>
          <button 
            className={`reddit-sidebar-link ${activeView === 'flow' ? 'active' : ''}`}
            onClick={() => setActiveView('flow')}
          >
            <FaProjectDiagram className="me-2" />
            <span className="label">Process Flow</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveView('timeline')}
          >
            <FaChartBar className="me-2" />
            <span className="label">Timeline</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveView('matrix')}
          >
            <FaBook className="me-2" />
            <span className="label">Role Matrix</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'gates' ? 'active' : ''}`}
            onClick={() => setActiveView('gates')}
          >
            <FaCogs className="me-2" />
            <span className="label">Decision Gates</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveView('comparison')}
          >
            <FaEye className="me-2" />
            <span className="label">Comparison</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'scenario' ? 'active' : ''}`}
            onClick={() => setActiveView('scenario')}
          >
            <FaRocket className="me-2" />
            <span className="label">Scenario Selector</span>
          </button>
        </div>
      </div>

      <div className={`reddit-main ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-content">
          <div className="reddit-card mb-4">
            <div className="reddit-card-body">
              <h1 className="display-6 fw-bold reddit-text-primary mb-2">
                <FaProjectDiagram className="me-2" /> Phase 2B Demo
              </h1>
              <p className="reddit-text-secondary mb-0">Interactive demonstration of enhanced process visualization components.</p>
            </div>
          </div>

          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default ProcessDemoPage;
