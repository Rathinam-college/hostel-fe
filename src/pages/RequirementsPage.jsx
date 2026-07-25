import React, { useState, useEffect } from 'react';

export default function RequirementsPage({ institutes, sharingTypes }) {
  const [reqs, setReqs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/requirements')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setReqs(data.data || []);
        }
      });
  }, []);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Institutional Requirements Forecast</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Compare demand forecast requirements against available vacant beds (`vw_requirement_gap`)</p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>Requirements Deficit / Surplus Gap Analysis</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>Req ID</th>
              <th>Institute Code</th>
              <th>Gender</th>
              <th>Sharing Type</th>
              <th>Academic Year</th>
              <th>Required Beds</th>
              <th>Available Vacant Beds</th>
              <th>Deficit / Surplus</th>
            </tr>
          </thead>
          <tbody>
            {reqs && reqs.length > 0 ? (
              reqs.map((r) => (
                <tr key={r.id}>
                  <td style={{ fontWeight: 700 }}>#{r.id}</td>
                  <td><code>{r.institute_code}</code></td>
                  <td>{r.gender}</td>
                  <td><span className="badge badge-indigo">{r.sharing_type}</span></td>
                  <td>{r.academic_year}</td>
                  <td style={{ fontWeight: 700 }}>{r.required_beds} beds</td>
                  <td style={{ color: 'var(--success)', fontWeight: 700 }}>{r.available_now} beds</td>
                  <td>
                    <span className={`badge ${r.difference >= 0 ? 'badge-success' : 'badge-danger'}`}>
                      {r.difference >= 0 ? `+${r.difference} Surplus` : `${r.difference} Shortage`}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                  No requirement forecasts entered yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
