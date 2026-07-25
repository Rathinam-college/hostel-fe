import React, { useState, useEffect } from 'react';

export default function RenewalsPage() {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRenewals();
  }, []);

  const fetchRenewals = () => {
    setLoading(true);
    fetch('/api/renewals')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setRenewals(data.data || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleUpdateStatus = (id, newStatus) => {
    fetch(`/api/renewals/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ renewal_status: newStatus })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchRenewals();
        }
      });
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Academic Contract Renewals</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage annual contract renewal status (TBR, R, RR, V, WV, YTC)</p>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={fetchRenewals}>
          🔄 Refresh
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Academic Year 2026-27 Contracts</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Renewal ID</th>
              <th>Resident Name</th>
              <th>Reg No</th>
              <th>Hostel / Room</th>
              <th>Academic Year</th>
              <th>Status</th>
              <th>Update Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading renewals data...</td>
              </tr>
            ) : renewals && renewals.length > 0 ? (
              renewals.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>#{r.id}</td>
                  <td><span style={{ fontWeight: 700 }}>{r.resident_name}</span></td>
                  <td><code>{r.reg_no}</code></td>
                  <td>{r.hostel_name} - Room {r.room_number}</td>
                  <td>{r.academic_year}</td>
                  <td>
                    <span className={`badge ${
                      r.renewal_status === 'R' ? 'badge-success' :
                      r.renewal_status === 'V' ? 'badge-danger' :
                      r.renewal_status === 'TBR' ? 'badge-warning' : 'badge-info'
                    }`}>
                      {r.renewal_status === 'TBR' ? 'To Be Renewed' :
                       r.renewal_status === 'R' ? 'Renewed' :
                       r.renewal_status === 'V' ? 'Vacating' : r.renewal_status}
                    </span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.8rem', width: 'auto' }}
                      value={r.renewal_status}
                      onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                    >
                      <option value="TBR">To Be Renewed (TBR)</option>
                      <option value="R">Renewed (R)</option>
                      <option value="RR">Re-Renewal (RR)</option>
                      <option value="V">Vacating (V)</option>
                      <option value="WV">Will Vacate (WV)</option>
                      <option value="YTC">Yet To Confirm (YTC)</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No active renewals records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
