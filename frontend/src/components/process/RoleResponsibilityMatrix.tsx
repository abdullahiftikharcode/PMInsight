import React, { useState, useMemo } from 'react';
import { FaTasks, FaBook, FaClock } from 'react-icons/fa';
import type { Phase, Activity } from '../../services/api';

interface RoleResponsibilityMatrixProps {
  phases: Phase[];
  onRoleClick?: (role: string) => void;
  onActivityClick?: (activity: Activity) => void;
  showEvidence?: boolean;
  showDuration?: boolean;
  compact?: boolean;
}

interface RoleData {
  role: string;
  activities: Activity[];
  totalActivities: number;
  phases: string[];
  evidenceCount: number;
  averageDuration: string;
}

const RoleResponsibilityMatrix: React.FC<RoleResponsibilityMatrixProps> = ({
  phases,
  onRoleClick,
  onActivityClick,
  showEvidence = true,
  compact = false
}) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'activities' | 'evidence' | 'alphabetical'>('activities');

  const roleData = useMemo(() => {
    const roleMap = new Map<string, RoleData>();
    
    phases.forEach(phase => {
      phase.activities.forEach(activity => {
        if (activity.roles) {
          activity.roles.forEach(role => {
            if (!roleMap.has(role)) {
              roleMap.set(role, {
                role,
                activities: [],
                totalActivities: 0,
                phases: [],
                evidenceCount: 0,
                averageDuration: ''
              });
            }
            
            const roleData = roleMap.get(role)!;
            roleData.activities.push(activity);
            roleData.totalActivities++;
            
            if (!roleData.phases.includes(phase.name)) {
              roleData.phases.push(phase.name);
            }
            
            if (activity.citations) {
              roleData.evidenceCount += activity.citations.length;
            }
          });
        }
      });
    });
    
    return Array.from(roleMap.values());
  }, [phases]);

  const sortedRoleData = useMemo(() => {
    return [...roleData].sort((a, b) => {
      switch (sortBy) {
        case 'activities':
          return b.totalActivities - a.totalActivities;
        case 'evidence':
          return b.evidenceCount - a.evidenceCount;
        case 'alphabetical':
          return a.role.localeCompare(b.role);
        default:
          return 0;
      }
    });
  }, [roleData, sortBy]);

  const getRoleColor = (role: string) => {
    const colors = [
      'badge bg-primary',
      'badge bg-success',
      'badge bg-info',
      'badge bg-warning text-dark',
      'badge bg-danger',
      'badge bg-secondary',
      'badge bg-dark',
      'badge bg-light text-dark'
    ];
    const hash = role.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const getRoleIcon = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('manager')) return '👨‍💼';
    if (roleLower.includes('developer') || roleLower.includes('engineer')) return '👨‍💻';
    if (roleLower.includes('analyst')) return '📊';
    if (roleLower.includes('designer')) return '🎨';
    if (roleLower.includes('tester') || roleLower.includes('qa')) return '🧪';
    if (roleLower.includes('architect')) return '🏗️';
    if (roleLower.includes('lead')) return '👑';
    if (roleLower.includes('owner')) return '👤';
    return '👤';
  };

  const handleRoleClick = (role: string) => {
    setSelectedRole(selectedRole === role ? null : role);
    onRoleClick?.(role);
  };

  if (compact) {
    return (
      <div className="role-responsibility-matrix-compact">
        <div className="mb-4">
          <h3 className="h5 fw-bold reddit-text-primary mb-3">Role Overview</h3>
          <div className="d-flex flex-wrap gap-2">
            {sortedRoleData.map((roleData) => (
              <span
                key={roleData.role}
                className={`badge ${getRoleColor(roleData.role)} cursor-pointer`}
                onClick={() => handleRoleClick(roleData.role)}
                style={{cursor: 'pointer'}}
              >
                <span className="me-1">{getRoleIcon(roleData.role)}</span>
                {roleData.role} ({roleData.totalActivities})
              </span>
            ))}
          </div>
        </div>
        
        {selectedRole && (
          <div className="reddit-card">
            <div className="reddit-card-body">
              <h4 className="fw-medium reddit-text-primary mb-3">
                {getRoleIcon(selectedRole)} {selectedRole} - Activities
              </h4>
              <div className="d-flex flex-column gap-2">
                {roleData.find(r => r.role === selectedRole)?.activities.map((activity, index) => (
                  <div
                    key={index}
                    className="reddit-card cursor-pointer"
                    onClick={() => onActivityClick?.(activity)}
                    style={{cursor: 'pointer'}}
                  >
                    <div className="reddit-card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="fw-medium reddit-text-primary">{activity.name}</h5>
                          <p className="reddit-text-secondary small">{activity.description}</p>
                        </div>
                        <div className="d-flex align-items-center gap-2 reddit-text-muted small">
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
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="role-responsibility-matrix">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="h4 fw-bold reddit-text-primary">Role Responsibility Matrix</h3>
            <div className="d-flex align-items-center gap-2">
              <label className="reddit-text-secondary small">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="form-select form-select-sm reddit-input"
                style={{width: 'auto'}}
              >
                <option value="activities">Activities</option>
                <option value="evidence">Evidence</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>
          
          <div className="row g-4">
            {sortedRoleData.map((roleData) => (
              <div key={roleData.role} className="col-lg-4 col-md-6">
                <div
                  className={`reddit-card cursor-pointer ${
                    selectedRole === roleData.role ? 'border-primary' : ''
                  }`}
                  onClick={() => handleRoleClick(roleData.role)}
                  style={{cursor: 'pointer'}}
                >
                  <div className="reddit-card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="fs-2 me-3">{getRoleIcon(roleData.role)}</span>
                      <div>
                        <h4 className="fw-bold reddit-text-primary">{roleData.role}</h4>
                        <p className="reddit-text-secondary small">{roleData.phases.length} phases</p>
                      </div>
                    </div>
                    
                    <div className="row g-2 small">
                      <div className="col-6 d-flex align-items-center">
                        <FaTasks className="reddit-text-muted me-2" />
                        <span className="reddit-text-muted">{roleData.totalActivities} activities</span>
                      </div>
                      {showEvidence && (
                        <div className="col-6 d-flex align-items-center">
                          <FaBook className="text-primary me-2" />
                          <span className="reddit-text-muted">{roleData.evidenceCount} citations</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 pt-3 border-top">
                      <div className="d-flex flex-wrap gap-1">
                        {roleData.phases.map((phase, index) => (
                          <span
                            key={index}
                            className="badge bg-secondary small"
                          >
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {selectedRole && (
        <div className="reddit-card">
          <div className="reddit-card-body">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="h5 fw-bold reddit-text-primary">
                {getRoleIcon(selectedRole)} {selectedRole} - Detailed Activities
              </h4>
              <button
                onClick={() => setSelectedRole(null)}
                className="btn btn-outline-secondary btn-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="d-flex flex-column gap-3">
              {roleData.find(r => r.role === selectedRole)?.activities.map((activity, index) => (
                <div
                  key={index}
                  className="reddit-card cursor-pointer"
                  onClick={() => onActivityClick?.(activity)}
                  style={{cursor: 'pointer'}}
                >
                  <div className="reddit-card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <h5 className="fw-medium reddit-text-primary mb-1">{activity.name}</h5>
                        <p className="reddit-text-secondary small mb-2">{activity.description}</p>
                        
                        {activity.deliverables && activity.deliverables.length > 0 && (
                          <div className="mb-2">
                            <span className="reddit-text-muted small">Deliverables:</span>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {activity.deliverables.map((deliverable, idx) => (
                                <span key={idx} className="badge bg-primary small">
                                  {deliverable}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {showEvidence && activity.citations && activity.citations.length > 0 && (
                          <div>
                            <span className="reddit-text-muted small">Evidence:</span>
                            <div className="d-flex flex-wrap gap-1 mt-1">
                              {activity.citations.map((citation, idx) => (
                                <span key={idx} className="badge bg-success small">
                                  {citation.standard} {citation.section}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="d-flex align-items-center gap-2 reddit-text-muted small ms-3">
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
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleResponsibilityMatrix;
