import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaAngleDoubleLeft, FaAngleDoubleRight, FaHome, FaBook, FaChartBar, FaCogs, FaListUl, FaMagic, FaExternalLinkAlt, FaProjectDiagram } from 'react-icons/fa';
import { apiService, type GeneratedProcessResponse } from '../services/api';
import LoadingSkeleton from './LoadingSkeleton';

type ScenarioTemplate = {
  id: string;
  name: string;
  description: string;
  defaults: {
    lifecycle: 'predictive' | 'agile' | 'hybrid';
    constraints: string[];
  };
};

const SCENARIOS: ScenarioTemplate[] = [
  { id: 'it', name: 'IT / Software', description: 'Product and platform delivery with sprints/releases', defaults: { lifecycle: 'agile', constraints: ['timeboxed sprints', 'backlog changes'] } },
  { id: 'construction', name: 'Construction', description: 'Fixed scope, phased delivery and permits', defaults: { lifecycle: 'predictive', constraints: ['fixed scope', 'regulatory approvals'] } },
  { id: 'research', name: 'Research', description: 'Exploratory work, uncertainty, learning loops', defaults: { lifecycle: 'hybrid', constraints: ['unknown outcomes', 'iterative experiments'] } },
];

const ProcessGenerator = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const [projectName, setProjectName] = useState('');
  const [scenarioId, setScenarioId] = useState<ScenarioTemplate['id']>('it');
  const [lifecycle, setLifecycle] = useState<'predictive' | 'agile' | 'hybrid'>(SCENARIOS[0].defaults.lifecycle);
  const [constraints, setConstraints] = useState<string[]>(SCENARIOS[0].defaults.constraints);
  const [drivers, setDrivers] = useState<string>('Compliance; Time-to-market');
  const [generated, setGenerated] = useState<GeneratedProcessResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({});
  const [expandedCitations, setExpandedCitations] = useState<Record<string, boolean>>({});
  const printRef = useRef<HTMLDivElement | null>(null);

  const selected = useMemo(() => SCENARIOS.find(s => s.id === scenarioId)!, [scenarioId]);

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    localStorage.setItem('sidebarCollapsed', String(next));
  };

  const handleScenarioChange = (id: ScenarioTemplate['id']) => {
    setScenarioId(id);
    const template = SCENARIOS.find(s => s.id === id)!;
    setLifecycle(template.defaults.lifecycle);
    setConstraints(template.defaults.constraints);
  };

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        projectName,
        scenarioId,
        lifecycle,
        constraints,
        drivers: drivers.split(';').map(s => s.trim()).filter(Boolean)
      };
      const data = await apiService.generateProcess(payload);
      setGenerated(data);
      // Default: expand first phase only
      const defaults: Record<string, boolean> = {};
      data.phases.forEach((p, i) => { defaults[p.name] = i === 0; });
      setExpandedPhases(defaults);
    } catch (err) {
      console.error('Failed to generate process', err);
      setGenerated(null);
    } finally {
      setLoading(false);
    }
  };

  const togglePhase = (name: string) => setExpandedPhases(prev => ({ ...prev, [name]: !prev[name] }));
  const toggleCitations = (phaseIdx: number, actIdx: number) => {
    const key = `${phaseIdx}-${actIdx}`;
    setExpandedCitations(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const exportJSON = () => {
    if (!generated) return;
    const blob = new Blob([JSON.stringify(generated, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${projectName || 'process'}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    if (!generated) return;
    const rows: string[] = ['Phase,Activity,Deliverables,Citation Standard,Citation Section'];
    generated.phases.forEach(p => {
      p.activities.forEach(a => {
        const first = a.citations?.[0];
        rows.push([
          `"${p.name}"`,
          `"${a.name}"`,
          `"${(a.deliverables||[]).join('; ')}"`,
          `"${first ? first.standardTitle : ''}"`,
          `"${first ? first.sectionNumber : ''}"`
        ].join(','));
      });
    });
    const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${projectName || 'process'}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const printProcess = () => {
    if (!printRef.current) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<html><head><title>${projectName || 'Process'}</title></head><body>${printRef.current.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  return (
    <div className="min-vh-100 bg-animated position-relative">
      <div className={`reddit-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <div className="reddit-nav-brand">
            <FaRocket className="me-2" />
            <span className="label">PM Standards</span>
          </div>
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
          <Link to="/process-generator" className="reddit-sidebar-link active"><FaCogs className="me-2" /><span className="label">Process Generator</span></Link>
          <Link to="/map" className="reddit-sidebar-link"><FaProjectDiagram className="me-2" /><span className="label">Topic Map</span></Link>
        </div>
      </div>

      <div className={`reddit-main ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="reddit-content">
          <div className="reddit-card mb-4">
            <div className="reddit-card-body">
              <h1 className="display-6 fw-bold reddit-text-primary mb-2">
                <FaCogs className="me-2" /> Process Generator
              </h1>
              <p className="reddit-text-secondary mb-0">Generate tailored project processes for specific scenarios with evidence-based links.</p>
            </div>
          </div>

          <form onSubmit={generate} className="row g-4 align-items-start">
            <div className="col-lg-5">
              <div className="reddit-card" style={{position: 'sticky', top: '16px'}}>
                <div className="reddit-card-body">
                  <div className="mb-3">
                    <label className="form-label">Project name</label>
                    <input className="form-control" value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="e.g., ERP rollout" />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Scenario template</label>
                    <select className="form-control" value={scenarioId} onChange={e => handleScenarioChange(e.target.value as any)}>
                      {SCENARIOS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <div className="small reddit-text-secondary mt-2">{selected.description}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Lifecycle</label>
                    <select className="form-control" value={lifecycle} onChange={e => setLifecycle(e.target.value as any)}>
                      <option value="predictive">Predictive</option>
                      <option value="agile">Agile</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Constraints</label>
                    <input className="form-control" value={constraints.join('; ')} onChange={e => setConstraints(e.target.value.split(';').map(s => s.trim()).filter(Boolean))} placeholder="semicolon separated" />
                    <div className="small reddit-text-secondary mt-2">Examples: fixed scope; regulatory approvals; timeboxed sprints</div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Primary drivers</label>
                    <input className="form-control" value={drivers} onChange={e => setDrivers(e.target.value)} placeholder="semicolon separated" />
                  </div>

                  <div className="d-flex gap-2 flex-wrap">
                    <button type="submit" className="btn-reddit" disabled={loading} aria-busy={loading} aria-disabled={loading}>
                    <FaMagic className="me-2" /> Generate Process
                    </button>
                    <button type="button" className="btn btn-outline-primary" onClick={exportJSON}>Export JSON</button>
                    <button type="button" className="btn btn-outline-primary" onClick={exportCSV}>Export CSV</button>
                    <button type="button" className="btn btn-outline-primary" onClick={printProcess}>Print</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7" ref={printRef}>
              <div className="reddit-card" style={{minHeight: '320px', position: 'relative'}}>
                {loading && (
                  <div style={{position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(1px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2}}>
                    <div className="d-flex flex-column align-items-center">
                      <svg width="56" height="56" viewBox="0 0 50 50" role="img" aria-label="Loading">
                        <g>
                          <circle cx="25" cy="25" r="20" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="none" />
                          <path d="M25 5 a20 20 0 0 1 0 40" stroke="#0dcaf0" strokeWidth="6" fill="none" strokeLinecap="round">
                            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                          </path>
                        </g>
                      </svg>
                      <div className="mt-3 reddit-text-secondary">Generating tailored process… This may take a few seconds.</div>
                    </div>
                  </div>
                )}
                <div className="reddit-card-body" aria-busy={loading}>
                  {loading && (
                    <div className="mb-3">
                      <LoadingSkeleton variant="process" />
                    </div>
                  )}
                  <div className="d-flex align-items-center mb-3">
                    <FaListUl className="me-2" />
                    <h3 className="h5 fw-bold mb-0">Tailored Process</h3>
                  </div>

                  {loading && <p className="reddit-text-secondary mb-0">Preparing recommendations using your inputs…</p>}
                  {!loading && !generated && (
                    <p className="reddit-text-secondary mb-0">Fill the form and click Generate to see the recommended steps with links to relevant standards sections.</p>
                  )}
                  {!loading && generated && (
                    <div>
                      <p className="reddit-text-secondary">{generated.summary}</p>
                      {generated.phases.map((phase, idx) => (
                        <div key={idx} className="mb-3">
                          <button type="button" className="btn btn-outline-primary btn-sm mb-2" onClick={() => togglePhase(phase.name)}>
                            {expandedPhases[phase.name] ? '▾' : '▸'} {phase.name}
                          </button>
                          {expandedPhases[phase.name] && (
                            <div className="row g-3">
                              {phase.activities.map((act, ai) => {
                                const key = `${idx}-${ai}`;
                                const showAll = !!expandedCitations[key];
                                const citations = act.citations || [];
                                const visible = showAll ? citations : citations.slice(0, 2);
                                return (
                                  <div key={ai} className="col-md-6">
                                    <div className="p-3 rounded-3" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)'}}>
                                      <div className="fw-medium mb-1">{act.name}</div>
                                      {visible.length > 0 && (
                                        <div className="small">
                                          {visible.map((c, ci) => (
                                            <div key={ci} className="mb-1">
                                              <Link to={`/section/${c.sectionId}`} className="text-info text-decoration-none">
                                                <FaBook className="me-1" /> {c.standardTitle} {c.sectionNumber}
                                              </Link>
                                            </div>
                                          ))}
                                          {citations.length > 2 && (
                                            <button type="button" className="btn btn-outline-primary btn-sm mt-1" onClick={() => toggleCitations(idx, ai)}>
                                              {showAll ? 'Show less' : `Show ${citations.length - 2} more`}
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {generated && (
                    <div className="mt-4">
                      <div className="small reddit-text-muted mb-2">Evidence-based references</div>
                      <div className="d-flex flex-wrap gap-2">
                        <Link to="/comparison" className="btn btn-outline-primary btn-sm">
                          <FaBook className="me-1" /> Compare Standards <FaExternalLinkAlt className="ms-1" />
                        </Link>
                        <Link to="/insights" className="btn btn-outline-primary btn-sm">
                          <FaChartBar className="me-1" /> Browse Insights <FaExternalLinkAlt className="ms-1" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProcessGenerator;


