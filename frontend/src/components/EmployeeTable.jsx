const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  const getManagerName = (employee) => {
    if (!employee.manager_id) {
      return "—";
    }

    return employee.manager_name || "—";
  };

  return (
    <div className="table-container">
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Role</th>
            <th>Manager</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                No employees found
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.role}</td>
                <td>{getManagerName(employee)}</td>

                <td>
                  <span className={`status ${employee.status}`}>
                    {employee.status}
                  </span>
                </td>

                <td className="actions">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(employee)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => onDelete(employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;