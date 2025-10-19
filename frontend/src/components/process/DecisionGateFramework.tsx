import React, { useState, useMemo } from 'react';
import { FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaArrowRight, FaInfoCircle, FaBook } from 'react-icons/fa';
import type { Phase } from '../../services/api';

interface DecisionGateFrameworkProps {
  phases: Phase[];
  onGateClick?: (gate: DecisionGate) => void;
  showEvidence?: boolean;
  showCriteria?: boolean;
  compact?: boolean;
}

interface DecisionGate {
  id: string;
  name: string;
  phase: string;
  description: string;
  criteria: string[];
  deliverables: string[];
  evidence: string[];
  status: 'pending' | 'in-progress' | 'passed' | 'failed';
  dependencies: string[];
}

const DecisionGateFramework: React.FC<DecisionGateFrameworkProps> = ({
  phases,
  onGateClick,
  showEvidence = true,
  showCriteria = true,
  compact = false
}) => {
  const [selectedGate, setSelectedGate] = useState<string | null>(null);

  const decisionGates = useMemo(() => {
    const gates: DecisionGate[] = [];
    
    phases.forEach((phase, phaseIndex) => {
      // Phase-level gates
      const phaseGate: DecisionGate = {
        id: `phase-${phaseIndex}`,
        name: `${phase.name} Gate`,
        phase: phase.name,
        description: `Decision gate for ${phase.name} phase completion`,
        criteria: [
          `All ${phase.name} activities completed`,
          `Deliverables meet quality standards`,
          `Stakeholder approval obtained`,
          `Ready to proceed to next phase`
        ],
        deliverables: phase.activities.flatMap(activity => activity.deliverables || []),
        evidence: phase.activities.flatMap(activity => 
          activity.citations?.map(citation => `${citation.standard} ${citation.section}`) || []
        ),
        status: phaseIndex === 0 ? 'passed' : 'pending',
        dependencies: phaseIndex > 0 ? [`phase-${phaseIndex - 1}`] : []
      };
      gates.push(phaseGate);
      
      // Activity-level gates for critical activities
      phase.activities.forEach((activity, activityIndex) => {
        if (activity.name.toLowerCase().includes('review') || 
            activity.name.toLowerCase().includes('approval') ||
            activity.name.toLowerCase().includes('sign-off') ||
            activity.name.toLowerCase().includes('decision')) {
          const activityGate: DecisionGate = {
            id: `activity-${phaseIndex}-${activityIndex}`,
            name: `${activity.name} Gate`,
            phase: phase.name,
            description: activity.description,
            criteria: [
              `Activity deliverables completed`,
              `Quality standards met`,
              `Stakeholder approval obtained`
            ],
            deliverables: activity.deliverables || [],
            evidence: activity.citations?.map(citation => `${citation.standard} ${citation.section}`) || [],
            status: 'pending',
            dependencies: [`phase-${phaseIndex}`]
          };
          gates.push(activityGate);
        }
      });
    });
    
    return gates;
  }, [phases]);

  const getGateStatusIcon = (status: DecisionGate['status']) => {
    switch (status) {
      case 'passed':
        return <FaCheckCircle className="text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="text-red-500" />;
      case 'in-progress':
        return <FaQuestionCircle className="text-yellow-500" />;
      default:
        return <FaQuestionCircle className="text-gray-400" />;
    }
  };

  const getGateStatusColor = (status: DecisionGate['status']) => {
    switch (status) {
      case 'passed':
        return 'badge bg-success';
      case 'failed':
        return 'badge bg-danger';
      case 'in-progress':
        return 'badge bg-warning text-dark';
      default:
        return 'badge bg-secondary';
    }
  };

  const getGateStatusText = (status: DecisionGate['status']) => {
    switch (status) {
      case 'passed':
        return 'Passed';
      case 'failed':
        return 'Failed';
      case 'in-progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const handleGateClick = (gate: DecisionGate) => {
    setSelectedGate(selectedGate === gate.id ? null : gate.id);
    onGateClick?.(gate);
  };

  if (compact) {
    return (
      <div className="decision-gate-framework-compact">
        <div className="mb-4">
          <h3 className="h5 fw-bold reddit-text-primary mb-3">Decision Gates</h3>
          <div className="d-flex flex-column gap-2">
            {decisionGates.map((gate) => (
              <div
                key={gate.id}
                className="reddit-card cursor-pointer"
                onClick={() => handleGateClick(gate)}
                style={{cursor: 'pointer'}}
              >
                <div className="reddit-card-body">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                      {getGateStatusIcon(gate.status)}
                      <div>
                        <h4 className="fw-medium reddit-text-primary">{gate.name}</h4>
                        <p className="reddit-text-secondary small">{gate.phase}</p>
                      </div>
                    </div>
                    <span className={`badge ${getGateStatusColor(gate.status)}`}>
                      {getGateStatusText(gate.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="decision-gate-framework">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <h3 className="h4 fw-bold reddit-text-primary mb-4">Decision Gate Framework</h3>
          
          <div className="row g-4">
            {decisionGates.map((gate) => (
              <div key={gate.id} className="col-lg-6">
                <div
                  className={`reddit-card cursor-pointer ${
                    selectedGate === gate.id ? 'border-primary' : ''
                  }`}
                  onClick={() => handleGateClick(gate)}
                  style={{cursor: 'pointer'}}
                >
                  <div className="reddit-card-body">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-3">
                        {getGateStatusIcon(gate.status)}
                        <div>
                          <h4 className="fw-bold reddit-text-primary">{gate.name}</h4>
                          <p className="reddit-text-secondary small">{gate.phase}</p>
                        </div>
                      </div>
                      <span className={`badge ${getGateStatusColor(gate.status)}`}>
                        {getGateStatusText(gate.status)}
                      </span>
                    </div>
                    
                    <p className="reddit-text-secondary small mb-3">{gate.description}</p>
                    
                    {showCriteria && (
                      <div className="mb-3">
                        <h5 className="reddit-text-primary small fw-medium mb-2">Criteria:</h5>
                        <ul className="reddit-text-secondary small">
                          {gate.criteria.map((criterion, index) => (
                            <li key={index} className="d-flex align-items-start mb-1">
                              <span className="reddit-text-muted me-2">•</span>
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="d-flex justify-content-between align-items-center reddit-text-muted small">
                      <div className="d-flex align-items-center gap-3">
                        <span className="d-flex align-items-center">
                          <FaInfoCircle className="me-1" />
                          <span>{gate.deliverables.length} deliverables</span>
                        </span>
                        {showEvidence && (
                          <span className="d-flex align-items-center">
                            <FaBook className="me-1" />
                            <span>{gate.evidence.length} citations</span>
                          </span>
                        )}
                      </div>
                      <FaArrowRight className="reddit-text-muted" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedGate && (
        <div className="reddit-card">
          <div className="reddit-card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="h5 fw-bold reddit-text-primary">
                {decisionGates.find(g => g.id === selectedGate)?.name} - Details
              </h4>
              <button
                onClick={() => setSelectedGate(null)}
                className="btn btn-outline-secondary btn-sm"
              >
                ✕
              </button>
            </div>
            
            {(() => {
              const gate = decisionGates.find(g => g.id === selectedGate);
              if (!gate) return null;
              
              return (
                <div className="d-flex flex-column gap-4">
                  <div>
                    <h5 className="fw-medium reddit-text-primary mb-2">Description</h5>
                    <p className="reddit-text-secondary small">{gate.description}</p>
                  </div>
                  
                  <div>
                    <h5 className="fw-medium reddit-text-primary mb-2">Criteria</h5>
                    <ul className="reddit-text-secondary small">
                      {gate.criteria.map((criterion, index) => (
                        <li key={index} className="d-flex align-items-start mb-1">
                          <span className="reddit-text-muted me-2">•</span>
                          <span>{criterion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {gate.deliverables.length > 0 && (
                    <div>
                      <h5 className="fw-medium reddit-text-primary mb-2">Deliverables</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {gate.deliverables.map((deliverable, index) => (
                          <span key={index} className="badge bg-primary small">
                            {deliverable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {showEvidence && gate.evidence.length > 0 && (
                    <div>
                      <h5 className="fw-medium reddit-text-primary mb-2">Evidence</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {gate.evidence.map((evidence, index) => (
                          <span key={index} className="badge bg-success small">
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {gate.dependencies.length > 0 && (
                    <div>
                      <h5 className="fw-medium reddit-text-primary mb-2">Dependencies</h5>
                      <div className="d-flex flex-wrap gap-2">
                        {gate.dependencies.map((dependency, index) => (
                          <span key={index} className="badge bg-secondary small">
                            {dependency}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionGateFramework;
