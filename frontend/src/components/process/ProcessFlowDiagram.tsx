import React, { useState, useMemo } from 'react';
import { FaChevronRight, FaChevronDown, FaTasks, FaClock } from 'react-icons/fa';
import type { Phase, Activity } from '../../services/api';

interface ProcessFlowDiagramProps {
  process: {
    projectName: string;
    scenario: string;
    summary: string;
    phases: Phase[];
    evidence: {
      totalCitations: number;
      standardsCoverage: {
        PMBOK: number;
        PRINCE2: number;
        ISO21500: number;
        ISO21502: number;
      };
      confidenceScore: number;
      qualityMetrics: {
        completeness: number;
        accuracy: number;
        relevance: number;
      };
    };
  };
  onActivityClick?: (activity: Activity) => void;
  showEvidence?: boolean;
  showDeliverables?: boolean;
  showRoles?: boolean;
  compact?: boolean;
}

const ProcessFlowDiagram: React.FC<ProcessFlowDiagramProps> = ({
  process,
  onActivityClick,
  showEvidence = true,
  showDeliverables = true,
  showRoles = true,
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

  const togglePhase = (phaseName: string) => {
    setExpandedPhases(prev => ({ ...prev, [phaseName]: !prev[phaseName] }));
  };

  const toggleActivity = (activityId: string) => {
    setExpandedActivities(prev => ({ ...prev, [activityId]: !prev[activityId] }));
  };

  const getScenarioColor = (scenario: string) => {
    const colors = {
      'custom-software': 'badge bg-primary',
      'innovative-product': 'badge bg-success',
      'government-project': 'badge bg-info'
    };
    return colors[scenario as keyof typeof colors] || 'badge bg-secondary';
  };

  const getScenarioIcon = (scenario: string) => {
    const icons = {
      'custom-software': '💻',
      'innovative-product': '🔬',
      'government-project': '🏛️'
    };
    return icons[scenario as keyof typeof icons] || '📋';
  };

  const getStandardColor = (standard: string) => {
    if (standard.includes('PMBOK')) return 'reddit-text-primary';
    if (standard.includes('PRINCE2')) return 'reddit-text-success';
    if (standard.includes('ISO')) return 'reddit-text-info';
    return 'reddit-text-secondary';
  };

  const evidenceSummary = useMemo(() => {
    const totalCitations = process.evidence.totalCitations;
    const standardsCoverage = process.evidence.standardsCoverage;
    const confidenceScore = process.evidence.confidenceScore;
    
    return {
      totalCitations,
      standardsCoverage,
      confidenceScore,
      qualityScore: process.evidence.qualityMetrics.completeness
    };
  }, [process.evidence]);

  if (!process || !process.phases || process.phases.length === 0) {
    return (
      <div className="reddit-card">
        <div className="reddit-card-body text-center py-5">
          <div className="mb-3">
            <span className="fs-1">📋</span>
          </div>
          <h4 className="reddit-text-primary mb-2">No Process Data Available</h4>
          <p className="reddit-text-secondary mb-0">
            Please generate a process first to see the visualization.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="process-flow-diagram">
      {/* Process Header */}
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="d-flex align-items-center">
              <span className="fs-1 me-3">{getScenarioIcon(process.scenario)}</span>
              <div>
                <h2 className="h4 fw-bold reddit-text-primary mb-1">{process.projectName}</h2>
                <p className="reddit-text-secondary small mb-0 text-capitalize">{process.scenario.replace('-', ' ')} Process</p>
              </div>
            </div>
            <span className={getScenarioColor(process.scenario)}>
              {process.scenario.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        
          <p className="reddit-text-secondary mb-4">{process.summary}</p>
        
          {/* Evidence Summary */}
          {showEvidence && (
            <div className="row g-3 mb-3">
              <div className="col-6 col-md-3">
                <div className="text-center p-3 reddit-bg-tertiary rounded">
                  <div className="fs-3 fw-bold reddit-text-primary">{evidenceSummary.totalCitations}</div>
                  <div className="reddit-text-secondary small">Citations</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="text-center p-3 reddit-bg-tertiary rounded">
                  <div className="fs-3 fw-bold reddit-text-success">{(evidenceSummary.confidenceScore * 100).toFixed(0)}%</div>
                  <div className="reddit-text-secondary small">Confidence</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="text-center p-3 reddit-bg-tertiary rounded">
                  <div className="fs-3 fw-bold reddit-text-info">{(evidenceSummary.qualityScore * 100).toFixed(0)}%</div>
                  <div className="reddit-text-secondary small">Quality</div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="text-center p-3 reddit-bg-tertiary rounded">
                  <div className="fs-3 fw-bold reddit-text-warning">{Object.keys(evidenceSummary.standardsCoverage).length}</div>
                  <div className="reddit-text-secondary small">Standards</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Process Phases */}
      <div className="d-flex flex-column gap-4">
        {process.phases.map((phase, phaseIndex) => (
          <div key={phaseIndex} className="reddit-card">
            {/* Phase Header */}
            <div 
              className="reddit-card-body cursor-pointer"
              onClick={() => togglePhase(phase.name)}
              style={{cursor: 'pointer'}}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {expandedPhases[phase.name] ? (
                    <FaChevronDown className="reddit-text-muted me-2" />
                  ) : (
                    <FaChevronRight className="reddit-text-muted me-2" />
                  )}
                  <div>
                    <h3 className="h5 fw-bold reddit-text-primary mb-1">{phase.name}</h3>
                    <p className="reddit-text-secondary small mb-0">{phase.description}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3 reddit-text-muted small">
                  <span className="d-flex align-items-center">
                    <FaTasks className="me-1" />
                    <span>{phase.activities.length} activities</span>
                  </span>
                  {phase.duration && (
                    <span className="d-flex align-items-center">
                      <FaClock className="me-1" />
                      <span>{phase.duration}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Phase Activities */}
            {expandedPhases[phase.name] && (
              <div className="reddit-card-body pt-0">
                <div className="d-flex flex-column gap-3">
                  {phase.activities.map((activity, activityIndex) => {
                    const activityId = `${phaseIndex}-${activityIndex}`;
                    const isExpanded = expandedActivities[activityId];
                    
                    return (
                      <div key={activityIndex} className="reddit-card">
                        <div 
                          className="reddit-card-body cursor-pointer"
                          onClick={() => toggleActivity(activityId)}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              {isExpanded ? (
                                <FaChevronDown className="reddit-text-muted me-2" />
                              ) : (
                                <FaChevronRight className="reddit-text-muted me-2" />
                              )}
                              <div>
                                <h4 className="h6 fw-bold reddit-text-primary mb-1">{activity.name}</h4>
                                <p className="reddit-text-secondary small mb-0">{activity.description}</p>
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-3 reddit-text-muted small">
                              <span className="d-flex align-items-center">
                                <FaClock className="me-1" />
                                <span>{activity.duration}</span>
                              </span>
                              {activity.deliverables && activity.deliverables.length > 0 && (
                                <span className="d-flex align-items-center">
                                  <FaTasks className="me-1" />
                                  <span>{activity.deliverables.length} deliverables</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Activity Details */}
                        {isExpanded && (
                          <div className="reddit-card-body pt-0">
                            <div className="d-flex flex-column gap-3">
                              {/* Deliverables */}
                              {showDeliverables && activity.deliverables && activity.deliverables.length > 0 && (
                                <div>
                                  <h6 className="reddit-text-primary small mb-2">Deliverables:</h6>
                                  <ul className="reddit-text-secondary small mb-0">
                                    {activity.deliverables.map((deliverable, index) => (
                                      <li key={index}>{deliverable}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Roles */}
                              {showRoles && activity.roles && activity.roles.length > 0 && (
                                <div>
                                  <h6 className="reddit-text-primary small mb-2">Roles:</h6>
                                  <div className="d-flex flex-wrap gap-1">
                                    {activity.roles.map((role, index) => (
                                      <span key={index} className="badge bg-secondary text-dark small">
                                        {role}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Citations */}
                              {showEvidence && activity.citations && activity.citations.length > 0 && (
                                <div>
                                  <h6 className="reddit-text-primary small mb-2">Evidence:</h6>
                                  <div className="d-flex flex-column gap-2">
                                    {activity.citations.map((citation, index) => (
                                      <div key={index} className="p-2 bg-secondary rounded">
                                        <div className="d-flex justify-content-between align-items-start">
                                          <div>
                                            <span className={`fw-bold ${getStandardColor(citation.standard)}`}>
                                              {citation.standard} {citation.section}
                                            </span>
                                            <div className="reddit-text-secondary small">
                                              {citation.title}
                                            </div>
                                            <div className="reddit-text-muted small">
                                              {citation.justification}
                                            </div>
                                          </div>
                                          {citation.confidence && (
                                            <span className="badge bg-info small">
                                              {Math.round(citation.confidence * 100)}%
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Activity Actions */}
                              {onActivityClick && (
                                <div className="pt-2 border-top">
                                  <button
                                    onClick={() => onActivityClick(activity)}
                                    className="btn btn-outline-primary btn-sm"
                                  >
                                    View Activity Details →
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlowDiagram;