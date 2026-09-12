import { useCallback, useEffect, useState } from "react";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "./services/employeeService";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getEmployees({
        search,
        department,
        page: currentPage,
        limit: 5,
      });

      setEmployees(data.employees);
      setTotalPages(data.pagination.totalPages);
    } catch {
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  }, [search, department, currentPage]);

  useEffect(() => {
  // Fetch employees whenever the search, department, or page changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadEmployees();
}, [loadEmployees]);

  const handleSubmit = async (data) => {
    try {
      setError("");

      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, data);
      } else {
        await createEmployee(data);
      }

      setShowForm(false);
      setEditingEmployee(null);

      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save employee."
      );
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteEmployee(id);

      await loadEmployees();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to delete employee."
      );
    }
  };

  const departments = [
    ...new Set(
      employees.map((employee) => employee.department)
    ),
  ];

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Employee Resource Directory</h1>
          <p>Manage employees and reporting relationships</p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setEditingEmployee(null);
            setShowForm(true);
          }}
        >
          + Add Employee
        </button>
      </header>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by employee name..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setCurrentPage(1);
          }}
        />

        <select
          value={department}
          onChange={(event) => {
            setDepartment(event.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">All Departments</option>

          {departments.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <EmployeeForm
          key={editingEmployee?.id || "new"}
          employee={editingEmployee}
          employees={employees}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingEmployee(null);
          }}
        />
      )}

      {loading ? (
        <div className="loading">
          Loading employees...
        </div>
      ) : (
        <>
          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <div className="pagination">
            <button
              className="secondary-button"
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span>
              Page {currentPage} of {totalPages}
            </span>

            <button
              className="secondary-button"
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;