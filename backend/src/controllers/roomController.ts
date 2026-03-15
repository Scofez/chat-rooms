import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import prisma from '../lib/prisma.js';

/**
 * Creates a new room
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, description, backgroundImage, isPrivate } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const roomHashedPassword = isPrivate && req.body.password ? await bcrypt.hash(req.body.password, 10) : null;
        const newRoom = await prisma.room.create({
            data:{
                name,
                description,
                backgroundImage,
                isPrivate: isPrivate ?? false,
                passwordHash: roomHashedPassword,
                creatorId: userId,
                members: {
                    create: {
                        userId
                    }
                },
                
            }
        });

        res.status(201).json({ message: 'Room created', room: {...newRoom, _count: { members: 1 }} });
    } catch (error) {
        res.status(500).json({ message: "Failed to create the room" , error });
    }
}

/**
 * Joins a room by invite code
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const joinByInvite = async (req: Request, res: Response) => {
    try {
        const { inviteCode, password } = req.body;
        const userId = req.user?.userId;
        const room = await prisma.room.findUnique({ where: { inviteCode }});
        //validations
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        if (!room) {
            res.status(404).json({ message: 'Room not found' });
            return;
        }
        if (room.isPrivate && room.passwordHash) {
            if (!password) {
                res.status(401).json({ message: 'Password required' }) 
                return;
            };
            
            const valid = await bcrypt.compare(password, room.passwordHash);
            if (!valid) return res.status(401).json({ message: 'Invalid room password' });
        }

        // We are using upsert to prevent duplication of members
        await prisma.roomMember.upsert({
            where: { userId_roomId: { userId, roomId: room.id } },
            update: {}, // Do nothing if already exists
            create: { userId, roomId: room.id }
        });
        res.status(200).json({ message: 'User has joined the room successfully', roomId: room.id });
    } catch (error) {
        res.status(500).json({ message: "Failed to join the room" , error });
    }
}

/**
 * Gets all members of a room
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const getRoomMembers = async (req: Request, res: Response) => {
    try {
        const { roomId } = req.params;
        if (!roomId) {
            res.status(400).json({ message: 'Missing room id' });
            return;
        }
        const members = await prisma.roomMember.findMany({
            where: { roomId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        profileImage: true
                    }
                }
            }
        });
        res.status(200).json(members.map(({ user }) => user));
    } catch (error) {
        res.status(500).json({ message: "Failed to get room members" , error });
    }
}

/**
 * Gets all public rooms
 * 
 * @param {Request} req the request object
 * @param {Response} res the response object
 */
export const getPublicRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await prisma.room.findMany({
            where: { isPrivate: false },
            include: {
                _count: {
                    select: { members: true } // count of people inside a room
                }
            }
        });
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch rooms", error });
    }
}