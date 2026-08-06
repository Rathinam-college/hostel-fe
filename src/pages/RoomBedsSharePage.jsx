import React, { useState, useEffect } from 'react';

export default function RoomBedsSharePage() {
  const [auditData, setAuditData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = () => {
    setLoading(true);
    fetch('/api/reports/opening-closing')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAuditData(data.data || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Aggregated Summary Calculations
  const openingTotalBeds = auditData.reduce((acc, h) => acc + (h.opening_total_beds || 0), 0);
  const totalOccupied = auditData.reduce((acc, h) => acc + (h.occupied_beds || 0), 0);
  const closingVacantBeds = auditData.reduce((acc, h) => acc + (h.closing_vacant_beds || 0), 0);
  const overallOccupancyPct = openingTotalBeds > 0 ? Math.round((totalOccupied / openingTotalBeds) * 100) : 0;

  return (
    <div className="fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Beds & Sharing Types</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Bed capacities & vacant balances per block.
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchAuditData}>
          🔄 Refresh Live Data
        </button>
      </div>

      {/* SECTION 1: TOP SUMMARY STAT CARDS */}
      <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-label">Opening Total Beds</div>
          <div className="stat-value" style={{ color: 'var(--primary)' }}>{openingTotalBeds} Beds</div>
          <div className="stat-desc">Total capacity initialized</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Currently Occupied</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{totalOccupied} Beds</div>
          <div className="stat-desc">Checked-in residents</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Closing Vacancy Count</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{closingVacantBeds} Beds</div>
          <div className="stat-desc">Available beds remaining</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overall Occupancy</div>
          <div className="stat-value">{overallOccupancyPct}%</div>
          <div className="stat-desc">Block utilization rate</div>
        </div>
      </div>

      {/* SECTION 2: HOSTEL BLOCK OPENING vs CLOSING GRAPH & CHARTS */}
      <div className="card" style={{ marginBottom: '28px', background: '#FFFFFF', borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              📊 Opening vs Closing Vacancy Graph per Hostel Block
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Visual bed count distribution across physical hostel blocks
            </span>
          </div>
          <span className="badge badge-indigo">Live DB Sync</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '16px', gridColumn: '1 / -1', textAlign: 'center' }}>
              Loading hostel vacancy graph data from database...
            </div>
          ) : auditData && auditData.length > 0 ? (
            auditData.map((h) => (
              <div
                key={h.hostel_id}
                style={{
                  background: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>🏢 {h.hostel_name}</h4>
                  <span className={`badge ${h.gender?.toLowerCase() === 'girls' ? 'badge-indigo' : 'badge-info'}`}>
                    {h.gender}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ background: '#FFFFFF', padding: '8px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Opening</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--primary)' }}>{h.opening_total_beds}</div>
                  </div>
                  <div style={{ background: '#ECFDF5', padding: '8px', borderRadius: '8px', border: '1px solid #6EE7B7' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Occupied</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--success)' }}>{h.occupied_beds}</div>
                  </div>
                  <div style={{ background: '#FFFBEB', padding: '8px', borderRadius: '8px', border: '1px solid #FDE68A' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>Closing</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--warning)' }}>{h.closing_vacant_beds}</div>
                  </div>
                </div>

                {/* Capacity Graph Progress Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    <span>Occupancy Rate</span>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{h.occupancy_rate}%</span>
                  </div>
                  <div style={{ height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${h.occupancy_rate}%`,
                        height: '100%',
                        background: h.occupancy_rate > 90 ? 'var(--danger)' : 'var(--primary)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '16px', gridColumn: '1 / -1', textAlign: 'center' }}>
              No hostel vacancy data recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
