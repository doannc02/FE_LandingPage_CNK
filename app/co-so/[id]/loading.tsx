export default function BranchDetailLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      {/* Hero skeleton */}
      <div style={{ height: '24rem', background: '#e5e7eb', animation: 'pulse 1.5s ease-in-out infinite' }} />

      <div style={{
        maxWidth: '80rem', margin: '0 auto', padding: '2.5rem 1.5rem 5rem',
        display: 'flex', flexDirection: 'column', gap: '3.5rem',
      }}>
        {/* Info + Map skeleton */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Info card */}
          <div style={{
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem',
            padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.375rem',
          }}>
            <div style={{ height: '1.25rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '10rem' }} />
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', background: '#f3f4f6', borderRadius: '0.5rem', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ height: '0.625rem', background: '#f3f4f6', borderRadius: '0.25rem', width: '4rem' }} />
                  <div style={{ height: '0.875rem', background: '#f3f4f6', borderRadius: '0.25rem', width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
          {/* Map */}
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', overflow: 'hidden' }}>
            <div style={{ height: '3.25rem', background: '#f3f4f6' }} />
            <div style={{ aspectRatio: '4/3', background: '#f3f4f6' }} />
          </div>
        </div>

        {/* Coaches skeleton */}
        <div>
          <div style={{ height: '1.375rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '12rem', marginBottom: '0.5rem' }} />
          <div style={{ width: '3rem', height: '3px', background: '#f3f4f6', borderRadius: '2px', marginBottom: '1.75rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '1.25rem', overflow: 'hidden' }}>
                <div style={{ height: '6.5rem', background: '#f3f4f6' }} />
                <div style={{ padding: '0.625rem 1.25rem 1.375rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ height: '1rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '60%' }} />
                  <div style={{ height: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '45%' }} />
                  <div style={{ height: '0.75rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '80%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery skeleton */}
        <div>
          <div style={{ height: '1.375rem', background: '#f3f4f6', borderRadius: '0.5rem', width: '9rem', marginBottom: '0.5rem' }} />
          <div style={{ width: '3rem', height: '3px', background: '#f3f4f6', borderRadius: '2px', marginBottom: '1.75rem' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={{ aspectRatio: '1', background: '#f3f4f6', borderRadius: '1rem' }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
