import { describe, test, expect } from "@jest/globals";
import { render, screen } from "@testing-library/react";
import EmployeeTable from "../components/EmployeeTable";

describe("EmployeeTable", () => {
  test("renders employee information correctly", () => {
    const employees = [
      {
        id: 1,
        name: "Amit Sharma",
        email: "amit@company.com",
        department: "Engineering",
        role: "Manager",
        manager_id: null,
        manager_name: null,
        status: "active",
      },
    ];

    render(
      <EmployeeTable
        employees={employees}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    );

    expect(screen.getByText("Amit Sharma")).toBeInTheDocument();
    expect(screen.getByText("Engineering")).toBeInTheDocument();
    expect(screen.getAllByText("Manager").length).toBeGreaterThan(0);;
    expect(screen.getByText("active")).toBeInTheDocument();
  });
});