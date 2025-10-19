import React from 'react';
import { FaBook, FaTasks, FaUsers } from 'react-icons/fa';
import type { Phase } from '../../services/api';

interface ProcessComparisonViewProps {
  processes: {
    scenario: string;
    name: string;
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
  }[];
}

const ProcessComparisonView: React.FC<ProcessComparisonViewProps> = ({
  processes
}) => {

  const getScenarioIcon = (scenario: string) => {
    const icons = {
      'custom-software': '💻',
      'innovative-product': '🔬',
      'government-project': '🏛️'
    };
    return icons[scenario as keyof typeof icons] || '📋';
  };


  if (processes.length === 0) {
    return (
      <div className="process-comparison">
        <div className="reddit-card">
          <div className="reddit-card-body">
            <h3 className="h5 fw-bold reddit-text-primary mb-2">Process Comparison</h3>
            <p className="reddit-text-secondary">No processes available for comparison.</p>
          </div>
        </div>
      </div>
    );
  }

  if (processes.length === 1) {
    const process = processes[0];
    return (
      <div className="process-comparison">
        <div className="reddit-card">
          <div className="reddit-card-body">
            <h3 className="h5 fw-bold reddit-text-primary mb-3">Process Details</h3>
            <div className="d-flex align-items-center gap-3 mb-4">
              <span className="fs-2">{getScenarioIcon(process.scenario)}</span>
              <div>
                <h4 className="h4 fw-bold reddit-text-primary">{process.name}</h4>
                <p className="reddit-text-secondary small text-capitalize">{process.scenario.replace('-', ' ')}</p>
              </div>
            </div>
            
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="reddit-card">
                  <div className="reddit-card-body text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <FaTasks className="text-primary" />
                      <span className="fw-medium reddit-text-primary">Phases</span>
                    </div>
                    <p className="fs-2 fw-bold text-primary mb-0">{process.phases.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="reddit-card">
                  <div className="reddit-card-body text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <FaBook className="text-success" />
                      <span className="fw-medium reddit-text-primary">Citations</span>
                    </div>
                    <p className="fs-2 fw-bold text-success mb-0">{process.evidence.totalCitations}</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="reddit-card">
                  <div className="reddit-card-body text-center">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                      <FaUsers className="text-info" />
                      <span className="fw-medium reddit-text-primary">Confidence</span>
                    </div>
                    <p className="fs-2 fw-bold text-info mb-0">
                      {Math.round(process.evidence.confidenceScore * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h5 className="fw-bold reddit-text-primary mb-3">Process Phases:</h5>
              <div className="d-flex flex-column gap-3">
                {process.phases.map((phase, index) => (
                  <div key={index} className="reddit-card">
                    <div className="reddit-card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="fw-medium reddit-text-primary">{phase.name}</h6>
                        <span className="reddit-text-secondary small">{phase.activities?.length || 0} activities</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multiple processes comparison
  const allPhases = Array.from(new Set(
    processes.flatMap(p => p.phases.map(phase => phase.name))
  ));

  const commonPhases = allPhases.filter(phase =>
    processes.every(process => process.phases.some(p => p.name === phase))
  );

  return (
    <div className="process-comparison">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <h3 className="h5 fw-bold reddit-text-primary mb-2">Process Comparison</h3>
          <p className="reddit-text-secondary">Comparing {processes.length} processes</p>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {processes.map((process, index) => (
          <div key={index} className="col-lg-6">
            <div className="reddit-card">
              <div className="reddit-card-body">
                <div className="d-flex align-items-center gap-3 mb-4">
                  <span className="fs-2">{getScenarioIcon(process.scenario)}</span>
                  <div>
                    <h4 className="h5 fw-bold reddit-text-primary">{process.name}</h4>
                    <p className="reddit-text-secondary small text-capitalize">{process.scenario.replace('-', ' ')}</p>
                  </div>
                </div>
                
                <div className="row g-3 mb-4">
                  <div className="col-6 text-center">
                    <div className="fs-2 fw-bold text-primary">{process.phases.length}</div>
                    <div className="reddit-text-secondary small">Phases</div>
                  </div>
                  <div className="col-6 text-center">
                    <div className="fs-2 fw-bold text-success">{process.evidence.totalCitations}</div>
                    <div className="reddit-text-secondary small">Citations</div>
                  </div>
                </div>

                <div>
                  <h6 className="fw-medium reddit-text-primary mb-2">Phases:</h6>
                  <div className="d-flex flex-column gap-1">
                    {process.phases.map((phase, phaseIndex) => (
                      <div key={phaseIndex} className="reddit-text-secondary small">
                        • {phase.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="reddit-card">
        <div className="reddit-card-body">
          <h4 className="h5 fw-bold reddit-text-primary mb-4">Comparison Summary</h4>
          
          <div className="row g-4">
            <div className="col-md-6">
              <h5 className="fw-medium reddit-text-primary mb-3">Common Phases ({commonPhases.length})</h5>
              <div className="d-flex flex-column gap-1">
                {commonPhases.map((phase, index) => (
                  <div key={index} className="reddit-text-success small">✓ {phase}</div>
                ))}
              </div>
            </div>
            
            <div className="col-md-6">
              <h5 className="fw-medium reddit-text-primary mb-3">Unique Phases</h5>
              <div className="d-flex flex-column gap-1">
                {processes.map((process, index) => {
                  const uniquePhases = process.phases.filter(phase =>
                    !commonPhases.includes(phase.name)
                  );
                  return uniquePhases.length > 0 ? (
                    <div key={index} className="reddit-text-secondary small">
                      <strong>{process.name}:</strong> {uniquePhases.map(p => p.name).join(', ')}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessComparisonView;