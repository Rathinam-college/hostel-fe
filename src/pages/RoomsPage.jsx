import React, { useState } from 'react';

export default function RoomsPage({ rooms, hostels, sharingTypes, onAddRoom, onDeleteRoom, refreshRooms }) {
  const [filterHostel, setFilterHostel] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Form Data States
  const [addFormData, setAddFormData] = useState({
    hostel_id: hostels[0]?.id || 1,
    room_number: '',
    floor: '1',
    sharing_type_id: sharingTypes[0]?.id || 1,
    capacity: 4
  });

  const [editFormData, setEditFormData] = useState({
    id: null,
    hostel_id: 1,
    room_number: '',
    floor: '1',
    sharing_type_id: 1,
    capacity: 4
  });

  // Auto-calculated capacity from Sharing Type
  const handleAddSharingTypeChange = (stId) => {
    const selectedSt = sharingTypes?.find((st) => st.id.toString() === stId.toString());
    const autoBedCount = selectedSt?.bed_count || (selectedSt?.label?.toLowerCase().includes('2') ? 2 : selectedSt?.label?.toLowerCase().includes('3') ? 3 : 4);
    setAddFormData((prev) => ({
      ...prev,
      sharing_type_id: stId,
      capacity: autoBedCount
    }));
  };

  const handleEditSharingTypeChange = (stId) => {
    const selectedSt = sharingTypes?.find((st) => st.id.toString() === stId.toString());
    const autoBedCount = selectedSt?.bed_count || (selectedSt?.label?.toLowerCase().includes('2') ? 2 : selectedSt?.label?.toLowerCase().includes('3') ? 3 : 4);
    setEditFormData((prev) => ({
      ...prev,
      sharing_type_id: stId,
      capacity: autoBedCount
    }));
  };

  const filteredRooms = (rooms || []).filter((r) => {
    const matchesHostel = filterHostel === 'all' || r.hostel_id.toString() === filterHostel;
    const matchesSearch = !searchQuery || r.room_number.toLowerCase().includes(searchQuery.toLowerCase()) || (r.floor || '').toString().includes(searchQuery);
    const matchesStatus = filterStatus === 'all'
      ? true
      : filterStatus === 'vacant'
      ? r.vacant > 0
      : r.vacant === 0;
    return matchesHostel && matchesSearch && matchesStatus;
  });

  // Create Room Handler
  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAddRoom(addFormData);
    setShowAddModal(false);
    setAddFormData({ ...addFormData, room_number: '' });
  };

  // Edit Room Handler
  const handleOpenEditModal = (room) => {
    setEditFormData({
      id: room.id,
      hostel_id: room.hostel_id,
      room_number: room.room_number,
      floor: room.floor || '1',
      sharing_type_id: room.sharing_type_id || 1,
      capacity: room.capacity || 4
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.id) return;

    fetch(`/api/rooms/${editFormData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editFormData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          if (refreshRooms) refreshRooms();
          setShowEditModal(false);
        }
      });
  };

  const handleDeleteRoomClick = (roomId, roomNum) => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNum}?`)) {
      onDeleteRoom(roomId);
    }
  };

  return (
    <div className="fade-in">
      {/* Header & Add Room Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Rooms Infrastructure & Management (Full CRUD)</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage room numbers, floor levels, bed capacities, and sharing types with full Create, Edit, & Delete controls
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          ➕ Add New Room
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ marginBottom: '24px', padding: '18px 24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <input
              type="text"
              className="form-input"
              placeholder="🔍 Search room number or floor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="form-select"
            value={filterHostel}
            onChange={(e) => setFilterHostel(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">🏢 All Hostels</option>
            {hostels.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>

          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="all">All Status</option>
            <option value="vacant">🟢 Vacant Beds Available</option>
            <option value="full">🔴 Fully Occupied</option>
          </select>

          <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-hover)', padding: '4px', borderRadius: '10px' }}>
            <button
              className={`btn btn-sm ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
            >
              🔳 Cards View
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('table')}
            >
              📋 Data Table
            </button>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE CARDS GRID WITH EDIT & DELETE */}
      {viewMode === 'grid' ? (
        <div className="grid-cards">
          {filteredRooms && filteredRooms.length > 0 ? (
            filteredRooms.map((r) => {
              const isFull = r.vacant === 0;
              const pct = r.capacity > 0 ? Math.round((r.occupied / r.capacity) * 100) : 0;
              return (
                <div key={r.id} className="grid-card-item" style={{ borderTop: `4px solid ${isFull ? 'var(--danger)' : 'var(--success)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      🚪 Room {r.room_number}
                    </span>
                    <span className={`badge ${isFull ? 'badge-danger' : 'badge-success'}`}>
                      {isFull ? 'Fully Occupied' : `${r.vacant} Vacant`}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    Hostel: <strong style={{ color: 'var(--text-primary)' }}>{r.hostel_name}</strong> • Floor {r.floor || '1'}
                  </div>

                  {/* Bed Chips Visual */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                    {Array.from({ length: r.capacity || 4 }).map((_, idx) => {
                      const isBedOccupied = idx < (r.occupied || 0);
                      return (
                        <span
                          key={idx}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: isBedOccupied ? '#e0e7ff' : '#dcfce7',
                            color: isBedOccupied ? '#4338ca' : '#15803d',
                            border: `1px solid ${isBedOccupied ? '#c7d2fe' : '#86efac'}`
                          }}
                        >
                          Bed {String.fromCharCode(65 + idx)} {isBedOccupied ? '👤' : '🟢'}
                        </span>
                      );
                    })}
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>Occupancy Rate</span>
                      <span>{r.occupied} / {r.capacity} Beds ({pct}%)</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: isFull ? 'var(--danger)' : 'var(--primary)', borderRadius: '3px' }}></div>
                    </div>
                  </div>

                  {/* ROOM LEVEL CRUD CONTROLS */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <span className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                      {r.sharing_type_label || `${r.capacity} Sharing`}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditModal(r)}>
                        ✏️ Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoomClick(r.id, r.room_number)}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
              No rooms match your filter criteria.
            </div>
          )}
        </div>
      ) : (
        /* VIEW MODE 2: DETAILED DATA TABLE WITH EDIT & DELETE */
        <div className="table-container">
          <div className="table-header">
            <h3>Registered Rooms Table</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Hostel Block</th>
                <th>Floor Level</th>
                <th>Room Number</th>
                <th>Sharing Type</th>
                <th>Total Beds</th>
                <th>Occupied</th>
                <th>Vacant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms && filteredRooms.length > 0 ? (
                filteredRooms.map((r) => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 700 }}>#{r.id}</td>
                    <td>{r.hostel_name}</td>
                    <td>Floor {r.floor || '1'}</td>
                    <td><span style={{ fontWeight: 800, color: 'var(--primary)' }}>Room {r.room_number}</span></td>
                    <td><span className="badge badge-indigo">{r.sharing_type_label || 'Default'}</span></td>
                    <td>{r.capacity} beds</td>
                    <td style={{ color: 'var(--success)', fontWeight: 700 }}>{r.occupied}</td>
                    <td style={{ color: 'var(--warning)', fontWeight: 700 }}>{r.vacant}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEditModal(r)}>
                          ✏️ Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRoomClick(r.id, r.room_number)}>
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                    No rooms match your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL 1: ADD NEW ROOM --- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Room</h3>
              <button className="close-btn" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddSubmit}>
              <div className="form-group">
                <label className="form-label">Hostel Block</label>
                <select
                  className="form-select"
                  value={addFormData.hostel_id}
                  onChange={(e) => setAddFormData({ ...addFormData, hostel_id: parseInt(e.target.value) })}
                >
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room Number / Range (e.g. <code>101-105</code>)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 101 or 101-105"
                  value={addFormData.room_number}
                  onChange={(e) => setAddFormData({ ...addFormData, room_number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Floor Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1, 2, 3"
                  value={addFormData.floor}
                  onChange={(e) => setAddFormData({ ...addFormData, floor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sharing Type</label>
                <select
                  className="form-select"
                  value={addFormData.sharing_type_id}
                  onChange={(e) => handleAddSharingTypeChange(e.target.value)}
                >
                  {sharingTypes && sharingTypes.length > 0 ? (
                    sharingTypes.map((st) => (
                      <option key={st.id} value={st.id}>{st.label}</option>
                    ))
                  ) : (
                    <option value="1">4 Sharing</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bed Capacity (Auto-calculated from Sharing Type)</label>
                <input
                  type="number"
                  className="form-input"
                  value={addFormData.capacity}
                  onChange={(e) => setAddFormData({ ...addFormData, capacity: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT EXISTING ROOM --- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Room Details</h3>
              <button className="close-btn" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label className="form-label">Hostel Block</label>
                <select
                  className="form-select"
                  value={editFormData.hostel_id}
                  onChange={(e) => setEditFormData({ ...editFormData, hostel_id: parseInt(e.target.value) })}
                >
                  {hostels.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.room_number}
                  onChange={(e) => setEditFormData({ ...editFormData, room_number: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Floor Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.floor}
                  onChange={(e) => setEditFormData({ ...editFormData, floor: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Sharing Type</label>
                <select
                  className="form-select"
                  value={editFormData.sharing_type_id}
                  onChange={(e) => handleEditSharingTypeChange(e.target.value)}
                >
                  {sharingTypes && sharingTypes.length > 0 ? (
                    sharingTypes.map((st) => (
                      <option key={st.id} value={st.id}>{st.label}</option>
                    ))
                  ) : (
                    <option value="1">4 Sharing</option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Bed Capacity (Auto-calculated)</label>
                <input
                  type="number"
                  className="form-input"
                  value={editFormData.capacity}
                  onChange={(e) => setEditFormData({ ...editFormData, capacity: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
