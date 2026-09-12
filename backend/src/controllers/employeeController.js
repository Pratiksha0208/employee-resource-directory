    const db = require("../../db");

// GET 
const getEmployees = async (req, res, next) => {
  try {
    const { search, department } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 5, 1);
    const offset = (page - 1) * limit;

    let whereQuery = " WHERE 1 = 1";
    const values = [];

    if (search) {
      whereQuery += " AND e.name LIKE ?";
      values.push(`%${search}%`);
    }

    if (department) {
      whereQuery += " AND e.department = ?";
      values.push(department);
    }

    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM employees e${whereQuery}`,
      values
    );

    const total = countRows[0].total;

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
      ${whereQuery}
      ORDER BY e.id ASC
      LIMIT ? OFFSET ?
      `,
      [...values, limit, offset]
    );

    res.status(200).json({
      employees,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET 
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

// POST 
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

// PUT 
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

// DELETE 
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