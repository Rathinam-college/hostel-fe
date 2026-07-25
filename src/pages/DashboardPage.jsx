import React from 'react';

export default function DashboardPage({ stats, loading, refreshStats }) {
  if (loading) {
    return (
      <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard statistics...</p>
      </div>
    );
  }

  const s = stats || {
    hostels: 0,
    rooms: 0,
    capacity: 0,
    occupied: 0,
    vacant: 0,
    pending_renewals: 0,
    hostel_occupancy: []
  };

  const occupancyRate = s.capacity > 0 ? Math.round((s.occupied / s.capacity) * 100) : 0;

  return (
    <div className="fade-in">
      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">🏢</div>
          <div>
            <div className="stat-value">{s.hostels}</div>
            <div className="stat-label">Hostel Blocks</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">🚪</div>
          <div>
            <div className="stat-value">{s.rooms}</div>
            <div className="stat-label">Total Rooms</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon indigo">🛏️</div>
          <div>
            <div className="stat-value">{s.capacity}</div>
            <div className="stat-label">Total Bed Capacity</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">👥</div>
          <div>
            <div className="stat-value">{s.occupied}</div>
            <div className="stat-label">Occupied Beds ({occupancyRate}%)</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">🔓</div>
          <div>
            <div className="stat-value">{s.vacant}</div>
            <div className="stat-label">Vacant Beds Available</div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Hostel Occupancy Overview */}
        <div className="table-container">
          <div className="table-header">
            <h3>Hostel Occupancy & Capacity Rollup</h3>
            <button className="btn btn-secondary btn-sm" onClick={refreshStats}>
              🔄 Refresh
            </button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Hostel Block</th>
                <th>Gender</th>
                <th>Total Capacity</th>
                <th>Occupied</th>
                <th>Vacant</th>
                <th>Occupancy %</th>
              </tr>
            </thead>
            <tbody>
              {s.hostel_occupancy && s.hostel_occupancy.length > 0 ? (
                s.hostel_occupancy.map((h, idx) => {
                  const pct = h.capacity > 0 ? Math.round((h.occupied / h.capacity) * 100) : 0;
                  return (
                    <tr key={idx}>
                      <td style={{ fontWeight: 700 }}>{h.hostel_name}</td>
                      <td>
                        <span className={`badge ${h.gender === 'Boys' ? 'badge-info' : 'badge-indigo'}`}>
                          {h.gender}
                        </span>
                      </td>
                      <td>{h.capacity} beds</td>
                      <td style={{ color: 'var(--success)', fontWeight: 700 }}>{h.occupied}</td>
                      <td style={{ color: 'var(--warning)', fontWeight: 700 }}>{h.vacant}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No hostel statistics available. Run seed or add hostels to display.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions Panel */}
        <div className="card">
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>Quick Operations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '12px', border: '1px solid #c7d2fe' }}>
              <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '4px' }}>Pending Contract Renewals</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {s.pending_renewals} resident contracts pending annual renewal review for 2026-27.
              </div>
            </div>

            <div style={{ padding: '12px', background: 'var(--success-light)', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              <div style={{ fontWeight: 700, color: 'var(--success)', marginBottom: '4px' }}>System Status</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                PostgreSQL database engine active & synchronized.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
