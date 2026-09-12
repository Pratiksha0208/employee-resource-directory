import { useState } from "react";

const getInitialFormData = (employee) => ({
  name: employee?.name || "",
  email: employee?.email || "",
  department: employee?.department || "",
  role: employee?.role || "",
  manager_id: employee?.manager_id || "",
  status: employee?.status || "active",
});

const EmployeeForm = ({
  employee,
  employees,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(employee)
  );

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.department.trim() ||
      !formData.role.trim()
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const data = {
      ...formData,
      manager_id: formData.manager_id
        ? Number(formData.manager_id)
        : null,
    };

    onSubmit(data);
  };

  return (
    <div className="form-card">
      <h2>{employee ? "Edit Employee" : "Add Employee"}</h2>

      {error && <p className="form-error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name *</label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter employee name"
          />
        </div>

        <div className="form-group">
          <label>Email *</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div className="form-group">
          <label>Department *</label>

          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="Engineering, HR, Sales..."
          />
        </div>

        <div className="form-group">
          <label>Role *</label>

          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Developer, Manager..."
          />
        </div>

        <div className="form-group">
          <label>Reporting Manager</label>

          <select
            name="manager_id"
            value={formData.manager_id}
            onChange={handleChange}
          >
            <option value="">No Manager</option>

            {employees
              .filter((item) => item.id !== employee?.id)
              .map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-button">
            {employee ? "Update Employee" : "Add Employee"}
          </button>

          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;