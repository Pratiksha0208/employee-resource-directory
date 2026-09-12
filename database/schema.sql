CREATE DATABASE IF NOT EXISTS employee_directory;

USE employee_directory;

CREATE TABLE IF NOT EXISTS employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    manager_id INT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_manager
        FOREIGN KEY (manager_id)
        REFERENCES employees(id)
        ON DELETE SET NULL
);

INSERT INTO employees
(name, email, department, role, manager_id, status)
VALUES
('Amit Sharma', 'amit@company.com', 'Engineering', 'Manager', NULL, 'active'),
('Priya Patil', 'priya@company.com', 'Engineering', 'Employee', 1, 'active'),
('Rahul Desai', 'rahul@company.com', 'Sales', 'Manager', NULL, 'active'),
('Sneha Joshi', 'sneha@company.com', 'Sales', 'Employee', 3, 'active'),
('Neha Kulkarni', 'neha@company.com', 'HR', 'Employee', NULL, 'active');