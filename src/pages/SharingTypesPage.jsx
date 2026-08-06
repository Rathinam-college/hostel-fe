import React, { useState, useEffect } from 'react';

export default function SharingTypesPage() {
  const [sharingTypes, setSharingTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    bed_count: 4,
    is_attached: true
  });
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchSharingTypes();
  }, []);

  const fetchSharingTypes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/sharing-types');
      const data = await res.json();
      if (data.status === 'success') {
        setSharingTypes(data.data || []);
      }
    } catch (e) {
      console.error('Failed to fetch sharing types:', e);
    } finally {
      setLoading(false);
    }
  };

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ label: '', bed_count: 4, is_attached: true });
    setShowModal(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label || '',
      bed_count: item.bed_count || 1,
      is_attached: item.is_attached ?? true
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      showNotify('Please provide a label for the sharing type', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = editingItem
        ? `/api/sharing-types/${editingItem.id}`
        : '/api/sharing-types';
      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();

      if (data.status === 'success') {
        showNotify(editingItem ? 'Sharing type updated successfully' : 'New sharing type added');
        setShowModal(false);
        fetchSharingTypes();
      } else {
        showNotify(data.message || 'Failed to save sharing type', 'error');
      }
    } catch (err) {
      showNotify('Server connection error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete "${label}"?`)) return;

    try {
      const res = await fetch(`/api/sharing-types/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.status === 'success') {
        showNotify('Sharing type deleted');
        fetchSharingTypes();
      } else {
        showNotify(data.message || 'Delete failed', 'error');
      }
    } catch (e) {
      showNotify('Error deleting item', 'error');
    }
  };

  const filteredTypes = sharingTypes.filter((t) =>
    t.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalTypes = sharingTypes.length;
  const attachedCount = sharingTypes.filter((t) => t.is_attached).length;
  const totalBedsRepresented = sharingTypes.reduce((acc, t) => acc + (t.bed_count || 0), 0);

  return (
    <div className="fade-in">
      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: notification.type === 'error' ? '#ef4444' : '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            fontWeight: 700,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 9999,
            animation: 'fadeIn 0.3s ease'
          }}
        >
          {notification.type === 'error' ? '❌' : '✅'} {notification.msg}
        </div>
      )}

      {/* Page Title & Header Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
            MASTER MANAGEMENT
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Room Sharing Types
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
            Master data configuration for room occupancy capacities, bed counts, and attached bathroom specifications.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '11px 20px',
            fontWeight: 700,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>+</span> Add Sharing Type
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-label">Total Sharing Types</div>
          <div className="stat-value" style={{ color: '#2563eb' }}>{totalTypes} Configured</div>
          <div className="stat-desc">Defined master room models</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Attached Bathrooms</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{attachedCount} Types</div>
          <div className="stat-desc">Private bath amenity included</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Cum. Bed Model Capacity</div>
          <div className="stat-value" style={{ color: '#7c3aed' }}>{totalBedsRepresented} Beds</div>
          <div className="stat-desc">Sum of model capacities</div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="card" style={{ padding: '24px', background: '#ffffff', borderRadius: '16px' }}>
        {/* Search & Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <input
              type="text"
              placeholder="Search sharing type (e.g. 4 Sharing)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', height: '40px', fontSize: '0.86rem' }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }}>🔍</span>
          </div>

          <button className="btn btn-secondary" onClick={fetchSharingTypes} style={{ fontSize: '0.82rem' }}>
            🔄 Refresh Master List
          </button>
        </div>

        {/* Sharing Types Grid / Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '1.8rem', animation: 'spin 1.5s infinite linear', marginBottom: '10px' }}>🔄</div>
            Loading master sharing types from database...
          </div>
        ) : filteredTypes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🛏️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 6px 0', color: '#0f172a' }}>No Sharing Types Found</h3>
            <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
              {searchQuery ? 'No configurations match your search criteria.' : 'Create your first room sharing type configuration master entry.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '18px' }}>
            {filteredTypes.map((item) => (
              <div
                key={item.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                      {item.label}
                    </h3>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: '#e0e7ff',
                        color: '#1e40af'
                      }}
                    >
                      ID #{item.id}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#0f172a'
                      }}
                    >
                      🛏️ {item.bed_count} {item.bed_count === 1 ? 'Bed' : 'Beds'} / Room
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: '10px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        background: item.is_attached ? '#dcfce7' : '#f1f5f9',
                        color: item.is_attached ? '#15803d' : '#475569',
                        border: item.is_attached ? '1px solid #bbf7d0' : '1px solid #e2e8f0'
                      }}
                    >
                      {item.is_attached ? '🚿 Attached Bath' : '🚽 Common Washroom'}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => handleOpenEdit(item)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#1e293b',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.label)}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #fca5a5',
                      background: '#fef2f2',
                      color: '#ef4444',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px'
          }}
        >
          <div
            className="fade-in"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                {editingItem ? 'Edit Room Sharing Type' : 'Create Room Sharing Type'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Sharing Type Label / Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 4 Sharing (Attached Bath) or Single Deluxe"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label">Bed Count per Room *</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  className="form-input"
                  placeholder="e.g. 4"
                  value={formData.bed_count}
                  onChange={(e) => setFormData({ ...formData, bed_count: parseInt(e.target.value) || 1 })}
                  required
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                  <input
                    type="checkbox"
                    checked={formData.is_attached}
                    onChange={(e) => setFormData({ ...formData, is_attached: e.target.checked })}
                    style={{ width: '18px', height: '18px', accentColor: '#2563eb', cursor: 'pointer' }}
                  />
                  <span>Attached Bathroom Included</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Saving Master...' : editingItem ? 'Save Changes' : 'Create Master Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
