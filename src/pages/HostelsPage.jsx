import React, { useState, useEffect } from 'react';

export default function HostelsPage({ hostels, onAddHostel, onDeleteHostel }) {
  const [showModal, setShowModal] = useState(false);
  const [showAddFloorsModal, setShowAddFloorsModal] = useState(false);
  const [targetHostelId, setTargetHostelId] = useState(null);
  const [addFloorsInput, setAddFloorsInput] = useState('1-5');

  const [floorsMap, setFloorsMap] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    gender: 'Boys',
    warden_name: '',
    warden_phone: '',
    floor_range: '1-5'
  });

  useEffect(() => {
    fetchAllFloors();
  }, [hostels]);

  const fetchAllFloors = () => {
    fetch('/api/floors')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          const map = {};
          (data.data || []).forEach((fl) => {
            if (!map[fl.hostel_id]) map[fl.hostel_id] = [];
            map[fl.hostel_id].push(fl);
          });
          setFloorsMap(map);
        }
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    onAddHostel(formData);
    setFormData({ name: '', gender: 'Boys', warden_name: '', warden_phone: '', floor_range: '1-5' });
    setShowModal(false);
    setTimeout(() => fetchAllFloors(), 1000);
  };

  const handleAddFloorsToHostel = (e) => {
    e.preventDefault();
    if (!targetHostelId || !addFloorsInput) return;

    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostel_id: parseInt(targetHostelId),
        floor: addFloorsInput,
        is_floor_only: true
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchAllFloors();
          setShowAddFloorsModal(false);
        }
      });
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Hostel Blocks Management</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage physical hostel blocks and their associated floor levels (1-5)
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          ➕ Add New Hostel Block
        </button>
      </div>

      {/* Hostel Cards Grid with Floors inside */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {hostels && hostels.length > 0 ? (
          hostels.map((h) => {
            const hostelFloors = floorsMap[h.id] || [];
            return (
              <div
                key={h.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '22px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                      {h.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: h.gender?.toLowerCase() === 'girls' ? '#FCE7F3' : '#E0F2FE',
                        color: h.gender?.toLowerCase() === 'girls' ? '#DB2777' : '#0284C7',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {h.gender || 'BOYS'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                    <div>Warden: <span style={{ color: 'var(--text-muted)' }}>{h.warden_name || 'Unassigned'}</span></div>
                    <div>Phone: <span style={{ color: 'var(--text-muted)' }}>{h.warden_phone || 'N/A'}</span></div>
                  </div>

                  {/* Registered Floors Section inside Hostel Card */}
                  <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '12px', border: '1px solid #F1F5F9', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                        Floors ({hostelFloors.length})
                      </span>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => {
                          setTargetHostelId(h.id);
                          setShowAddFloorsModal(true);
                        }}
                        style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                      >
                        ➕ Add Floors
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {hostelFloors.length > 0 ? (
                        hostelFloors.map((fl) => (
                          <span
                            key={fl.id}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              background: '#EEF2FF',
                              color: 'var(--primary)',
                              border: '1px solid #C7D2FE'
                            }}
                          >
                            📶 Floor {fl.floor_number}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          No floors added yet. Click 'Add Floors' above.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                  <button className="btn btn-danger btn-sm" onClick={() => onDeleteHostel(h.id)}>
                    🗑️ Delete Hostel
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
            No hostels found. Click 'Add New Hostel Block' to create one.
          </div>
        )}
      </div>

      {/* Modal 1: Add New Hostel Block with Floor Range */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Hostel Block</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Hostel Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chillies, Westend, White, Eachanari"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender Allocation</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Floor Range to Create (e.g. <code>1-5</code>)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1-5"
                  value={formData.floor_range}
                  onChange={(e) => setFormData({ ...formData, floor_range: e.target.value })}
                />
                <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Entering <code>1-5</code> automatically creates Floor 1, Floor 2, Floor 3, Floor 4, Floor 5 inside this new hostel!
                </small>
              </div>

              <div className="form-group">
                <label className="form-label">Warden Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Mr. Rajesh Kumar"
                  value={formData.warden_name}
                  onChange={(e) => setFormData({ ...formData, warden_name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Warden Phone (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. +91 9876543210"
                  value={formData.warden_phone}
                  onChange={(e) => setFormData({ ...formData, warden_phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Hostel & Floors
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Add Floors Range to Existing Hostel */}
      {showAddFloorsModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Floors Range</h3>
              <button className="close-btn" onClick={() => setShowAddFloorsModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddFloorsToHostel}>
              <div className="form-group">
                <label className="form-label">Floor Level Range (e.g. <code>1-5</code>)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1-5 or 1-10"
                  value={addFloorsInput}
                  onChange={(e) => setAddFloorsInput(e.target.value)}
                  required
                />
                <small style={{ color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  Entering <code>1-5</code> generates 5 floor levels inside this hostel block.
                </small>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddFloorsModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Generate Floors Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
