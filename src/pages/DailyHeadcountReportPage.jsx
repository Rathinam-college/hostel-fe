import React, { useState, useEffect } from 'react';

export default function DailyHeadcountReportPage() {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7days'); // '7days', 'all'

  useEffect(() => {
    fetchDailyReports();
  }, []);

  const fetchDailyReports = () => {
    setLoading(true);
    fetch('/api/reports/daily')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setDailyData(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const latestDay = dailyData[dailyData.length - 1] || { check_ins: 0, check_outs: 0, active_residents: 0 };
  const totalCheckInsPeriod = dailyData.reduce((acc, d) => acc + (d.check_ins || 0), 0);
  const totalCheckOutsPeriod = dailyData.reduce((acc, d) => acc + (d.check_outs || 0), 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fade-in">
      {/* Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem' }}>📅</span>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Daily Headcount & Check-Ins
            </h2>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Daily check-ins, check-outs & active resident headcount.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-secondary btn-sm" onClick={fetchDailyReports}>
            🔄 Refresh
          </button>
          <button className="btn btn-primary btn-sm" onClick={handlePrint}>
            🖨️ Export PDF
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Check-Ins Today</span>
            <div className="stat-icon icon-green">🚪</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>+{latestDay.check_ins}</div>
          <div className="stat-footer">New admissions logged</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Check-Outs Today</span>
            <div className="stat-icon icon-yellow">🚪</div>
          </div>
          <div className="stat-value" style={{ color: 'var(--danger)' }}>-{latestDay.check_outs}</div>
          <div className="stat-footer">Exits processed</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Current Active Headcount</span>
            <div className="stat-icon icon-blue">👥</div>
          </div>
          <div className="stat-value">{latestDay.active_residents}</div>
          <div className="stat-footer">Total active resident students</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-title">Net 7-Day Flow</span>
            <div className="stat-icon icon-purple">📊</div>
          </div>
          <div className="stat-value" style={{ color: totalCheckInsPeriod >= totalCheckOutsPeriod ? 'var(--success)' : 'var(--danger)' }}>
            {totalCheckInsPeriod - totalCheckOutsPeriod >= 0 ? `+${totalCheckInsPeriod - totalCheckOutsPeriod}` : totalCheckInsPeriod - totalCheckOutsPeriod}
          </div>
          <div className="stat-footer">Inflow vs outflow balance</div>
        </div>
      </div>

      {/* Table Card */}
      <div className="table-container">
        <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Daily Resident Flow Tracker Log</h3>
          <span className="badge badge-indigo">Live Connected System</span>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>New Check-Ins</th>
              <th>Check-Outs / Exits</th>
              <th>Active Headcount</th>
              <th>Net Day Delta</th>
              <th>Daily Flow Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px' }}>
                  Loading daily headcount log...
                </td>
              </tr>
            ) : dailyData && dailyData.length > 0 ? (
              dailyData.map((d, idx) => {
                const delta = d.check_ins - d.check_outs;
                return (
                  <tr key={idx}>
                    <td style={{ fontWeight: 800 }}>📅 {d.date_label}</td>
                    <td style={{ color: 'var(--success)', fontWeight: 800 }}>+{d.check_ins} Check-Ins</td>
                    <td style={{ color: 'var(--danger)', fontWeight: 800 }}>-{d.check_outs} Check-Outs</td>
                    <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{d.active_residents} Residents</td>
                    <td style={{ fontWeight: 800 }}>
                      <span className={`badge ${delta > 0 ? 'badge-success' : delta < 0 ? 'badge-danger' : 'badge-info'}`}>
                        {delta > 0 ? `+${delta} Inflow` : delta < 0 ? `${delta} Outflow` : '0 Net'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">Verified Logged</span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '32px' }}>
                  No daily headcount records logged yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
