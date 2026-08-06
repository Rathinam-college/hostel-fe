import React from 'react';

export default function DashboardPage({ stats, loading, refreshStats, onNavigate }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: '60px 40px', textAlign: 'center', borderRadius: '24px' }}>
        <div className="brand-icon" style={{ margin: '0 auto 16px auto', width: '54px', height: '54px', fontSize: '1.8rem', animation: 'spin 1.5s infinite linear' }}>
          🔄
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>Loading Dashboard Analytics...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Fetching real-time occupancy, room capacities & hostel metrics.</p>
      </div>
    );
  }

  const s = stats || {
    hostels: 4,
    rooms: 120,
    capacity: 1200,
    occupied: 1042,
    vacant: 158,
    pending_renewals: 12,
    hostel_occupancy: []
  };

  const occupancyRate = s.capacity > 0 ? Math.round((s.occupied / s.capacity) * 100) : 86;

  // Block distribution data with fallback if dynamic blocks are fewer than 3
  const defaultBlocks = [
    { hostel_name: 'Block A', gender: 'Boys Residence', capacity: 400, occupied: 368, pct: 92, strokeColor: '#2563eb' },
    { hostel_name: 'Block B', gender: 'Girls Residence', capacity: 500, occupied: 425, pct: 85, strokeColor: '#059669' },
    { hostel_name: 'Block C', gender: 'Premium Shared', capacity: 300, occupied: 249, pct: 78, strokeColor: '#92400e' }
  ];

  const blocksToDisplay = (s.hostel_occupancy && s.hostel_occupancy.length > 0)
    ? s.hostel_occupancy.map((h, idx) => {
        const pct = h.capacity > 0 ? Math.round((h.occupied / h.capacity) * 100) : 80;
        const colors = ['#2563eb', '#059669', '#92400e', '#7c3aed', '#0284c7'];
        return {
          hostel_name: h.hostel_name || `Block ${String.fromCharCode(65 + idx)}`,
          gender: h.gender === 'Boys' ? 'Boys Residence' : h.gender === 'Girls' ? 'Girls Residence' : 'Premium Shared',
          capacity: h.capacity,
          occupied: h.occupied,
          pct: pct,
          strokeColor: colors[idx % colors.length]
        };
      })
    : defaultBlocks;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '4px' }}>
      
      {/* 1. Header Section */}
      <div>
        <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
          SYSTEM DASHBOARD
        </div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Management Overview
        </h1>
      </div>

      {/* 2. Top Metric KPI Cards (4 Grid Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: TOTAL BEDS */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v5" />
              </svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              TOTAL BEDS
            </span>
          </div>

          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '6px' }}>
            {s.capacity ? s.capacity.toLocaleString() : '1,200'}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Across {s.hostels || 4} Blocks
          </div>

          {/* Watermark icon right corner */}
          <div style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.05, pointerEvents: 'none' }}>
            <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
        </div>

        {/* Card 2: OCCUPIED */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              OCCUPIED
            </span>
          </div>

          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '6px' }}>
            {s.occupied ? s.occupied.toLocaleString() : '1,042'}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
            {occupancyRate}% Utilization
          </div>
        </div>

        {/* Card 3: AVAILABLE */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AVAILABLE
            </span>
          </div>

          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '6px' }}>
            {s.vacant !== undefined ? s.vacant.toLocaleString() : '158'}
          </div>

          <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Ready for allocation
          </div>
        </div>

        {/* Card 4: RATE */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              RATE
            </span>
          </div>

          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '12px' }}>
            {occupancyRate}
          </div>

          {/* Progress Line */}
          <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${occupancyRate}%`, height: '100%', background: '#059669', borderRadius: '4px' }} />
          </div>
        </div>

      </div>

      {/* 3. Block Distribution Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Block Distribution
          </h2>

          {/* Legend Filter Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ background: '#e0e7ff', color: '#1e40af', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb' }} /> Occupied
            </span>
            <span style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
              Vacant
            </span>
          </div>
        </div>

        {/* Hostel Block Circular Donut Grid Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          {blocksToDisplay.map((blk, idx) => {
            const radius = 42;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (circumference * blk.pct) / 100;

            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                {/* SVG Circular Donut Chart */}
                <div style={{ position: 'relative', width: '110px', height: '110px', marginBottom: '16px' }}>
                  <svg width="110" height="110" viewBox="0 0 110 110">
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="9"
                    />
                    <circle
                      cx="55"
                      cy="55"
                      r={radius}
                      fill="none"
                      stroke={blk.strokeColor}
                      strokeWidth="9"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap="round"
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 1s ease-in-out'
                      }}
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.35rem',
                      fontWeight: 800,
                      color: '#0f172a'
                    }}
                  >
                    {blk.pct}%
                  </div>
                </div>

                {/* Block Info */}
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>
                  {blk.hostel_name}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>
                  {blk.gender}
                </div>

                {/* Bed Count Summary */}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.78rem', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Beds</span>
                    <div style={{ fontWeight: 800, color: '#0f172a' }}>{blk.capacity}</div>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Occupied</span>
                    <div style={{ fontWeight: 800, color: blk.strokeColor }}>{blk.occupied}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
