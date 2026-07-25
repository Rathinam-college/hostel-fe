import React from 'react';

export default function SharingTypesGrid({ sharingTypesList, onEdit, onDelete }) {
  return (
    <div className="card table-container fade-in">
      <table className="data-table">
        <thead>
          <tr>
            <th>Sharing Config Name</th>
            <th>Beds Count</th>
            <th>Attached Bathroom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sharingTypesList.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No sharing configurations registered.</td></tr>
          ) : (
            sharingTypesList.map(s => (
              <tr key={s.id}>
                <td><strong>{s.label}</strong></td>
                <td>{s.bed_count} Beds</td>
                <td>{s.is_attached ? <span className="text-success"><i className="fa-solid fa-circle-check"></i> Yes</span> : <span className="text-danger"><i className="fa-solid fa-circle-xmark"></i> No</span>}</td>
                <td>
                  <button onClick={() => onEdit(s)} className="btn-action btn-edit"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => onDelete(s.id)} className="btn-action btn-delete"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
