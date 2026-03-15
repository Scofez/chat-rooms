import { create } from 'zustand';

interface Room {
    id: string;
    name: string;
    description: string | null;
    backgroundImage: string | null;
    isPrivate: boolean;
    passwordHash: string | null;
    inviteCode: string;
    createdAt: Date;
    creatorId: string;
    _count?: { members: number };
}

interface RoomStore {
    rooms: Room[];
    isLoading: boolean;
    setRooms: (rooms: Room[]) => void;
    addRoom: (room: Room) => void;
    setIsLoading: (status: boolean) => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
    rooms: [],
    isLoading: false,
    setRooms: (rooms: Room[]) => set({ rooms }),
    addRoom: (room: Room) => set((state) => ({ rooms: [...state.rooms, room] })),
    setIsLoading: (status: boolean) => set({ isLoading: status }),
    
}));