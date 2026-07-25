import React from 'react';

export default function HostelsGrid({ hostelsList, onEdit, onDelete }) {
  return (
    <div className="card table-container fade-in">
      <table className="data-table">
        <thead>
          <tr>
            <th>Hostel Block Name</th>
            <th>Gender Allocation</th>
            <th>Warden In-Charge</th>
            <th>Warden Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {hostelsList.length === 0 ? (
            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hostels registered.</td></tr>
          ) : (
            hostelsList.map(h => (
              <tr key={h.id}>
                <td><strong>{h.name}</strong></td>
                <td>
                  <span className={`badge ${h.gender === 'Boys' ? 'badge-info' : 'badge-success'}`}>
                    {h.gender}
                  </span>
                </td>
                <td>{h.warden_name || '-'}</td>
                <td>{h.warden_phone || '-'}</td>
                <td>
                  <button onClick={() => onEdit(h)} className="btn-action btn-edit"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => onDelete(h.id)} className="btn-action btn-delete"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
