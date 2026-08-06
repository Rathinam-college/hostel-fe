import React, { useState, useEffect } from 'react';

export default function RenewalsPage({ onPromoteYear }) {
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [promoteData, setPromoteData] = useState({
    institute_id: 'all',
    current_year: 'all',
    increment_by: 1,
    max_year: 4,
    max_year_action: 'graduate'
  });

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

  const handlePromoteSubmit = (e) => {
    e.preventDefault();
    if (onPromoteYear) {
      onPromoteYear(promoteData, () => {
        setShowPromoteModal(false);
        fetchRenewals();
      });
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Renewals Board</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Contract renewal status & year progression.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => setShowPromoteModal(true)} style={{ background: '#f59e0b', color: '#fff', border: 'none' }}>
            🎓 Promote All Students Year (+1 Yr)
          </button>
          <button className="btn btn-secondary btn-sm" onClick={fetchRenewals}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Academic Year Contracts</h3>
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

      {showPromoteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">🎓 Auto Batch Promote Academic Year</h3>
              <button className="close-btn" onClick={() => setShowPromoteModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePromoteSubmit}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid #f59e0b', padding: '12px 16px', borderRadius: '4px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <strong>Pass Academic Year:</strong>
                <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>
                  Automatically promotes all student residents from 1st Year to 2nd Year, 2nd Year to 3rd Year, etc. for the upcoming academic year.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Increment Amount</label>
                <select
                  className="form-select"
                  value={promoteData.increment_by}
                  onChange={(e) => setPromoteData({ ...promoteData, increment_by: parseInt(e.target.value) })}
                >
                  <option value={1}>+1 Year (1st → 2nd, 2nd → 3rd, 3rd → 4th Year)</option>
                  <option value={2}>+2 Years</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">4th Year / Final Year Action</label>
                <select
                  className="form-select"
                  value={promoteData.max_year_action}
                  onChange={(e) => setPromoteData({ ...promoteData, max_year_action: e.target.value })}
                >
                  <option value="graduate">Mark as Graduated / 5th Year</option>
                  <option value="cap">Cap at 4th Year</option>
                  <option value="increment">Increment to Next Year</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPromoteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#f59e0b', color: '#fff', border: 'none' }}>
                  🚀 Confirm & Promote Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
