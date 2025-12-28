import express from 'express';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';


const app = express();

const PORT = process.env.PORT || 4000;

// Middleware to handle CORS
app.use(cors());
// Middleware to parse JSON
app.use(express.json());
//Routes
app.use('/security', authRoutes);
app.use('/room', roomRoutes);

app.use('/status', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
