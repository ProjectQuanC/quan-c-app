import express from 'express';
import CustomError from '../utils/error.utils';
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const auth = req.get('Authorization');
    if (auth === undefined) {
        throw new CustomError('Unauthorized');
    }

    const response = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': auth,
        }
    });

    if (!response.ok) {
        throw new CustomError('Failed to fetch user data');
    }
    const githubId = (await response.json()).id;
    const user = await prisma.user.findFirst({
        where: {
            github_id: githubId.toString()
        }
    });
    req.body.userId = user.user_id;
    return next();
}

const roleMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user_id = req.body.userId;

    const user = await prisma.user.findFirst({
        where: {
            user_id: user_id,
        },
        include: {
            Role: true,
        },
    });

    if (user.Role.role_name !== 'admin') {
        throw new CustomError('Unauthorized');
    }
    return next();
}

export {
    authMiddleware,
    roleMiddleware
}