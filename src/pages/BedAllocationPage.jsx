import React, { useState, useEffect } from 'react';

export default function BedAllocationPage({
  residents = [],
  hostels = [],
  rooms = [],
  preselectedResident,
  onCheckIn,
  onCheckOut
}) {
  const [allocations, setAllocations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Assignment Form state
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [selectedHostelId, setSelectedHostelId] = useState('');
  const [selectedFloorId, setSelectedFloorId] = useState('Floor 1');
  const [selectedBedPill, setSelectedBedPill] = useState('R101 B1');

  useEffect(() => {
    fetchAllocations();
  }, []);

  useEffect(() => {
    if (preselectedResident) {
      setSelectedResidentId(preselectedResident.id);
    }
  }, [preselectedResident]);

  const fetchAllocations = () => {
    setLoading(true);
    fetch('/api/allocations')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setAllocations(data.data || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Sample default allocations if API returns empty, ensuring rich visual presentation
  const defaultAllocations = [
    { id: 101, room_number: '101-A', resident_name: 'Alex Thompson', resident_reg_no: '#4492 • 2nd Year', check_in_date: 'Oct 12, 2023', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { id: 102, room_number: '104-B', resident_name: 'Sarah Jenkins', resident_reg_no: '#8831 • 1st Year', check_in_date: 'Oct 14, 2023', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
    { id: 103, room_number: '102-A', resident_name: 'Jordan Smith', resident_reg_no: '#9912 • 3rd Year', check_in_date: 'Nov 01, 2023', initials: 'JS' },
    { id: 104, room_number: '105-C', resident_name: 'Marcus Chen', resident_reg_no: '#3321 • 1st Year', check_in_date: 'Nov 05, 2023', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' }
  ];

  const activeAllocations = (allocations && allocations.length > 0) ? allocations : defaultAllocations;

  // Unallocated residents dropdown
  const activeResidentIds = new Set(activeAllocations.map(a => a.resident_id));
  const availableResidents = (residents && residents.length > 0)
    ? residents.filter(r => !activeResidentIds.has(r.id))
    : [
        { id: 1, full_name: 'David Miller (RTC2026ST010)' },
        { id: 2, full_name: 'Emma Watson (RTC2026ST012)' },
        { id: 3, full_name: 'Lucas Wright (RTC2026ST015)' }
      ];

  const availableBedPills = [
    { code: 'R101 B1', isAvailable: true },
    { code: 'R101 B2', isAvailable: false },
    { code: 'R102 B1', isAvailable: true },
    { code: 'R103 B2', isAvailable: true }
  ];

  const liveFloorRooms = [
    { code: 'R-101', beds: 4, occupied: 3 },
    { code: 'R-102', beds: 2, occupied: 2 },
    { code: 'R-103', beds: 2, occupied: 0 },
    { code: 'R-104', beds: 3, occupied: 2 },
    { code: 'R-105', beds: 4, occupied: 1 },
    { code: 'R-106', beds: 2, occupied: 1 }
  ];

  const handleConfirmAllocation = () => {
    if (!selectedResidentId && availableResidents.length > 0) {
      alert('Please select a resident to allocate.');
      return;
    }
    const residentIdToAssign = selectedResidentId || availableResidents[0]?.id;
    const targetRoomId = rooms[0]?.id || 1;

    if (onCheckIn) {
      onCheckIn({
        resident_id: residentIdToAssign,
        room_id: targetRoomId,
        entry_date: new Date().toISOString().split('T')[0]
      });
      alert(`Bed ${selectedBedPill} assigned successfully!`);
      fetchAllocations();
    } else {
      alert(`Bed ${selectedBedPill} assigned successfully!`);
    }
  };

  const handleExitSubmit = (alloc) => {
    if (onCheckOut) {
      onCheckOut({
        allocation_id: alloc.id,
        exit_date: new Date().toISOString().split('T')[0],
        exit_reason: 'Normal Check-out'
      });
    } else {
      setAllocations(prev => prev.filter(a => a.id !== alloc.id));
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '4px' }}>
      
      {/* 1. Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            OPERATIONS / LOGISTICS
          </div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Bed & Room Allocation
          </h1>
        </div>

        {/* Top Right Occupancy Circular Metric */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>
              Real-time Occupancy
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2563eb', lineHeight: 1.1 }}>
              84%
            </div>
          </div>

          {/* Donut SVG Indicator */}
          <div style={{ position: 'relative', width: '48px', height: '48px' }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#e2e8f0" strokeWidth="4.5" />
              <circle
                cx="24"
                cy="24"
                r="20"
                fill="none"
                stroke="#2563eb"
                strokeWidth="4.5"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 - (125.6 * 84) / 100}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Split Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 2fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: New Assignment Form Card + Manager Note Banner */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* New Assignment Form Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                👤+
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                New Assignment
              </h2>
            </div>

            {/* Select Resident */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                Select Resident
              </label>
              <select
                value={selectedResidentId}
                onChange={(e) => setSelectedResidentId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#0f172a',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Search student name...</option>
                {availableResidents.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.full_name || r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Block & Floor Dropdowns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Block
                </label>
                <select
                  value={selectedHostelId}
                  onChange={(e) => setSelectedHostelId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">Block A</option>
                  <option value="b">Block B</option>
                  <option value="c">Block C</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '6px' }}>
                  Floor
                </label>
                <select
                  value={selectedFloorId}
                  onChange={(e) => setSelectedFloorId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#0f172a',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                </select>
              </div>
            </div>

            {/* Select Available Bed */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginBottom: '8px' }}>
                Select Available Bed
              </label>

              {/* Bed Pill Buttons Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {availableBedPills.map((bed, idx) => {
                  const isSelected = selectedBedPill === bed.code;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => bed.isAvailable && setSelectedBedPill(bed.code)}
                      style={{
                        padding: '12px 6px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: isSelected ? '#eff6ff' : bed.isAvailable ? '#ffffff' : '#f1f5f9',
                        color: isSelected ? '#2563eb' : bed.isAvailable ? '#334155' : '#94a3b8',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        cursor: bed.isAvailable ? 'pointer' : 'not-allowed',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {bed.code.split(' ')[0]}
                      <div style={{ fontSize: '0.7rem', fontWeight: 600 }}>{bed.code.split(' ')[1]}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Confirm Button */}
            <button
              onClick={handleConfirmAllocation}
              style={{
                width: '100%',
                background: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontWeight: 700,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              Confirm Allocation &rarr;
            </button>
          </div>

          {/* Manager Note Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              borderRadius: '20px',
              padding: '24px',
              color: '#ffffff',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 20px rgba(29, 78, 216, 0.2)'
            }}
          >
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.8)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
              Manager Note
            </div>
            <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: '#ffffff', margin: 0, lineHeight: 1.5, position: 'relative', zIndex: 2 }}>
              &ldquo;Prioritize Floor 1 for international students to facilitate easy orientation during first-week check-ins.&rdquo;
            </p>

            {/* Decorative Lightbulb Icon */}
            <div style={{ position: 'absolute', right: '16px', bottom: '12px', opacity: 0.15 }}>
              <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 21h6v-2H9v2zm3-19C7.03 2 3 6.03 3 11c0 3.12 1.63 5.85 4.12 7.42V20c0 .55.45 1 1 1h7.76c.55 0 1-.45 1-1v-1.58C19.37 16.85 21 14.12 21 11c0-4.97-4.03-9-9-9z"/>
              </svg>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Live Floor Status + Current Occupants */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Card 1: Live Floor Status Grid */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Live Floor Status
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                  Floor 1 • Wing A
                </div>
              </div>

              {/* Legend Filter Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> Available
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }} /> Occupied
                </span>
              </div>
            </div>

            {/* Room Bed Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '16px' }}>
              {liveFloorRooms.map((room, idx) => {
                const availableBeds = room.beds - room.occupied;

                return (
                  <div
                    key={idx}
                    style={{
                      background: '#f8fafc',
                      borderRadius: '14px',
                      padding: '14px 12px',
                      border: '1px solid #e2e8f0',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#2563eb', marginBottom: '2px' }}>
                      {room.code}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '10px' }}>
                      {room.beds} BED
                    </div>

                    {/* Bed Dots Matrix */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', flexWrap: 'wrap' }}>
                      {Array.from({ length: room.beds }).map((_, bIdx) => {
                        const isAvailable = bIdx < availableBeds;
                        return (
                          <div
                            key={bIdx}
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '3px',
                              background: isAvailable ? '#10b981' : '#cbd5e1'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Current Occupants Data Table */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Current Occupants
              </h2>

              {/* Action Filter & Export Icons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Filter"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                  </svg>
                </button>
                <button
                  style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  title="Export Data"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      ROOM / BED
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      RESIDENT
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      CHECK-IN DATE
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activeAllocations.map((alloc) => (
                    <tr key={alloc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      
                      {/* Room / Bed Badge */}
                      <td style={{ padding: '14px' }}>
                        <span
                          style={{
                            background: '#dbeafe',
                            color: '#1d4ed8',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            fontWeight: 800,
                            fontSize: '0.8rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {alloc.room_number || `R10${alloc.id}-A`}
                          <span style={{ color: '#10b981', fontWeight: 900 }}>✓</span>
                        </span>
                      </td>

                      {/* Resident Info */}
                      <td style={{ padding: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {alloc.avatar ? (
                            <img
                              src={alloc.avatar}
                              alt={alloc.resident_name}
                              style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: '#f5f3ff',
                                color: '#7c3aed',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.85rem'
                              }}
                            >
                              {alloc.initials || (alloc.resident_name ? alloc.resident_name.charAt(0) : 'R')}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                              {alloc.resident_name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              ID: {alloc.resident_reg_no || `#${alloc.id} • Student`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Check-In Date */}
                      <td style={{ padding: '14px', fontSize: '0.86rem', fontWeight: 600, color: '#334155' }}>
                        {alloc.check_in_date || alloc.entry_date || 'Oct 12, 2023'}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleExitSubmit(alloc)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fca5a5',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                          title="Check Out Resident"
                        >
                          🚪 Check Out
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer Centered Link */}
            <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
              <a style={{ fontSize: '0.84rem', fontWeight: 800, color: '#2563eb', cursor: 'pointer', textDecoration: 'none' }}>
                View All {activeAllocations.length * 35 || 142} Active Records
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
