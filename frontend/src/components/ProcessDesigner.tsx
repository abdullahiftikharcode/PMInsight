import React, { useState, useEffect } from 'react';
import { FaMagic, FaDownload, FaPrint, FaCogs } from 'react-icons/fa';
import ScenarioSelector from './ScenarioSelector';
import ProcessFlowDiagram from './process/ProcessFlowDiagram';
import PhaseTimeline from './process/PhaseTimeline';
import RoleResponsibilityMatrix from './process/RoleResponsibilityMatrix';
import DecisionGateFramework from './process/DecisionGateFramework';
import { apiService } from '../services/api';

interface ProcessDesignerProps {
  onProcessGenerated?: (process: any) => void;
  onProcessExported?: (process: any, format: string) => void;
  initialScenario?: string;
}

interface ProcessInputs {
  projectName: string;
  scenarioId: string;
  lifecycle: 'predictive' | 'agile' | 'hybrid';
  constraints: string[];
  drivers: string[];
  teamSize?: string;
  duration?: string;
  budget?: string;
  riskTolerance?: 'low' | 'medium' | 'high';
}

const ProcessDesigner: React.FC<ProcessDesignerProps> = ({
  onProcessGenerated,
  onProcessExported,
  initialScenario
}) => {
  const [currentStep, setCurrentStep] = useState<'scenario' | 'inputs' | 'generation' | 'results'>('scenario');
  const [selectedScenario, setSelectedScenario] = useState<string>(initialScenario || '');
  const [processInputs, setProcessInputs] = useState<ProcessInputs>({
    projectName: '',
    scenarioId: '',
    lifecycle: 'hybrid',
    constraints: [],
    drivers: []
  });
  const [generatedProcess, setGeneratedProcess] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'flow' | 'timeline' | 'matrix' | 'gates'>('flow');
  const [showEvidence, setShowEvidence] = useState(true);
  const [showDeliverables, setShowDeliverables] = useState(true);
  const [showRoles, setShowRoles] = useState(true);

  useEffect(() => {
    if (selectedScenario) {
      setProcessInputs(prev => ({ ...prev, scenarioId: selectedScenario }));
      setCurrentStep('inputs');
    }
  }, [selectedScenario]);

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setError(null);
  };

  const handleInputChange = (field: keyof ProcessInputs, value: any) => {
    setProcessInputs(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerateProcess = async () => {
    if (!processInputs.projectName.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const process = await apiService.generateProcessForScenario(processInputs.scenarioId, processInputs);
      setGeneratedProcess(process);
      setCurrentStep('results');
      onProcessGenerated?.(process);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate process');
    } finally {
      setLoading(false);
    }
  };

  const handleExportProcess = async (format: 'json' | 'csv' | 'pdf') => {
    if (!generatedProcess) return;

    try {
      const exportData = await apiService.exportProcess(generatedProcess, format);
      onProcessExported?.(generatedProcess, format);
      
      // Create download link
      const blob = new Blob([exportData], { type: format === 'json' ? 'application/json' : 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${generatedProcess.projectName || 'process'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export process');
    }
  };

  const handlePrintProcess = () => {
    window.print();
  };

  const renderScenarioStep = () => (
    <div className="scenario-step">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <h2 className="display-6 fw-bold reddit-text-primary mb-3">
            <FaMagic className="me-2" style={{color: 'var(--reddit-orange)'}} />
            Choose Your Project Scenario
          </h2>
          <p className="reddit-text-secondary mb-4">
            Select the scenario that best matches your project requirements. Each scenario is tailored for specific project types and constraints.
          </p>
        </div>
      </div>
      <ScenarioSelector
        onScenarioSelect={handleScenarioSelect}
        selectedScenario={selectedScenario}
        showDetails={true}
      />
    </div>
  );

  const renderInputsStep = () => (
    <div className="inputs-step">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <h2 className="display-6 fw-bold reddit-text-primary mb-3">
            <FaCogs className="me-2" style={{color: 'var(--reddit-blue)'}} />
            Configure Process Parameters
          </h2>
          <p className="reddit-text-secondary mb-4">
            Provide details about your project to generate a tailored process with evidence-based recommendations.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="reddit-card">
            <div className="reddit-card-body">
              <h5 className="reddit-text-primary mb-3">Basic Information</h5>
              <div className="mb-3">
                <label className="form-label reddit-text-secondary">Project Name</label>
                <input
                  type="text"
                  value={processInputs.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                  className="form-control reddit-input"
                  placeholder="Enter project name"
                />
              </div>

              <div className="mb-3">
                <label className="form-label reddit-text-secondary">Lifecycle Approach</label>
                <select
                  value={processInputs.lifecycle}
                  onChange={(e) => handleInputChange('lifecycle', e.target.value)}
                  className="form-select reddit-input"
                >
                  <option value="predictive">Predictive (Waterfall)</option>
                  <option value="agile">Agile (Iterative)</option>
                  <option value="hybrid">Hybrid (Adaptive)</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label reddit-text-secondary">Constraints</label>
                <input
                  type="text"
                  value={processInputs.constraints.join('; ')}
                  onChange={(e) => handleInputChange('constraints', e.target.value.split(';').map(s => s.trim()).filter(Boolean))}
                  className="form-control reddit-input"
                  placeholder="e.g., timeboxed sprints; regulatory approvals"
                />
                <div className="form-text reddit-text-muted">Separate multiple constraints with semicolons</div>
              </div>

              <div className="mb-3">
                <label className="form-label reddit-text-secondary">Primary Drivers</label>
                <input
                  type="text"
                  value={processInputs.drivers.join('; ')}
                  onChange={(e) => handleInputChange('drivers', e.target.value.split(';').map(s => s.trim()).filter(Boolean))}
                  className="form-control reddit-input"
                  placeholder="e.g., Time-to-market; Quality; Compliance"
                />
                <div className="form-text reddit-text-muted">Separate multiple drivers with semicolons</div>
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="reddit-card">
              <div className="reddit-card-body">
                <h5 className="reddit-text-primary mb-3">Project Details</h5>
                <div className="mb-3">
                  <label className="form-label reddit-text-secondary">Team Size</label>
                  <input
                    type="text"
                    value={processInputs.teamSize || ''}
                    onChange={(e) => handleInputChange('teamSize', e.target.value)}
                    className="form-control reddit-input"
                    placeholder="e.g., 5-10 members"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label reddit-text-secondary">Duration</label>
                  <input
                    type="text"
                    value={processInputs.duration || ''}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                    className="form-control reddit-input"
                    placeholder="e.g., 6 months"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label reddit-text-secondary">Budget</label>
                  <input
                    type="text"
                    value={processInputs.budget || ''}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    className="form-control reddit-input"
                    placeholder="e.g., $100,000"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label reddit-text-secondary">Risk Tolerance</label>
                  <select
                    value={processInputs.riskTolerance || 'medium'}
                    onChange={(e) => handleInputChange('riskTolerance', e.target.value)}
                    className="form-select reddit-input"
                  >
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 d-flex justify-content-end">
        <button
          onClick={handleGenerateProcess}
          disabled={loading || !processInputs.projectName.trim()}
          className="btn-reddit btn-lg"
        >
          {loading ? (
            <>
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              Generating Process...
            </>
          ) : (
            <>
              <FaMagic className="me-2" />
              Generate Process
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderResultsStep = () => (
    <div className="results-step">
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h2 className="display-6 fw-bold reddit-text-primary mb-2">
                <FaMagic className="me-2" style={{color: 'var(--reddit-orange)'}} />
                Generated Process
              </h2>
              <p className="reddit-text-secondary mb-0">
                <strong>{generatedProcess?.projectName}</strong> - {generatedProcess?.scenario}
              </p>
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={() => handleExportProcess('json')}
                className="btn-reddit-secondary btn-sm"
              >
                <FaDownload className="me-1" />
                JSON
              </button>
              <button
                onClick={() => handleExportProcess('csv')}
                className="btn-reddit-secondary btn-sm"
              >
                <FaDownload className="me-1" />
                CSV
              </button>
              <button
                onClick={handlePrintProcess}
                className="btn-reddit-outline btn-sm"
              >
                <FaPrint className="me-1" />
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div className="reddit-card mb-4">
        <div className="reddit-card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2">
                <label className="form-label reddit-text-secondary mb-0">View:</label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as any)}
                  className="form-select reddit-input"
                  style={{width: 'auto'}}
                >
                  <option value="flow">Process Flow</option>
                  <option value="timeline">Timeline</option>
                  <option value="matrix">Role Matrix</option>
                  <option value="gates">Decision Gates</option>
                </select>
              </div>
            </div>
            <div className="d-flex align-items-center gap-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={showEvidence}
                  onChange={(e) => setShowEvidence(e.target.checked)}
                  className="form-check-input"
                  id="showEvidence"
                />
                <label className="form-check-label reddit-text-secondary" htmlFor="showEvidence">
                  Evidence
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={showDeliverables}
                  onChange={(e) => setShowDeliverables(e.target.checked)}
                  className="form-check-input"
                  id="showDeliverables"
                />
                <label className="form-check-label reddit-text-secondary" htmlFor="showDeliverables">
                  Deliverables
                </label>
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  checked={showRoles}
                  onChange={(e) => setShowRoles(e.target.checked)}
                  className="form-check-input"
                  id="showRoles"
                />
                <label className="form-check-label reddit-text-secondary" htmlFor="showRoles">
                  Roles
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Visualization */}
      {generatedProcess ? (
        <div className="process-visualization">
          {viewMode === 'flow' && (
            <ProcessFlowDiagram
              process={generatedProcess}
              showEvidence={showEvidence}
              showDeliverables={showDeliverables}
              showRoles={showRoles}
            />
          )}
          {viewMode === 'timeline' && (
            <PhaseTimeline
              phases={generatedProcess.phases}
              showEvidence={showEvidence}
              orientation="horizontal"
            />
          )}
          {viewMode === 'matrix' && (
            <RoleResponsibilityMatrix
              phases={generatedProcess.phases}
              showEvidence={showEvidence}
            />
          )}
          {viewMode === 'gates' && (
            <DecisionGateFramework
              phases={generatedProcess.phases}
              showEvidence={showEvidence}
              showCriteria={true}
            />
          )}
        </div>
      ) : (
        <div className="reddit-card">
          <div className="reddit-card-body text-center py-5">
            <div className="mb-3">
              <span className="fs-1">🚀</span>
            </div>
            <h4 className="reddit-text-primary mb-2">Ready to Generate Your Process?</h4>
            <p className="reddit-text-secondary mb-0">
              Configure your project parameters and click "Generate Process" to create a tailored process visualization.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="process-designer">
      {error && (
        <div className="alert alert-danger mb-4">
          <div className="d-flex align-items-center">
            <span className="me-2">❌</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {currentStep === 'scenario' && renderScenarioStep()}
      {currentStep === 'inputs' && renderInputsStep()}
      {currentStep === 'results' && renderResultsStep()}
    </div>
  );
};

export default ProcessDesigner;
