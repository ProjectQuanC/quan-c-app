const request = require("supertest");
const { app, server } = require('../dist/index');
const { authToken, newUserGithubId, existingUserGithubId, loginCode } = require('./constants');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe("Users Controller", () => {
    describe("getAccessToken", () => {
        it("should return 200 and an access token when provided with a valid code", async () => {

            const response = await request(app)
                .get(`/getAccessToken?code=${loginCode}`);

            expect(response.body).toHaveProperty('access_token');
        });

        it("should handle errors from the GitHub API when the token is invalid (not a real token)", async () => {
            const response = await request(app)
                .get(`/getAccessToken?code=thisisaninvalidcode1`);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('bad_verification_code');
        });

        it("should handle errors from the GitHub API when the token is invalid (already being used)", async () => {
            const response = await request(app)
                .get(`/getAccessToken?code=${loginCode}`);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toBe('bad_verification_code');
        });
    });

    describe("getUserData", () => {
        it("should return user data with valid authorization", async () => {
            const response = await request(app)
                .get("/getUserData")
                .set("Authorization", authToken);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('id');
            expect(response.body.data).toHaveProperty('login');
            expect(response.body.data).toHaveProperty('app_data');
            expect(response.body.data.app_data).toHaveProperty('user_id');
            expect(response.body.data.app_data).toHaveProperty('role');
            expect(response.body.data.app_data).toHaveProperty('total_points');
            expect(response.body.data.app_data).toHaveProperty('submissions_history');
        });

        it("should return error when no authorization header (token) is provided", async () => {
            const response = await request(app)
                .get("/getUserData");

            expect(response.status).toBe(401);
            expect(response.text).toBe('Unauthorized');
        });

        it("should handle errors from the GitHub API when token is invalid", async () => {
            const failingAuthToken = "Bearer invalidtoken";
            const response = await request(app)
                .get("/getUserData")
                .set("Authorization", failingAuthToken);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });

    describe("addUserData", () => {
        it("should return 200 and success message when adding a new user", async () => {

            const response = await request(app)
                .post("/addUser")
                .send({ github_id: newUserGithubId });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User added successfully');
            expect(response.body.data).toHaveProperty('github_id', newUserGithubId);

            const user = await prisma.user.findFirst({
                where: { github_id: newUserGithubId },
            });
            expect(user).not.toBeNull();
            expect(user.github_id).toBe(newUserGithubId);
        });

        it("should return 200 and a message if the user already exists", async () => {
            const response = await request(app)
                .post("/addUser")
                .send({ github_id: existingUserGithubId });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('User already exists');
        });

        it("should return error if GitHub ID is not provided", async () => {
            const response = await request(app)
                .post("/addUser")
                .send({});

            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Github ID is required');
        });
    });
});

const deleteNewUser = async () => {
    const user = await prisma.user.findFirst({
        where: { github_id: newUserGithubId },
    });
    await prisma.user.delete({
        where: {
            user_id: user.user_id
        }
    })
}

afterAll((done) => {
    server.close(done);
    deleteNewUser();
});