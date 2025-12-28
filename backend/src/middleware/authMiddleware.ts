import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { UserPayload } from "../types/models.js";

const JWT_SECRET = process.env.JWT_SECRET || '@12354//eji;wcl&&2341!xweloveleague';

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

/**
 * Middleware to authenticate user token
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 * @param {NextFunction} next the next function
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decodedUserPayload = jwt.verify(token, JWT_SECRET) as UserPayload;
        req.user = decodedUserPayload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized', error });
    }
}

/**
 * Generates a JWT token for a user
 * 
 * @param {UserPayload} user the user to generate a token for
 * 
 * @returns {string} the generated token
 */
export const generateToken = (user: UserPayload): string => {
    return jwt.sign(user, JWT_SECRET, { expiresIn: '24h' });
}