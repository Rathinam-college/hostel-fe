import React, { useState, useEffect } from 'react';

export default function MonthlyOccupancyReportPage() {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('Oct 2023 - Mar 2024');

  useEffect(() => {
    fetchMonthlyReports();
  }, []);

  const fetchMonthlyReports = () => {
    setLoading(true);
    fetch('/api/reports/monthly')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setMonthlyData(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handlePrint = () => {
    window.print();
  };

  // Donut block utilization items
  const blockUtilizationItems = [
    { name: 'Boys Block A', beds: '412 / 450 Beds', pct: 92, strokeColor: '#2563eb' },
    { name: 'Girls Block C', beds: '340 / 400 Beds', pct: 85, strokeColor: '#059669' },
    { name: 'Lakeside Annex', beds: '190 / 250 Beds', pct: 76, strokeColor: '#92400e' }
  ];

  // Detailed occupancy breakdown rows
  const breakdownRows = [
    { initial: 'A', name: 'Boys Block A', total: 450, occupied: 412, vacancy: 38, pct: 92, avatarBg: '#dbeafe', avatarColor: '#1e40af', barColor: '#2563eb' },
    { initial: 'C', name: 'Girls Block C', total: 400, occupied: 340, vacancy: 60, pct: 85, avatarBg: '#d1fae5', avatarColor: '#047857', barColor: '#059669' },
    { initial: 'L', name: 'Lakeside Annex', total: 250, occupied: 190, vacancy: 60, pct: 76, avatarBg: '#fef3c7', avatarColor: '#b45309', barColor: '#92400e' }
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%', padding: '4px' }}>
      
      {/* 1. Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Occupancy & Utilization
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', margin: 0, maxWidth: '680px' }}>
            Real-time occupancy metrics and historical trend analysis across all hostel blocks.
          </p>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Date Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{
              padding: '11px 18px',
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
            <option value="Oct 2023 - Mar 2024">📅 Oct 2023 &ndash; Mar 2024</option>
            <option value="Apr 2024 - Sep 2024">📅 Apr 2024 &ndash; Sep 2024</option>
          </select>

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
              transition: 'all 0.2s ease'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Summary Cards (4 Cards Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Card 1: OVERALL OCCUPANCY */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              OVERALL OCCUPANCY
            </span>
            <span style={{ background: '#d1fae5', color: '#047857', padding: '4px 8px', borderRadius: '12px', fontSize: '0.72rem', fontWeight: 800 }}>
              ↗ +2.4%
            </span>
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
            86.4<span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#64748b', marginLeft: '2px' }}>%</span>
          </div>
        </div>

        {/* Card 2: TOTAL RESIDENTS */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              TOTAL RESIDENTS
            </span>
            <span style={{ fontSize: '1.2rem', opacity: 0.2 }}>👥</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>1,228</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>students</span>
          </div>
        </div>

        {/* Card 3: PEAK OCCUPANCY */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              PEAK OCCUPANCY
            </span>
            <span style={{ fontSize: '1.2rem', opacity: 0.2 }}>🔥</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>94.2</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>% in Sep</span>
          </div>
        </div>

        {/* Card 4: AVG STAY DURATION */}
        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              AVG STAY DURATION
            </span>
            <span style={{ fontSize: '1.2rem', opacity: 0.2 }}>⏱️</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>184</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b' }}>days</span>
          </div>
        </div>

      </div>

      {/* 3. Middle Section Split Layout (Left: Chart | Right: Donut Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.1fr)', gap: '24px', alignItems: 'start' }}>
        
        {/* Monthly Occupancy Trends Chart Card */}
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
              Monthly Occupancy Trends
            </h2>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2563eb' }} /> Current Year
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#cbd5e1' }} /> Previous Year
              </span>
            </div>
          </div>

          {/* SVG Area Chart with Y Axis */}
          <div style={{ display: 'flex', gap: '12px', height: '220px', marginTop: '10px' }}>
            {/* Y Axis Labels */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, paddingBottom: '20px' }}>
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
            </div>

            {/* SVG Plot */}
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <svg width="100%" height="190" viewBox="0 0 500 190" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="occupancyTrendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="500" y2="40" stroke="#f1f5f9" strokeDasharray="4" />
                <line x1="0" y1="90" x2="500" y2="90" stroke="#f1f5f9" strokeDasharray="4" />
                <line x1="0" y1="140" x2="500" y2="140" stroke="#f1f5f9" strokeDasharray="4" />

                {/* Filled Smooth Area */}
                <path
                  fill="url(#occupancyTrendGrad)"
                  d="M0,130 Q80,80 160,70 T320,40 T500,70 L500,190 L0,190 Z"
                />

                {/* Smooth Curve Line */}
                <path
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="3"
                  d="M0,130 Q80,80 160,70 T320,40 T500,70"
                />

                {/* Data Points */}
                <circle cx="160" cy="70" r="5" fill="#0f172a" />
                <circle cx="320" cy="40" r="5" fill="#0f172a" />
              </svg>

              {/* X Axis Labels */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700 }}>
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Block Utilization Cards */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Block Utilization
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {blockUtilizationItems.map((item, idx) => {
              const radius = 26;
              const circumference = 2 * Math.PI * radius;
              const offset = circumference - (circumference * item.pct) / 100;

              return (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* SVG Donut */}
                  <div style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0 }}>
                    <svg width="64" height="64" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="6" />
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        fill="none"
                        stroke={item.strokeColor}
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 800, color: '#0f172a' }}>
                      {item.pct}%
                    </div>
                  </div>

                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                      {item.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
                      {item.beds}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* 4. Bottom Full-Width Section: Detailed Occupancy Breakdown Table */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px 0' }}>
          Detailed Occupancy Breakdown
        </h2>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#eff6ff', borderRadius: '12px' }}>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                  BLOCK NAME
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  TOTAL CAPACITY
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  OCCUPIED BEDS
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  VACANCY
                </th>
                <th style={{ padding: '12px 16px', fontSize: '0.72rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>
                  UTILIZATION %
                </th>
              </tr>
            </thead>
            <tbody>
              {breakdownRows.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  
                  {/* Block Name with Circle Badge */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: row.avatarBg,
                          color: row.avatarColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem'
                        }}
                      >
                        {row.initial}
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#0f172a' }}>
                        {row.name}
                      </span>
                    </div>
                  </td>

                  {/* Total Capacity */}
                  <td style={{ padding: '16px', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
                    {row.total}
                  </td>

                  {/* Occupied Beds */}
                  <td style={{ padding: '16px', fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                    {row.occupied}
                  </td>

                  {/* Vacancy */}
                  <td style={{ padding: '16px', fontWeight: 800, fontSize: '0.9rem', color: '#d97706' }}>
                    {row.vacancy}
                  </td>

                  {/* Utilization % Bar */}
                  <td style={{ padding: '16px', width: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.84rem', color: '#0f172a', minWidth: '32px' }}>
                        {row.pct}%
                      </span>
                      <div style={{ flex: 1, height: '6px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${row.pct}%`, height: '100%', background: row.barColor, borderRadius: '4px' }} />
                      </div>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
