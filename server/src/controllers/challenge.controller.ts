import express from "express";
import CustomError from '../utils/error.utils';
import { JsonResponse, Challenge, PaginationData, UserRank, Tag, Tagassign } from '../interfaces';
import { deleteChallengeFolder, insertTags, updateTags } from "../utils/misc.utils";
import { v4 as uuidv4 } from 'uuid';
import path, { dirname, join } from 'path';
import fs, { createWriteStream, mkdir, readFileSync } from 'fs';
import { extractZip, executeRunFileCommands } from "../utils/misc.utils";
import { getGithubDatabyId } from "../utils/user.utils";
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export const submitChallege = async (req: express.Request, res: express.Response) => {
    const title = req.body.title;
    const link = req.body.link;
    const points = parseInt(req.body.points);
    const total_test_cases = parseInt(req.body.total_test_case);
    let tags = req.body.tags;
    const file = req.file;
    let challenge

    if (!title || !link || !points || !total_test_cases || !tags) {
        throw new CustomError('All fields are required');
    }

    if (!Number.isInteger(points) || !Number.isInteger(total_test_cases)) {
        if (points <= 0 || total_test_cases <= 0) {
            throw new CustomError('Points and total test cases must be integers and greater than 0');
        }
    }

    if (!Array.isArray(tags) || tags[0] == "") {
        if (typeof tags === 'string') {
            tags = [tags]
        }
        else {
            throw new CustomError('Tags are required');
        }
    }

    if (!file) {
        throw new CustomError('No file uploaded');
    }

    const challengeId = uuidv4();

    if (file.originalname.split('.').pop() !== 'zip') {
        throw new CustomError('Only zip files are allowed');
    }

    const uploadPath = '../quan-c-runner/challenges/';

    const filePath = path.join(uploadPath, `${challengeId}.zip`);

    await fs.promises.writeFile(filePath, file.buffer);

    const unzipPath: string = join(uploadPath, `${path.basename(challengeId, '.zip')}`);

    try {
        await extractZip(filePath, unzipPath);
    } catch (err) {
        throw new CustomError('Failed to extract zip file');
    }

    const runFilePath = path.join(unzipPath, 'app', 'run.txt');
    await executeRunFileCommands(runFilePath);

    try {
        challenge = await prisma.Challenge.create({
            data: {
                challenge_id: challengeId,
                challenge_title: title,
                repo_link: link,
                points: points,
                total_test_case: total_test_cases,
            }
        });
    }
    catch (err) {
        throw new CustomError('Failed to create challenge');
    }

    insertTags(tags, challengeId);

    const jsonResponse: JsonResponse = {
        success: true,
        message: `Challenge submitted successfully on ${filePath}`,
    };

    return res.status(200).json(jsonResponse);
}

export const getChallengeLeaderboard = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const challengeId: string = body.challengeId;
    const userId: string = body.userId;

    const topTenLeaderboard = await prisma.submission.findMany({
        where: {
            challenge_id: challengeId,  // Filter by challenge ID
            status: true,               // Only correct submissions
        },
        distinct: ['user_id'],         // Ensure only the first correct submission per user is selected
        orderBy: {
            created_at: 'asc',           // Order by the submission time (earliest first)
        },
        take: 10,                      // Limit to top 10 users
        include: {
            User: {
                select: {
                    user_id: true,
                    github_id: true,
                },
            },
        },
    });

    const auth = req.get('Authorization');

    const leaderboard: UserRank[] = await Promise.all(
        topTenLeaderboard.map(async (submission: any, index: number) => ({
            rank: index + 1,
            user_id: submission.User.user_id,
            user_github_data: await getGithubDatabyId(submission.User.github_id, auth),
            is_current_user: submission.User.user_id === userId,
            first_submission_time: submission.created_at,
        }))
    );

    const userSubmission = await prisma.submission.findFirst({
        where: {
            user_id: userId,  // The user ID you're looking for
            challenge_id: challengeId,
            status: true,     // Only correct submissions
        },
        orderBy: {
            created_at: 'asc',  // Get their first correct submission
        },
    });

    if (!userSubmission) {
        const jsonResponse: JsonResponse = {
            success: true,
            message: 'User has not submitted a correct solution for this challenge',
        };

        return res.json(jsonResponse);
    }

    const userRankResult = await prisma.$queryRaw`SELECT COUNT(DISTINCT user_id) as 'COUNT' FROM submission WHERE challenge_id = ${challengeId} AND status = true AND created_at < ${userSubmission.created_at}`;

    const userRank = parseInt(userRankResult[0].COUNT);
    // const userRank = (userRankResult as { count: number }[])[0]?.count ?? 0;

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'Leaderboard fetched successfully',
        data: {
            userRank: userRank + 1,
            leaderboard: leaderboard,
        },
    };

    return res.json(jsonResponse);
}

export const getChallengeDetails = async (req: express.Request, res: express.Response) => {
    const { challengeId } = req.params;

    const challengeData = await prisma.challenge.findFirst({
        where: {
            challenge_id: challengeId,
        },
    });

    if (!challengeData) {
        throw new CustomError('Data not found');
    }

    const tags = await prisma.TagAssign.findMany({
        where: {
            challenge_id: challengeId,
        },
        include: {
            Tag: true,
        },
    });

    const tagList = tags.map((tag: Tagassign) => tag.Tag.tag_name.toLowerCase());

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'Challenge details fetched successfully',
        data: {
            challenge_id: challengeData.challenge_id,
            challenge_title: challengeData.challenge_title,
            repo_link: challengeData.repo_link,
            points: challengeData.points,
            total_test_case: challengeData.total_test_case,
            tags: tagList,
        },
    };

    return res.json(jsonResponse);
}

export const updateChallenge = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const challengeId: string = body.challengeId;
    const title = body.title;
    const link = body.link;
    const points = parseInt(body.points);
    const total_test_cases = parseInt(body.total_test_case);
    let tags = body.tags;

    if (!title || !link || !points || !total_test_cases || !tags) {
        throw new CustomError('All fields are required');
    }

    if (!Number.isInteger(points) || !Number.isInteger(total_test_cases)) {
        if (points <= 0 || total_test_cases <= 0) {
            throw new CustomError('Points and total test cases must be integers and greater than 0');
        }
    }

    if (!Array.isArray(tags) || tags[0] == "") {
        if (typeof tags === 'string') {
            tags = [tags]
        }
        else {
            throw new CustomError('Tags are required');
        }
    }

    updateTags(tags, challengeId);

    await prisma.challenge.update({
        where: {
            challenge_id: challengeId,
        },
        data: {
            challenge_title: title,
            repo_link: link,
            points: points,
            total_test_case: total_test_cases,
        },
    });

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'Challenge updated successfully'
    };

    return res.json(jsonResponse);
}

export const deleteChallenge = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const challengeId: string = body.challengeId;

    if (!challengeId) {
        throw new CustomError('Challenge ID is required');
    }

    const challenge = await prisma.challenge.findFirst({
        where: {
            challenge_id: challengeId,
        },
    });

    if (!challenge) {
        throw new CustomError('Challenge not found');
    }

    await prisma.submission.deleteMany({
        where: {
            challenge_id: challengeId,
        },
    });

    await prisma.tagAssign.deleteMany({
        where: {
            challenge_id: challengeId,
        },
    });

    await prisma.challenge.delete({
        where: {
            challenge_id: challengeId,
        },
    });

    try {
        deleteChallengeFolder(challengeId);
    }
    catch (err) {
        throw new CustomError('Failed to delete challenge folder');
    }

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'Challenge deleted successfully',
    };

    return res.json(jsonResponse);
}

export const getChallenges = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const page = body.page - 1 || 0;
    const limit = 10;
    const userId = body.userId;
    const filter = body.filter || "";
    const search = body.search || "";
    const lowerInput = search.toLowerCase();
    var gte, lte;
    const difficulty = body.difficulty || "all";
    if (difficulty == "easy") {
        gte = 0;
        lte = 15;
    }
    else if (difficulty == "medium") {
        gte = 16;
        lte = 25;
    }
    else if (difficulty == "hard") {
        gte = 26;
        lte = 50;
    }
    else {
        gte = 0;
        lte = 50;
    }

    if (filter === "completed") {
        const challengesWithSubmissionsForUser = await prisma.challenge.findMany({
            where: {
                AND: [
                    {
                        Submissions: {
                            some: {
                                AND: [
                                    { user_id: userId },
                                    { status: true },
                                ],
                            },
                        },
                    },
                    {
                        OR: [
                            {
                                Tagassign: {
                                    some: {
                                        Tag: {
                                            tag_name: {
                                                contains: lowerInput,
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                challenge_title: {
                                    contains: lowerInput,
                                },
                            },
                        ],
                    },
                    {
                        points: {
                            gte: gte,
                            lte: lte,
                        },
                    },
                ],
            },
            include: {
                Submissions: {
                    where: {
                        user_id: userId,
                        status: true,
                    },
                },
                Tagassign: {
                    include: {
                        Tag: true,
                    },
                },
            },
            skip: page * limit,
            take: limit,
            orderBy: [{ created_at: "desc" }],
        });

        const count = await prisma.challenge.count({
            where: {
                AND: [
                    {
                        Submissions: {
                            some: {
                                AND: [
                                    { user_id: userId },
                                    { status: true },
                                ],
                            },
                        },
                    },
                    {
                        OR: [
                            {
                                Tagassign: {
                                    some: {
                                        Tag: {
                                            tag_name: {
                                                contains: lowerInput,
                                            },
                                        },
                                    },
                                },
                            },
                            {
                                challenge_title: {
                                    contains: lowerInput,
                                },
                            },
                        ],
                    },
                    {
                        points: {
                            gte: gte,
                            lte: lte,
                        },
                    },
                ],
            },
        });

        const result = challengesWithSubmissionsForUser.map((challenge: Challenge) => ({
            challenge_id: challenge.challenge_id,
            challenge_title: challenge.challenge_title,
            repo_link: challenge.repo_link.substring(19),
            points: challenge.points,
            total_test_Case: challenge.total_test_case,
            tags: challenge.Tagassign.slice(0, 3).map((tagAssign) => ({ // Limit to first 3 tags
                tag_id: tagAssign.Tag.tag_id,
                tag_name: tagAssign.Tag.tag_name.toLowerCase(),
            })),
        }));

        const paginationData: PaginationData = {
            page: page + 1,
            limit: limit,
            total: count,
            totalPages: Math.ceil(count / limit),
        };

        const jsonResponse: JsonResponse = {
            success: true,
            message: 'Challenges fetched successfully',
            paginationData: paginationData,
            data: result,
        };
        return res.json(jsonResponse);
    }

    const challengesWithNoTrueSubmissions = await prisma.challenge.findMany({
        where: {
            NOT: {
                Submissions: {
                    some: {
                        AND: [
                            { user_id: userId },
                            { status: true },
                        ],
                    },
                },
            },
            OR: [
                {
                    Tagassign: {
                        some: {
                            Tag: {
                                tag_name: {
                                    contains: lowerInput,
                                },
                            },
                        },
                    },
                },
                {
                    challenge_title: {
                        contains: lowerInput,
                    },
                },
            ],
            points: {
                gte: gte,
                lte: lte,
            },
        },
        include: {
            Submissions: {
                where: {
                    user_id: userId,
                },
            },
            Tagassign: {
                include: {
                    Tag: true,
                },
            },
        },
        skip: page * limit,
        take: limit,
        orderBy: [{ created_at: "desc" }],
    });

    const count = await prisma.challenge.count({
        where: {
            NOT: {
                Submissions: {
                    some: {
                        AND: [
                            { user_id: userId },
                            { status: true },
                        ],
                    },
                },
            },
            OR: [
                {
                    Tagassign: {
                        some: {
                            Tag: {
                                tag_name: {
                                    contains: lowerInput,
                                },
                            },
                        },
                    },
                },
                {
                    challenge_title: {
                        contains: lowerInput,
                    },
                },
            ],
            points: {
                gte: gte,
                lte: lte,
            },
        },
    });


    const result = challengesWithNoTrueSubmissions.map((challenge: Challenge) => ({
        challenge_id: challenge.challenge_id,
        challenge_title: challenge.challenge_title,
        repo_link: challenge.repo_link.substring(19),
        points: challenge.points,
        total_test_Case: challenge.total_test_case,
        tags: challenge.Tagassign.slice(0, 3).map((tagAssign) => ({ // Limit to first 3 tags
            tag_id: tagAssign.Tag.tag_id,
            tag_name: tagAssign.Tag.tag_name.toLowerCase(),
        })),
    }));

    const paginationData: PaginationData = {
        page: page + 1,
        limit: limit,
        total: count,
        totalPages: Math.ceil(count / limit),
    };

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'Challenges fetched successfully',
        paginationData: paginationData,
        data: result,
    };
    return res.json(jsonResponse);
}