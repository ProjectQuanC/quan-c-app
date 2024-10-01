const request = require("supertest");
const { app, server } = require('../dist/index');
const path = require('path');


describe("API Root Endpoint", () => {
  it("should return 200 and 'QuanC API Ready!' message", async () => {
    const response = await request(app)
      .get("/api/v1/"); // Route to test

    expect(response.status).toBe(200);
    expect(response.text).toBe("QuanC API Ready!"); // Expected response
  });
});

afterAll((done) => {
  server.close(done); // Close the server after all tests
});