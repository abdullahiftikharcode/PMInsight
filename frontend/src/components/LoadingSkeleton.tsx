import React from 'react';

type Variant = 'dashboard' | 'insights' | 'standard' | 'process' | 'generic';

const SkeletonStyles = () => (
  <style>
    {`
      @keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      .skeleton { background: linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.12) 37%, rgba(255,255,255,0.06) 63%); background-size: 400% 100%; animation: skeleton-shimmer 1.6s ease-in-out infinite; border-radius: 8px; }
      .skeleton-pill { border-radius: 999px; }
      .skeleton-card { border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(6px); border-radius: 12px; }
    `}
  </style>
);

export const LoadingSkeleton: React.FC<{ variant?: Variant }> = ({ variant = 'generic' }) => {
  if (variant === 'dashboard') {
    return (
      <div className="min-vh-100 bg-animated">
        <SkeletonStyles />
        <div className="container py-5">
          <div className="skeleton-card mb-4 p-4">
            <div className="skeleton" style={{ height: 32, width: '45%', marginBottom: 10 }}></div>
            <div className="skeleton" style={{ height: 14, width: '60%' }}></div>
          </div>
          <div className="row g-4 mb-4">
            {[0,1,2,3].map(i => (
              <div className="col-md-3" key={i}>
                <div className="skeleton-card p-4 text-center">
                  <div className="skeleton" style={{ height: 48, width: 48, borderRadius: 8, margin: '0 auto 12px' }}></div>
                  <div className="skeleton" style={{ height: 24, width: '40%', margin: '0 auto 6px' }}></div>
                  <div className="skeleton" style={{ height: 14, width: '50%', margin: '0 auto' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-4">
            {[0,1,2,3,4,5].map(i => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="skeleton-card p-3">
                  <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }}></div>
                  <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 16 }}></div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="skeleton-pill skeleton" style={{ height: 16, width: 110 }}></div>
                    <div className="skeleton" style={{ height: 28, width: 80, borderRadius: 6 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'insights') {
    return (
      <div className="min-vh-100 bg-animated">
        <SkeletonStyles />
        <div className="container py-5">
          <div className="row text-center g-4 mb-4">
            {[0,1,2,3].map(i => (
              <div className="col-6 col-md-3" key={i}>
                <div className="skeleton" style={{ height: 36, width: '60%', margin: '0 auto 6px' }}></div>
                <div className="skeleton" style={{ height: 12, width: '50%', margin: '0 auto' }}></div>
              </div>
            ))}
          </div>
          <div className="row g-4">
            {[0,1,2].map(i => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="skeleton-card p-4">
                  <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 16 }}></div>
                  <div className="row g-3">
                    {[0,1,2,3].map(j => (
                      <div className="col-6" key={j}>
                        <div className="skeleton" style={{ height: 46, width: '100%' }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'standard') {
    return (
      <div className="min-vh-100 bg-animated">
        <SkeletonStyles />
        <div className="container py-4">
          <div className="skeleton-card p-4 mb-4">
            <div className="skeleton" style={{ height: 28, width: '50%', marginBottom: 8 }}></div>
            <div className="skeleton" style={{ height: 14, width: '30%' }}></div>
          </div>
          {[0,1,2,3,4,5].map(i => (
            <div className="skeleton-card p-3 mb-3" key={i}>
              <div className="skeleton" style={{ height: 18, width: '70%', marginBottom: 8 }}></div>
              <div className="skeleton" style={{ height: 12, width: '90%', marginBottom: 6 }}></div>
              <div className="skeleton" style={{ height: 12, width: '85%' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'process') {
    return (
      <div className="min-vh-100 bg-animated">
        <SkeletonStyles />
        <div className="container py-4">
          <div className="row g-4">
            <div className="col-lg-5">
              <div className="skeleton-card p-4">
                {[0,1,2,3,4].map(i => (
                  <div key={i} className="mb-3">
                    <div className="skeleton" style={{ height: 12, width: 120, marginBottom: 8 }}></div>
                    <div className="skeleton" style={{ height: 36, width: '100%' }}></div>
                  </div>
                ))}
                <div className="d-flex gap-2">
                  <div className="skeleton" style={{ height: 36, width: 140, borderRadius: 6 }}></div>
                  <div className="skeleton" style={{ height: 36, width: 120, borderRadius: 6 }}></div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="skeleton-card p-4" style={{ minHeight: 320 }}>
                <div className="skeleton" style={{ height: 18, width: 180, marginBottom: 16 }}></div>
                {[0,1,2].map(i => (
                  <div key={i} className="skeleton" style={{ height: 14, width: `${90 - i*10}%`, marginBottom: 8 }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // generic
  return (
    <div className="min-vh-100 bg-animated">
      <SkeletonStyles />
      <div className="container py-5 text-center">
        <div className="skeleton" style={{ width: 240, height: 20, margin: '0 auto 12px' }}></div>
        <div className="skeleton-pill skeleton" style={{ width: 200, height: 10, margin: '0 auto' }}></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;


