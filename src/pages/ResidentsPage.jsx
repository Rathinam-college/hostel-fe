import React, { useState } from 'react';

export default function ResidentsPage({ residents, institutes, hostels, rooms, onRegisterResident, onCheckIn, onCheckOut }) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  const [registerData, setRegisterData] = useState({
    reg_no: '',
    full_name: '',
    person_type: 'student',
    institute_id: institutes[0]?.id || 1,
    year_of_study: 1,
    gender: 'Male',
    phone: '',
    guardian_phone: ''
  });

  const [checkInData, setCheckInData] = useState({
    resident_id: null,
    room_id: rooms[0]?.id || 1
  });

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    onRegisterResident(registerData);
    setShowRegisterModal(false);
    setRegisterData({ ...registerData, reg_no: '', full_name: '', phone: '' });
  };

  const handleCheckInSubmit = (e) => {
    e.preventDefault();
    onCheckIn(checkInData);
    setShowCheckInModal(false);
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Resident Students Directory</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Manage resident student profiles and hostel room allocations</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowRegisterModal(true)}>
          ➕ Register New Student
        </button>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Registered Residents</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Reg No</th>
              <th>Student Name</th>
              <th>Institute</th>
              <th>Gender</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {residents && residents.length > 0 ? (
              residents.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>#{r.id}</td>
                  <td><code>{r.reg_no}</code></td>
                  <td><span style={{ fontWeight: 700 }}>{r.full_name}</span></td>
                  <td><span className="badge badge-indigo">{r.institute_code || 'N/A'}</span></td>
                  <td>{r.gender}</td>
                  <td>{r.phone || 'N/A'}</td>
                  <td>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setCheckInData({ ...checkInData, resident_id: r.id });
                        setSelectedResident(r);
                        setShowCheckInModal(true);
                      }}
                    >
                      🚪 Check-In Room
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No residents registered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Register Resident Student</h3>
              <button className="close-btn" onClick={() => setShowRegisterModal(false)}>✕</button>
            </div>
            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label className="form-label">Registration No / Student Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. RTC2026ST001"
                  value={registerData.reg_no}
                  onChange={(e) => setRegisterData({ ...registerData, reg_no: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student Name (`students`)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. snajay"
                  value={registerData.full_name}
                  onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institute (`in_id`)</label>
                <select
                  className="form-select"
                  value={registerData.institute_id}
                  onChange={(e) => setRegisterData({ ...registerData, institute_id: parseInt(e.target.value) })}
                >
                  {institutes.map((i) => (
                    <option key={i.id} value={i.id}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={registerData.gender}
                  onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowRegisterModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCheckInModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Check-In Resident to Room</h3>
              <button className="close-btn" onClick={() => setShowCheckInModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCheckInSubmit}>
              <div className="form-group">
                <label className="form-label">Resident</label>
                <input
                  type="text"
                  className="form-input"
                  value={selectedResident?.full_name || ''}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Room</label>
                <select
                  className="form-select"
                  value={checkInData.room_id}
                  onChange={(e) => setCheckInData({ ...checkInData, room_id: parseInt(e.target.value) })}
                >
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.hostel_name} - Room {r.room_number} (Vacant: {r.vacant})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCheckInModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Check-In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
