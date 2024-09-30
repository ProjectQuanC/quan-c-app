import CustomError from './error.utils';
import { getPassedTestCaseList } from './misc.utils';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const addUser = (githubId: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!githubId) {
            return reject(new CustomError('Github ID is required'));
        }

        prisma.userRole.findFirst({
            where: {
                role_name: 'user'
            }
        }).then((userRole: { role_id: any; }) => {
            if (!userRole) {
                throw new CustomError('User role not found');
            }

            return prisma.user.findFirst({
                where: {
                    github_id: githubId,
                }
            }).then((searchUser: any) => {
                if (searchUser) {
                    return resolve(); // User already exists, resolve without creating
                }

                return prisma.user.create({
                    data: {
                        github_id: githubId,
                        role_id: userRole.role_id,
                    }
                }).then((user: any) => {
                    resolve();
                });
            });
        }).catch((error: any) => {
            reject(error);
        });
    });
}


async function getTotalPoints(userId: string) {
    const submissions = await prisma.submission.findMany({
        where: {
            user_id: userId,
            status: true, // Only count completed challenges
        },
        orderBy: {
            created_at: 'asc', // Order by the creation date to get the earliest one
        },
        distinct: ['challenge_id'], // Ensure only the first submission per challenge is considered
        include: {
            Challenge: {
                select: {
                    points: true,
                },
            },
        },
    });

    if (!submissions) {
        return 0;
    }

    const totalPoints: number = submissions.reduce((acc: number, submission: any) => {
        return acc + submission.Challenge.points;
    }, 0);

    return totalPoints;
}

async function getLastSubmissions(userId: string) {
    const submissions = await prisma.submission.findMany({
        where: {
            user_id: userId,
        },
        orderBy: {
            created_at: 'desc',
        },
        take: 5,
        include: {
            Challenge: {
                select: {
                    challenge_title: true,
                    points: true,
                    total_test_case: true,
                    repo_link: true,
                },
            },
        },
    });

    if (!submissions) {
        return [];
    }

    return submissions.map((submission: any) => ({
        challengeId: submission.challenge_id,
        repoLink: submission.Challenge.repo_link,
        challengeTitle: submission.Challenge.challenge_title,
        status: submission.status,
        passedTestCaseValue: submission.passed_test_case_value,
        passedTestCaseCount: getPassedTestCaseList(submission.Challenge.total_test_case, submission.passed_test_case_value).length,
        totalTestCase: submission.Challenge.total_test_case,
        challengePoints: submission.Challenge.points,
        createdAt: submission.created_at,
    }));
}

async function getGithubDatabyId(githubId: string, auth: string | undefined) {
    const axios = require('axios');
    const response = await axios.get(`https://api.github.com/user/${githubId}`, {
        headers: {
            Authorization: auth,
        }
    });

    // const response = await axios.get(`https://api.github.com/user/${githubId}`);

    return response.data;
}

export {
    addUser,
    getTotalPoints,
    getLastSubmissions,
    getGithubDatabyId
}