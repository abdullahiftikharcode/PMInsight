import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaAngleDoubleLeft, FaAngleDoubleRight, FaHome, FaBook, FaChartBar, FaCogs, FaProjectDiagram } from 'react-icons/fa';
import ProcessDesigner from './ProcessDesigner';
import LoadingSkeleton from './LoadingSkeleton';

const ProcessDesignerPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  };

  useEffect(() => {
    // Simulate loading process designer
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
      </div>

      <div className={`reddit-main ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-content">
          <ProcessDesigner />
        </div>
      </div>
    </div>
  );
};

export default ProcessDesignerPage;
