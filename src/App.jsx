import React, { useState, useEffect } from 'react';
import './styles.css';

// Import Modular Page Components
import DashboardPage from './pages/DashboardPage';
import HostelsPage from './pages/HostelsPage';
import FloorsPage from './pages/FloorsPage';
import RoomsPage from './pages/RoomsPage';
import RoomBedsSharePage from './pages/RoomBedsSharePage';
import ResidentsPage from './pages/ResidentsPage';
import InstitutesPage from './pages/InstitutesPage';
import RenewalsPage from './pages/RenewalsPage';
import RequirementsPage from './pages/RequirementsPage';
import ConstructionPage from './pages/ConstructionPage';
import UsersPage from './pages/UsersPage';
import ReportsPage from './pages/ReportsPage';
import VacancyAuditReportPage from './pages/VacancyAuditReportPage';
import DailyHeadcountReportPage from './pages/DailyHeadcountReportPage';
import MonthlyOccupancyReportPage from './pages/MonthlyOccupancyReportPage';
import NewEntryPage from './pages/NewEntryPage';
import BedAllocationPage from './pages/BedAllocationPage';
import SharingTypesPage from './pages/SharingTypesPage';

// Nav Section Configuration
const dailyEntryItems = [
  { id: 'new-entry', label: 'Students & Staff New Entry', icon: '📝' },
  { id: 'bed-allocation', label: 'Bed & Room Allocation', icon: '🛏️' },
];

const masterDataItems = [
  { id: 'hostels', label: 'Hostels', icon: '🏢' },
  { id: 'floors', label: 'Floors', icon: '📶' },
  { id: 'rooms', label: 'Rooms', icon: '🚪' },
  { id: 'sharing-types', label: 'Room Sharing Types', icon: '🛏️' },
  { id: 'residents', label: 'Students Directory', icon: '👥' },
  { id: 'institutes', label: 'Institutes', icon: '🎓' },
];

const reportsItems = [
  { id: 'reports-vacancy', label: 'Opening & Closing Vacancy Audit', icon: '🚪' },
  { id: 'reports-daily', label: 'Daily Headcount & Check-Ins', icon: '📅' },
  { id: 'reports-monthly', label: 'Monthly Occupancy Report', icon: '📊' },
  { id: 'beds-share', label: 'Beds & Sharing', icon: '🛏️' },
];

const settingsItems = [
  { id: 'renewals', label: 'Renewals Board', icon: '📋' },
  { id: 'requirements', label: 'Demand Forecast', icon: '🔮' },
  { id: 'construction', label: 'Expansion Tracker', icon: '🏗️' },
  { id: 'users', label: 'Users & Roles', icon: '⚙️' },
];

const getSectionForTab = (tabId) => {
  if (dailyEntryItems.some((item) => item.id === tabId)) return 'dailyEntry';
  if (reportsItems.some((item) => item.id === tabId) || tabId === 'reports') return 'reports';
  if (masterDataItems.some((item) => item.id === tabId)) return 'masterData';
  if (settingsItems.some((item) => item.id === tabId)) return 'settings';
  return 'dailyEntry';
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('hostel_portal_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const getTabFromUrl = () => {
    const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
    const segments = path.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || 'dashboard';

    const validTabs = [
      'dashboard', 'new-entry', 'bed-allocation', 'hostels', 'floors', 'rooms', 'beds-share',
      'sharing-types', 'residents', 'institutes', 'reports', 'reports-vacancy', 'reports-daily', 'reports-monthly',
      'renewals', 'requirements', 'construction', 'users'
    ];

    return validTabs.includes(lastSegment) ? lastSegment : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('hostel_portal_theme') || 'blue';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('hostel_portal_theme', theme);
  }, [theme]);

  const [openSection, setOpenSection] = useState(() => getSectionForTab(getTabFromUrl()));

  const toggleSection = (sectionName) => {
    setOpenSection((prev) => (prev === sectionName ? null : sectionName));
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const sec = getSectionForTab(tabId);
    if (sec) {
      setOpenSection(sec);
    }
    const basePath = window.location.pathname.startsWith('/hostel') ? '/hostel' : '';
    const newUrl = `${basePath}/${tabId}`;
    if (window.location.pathname !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const currentTab = getTabFromUrl();
      setActiveTab(currentTab);
      const sec = getSectionForTab(currentTab);
      if (sec) {
        setOpenSection(sec);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [preselectedResidentForAllocation, setPreselectedResidentForAllocation] = useState(null);
  const [stats, setStats] = useState(null);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [institutes, setInstitutes] = useState([]);
  const [sharingTypes, setSharingTypes] = useState([]);
  const [residents, setResidents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Initial data fetch
    fetchDashboardStats();
    fetchHostels();
    fetchRooms();
    fetchInstitutes();
    fetchSharingTypes();
    fetchResidents();
    fetchUsers();
  }, []);

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const fetchDashboardStats = () => {
    setLoading(true);
    fetch('/api/dashboard/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const fetchHostels = () => {
    fetch('/api/hostels')
      .then((res) => res.json())
      .then((data) => { if (data.status === 'success') setHostels(data.data || []); });
  };

  const fetchRooms = () => {
    fetch('/api/rooms')
      .then((res) => res.json())
      .then((data) => { if (data.status === 'success') setRooms(data.data || []); });
  };

  const fetchInstitutes = () => {
    fetch('/api/institutes')
      .then((res) => res.json())
      .then((data) => { if (data.status === 'success') setInstitutes(data.data || []); });
  };

  const fetchSharingTypes = () => {
    fetch('/api/sharing-types')
      .then((res) => res.json())
      .then((data) => { if (data.status === 'success') setSharingTypes(data.data || []); });
  };

  const fetchResidents = () => {
    fetch('/api/residents')
      .then((res) => res.json())
      .then((data) => { if (data.status === 'success') setResidents(data.data || []); });
  };

  const fetchUsers = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((data) => { if (data.status === 'success') setUsers(data.data || []); });
  };

  // Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginForm)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setCurrentUser(data.user);
          try {
            localStorage.setItem('hostel_portal_user', JSON.stringify(data.user));
          } catch (e) {}
          showNotify(`Welcome back, ${data.user.full_name}!`);
        } else {
          setLoginError(data.message || 'Login failed');
        }
      })
      .catch((err) => setLoginError('Connection error to server'));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('hostel_portal_user');
    } catch (e) {}
  };

  const handleAddHostel = (hostelData) => {
    fetch('/api/hostels', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hostelData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchHostels();
          fetchDashboardStats();
          showNotify('Hostel block added successfully!');
        }
      });
  };

  const handleDeleteHostel = (id) => {
    if (!window.confirm('Delete this hostel block?')) return;
    fetch(`/api/hostels/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchHostels();
          fetchDashboardStats();
          showNotify('Hostel block deleted');
        }
      });
  };

  const handleAddRoom = (roomData) => {
    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(roomData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchRooms();
          fetchDashboardStats();
          showNotify('Room created successfully!');
        }
      });
  };

  const handleDeleteRoom = (id) => {
    if (!window.confirm('Delete room?')) return;
    fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchRooms();
          fetchDashboardStats();
          showNotify('Room removed');
        }
      });
  };

  const handleAddInstitute = (instData) => {
    fetch('/api/institutes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(instData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchInstitutes();
          showNotify('Institute record added');
        }
      });
  };

  const handleRegisterResident = (resData) => {
    fetch('/api/residents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchResidents();
          showNotify('Resident student/staff registered');
        }
      });
  };

  const handleUpdateResident = (id, resData) => {
    fetch(`/api/residents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchResidents();
          showNotify('Resident record updated');
        } else {
          alert(data.message || 'Update failed');
        }
      });
  };

  const handleDeleteResident = (id) => {
    fetch(`/api/residents/${id}`, { method: 'DELETE' })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchResidents();
          showNotify('Resident record deleted');
        }
      });
  };

  const handlePromoteYear = (promoteData, onSuccess) => {
    fetch('/api/residents/promote-year', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(promoteData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchResidents();
          showNotify(data.message || 'Student academic years updated successfully!');
          if (onSuccess) onSuccess();
        } else {
          alert(data.message || 'Batch promotion failed');
        }
      })
      .catch((err) => {
        alert('Failed to execute batch year promotion: ' + err.message);
      });
  };

  const handleNavigateToAllocation = (resident) => {
    setPreselectedResidentForAllocation(resident);
    handleTabChange('bed-allocation');
  };

  const handleCheckIn = (allocData) => {
    fetch('/api/allocations/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(allocData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchRooms();
          fetchDashboardStats();
          showNotify('Check-in complete!');
        } else {
          alert(data.message || 'Check-in failed');
        }
      });
  };

  const handleAddUser = (userData) => {
    fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchUsers();
          showNotify('User account created');
        }
      });
  };

  const handleInitDbSchema = () => {
    if (!window.confirm('Re-initialize PostgreSQL database schema and seed normalized tables?')) return;
    fetch('/api/db/init-schema', { method: 'POST' })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          fetchDashboardStats();
          fetchHostels();
          fetchRooms();
          fetchInstitutes();
          fetchResidents();
          showNotify('PostgreSQL Database schema initialized! Check pgAdmin.');
        }
      });
  };

  // If not logged in, render clean Light Mode Login Page
  if (!currentUser) {
    return (
      <div className="page-container" id="login-container">
        <div className="login-card">
          <div className="brand-icon" style={{ margin: '0 auto 16px auto', width: '56px', height: '56px', fontSize: '1.8rem' }}>
            🏰
          </div>
          <h1 className="login-logo">Hostel Portal</h1>
          <p className="login-subtitle">Rathinam Educational Campuses Management</p>

          {loginError && (
            <div style={{ padding: '12px', background: 'var(--danger-light)', color: 'var(--danger)', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '20px', fontWeight: 600 }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. admin or warden_westend"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '28px' }}>
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              Sign In to Portal
            </button>
          </form>

          <div style={{ marginTop: '24px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Default Login: <strong>admin</strong> / <strong>admin123</strong>
          </div>
        </div>
      </div>
    );
  }

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview' },
    ...dailyEntryItems,
    ...masterDataItems,
    ...reportsItems,
    { id: 'reports', label: 'Audit Reports & Analytics Hub' },
    ...settingsItems,
  ];

  const isDailyEntryActive = dailyEntryItems.some((item) => item.id === activeTab);
  const isMasterDataActive = masterDataItems.some((item) => item.id === activeTab);
  const isReportsActive = reportsItems.some((item) => item.id === activeTab) || activeTab === 'reports';
  const isSettingsActive = settingsItems.some((item) => item.id === activeTab);

  return (
    <div className="page-container">
      {/* HostelGuard Navigation Sidebar */}
      <aside className="sidebar">
        <div className="brand-container">
          <div className="brand-icon">
            🛡️
          </div>
          <div>
            <div className="brand-title">
              HostelGuard
            </div>
            <span className="brand-tag">Enterprise</span>
          </div>
        </div>

        <nav className="nav-menu">
          {/* Overview */}
          <a
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Overview</span>
          </a>

          {/* DAILY OPERATIONS / DAILY ENTRY FOLDER */}
          <div className="nav-folder">
            <div
              className={`nav-folder-header ${isDailyEntryActive ? 'active-folder' : ''}`}
              onClick={() => toggleSection('dailyEntry')}
              title="Click to open or close Daily Entry menu"
            >
              <div className="nav-folder-title">
                <span className="folder-icon-badge folder-badge-blue">⚡</span>
                <span>Daily Entry</span>
              </div>
              <svg className={`folder-chevron ${openSection === 'dailyEntry' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {openSection === 'dailyEntry' && (
              <div className="nav-folder-content">
                <a
                  className={`nav-sub-item ${activeTab === 'new-entry' ? 'active' : ''}`}
                  onClick={() => handleTabChange('new-entry')}
                >
                  <span className="nav-icon" style={{ fontSize: '1.15rem', fontWeight: 800 }}>+</span>
                  <span>New Entry</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'bed-allocation' ? 'active' : ''}`}
                  onClick={() => handleTabChange('bed-allocation')}
                >
                  <span className="nav-icon">🛏️</span>
                  <span>Bed Allocation</span>
                </a>
              </div>
            )}
          </div>

          {/* INTELLIGENCE FOLDER */}
          <div className="nav-folder">
            <div
              className={`nav-folder-header ${isReportsActive ? 'active-folder' : ''}`}
              onClick={() => toggleSection('reports')}
              title="Click to open or close Intelligence Reports menu"
            >
              <div className="nav-folder-title">
                <span className="folder-icon-badge folder-badge-purple">📊</span>
                <span>Reports & Audit</span>
              </div>
              <svg className={`folder-chevron ${openSection === 'reports' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {openSection === 'reports' && (
              <div className="nav-folder-content">
                <a
                  className={`nav-sub-item ${activeTab === 'reports-vacancy' ? 'active' : ''}`}
                  onClick={() => handleTabChange('reports-vacancy')}
                >
                  <span className="nav-icon">📋</span>
                  <span>Vacancy Audit</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'reports-daily' ? 'active' : ''}`}
                  onClick={() => handleTabChange('reports-daily')}
                >
                  <span className="nav-icon">📅</span>
                  <span>Daily Headcount</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'reports-monthly' ? 'active' : ''}`}
                  onClick={() => handleTabChange('reports-monthly')}
                >
                  <span className="nav-icon">📈</span>
                  <span>Occupancy & Utilization</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'beds-share' ? 'active' : ''}`}
                  onClick={() => handleTabChange('beds-share')}
                >
                  <span className="nav-icon">🛏️</span>
                  <span>Beds & Sharing</span>
                </a>
              </div>
            )}
          </div>

          {/* MANAGEMENT FOLDER */}
          <div className="nav-folder">
            <div
              className={`nav-folder-header ${isMasterDataActive ? 'active-folder' : ''}`}
              onClick={() => toggleSection('masterData')}
              title="Click to open or close Management Directory menu"
            >
              <div className="nav-folder-title">
                <span className="folder-icon-badge folder-badge-emerald">🏢</span>
                <span>Master Management</span>
              </div>
              <svg className={`folder-chevron ${openSection === 'masterData' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {openSection === 'masterData' && (
              <div className="nav-folder-content">
                <a
                  className={`nav-sub-item ${activeTab === 'residents' ? 'active' : ''}`}
                  onClick={() => handleTabChange('residents')}
                >
                  <span className="nav-icon">👥</span>
                  <span>Students Directory</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'hostels' ? 'active' : ''}`}
                  onClick={() => handleTabChange('hostels')}
                >
                  <span className="nav-icon">🏢</span>
                  <span>Hostels & Blocks</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'floors' ? 'active' : ''}`}
                  onClick={() => handleTabChange('floors')}
                >
                  <span className="nav-icon">📶</span>
                  <span>Floors</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'rooms' ? 'active' : ''}`}
                  onClick={() => handleTabChange('rooms')}
                >
                  <span className="nav-icon">🚪</span>
                  <span>Rooms</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'sharing-types' ? 'active' : ''}`}
                  onClick={() => handleTabChange('sharing-types')}
                >
                  <span className="nav-icon">🛏️</span>
                  <span>Room Sharing Types</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'institutes' ? 'active' : ''}`}
                  onClick={() => handleTabChange('institutes')}
                >
                  <span className="nav-icon">🎓</span>
                  <span>Institutes</span>
                </a>
              </div>
            )}
          </div>

          {/* SYSTEM FOLDER */}
          <div className="nav-folder">
            <div
              className={`nav-folder-header ${isSettingsActive ? 'active-folder' : ''}`}
              onClick={() => toggleSection('settings')}
              title="Click to open or close System Control menu"
            >
              <div className="nav-folder-title">
                <span className="folder-icon-badge folder-badge-amber">⚙️</span>
                <span>System Tools</span>
              </div>
              <svg className={`folder-chevron ${openSection === 'settings' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>

            {openSection === 'settings' && (
              <div className="nav-folder-content">
                <a
                  className={`nav-sub-item ${activeTab === 'renewals' ? 'active' : ''}`}
                  onClick={() => handleTabChange('renewals')}
                >
                  <span className="nav-icon">📋</span>
                  <span>Renewals Board</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'requirements' ? 'active' : ''}`}
                  onClick={() => handleTabChange('requirements')}
                >
                  <span className="nav-icon">🔮</span>
                  <span>Demand Forecast</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'construction' ? 'active' : ''}`}
                  onClick={() => handleTabChange('construction')}
                >
                  <span className="nav-icon">🏗️</span>
                  <span>Expansion Tracker</span>
                </a>
                <a
                  className={`nav-sub-item ${activeTab === 'users' ? 'active' : ''}`}
                  onClick={() => handleTabChange('users')}
                >
                  <span className="nav-icon">⚙️</span>
                  <span>Roles & Users</span>
                </a>
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          {/* Theme Switcher Segmented Control */}
          <div className="theme-switcher-bar">
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'blue' ? 'active' : ''}`}
              onClick={() => setTheme('blue')}
              title="Blue Theme"
            >
              <span className="theme-dot theme-dot-blue"></span>
              <span>Blue</span>
            </button>
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme('dark')}
              title="Dark Mode"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
              <span>Dark</span>
            </button>
            <button
              type="button"
              className={`theme-pill-btn ${theme === 'emerald' ? 'active' : ''}`}
              onClick={() => setTheme('emerald')}
              title="Mint Theme"
            >
              <span className="theme-dot theme-dot-mint"></span>
              <span>Mint</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="user-profile-card">
            <div className="avatar-wrapper">
              <div className="avatar">
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className="status-dot" title="Active Session"></span>
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.full_name}</div>
              <span className="user-role-badge">{currentUser.role || 'ADMIN'}</span>
            </div>
            <button
              className="btn-logout-modern"
              onClick={handleLogout}
              title="Sign Out"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <main className="main-wrapper">


        {/* Global Notification Banner */}
        {notification && (
          <div style={{
            margin: '16px 32px 0 32px',
            padding: '12px 20px',
            background: notification.type === 'success' ? 'var(--success-light)' : 'var(--danger-light)',
            color: notification.type === 'success' ? 'var(--success)' : 'var(--danger)',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-sm)'
          }}>
            {notification.msg}
          </div>
        )}

        {/* Main Content Area - Render Active Page File Component */}
        <div className="main-content">
          {activeTab === 'dashboard' && (
            <DashboardPage stats={stats} loading={loading} refreshStats={fetchDashboardStats} onNavigate={handleTabChange} />
          )}

          {activeTab === 'new-entry' && (
            <NewEntryPage
              residents={residents}
              institutes={institutes}
              hostels={hostels}
              rooms={rooms}
              onRegisterResident={handleRegisterResident}
              onUpdateResident={handleUpdateResident}
              onDeleteResident={handleDeleteResident}
              onNavigateToAllocation={handleNavigateToAllocation}
              onPromoteYear={handlePromoteYear}
            />
          )}

          {activeTab === 'bed-allocation' && (
            <BedAllocationPage
              residents={residents}
              hostels={hostels}
              rooms={rooms}
              preselectedResident={preselectedResidentForAllocation}
              onCheckIn={handleCheckIn}
              onCheckOut={(outData) => {
                fetch('/api/allocations/check-out', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(outData)
                })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.status === 'success') {
                      fetchRooms();
                      fetchDashboardStats();
                      showNotify('Check-out completed!');
                    }
                  });
              }}
            />
          )}

          {activeTab === 'hostels' && (
            <HostelsPage hostels={hostels} onAddHostel={handleAddHostel} onDeleteHostel={handleDeleteHostel} />
          )}

          {activeTab === 'floors' && (
            <FloorsPage hostels={hostels} rooms={rooms} sharingTypes={sharingTypes} onAddRoom={handleAddRoom} refreshRooms={fetchRooms} />
          )}

          {activeTab === 'rooms' && (
            <RoomsPage rooms={rooms} hostels={hostels} sharingTypes={sharingTypes} onAddRoom={handleAddRoom} onDeleteRoom={handleDeleteRoom} />
          )}

          {activeTab === 'sharing-types' && (
            <SharingTypesPage />
          )}

          {activeTab === 'beds-share' && (
            <RoomBedsSharePage hostels={hostels} rooms={rooms} />
          )}

          {activeTab === 'residents' && (
            <ResidentsPage residents={residents} institutes={institutes} hostels={hostels} rooms={rooms} onRegisterResident={handleRegisterResident} onCheckIn={handleCheckIn} onPromoteYear={handlePromoteYear} />
          )}

          {activeTab === 'institutes' && (
            <InstitutesPage institutes={institutes} onAddInstitute={handleAddInstitute} />
          )}

          {(activeTab === 'reports' || activeTab === 'reports-vacancy') && (
            <VacancyAuditReportPage />
          )}

          {activeTab === 'reports-daily' && (
            <DailyHeadcountReportPage />
          )}

          {activeTab === 'reports-monthly' && (
            <MonthlyOccupancyReportPage />
          )}

          {activeTab === 'renewals' && (
            <RenewalsPage onPromoteYear={handlePromoteYear} />
          )}

          {activeTab === 'requirements' && (
            <RequirementsPage institutes={institutes} sharingTypes={sharingTypes} />
          )}

          {activeTab === 'construction' && (
            <ConstructionPage hostels={hostels} />
          )}

          {activeTab === 'users' && (
            <UsersPage users={users} hostels={hostels} onAddUser={handleAddUser} />
          )}
        </div>
      </main>
    </div>
  );
}
