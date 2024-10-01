const request = require("supertest");
const { app, server } = require('../dist/index');
const path = require('path');
const { sampleUserId, authToken, challengeId, submissionId, correctSubmissionId } = require('./constants');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe("Submissions Controller", () => {

    describe("submitAnswer", () => {
        it("should return 200 and the 'correct' response", async () => {

            const response = await request(app)
                .post("/submitAnswer")
                .set("Authorization", authToken)
                .field("userId", sampleUserId)
                .field("challengeId", challengeId)
                .attach("file", path.join(__dirname, "test_files", "lfi.py"));

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Submission Finished");
            expect(response.body.data).toHaveProperty("submission_id");
            expect(response.body.data.passed_test_case_value).toBe(1023);
        }, 60000);

        it("should return 200 and the 'incorrect' response", async () => {

            const response = await request(app)
                .post("/submitAnswer")
                .set("Authorization", authToken)
                .field("userId", sampleUserId)
                .field("challengeId", challengeId)
                .attach("file", path.join(__dirname, "test_files", "lfi_fail.py"));

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe("Submission Finished");
            expect(response.body.data).toHaveProperty("submission_id");
            expect(response.body.data.passed_test_case_value).not.toBe(1023);
        }, 60000);

        it("should return error if no file is uploaded", async () => {
            const response = await request(app)
                .post("/submitAnswer")
                .set("Authorization", authToken)
                .field("userId", sampleUserId)
                .field("challengeId", challengeId || "");


            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain("No file uploaded");
        });

        it("should return error if the file is invalid (incorrect extension)", async () => {
            const response = await request(app)
                .post("/submitAnswer")
                .set("Authorization", authToken)
                .field("userId", sampleUserId)
                .field("challengeId", challengeId || "")
                .attach("file", path.join(__dirname, "test_files", "sample.txt"));

            console.log(response.body);
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });


        it("should return error if the token is invalid", async () => {
            const invalidToken = "Bearer gho_fakedataaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

            const response = await request(app)
                .post("/submitAnswer")
                .set("Authorization", invalidToken)
                .field("userId", sampleUserId)
                .field("challengeId", challengeId)
                .attach("file", path.join(__dirname, "test_files", "lfi.py"));

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });

        it("should return error if the Challenge id not exist", async () => {
            const challengeId = "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa";

            const response = await request(app)
                .post("/submitAnswer")
                .set("Authorization", authToken)
                .field("userId", sampleUserId)
                .field("challengeId", challengeId)
                .attach("file", path.join(__dirname, "test_files", "lfi.py"));

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });

    describe("getSubmissionLog", () => {
        it("should return 200 and the submission log data", async () => {
            const response = await request(app)
                .get(`/getSubmissionLog/${submissionId}`)
                .set("Authorization", authToken);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.message).toEqual("Submission log fetched successfully");
            expect(response.body.data).toContain("TypeError");
        });

        it("should return error if the submission don't have log (the submission is correct)", async () => {
            const response = await request(app)
                .get(`/getSubmissionLog/${correctSubmissionId}`)
                .set("Authorization", authToken);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("Failed to read log file");
        });

        it("should return error if the submission is not exist", async () => {
            const response = await request(app)
                .get(`/getSubmissionLog/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`)
                .set("Authorization", authToken);

            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
            expect(response.body.message).toEqual("Failed to fetch submission log");
        });
    });

});

const deleteRecentSubmissions = async () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const deleteResponse = await prisma.submission.deleteMany({
        where: {
            created_at: {
                gte: fiveMinutesAgo,
            },
        },
    });
};

afterAll((done) => {
    server.close(done);
    deleteRecentSubmissions();
});