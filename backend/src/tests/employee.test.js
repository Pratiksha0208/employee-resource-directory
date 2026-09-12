const request = require("supertest");
const app = require("../../server");
const db = require("../../db");

describe("Employee API", () => {
  test("GET /api/employees should return employees", async () => {
    const response = await request(app).get("/api/employees");

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test("POST /api/employees should reject missing required fields", async () => {
    const response = await request(app)
      .post("/api/employees")
      .send({
        name: "Test Employee",
      });

    expect(response.statusCode).toBe(400);
  });

  afterAll(async () => {
    await db.end();
  });
});