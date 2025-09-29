import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api';
import {
  FaChartBar,
  FaBook,
  FaHome,
  FaArrowLeft,
  FaExclamationTriangle,
  FaRocket,
  FaCog,
  FaCogs,
  FaUsers,
  FaSearch,
  FaAngleDoubleLeft,
  FaAngleDoubleRight
} from 'react-icons/fa';

const InsightsDashboard = () => {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getInsights();
        if (data) {
          setInsights(data);
        } else {
          setError('No insights data available.');
        }
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load insights. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  // ------------------------
  // Loading State
  // ------------------------
  if (loading) {
    return (
      <div className="reddit-layout">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
          <div className="reddit-content d-flex flex-column align-items-center justify-content-center py-5">
            <div className="reddit-spinner mb-3"></div>
            <p className="reddit-text-secondary fs-5">Loading insights...</p>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------
  // Error State
  // ------------------------
  if (error) {
    return (
      <div className="reddit-layout">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
          <div className="reddit-content text-center py-5">
            <FaExclamationTriangle className="reddit-error-icon mb-3" />
            <h2 className="h3 fw-bold reddit-text-primary mb-2">Error</h2>
            <p className="reddit-text-secondary mb-4">{error}</p>
            <Link to="/standards" className="btn-reddit">
              <FaArrowLeft className="me-2" />
              Back to Standards
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ------------------------
  // Main Dashboard
  // ------------------------
  return (
    <div className="reddit-layout">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
        <TopNav />

        <div className="reddit-content">
          {/* Overview Stats */}
          <Card title="Overview">
            <div className="row text-center g-4">
              {[
                { label: 'Standards', value: insights?.totalStandards || 0, color: 'var(--reddit-orange)' },
                { label: 'Sections', value: insights?.totalSections || 0, color: 'var(--reddit-blue)' },
                { label: 'Chapters', value: insights?.totalChapters || 0, color: 'var(--reddit-orange)' },
                { label: 'Total Words', value: insights?.totalWords?.toLocaleString() || 0, color: 'var(--reddit-blue)' },
              ].map((stat, idx) => (
                <div key={idx} className="col-6 col-md-3">
                  <div className="fw-bold fs-3" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="reddit-text-secondary">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Standards Breakdown */}
{insights?.standards && (
  <Card title="Standards Breakdown">
    <div className="row g-4">
      {insights.standards.map((standard: any) => (
        <div key={standard.id} className="col-md-6 col-lg-4">
          <div className="reddit-card insights-card h-100">
            <div className="reddit-card-body d-flex flex-column justify-content-between">
              
              {/* Title */}
              <h3 className="h6 fw-bold reddit-text-primary mb-3 text-truncate">
                {standard.title}
              </h3>

              {/* Main Stats */}
              <div className="row text-center mb-3">
                <div className="col-6">
                  <div className="fw-bold fs-4" style={{ color: 'var(--reddit-orange)' }}>
                    {standard._count?.sections || 0}
                  </div>
                  <div className="reddit-text-secondary small text-uppercase">
                    Sections
                  </div>
                </div>
                <div className="col-6">
                  <div className="fw-bold fs-4" style={{ color: 'var(--reddit-blue)' }}>
                    {standard._count?.chapters || 0}
                  </div>
                  <div className="reddit-text-secondary small text-uppercase">
                    Chapters
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="row text-center border-top pt-3">
                <div className="col-6">
                  <div className="reddit-text-secondary small">Type</div>
                  <div className="fw-bold reddit-text-primary fs-6">
                    {standard.type || 'N/A'}
                  </div>
                </div>
                <div className="col-6">
                  <div className="reddit-text-secondary small">Version</div>
                  <div className="fw-bold reddit-text-primary fs-6">
                    {standard.version || 'N/A'}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      ))}
    </div>
  </Card>
)}


          {/* Topic Coverage */}
          {insights?.topicCoverage?.length > 0 && (
            <Card title="Topic Coverage">
              <p className="reddit-text-secondary fs-6 mb-4">
                Most frequently covered topics across all standards
              </p>
              <div className="row g-4">
                {insights.topicCoverage.map((topic: any, index: number) => (
                  <div key={index} className="col-md-6 col-lg-4">
                    <div className="reddit-card insights-card h-100">
                      <div className="reddit-card-body d-flex flex-column justify-content-between">
                        <h4 className="h6 fw-bold reddit-text-primary mb-2">
                          {topic.topic}
                        </h4>
                        <p className="reddit-text-secondary small mb-3">
                          Found in {topic.standards} standards
                        </p>
                        <div className="reddit-text-muted small">
                          <strong>Coverage:</strong> {topic.coverage} sections
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* CTA */}
          <Card center>
            <h2 className="h5 fw-bold reddit-text-primary mb-3">Ready to Explore?</h2>
            <p className="reddit-text-secondary mb-4">
              Dive deeper into the standards and discover more insights.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link to="/standards" className="btn-reddit">
                <FaBook className="me-2" /> Browse Standards
              </Link>
              <Link to="/tutorial" className="btn-reddit-outline">
                <FaRocket className="me-2" /> Learn More
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};


const Sidebar = ({ isCollapsed, setIsCollapsed }: { isCollapsed: boolean; setIsCollapsed: (v: boolean) => void; }) => (
  <div className={`reddit-sidebar${isCollapsed ? ' collapsed' : ''}`}>
    <div className="reddit-sidebar-section">
      <Link to="/" className="reddit-nav-brand">
        <FaRocket />
        <span className="label">PMInsight</span>
      </Link>
      <button
        className="sidebar-toggle"
        onClick={() => { const next = !isCollapsed; setIsCollapsed(next); localStorage.setItem('sidebarCollapsed', String(next)); }}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Expand' : 'Collapse'}
      >
        {isCollapsed ? <FaAngleDoubleRight /> : <FaAngleDoubleLeft />}
      </button>
    </div>

    <div className="reddit-sidebar-section">
      <div className="reddit-sidebar-title">Navigation</div>
      <Link to="/" className="reddit-sidebar-link" aria-label="Home">
        <FaHome className="me-2" /> <span className="label">Home</span>
      </Link>
      <Link to="/standards" className="reddit-sidebar-link" aria-label="Standards">
        <FaBook className="me-2" /> <span className="label">Standards</span>
      </Link>
      <Link to="/comparison" className="reddit-sidebar-link" aria-label="Comparison">
        <FaBook className="me-2" /> <span className="label">Comparison</span>
      </Link>
      <Link to="/map" className="reddit-sidebar-link" aria-label="Topic Map">
        <FaChartBar className="me-2" /> <span className="label">Topic Map</span>
      </Link>
      <Link to="/insights" className="reddit-sidebar-link active" aria-label="Analytics">
        <FaChartBar className="me-2" /> <span className="label">Analytics</span>
      </Link>
      <Link to="/process-generator" className="reddit-sidebar-link" aria-label="Process Generator">
        <FaCogs className="me-2" /> <span className="label">Process Generator</span>
      </Link>
    </div>

    <div className="reddit-sidebar-section">
      <div className="reddit-sidebar-title">Quick Actions</div>
      <Link to="/standards" className="reddit-sidebar-link" aria-label="Search Standards">
        <FaSearch className="me-2" /> <span className="label">Search Standards</span>
      </Link>
      <Link to="/tutorial" className="reddit-sidebar-link" aria-label="Tutorial">
        <FaRocket className="me-2" /> <span className="label">Tutorial</span>
      </Link>
    </div>

    <div className="reddit-sidebar-section">
      <div className="reddit-sidebar-title">Tools</div>
      <div className="reddit-sidebar-link" aria-label="Settings">
        <FaCog className="me-2" /> <span className="label">Settings</span>
      </div>
      <div className="reddit-sidebar-link" aria-label="Community">
        <FaUsers className="me-2" /> <span className="label">Community</span>
      </div>
    </div>
  </div>
);


const TopNav = () => (
  <div className="reddit-nav">
    <div className="container d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <Link to="/standards" className="btn-reddit-outline btn-sm me-3">
          <FaArrowLeft className="me-1" /> Back
        </Link>
        <div>
          <h1 className="h4 fw-bold reddit-text-primary mb-0">Analytics Dashboard</h1>
          <p className="reddit-text-secondary mb-0">Project management standards insights</p>
        </div>
      </div>
      <div className="reddit-nav-links">
        <Link to="/" className="reddit-nav-link">
          <FaHome className="me-1" /> Home
        </Link>
        <Link to="/standards" className="reddit-nav-link">
          <FaBook className="me-1" /> Standards
        </Link>
      </div>
    </div>
  </div>
);

const Card = ({
  title,
  children,
  center = false,
}: {
  title?: string;
  children: React.ReactNode;
  center?: boolean;
}) => (
  <div className="reddit-card reddit-fade-in mb-4">
    {title && (
      <div className="reddit-card-header">
        <h2 className="h5 fw-bold reddit-text-primary mb-0">{title}</h2>
      </div>
    )}
    <div className={`reddit-card-body ${center ? 'text-center' : ''}`}>{children}</div>
  </div>
);

export default InsightsDashboard;
