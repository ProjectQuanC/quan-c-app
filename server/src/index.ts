// src/index.ts
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';

import { authMiddleware, roleMiddleware } from './middlewares/auth.middleware';
import customErrorHandler from './middlewares/error.middleware';
import { addUserData, getAccessToken, getUserData } from './controllers/user.controller';
import { deleteChallenge, getChallengeDetails, getChallengeLeaderboard, getChallengeLeaderboardSummary, getChallenges, submitChallege, updateChallenge } from './controllers/challenge.controller';
import { getSubmissionLog, submitAnswer } from './controllers/submission.controller';

const { PrismaClient } = require('@prisma/client');
require('express-async-errors');

dotenv.config();
const app = express();
const port = 8000;
const storage = multer.memoryStorage();
const prisma = new PrismaClient();

app.use(cors());
app.use(bodyParser.json());

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 30,
    },
});

app.get('/api/v1/', (req, res) => {
    return res.send('QuanC API Ready!');
});

app.get('/getAccessToken', getAccessToken);

app.get('/getUserData', getUserData);

app.post('/addUser', addUserData);

app.post('/getChallengeLeaderboard', getChallengeLeaderboard)

app.get('/getChallengeLeaderboardSum/:challengeId', getChallengeLeaderboardSummary)

app.post('/submitChallenge', authMiddleware, roleMiddleware, upload.single('file'), submitChallege);

app.post('/submitAnswer', authMiddleware, upload.single('file'), submitAnswer);

app.get('/getSubmissionLog/:submissionId', getSubmissionLog);

app.post('/getChallenges', authMiddleware, getChallenges);

app.get('/getChallengeDetails/:challengeId', getChallengeDetails);

app.put('/updateChallenge', authMiddleware, roleMiddleware, updateChallenge);

app.delete('/deleteChallenge', authMiddleware, roleMiddleware, deleteChallenge)

// Runner

app.use(customErrorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

export { app, server };