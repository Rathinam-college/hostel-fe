import React, { useState } from 'react';

export default function UsersPage({ users, hostels, onAddUser }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'staff',
    hostel_id: hostels[0]?.id || null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddUser(formData);
    setShowModal(false);
    setFormData({ username: '', password: '', full_name: '', role: 'staff', hostel_id: null });
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Staff & Warden User Accounts</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Management users access control & role permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Add User Account
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Portal Users Directory</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Assigned Hostel Scope</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 700 }}>#{u.id}</td>
                  <td><code>{u.username}</code></td>
                  <td><span style={{ fontWeight: 700 }}>{u.full_name}</span></td>
                  <td>
                    <span className={`badge ${
                      u.role === 'admin' ? 'badge-danger' :
                      u.role === 'warden' ? 'badge-warning' : 'badge-indigo'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.hostel_name || 'All Hostels (Global)'}</td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-success' : 'badge-danger'}`}>
                      {u.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No users found.
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
              <h3 className="modal-title">Add Portal User</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. warden_westend"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. K. Ramesh"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="warden">Warden (Hostel Scoped)</option>
                  <option value="staff">Staff (Operational)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>

              {formData.role === 'warden' && (
                <div className="form-group">
                  <label className="form-label">Scope to Hostel Block</label>
                  <select
                    className="form-select"
                    value={formData.hostel_id || ''}
                    onChange={(e) => setFormData({ ...formData, hostel_id: parseInt(e.target.value) })}
                  >
                    {hostels.map((h) => (
                      <option key={h.id} value={h.id}>{h.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
