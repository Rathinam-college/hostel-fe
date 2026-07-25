import React from 'react';

export default function InstitutesGrid({ institutesList, onEdit, onDelete }) {
  return (
    <div className="card table-container fade-in">
      <table className="data-table">
        <thead>
          <tr>
            <th>Institute Code</th>
            <th>Institute Name</th>
            <th>Course Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {institutesList.length === 0 ? (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No institutes registered.</td></tr>
          ) : (
            institutesList.map(i => (
              <tr key={i.id}>
                <td><strong>{i.code}</strong></td>
                <td>{i.name}</td>
                <td><span className="badge badge-info">{i.course_type}</span></td>
                <td>
                  <button onClick={() => onEdit(i)} className="btn-action btn-edit"><i className="fa-solid fa-pen"></i></button>
                  <button onClick={() => onDelete(i.id)} className="btn-action btn-delete"><i className="fa-solid fa-trash"></i></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
