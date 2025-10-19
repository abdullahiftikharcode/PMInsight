import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaAngleDoubleLeft, FaAngleDoubleRight, FaHome, FaBook, FaChartBar, FaCogs, FaProjectDiagram, FaEye } from 'react-icons/fa';
import ProcessFlowDiagram from './process/ProcessFlowDiagram';
import PhaseTimeline from './process/PhaseTimeline';
import RoleResponsibilityMatrix from './process/RoleResponsibilityMatrix';
import DecisionGateFramework from './process/DecisionGateFramework';
import ProcessComparisonView from './process/ProcessComparisonView';
import ScenarioSelector from './ScenarioSelector';
import LoadingSkeleton from './LoadingSkeleton';

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
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  };

  useEffect(() => {
    // Simulate loading demo data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

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

  if (loading) {
    return <LoadingSkeleton variant="process" />;
  }

  return (
    <div className="reddit-layout">
      <div className={`reddit-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <Link to="/" className="reddit-nav-brand" style={{textDecoration: 'none'}}>
            <FaRocket className="me-2" />
            <span className="label">PMInsight</span>
          </Link>
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
            aria-label="Process Flow Diagram"
          >
            <FaProjectDiagram className="me-2" />
            <span className="label">Process Flow</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveView('timeline')}
            aria-label="Phase Timeline"
          >
            <FaChartBar className="me-2" />
            <span className="label">Timeline</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'matrix' ? 'active' : ''}`}
            onClick={() => setActiveView('matrix')}
            aria-label="Role Responsibility Matrix"
          >
            <FaBook className="me-2" />
            <span className="label">Role Matrix</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'gates' ? 'active' : ''}`}
            onClick={() => setActiveView('gates')}
            aria-label="Decision Gate Framework"
          >
            <FaCogs className="me-2" />
            <span className="label">Decision Gates</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveView('comparison')}
            aria-label="Process Comparison"
          >
            <FaEye className="me-2" />
            <span className="label">Comparison</span>
          </button>
          <button 
            className={`reddit-sidebar-link ${activeView === 'scenario' ? 'active' : ''}`}
            onClick={() => setActiveView('scenario')}
            aria-label="Scenario Selector"
          >
            <FaRocket className="me-2" />
            <span className="label">Scenario Selector</span>
          </button>
        </div>
      </div>

      <div className={`reddit-main ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="demo-page-header">
          <div className="container">
            <h1 className="display-6 fw-bold">
              <FaProjectDiagram className="me-2" /> Phase 2B Demo
            </h1>
            <p>Interactive demonstration of enhanced process visualization components.</p>
          </div>
        </div>
        
        <div className="reddit-content">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
};

export default ProcessDemoPage;
