import React, { useState, useEffect } from 'react';

export default function VacancyAuditReportPage() {
  const [openingClosingData, setOpeningClosingData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('Oct 01 - Oct 31, 2023');

  useEffect(() => {
    fetchOpeningClosingReports();
  }, []);

  const fetchOpeningClosingReports = () => {
    setLoading(true);
    fetch('/api/reports/opening-closing')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setOpeningClosingData(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handlePrint = () => {
    window.print();
  };

  // Sample reconciliation rows if API returns empty
  const defaultReconciliationRows = [
    { wing: 'Wing A - Premium', opening: 42, checkIns: -8, checkOuts: 12, closing: 46, variance: '+4', isPositive: true },
    { wing: 'Wing B - Shared', opening: 118, checkIns: -24, checkOuts: 15, closing: 109, variance: '-9', isPositive: false },
    { wing: 'Wing C - Studio', opening: 14, checkIns: -2, checkOuts: 1, closing: 13, variance: '-1', isPositive: false },
    { wing: 'International Block', opening: 31, checkIns: -11, checkOuts: 9, closing: 29, variance: '-2', isPositive: false }
  ];

  const tableRows = (openingClosingData && openingClosingData.length > 0)
    ? openingClosingData.map((h) => {
        const checkIns = -Math.round(h.occupied_beds * 0.2);
        const checkOuts = Math.round(h.closing_vacant_beds * 0.3);
        const varianceNum = checkOuts + checkIns;
        const isPos = varianceNum >= 0;
        return {
          wing: h.hostel_name || 'Wing A',
          opening: h.opening_total_beds || 40,
          checkIns: checkIns,
          checkOuts: checkOuts,
          closing: h.closing_vacant_beds || 30,
          variance: isPos ? `+${varianceNum}` : `${varianceNum}`,
          isPositive: isPos
        };
      })
    : defaultReconciliationRows;

  // Recent status changes feed data
  const statusChanges = [
    {
      id: 1,
      title: '12 Beds Freed',
      detail: 'Check-out batch processing: Wing A',
      time: '10:45 AM • Auto-System',
      icon: '🟢',
      bg: '#ecfdf5',
      color: '#10b981'
    },
    {
      id: 2,
      title: '4 Beds Blocked',
      detail: 'Emergency maintenance: HVAC repair',
      time: '09:12 AM • Admin Sarah',
      icon: '⛔',
      bg: '#fef2f2',
      color: '#ef4444'
    },
    {
      id: 3,
      title: '8 Beds Occupied',
      detail: 'Group check-in: Tech Interns 2023',
      time: 'Yesterday • Front Desk',
      icon: '👥',
      bg: '#eff6ff',
      color: '#2563eb'
    },
    {
      id: 4,
      title: 'Manual Override',
      detail: 'Correction of bed count in Studio-402',
      time: 'Yesterday • Manager Mike',
      icon: '🔄',
      bg: '#fffbeb',
      color: '#d97706'
    }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '4px' }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Vacancy Audit Report
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', margin: 0, maxWidth: '680px' }}>
            A comprehensive reconciliation of room availability, tracking every check-in, check-out, and maintenance block across the portfolio.
          </p>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Date Range Picker Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '2px' }}>
              DATE RANGE
            </span>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '9px 16px',
                borderRadius: '12px',
                border: '1px solid #c7d2fe',
                background: '#eff6ff',
                color: '#1e40af',
                fontWeight: 700,
                fontSize: '0.86rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Oct 01 - Oct 31, 2023">Oct 01 &ndash; Oct 31, 2023</option>
              <option value="Nov 01 - Nov 30, 2023">Nov 01 &ndash; Nov 30, 2023</option>
              <option value="Dec 01 - Dec 31, 2023">Dec 01 &ndash; Dec 31, 2023</option>
            </select>
          </div>

          <button
            onClick={handlePrint}
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
              transition: 'all 0.2s ease',
              marginTop: '14px'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* 2. Top KPI Summary Cards (4 Cards Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: Avg. Daily Vacancy */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              🏢
            </div>
            <span style={{ background: '#d1fae5', color: '#047857', padding: '4px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
              +4.2%
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '4px' }}>
            12
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Avg. Daily Vacancy
          </div>
        </div>

        {/* Card 2: Maintenance Blocks */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              🔧
            </div>
            <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
              Stable
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '4px' }}>
            12
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Maintenance Blocks
          </div>
        </div>

        {/* Card 3: Occupancy Rate */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              📉
            </div>
            <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
              -2.1%
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '4px' }}>
            88.4%
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Occupancy Rate
          </div>
        </div>

        {/* Card 4: Pending Reconciliations */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f3e8ff', color: '#7e22ce', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              ⇄
            </div>
            <span style={{ background: '#e0e7ff', color: '#1e40af', padding: '4px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
              Active
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1, marginBottom: '4px' }}>
            18
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Pending Reconciliations
          </div>
        </div>

      </div>

      {/* 3. Main Split Section (Left: Chart + Table | Right: Feed + Banner) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Daily Vacancy Trends Chart Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Daily Vacancy Trends
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                  Fluctuation of available beds over the last 30 days
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} /> Available
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }} /> Forecast
                </span>
              </div>
            </div>

            {/* SVG Area Chart */}
            <div style={{ position: 'relative', width: '100%', height: '180px', marginTop: '10px' }}>
              <svg width="100%" height="180" viewBox="0 0 500 180" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="vacancyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Area Fill */}
                <polygon
                  fill="url(#vacancyGrad)"
                  points="0,140 30,120 60,135 90,90 120,110 150,60 180,85 210,40 240,65 270,95 300,75 330,110 360,125 390,120 420,145 450,150 480,130 500,140 500,180 0,180"
                />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="0,140 30,120 60,135 90,90 120,110 150,60 180,85 210,40 240,65 270,95 300,75 330,110 360,125 390,120 420,145 450,150 480,130 500,140"
                />

                {/* Peak Point Dot */}
                <circle cx="210" cy="40" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
              </svg>

              {/* Peak Vacancy Tag Overlay */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '39%',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#1d4ed8',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}
              >
                Peak Vacancy
              </div>

              {/* X Axis Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginTop: '8px' }}>
                <span>Oct 01</span>
                <span>Oct 08</span>
                <span>Oct 15</span>
                <span>Oct 22</span>
                <span>Oct 31</span>
              </div>
            </div>
          </div>

          {/* Inventory Reconciliation Table Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Inventory Reconciliation
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                Opening vs. Closing vacancy breakdown by hostel wing
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      WING / ZONE
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      OPENING (00:00)
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      CHECK-INS
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      CHECK-OUTS
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      CLOSING (23:59)
                    </th>
                    <th style={{ padding: '10px 14px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'right' }}>
                      VARIANCE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '14px', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                        {row.wing}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 700, fontSize: '0.88rem', color: '#334155' }}>
                        {row.opening}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, fontSize: '0.88rem', color: '#ef4444' }}>
                        {row.checkIns}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, fontSize: '0.88rem', color: '#10b981' }}>
                        +{row.checkOuts}
                      </td>
                      <td style={{ padding: '14px', fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                        {row.closing}
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <span
                          style={{
                            background: row.isPositive ? '#d1fae5' : '#fef2f2',
                            color: row.isPositive ? '#047857' : '#ef4444',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}
                        >
                          {row.variance}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Recent Status Changes Feed Card */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '20px' }}>
              RECENT STATUS CHANGES
            </div>

            {/* Timeline Feed */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {statusChanges.map((sc) => (
                <div key={sc.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: sc.bg,
                      color: sc.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}
                  >
                    {sc.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>
                      {sc.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '2px', lineHeight: 1.35 }}>
                      {sc.detail}
                    </div>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>
                      {sc.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View Full Audit Trail Button */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button
                style={{
                  width: '100%',
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  color: '#2563eb',
                  padding: '10px',
                  borderRadius: '12px',
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                View Full Audit Trail
              </button>
            </div>
          </div>

          {/* Room Type Split Banner Card */}
          <div
            style={{
              background: 'linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)',
              borderRadius: '20px',
              padding: '24px',
              color: '#ffffff',
              boxShadow: '0 8px 20px rgba(29, 78, 216, 0.2)'
            }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 4px 0' }}>
              Room Type Split
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.8)', fontWeight: 600, marginBottom: '20px' }}>
              Current available inventory distribution
            </div>

            {/* Distribution Progress Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>
                  <span>STANDARD SHARED</span>
                  <span>65%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: '#10b981', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>
                  <span>EXECUTIVE SUITES</span>
                  <span>22%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '22%', height: '100%', background: '#38bdf8', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '6px' }}>
                  <span>SINGLE STUDIO</span>
                  <span>13%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '13%', height: '100%', background: '#a7f3d0', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
