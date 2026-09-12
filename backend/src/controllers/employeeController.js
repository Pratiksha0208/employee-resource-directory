    const db = require("../../db");

// GET /api/employees
const getEmployees = async (req, res, next) => {
  try {
    const { search, department } = req.query;

    let query = `
      SELECT
        e.id,
        e.name,
        e.email,
        e.department,
        e.role,
        e.manager_id,
        m.name AS manager,
        e.status,
        e.created_at
      FROM employees e
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE 1 = 1
    `;

    const values = [];

    if (search) {
      query += " AND e.name LIKE ?";
      values.push(`%${search}%`);
    }

    if (department) {
      query += " AND e.department = ?";
      values.push(department);
    }

    query += " ORDER BY e.id ASC";

    const [employees] = await db.query(query, values);

    res.status(200).json(employees);
  } catch (error) {
    next(error);
  }
};

// GET /api/employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const [employees] = await db.query(
      `
      SELECT
        e.id,
        e.name,
        e.email,
        e.department,
        e.role,
        e.manager_id,
        m.name AS manager,
        e.status,
        e.created_at
      FROM employees e
      LEFT JOIN employees m ON e.manager_id = m.id
      WHERE e.id = ?
      `,
      [req.params.id]
    );

    if (employees.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    res.status(200).json(employees[0]);
  } catch (error) {
    next(error);
  }
};

// POST /api/employees
const createEmployee = async (req, res, next) => {
  try {
    const {
      name,
      email,
      department,
      role,
      manager_id,
      status,
    } = req.body;

    if (!name || !email || !department || !role) {
      return res.status(400).json({
        message: "Name, email, department and role are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    if (manager_id !== null && manager_id !== undefined) {
      const [manager] = await db.query(
        "SELECT id FROM employees WHERE id = ?",
        [manager_id]
      );

      if (manager.length === 0) {
        return res.status(400).json({
          message: "Manager does not exist",
        });
      }
    }

    const [result] = await db.query(
      `
      INSERT INTO employees
      (name, email, department, role, manager_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        name,
        email,
        department,
        role,
        manager_id || null,
        status || "active",
      ]
    );

    res.status(201).json({
      message: "Employee created successfully",
      id: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    next(error);
  }
};

// PUT /api/employees/:id
const updateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const {
      name,
      email,
      department,
      role,
      manager_id,
      status,
    } = req.body;

    if (!name || !email || !department || !role) {
      return res.status(400).json({
        message: "Name, email, department and role are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
      });
    }

    const [employee] = await db.query(
      "SELECT id FROM employees WHERE id = ?",
      [employeeId]
    );

    if (employee.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    if (manager_id !== null && manager_id !== undefined) {
      if (Number(manager_id) === Number(employeeId)) {
        return res.status(400).json({
          message: "Employee cannot be their own manager",
        });
      }

      const [manager] = await db.query(
        "SELECT id FROM employees WHERE id = ?",
        [manager_id]
      );

      if (manager.length === 0) {
        return res.status(400).json({
          message: "Manager does not exist",
        });
      }
    }

    await db.query(
      `
      UPDATE employees
      SET
        name = ?,
        email = ?,
        department = ?,
        role = ?,
        manager_id = ?,
        status = ?
      WHERE id = ?
      `,
      [
        name,
        email,
        department,
        role,
        manager_id || null,
        status || "active",
        employeeId,
      ]
    );

    res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    next(error);
  }
};

// DELETE /api/employees/:id
const deleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.id;

    const [employee] = await db.query(
      "SELECT id FROM employees WHERE id = ?",
      [employeeId]
    );

    if (employee.length === 0) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    await db.query(
      "DELETE FROM employees WHERE id = ?",
      [employeeId]
    );

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};