// User model in database
export interface User {
    id: string;
    username: string;
    passwordHash: string;
    profileImage?: string;
    createdAt: Date;
}

// User model in database
export interface Room {
    id: string;
    name: string;
    description?: string;
    backgroundImage?: string;
    creatorId: string;
    participantCount: number;
    isPrivate?: boolean;
}

export interface UserPayload {
    userId: string;
    username: string;
}