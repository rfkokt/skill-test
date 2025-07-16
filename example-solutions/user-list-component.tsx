function UserList({ users }) {
  if (!users || users.length === 0) {
    return (
      <div className="user-list">
        <p className="no-users">No users found</p>
      </div>
    )
  }

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <span className={user.isActive ? "status active" : "status inactive"}>
            {user.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ))}
    </div>
  )
}
