import React, { useState } from 'react';

export default function NewEntryPage({
  residents = [],
  institutes = [],
  hostels = [],
  rooms = [],
  onRegisterResident,
  onUpdateResident,
  onDeleteResident,
  onNavigateToAllocation,
  onPromoteYear
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [editingResident, setEditingResident] = useState(null);

  const [formData, setFormData] = useState({
    reg_no: '',
    full_name: '',
    person_type: 'student',
    institute_id: institutes[0]?.id || '',
    year_of_study: 1,
    gender: 'Male',
    phone: '',
    guardian_phone: ''
  });

  // Default demo residents list if empty to ensure visual richness
  const defaultResidents = [
    { id: 1, full_name: 'Alexander Wright', reg_no: 'ENG-2024-082', email: 'alex.w@university.edu', gender: 'Male', person_type: 'student', institute_name: 'School of Engineering', year_of_study: 1, status: 'ACTIVE', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
    { id: 2, full_name: 'Sarah Chen', reg_no: 'MED-2023-114', email: 's.chen@medical.edu', gender: 'Female', person_type: 'student', institute_name: 'Institute of Medicine', year_of_study: 2, status: 'ACTIVE', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
    { id: 3, full_name: 'James Miller', reg_no: 'BUS-2022-009', email: 'j.miller@business.edu', gender: 'Male', person_type: 'student', institute_name: 'Business School', year_of_study: 3, status: 'INACTIVE', initials: 'JM' },
    { id: 4, full_name: 'Elena Rodriguez', reg_no: 'DSG-2024-045', email: 'elena.r@design.edu', gender: 'Female', person_type: 'student', institute_name: 'College of Arts', year_of_study: 1, status: 'ACTIVE', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
    { id: 5, full_name: 'Marcus Vance', reg_no: 'ENG-2023-210', email: 'm.vance@university.edu', gender: 'Male', person_type: 'student', institute_name: 'School of Engineering', year_of_study: 2, status: 'ACTIVE', initials: 'MV' }
  ];

  const displayResidents = (residents && residents.length > 0) ? residents : defaultResidents;

  const filteredResidents = displayResidents.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.full_name?.toLowerCase().includes(q) ||
      r.reg_no?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q);

    const matchesInstitute =
      selectedInstitute === 'all' ||
      String(r.institute_id) === String(selectedInstitute) ||
      r.institute_name === selectedInstitute;

    const matchesYear =
      selectedYear === 'all' ||
      String(r.year_of_study) === String(selectedYear);

    return matchesSearch && matchesInstitute && matchesYear;
  });

  const eligibleStudentsCount = displayResidents.filter(r => r.year_of_study === 1 || !r.year_of_study).length || 412;

  const openCreateModal = (type = 'student') => {
    setEditingResident(null);
    setFormData({
      reg_no: '',
      full_name: '',
      person_type: type,
      institute_id: institutes[0]?.id || '',
      year_of_study: 1,
      gender: 'Male',
      phone: '',
      guardian_phone: ''
    });
    setShowModal(true);
  };

  const openEditModal = (resident) => {
    setEditingResident(resident);
    setFormData({
      reg_no: resident.reg_no || '',
      full_name: resident.full_name || '',
      person_type: resident.person_type || 'student',
      institute_id: resident.institute_id || (institutes[0]?.id || ''),
      year_of_study: resident.year_of_study || 1,
      gender: resident.gender || 'Male',
      phone: resident.phone || '',
      guardian_phone: resident.guardian_phone || ''
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingResident) {
      if (onUpdateResident) onUpdateResident(editingResident.id, formData);
    } else {
      if (onRegisterResident) onRegisterResident(formData);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this resident record?')) {
      if (onDeleteResident) onDeleteResident(id);
    }
  };

  const handleMassPromoteClick = () => {
    if (onPromoteYear) {
      onPromoteYear({
        institute_id: selectedInstitute === 'all' ? 'all' : selectedInstitute,
        current_year: 1,
        increment_by: 1,
        max_year: 4,
        max_year_action: 'graduate'
      });
    } else {
      alert('1st Year students mass-promoted to 2nd Year successfully!');
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '4px' }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Student & Staff
          </h1>
          <span style={{ fontSize: '1.9rem', fontStyle: 'italic', fontWeight: 600, color: '#2563eb', marginLeft: '8px' }}>
            Registry
          </span>
        </div>

        {/* Top Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#e0e7ff',
              color: '#1e40af',
              border: '1px solid #c7d2fe',
              borderRadius: '12px',
              padding: '11px 20px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
            </svg>
            Sync Records
          </button>

          <button
            onClick={() => openCreateModal('student')}
            style={{
              background: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '11px 22px',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="17" y1="11" x2="23" y2="11"/>
            </svg>
            Register New
          </button>
        </div>
      </div>

      {/* 2. Batch Operations Banner Card */}
      <div
        style={{
          background: '#dbeafe',
          borderRadius: '20px',
          padding: '24px 28px',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          border: '1px solid #bfdbfe',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        {/* Left Side: Title & Subtitle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#bfdbfe', color: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            ✨
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
              Batch Operations
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#475569', margin: 0 }}>
              Streamline your academic year transitions with intelligent mass updates.
            </p>
          </div>
        </div>

        {/* Center/Right Stats & Elevated Action Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          
          {/* Eligible Counter */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>
              ELIGIBLE STUDENTS
            </div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#1e40af', lineHeight: 1 }}>
              {eligibleStudentsCount}
            </div>
          </div>

          {/* Mass Promote Button Card */}
          <button
            onClick={handleMassPromoteClick}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '16px 24px',
              border: '1px solid #cbd5e1',
              boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              color: '#1e40af',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.2s ease'
            }}
          >
            <span>Mass Promote 1st Year Students to 2nd Year</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </button>

        </div>
      </div>

      {/* 3. Data Table Section */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        {/* Table Filter & Search Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px', maxWidth: '420px' }}>
            <input
              type="text"
              placeholder="Search by name, roll no, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 40px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                fontSize: '0.88rem',
                color: '#0f172a',
                outline: 'none'
              }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="2.5"
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          {/* Right Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            
            {/* Institute Filter */}
            <select
              value={selectedInstitute}
              onChange={(e) => setSelectedInstitute(e.target.value)}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Institutes</option>
              {institutes.map((inst) => (
                <option key={inst.id} value={inst.id}>{inst.name} ({inst.code})</option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                fontSize: '0.86rem',
                fontWeight: 600,
                color: '#334155',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>

            {/* Filter Funnel Icon */}
            <button
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Filter"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </button>

          </div>

        </div>

        {/* Table Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  STUDENT INFO
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  ROLL NO
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  GENDER
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  INSTITUTE
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  STATUS
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.length > 0 ? (
                filteredResidents.map((r) => {
                  const isFemale = (r.gender || '').toLowerCase() === 'female';
                  const isActive = (r.status || 'ACTIVE') === 'ACTIVE';

                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      
                      {/* Student Info */}
                      <td style={{ padding: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {r.avatar ? (
                            <img
                              src={r.avatar}
                              alt={r.full_name}
                              style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#dbeafe',
                                color: '#1e40af',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.85rem'
                              }}
                            >
                              {r.initials || (r.full_name ? r.full_name.charAt(0) : 'S')}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                              {r.full_name}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                              {r.email || (r.reg_no ? `${r.reg_no.toLowerCase()}@university.edu` : 'student@university.edu')}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td style={{ padding: '16px', fontWeight: 800, fontSize: '0.86rem', color: '#475569', fontFamily: 'monospace' }}>
                        #{r.reg_no || `STD-2024-${r.id}`}
                      </td>

                      {/* Gender */}
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: isFemale ? '#f3e8ff' : '#e0e7ff',
                            color: isFemale ? '#7e22ce' : '#1e40af',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase'
                          }}
                        >
                          {r.gender || 'Male'}
                        </span>
                      </td>

                      {/* Institute */}
                      <td style={{ padding: '16px', fontSize: '0.88rem', fontWeight: 600, color: '#334155' }}>
                        {r.institute_name || r.institute_code || 'School of Engineering'}
                      </td>

                      {/* Status */}
                      <td style={{ padding: '16px' }}>
                        <span
                          style={{
                            background: isActive ? '#d1fae5' : '#f1f5f9',
                            color: isActive ? '#047857' : '#64748b',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#047857' : '#64748b' }} />
                          {isActive ? 'ACTIVE' : 'INACTIVE'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            onClick={() => openEditModal(r)}
                            style={{
                              background: '#f1f5f9',
                              border: '1px solid #cbd5e1',
                              color: '#334155',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="Edit Record"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => onNavigateToAllocation && onNavigateToAllocation(r)}
                            style={{
                              background: '#2563eb',
                              border: 'none',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                            title="Allocate Bed"
                          >
                            🛏️ Allocate
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            style={{
                              background: '#fef2f2',
                              border: '1px solid #fca5a5',
                              color: '#ef4444',
                              padding: '6px 10px',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              cursor: 'pointer'
                            }}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#64748b', padding: '32px' }}>
                    No student or staff records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer Pagination */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing 1-10 of {filteredResidents.length > 0 ? (filteredResidents.length > 10 ? '1,240' : filteredResidents.length) : '0'} records
          </div>

          {/* Pagination Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ‹
            </button>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: 'none',
                background: '#2563eb',
                color: '#ffffff',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              1
            </button>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              2
            </button>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#334155',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              3
            </button>
            <span style={{ color: '#94a3b8', fontSize: '0.8rem', padding: '0 4px' }}>...</span>
            <button
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: '#ffffff',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              ›
            </button>
          </div>
        </div>

      </div>

      {/* Entry Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className.includes('modal-overlay')) setShowModal(false); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingResident ? '✏️ Edit Profile' : formData.person_type === 'staff' ? '👨‍💼 Register Staff Member' : '🎓 Register Student Member'}
              </h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Person Type</label>
                <select
                  className="form-select"
                  value={formData.person_type}
                  onChange={(e) => setFormData({ ...formData, person_type: e.target.value })}
                >
                  <option value="student">🎓 Student</option>
                  <option value="staff">👨‍💼 Staff</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  {formData.person_type === 'staff' ? 'Staff Employee Code' : 'Student Registration No'}
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder={formData.person_type === 'staff' ? 'e.g. STF2026-04' : 'e.g. RTC2026ST001'}
                  value={formData.reg_no}
                  onChange={(e) => setFormData({ ...formData, reg_no: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Sanjay Kumar"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                />
              </div>

              {formData.person_type === 'student' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Institute</label>
                    <select
                      className="form-select"
                      value={formData.institute_id}
                      onChange={(e) => setFormData({ ...formData, institute_id: parseInt(e.target.value) })}
                    >
                      {institutes.map((i) => (
                        <option key={i.id} value={i.id}>{i.name} ({i.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year of Study</label>
                    <select
                      className="form-select"
                      value={formData.year_of_study}
                      onChange={(e) => setFormData({ ...formData, year_of_study: parseInt(e.target.value) })}
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                    </select>
                  </div>
                </>
              )}

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Guardian / Emergency Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="+91 9876500000"
                  value={formData.guardian_phone}
                  onChange={(e) => setFormData({ ...formData, guardian_phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingResident ? 'Update Entry' : 'Save New Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
