import React, { useState, useEffect } from 'react';

export default function FloorsPage({ hostels, rooms, sharingTypes, onAddHostel, onDeleteHostel, refreshRooms }) {
  const [openHostelId, setOpenHostelId] = useState(hostels[0]?.id?.toString() || '1');
  const [openFloorNumber, setOpenFloorNumber] = useState('1');

  const [floorsMap, setFloorsMap] = useState({});
  const [currentHostelFloors, setCurrentHostelFloors] = useState([]);

  // Modals state for CRUD operations
  const [showAddHostelModal, setShowAddHostelModal] = useState(false);
  const [showEditHostelModal, setShowEditHostelModal] = useState(false);
  const [showAddFloorModal, setShowAddFloorModal] = useState(false);
  const [showEditFloorModal, setShowEditFloorModal] = useState(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [showEditRoomModal, setShowEditRoomModal] = useState(false);

  // Edit Targets
  const [editingHostelData, setEditingHostelData] = useState({ id: null, name: '', gender: 'Boys', warden_name: '', warden_phone: '' });
  const [editingFloorData, setEditingFloorData] = useState({ id: null, floor_number: '1', floor_name: '' });
  const [editingRoomData, setEditingRoomData] = useState({ id: null, room_number: '', capacity: 4, sharing_type_id: 1 });

  // Creation Forms State
  const [newHostelData, setNewHostelData] = useState({ name: '', gender: 'Boys', warden_name: '', warden_phone: '', floor_range: '1-5' });
  const [floorRangeInput, setFloorRangeInput] = useState('1-5');
  const [roomRangeForm, setRoomRangeForm] = useState({ room_range: '101-105', capacity: 4, sharing_type_id: sharingTypes?.[0]?.id || 1 });

  useEffect(() => {
    if (hostels && hostels.length > 0 && !openHostelId) {
      setOpenHostelId(hostels[0].id.toString());
    }
    fetchAllFloors();
  }, [hostels]);

  useEffect(() => {
    if (openHostelId) {
      fetchFloorsForHostel(openHostelId);
    }
  }, [openHostelId]);

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

  const fetchFloorsForHostel = (hostelId) => {
    fetch(`/api/floors?hostel_id=${hostelId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          const list = data.data || [];
          setCurrentHostelFloors(list);
          if (list.length > 0) {
            setOpenFloorNumber(list[0].floor_number);
          } else {
            setOpenFloorNumber('1');
          }
        }
      });
  };

  const toggleHostel = (hostelId) => {
    const idStr = hostelId.toString();
    if (openHostelId === idStr) {
      setOpenHostelId(null);
    } else {
      setOpenHostelId(idStr);
      fetchFloorsForHostel(idStr);
    }
  };

  // --- HOSTEL CRUD ---
  const handleCreateHostelSubmit = (e) => {
    e.preventDefault();
    if (!newHostelData.name) return;
    onAddHostel(newHostelData);
    setNewHostelData({ name: '', gender: 'Boys', warden_name: '', warden_phone: '', floor_range: '1-5' });
    setShowAddHostelModal(false);
    setTimeout(() => fetchAllFloors(), 1000);
  };

  const handleEditHostelSubmit = (e) => {
    e.preventDefault();
    if (!editingHostelData.id) return;
    fetch(`/api/hostels/${editingHostelData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingHostelData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          if (refreshRooms) refreshRooms();
          setShowEditHostelModal(false);
        }
      });
  };

  const handleDeleteHostelClick = (hostelId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name} block?`)) {
      onDeleteHostel(hostelId);
    }
  };

  // --- FLOOR CRUD ---
  const handleBatchCreateFloors = (e) => {
    e.preventDefault();
    if (!openHostelId || !floorRangeInput) return;

    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostel_id: parseInt(openHostelId),
        floor: floorRangeInput,
        is_floor_only: true
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchFloorsForHostel(openHostelId);
          fetchAllFloors();
          if (refreshRooms) refreshRooms();
          setShowAddFloorModal(false);
        }
      });
  };

  const handleEditFloorSubmit = (e) => {
    e.preventDefault();
    if (!editingFloorData.id) return;
    fetch(`/api/floors/${editingFloorData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingFloorData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchFloorsForHostel(openHostelId);
          fetchAllFloors();
          setShowEditFloorModal(false);
        }
      });
  };

  const handleDeleteFloorClick = (floorId, floorNum) => {
    if (window.confirm(`Are you sure you want to delete Floor ${floorNum}?`)) {
      fetch(`/api/floors/${floorId}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            fetchFloorsForHostel(openHostelId);
            fetchAllFloors();
            if (refreshRooms) refreshRooms();
          }
        });
    }
  };

  // --- ROOM CRUD ---
  const handleSharingTypeChange = (stId, isEdit = false) => {
    const selectedSt = sharingTypes?.find((st) => st.id.toString() === stId.toString());
    const autoBedCount = selectedSt?.bed_count || (selectedSt?.label?.toLowerCase().includes('2') ? 2 : selectedSt?.label?.toLowerCase().includes('3') ? 3 : 4);
    if (isEdit) {
      setEditingRoomData((prev) => ({ ...prev, sharing_type_id: stId, capacity: autoBedCount }));
    } else {
      setRoomRangeForm((prev) => ({ ...prev, sharing_type_id: stId, capacity: autoBedCount }));
    }
  };

  const handleBatchCreateRooms = (e) => {
    e.preventDefault();
    if (!openHostelId || !openFloorNumber || !roomRangeForm.room_range) return;

    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hostel_id: parseInt(openHostelId),
        floor: openFloorNumber,
        room_number: roomRangeForm.room_range,
        capacity: parseInt(roomRangeForm.capacity),
        sharing_type_id: parseInt(roomRangeForm.sharing_type_id)
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          if (refreshRooms) refreshRooms();
          setShowAddRoomModal(false);
        }
      });
  };

  const handleEditRoomSubmit = (e) => {
    e.preventDefault();
    if (!editingRoomData.id) return;

    fetch(`/api/rooms/${editingRoomData.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingRoomData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          if (refreshRooms) refreshRooms();
          setShowEditRoomModal(false);
        }
      });
  };

  const handleDeleteRoomClick = (roomId, roomNum) => {
    if (window.confirm(`Are you sure you want to delete Room ${roomNum}?`)) {
      fetch(`/api/rooms/${roomId}`, { method: 'DELETE' })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 'success') {
            if (refreshRooms) refreshRooms();
          }
        });
    }
  };

  const selectedHostelObj = hostels?.find((h) => h.id.toString() === openHostelId?.toString());
  const floorRooms = (rooms || []).filter(
    (r) =>
      openHostelId &&
      r.hostel_id.toString() === openHostelId.toString() &&
      (r.floor || '1').toString() === openFloorNumber.toString() &&
      r.capacity > 0
  );

  const totalFloorCapacity = floorRooms.reduce((acc, r) => acc + (r.capacity || 0), 0);
  const totalFloorOccupied = floorRooms.reduce((acc, r) => acc + (r.occupied || 0), 0);
  const totalFloorVacant = floorRooms.reduce((acc, r) => acc + (r.vacant || 0), 0);

  return (
    <div className="fade-in">
      {/* Page Title & Add New Hostel Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Hostels, Floors & Rooms Infrastructure (Full CRUD)</h2>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
            Create, Edit, & Delete Hostels, Floors, and Rooms with live database sync
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddHostelModal(true)}>
          ➕ Add New Hostel Block
        </button>
      </div>

      {/* STEP 1: HOSTEL BLOCKS LIST (Full CRUD on Hostel Level) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {hostels && hostels.length > 0 ? (
          hostels.map((h) => {
            const isHostelOpen = openHostelId === h.id.toString();
            const hostelFloorsList = floorsMap[h.id] || [];

            return (
              <div
                key={h.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: isHostelOpen ? '2px solid var(--primary)' : '1px solid #E2E8F0',
                  boxShadow: isHostelOpen ? '0 10px 30px rgba(79, 70, 229, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                {/* HOSTEL HEADER BAR */}
                <div
                  onClick={() => toggleHostel(h.id)}
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isHostelOpen ? '#EEF2FF' : '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '1.6rem' }}>🏢</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                          {h.name}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            padding: '3px 9px',
                            borderRadius: '10px',
                            background: h.gender?.toLowerCase() === 'girls' ? '#FCE7F3' : '#E0F2FE',
                            color: h.gender?.toLowerCase() === 'girls' ? '#DB2777' : '#0284C7',
                            textTransform: 'uppercase'
                          }}
                        >
                          {h.gender || 'BOYS'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Warden: <strong>{h.warden_name || 'Unassigned'}</strong> • Phone: {h.warden_phone || 'N/A'} • Total Floors: <strong>{hostelFloorsList.length}</strong>
                      </div>
                    </div>
                  </div>

                  {/* HOSTEL LEVEL CRUD CONTROLS */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setEditingHostelData({
                          id: h.id,
                          name: h.name,
                          gender: h.gender || 'Boys',
                          warden_name: h.warden_name || '',
                          warden_phone: h.warden_phone || ''
                        });
                        setShowEditHostelModal(true);
                      }}
                      title="Edit Hostel Block"
                    >
                      ✏️ Edit Hostel
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteHostelClick(h.id, h.name)}
                      title="Delete Hostel Block"
                    >
                      🗑️ Delete
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setOpenHostelId(h.id.toString());
                        setShowAddFloorModal(true);
                      }}
                    >
                      ➕ Add Floors
                    </button>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--primary)', marginLeft: '6px' }}>
                      {isHostelOpen ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* STEP 2: FLOORS LIST INSIDE OPEN HOSTEL (Full CRUD on Floor Level) */}
                {isHostelOpen && (
                  <div style={{ padding: '24px', background: '#FAFAFA', borderTop: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                        📶 Floors in {h.name} Block ({currentHostelFloors.length} Floors)
                      </h4>
                      <button className="btn btn-primary btn-sm" onClick={() => setShowAddFloorModal(true)}>
                        ➕ Add Floors (e.g. 1-5)
                      </button>
                    </div>

                    {/* Floor Tabs & Individual Floor Edit/Delete Controls */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
                      {currentHostelFloors && currentHostelFloors.length > 0 ? (
                        currentHostelFloors.map((fl) => {
                          const isFloorOpen = openFloorNumber.toString() === fl.floor_number.toString();
                          return (
                            <div
                              key={fl.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                background: isFloorOpen ? 'var(--primary)' : '#FFFFFF',
                                color: isFloorOpen ? '#FFFFFF' : 'var(--text-primary)',
                                borderRadius: '12px',
                                border: isFloorOpen ? '2px solid var(--primary)' : '1px solid #CBD5E1',
                                padding: '4px 6px 4px 14px',
                                boxShadow: isFloorOpen ? '0 4px 12px rgba(79, 70, 229, 0.25)' : '0 1px 3px rgba(0,0,0,0.05)'
                              }}
                            >
                              <span
                                onClick={() => setOpenFloorNumber(fl.floor_number)}
                                style={{ fontSize: '0.88rem', fontWeight: 800, cursor: 'pointer', marginRight: '8px' }}
                              >
                                📶 Floor {fl.floor_number}
                              </span>

                              {/* FLOOR LEVEL CRUD BUTTONS */}
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingFloorData({ id: fl.id, floor_number: fl.floor_number, floor_name: fl.floor_name || `Floor ${fl.floor_number}` });
                                    setShowEditFloorModal(true);
                                  }}
                                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem', padding: '2px 4px' }}
                                  title="Edit Floor"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteFloorClick(fl.id, fl.floor_number);
                                  }}
                                  style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '0.78rem', padding: '2px 4px' }}
                                  title="Delete Floor"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', padding: '12px 0' }}>
                          No floors registered yet. Click <strong>'Add Floors'</strong> above to generate floors!
                        </div>
                      )}
                    </div>

                    {/* STEP 3: ROOMS GRID INSIDE OPEN FLOOR (Full CRUD on Room Level) */}
                    {openFloorNumber && currentHostelFloors.length > 0 && (
                      <div
                        style={{
                          background: '#FFFFFF',
                          borderRadius: '14px',
                          padding: '22px',
                          border: '1px solid #E2E8F0',
                          borderLeft: '5px solid var(--primary)',
                          boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                          <div>
                            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>
                              🚪 Rooms inside Floor {openFloorNumber} ({h.name})
                            </h4>
                            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                              {floorRooms.length} Rooms • {totalFloorCapacity} Total Beds • {totalFloorOccupied} Occupied • {totalFloorVacant} Vacant
                            </span>
                          </div>

                          <button className="btn btn-secondary" onClick={() => setShowAddRoomModal(true)}>
                            🚪 Add Rooms on Floor {openFloorNumber} (e.g. 101-105)
                          </button>
                        </div>

                        {/* Rooms Grid with Edit and Delete Buttons */}
                        <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '16px' }}>
                          {floorRooms && floorRooms.length > 0 ? (
                            floorRooms.map((r) => {
                              const isFull = r.vacant === 0;
                              return (
                                <div
                                  key={r.id}
                                  style={{
                                    background: '#FFFFFF',
                                    borderRadius: '12px',
                                    padding: '16px',
                                    border: '1px solid #E2E8F0',
                                    borderTop: `4px solid ${isFull ? 'var(--danger)' : 'var(--success)'}`,
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                      🚪 Room {r.room_number}
                                    </span>
                                    <span
                                      style={{
                                        fontSize: '0.7rem',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '8px',
                                        background: isFull ? '#FEE2E2' : '#DCFCE7',
                                        color: isFull ? '#DC2626' : '#16A34A'
                                      }}
                                    >
                                      {isFull ? 'Full' : `${r.vacant} Vacant`}
                                    </span>
                                  </div>

                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                                    Sharing: <strong style={{ color: 'var(--text-primary)' }}>{r.sharing_type_label || `${r.capacity} Sharing`}</strong>
                                  </div>

                                  {/* Bed Status Chips */}
                                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                                    {Array.from({ length: r.capacity || 4 }).map((_, idx) => {
                                      const isBedOccupied = idx < (r.occupied || 0);
                                      return (
                                        <span
                                          key={idx}
                                          style={{
                                            padding: '3px 8px',
                                            borderRadius: '6px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            background: isBedOccupied ? '#E0E7FF' : '#DCFCE7',
                                            color: isBedOccupied ? '#4338CA' : '#15803D',
                                            border: `1px solid ${isBedOccupied ? '#C7D2FE' : '#86EFAC'}`
                                          }}
                                        >
                                          Bed {String.fromCharCode(65 + idx)} {isBedOccupied ? '👤' : '🟢'}
                                        </span>
                                      );
                                    })}
                                  </div>

                                  {/* ROOM LEVEL CRUD CONTROLS */}
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                      Beds: <strong>{r.capacity}</strong>
                                    </span>
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                      <button
                                        className="btn btn-secondary btn-sm"
                                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                                        onClick={() => {
                                          setEditingRoomData({
                                            id: r.id,
                                            room_number: r.room_number,
                                            capacity: r.capacity,
                                            sharing_type_id: r.sharing_type_id || 1
                                          });
                                          setShowEditRoomModal(true);
                                        }}
                                      >
                                        ✏️ Edit
                                      </button>
                                      <button
                                        className="btn btn-danger btn-sm"
                                        style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                                        onClick={() => handleDeleteRoomClick(r.id, r.room_number)}
                                      >
                                        🗑️ Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-muted)', padding: '28px' }}>
                              No rooms registered on Floor {openFloorNumber} of {h.name} block yet. Click <strong>'Add Rooms'</strong> above to create rooms!
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
            No hostels created yet.
          </div>
        )}
      </div>

      {/* --- MODAL 1: ADD NEW HOSTEL BLOCK --- */}
      {showAddHostelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add New Hostel Block</h3>
              <button className="close-btn" onClick={() => setShowAddHostelModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateHostelSubmit}>
              <div className="form-group">
                <label className="form-label">Hostel Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Chillies, Westend, White"
                  value={newHostelData.name}
                  onChange={(e) => setNewHostelData({ ...newHostelData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender Allocation</label>
                <select
                  className="form-select"
                  value={newHostelData.gender}
                  onChange={(e) => setNewHostelData({ ...newHostelData, gender: e.target.value })}
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
                  value={newHostelData.floor_range}
                  onChange={(e) => setNewHostelData({ ...newHostelData, floor_range: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Warden Name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newHostelData.warden_name}
                  onChange={(e) => setNewHostelData({ ...newHostelData, warden_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Warden Phone (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={newHostelData.warden_phone}
                  onChange={(e) => setNewHostelData({ ...newHostelData, warden_phone: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddHostelModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Hostel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EDIT HOSTEL BLOCK --- */}
      {showEditHostelModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Hostel Block</h3>
              <button className="close-btn" onClick={() => setShowEditHostelModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditHostelSubmit}>
              <div className="form-group">
                <label className="form-label">Hostel Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingHostelData.name}
                  onChange={(e) => setEditingHostelData({ ...editingHostelData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Gender Allocation</label>
                <select
                  className="form-select"
                  value={editingHostelData.gender}
                  onChange={(e) => setEditingHostelData({ ...editingHostelData, gender: e.target.value })}
                >
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Warden Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingHostelData.warden_name}
                  onChange={(e) => setEditingHostelData({ ...editingHostelData, warden_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Warden Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingHostelData.warden_phone}
                  onChange={(e) => setEditingHostelData({ ...editingHostelData, warden_phone: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditHostelModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Hostel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: ADD FLOORS RANGE --- */}
      {showAddFloorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Floors Range for {selectedHostelObj?.name}</h3>
              <button className="close-btn" onClick={() => setShowAddFloorModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBatchCreateFloors}>
              <div className="form-group">
                <label className="form-label">Floor Level Range (e.g. <code>1-5</code>)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 1-5"
                  value={floorRangeInput}
                  onChange={(e) => setFloorRangeInput(e.target.value)}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddFloorModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Floors</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 4: EDIT FLOOR LEVEL --- */}
      {showEditFloorModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Floor Level</h3>
              <button className="close-btn" onClick={() => setShowEditFloorModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditFloorSubmit}>
              <div className="form-group">
                <label className="form-label">Floor Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingFloorData.floor_number}
                  onChange={(e) => setEditingFloorData({ ...editingFloorData, floor_number: e.target.value })}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditFloorModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Floor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 5: ADD ROOMS RANGE --- */}
      {showAddRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Add Rooms Range on Floor {openFloorNumber}</h3>
              <button className="close-btn" onClick={() => setShowAddRoomModal(false)}>✕</button>
            </div>
            <form onSubmit={handleBatchCreateRooms}>
              <div className="form-group">
                <label className="form-label">Room Range (Enter <code>101-105</code>)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 101-105"
                  value={roomRangeForm.room_range}
                  onChange={(e) => setRoomRangeForm({ ...roomRangeForm, room_range: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sharing Type</label>
                <select
                  className="form-select"
                  value={roomRangeForm.sharing_type_id}
                  onChange={(e) => handleSharingTypeChange(e.target.value, false)}
                >
                  {sharingTypes?.map((st) => (
                    <option key={st.id} value={st.id}>{st.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bed Capacity (Auto-calculated)</label>
                <input
                  type="number"
                  className="form-input"
                  value={roomRangeForm.capacity}
                  onChange={(e) => setRoomRangeForm({ ...roomRangeForm, capacity: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddRoomModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Generate Rooms</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 6: EDIT ROOM --- */}
      {showEditRoomModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Edit Room</h3>
              <button className="close-btn" onClick={() => setShowEditRoomModal(false)}>✕</button>
            </div>
            <form onSubmit={handleEditRoomSubmit}>
              <div className="form-group">
                <label className="form-label">Room Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={editingRoomData.room_number}
                  onChange={(e) => setEditingRoomData({ ...editingRoomData, room_number: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sharing Type</label>
                <select
                  className="form-select"
                  value={editingRoomData.sharing_type_id}
                  onChange={(e) => handleSharingTypeChange(e.target.value, true)}
                >
                  {sharingTypes?.map((st) => (
                    <option key={st.id} value={st.id}>{st.label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Bed Capacity</label>
                <input
                  type="number"
                  className="form-input"
                  value={editingRoomData.capacity}
                  onChange={(e) => setEditingRoomData({ ...editingRoomData, capacity: parseInt(e.target.value) })}
                  min="1"
                  max="12"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditRoomModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Update Room</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
