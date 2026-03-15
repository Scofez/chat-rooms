import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import { queryHandler } from '../lib/easy-auth';
import { useRoomStore } from '../store/useRoomStore';

interface Room {
    id: string;
    passwordHash: string | null;
    createdAt: Date;
    name: string;
    description: string | null;
    backgroundImage: string | null;
    isPrivate: boolean;
    inviteCode: string;
    creatorId: string;
    _count?: { members: number };
}

interface RoomResponse {
    room: Room;
    message: string;
}

export const CreateRoomModal = ({ open, onClose }: { open: boolean, onClose: () => void }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const addRoom = useRoomStore((state) => state.addRoom); // Grab only the action we need

  const handleSubmit = async () => {
    try {
      const response = await queryHandler.query<RoomResponse>('/room/create', 'POST', {
        name,
        description,
        isPrivate: false // Defaulting to public for now
      });
      addRoom(response.room);
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      console.error("Failed to create room", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create a New Room</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
        <TextField label="Room Name" fullWidth value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Description" fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};