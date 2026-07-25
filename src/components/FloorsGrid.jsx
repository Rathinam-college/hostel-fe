import React, { useState, useEffect } from 'react';

export default function FloorsGrid({ hostelsList = [], roomsList = [], sharingTypesList = [], onAddFloor, onEditRoom, onDeleteRoom, onUpdateSharingType }) {
  // Navigation hierarchy states:
  // selectedHostel: string | null
  // selectedFloor: string | null
  // selectedRoom: object | null
  const [selectedHostel, setSelectedHostel] = useState(null);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Sync state with URL path (line-by-line navigation)
  const parsePathState = () => {
    const path = decodeURIComponent(window.location.pathname.toLowerCase());

    // Matches: /floors/:hostel/floor/:floor/room/:room
    const roomMatch = path.match(/\/floors\/([^\/]+)\/floor\/([^\/]+)\/room\/([^\/]+)/);
    if (roomMatch) {
      const hostelName = roomMatch[1];
      const floorNum = roomMatch[2];
      const roomNum = roomMatch[3];

      const matchedHostel = hostelsList.find(h => h.name.toLowerCase() === hostelName) || { name: hostelName };
      const matchedRoom = roomsList.find(r => 
        r.hostel_name?.toLowerCase() === hostelName &&
        String(r.floor).toLowerCase() === floorNum &&
        String(r.room_number).toLowerCase() === roomNum
      );

      setSelectedHostel(matchedHostel.name);
      setSelectedFloor(floorNum);
      setSelectedRoom(matchedRoom || { room_number: roomNum, floor: floorNum, hostel_name: matchedHostel.name });
      return;
    }

    // Matches: /floors/:hostel/floor/:floor
    const floorMatch = path.match(/\/floors\/([^\/]+)\/floor\/([^\/]+)/);
    if (floorMatch) {
      const hostelName = floorMatch[1];
      const floorNum = floorMatch[2];
      const matchedHostel = hostelsList.find(h => h.name.toLowerCase() === hostelName) || { name: hostelName };
      setSelectedHostel(matchedHostel.name);
      setSelectedFloor(floorNum);
      setSelectedRoom(null);
      return;
    }

    // Matches: /floors/:hostel
    const hostelMatch = path.match(/\/floors\/([^\/]+)/);
    if (hostelMatch) {
      const hostelName = hostelMatch[1];
      const matchedHostel = hostelsList.find(h => h.name.toLowerCase() === hostelName) || { name: hostelName };
      setSelectedHostel(matchedHostel.name);
      setSelectedFloor(null);
      setSelectedRoom(null);
      return;
    }

    // Default top-level floors list
    setSelectedHostel(null);
    setSelectedFloor(null);
    setSelectedRoom(null);
  };

  useEffect(() => {
    parsePathState();
    window.addEventListener('popstate', parsePathState);
    return () => window.removeEventListener('popstate', parsePathState);
  }, [hostelsList, roomsList]);

  // Helper to update URL history line-by-line
  const pushUrlState = (urlPath) => {
    const isPrefixed = window.location.pathname.toLowerCase().startsWith('/hostel');
    const fullPath = isPrefixed ? `/hostel${urlPath}` : urlPath;
    window.history.pushState({}, '', fullPath);
    parsePathState();
  };

  // Group rooms by Hostel → Floor
  const grouped = {};
  hostelsList.forEach(h => {
    grouped[h.name] = {};
  });

  roomsList.forEach(r => {
    const hostel = r.hostel_name;
    const floor = r.floor || 'Ground';
    if (!grouped[hostel]) grouped[hostel] = {};
    if (!grouped[hostel][floor]) grouped[hostel][floor] = [];
    if (r.capacity > 0 && !(r.room_number && r.room_number.startsWith('F_'))) {
      grouped[hostel][floor].push(r);
    }
  });

  const sortFloors = (floors) => {
    return [...floors].sort((a, b) => {
      if (a === 'Ground') return -1;
      if (b === 'Ground') return 1;
      return parseInt(a) - parseInt(b);
    });
  };

  // ============================================================
  // LEVEL 4: SELECTED ROOM DETAILS (URL: /floors/:hostel/floor/:floor/room/:room)
  // ============================================================
  if (selectedHostel && selectedFloor && selectedRoom) {
    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Breadcrumb Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => pushUrlState(`/floors/${encodeURIComponent(selectedHostel)}/floor/${encodeURIComponent(selectedFloor)}`)}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Floor {selectedFloor}
            </button>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                🚪 Room {selectedRoom.room_number} — Config
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {selectedHostel} Block • Floor {selectedFloor}
              </span>
            </div>
          </div>
        </div>

        {/* Room Information & Sharing Type Form Card */}
        <div className="card" style={{ padding: '24px', maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: '12px',
                background: 'rgba(0, 242, 254, 0.15)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '1.2rem'
              }}>
                {selectedRoom.room_number}
              </div>
              <div>
                <h3 style={{ margin: 0, fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.2rem' }}>
                  Room {selectedRoom.room_number}
                </h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                  Current: {selectedRoom.sharing_type_label || 'Standard Sharing'}
                </span>
              </div>
            </div>
            <span className={`status-badge ${selectedRoom.is_active !== false ? 'status-active' : 'status-inactive'}`}>
              {selectedRoom.is_active !== false ? 'Active' : 'Renovating'}
            </span>
          </div>

          {/* Form to Select/Assign Sharing Type inside Room */}
          <div style={{ background: 'rgba(0, 242, 254, 0.05)', border: '1px solid rgba(0, 242, 254, 0.2)', padding: '18px', borderRadius: '12px', marginBottom: '20px' }}>
            <label style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '8px' }}>
              <i className="fa-solid fa-bed" style={{ marginRight: '6px' }}></i> Select Sharing Type for Room {selectedRoom.room_number}:
            </label>
            <select
              value={selectedRoom.sharing_type_id || ''}
              onChange={(e) => onUpdateSharingType && onUpdateSharingType(selectedRoom, e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.92rem',
                borderRadius: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                color: 'var(--text-primary)',
                border: '1px solid rgba(0, 242, 254, 0.4)',
                outline: 'none'
              }}
            >
              <option value="" disabled>-- Select Sharing Type --</option>
              {sharingTypesList.map(s => (
                <option value={s.id} key={s.id}>
                  {s.label} ({s.bed_count || s.bedCount || 4} Beds)
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Bed Capacity</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{selectedRoom.capacity || 4} Beds</div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '14px', borderRadius: '10px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Vacant Beds</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--success)' }}>{selectedRoom.vacant || selectedRoom.capacity || 4} Available</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {onEditRoom && selectedRoom.id && (
              <button onClick={() => onEditRoom(selectedRoom)} className="btn btn-secondary" style={{ flex: 1 }}>
                <i className="fa-solid fa-pen" style={{ marginRight: '6px' }}></i> Edit Full Config
              </button>
            )}
            {onDeleteRoom && selectedRoom.id && (
              <button onClick={() => onDeleteRoom(selectedRoom.id)} className="btn btn-secondary" style={{ color: '#ff4d4f' }}>
                <i className="fa-solid fa-trash"></i> Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LEVEL 3: ROOMS INSIDE SELECTED FLOOR (URL: /floors/:hostel/floor/:floor)
  // ============================================================
  if (selectedHostel && selectedFloor) {
    const floorRooms = (grouped[selectedHostel] && grouped[selectedHostel][selectedFloor]) || [];
    const totalBeds = floorRooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const vacantBeds = floorRooms.reduce((sum, r) => sum + (r.vacant || 0), 0);
    const occupiedBeds = floorRooms.reduce((sum, r) => sum + (r.occupied || 0), 0);

    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => pushUrlState(`/floors/${encodeURIComponent(selectedHostel)}`)}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Floors ({selectedHostel})
            </button>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {selectedHostel} ➔ {selectedFloor === 'Ground' ? 'Ground Floor' : `Floor ${selectedFloor}`}
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {floorRooms.length} Rooms • {totalBeds} Beds ({vacantBeds} Vacant, {occupiedBeds} Occupied)
              </span>
            </div>
          </div>

          <button onClick={() => onAddFloor(selectedHostel, selectedFloor)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-plus"></i> Add Room(s) to Floor {selectedFloor}
          </button>
        </div>

        {/* Room Boxes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
          gap: '16px',
          marginTop: '10px'
        }}>
          {floorRooms.map(room => (
            <div
              key={room.id}
              className="card"
              style={{
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '12px',
                transition: 'transform 0.18s ease, border-color 0.18s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '10px',
                      background: 'rgba(0, 242, 254, 0.12)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '1rem'
                    }}>
                      {room.room_number}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.05rem' }}>
                        Room {room.room_number}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>
                        <i className="fa-solid fa-bed" style={{ marginRight: '4px' }}></i>
                        {room.sharing_type_label || 'Standard Sharing'}
                      </div>
                    </div>
                  </div>
                  <span className={`status-badge ${room.is_active !== false ? 'status-active' : 'status-inactive'}`}>
                    {room.is_active !== false ? 'Active' : 'Renovating'}
                  </span>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px'
                }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Capacity: <b>{room.capacity} Beds</b></div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="badge badge-info">{room.occupied || 0} Occ</span>
                    <span className="badge badge-success">{room.vacant || room.capacity} Vac</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                <button
                  onClick={() => pushUrlState(`/floors/${encodeURIComponent(selectedHostel)}/floor/${encodeURIComponent(selectedFloor)}/room/${encodeURIComponent(room.room_number)}`)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-eye"></i> View Details
                </button>
                {onEditRoom && (
                  <button
                    onClick={() => onEditRoom(room)}
                    className="btn btn-secondary"
                    style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                    title="Edit Room"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                )}
                {onDeleteRoom && (
                  <button
                    onClick={() => onDeleteRoom(room.id)}
                    className="btn-action btn-delete"
                    style={{ padding: '6px 10px', borderRadius: '6px' }}
                    title="Delete Room"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* Quick Create Room Card Box */}
          <div
            onClick={() => onAddFloor(selectedHostel, selectedFloor)}
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              border: '2px dashed rgba(0, 242, 254, 0.3)',
              borderRadius: '12px',
              cursor: 'pointer',
              background: 'rgba(0, 242, 254, 0.03)',
              minHeight: '160px'
            }}
          >
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.15)', color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', marginBottom: '8px'
            }}>
              <i className="fa-solid fa-plus"></i>
            </div>
            <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}>+ Add Room(s) to Floor {selectedFloor}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Type single room or range (e.g. 1-12)</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LEVEL 2: FLOORS VIEW (URL: /floors/:hostel)
  // ============================================================
  if (selectedHostel) {
    const hostelFloors = grouped[selectedHostel] || {};
    const sortedFloorKeys = sortFloors(Object.keys(hostelFloors));
    const totalHostelRooms = Object.values(hostelFloors).reduce((sum, rs) => sum + rs.length, 0);
    const totalHostelVacant = Object.values(hostelFloors).flat().reduce((sum, r) => sum + (r.vacant || 0), 0);

    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => pushUrlState('/floors')}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Hostel Blocks
            </button>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                🏢 {selectedHostel} Block — Floors
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {sortedFloorKeys.length} Floors Configured • {totalHostelRooms} Rooms ({totalHostelVacant} Vacant Beds)
              </span>
            </div>
          </div>

          <button onClick={onAddFloor} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-plus"></i> + Add Floor to {selectedHostel}
          </button>
        </div>

        {/* Grid of Floor Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
          gap: '16px',
          marginTop: '10px'
        }}>
          {sortedFloorKeys.map(floor => {
            const roomCount = hostelFloors[floor].length;
            const vacantBeds = hostelFloors[floor].reduce((sum, r) => sum + (r.vacant || 0), 0);

            return (
              <div
                key={floor}
                onClick={() => pushUrlState(`/floors/${encodeURIComponent(selectedHostel)}/floor/${encodeURIComponent(floor)}`)}
                className="floor-box-card card"
                style={{
                  padding: '20px',
                  cursor: 'pointer',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fa-solid fa-layer-group" style={{ color: 'var(--accent)', fontSize: '1.1rem' }}></i>
                    <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {floor === 'Ground' ? 'Ground Floor' : `Floor ${floor}`}
                    </span>
                  </div>
                  <i className="fa-solid fa-chevron-right" style={{ color: 'var(--primary)', fontSize: '0.9rem' }}></i>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span><b>{roomCount}</b> Room{roomCount !== 1 ? 's' : ''}</span>
                  <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{vacantBeds} Vacant Beds</span>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.78rem', color: 'var(--primary)', textAlign: 'right', fontWeight: 600 }}>
                  Click to Open Rooms ➔
                </div>
              </div>
            );
          })}

          {/* Add New Floor Box */}
          <div
            onClick={onAddFloor}
            style={{
              padding: '20px',
              borderRadius: '12px',
              cursor: 'pointer',
              background: 'rgba(0, 242, 254, 0.03)',
              border: '2px dashed rgba(0, 242, 254, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
              minHeight: '120px'
            }}
          >
            <i className="fa-solid fa-plus-circle" style={{ color: 'var(--primary)', fontSize: '1.3rem', marginBottom: '6px' }}></i>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>+ Add New Floor</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LEVEL 1 (FIRST VIEW): SHOW ONLY HOSTEL NAME CARDS (URL: /floors)
  // ============================================================
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ marginBottom: '4px' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          🏢 Select Hostel Block
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Click any Hostel Block below to open its floors
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {Object.entries(grouped).map(([hostelName, floors]) => {
          const sortedFloorKeys = sortFloors(Object.keys(floors));
          const totalRooms = Object.values(floors).reduce((sum, rs) => sum + rs.length, 0);

          return (
            <div
              key={hostelName}
              onClick={() => pushUrlState(`/floors/${encodeURIComponent(hostelName)}`)}
              className="floor-box-card card"
              style={{
                padding: '24px',
                cursor: 'pointer',
                borderRadius: '14px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justify: 'space-between',
                minHeight: '150px',
                transition: 'all 0.2s ease-in-out'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      background: 'rgba(108, 92, 231, 0.2)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.3rem'
                    }}>
                      <i className="fa-solid fa-building"></i>
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-primary)' }}>
                        {hostelName}
                      </h3>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Hostel Block</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-arrow-right" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                  <span className="badge badge-info">{sortedFloorKeys.length} Floors Configured</span>
                  <span className="badge badge-success">{totalRooms} Rooms</span>
                </div>
              </div>

              <div style={{ marginTop: '18px', paddingTop: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.8rem', color: 'var(--primary)', textAlign: 'right', fontWeight: 600 }}>
                Click to Open Floors ➔
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
