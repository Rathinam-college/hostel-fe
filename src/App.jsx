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
      'dashboard', 'hostels', 'floors', 'rooms', 'beds-share',
      'residents', 'institutes', 'reports', 'renewals', 'requirements', 'construction', 'users'
    ];

    return validTabs.includes(lastSegment) ? lastSegment : 'dashboard';
  };

  const [activeTab, setActiveTab] = useState(getTabFromUrl);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const basePath = window.location.pathname.startsWith('/hostel') ? '/hostel' : '';
    const newUrl = `${basePath}/${tabId}`;
    if (window.location.pathname !== newUrl) {
      window.history.pushState(null, '', newUrl);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(getTabFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Core Data States
  const [isMasterDataOpen, setIsMasterDataOpen] = useState(true);
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
          showNotify('Resident student registered');
        }
      });
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

  // Master Data Items List
  const masterDataItems = [
    { id: 'hostels', label: 'Hostels', icon: '🏢' },
    { id: 'floors', label: 'Floors', icon: '📶' },
    { id: 'rooms', label: 'Rooms', icon: '🚪' },
    { id: 'beds-share', label: 'Beds & Sharing', icon: '🛏️' },
    { id: 'residents', label: 'Students', icon: '👥' },
    { id: 'institutes', label: 'Institutes', icon: '🎓' },
  ];

  const topNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '📊' },
    { id: 'reports', label: 'Audit Reports', icon: '📈' },
    { id: 'renewals', label: 'Renewals Board', icon: '📋' },
    { id: 'requirements', label: 'Demand Forecast', icon: '🔮' },
    { id: 'construction', label: 'Expansion Tracker', icon: '🏗️' },
    { id: 'users', label: 'Users & Roles', icon: '⚙️' },
  ];

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard Overview' },
    ...masterDataItems,
    { id: 'reports', label: 'Audit Reports' },
    { id: 'renewals', label: 'Renewals Board' },
    { id: 'requirements', label: 'Demand Forecast' },
    { id: 'construction', label: 'Expansion Tracker' },
    { id: 'users', label: 'Users & Roles' },
  ];

  const isMasterDataActive = masterDataItems.some((item) => item.id === activeTab);

  return (
    <div className="page-container">
      {/* Light Theme Navigation Sidebar */}
      <aside className="sidebar">
        <div className="brand-container">
          <div className="brand-icon">🏰</div>
          <div>
            <div className="brand-title">Hostel Portal</div>
            <div className="brand-subtitle">Management Suite</div>
          </div>
        </div>

        <nav className="nav-menu">
          {/* 1. Dashboard Overview */}
          <a
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span>Dashboard Overview</span>
          </a>

          {/* 2. Master Data Collapsible Dropdown */}
          <div className="nav-dropdown">
            <div
              className={`nav-dropdown-header ${isMasterDataActive ? 'active' : ''}`}
              onClick={() => setIsMasterDataOpen(!isMasterDataOpen)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="nav-icon">📂</span>
                <span>Master Data</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isMasterDataOpen ? '▲' : '▼'}
              </span>
            </div>

            {isMasterDataOpen && (
              <div className="nav-submenu">
                {masterDataItems.map((item) => (
                  <a
                    key={item.id}
                    className={`nav-subitem ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => handleTabChange(item.id)}
                  >
                    <span className="nav-icon" style={{ fontSize: '1.05rem' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* 3. Remaining Top-Level Navigation Items */}
          {topNavItems.slice(1).map((item) => (
            <a
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleTabChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">
              {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{currentUser.full_name}</div>
              <div className="user-role">{currentUser.role}</div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleLogout}
              title="Log Out"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* Main Wrapper */}
      <main className="main-wrapper">
        {/* Top Header Bar */}
        <header className="top-header">
          <div className="header-title-group">
            <h1>{allNavItems.find((n) => n.id === activeTab)?.label || 'Dashboard Overview'}</h1>
            <p>Rathinam Educational Campuses • Hostel Operations Portal</p>
          </div>

          <div className="header-actions">
            <button className="btn btn-secondary btn-sm" onClick={handleInitDbSchema}>
              ⚡ Reset/Seed DB (pgAdmin)
            </button>
            <span className="badge badge-success">PostgreSQL Online</span>
          </div>
        </header>

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
            <DashboardPage stats={stats} loading={loading} refreshStats={fetchDashboardStats} />
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

          {activeTab === 'beds-share' && (
            <RoomBedsSharePage hostels={hostels} rooms={rooms} />
          )}

          {activeTab === 'residents' && (
            <ResidentsPage residents={residents} institutes={institutes} hostels={hostels} rooms={rooms} onRegisterResident={handleRegisterResident} onCheckIn={handleCheckIn} />
          )}

          {activeTab === 'institutes' && (
            <InstitutesPage institutes={institutes} onAddInstitute={handleAddInstitute} />
          )}

          {activeTab === 'reports' && (
            <ReportsPage />
          )}

          {activeTab === 'renewals' && (
            <RenewalsPage />
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
