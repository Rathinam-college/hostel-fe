import React, { useState } from 'react';

export default function InstitutesPage({ institutes, onAddInstitute }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    course_type: 'UG'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddInstitute(formData);
    setShowModal(false);
    setFormData({ code: '', name: '', course_type: 'UG' });
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Institutes Master Directory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage affiliated colleges and academic institutions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Add Institute
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Colleges & Schools Directory</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Institute ID</th>
              <th>Code</th>
              <th>Institute Name</th>
              <th>Course Type</th>
            </tr>
          </thead>
          <tbody>
            {institutes && institutes.length > 0 ? (
              institutes.map((i) => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 700 }}>#{i.id}</td>
                  <td><code>{i.code}</code></td>
                  <td><span style={{ fontWeight: 700 }}>{i.name}</span></td>
                  <td><span className="badge badge-indigo">{i.course_type}</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No institutes registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Institute</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Institute Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. RGU-ARTS, RTC, RCP"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institute Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. RGU ARTS, RTC Undergraduate"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Type</label>
                <select
                  className="form-select"
                  value={formData.course_type}
                  onChange={(e) => setFormData({ ...formData, course_type: e.target.value })}
                >
                  <option value="UG">UG (Undergraduate)</option>
                  <option value="PG">PG (Postgraduate)</option>
                  <option value="MBA">MBA</option>
                  <option value="MCA">MCA</option>
                  <option value="PHD">PhD</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Institute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
