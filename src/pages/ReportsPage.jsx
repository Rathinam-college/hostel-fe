import React, { useState, useEffect } from 'react';

export default function ReportsPage() {
  const [activeReportTab, setActiveReportTab] = useState('opening-closing'); // 'monthly', 'daily', 'opening-closing'

  const [monthlyData, setMonthlyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [openingClosingData, setOpeningClosingData] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthlyReports();
    fetchDailyReports();
    fetchOpeningClosingReports();
  }, []);

  const fetchMonthlyReports = () => {
    fetch('/api/reports/monthly')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setMonthlyData(data.data || []);
      });
  };

  const fetchDailyReports = () => {
    fetch('/api/reports/daily')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') setDailyData(data.data || []);
      });
  };

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

  // Calculations for Opening & Closing report summary
  const totalBedsSum = openingClosingData.reduce((acc, h) => acc + (h.opening_total_beds || 0), 0);
  const occupiedBedsSum = openingClosingData.reduce((acc, h) => acc + (h.occupied_beds || 0), 0);
  const vacantBedsSum = openingClosingData.reduce((acc, h) => acc + (h.closing_vacant_beds || 0), 0);
  const overallOccupancyPct = totalBedsSum > 0 ? Math.round((occupiedBedsSum / totalBedsSum) * 100) : 0;

  return (
    <div className="fade-in">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Audit & Analytics Reports</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Live connected database reports: Monthly Occupancy, Daily Count & Opening/Closing Vacancy Audit
          </p>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            fetchMonthlyReports();
            fetchDailyReports();
            fetchOpeningClosingReports();
          }}
        >
          🔄 Refresh Live Data
        </button>
      </div>

      {/* Report Tab Switcher */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', background: '#FFFFFF', padding: '8px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
        <button
          onClick={() => setActiveReportTab('opening-closing')}
          className={`btn ${activeReportTab === 'opening-closing' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 800 }}
        >
          🚪 Opening & Closing Vacancy Audit
        </button>

        <button
          onClick={() => setActiveReportTab('daily')}
          className={`btn ${activeReportTab === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 800 }}
        >
          📅 Daily Headcount & Check-Ins
        </button>

        <button
          onClick={() => setActiveReportTab('monthly')}
          className={`btn ${activeReportTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', fontSize: '0.88rem', fontWeight: 800 }}
        >
          📊 Monthly Occupancy Report
        </button>
      </div>

      {/* TAB 1: OPENING & CLOSING VACANCY AUDIT REPORT */}
      {activeReportTab === 'opening-closing' && (
        <div>
          {/* Summary Cards */}
          <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-label">Opening Capacity</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>{totalBedsSum} beds</div>
              <div className="stat-desc">Total capacity across blocks</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Occupied</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>{occupiedBedsSum} beds</div>
              <div className="stat-desc">Checked-in residents</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Closing Vacancy Balance</div>
              <div className="stat-value" style={{ color: 'var(--warning)' }}>{vacantBedsSum} beds</div>
              <div className="stat-desc">Available beds remaining</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Overall Occupancy</div>
              <div className="stat-value">{overallOccupancyPct}%</div>
              <div className="stat-desc">Block utilization rate</div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <h3>Opening & Closing Vacancy Audit Table</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Hostel Block</th>
                  <th>Gender Allocation</th>
                  <th>Total Rooms</th>
                  <th>Opening Total Beds</th>
                  <th>Occupied Beds</th>
                  <th>Closing Vacant Balance</th>
                  <th>Occupancy Rate</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '24px' }}>Loading audit report from database...</td>
                  </tr>
                ) : openingClosingData && openingClosingData.length > 0 ? (
                  openingClosingData.map((h) => (
                    <tr key={h.hostel_id}>
                      <td><span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{h.hostel_name}</span></td>
                      <td>
                        <span className={`badge ${h.gender?.toLowerCase() === 'girls' ? 'badge-indigo' : 'badge-info'}`}>
                          {h.gender}
                        </span>
                      </td>
                      <td>{h.total_rooms} rooms</td>
                      <td style={{ fontWeight: 700 }}>{h.opening_total_beds} beds</td>
                      <td style={{ color: 'var(--success)', fontWeight: 700 }}>{h.occupied_beds} beds</td>
                      <td style={{ color: 'var(--warning)', fontWeight: 800 }}>{h.closing_vacant_beds} beds</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 800, minWidth: '36px' }}>{h.occupancy_rate}%</span>
                          <div style={{ flex: 1, height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                            <div
                              style={{
                                width: `${h.occupancy_rate}%`,
                                height: '100%',
                                background: h.occupancy_rate > 90 ? 'var(--danger)' : 'var(--primary)',
                                borderRadius: '4px'
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No hostel blocks recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DAILY HEADCOUNT & CHECK-INS REPORT */}
      {activeReportTab === 'daily' && (
        <div>
          {/* Summary Cards */}
          <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-label">Check-Ins Today</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>
                {dailyData[dailyData.length - 1]?.check_ins || 0}
              </div>
              <div className="stat-desc">New admissions logged</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Check-Outs Today</div>
              <div className="stat-value" style={{ color: 'var(--danger)' }}>
                {dailyData[dailyData.length - 1]?.check_outs || 0}
              </div>
              <div className="stat-desc">Exits processed</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Active Headcount</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>
                {dailyData[dailyData.length - 1]?.active_residents || 0}
              </div>
              <div className="stat-desc">Total active residents</div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <h3>Daily Headcount & Flow Tracker (Last 7 Days)</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check-Ins</th>
                  <th>Check-Outs</th>
                  <th>Active Resident Headcount</th>
                  <th>Flow Status</th>
                </tr>
              </thead>
              <tbody>
                {dailyData && dailyData.length > 0 ? (
                  dailyData.map((d, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800 }}>📅 {d.date_label}</td>
                      <td style={{ color: 'var(--success)', fontWeight: 800 }}>+{d.check_ins}</td>
                      <td style={{ color: 'var(--danger)', fontWeight: 800 }}>-{d.check_outs}</td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{d.active_residents} students</td>
                      <td>
                        <span className="badge badge-success">Normal Flow</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No daily records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MONTHLY OCCUPANCY REPORT */}
      {activeReportTab === 'monthly' && (
        <div>
          {/* Summary Cards */}
          <div className="grid-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div className="stat-card">
              <div className="stat-label">Current Month Student Total</div>
              <div className="stat-value" style={{ color: 'var(--primary)' }}>
                {monthlyData[monthlyData.length - 1]?.student_count || 0}
              </div>
              <div className="stat-desc">Enrolled student residents</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Staff Residents</div>
              <div className="stat-value" style={{ color: 'var(--info)' }}>
                {monthlyData[monthlyData.length - 1]?.staff_count || 0}
              </div>
              <div className="stat-desc">Warden & staff quarters</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Monthly Resident Count</div>
              <div className="stat-value" style={{ color: 'var(--success)' }}>
                {monthlyData[monthlyData.length - 1]?.total_count || 0}
              </div>
              <div className="stat-desc">Combined occupants</div>
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <div className="table-header">
              <h3>Monthly Occupancy History (Last 6 Months)</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Student Occupants</th>
                  <th>Staff Occupants</th>
                  <th>Total Monthly Residents</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {monthlyData && monthlyData.length > 0 ? (
                  monthlyData.map((m, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 800 }}>📊 {m.month_label}</td>
                      <td style={{ fontWeight: 700 }}>{m.student_count} students</td>
                      <td>{m.staff_count} staff</td>
                      <td style={{ fontWeight: 800, color: 'var(--primary)' }}>{m.total_count} residents</td>
                      <td>
                        <span className="badge badge-info">Verified</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                      No monthly records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
