import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaAngleDoubleLeft, FaAngleDoubleRight, FaHome, FaBook, FaChartBar, FaCogs } from 'react-icons/fa';
import { apiService, type TopicGraphNode, type TopicGraphEdge } from '../services/api';

type Point = { x: number; y: number };

// Simple force layout (very lightweight) for small graphs
function useForceLayout(
  nodes: TopicGraphNode[],
  edges: TopicGraphEdge[],
  width: number,
  height: number,
  pins: Record<string, Point>
) {
  const [positions, setPositions] = useState<Record<string, Point>>({});

  useEffect(() => {
    const pos: Record<string, Point> = {};
    const n = nodes.length;
    // Initial radial placement by type
    nodes.forEach((node, i) => {
      const angle = (i / Math.max(1, n)) * Math.PI * 2;
      const radius = node.type === 'topic' ? Math.min(width, height) * 0.25
        : node.type === 'section' ? Math.min(width, height) * 0.35
        : Math.min(width, height) * 0.45;
      pos[node.id] = {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle)
      };
    });

    // A few iterations of basic attraction/repulsion
    const iterations = 150;
    const repulsion = 1400;
    const spring = 0.02;
    const springLength: Record<string, number> = {
      'topic-section': 90,
      'section-standard': 110,
    };

    for (let it = 0; it < iterations; it++) {
      // Repulsion between all nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const pa = pos[a.id];
          const pb = pos[b.id];
          const dx = pa.x - pb.x;
          const dy = pa.y - pb.y;
          const distSq = Math.max(1, dx * dx + dy * dy);
          const force = repulsion / distSq;
          const invDist = 1 / Math.sqrt(distSq);
          const fx = force * dx * invDist;
          const fy = force * dy * invDist;
          pa.x += fx; pa.y += fy;
          pb.x -= fx; pb.y -= fy;
        }
      }

      // Attraction along edges
      edges.forEach((e) => {
        const a = pos[e.source];
        const b = pos[e.target];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));
        const rest = springLength[e.kind] ?? 100;
        const f = spring * (dist - rest);
        const ux = dx / dist;
        const uy = dy / dist;
        a.x += f * ux; a.y += f * uy;
        b.x -= f * ux; b.y -= f * uy;
      });

      // Nudge towards center
      const cx = width / 2, cy = height / 2;
      nodes.forEach((node) => {
        const p = pos[node.id];
        // Respect pins: override with fixed position during iterations
        const pinned = pins[node.id];
        if (pinned) {
          p.x = pinned.x; p.y = pinned.y;
        } else {
          p.x += (cx - p.x) * 0.002;
          p.y += (cy - p.y) * 0.002;
        }
      });
    }

    setPositions(pos);
  }, [nodes, edges, width, height, pins]);

  return positions;
}

const TopicMap = () => {
  const [data, setData] = useState<{ nodes: TopicGraphNode[]; edges: TopicGraphEdge[]; metadata: { topics: { topic: string; coverage: number }[]; counts: { nodes: number; edges: number } } } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refetching, setRefetching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dims, setDims] = useState({ width: 960, height: 600 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number } | null>(null);
  const [topicLimit, setTopicLimit] = useState<number>(8);
  const [sectionsPerTopic, setSectionsPerTopic] = useState<number>(12);
  const [scale, setScale] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const isPanning = useRef<boolean>(false);
  const panStart = useRef<{ x: number; y: number } | null>(null);
  const [pins, setPins] = useState<Record<string, Point>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const [visibleStandards, setVisibleStandards] = useState<Set<number>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => localStorage.getItem('sidebarCollapsed') === 'true');
  const inFlight = useRef<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const w = Math.min(window.innerWidth - 40, 1200);
      const h = Math.min(window.innerHeight - 160, 800);
      setDims({ width: Math.max(640, w), height: Math.max(400, h) });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initialize from query params
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const tl = sp.get('tl');
    const spv = sp.get('sp');
    if (tl) setTopicLimit(parseInt(tl));
    if (spv) setSectionsPerTopic(parseInt(spv));
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (inFlight.current) return; // prevent overlapping requests
      inFlight.current = true;
      try {
        if (!data) { if (!loading) setLoading(true); } else { if (!refetching) setRefetching(true); }
        const graph = await apiService.getGraph({ topicLimit, sectionsPerTopic });
        if (!cancelled) setData(graph);
      } catch {
        if (!cancelled) setError('Failed to load topic map');
      } finally {
        inFlight.current = false;
        if (!cancelled) {
          if (loading) setLoading(false);
          if (refetching) setRefetching(false);
        }
      }
    };
    const t = setTimeout(load, 250); // debounce quick slider changes
    return () => { cancelled = true; clearTimeout(t); };
  }, [topicLimit, sectionsPerTopic]);

  const positions = useForceLayout(data?.nodes || [], data?.edges || [], dims.width, dims.height, pins);

  const highlighted = useMemo(() => {
    if (!hoverId) return new Set<string>();
    const set = new Set<string>([hoverId]);
    (data?.edges || []).forEach(e => {
      if (e.source === hoverId) set.add(e.target);
      if (e.target === hoverId) set.add(e.source);
    });
    return set;
  }, [hoverId, data]);

  // Initialize visible standards once when data loads (must be before any early returns)
  useEffect(() => {
    if (!data) return;
    if (visibleStandards.size === 0) {
      const stdIds = data.nodes.filter(n => n.type === 'standard').map(n => n.meta?.id as number);
      if (stdIds.length > 0) setVisibleStandards(new Set(stdIds));
    }
  // Note: we intentionally do not include visibleStandards.size in deps to avoid infinite resets
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (loading) {
    return (
      <div className="reddit-layout">
        <div className="reddit-main">
          <div className="reddit-content py-4">
            {/* Skeleton card */}
            <div className="reddit-card mb-4">
              <div className="reddit-card-body">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div style={{height: 10, width: 120, background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'}}></div>
                  <div style={{height: 10, width: 200, background: 'linear-gradient(90deg, rgba(255,255,255,0.06), rgba(255,255,255,0.12), rgba(255,255,255,0.06))', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'}}></div>
                </div>
                <div style={{height: 420, borderRadius: 8, background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))', position: 'relative', overflow: 'hidden'}}>
                  {/* Placeholder nodes */}
                  {[...Array(18)].map((_, i) => (
                    <div key={i} style={{position:'absolute', left: `${5 + (i*5)%90}%`, top: `${10 + (i*11)%80}%`, width: 10, height: 10, borderRadius: 6, background: 'rgba(255,255,255,0.12)'}} />
                  ))}
                  <div style={{position:'absolute', inset:0, background:'radial-gradient(ellipse at center, rgba(13,110,253,0.08) 0%, rgba(0,0,0,0) 60%)'}} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="reddit-layout">
        <div className="reddit-main">
          <div className="reddit-content text-center py-5">
            <h2 className="h4 reddit-text-primary mb-2">Topic Map</h2>
            <p className="reddit-text-secondary">{error || 'No data'}</p>
          </div>
        </div>
      </div>
    );
  }

  const copyLink = () => {
    const stdParam = Array.from(visibleStandards).join(',');
    const url = `${location.origin}/map?tl=${topicLimit}&sp=${sectionsPerTopic}${stdParam ? `&show=${stdParam}` : ''}`;
    navigator.clipboard.writeText(url);
  };

  const toggleStandard = (id: number) => {
    setVisibleStandards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="reddit-layout">
      {/* Sidebar */}
      <div className={`reddit-sidebar${isCollapsed ? ' collapsed' : ''}`}>
        <div className="reddit-sidebar-section">
          <div className="reddit-nav-brand">
            <FaRocket className="me-2" />
            <span className="label">PM Standards</span>
          </div>
          <button className="sidebar-toggle" onClick={() => { const next = !isCollapsed; setIsCollapsed(next); localStorage.setItem('sidebarCollapsed', String(next)); }} title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
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
          <Link to="/map" className="reddit-sidebar-link active"><FaChartBar className="me-2" /><span className="label">Topic Map</span></Link>
        </div>
      </div>

      <div className={`reddit-main${isCollapsed ? ' collapsed' : ''}`}>
        <div className="reddit-nav">
          <div className="container d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h5 fw-bold reddit-text-primary mb-0">Visual Topic Map</h1>
              <p className="reddit-text-secondary mb-0">Hover to highlight. Scroll to zoom. Drag to pan. Click sections to open. Click standards to browse.</p>
            </div>
            <div className="reddit-nav-links">
              <Link to="/insights" className="reddit-nav-link">Insights</Link>
              <Link to="/comparison" className="reddit-nav-link">Comparison</Link>
            </div>
          </div>
        </div>
        <div className="reddit-content">
          <div className="reddit-card">
            <div className="reddit-card-body">
              {/* Controls */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3" style={{position:'sticky', top: 0, zIndex: 2}}>
                <div className="d-flex align-items-center gap-2">
                  <label className="small reddit-text-secondary">Topics:</label>
                  <input type="range" min={3} max={12} value={topicLimit} onChange={(e) => setTopicLimit(parseInt(e.target.value))} />
                  <span className="small">{topicLimit}</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <label className="small reddit-text-secondary">Sections/Topic:</label>
                  <input type="range" min={6} max={24} step={2} value={sectionsPerTopic} onChange={(e) => setSectionsPerTopic(parseInt(e.target.value))} />
                  <span className="small">{sectionsPerTopic}</span>
                </div>
                <button type="button" className="btn btn-outline-primary btn-sm ms-2" onClick={copyLink}>Copy Link</button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setScale(1); setOffset({ x: 0, y: 0 }); }}>Reset View</button>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => { setPins({}); }}>Reset Layout</button>
                <div className="ms-auto small reddit-text-muted">{data.metadata?.counts?.nodes || 0} nodes • {data.metadata?.counts?.edges || 0} edges</div>
              </div>

              {/* Standard filters */}
              <div className="d-flex flex-wrap align-items-center gap-3 mb-3">
                {data.nodes.filter(n => n.type === 'standard').map(n => (
                  <label key={n.id} className="small d-flex align-items-center gap-2">
                    <input type="checkbox" checked={visibleStandards.has(n.meta?.id)} onChange={() => toggleStandard(n.meta?.id)} />
                    {n.label}
                  </label>
                ))}
              </div>

              <svg
                ref={svgRef}
                width={dims.width}
                height={dims.height}
                role="img"
                aria-label="Topic Map"
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY < 0 ? 1.1 : 0.9;
                  const next = Math.min(3, Math.max(0.5, scale * delta));
                  setScale(next);
                }}
                onMouseDown={(e) => {
                  isPanning.current = true;
                  panStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
                }}
                onMouseMove={(e) => {
                  setMouse({ x: e.clientX, y: e.clientY });
                  if (isPanning.current && panStart.current) {
                    setOffset({ x: e.clientX - panStart.current.x, y: e.clientY - panStart.current.y });
                  }
                }}
                onMouseUp={() => { isPanning.current = false; }}
                onMouseLeave={() => { isPanning.current = false; setMouse(null); }}
              >
                <defs>
                  <radialGradient id="bgGradient" cx="50%" cy="50%" r="70%">
                    <stop offset="0%" stopColor="rgba(13,110,253,0.08)" />
                    <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                  <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <g transform={`translate(${offset.x},${offset.y}) scale(${scale})`}>
                {/* Soft background */}
                <rect x={-10000} y={-10000} width={20000} height={20000} fill="url(#bgGradient)" />
                {/* Edges */}
                {data.edges
                  .filter((e) => {
                    // Hide edges for hidden standards
                    const trgStd = data.nodes.find(n => n.id === e.target && n.type === 'standard');
                    const srcStd = data.nodes.find(n => n.id === e.source && n.type === 'standard');
                    const stdId = (trgStd?.meta?.id as number) || (srcStd?.meta?.id as number) || null;
                    return stdId == null || visibleStandards.has(stdId);
                  })
                  .map((e, idx) => {
                  const a = positions[e.source];
                  const b = positions[e.target];
                  if (!a || !b) return null;
                  const active = highlighted.size === 0 || (highlighted.has(e.source) && highlighted.has(e.target));
                  return (
                    <line key={idx} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                      stroke={e.kind === 'topic-section' ? 'rgba(13,110,253,0.35)' : 'rgba(255,107,53,0.35)'}
                      strokeWidth={active ? 2.5 : 1} opacity={active ? 1 : 0.3} />
                  );
                })}

                {/* Nodes */}
                {data.nodes
                  .filter((n) => n.type !== 'section' || visibleStandards.has(n.meta?.standardId))
                  .filter((n) => n.type !== 'standard' || visibleStandards.has(n.meta?.id))
                  .map((n) => {
                  const p = positions[n.id];
                  if (!p) return null;
                  const isActive = highlighted.size === 0 || highlighted.has(n.id);
                  const showLabel = hoverId === n.id; // show labels only on hover
                  const r = n.size ? n.size / 2 : 8;
                  const fill = n.type === 'topic' ? '#0d6efd' : n.type === 'section' ? '#6c757d' : '#ff6b35';
                  const link = n.type === 'section' ? `/section/${n.meta?.id}` : n.type === 'standard' ? `/standard/${n.meta?.id}` : undefined;
                  const content = (
                    <g key={n.id} transform={`translate(${p.x},${p.y})`} onMouseEnter={() => setHoverId(n.id)} onMouseLeave={() => setHoverId(null)}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDragId(n.id);
                        // pin on first drag
                        setPins(prev => ({ ...prev, [n.id]: { x: p.x, y: p.y } }));
                      }}
                      onMouseUp={(e: React.MouseEvent) => { e.stopPropagation(); setDragId(null); }}
                    >
                      <circle r={r} fill={fill} opacity={isActive ? 1 : 0.25} stroke="#ffffff" strokeWidth={1} style={{ cursor: 'grab' }} filter={showLabel || selectedId === n.id ? 'url(#nodeGlow)' : undefined} onClick={(e) => { e.stopPropagation(); setSelectedId(n.id); }} />
                      {showLabel && (
                        <g>
                          <rect x={-80} y={-r - 26} width={160} height={18} rx={4} ry={4} fill="rgba(0,0,0,0.6)" />
                          <text y={-r - 14} textAnchor="middle" fontSize="10" fill="#fff" style={{ pointerEvents: 'none' }}>{n.label}</text>
                        </g>
                      )}
                    </g>
                  );
                  return link ? (
                    <a key={n.id} href={link} style={{ cursor: 'pointer' }}>
                      {content}
                    </a>
                  ) : content;
                })}
                </g>
              </svg>
              {/* Refetch overlay */}
              {refetching && (
                <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', pointerEvents:'none'}}>
                  <div className="reddit-spinner"></div>
                </div>
              )}
              {/* Drag handling over the whole svg (update pinned position in graph coords) */}
              {dragId && svgRef.current && (
                <DragController svg={svgRef.current} scale={scale} offset={offset} onMove={(gx, gy) => setPins(prev => ({ ...prev, [dragId]: { x: gx, y: gy } }))} onEnd={() => setDragId(null)} />
              )}
              {/* Tooltip (richer info) */}
              {hoverId && mouse && data && (() => {
                // Keep tooltip inside viewport by flipping to the left/top when near edges
                const tipWidth = 240; // px (approx)
                const tipHeight = 64; // px (approx)
                const margin = 12;
                let left = mouse.x + margin;
                let top = mouse.y + margin;
                if (left + tipWidth > window.innerWidth - 8) left = mouse.x - tipWidth - margin;
                if (top + tipHeight > window.innerHeight - 8) top = mouse.y - tipHeight - margin;
                return (
                  <div style={{ position: 'fixed', left, top, background: 'rgba(0,0,0,0.8)', color: '#fff', padding: '6px 8px', borderRadius: 6, fontSize: 12, pointerEvents: 'none', zIndex: 1000, maxWidth: tipWidth }}>
                  {(() => {
                    const node = data.nodes.find(n => n.id === hoverId)!;
                    if (node.type === 'section') {
                      return <div><div style={{ fontWeight: 600, marginBottom: 2 }}>Section</div><div>{node.label}</div></div>;
                    }
                    if (node.type === 'standard') {
                      return <div><div style={{ fontWeight: 600, marginBottom: 2 }}>Standard</div><div>{node.label}</div></div>;
                    }
                    return <div><div style={{ fontWeight: 600, marginBottom: 2 }}>Topic</div><div>{node.label}</div></div>;
                  })()}
                  </div>
                );
              })()}
              {/* Right info panel */}
              {selectedId && data && (
                <div className="reddit-card" style={{position:'absolute', right: 16, top: 16, width: 320, zIndex: 3}}>
                  <div className="reddit-card-body">
                    {(() => {
                      const node = data.nodes.find(n => n.id === selectedId)!;
                      return (
                        <div>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="fw-bold reddit-text-primary">{node.type.charAt(0).toUpperCase() + node.type.slice(1)}</div>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedId(null)}>Close</button>
                          </div>
                          <div className="small reddit-text-secondary mb-2">{node.label}</div>
                          {node.type === 'section' && (
                            <div className="d-flex gap-2">
                              <Link to={`/section/${node.meta?.id}`} className="btn btn-primary btn-sm">Open Section</Link>
                              {node.meta?.standardId && <Link to={`/standard/${node.meta.standardId}`} className="btn btn-outline-primary btn-sm">Open Standard</Link>}
                            </div>
                          )}
                          {node.type === 'standard' && (
                            <div className="d-flex gap-2">
                              <Link to={`/standard/${node.meta?.id}`} className="btn btn-primary btn-sm">Open Standard</Link>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="reddit-card">
            <div className="reddit-card-body d-flex align-items-center gap-4">
              <div className="d-flex align-items-center gap-2"><span style={{ display: 'inline-block', width: 12, height: 12, background: '#0d6efd', borderRadius: 6 }}></span> <span className="small">Topic</span></div>
              <div className="d-flex align-items-center gap-2"><span style={{ display: 'inline-block', width: 12, height: 12, background: '#6c757d', borderRadius: 6 }}></span> <span className="small">Section</span></div>
              <div className="d-flex align-items-center gap-2"><span style={{ display: 'inline-block', width: 12, height: 12, background: '#ff6b35', borderRadius: 6 }}></span> <span className="small">Standard</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicMap;

// Overlay component to capture mouse moves and convert to graph coordinates
function DragController({ svg, scale, offset, onMove, onEnd }: { svg: SVGSVGElement; scale: number; offset: { x: number; y: number }; onMove: (gx: number, gy: number) => void; onEnd: () => void; }) {
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;
      onMove(x, y);
    };
    const handleUp = () => onEnd();
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp, { once: true });
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp as EventListener);
    };
  }, [svg, scale, offset.x, offset.y, onMove, onEnd]);
  return null;
}


