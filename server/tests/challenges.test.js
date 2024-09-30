const request = require("supertest");
const { app, server } = require('../dist/index');
const path = require('path');
const { sampleUserId, authToken, authTokenUser } = require('./constants');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe("Challenges Controller", () => {

    describe("submitChallege", () => {
        it("should return 200 and success message when challenge is submitted successfully", async () => {
            const response = await request(app)
                .post("/submitChallenge")
                .set("Authorization", authToken)
                .attach("file", path.join(__dirname, "test_files", "LFI.zip"))
                .field("title", "Test_Sample")
                .field("link", "https://github.com/xhfmvls/PathGuard")
                .field("points", 10)
                .field("total_test_case", 10)
                .field("tags", ["tag1", "tag2"]);

            console.log(response.body);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toContain("Challenge submitted successfully");
        });

        it("should return error if any required fields are missing", async () => {
            const response = await request(app)
                .post("/submitChallenge")
                .set("Authorization", authToken)
                .attach("file", path.join(__dirname, "test_files", "LFI.zip"))
                .field("title", "Sample Challenge")
                .field("points", 10)
                .field("total_test_case", 5)
                .field("tags", ["tag1", "tag2"]);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("All fields are required");
        });

        it("should return error if file is not a zip", async () => {
            const response = await request(app)
                .post("/submitChallenge")
                .set("Authorization", authToken)
                .attach("file", path.join(__dirname, "test_files", "sample.txt"))
                .field("title", "Sample Challenge 2")
                .field("link", "https://github.com/xhfmvls/PathGuard")
                .field("points", 10)
                .field("total_test_case", 10)
                .field("tags", ["tag1", "tag2"]);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("Only zip files are allowed");
        });

        it("should return error if no file is uploaded", async () => {
            const response = await request(app)
                .post("/submitChallenge")
                .set("Authorization", authToken)
                .field("title", "Sample Challenge 3")
                .field("link", "https://github.com/xhfmvls/PathGuard")
                .field("points", 10)
                .field("total_test_case", 10)
                .field("tags", ["tag1", "tag2"]);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("No file uploaded");
        });

        it("should return error if the token is not admin token", async () => {
            const response = await request(app)
                .post("/submitChallenge")
                .set("Authorization", authTokenUser)
                .attach("file", path.join(__dirname, "test_files", "LFI.zip"))
                .field("title", "Sample Challenge 4")
                .field("link", "https://github.com/xhfmvls/PathGuard")
                .field("points", 10)
                .field("total_test_case", 10)
                .field("tags", ["tag1", "tag2"]);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("Unauthorized");
        });
    });

    describe("getChallenges", () => {
        it("should return 200 and the incomplete challenges", async () => {
            const response = await request(app)
                .post("/getChallenges") // Updated to match your route
                .set("Authorization", authToken)
                .send({
                    userId: sampleUserId,
                    filter: "incomplete",
                    page: 1,
                    search: "",
                    difficulty: "all",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty("data");
            expect(response.body.message).toEqual("Challenges fetched successfully");
        });

        it("should return 200 and the newly created challenge (submitChallege test)", async () => {
            const response = await request(app)
                .post("/getChallenges") // Updated to match your route
                .set("Authorization", authToken)
                .send({
                    userId: sampleUserId,
                    filter: "incomplete",
                    page: 1,
                    search: "Test_Sample",
                    difficulty: "all",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty("data");
            expect(response.body.message).toEqual("Challenges fetched successfully");
        });

        it("should return 200 and the completed medium challenges with 'sql' in the title", async () => {
            const response = await request(app)
                .post("/getChallenges")
                .set("Authorization", authToken)
                .send({
                    userId: sampleUserId,
                    filter: "completed",
                    page: 1,
                    search: "sql",
                    difficulty: "easy",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body).toHaveProperty("data");
            expect(response.body.message).toEqual("Challenges fetched successfully");
        });

        it("should return an empty list when there are no challenges matching the criteria", async () => {
            const response = await request(app)
                .post("/getChallenges")
                .set("Authorization", authToken)
                .send({
                    userId: sampleUserId,
                    filter: "completed",
                    page: 1,
                    search: "nonexistent",
                    difficulty: "easy",
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual([]);
            expect(response.body.message).toEqual("Challenges fetched successfully");
        });

        it("should return error if the token is invalid", async () => {
            const invalidToken = "Bearer gho_fakedataaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

            const response = await request(app)
                .post("/getChallenges")
                .set("Authorization", invalidToken)
                .send({
                    userId: sampleUserId,
                    filter: "completed",
                    page: 1,
                    search: "",
                    difficulty: "all",
                });

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });
});

const deleteTagAssigns = async (challengeId) => {
    const tagAssigns = await prisma.tagAssign.findMany({
        where: {
            challenge_id: challengeId
        }
    });

    for (const tagAssign of tagAssigns) {
        await prisma.tagAssign.delete({
            where: {
                tag_assign_id: tagAssign.tag_assign_id
            }
        });
    }
}

const deleteChallengesData = async () => {
    const challenge = await prisma.challenge.findFirst({
        where: {
            challenge_title: "Test_Sample"
        }
    });

    if (challenge) {
        const challengeId = challenge.challenge_id;

        await deleteTagAssigns(challengeId);

        await prisma.challenge.delete({
            where: {
                challenge_id: challengeId
            }
        });
    }
}

afterAll((done) => {
    server.close(done);
    deleteChallengesData();
});