# Employee Resource Directory

A full-stack Employee Resource Directory built using React, Node.js, Express, and MySQL.

## Features

- View all employees
- Add a new employee
- Edit employee details
- Delete employees
- Search employees by name
- Filter employees by department
- Assign a reporting manager
- Active/inactive employee status
- REST API using Express
- MySQL database with self-referencing manager relationship
- Backend API testing using Jest and Supertest
- Frontend component testing using Jest and React Testing Library

## Project Structure

```text
employee-resource-directory/
├── frontend/
├── backend/
├── database/
│   └── schema.sql
└── README.md

## Bonus Features


### Pagination

Employee records are paginated to improve usability when the directory contains a large number of employees.

- Displays 5 employees per page
- Previous and Next navigation
- Shows the current page and total number of pages
- Pagination works together with name search and department filtering

Example API request:

```text
GET /api/employees?page=1&limit=5
