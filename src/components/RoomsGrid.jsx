import React, { useState } from 'react';

export default function RoomsGrid({ roomsList, onEdit, onDelete, onAddRoom }) {
  // Navigation state: selectedFloor holds { floor, hostelName } or null
  const [selectedFloorObj, setSelectedFloorObj] = useState(null);

  if (roomsList.length === 0) {
    return (
      <div className="card fade-in" style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <i className="fa-solid fa-layer-group" style={{ fontSize: '2.5rem', marginBottom: '12px', opacity: 0.4, color: 'var(--primary)' }}></i>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>No Floors or Rooms Created Yet</h3>
        <p style={{ marginBottom: '20px', fontSize: '0.9rem' }}>Get started by adding floors and rooms to your hostel blocks.</p>
        <button onClick={onAddRoom} className="btn btn-primary">
          <i className="fa-solid fa-plus" style={{ marginRight: '6px' }}></i> Create Floor / Room
        </button>
      </div>
    );
  }

  // Group rooms: hostel_name → floor → rooms[]
  const groupedByHostel = {};
  roomsList.forEach(r => {
    const hostel = r.hostel_name;
    const floor = r.floor || 'Ground';
    if (!groupedByHostel[hostel]) groupedByHostel[hostel] = {};
    if (!groupedByHostel[hostel][floor]) groupedByHostel[hostel][floor] = [];
    groupedByHostel[hostel][floor].push(r);
  });

  // Helper to sort floors: Ground first, then numeric
  const sortFloors = (floors) => {
    return [...floors].sort((a, b) => {
      if (a === 'Ground') return -1;
      if (b === 'Ground') return 1;
      return parseInt(a) - parseInt(b);
    });
  };

  // ============================================================
  // LEVEL 2: ROOMS INSIDE SELECTED FLOOR (AFTER CLICKING A FLOOR BOX)
  // ============================================================
  if (selectedFloorObj) {
    const { hostelName, floor } = selectedFloorObj;
    const floorRooms = (groupedByHostel[hostelName] && groupedByHostel[hostelName][floor]) || [];
    const totalBeds = floorRooms.reduce((sum, r) => sum + (r.capacity || 0), 0);
    const vacantBeds = floorRooms.reduce((sum, r) => sum + (r.vacant || 0), 0);
    const occupiedBeds = floorRooms.reduce((sum, r) => sum + (r.occupied || 0), 0);

    return (
      <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Navigation Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setSelectedFloorObj(null)}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px' }}
            >
              <i className="fa-solid fa-arrow-left"></i> Back to Floors List
            </button>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                {floor === 'Ground' ? 'Ground Floor' : `Floor ${floor}`} Rooms ({hostelName})
              </h2>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {floorRooms.length} Rooms • {totalBeds} Total Beds ({vacantBeds} Vacant, {occupiedBeds} Occupied)
              </span>
            </div>
          </div>

          <button onClick={onAddRoom} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-plus"></i> Add Room to Floor {floor}
          </button>
        </div>

        {/* Room Boxes Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
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
                borderRadius: '12px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '38px', height: '38px', borderRadius: '10px',
                      background: 'rgba(0, 242, 254, 0.12)', color: 'var(--primary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '1rem'
                    }}>
                      {room.room_number}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                        Room {room.room_number}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--accent)', fontWeight: 600 }}>
                        <i className="fa-solid fa-bed" style={{ marginRight: '4px' }}></i>
                        {room.sharing_type_label || 'Standard Sharing'}
                      </div>
                    </div>
                  </div>
                  <span className={`status-badge ${room.is_active ? 'status-active' : 'status-inactive'}`}>
                    {room.is_active ? 'Active' : 'Renovating'}
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Capacity: <b>{room.capacity} Beds</b></div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <span className="badge badge-info">{room.occupied || 0} Occ</span>
                    <span className="badge badge-success">{room.vacant || room.capacity} Vac</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '12px' }}>
                <button
                  onClick={() => onEdit(room)}
                  className="btn btn-secondary"
                  style={{ flex: 1, padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <i className="fa-solid fa-pen"></i> Edit Room
                </button>
                <button
                  onClick={() => onDelete(room.id)}
                  className="btn-action btn-delete"
                  style={{ padding: '6px 12px', borderRadius: '6px' }}
                  title="Delete Room"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>
          ))}

          {/* Quick Create Room Card Box */}
          <div
            onClick={onAddRoom}
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
            <span style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}>+ Add Room to Floor {floor}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Click to configure new room</span>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // LEVEL 1 (DEFAULT): FLOOR BOXES VIEW FIRST!
  // ============================================================
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {Object.entries(groupedByHostel).map(([hostelName, floors]) => {
        const sortedFloorKeys = sortFloors(Object.keys(floors));
        const totalRooms = Object.values(floors).reduce((sum, rs) => sum + rs.length, 0);
        const totalVacant = Object.values(floors).flat().reduce((sum, r) => sum + (r.vacant || 0), 0);

        return (
          <div key={hostelName} className="card" style={{ padding: '22px' }}>
            {/* Hostel Block Banner */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '10px',
                  background: 'rgba(108, 92, 231, 0.2)', color: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  <i className="fa-solid fa-building"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.15rem', color: 'var(--text-primary)' }}>
                    {hostelName} Block
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Select a Floor Box below to view its rooms</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-info">{sortedFloorKeys.length} Floors</span>
                <span className="badge badge-success">{totalRooms} Rooms ({totalVacant} Vacant Beds)</span>
              </div>
            </div>

            {/* Floor Cards / Boxes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '16px'
            }}>
              {sortedFloorKeys.map(floor => {
                const rooms = floors[floor];
                const floorVacant = rooms.reduce((sum, r) => sum + (r.vacant || 0), 0);

                return (
                  <div
                    key={floor}
                    onClick={() => setSelectedFloorObj({ hostelName, floor })}
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
                      <span><b>{rooms.length}</b> Room{rooms.length !== 1 ? 's' : ''}</span>
                      <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>{floorVacant} Vacant Beds</span>
                    </div>

                    <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', fontSize: '0.78rem', color: 'var(--primary)', textAlign: 'right', fontWeight: 600 }}>
                      Click to Open Rooms ➔
                    </div>
                  </div>
                );
              })}

              {/* Add New Floor / Room Box */}
              <div
                onClick={onAddRoom}
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
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary)' }}>+ Add New Floor / Room</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
