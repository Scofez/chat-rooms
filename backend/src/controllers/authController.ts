import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { generateToken } from '../middleware/authMiddleware.js';
import prisma from '../lib/prisma.js';

/**
 * Registers a new user
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (existingUser) {
            res.status(400).json({ message: 'Username already exists' });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({ data: { username, passwordHash } });
        const token = generateToken({ userId: newUser.id, username });
        res.status(201).json({ message: 'User created', token});

    } catch (error) {
        res.status(500).json({ message: "Something went wrong on the server" , error });
    }
};

/**
 * Logs in a user
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        //Adding checks on strings but I'll handle this in the frontend
        if (!username || !password) {
            res.status(400).json({ message: 'Missing username or password' });
            return;
        }
        //Check if user exists
        const user = await prisma.user.findUnique({ where: { username }});
        if (!user) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }
        //Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }
        const token = generateToken({ userId: user.id, username: user.username });
        res.status(200).json({ message: 'Login successful', token});
    } catch (error) {
        res.status(500).json({ message: "Something went wrong on the server" , error });
    }
}