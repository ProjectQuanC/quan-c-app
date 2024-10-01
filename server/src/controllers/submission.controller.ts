import express from "express";
import CustomError from '../utils/error.utils';
import { JsonResponse } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { readFile } from 'fs/promises';
import { getPassedTestCaseList, delay } from "../utils/misc.utils";
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export const submitAnswer = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const userId = body.userId;
    const challengeId = body.challengeId;
    const submissionId = uuidv4();
    const file = req.file;
    const challengeData = await prisma.Challenge.findFirst({
        where: {
            challenge_id: challengeId,
        },
    });

    if (!file) {
        throw new CustomError('No file uploaded');
    }

    const fileContent = file.buffer.toString('utf-8');

    const totalTestCase = challengeData.total_test_case;


    // try {'utf8');
    const submitFile = new File([fileContent], file.originalname, { type: file.mimetype });
    let formData = new FormData();
    try {

        formData.append('challenge_id', challengeId || "");
        formData.append('user_id', userId || "");
        formData.append('test_case_total', totalTestCase || 10);
        formData.append('id', submissionId || "");
        formData.append('file', submitFile);
    }
    catch (err) {
        throw new CustomError('Failed to create form data');
    }


    const response = await axios.post(
        `http://127.0.0.1:${8080}/create-submission`,
        formData,
        {
            headers: { 'Content-Type': 'multipart/form-data' },
        }
    );

    console.log(response.data)

    if (response.status != 200) {
        throw new CustomError('Failed to submit answer');
    }


    for (let i = 0; i < 20; i++) {
        const submissionData = await prisma.Submission.findFirst({
            where: {
                submission_id: submissionId,
            },
        });


        if (submissionData) {
            const challengeData = await prisma.Challenge.findFirst({
                where: {
                    challenge_id: submissionData.challenge_id,
                },
            });

            if (!challengeData) {
                throw new CustomError('Data not found');
            }

            const challenge_test_case: number = challengeData.total_test_case;
            const passed_test_case_list = getPassedTestCaseList(challenge_test_case, submissionData.passed_test_case_value);
            submissionData.passed_test_case = passed_test_case_list;
            const jsonResponse: JsonResponse = {
                success: true,
                message: 'Submission Finished',
                data: submissionData,
            };
            return res.json(jsonResponse);
        }
        await delay(5 * 1000);
    }

    return res.status(200).json({ message: 'Data not found' });
}

export const getSubmissionLog = async (req: express.Request, res: express.Response) => {
    const { submissionId } = req.params;
    let logPath: string;
    let log: string;
    try {
        const submission = await prisma.Submission.findFirst({
            where: {
                submission_id: submissionId,
            },
        });

        if (!submission) {
            throw new CustomError('Submission not found');
        }
        const path_hash = submission.log_file_path;
        logPath = `../quan-c-runner/logs/${path_hash}`;
    }
    catch (err) {
        throw new CustomError('Failed to fetch submission log');
    }

    try {
        log = await readFile(logPath, 'utf-8');
    }
    catch (err) {
        throw new CustomError('Failed to read log file');
    }

    if (!log) {
        throw new CustomError('Failed to read log file');
    }

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'Submission log fetched successfully',
        data: log,
    };

    return res.json(jsonResponse);
}