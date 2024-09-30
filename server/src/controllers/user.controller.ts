import express from 'express';
import axios from 'axios';
import { CLIENT_ID, CLIENT_SECRET } from '../config';
import { addUser, getLastSubmissions, getTotalPoints } from '../utils/user.utils';
import CustomError from '../utils/error.utils';
import { JsonResponse } from '../interfaces';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

export const getAccessToken = async (req: express.Request, res: express.Response) => {
    const param = '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + req.query.code;
    await fetch('http://github.com/login/oauth/access_token' + param, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then((response) => { return response.json() })
        .then((data) => {
            res.json(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export const getUserData = async (req: express.Request, res: express.Response) => {
    const auth = req.get('Authorization');
    if (auth === undefined) {
        return res.status(401).send('Unauthorized');
    }

    const response = await axios.get('https://api.github.com/user', {
        headers: {
            'Authorization': auth,
        }
    });

    if (response.status == 200) {
        await addUser(response.data.id.toString());
        const user = await prisma.user.findFirst({
            where: {
                github_id: response.data.id.toString(),
            },
            include: {
                Role: true,
            },
        });

        if (!user) {
            throw new CustomError('User not found');
        }

        const totalPoints = await getTotalPoints(user.user_id);
        const submissionsHistory = await getLastSubmissions(user.user_id);

        const responseData = response.data;
        responseData.app_data = {
            user_id: user.user_id,
            role: user.Role.role_name,
            total_points: totalPoints,
            submissions_history: submissionsHistory,
        }
        const jsronResponse: JsonResponse = {
            success: true,
            message: 'User data fetched successfully',
            data: responseData,
        };
        return res.json(jsronResponse);
    }
    throw new CustomError('Failed to fetch user data');;
}

export const addUserData = async (req: express.Request, res: express.Response) => {
    const body = req.body;
    const githubId = body.github_id;

    if (!githubId) {
        throw new CustomError('Github ID is required');
    }

    const userRole = await prisma.userRole.findFirst({
        where: {
            role_name: 'user'
        }
    });

    const searchUser = await prisma.user.findFirst({
        where: {
            github_id: githubId,
        }
    });

    if (searchUser) {
        return res.json({
            success: true,
            message: 'User already exists',
        })
    }

    const user = await prisma.user.create({
        data: {
            github_id: githubId,
            role_id: userRole.role_id,
        }
    });

    const jsonResponse: JsonResponse = {
        success: true,
        message: 'User added successfully',
        data: user,
    };
    return res.json(jsonResponse);
}