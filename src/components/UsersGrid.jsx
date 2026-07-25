import React from 'react';

export default function UsersGrid({ usersList, currentUser, onEdit, onDelete }) {
  return (
    <div className="card table-container fade-in">
      <table className="data-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>System Role</th>
            <th>Scoped Hostel</th>
            <th>Account Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {usersList.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center' }}>No users registered.</td></tr>
          ) : (
            usersList.map(u => (
              <tr key={u.id}>
                <td><strong>{u.username}</strong></td>
                <td>{u.full_name}</td>
                <td><span className={`status-badge ${u.role === 'admin' ? 'status-active' : 'status-inactive'}`}>{u.role}</span></td>
                <td>{u.hostel_name}</td>
                <td><i className={`fa-solid fa-circle ${u.is_active ? 'text-success' : 'text-danger'}`}></i> {u.is_active ? 'Active' : 'Inactive'}</td>
                <td>
                  <button onClick={() => onEdit(u)} className="btn-action btn-edit"><i className="fa-solid fa-pen"></i></button>
                  {currentUser.role === 'admin' && (
                    <button onClick={() => onDelete(u.id)} className="btn-action btn-delete"><i className="fa-solid fa-trash"></i></button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
