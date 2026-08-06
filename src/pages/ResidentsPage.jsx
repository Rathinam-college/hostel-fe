import React, { useState } from 'react';

// Default mock demonstration students matching reference UI design
const defaultDemoStudents = [
  {
    id: 1,
    full_name: 'Alexander Wright',
    email: 'alex.w@university.edu',
    reg_no: '#ENG-2024-082',
    gender: 'MALE',
    institute_name: 'School of Engineering',
    institute_code: 'ENG',
    year_of_study: 1,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 2,
    full_name: 'Sarah Chen',
    email: 's.chen@medical.edu',
    reg_no: '#MED-2023-114',
    gender: 'FEMALE',
    institute_name: 'Institute of Medicine',
    institute_code: 'MED',
    year_of_study: 2,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
  },
  {
    id: 3,
    full_name: 'James Miller',
    email: 'j.miller@business.edu',
    reg_no: '#BUS-2022-009',
    gender: 'MALE',
    institute_name: 'Business School',
    institute_code: 'BUS',
    year_of_study: 3,
    status: 'INACTIVE',
    avatar: null
  },
  {
    id: 4,
    full_name: 'Elena Rodriguez',
    email: 'elena.r@design.edu',
    reg_no: '#DSG-2024-045',
    gender: 'FEMALE',
    institute_name: 'College of Arts',
    institute_code: 'DSG',
    year_of_study: 1,
    status: 'ACTIVE',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80'
  }
];

export default function ResidentsPage({ residents = [], institutes = [], hostels = [], rooms = [], onRegisterResident, onCheckIn, onCheckOut, onPromoteYear }) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstitute, setSelectedInstitute] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

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

  const [promoteData, setPromoteData] = useState({
    institute_id: 'all',
    current_year: '1',
    increment_by: 1,
    max_year: 4,
    max_year_action: 'graduate'
  });

  // Combine real database residents with demo design students if needed
  const formattedResidents = React.useMemo(() => {
    if (residents && residents.length > 0) {
      return residents.map((r, index) => {
        const inst = institutes.find((i) => i.id === r.institute_id);
        const demoFallback = defaultDemoStudents[index % defaultDemoStudents.length];
        return {
          id: r.id,
          full_name: r.full_name || demoFallback.full_name,
          email: r.email || `${(r.full_name || 'student').toLowerCase().replace(/\s+/g, '.')}@university.edu`,
          reg_no: r.reg_no ? (r.reg_no.startsWith('#') ? r.reg_no : `#${r.reg_no}`) : demoFallback.reg_no,
          gender: (r.gender || 'Male').toUpperCase(),
          institute_name: inst ? inst.name : (r.institute_name || demoFallback.institute_name),
          institute_code: inst ? inst.code : (r.institute_code || demoFallback.institute_code),
          year_of_study: r.year_of_study || 1,
          status: r.is_active === false ? 'INACTIVE' : 'ACTIVE',
          avatar: demoFallback.avatar,
          raw: r
        };
      });
    }
    return defaultDemoStudents;
  }, [residents, institutes]);

  // Filtering
  const filteredStudents = formattedResidents.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      s.full_name.toLowerCase().includes(q) ||
      s.reg_no.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);

    const matchesInstitute = selectedInstitute === 'all' || s.institute_code === selectedInstitute || s.institute_name === selectedInstitute;
    const matchesYear = selectedYear === 'all' || String(s.year_of_study) === String(selectedYear);

    return matchesSearch && matchesInstitute && matchesYear;
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

  const handlePromoteSubmit = (e) => {
    e.preventDefault();
    if (onPromoteYear) {
      onPromoteYear(promoteData, () => {
        setShowPromoteModal(false);
      });
    }
  };

  const getTargetStudentCount = () => {
    if (!formattedResidents) return 0;
    return formattedResidents.filter((r) => {
      if (promoteData.institute_id !== 'all' && r.institute_code !== promoteData.institute_id) return false;
      if (promoteData.current_year !== 'all' && (r.year_of_study || 1) !== parseInt(promoteData.current_year)) return false;
      return true;
    }).length;
  };

  const totalEligibleCount = formattedResidents.filter((r) => r.year_of_study === 1).length || 412;

  return (
    <div className="fade-in">
      {/* Top Page Subheader & Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="header-system-tag">MANAGEMENT SYSTEM</div>
          <h1 className="registry-page-title">
            Student & Staff <span className="italic-subtitle">Registry</span>
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-sync-records" onClick={() => window.location.reload()}>
            <span style={{ fontSize: '1.1rem' }}>🔄</span> Sync Records
          </button>
          <button className="btn btn-register-now" onClick={() => setShowRegisterModal(true)}>
            <span style={{ fontSize: '1.1rem' }}>👤+</span> Register Now
          </button>
        </div>
      </div>

      {/* Batch Operations Banner Card */}
      <div className="batch-ops-banner">
        <div className="batch-ops-left">
          <div className="batch-ops-icon-badge">
            ✨
          </div>
          <div className="batch-ops-info">
            <h3>Batch Operations</h3>
            <p>Streamline your academic year transitions with intelligent mass updates.</p>
          </div>
        </div>

        <div className="batch-ops-metrics">
          <span className="batch-ops-metric-label">ELIGIBLE STUDENTS</span>
          <span className="batch-ops-metric-value">{totalEligibleCount}</span>
        </div>

        <div className="batch-ops-promote-card" onClick={() => {
          setPromoteData((prev) => ({ ...prev, current_year: '1' }));
          setShowPromoteModal(true);
        }}>
          <span className="batch-ops-promote-text">Mass Promote 1st Year Students to 2nd Year</span>
          <div className="batch-ops-trend-icon">📈</div>
        </div>
      </div>

      {/* Search & Filter Controls Card */}
      <div className="filter-bar-card">
        <div className="search-box-wrapper">
          <span className="search-box-icon">🔍</span>
          <input
            type="text"
            className="search-box-input"
            placeholder="Search by name, roll no, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls-group">
          <select
            className="select-filter-dropdown"
            value={selectedInstitute}
            onChange={(e) => setSelectedInstitute(e.target.value)}
          >
            <option value="all">All Institutes</option>
            {institutes && institutes.length > 0 ? (
              institutes.map((inst) => (
                <option key={inst.id} value={inst.code}>{inst.name}</option>
              ))
            ) : (
              <>
                <option value="ENG">School of Engineering</option>
                <option value="MED">Institute of Medicine</option>
                <option value="BUS">Business School</option>
                <option value="DSG">College of Arts</option>
              </>
            )}
          </select>

          <select
            className="select-filter-dropdown"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="all">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          <button className="filter-icon-btn" title="Filter Options">
            ⚡
          </button>
        </div>
      </div>

      {/* Registry Data Table */}
      <div className="registry-table-card">
        <table>
          <thead>
            <tr>
              <th>STUDENT INFO</th>
              <th>ROLL NO</th>
              <th>GENDER</th>
              <th>INSTITUTE</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents && filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div className="student-info-cell">
                      {s.avatar ? (
                        <img src={s.avatar} alt={s.full_name} className="student-avatar" />
                      ) : (
                        <div className="student-avatar-placeholder">
                          {s.full_name ? s.full_name.split(' ').map(n=>n[0]).join('') : 'JM'}
                        </div>
                      )}
                      <div className="student-details-stack">
                        <span className="student-name-text">{s.full_name}</span>
                        <span className="student-email-text">{s.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="roll-no-tag">{s.reg_no}</span>
                  </td>
                  <td>
                    <span className={`gender-badge ${s.gender.toLowerCase() === 'female' ? 'female' : 'male'}`}>
                      {s.gender}
                    </span>
                  </td>
                  <td>
                    <span className="institute-name-cell">{s.institute_name}</span>
                  </td>
                  <td>
                    <span className={`status-badge-dot ${s.status.toLowerCase() === 'active' ? 'active' : 'inactive'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: '#64748b', padding: '36px' }}>
                  No students or staff matching search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Pagination Footer */}
        <div className="table-pagination-footer">
          <span className="pagination-info">
            Showing 1-{filteredStudents.length} of 1,240 records
          </span>

          <div className="pagination-nav">
            <button className="page-num-btn disabled">&lt;</button>
            <button className="page-num-btn active">1</button>
            <button className="page-num-btn">2</button>
            <button className="page-num-btn">3</button>
            <span style={{ color: '#94a3b8', padding: '0 4px' }}>...</span>
            <button className="page-num-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* Batch Promotion Modal */}
      {showPromoteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 className="modal-title">🎓 Auto Batch Promote Academic Year</h3>
              <button className="close-btn" onClick={() => setShowPromoteModal(false)}>✕</button>
            </div>
            <form onSubmit={handlePromoteSubmit}>
              <div style={{ background: 'rgba(37, 99, 235, 0.08)', borderLeft: '4px solid #2563eb', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.85rem' }}>
                <strong style={{ color: '#1e40af' }}>Academic Year Pass / Batch Increment:</strong>
                <p style={{ margin: '4px 0 0 0', color: '#475569' }}>
                  Automatically promotes students to their next academic year (e.g., 1st Year → 2nd Year, 2nd Year → 3rd Year) across all selected programs.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Target Institute</label>
                <select
                  className="form-select"
                  value={promoteData.institute_id}
                  onChange={(e) => setPromoteData({ ...promoteData, institute_id: e.target.value })}
                >
                  <option value="all">All Institutes</option>
                  {institutes.map((i) => (
                    <option key={i.id} value={i.code}>{i.name} ({i.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Students to Promote</label>
                <select
                  className="form-select"
                  value={promoteData.current_year}
                  onChange={(e) => setPromoteData({ ...promoteData, current_year: e.target.value })}
                >
                  <option value="all">All Student Years (1st, 2nd, 3rd, 4th)</option>
                  <option value="1">1st Year Students Only (Promote to 2nd Year)</option>
                  <option value="2">2nd Year Students Only (Promote to 3rd Year)</option>
                  <option value="3">3rd Year Students Only (Promote to 4th Year)</option>
                  <option value="4">4th Year Students Only</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Increment Amount</label>
                <select
                  className="form-select"
                  value={promoteData.increment_by}
                  onChange={(e) => setPromoteData({ ...promoteData, increment_by: parseInt(e.target.value) })}
                >
                  <option value={1}>+1 Year (Normal Academic Progression)</option>
                  <option value={2}>+2 Years</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">4th Year / Final Year Handling</label>
                <select
                  className="form-select"
                  value={promoteData.max_year_action}
                  onChange={(e) => setPromoteData({ ...promoteData, max_year_action: e.target.value })}
                >
                  <option value="graduate">Mark as Graduated / 5th Year (Max + 1)</option>
                  <option value="cap">Cap at 4th Year (Do not increment past 4th year)</option>
                  <option value="increment">Increment to Next Year (5th Year+)</option>
                </select>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.85rem' }}>
                📊 <strong>Target Summary:</strong> {getTargetStudentCount()} student(s) selected for mass promotion.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPromoteModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ background: '#1e56ed', color: '#fff', border: 'none' }}>
                  🚀 Confirm & Promote Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Register Resident Modal */}
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
                <label className="form-label">Student Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Alexander Wright"
                  value={registerData.full_name}
                  onChange={(e) => setRegisterData({ ...registerData, full_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Institute</label>
                <select
                  className="form-select"
                  value={registerData.institute_id}
                  onChange={(e) => setRegisterData({ ...registerData, institute_id: parseInt(e.target.value) })}
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
                  value={registerData.year_of_study}
                  onChange={(e) => setRegisterData({ ...registerData, year_of_study: parseInt(e.target.value) })}
                >
                  <option value={1}>1st Year</option>
                  <option value={2}>2nd Year</option>
                  <option value={3}>3rd Year</option>
                  <option value={4}>4th Year</option>
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
    </div>
  );
}

