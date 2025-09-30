import { Link } from 'react-router-dom';
import { FaCompass, FaRocket, FaHome, FaBook, FaProjectDiagram, FaCogs, FaChartBar } from 'react-icons/fa';

const NotFound = () => {
  return (
    <div className="min-vh-100 bg-animated position-relative d-flex align-items-center justify-content-center">
      {/* Floating background orbs */}
      <div className="floating-orbs">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* 404 Card */}
      <div className="reddit-card text-center" style={{ maxWidth: 720 }}>
        <div className="reddit-card-body py-5 px-4">
          <div className="position-relative d-inline-block mb-4">
            <div className="display-1 fw-bold" style={{ letterSpacing: 2 }}>
              4<span className="text-info">0</span>4
            </div>
            <div className="position-absolute top-50 start-50 translate-middle" style={{ opacity: 0.15 }}>
              <FaCompass size={120} />
            </div>
          </div>

          <h1 className="h3 fw-bold reddit-text-primary mb-2">You’ve drifted off the map</h1>
          <p className="reddit-text-secondary mb-4">
            We couldn’t find the page you were looking for. Try one of the destinations below
            or head back to base.
          </p>

          {/* Quick navigation */}
          <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
            <Link to="/" className="btn-reddit">
              <FaHome className="me-2" /> Dashboard
            </Link>
            <Link to="/standards" className="btn-reddit-outline">
              <FaBook className="me-2" /> Standards
            </Link>
            <Link to="/comparison" className="btn-reddit-outline">
              <FaBook className="me-2" /> Comparison
            </Link>
            <Link to="/map" className="btn-reddit-outline">
              <FaProjectDiagram className="me-2" /> Topic Map
            </Link>
            <Link to="/process-generator" className="btn-reddit-outline">
              <FaCogs className="me-2" /> Process Generator
            </Link>
            <Link to="/insights" className="btn-reddit-outline">
              <FaChartBar className="me-2" /> Insights
            </Link>
          </div>

          {/* Animated rocket CTA */}
          <div className="d-flex align-items-center justify-content-center gap-3 mt-2">
            <FaRocket className="text-info" />
            <span className="reddit-text-secondary">Pro tip: use the sidebar to navigate faster</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;


