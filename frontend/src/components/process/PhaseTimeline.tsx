import React, { useState } from 'react';
import { FaClock, FaTasks, FaBook } from 'react-icons/fa';
import type { Phase, Activity } from '../../services/api';

interface PhaseTimelineProps {
  phases: Phase[];
  onPhaseClick?: (phase: Phase) => void;
  onActivityClick?: (activity: Activity) => void;
  showDuration?: boolean;
  showActivityCount?: boolean;
  showEvidence?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const PhaseTimeline: React.FC<PhaseTimelineProps> = ({
  phases,
  onPhaseClick,
  onActivityClick,
  showDuration = true,
  showActivityCount = true,
  orientation = 'horizontal'
}) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const handlePhaseClick = (phase: Phase) => {
    setSelectedPhase(selectedPhase === phase.name ? null : phase.name);
    onPhaseClick?.(phase);
  };

  const getPhaseColor = (index: number) => {
    const colors = [
      'bg-primary',
      'bg-success',
      'bg-info',
      'bg-warning',
      'bg-danger',
      'bg-secondary'
    ];
    return colors[index % colors.length];
  };

  const getPhaseIcon = (phaseName: string) => {
    const name = phaseName.toLowerCase();
    if (name.includes('initiate') || name.includes('start')) return '🚀';
    if (name.includes('plan')) return '📋';
    if (name.includes('execute') || name.includes('build')) return '⚡';
    if (name.includes('monitor') || name.includes('control')) return '👁️';
    if (name.includes('close') || name.includes('end')) return '🏁';
    if (name.includes('sprint')) return '🏃';
    if (name.includes('review')) return '🔄';
    return '📝';
  };

  const calculatePhaseProgress = (phase: Phase) => {
    // Simple progress calculation based on activities with citations
    if (!phase.activities.length) return 0;
    const activitiesWithCitations = phase.activities.filter(activity => 
      activity.citations && activity.citations.length > 0
    ).length;
    return (activitiesWithCitations / phase.activities.length) * 100;
  };

  if (orientation === 'vertical') {
    return (
      <div className="phase-timeline-vertical">
        <div className="position-relative">
          {/* Timeline Line */}
          <div className="position-absolute" style={{left: '24px', top: 0, bottom: 0, width: '2px', backgroundColor: 'var(--border-light)'}}></div>
          
          {phases.map((phase, index) => {
            const progress = calculatePhaseProgress(phase);
            const isSelected = selectedPhase === phase.name;
            
            return (
              <div key={index} className="position-relative d-flex align-items-start mb-4">
                {/* Phase Node */}
                <div className={`position-relative rounded-circle ${getPhaseColor(index)} d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow`} 
                     style={{width: '48px', height: '48px', zIndex: 10}}>
                  <span>{getPhaseIcon(phase.name)}</span>
                </div>
                
                {/* Phase Content */}
                <div className="ms-3 flex-grow-1">
                  <div 
                    className={`reddit-card cursor-pointer transition-all ${
                      isSelected ? 'border-primary shadow-md' : ''
                    }`}
                    onClick={() => handlePhaseClick(phase)}
                    style={{cursor: 'pointer'}}
                  >
                    <div className="reddit-card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h3 className="h5 fw-bold reddit-text-primary">{phase.name}</h3>
                        <div className="d-flex align-items-center gap-3 reddit-text-muted small">
                          {showDuration && phase.duration && (
                            <span className="d-flex align-items-center">
                              <FaClock className="me-1" />
                              <span>{phase.duration}</span>
                            </span>
                          )}
                          {showActivityCount && (
                            <span className="d-flex align-items-center">
                              <FaTasks className="me-1" />
                              <span>{phase.activities.length}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <p className="reddit-text-secondary small mb-3">{phase.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between reddit-text-muted small mb-1">
                          <span>Evidence Coverage</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="progress" style={{height: '8px'}}>
                          <div 
                            className={`progress-bar ${getPhaseColor(index)}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Phase Stats */}
                      <div className="row g-3 small">
                        <div className="col-6">
                          <span className="reddit-text-muted">Activities:</span>
                          <span className="ms-2 fw-medium reddit-text-primary">{phase.activities.length}</span>
                        </div>
                        <div className="col-6">
                          <span className="reddit-text-muted">Evidence:</span>
                          <span className="ms-2 fw-medium reddit-text-primary">
                            {phase.activities.reduce((sum, activity) => 
                              sum + (activity.citations?.length || 0), 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Phase Activities */}
                  {isSelected && (
                    <div className="mt-3 ms-3">
                      {phase.activities.map((activity, activityIndex) => (
                        <div 
                          key={activityIndex}
                          className="reddit-card mb-2 cursor-pointer"
                          onClick={() => onActivityClick?.(activity)}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="reddit-card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h4 className="fw-medium reddit-text-primary small">{activity.name}</h4>
                                <p className="reddit-text-secondary small">{activity.description}</p>
                              </div>
                              <div className="d-flex align-items-center gap-2 reddit-text-muted small">
                                {activity.duration && (
                                  <span className="d-flex align-items-center">
                                    <FaClock className="me-1" />
                                    <span>{activity.duration}</span>
                                  </span>
                                )}
                                {activity.citations && activity.citations.length > 0 && (
                                  <span className="d-flex align-items-center text-primary">
                                    <FaBook className="me-1" />
                                    <span>{activity.citations.length}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Horizontal Timeline
  return (
    <div className="phase-timeline-horizontal">
      <div className="position-relative">
        {/* Timeline Line */}
        <div className="position-absolute" style={{top: '24px', left: 0, right: 0, height: '2px', backgroundColor: 'var(--border-light)'}}></div>
        
        <div className="d-flex justify-content-between">
          {phases.map((phase, index) => {
            const progress = calculatePhaseProgress(phase);
            const isSelected = selectedPhase === phase.name;
            
            return (
              <div key={index} className="position-relative d-flex flex-column align-items-center">
                {/* Phase Node */}
                <div className={`position-relative rounded-circle ${getPhaseColor(index)} d-flex align-items-center justify-content-center text-white fw-bold fs-5 shadow cursor-pointer`}
                     style={{width: '48px', height: '48px', zIndex: 10}}
                     onClick={() => handlePhaseClick(phase)}>
                  <span>{getPhaseIcon(phase.name)}</span>
                </div>
                
                {/* Phase Content */}
                <div className="mt-3" style={{width: '256px'}}>
                  <div 
                    className={`reddit-card cursor-pointer transition-all ${
                      isSelected ? 'border-primary shadow-md' : ''
                    }`}
                    onClick={() => handlePhaseClick(phase)}
                    style={{cursor: 'pointer'}}
                  >
                    <div className="reddit-card-body">
                      <h3 className="h5 fw-bold reddit-text-primary mb-2">{phase.name}</h3>
                      <p className="reddit-text-secondary small mb-3">{phase.description}</p>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="d-flex justify-content-between reddit-text-muted small mb-1">
                          <span>Evidence</span>
                          <span>{progress.toFixed(0)}%</span>
                        </div>
                        <div className="progress" style={{height: '8px'}}>
                          <div 
                            className={`progress-bar ${getPhaseColor(index)}`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Phase Stats */}
                      <div className="row g-2 small">
                        <div className="col-6 d-flex align-items-center">
                          <FaTasks className="reddit-text-muted me-1" />
                          <span className="reddit-text-muted">{phase.activities.length}</span>
                        </div>
                        <div className="col-6 d-flex align-items-center">
                          <FaBook className="text-primary me-1" />
                          <span className="reddit-text-muted">
                            {phase.activities.reduce((sum, activity) => 
                              sum + (activity.citations?.length || 0), 0
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Selected Phase Activities */}
                  {isSelected && (
                    <div className="mt-3" style={{maxHeight: '256px', overflowY: 'auto'}}>
                      {phase.activities.map((activity, activityIndex) => (
                        <div 
                          key={activityIndex}
                          className="reddit-card mb-2 cursor-pointer"
                          onClick={() => onActivityClick?.(activity)}
                          style={{cursor: 'pointer'}}
                        >
                          <div className="reddit-card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h4 className="fw-medium reddit-text-primary small">{activity.name}</h4>
                                <p className="reddit-text-secondary small">{activity.description}</p>
                              </div>
                              <div className="d-flex align-items-center reddit-text-muted small">
                                {activity.citations && activity.citations.length > 0 && (
                                  <span className="d-flex align-items-center text-primary">
                                    <FaBook className="me-1" />
                                    <span>{activity.citations.length}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhaseTimeline;
