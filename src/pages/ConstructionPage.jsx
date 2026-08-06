import React, { useState, useEffect } from 'react';

export default function ConstructionPage({ hostels }) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/construction')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setPhases(data.data || []);
        }
      });
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Expansion Tracker</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Upcoming hostel block expansions.</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Active & Planned Expansion Projects</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Phase ID</th>
              <th>Hostel Block</th>
              <th>Phase Name</th>
              <th>Beds Coming Online</th>
              <th>Expected Completion</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {phases && phases.length > 0 ? (
              phases.map((p) => (
                <tr key={p.id}>
                  <td style={{ fontWeight: 700 }}>#{p.id}</td>
                  <td>{p.hostel_name}</td>
                  <td><span style={{ fontWeight: 700 }}>{p.phase_name}</span></td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>+{p.beds_added} beds</td>
                  <td>{p.completion_date || 'TBD'}</td>
                  <td>
                    <span className={`badge ${
                      p.status === 'completed' ? 'badge-success' :
                      p.status === 'in_progress' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No construction expansion phases registered.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
