import React, { useState } from 'react';
import VacancyAuditReportPage from './VacancyAuditReportPage';
import DailyHeadcountReportPage from './DailyHeadcountReportPage';
import MonthlyOccupancyReportPage from './MonthlyOccupancyReportPage';

export default function ReportsPage({ initialTab, onSelectReport }) {
  const [activeReportTab, setActiveReportTab] = useState(initialTab || 'opening-closing');

  const handleTabSelect = (tabId) => {
    setActiveReportTab(tabId);
    if (onSelectReport) {
      onSelectReport(tabId);
    }
  };

  return (
    <div className="fade-in">
      {/* Top Report Hub Switcher Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
        marginBottom: '28px',
        background: '#FFFFFF',
        padding: '12px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
      }}>
        <button
          onClick={() => handleTabSelect('opening-closing')}
          className={`btn ${activeReportTab === 'opening-closing' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>🚪</span>
          <span>Opening & Closing Vacancy Audit</span>
        </button>

        <button
          onClick={() => handleTabSelect('daily')}
          className={`btn ${activeReportTab === 'daily' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>📅</span>
          <span>Daily Headcount & Check-Ins</span>
        </button>

        <button
          onClick={() => handleTabSelect('monthly')}
          className={`btn ${activeReportTab === 'monthly' ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '0.92rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            gap: '10px'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>📊</span>
          <span>Monthly Occupancy Report</span>
        </button>
      </div>

      {/* Render Selected Dedicated Report Page */}
      {activeReportTab === 'opening-closing' && <VacancyAuditReportPage />}
      {activeReportTab === 'daily' && <DailyHeadcountReportPage />}
      {activeReportTab === 'monthly' && <MonthlyOccupancyReportPage />}
    </div>
  );
}
