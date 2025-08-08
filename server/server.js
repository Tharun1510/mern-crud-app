import express from 'express';
import todoRoutes from './routes/todoRoutes.js';
import connectDB from './config/db.js';
import cors from 'cors';
connectDB();
const app = express();
const allowedOrigins = [
    'http://localhost:5173',
    'https://mern-crud-app-henna-one.vercel.app' // Add your live frontend URL here
];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use('/api', todoRoutes);
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
