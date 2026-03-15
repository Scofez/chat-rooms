import { useEffect, useState, type FC } from 'react';
import { queryHandler } from '../lib/easy-auth';
import { useRoomStore } from '../store/useRoomStore';
import { Box, Typography, Button, Card, TextField, Grid, CircularProgress } from '@mui/material';
import { CreateRoomModal } from './CreateRoomModal'; // We'll create this next

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
_count?: { members: number }; // Optional count of members

}

export const ChatDashboard: FC = () => {
  const { rooms, setRooms, isLoading, setIsLoading } = useRoomStore();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchRooms = async () => {
    setIsLoading(true);
    try {
      const data = await queryHandler.query<Room[]>('/room/public', 'GET');
      setRooms(data); 
    } catch (err) {
      console.error("Failed to load rooms", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinByInvite = async () => {
    try {
      await queryHandler.query('/room/join', 'POST', { inviteCode });
      setInviteCode('');
      fetchRooms(); // Refresh the global store list
    } catch (err) {
    console.error("Failed to join room", err);
      alert("Invalid code or already a member");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  if (isLoading) return (
    <Box display="flex" justifyContent="center" mt={10}><CircularProgress /></Box>
  );

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Chat Rooms</Typography>
        <Button variant="contained" color="primary" onClick={() => setIsModalOpen(true)}>
          + Create Room
        </Button>
      </Box>
      
      {/* Join Section */}
      <Box display="flex" gap={2} mb={4}>
        <TextField 
          label="Invite Code" 
          size="small"
          value={inviteCode} 
          onChange={(e) => setInviteCode(e.target.value)} 
        />
        <Button variant="outlined" onClick={handleJoinByInvite}>Join Room</Button>
      </Box>

      {/* Room List - Using Grid2 for MUI v6 compatibility */}
      <Grid container spacing={3}>
        {rooms.map(room => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={room.id}>
            <Card sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h6">{room.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {room.description || "No description provided."}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" display="block" mb={1}>
                  Members: {room._count?.members ?? 0}
                </Typography>
                <Button fullWidth variant="contained" size="small">Open Chat</Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* The Modal */}
      <CreateRoomModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </Box>
  );
};